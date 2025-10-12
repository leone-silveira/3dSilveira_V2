import { useState, useEffect } from "react";

const Relogio = () => {
  const [hora, setHora] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const intervalo = setInterval(() => {
      setHora(new Date().toLocaleTimeString());
    }, 1000); // Atualiza a cada 1 segundo

    return () => clearInterval(intervalo); // Limpa o intervalo ao desmontar
  }, []);

  return <h2>Hora Atual: {hora}</h2>;
};

export default Relogio;