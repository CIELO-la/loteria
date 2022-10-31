import { barajar } from "../../utils/deckManagement";

const Cabecera = ({ t, cartas }) => {

  const styleList = ["midRight", "lowLeft", "up", "lowRight", ""];

  const logoCards = barajar([...Object.values(cartas)]).slice(0,9).map(
    (selectedCard, i) => (
      <img
        className={`logoCarta ${styleList[i % styleList.length]} background-${selectedCard.color}-vivid`}
        src={selectedCard.imagen}
        alt={selectedCard.nombre}
        key={i}
      />
  ));

  return (
    <div className="cabecera">
      <img className="logo" src={`/${process.env.PUBLIC_URL}/¡Loteria!.svg`} alt={t("titulo")} />
      <div className="logoCards">{logoCards}</div>
      <div className="placeholderCard" />
    </div>
  );
};

export default Cabecera;
