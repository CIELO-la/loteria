import { useTranslation } from "react-i18next";
import { barajas } from "../../Loteria/barajas";

const Cabecera = () => {
  const { t } = useTranslation();

  const styleList = ["midRight", "lowLeft", "up", "lowRight", ""];

  const allCards = [...Object.keys(barajas.es01.cartas)];

  var logoCards = [];
  for (var i = 0; i < 9; i++) {
    const selectedCardNum = Math.floor(Math.random() * allCards.length);
    const selectedCard = barajas.es01.cartas[allCards[selectedCardNum]];
    logoCards.push(
      <img
        className={`logoCarta ${styleList[i % styleList.length]}`}
        src={selectedCard.imagen}
        alt={selectedCard.nombre}
        key={i}
      />
    );
  }

  return (
    <div className="cabecera">
      <img className="logo" src="/¡Loteria!.svg" alt={t("titulo")} />
      <div className="logoCards">{logoCards}</div>
      <div className="placeholderCard" />
    </div>
  );
};

export default Cabecera;
