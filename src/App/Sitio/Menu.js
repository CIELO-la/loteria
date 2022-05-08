import { useHistory } from "react-router-dom";
import { v4 as uuid4 } from "uuid";
import { useTranslation } from "react-i18next";
import Idiomas from "./Idiomas";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Row from "react-bootstrap/Row";

const Menu = ({
  hostGame,
  joinGame,
  gameId,
  handleBarajaIdInput,
  handleGameIdInput,
  barajaId,
  barajas,
}) => {
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

  const baraja = barajas[barajaId];

  return (
    <div class="menu">
      <Row>
        <Button onClick={(e) => goToHostingScreen(e)} className="col-4">
          {t("crearJuego")}
        </Button>
      </Row>
      <Row>
        <DropdownButton
          variant="light"
          title={`${t("baraja")}: ${baraja.nombre}`}
        >
          {Object.entries(barajas).map(([bId, bObj]) => (
            <Dropdown.Item
              key={bId}
              value={bId}
              onClick={() => handleBarajaIdInput(bId)}
            >
              {bObj.nombre}
            </Dropdown.Item>
          ))}
        </DropdownButton>
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
