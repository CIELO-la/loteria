import { useHistory } from "react-router-dom";
import { v4 as uuid4 } from "uuid";
import { useTranslation } from "react-i18next";
import Idiomas from "./Idiomas";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";

const Menu = ({ hostGame, joinGame, gameId, handleGameIdInput }) => {
  const { t } = useTranslation();
  const history = useHistory();

  // temp gameId if hosting a new game
  const newGameId = uuid4();

  // const [isJoining, setJoining] = useState(false);
  // const prepareJoin = e => {
  // 	e.preventDefault();
  // 	setJoining(!isJoining);
  // };

  function goToHostingScreen(event) {
    history.push(`/${newGameId}`);
    hostGame(event, newGameId);
  }

  return (
    <div>
      <Row>
        <Button onClick={(e) => goToHostingScreen(e)} className="col-4">
          {t("crearJuego")}
        </Button>
      </Row>
      <Row>
        <Button variant="secondary" className="col-4">
          {/* TODO actually implement this */}
          {t("imprimir")}
        </Button>
      </Row>
      <Row>
        <Button variant="info" href="https://mycielo.org/" className="col-4">
          {t("cielo")}
        </Button>
      </Row>

      <Idiomas />
    </div>
  );
};

export default Menu;
