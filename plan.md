12/05/2026
● Pronto. O backend está com --reload, então a mudança já deve ter recarregado.

  O que vai acontecer no seu teste atual (AddItemIntent com item="bananas" e quantity="3"):
  - _find_stock tenta bananas (exato), depois banana — nenhum dos dois existe em stock_foods (só Rice e Olive Oil no seed)
  - Cria um novo StockFood: nome Bananas, food_type="Outros", quantity=3, unit="un"
  - Alexa responde: "Criei bananas no estoque com 3 unidades."

  Se você disser de novo "adicione 3 bananas", aí ele acha o item criado e incrementa para 6.

  Pontos que talvez você queira ajustar depois:
  - unit="un" fixo: itens criados por voz ficam em unidades. Pra arroz/óleo isso fica errado — você corrige pelo frontend ou cria um slot de
  unidade no Alexa.
  - Sem usuário/sessão: o stock é global, não amarrado ao userId da Alexa. Se quiser multi-conta, precisa de account linking.
  - Sem verificação de assinatura Alexa: qualquer um que descobrir a URL pública do ngrok pode mexer no estoque. Pra produção, valide o header
  Signature + SignatureCertChainUrl.

  Pode testar pelo simulador.




13/05/2026
  -----------------------------

    Vantagens dessa arquitetura
  - Cada cliente cria conta no seu sistema (como já faz), liga Alexa uma vez, e usa.
  - O accessToken chega em todo IntentRequest já — você não precisa fazer login por voz.
  - Reutiliza seu JWT atual (com expiração e refresh) sem reinventar auth.
  - Escala: stock isolado por user_id, sem possibilidade de um usuário ler/escrever no de outro.

  Ordem de execução recomendada

  1. Hoje: setar ALEXA_SKILL_ID em env (já está no código). Já reduz drasticamente a superfície. [LEONE: Feito]
  2. Esta semana: plugar ask-sdk-webservice-support pra validar assinatura. ~50 linhas.
  3. Quando for abrir pra outros usuários: migração user_id em StockFood + endpoints OAuth + Account Linking. Esse é trabalho de uns 2-3 dias
  dependendo de quão pronto seu fluxo de OAuth está.
  4. Bonus: rate limit no /alexa (ex.: 60 req/min por IP via slowapi) — defende contra flood mesmo de requests "válidos".