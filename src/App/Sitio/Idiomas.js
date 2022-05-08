import { useTranslation } from "react-i18next";
import Button from "react-bootstrap/Button";

// A language picker that allows users to change their UI language.
const Idiomas = () => {
  const { t, i18n } = useTranslation();

  return (
    <div className="idomas">
      <h3>{t("idiomas")}</h3>
      <Button variant="secondary" onClick={() => i18n.changeLanguage("es")}>
        Español
      </Button>
      <Button variant="secondary" onClick={() => i18n.changeLanguage("en")}>
        English
      </Button>
    </div>
  );
};

export default Idiomas;
