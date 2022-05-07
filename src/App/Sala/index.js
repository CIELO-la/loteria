import { useState, useEffect } from "react";
import { Link, useLocation, matchPath } from "react-router-dom";
import Cuadros from "../Juego/Cuadros";
import { useTranslation } from "react-i18next";

// TODO: handle or 404 cold joiners who lack g
const Sala = ({ g, jugadorId, estatusActual, registrar, iniciar }) => {
  const { t } = useTranslation();

  // lobby control flow
  const [isStarting, setStarting] = useState(false);
  const [isRegistering, setRegistering] = useState(false);

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
      setRegistering(true);
      await registrar(match.params.juegoIdParam);
    };
    registerOnLoad();
    return () => {};
  }, [g, registrar, location, isRegistering]);

  return (
    <div>
      {g && isRegistering ? (
        <>
          {/* Lobby if game instantiated and player registered */}
          <Cuadros jugadores={g.jugadores} />
          <p>
            {t("estatus")}: {estatusActual}
          </p>
          <div>
            <Link to="/juego" onClick={leaveLobbyStartGame}>
              {!isStarting ? (
                <button disabled={!g.isHost}>{t("hostIniciar")}</button>
              ) : (
                <button disabled>{t("iniciando")}</button>
              )}
            </Link>
          </div>
        </>
      ) : (
        <>
          {/* Wait for players to register*/}
          <p>Conectándose...</p>
        </>
      )}
    </div>
  );
};

export default Sala;
