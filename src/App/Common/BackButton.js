import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import Button from "react-bootstrap/Button";

// Renders a back button that returns to the main page.
const BackButton = ({ useSecondaryStyle = false, className = "" }) => {
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <Button
      variant={useSecondaryStyle ? "secondary" : "light"}
      size="sm"
      className={className}
      onClick={() => history.push("/")}
    >
      ← {t("Go back")}
    </Button>
  );
};

export default BackButton;
