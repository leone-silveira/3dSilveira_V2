import os
import re
import unicodedata
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from config.database import Settings
from database.dependency import get_db
from models.stock_foods import StockFood

router = APIRouter(tags=["alexa"])
settings = Settings()

# ID da skill no Alexa Developer Console. Sem isso qualquer pessoa que
# conheça a URL pode forjar POSTs para o endpoint.
ALEXA_SKILL_ID = settings.ALEXA_SKILL_ID
# Tolerância para replay (Amazon recomenda 150s).
ALEXA_TIMESTAMP_TOLERANCE = timedelta(seconds=150)


def _verify_alexa_request(body: dict) -> None:
    """Validações baratas que rejeitam tráfego forjado.
    Faltando ainda: verificação de assinatura via SignatureCertChainUrl (TODO).
    """
    app_id = (
        (body.get("session") or {})
        .get("application", {})
        .get("applicationId")
    ) or (
        (body.get("context") or {})
        .get("System", {})
        .get("application", {})
        .get("applicationId")
    )
    if not ALEXA_SKILL_ID:
        # Em dev, deixe passar — mas alerte no log para não esquecer em prod.
        print("[alexa] AVISO: ALEXA_SKILL_ID não configurado, endpoint sem proteção.")
    elif app_id != ALEXA_SKILL_ID:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid skill id")

    ts_raw = (body.get("request") or {}).get("timestamp")
    if ts_raw:
        try:
            ts = datetime.fromisoformat(ts_raw.replace("Z", "+00:00"))
        except ValueError:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, "Invalid timestamp")
        now = datetime.now(timezone.utc)
        if abs(now - ts) > ALEXA_TIMESTAMP_TOLERANCE:
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Stale request")


DEFAULT_REPROMPT = (
    "Você pode dizer: adicione 3 bananas, verifique bananas, "
    "remova 1 banana ou crie tomate. O que deseja?"
)


def _say(
    text: str,
    end_session: bool = False,
    reprompt: str | None = None,
    attributes: dict | None = None,
) -> dict:
    response: dict = {
        "outputSpeech": {"type": "PlainText", "text": text},
        "shouldEndSession": end_session,
    }
    if reprompt and not end_session:
        response["reprompt"] = {
            "outputSpeech": {"type": "PlainText", "text": reprompt}
        }
    return {
        "version": "1.0",
        "sessionAttributes": attributes or {},
        "response": response,
    }


def _strip_accents(text: str) -> str:
    return "".join(
        c for c in unicodedata.normalize("NFD", text)
        if unicodedata.category(c) != "Mn"
    )


def _plural_variants(name: str) -> list[str]:
    """Gera variantes singular/plural em português para tentar casar com o estoque."""
    n = name.lower()
    variants: set[str] = {name}

    # plural / singular simples
    if n.endswith("s") and len(n) > 2:
        variants.add(name[:-1])
    else:
        variants.add(name + "s")

    # ão ↔ ões / ães / ãos
    if n.endswith("ão"):
        base = name[:-2]
        variants.update([base + "ões", base + "ães", base + "ãos"])
    if n.endswith("ões") or n.endswith("ães"):
        variants.add(name[:-3] + "ão")

    # terminações l/r/z ↔ es
    if n.endswith(("r", "l", "z")):
        variants.add(name + "es")
    if n.endswith("is") and len(n) > 3:
        # animais → animal, papéis → papel
        variants.add(name[:-2] + "l")
    if n.endswith(("res", "zes")) and len(n) > 3:
        variants.add(name[:-2])

    return list(variants)


def _singular(name: str) -> str:
    """Tenta reduzir o nome a uma forma singular razoável para salvar no estoque."""
    n = name.lower()
    if n.endswith("ões") or n.endswith("ães"):
        return name[:-3] + "ão"
    if n.endswith("ais") or n.endswith("eis") or n.endswith("ois") or n.endswith("uis"):
        return name[:-2] + "l"
    if n.endswith(("res", "zes")) and len(n) > 3:
        return name[:-2]
    if n.endswith("s") and len(n) > 2:
        return name[:-1]
    return name


async def _find_stock(db: AsyncSession, raw_name: str) -> StockFood | None:
    name = (raw_name or "").strip()
    if not name:
        return None

    # 1) tenta cada variante com match exato (lower)
    for cand in _plural_variants(name):
        result = await db.execute(
            select(StockFood).where(func.lower(StockFood.name) == cand.lower())
        )
        item = result.scalars().first()
        if item:
            return item

    target_norm = _strip_accents(name.lower())
    target_singular = _strip_accents(_singular(name).lower())
    result = await db.execute(select(StockFood))
    for item in result.scalars().all():
        item_norm = _strip_accents((item.name or "").lower())
        if item_norm == target_norm or item_norm == target_singular:
            return item
        if _strip_accents(_singular(item.name or "").lower()) == target_singular:
            return item
    return None


_DIGIT_RE = re.compile(r"^\d+(?:[.,]\d+)?$")

_NUMBER_WORDS = {
    "um": 1, "uma": 1, "dois": 2, "duas": 2, "tres": 3,
    "quatro": 4, "cinco": 5, "seis": 6, "sete": 7, "oito": 8,
    "nove": 9, "dez": 10, "onze": 11, "doze": 12, "treze": 13,
    "catorze": 14, "quatorze": 14, "quinze": 15, "dezesseis": 16,
    "dezessete": 17, "dezoito": 18, "dezenove": 19, "vinte": 20,
    "meia": 0.5, "meio": 0.5, "uns": 1, "umas": 1,
}

_UNIT_WORDS = {
    "quilo": "kg", "quilos": "kg", "kilo": "kg", "kilos": "kg", "kg": "kg",
    "grama": "g", "gramas": "g",
    "litro": "l", "litros": "l",
    "mililitro": "ml", "mililitros": "ml", "ml": "ml",
    "unidade": "un", "unidades": "un", "item": "un", "itens": "un",
    "pacote": "pct", "pacotes": "pct",
    "duzia": "dz", "duzias": "dz",
    "caixa": "cx", "caixas": "cx",
    "lata": "lt", "latas": "lt",
    "garrafa": "gf", "garrafas": "gf",
}

_FILLER_WORDS = {"com", "de", "do", "da", "dos", "das", "e", "no", "na"}


def _parse_item_phrase(value: str) -> tuple[str, float | None, str | None]:
    """Extrai (nome, quantidade, unidade) de frases tipo
    'abacate com um item' / '5 maças' / '2 quilos de banana'.

    Conservador: só remove fillers/números/unidades do nome se identificou
    pelo menos um número ou unidade na frase. Caso contrário devolve o
    valor original intacto, para não mutilar nomes compostos legítimos."""
    if not value:
        return "", None, None

    tokens = re.findall(r"\d+(?:[.,]\d+)?|\S+", value)
    qty: float | None = None
    unit: str | None = None
    parts: list[tuple[str, str]] = []  # (categoria, palavra_original)
    found_modifier = False

    for tok in tokens:
        clean = tok.strip(".,;:!?¿¡")
        if not clean:
            continue
        lower = _strip_accents(clean.lower())
        if _DIGIT_RE.fullmatch(clean):
            qty = float(clean.replace(",", "."))
            found_modifier = True
            continue
        if lower in _NUMBER_WORDS:
            qty = _NUMBER_WORDS[lower]
            found_modifier = True
            continue
        if lower in _UNIT_WORDS:
            unit = _UNIT_WORDS[lower]
            found_modifier = True
            continue
        parts.append(("filler" if lower in _FILLER_WORDS else "name", clean))

    if found_modifier:
        cleaned = " ".join(w for kind, w in parts if kind == "name")
    else:
        cleaned = " ".join(w for _, w in parts)
    return cleaned.strip(), qty, unit


def _normalize_slots(slots: dict) -> dict:
    """Normaliza o slot 'item' extraindo qty/unit embutidos quando possível.
    Só sobrescreve quantity/unit se eles não foram enviados pela Alexa."""
    slots = dict(slots or {})
    item_slot = dict(slots.get("item") or {})
    item_value = (item_slot.get("value") or "").strip()
    if not item_value:
        return slots

    cleaned_name, parsed_qty, parsed_unit = _parse_item_phrase(item_value)
    if not cleaned_name:
        cleaned_name = item_value  # fallback se o parser zerou tudo

    if cleaned_name != item_value:
        item_slot["value"] = cleaned_name
        slots["item"] = item_slot

    if parsed_qty is not None:
        qty_slot = dict(slots.get("quantity") or {})
        if not qty_slot.get("value"):
            qty_slot["value"] = str(parsed_qty)
            slots["quantity"] = qty_slot

    if parsed_unit is not None:
        unit_slot = dict(slots.get("unit") or {})
        if not unit_slot.get("value"):
            unit_slot["value"] = parsed_unit
            slots["unit"] = unit_slot

    return slots


def _parse_quantity(slots: dict, default: float = 1.0) -> float:
    raw = (slots.get("quantity") or {}).get("value")
    if raw is None:
        return default
    try:
        q = float(str(raw).replace(",", "."))
        return q if q > 0 else default
    except (TypeError, ValueError):
        return default


def _get_item_name(slots: dict) -> str | None:
    raw = (slots.get("item") or {}).get("value")
    if not raw:
        return None
    cleaned = raw.strip()
    return cleaned or None


def _get_unit(slots: dict, default: str = "un") -> str:
    raw = (slots.get("unit") or {}).get("value")
    if not raw:
        return default
    cleaned = str(raw).strip()
    return cleaned or default


async def _create_item(
    db: AsyncSession, raw_name: str, qty: float, unit: str = "un"
) -> StockFood:
    singular = _singular(raw_name)
    new_item = StockFood(
        name=singular.capitalize(),
        food_type="Outros",
        quantity=qty,
        unit=unit,
    )
    db.add(new_item)
    await db.commit()
    await db.refresh(new_item)
    return new_item


async def _handle_add(db: AsyncSession, slots: dict) -> dict:
    item_name = _get_item_name(slots)
    if not item_name:
        return _say(
            "Não entendi qual item você quer adicionar. Pode repetir?",
            reprompt="Qual item você quer adicionar?",
        )
    qty = _parse_quantity(slots)
    unit = _get_unit(slots)

    stock = await _find_stock(db, item_name)
    if stock:
        stock.quantity = (stock.quantity or 0) + qty
        await db.commit()
        return _say(
            f"Adicionei {qty:g} {stock.unit} de {stock.name}. "
            f"Total agora: {stock.quantity:g}. Algo mais?",
            reprompt=DEFAULT_REPROMPT,
        )

    # item não existe — confirma criação
    return _say(
        f"Não encontrei {item_name} no estoque. "
        f"Quer que eu crie e adicione {qty:g} {unit}?",
        reprompt=f"Quer criar {item_name}? Responda sim ou não.",
        attributes={
            "pending_action": "create",
            "pending_item": item_name,
            "pending_qty": qty,
            "pending_unit": unit,
        },
    )


async def _handle_remove(db: AsyncSession, slots: dict) -> dict:
    item_name = _get_item_name(slots)
    if not item_name:
        return _say(
            "Não entendi qual item você quer remover. Pode repetir?",
            reprompt="Qual item você quer remover?",
        )
    qty = _parse_quantity(slots)

    stock = await _find_stock(db, item_name)
    if not stock:
        return _say(
            f"Não encontrei {item_name} no estoque. Algo mais?",
            reprompt=DEFAULT_REPROMPT,
        )

    current = stock.quantity or 0
    if current <= 0:
        return _say(
            f"{stock.name} já está zerado no estoque. Algo mais?",
            reprompt=DEFAULT_REPROMPT,
        )

    new_qty = max(0.0, current - qty)
    removed = current - new_qty
    stock.quantity = new_qty
    await db.commit()
    return _say(
        f"Removi {removed:g} {stock.unit} de {stock.name}. "
        f"Restam {new_qty:g}. Algo mais?",
        reprompt=DEFAULT_REPROMPT,
    )


async def _handle_check(db: AsyncSession, slots: dict) -> dict:
    item_name = _get_item_name(slots)
    if not item_name:
        return _say(
            "Qual item você quer verificar?",
            reprompt="Diga o nome do item que quer verificar.",
        )

    stock = await _find_stock(db, item_name)
    if not stock:
        return _say(
            f"Não encontrei {item_name} no estoque. Quer que eu crie?",
            reprompt=f"Quer criar {item_name}? Responda sim ou não.",
            attributes={
                "pending_action": "create",
                "pending_item": item_name,
                "pending_qty": 1.0,
                "pending_unit": "un",
            },
        )

    qty = stock.quantity or 0
    if qty <= 0:
        return _say(
            f"{stock.name} está zerado no estoque. Algo mais?",
            reprompt=DEFAULT_REPROMPT,
        )
    return _say(
        f"Você tem {qty:g} {stock.unit} de {stock.name}. Algo mais?",
        reprompt=DEFAULT_REPROMPT,
    )


async def _handle_create(db: AsyncSession, slots: dict) -> dict:
    item_name = _get_item_name(slots)
    if not item_name:
        return _say(
            "Qual item você quer criar?",
            reprompt="Diga o nome do item que quer criar.",
        )
    qty = _parse_quantity(slots, default=1.0)
    unit = _get_unit(slots)

    existing = await _find_stock(db, item_name)
    if existing:
        return _say(
            f"{existing.name} já existe com {existing.quantity:g} {existing.unit}. "
            f"Quer adicionar mais {qty:g}?",
            reprompt=f"Adicionar mais {qty:g} de {existing.name}? Sim ou não.",
            attributes={
                "pending_action": "add_existing",
                "pending_item": existing.name,
                "pending_qty": qty,
            },
        )

    created = await _create_item(db, item_name, qty, unit=unit)
    return _say(
        f"Criei {created.name} no estoque com {qty:g} {created.unit}. Algo mais?",
        reprompt=DEFAULT_REPROMPT,
    )


async def _handle_yes(db: AsyncSession, attrs: dict) -> dict:
    action = attrs.get("pending_action")
    item_name = attrs.get("pending_item")
    try:
        qty = float(attrs.get("pending_qty") or 1.0)
    except (TypeError, ValueError):
        qty = 1.0
    unit = (attrs.get("pending_unit") or "un").strip() or "un"

    if action == "create" and item_name:
        created = await _create_item(db, item_name, qty, unit=unit)
        return _say(
            f"Pronto. Criei {created.name} com {qty:g} {created.unit}. Algo mais?",
            reprompt=DEFAULT_REPROMPT,
        )

    if action == "add_existing" and item_name:
        stock = await _find_stock(db, item_name)
        if stock:
            stock.quantity = (stock.quantity or 0) + qty
            await db.commit()
            return _say(
                f"Adicionei {qty:g} {stock.unit} de {stock.name}. "
                f"Total agora: {stock.quantity:g}. Algo mais?",
                reprompt=DEFAULT_REPROMPT,
            )

    # "sim" sem nada pendente = usuário quer continuar usando
    return _say(
        "Claro. O que deseja fazer?",
        reprompt=DEFAULT_REPROMPT,
    )


def _handle_no(attrs: dict) -> dict:
    # "não" durante uma confirmação pendente = cancela a ação, mantém sessão
    if attrs.get("pending_action"):
        return _say(
            "Tudo bem, cancelei. Algo mais?",
            reprompt=DEFAULT_REPROMPT,
        )
    # "não" em resposta a "algo mais?" = encerra
    return _say("Até mais.", end_session=True)


@router.post("/alexa")
async def alexa(request: Request, db: AsyncSession = Depends(get_db)):
    try:
        body = await request.json()
    except Exception:
        body = {}

    _verify_alexa_request(body)

    session = body.get("session") or {}
    attrs = session.get("attributes") or {}
    req = body.get("request") or {}
    req_type = req.get("type")

    # Account Linking (futuro): se a skill tiver Account Linking habilitado,
    # o token do usuário vem em session.user.accessToken. Aqui você decodifica
    # o JWT, mapeia para o user_id, e escopa todas as queries do StockFood
    # por user. Enquanto não estiver configurado, fica como um warning.
    # access_token = (session.get("user") or {}).get("accessToken")
    # if not access_token:
    #     return _say(
    #         "Para usar o estoque você precisa conectar sua conta. "
    #         "Abra o app Alexa e faça o login.",
    #         end_session=True,
    #     )  # idealmente: response.card = {"type": "LinkAccount"}

    print(
        "[alexa] type=", req_type,
        " intent=", (req.get("intent") or {}).get("name"),
        " slots=", (req.get("intent") or {}).get("slots"),
        " attrs=", attrs,
    )

    if req_type == "LaunchRequest":
        return _say(
            "Estoque aberto"
            "O que deseja fazer?",
            reprompt=DEFAULT_REPROMPT,
        )

    if req_type == "SessionEndedRequest":
        return _say("", end_session=True)

    if req_type == "IntentRequest":
        intent = req.get("intent") or {}
        raw_name = intent.get("name") or ""
        name = raw_name.strip()
        short = name.split(".")[-1].lower()  # "amazon.yesintent" → "yesintent"
        slots = _normalize_slots(intent.get("slots") or {})

        if short == "additemintent":
            return await _handle_add(db, slots)
        if short == "removeitemintent":
            return await _handle_remove(db, slots)
        if short == "checkitemintent":
            return await _handle_check(db, slots)
        if short == "createitemintent":
            return await _handle_create(db, slots)

        if short in ("yesintent", "simintent"):
            return await _handle_yes(db, attrs)
        if short in ("nointent", "naointent", "nãointent"):
            return _handle_no(attrs)

        # Workaround: enquanto AMAZON.YesIntent não está reconhecendo "sim"
        # no modelo, o HelloWorldIntent (template padrão) acaba captando.
        # Se existe uma confirmação pendente, tratamos como "sim".
        # TODO: remover depois de corrigir o interaction model no console.
        if short == "helloworldintent" and attrs.get("pending_action"):
            return await _handle_yes(db, attrs)

        if short == "helpintent":
            return _say(
                "Você pode dizer: adicione 3 bananas, remova 2 bananas, "
                "verifique bananas ou crie tomate. O que deseja?",
                reprompt=DEFAULT_REPROMPT,
                attributes=attrs,
            )
        if short == "cancelintent":
            return _say(
                "Ok, cancelei. Algo mais?",
                reprompt=DEFAULT_REPROMPT,
            )
        if short == "stopintent":
            return _say("Até mais.", end_session=True)
        if short == "fallbackintent":
            return _say(
                "Não entendi. Tente: adicione 3 bananas, remova 2, "
                "verifique ou crie um item. Ou diga sim ou não se eu perguntei algo.",
                reprompt=DEFAULT_REPROMPT,
                attributes=attrs,
            )

        print(f"[alexa] intent não tratado: {raw_name!r}")

    return _say(
        "Desculpe, não entendi. O que deseja fazer?",
        reprompt=DEFAULT_REPROMPT,
        attributes=attrs,
    )
