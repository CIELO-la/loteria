import { useTranslation } from "react-i18next";
import Row from "react-bootstrap/Row";
import BackButton from "../Common/BackButton";
import Button from "react-bootstrap/Button";
import { useHistory } from "react-router-dom";

const Download = ({}) => {
  const { t } = useTranslation();
  const history = useHistory();

  // TODO: find a better way to update the background color on this page
  document.body.style.backgroundColor = "#FEECE9"

  const handleDeckDowndload = () => {
    history.push(`/PrintDeck`);
  }

  return (
    <div className="downloadPage">
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
      <Row className="mt-4">
        <div className="downloadSection">
        <img src="/baraja.svg" alt={t("baraja")} />
          <div className="downloadSectionLabel">
              Deck of 54 cards
          </div>
          <Button className="downloadButton" variant="secondary" size="m" onClick={handleDeckDowndload}>
            Download
          </Button>
        </div>
      </Row>
      <Row className="mt-4">
        <div className="downloadSection">
        <img src="/tablas.svg" alt={t("tablas")} />
          <div className="downloadSectionLabel">
              Player boards
          </div>
          <input type="number" defaultValue="4" min="1" max="10" className="boardCountInput"
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
            />
          <Button className="downloadButton" variant="secondary" size="m">
            Download
          </Button>
        </div>
      </Row>
    </div>
  );
};

export default Download;
