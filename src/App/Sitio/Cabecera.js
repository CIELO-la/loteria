import { useTranslation } from "react-i18next";

const Cabecera = () => {
  const { t } = useTranslation();

  return (
    <div className="cabecera">
      <img className="logo" src="/¡Loteria!.png" alt={t("titulo")} />
    </div>
  );
};

export default Cabecera;
