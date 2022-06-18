import { useTranslation } from "react-i18next";
import Row from "react-bootstrap/Row";
import BackButton from "../Common/BackButton";

const Download = ({}) => {
  const { t } = useTranslation();

  // TODO: update the background color on this page

  return (
    <div className="">
      <Row>
        <div className="col-2 salaBackCol">
          <BackButton />
        </div>
        <div className="col-10" />
      </Row>
      <Row>
        <div className="prompt justify-content-center">
          {t('downloadPrompt')}
        </div>
      </Row>
    </div>
  );
};

export default Download;
