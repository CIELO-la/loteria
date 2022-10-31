import { useTranslation } from "react-i18next";
import Row from "react-bootstrap/Row";
import BackButton from "../Common/BackButton";
import Button from "react-bootstrap/Button";
import { useHistory } from "react-router-dom";
import { useState } from 'react'

const Download = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [boardCount, setBoardCount] = useState(4)
  // TODO: find a better way to update the background color on this page
  document.body.style.backgroundColor = "#FEECE9"

  const handleDeckDowndload = () => {
    history.push(`/PrintDeck`);
  }

  const handleBoardsDowndload = () => {
    history.push(`/PrintBoards/${boardCount}`);
  }

  const handleChange = (e) => {
    setBoardCount(e.target.value)
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
        <img src={`${process.env.PUBLIC_URL}/baraja.svg`} alt={t("baraja")} />
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
        <img src={`${process.env.PUBLIC_URL}/tablas.svg`} alt={t("tablas")} />
          <div className="downloadSectionLabel">
              Player boards
          </div>
          <input type="number" defaultValue={boardCount} min="1" max="10" className="boardCountInput"
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
              onChange={handleChange}
            />
          <Button className="downloadButton" variant="secondary" size="m" onClick={handleBoardsDowndload}>
            Download
          </Button>
        </div>
      </Row>
    </div>
  );
};

export default Download;
