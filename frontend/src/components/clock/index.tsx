import { useState, useEffect } from "react";

const Relogio = () => {
  const [hora, setHora] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const intervalo = setInterval(() => {
      setHora(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(intervalo);
  }, []);

  return <h2>Hora Atual: {hora}</h2>;
};

export default Relogio;