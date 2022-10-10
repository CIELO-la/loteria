import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";

// Renders a back button that returns to the main page.
const BackButton = ({ useSecondaryStyle = false, className = "" }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Button
      variant={useSecondaryStyle ? "secondary" : "light"}
      size="sm"
      className={className}
      onClick={() => navigate("/")}
    >
      ← {t("back")}
    </Button>
  );
};

export default BackButton;
