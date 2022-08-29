import { useState, useEffect } from "react";
import { useLocation, matchPath, useHistory } from "react-router-dom";
import Cuadros from "../Juego/Cuadros";
import BackButton from "../Common/BackButton";
import { useTranslation } from "react-i18next";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";

// TODO: handle or 404 cold joiners who lack g
const Sala = ({ g, jugadorId, estatusActual, registrar, iniciar }) => {
  const { t } = useTranslation();
  const history = useHistory();

  // lobby control flow
  const [isStarting, setStarting] = useState(false);
  const [isRegistering, setRegistering] = useState(false);
  const [salaCode, setSalaCode] = useState(0);

  // uri for path matching
  const location = useLocation();

  // move to game startup
  const leaveLobbyStartGame = (e) => {
    e.preventDefault();
    if (!g.isHost) {
      return;
    }
    // pre-game starting state (NOTE: currently for host only)
    setStarting(true);
    // message status so players route to /juego
    setTimeout(iniciar, 2000);
    history.push("/juego");
  };

  const copyRoomUrl = (e) => {
    var roomUrl = document.URL;
    navigator.clipboard
      .writeText(roomUrl)
      .then(() => {
        alert(t("salaUrlCopy"));
      });
  };

  // immediately register players from uri
  useEffect(() => {
    if (!g || isRegistering) {
      return;
    }
    const registerOnLoad = async () => {
      const match = matchPath(location.pathname, {
        path: "/:juegoIdParam",
        exact: true,
        strict: false,
      });
      setSalaCode(match.params.juegoIdParam);
      setRegistering(true);
      await registrar(match.params.juegoIdParam);
    };
    registerOnLoad();
    return () => {};
  }, [g, registrar, location, isRegistering]);

  return (
    <div>
      <Row>
        <div className="col-2 salaBackCol">
          <BackButton />
        </div>
        <div className="col-10" />
      </Row>
      {g && isRegistering ? (
        <>
          {/* Lobby if game instantiated and player registered */}
          <div>
            <div className="sala-header">{t("salaHeader")}</div>
            <div className="sala-subtitle">
              {g.isHost ? t("salaHost") : t("salaPlayer")}
            </div>
          </div>
          <div className="sala-code col-4">
            <a onClick={copyRoomUrl}>{t("salaCode")} {salaCode}</a>
          </div>
          <Cuadros jugadores={g.jugadores} />
          <div>
            {!isStarting ? (
              <Button
                disabled={!g.isHost}
                className="col-4"
                onClick={leaveLobbyStartGame}
              >
                {t("hostIniciar")}
              </Button>
            ) : (
              <Button disabled className="col-4">
                {t("iniciando")}
              </Button>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Wait for players to register*/}
          <p>Conectándose...</p>
        </>
      )}
      <div className="debug">
        {t("estatus")}: {estatusActual}
      </div>
    </div>
  );
};

export default Sala;
