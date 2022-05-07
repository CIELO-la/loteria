import { useTranslation } from "react-i18next";

const Pie = () => {
  const { t } = useTranslation();

  return (
    <div className="pie">
      <a href="https://mycielo.org/">{t("cielo")}</a>
    </div>
  );
};

export default Pie;
