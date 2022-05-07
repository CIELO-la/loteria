import { useTranslation } from "react-i18next";

// A language picker that allows users to change their UI language.
const Idiomas = () => {
  const { t, i18n } = useTranslation();

  return (
    <div className="idomas">
      <h3>{t("idiomas")}</h3>
      <button onClick={() => i18n.changeLanguage("es")}>es</button>
      <button onClick={() => i18n.changeLanguage("en")}>en</button>
    </div>
  );
};

export default Idiomas;
