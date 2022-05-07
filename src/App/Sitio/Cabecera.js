import { useTranslation } from "react-i18next";

const Cabecera = () => {
  const { t } = useTranslation();

  return (
    <div className="cabecera">
      <div className="titulo">{t("titulo")}</div>
      <div className="subtitulo">{t("subtitulo")}</div>
    </div>
  );
};

export default Cabecera;
