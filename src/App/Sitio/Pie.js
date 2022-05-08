import { useTranslation } from "react-i18next";
import Button from 'react-bootstrap/Button';

const Pie = () => {
  const { t } = useTranslation();

  return (
    <div className="pie">
      <Button variant="info" href="https://mycielo.org/">{t("cielo")}</Button>
    </div>
  );
};

export default Pie;
