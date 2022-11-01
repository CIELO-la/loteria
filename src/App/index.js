import React, { useState, useEffect } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import Cabecera from "./Sitio/Cabecera";
import Container from "react-bootstrap/Container";
import Menu from "./Sitio/Menu";
import Busqueda from "./Busqueda";
import Sala from "./Sala";
import Juego from "./Juego";
import Download from "./Download";
import PrintDeck from "./PrintDeck";
import PrintBoards from "./PrintBoards";
import Cantor from "../Loteria";
import BarajaButton from "./Sitio/BarajaButton";
import { barajas } from "../Loteria/barajas";
import { estatus } from "../Loteria/estatus";
import { useLocalStorage } from "../utils/localStorage";
import { v4 as uuid4 } from "uuid";
import { useTranslation } from "react-i18next";
import "./styles.css";

// flujo:
// - App.js <-> Juego.js
// 		(- barajas, estatus)
// 		- Menú -> Búsqueda, Sala
// 		- BuscarJuego -> Sala
// 		- Sala -> Juego
// 			- Cuadros
// 		- Juego
// 			- Cuadros, Tabla
// 		- Tabla
// 			- Carta
// - Juego.js <-> db.js
//  	- barajas
// 		- estatus

const App = () => {
  const { t } = useTranslation();

  // app state for game
  const [state, setState] = useState({
    gameId: "",
    g: null,
    cartaCantada: {},
    marcadas: [],
    estatusActual: "",
    ganador: "",
    mensaje: "",
    audio: null,
  });
  // local browser storage for player id
  const jugadorId = useLocalStorage(
    "jugadorId", // localStorage player key
    uuid4() // default id if none locally
  )[0];

  // recall browser selection of deck id
  const [localBarajaId, setLocalBarajaId] = useLocalStorage(
    // localStorage deck key
    "barajaId",
    // default to first deck
    [...Object.keys(barajas)][0]
  );

  // router hooks
  const history = useHistory();

  // app state references
  const { gameId, g, cartaCantada, marcadas, estatusActual, ganador, audio } =
    state;

  // wrap game registration for host (create game id) vs guest (follow id)
  const hostGame = async (e, newGameId) => {
    e.preventDefault();
    g.asignarHost(true);
    g.seleccionarBaraja(localBarajaId);

    // save host id to local storage in case of refresh
    localStorage.setItem("hostIdGameId", `${jugadorId}-${newGameId}`);

    history.push(`/${newGameId}`);
  };
  const joinGame = async (e) => {
    e.preventDefault();
    g.asignarHost(false);
    history.push(`/${gameId}`);
  };

  // browser card audio playback passed down to Sound component
  const playAudio = async (audioURI) => {
    if (!audio) {
      return;
    }
    audio.src = audioURI;
    audio.play();
  };

  // TODO: access (allow/disallow depending on joined game status)
  // TODO: route 404 if g failed to connect or register
  const registrar = async (juegoId) => {
    // connect to remote db if registering before connecting (see useEffect)
    if (!g.deposito) {
      await g.conectar();
    }

    // reclaim host if applicable
    if (localStorage.getItem("hostIdGameId") === `${jugadorId}-${juegoId}`) {
      g.isHost = true;
    }

    // TODO: set and read access flow (in store: { ..., privado: bool })
    const privado = g.isHost;

    // attach listener to db with cb on status change
    const joinedGameId = await g.registrar(
      juegoId,
      // callback for game to update app state depending on status
      (datos) => {
        // pull apart data
        const { estatusActual, barajaId, cartaCantada, ganador } = datos;
        // state options
        const estatusEstados = {
          [estatus.registrar]: {
            estatusActual,
            barajaId,
            mensaje: t("registrar"),
          },
          [estatus.iniciar]: {
            estatusActual,
            barajaId,
            mensaje: t("iniciar"),
          },
          [estatus.jugar]: {
            estatusActual,
            cartaCantada,
            mensaje: t("jugar"),
          },
          [estatus.ganar]: {
            estatusActual,
            ganador,
          },
          [estatus.empate]: {
            estatusActual,
            mensaje: t("empate"),
          },
        };
        // update state based on status state options
        setState((prevState) => ({
          ...prevState,
          ...estatusEstados[estatusActual],
        }));
      },
      privado
    );

    // initial game state in app
    setState((prevState) => ({
      ...prevState,
      gameId: joinedGameId,
      g,
      cartaCantada: {},
      marcadas: [],
      estatusActual: estatus.registrar,
    }));

    return () => {
      g.stop();
      setState((currentState) => ({ ...currentState, g: null }));
    };
  };

  // wrap game startup
  const iniciar = async () => {
    await g.iniciar();
  };

  // mark a called slot on tabla
  const marcar = (slotId) => {
    const marcada = g.marcar(slotId);
    marcada &&
      !marcadas.includes(slotId) &&
      setState((state) => ({
        ...state,
        marcadas: [...marcadas, slotId],
      }));
  };

  // text input when searching for game
  const handleGameIdInput = (event) =>
    setState((state) => ({
      ...state,
      gameId: event.target.value.trim(),
    }));

  // dropdown selected deck id
  const handleBarajaIdInput = (id) => {
    // event.preventDefault();
    setLocalBarajaId(id);
  };

  // start game and connect game-db on app start
  useEffect(() => {
    const gameInstance = new Cantor(jugadorId);
    const audio = new Audio();
    gameInstance.conectar((db) =>
      setState((prevState) => ({
        ...prevState,
        g: gameInstance,
        audio,
      }))
    );
  }, [jugadorId]);

  // reroute depending on status changes
  useEffect(() => {
    // route to tabla
    if (estatusActual === estatus.iniciar && gameId) {
      history.push(`/jugar`);
    }
    // route on win
    // else if (estatusActual === estatus.ganar && gameId) {
    // 	history.push(`/ganar`);
    // }

    // cleanup
    return () => {};
  }, [estatusActual, gameId, history]);

  // set up sound for safari users
  useEffect(() => {
    document.body.addEventListener("click", unlockAudio);
    document.body.addEventListener("touchstart", unlockAudio);
  });

  // This is a way to get sound to work on Safari
  const unlockAudio = () => {
    const sound = new Audio(
      "https://github.com/anars/blank-audio/raw/master/250-milliseconds-of-silence.mp3"
    );

    sound.play().then(() => {
      sound.pause();
      sound.currentTime = 0;
    });

    document.body.removeEventListener("click", unlockAudio);
    document.body.removeEventListener("touchstart", unlockAudio);
  };

  return (
    <Container className="App">
      {/* <Mensaje mensaje={mensaje} /> */}
      <Switch>
        <Route exact path="/">
          <BarajaButton
            handleBarajaIdInput={handleBarajaIdInput}
            barajaId={localBarajaId}
            barajas={barajas}
          />
          <Cabecera t={t} cartas={barajas[localBarajaId].cartas} />
          <Menu
            hostGame={hostGame}
            joinGame={joinGame}
            gameId={gameId}
            handleGameIdInput={handleGameIdInput}
          />
        </Route>
        <Route path="/buscar">
          <Busqueda g={g} />
        </Route>
        <Route path="/jugar">
          <Juego
            g={g}
            jugadorId={jugadorId}
            baraja={barajas[localBarajaId]}
            cartaCantada={cartaCantada}
            tablaDimension={4}
            marcar={marcar}
            marcadas={marcadas}
            ganador={ganador}
            playAudio={playAudio}
            winConditionHeader={t("winConditionHeader")}
            winConditionText={t("winConditionText")}
            startText={t("startText")}
          />
        </Route>
        <Route path="/download">
          <Download />
        </Route>
        <Route path="/PrintDeck">
          <PrintDeck />
        </Route>
        <Route path={`/PrintBoards/:playerBoardCount`}>
          <PrintBoards />
        </Route>
        <Route path={`/:juegoIdParam`}>
          <Sala
            g={g}
            jugadorId={jugadorId}
            estatusActual={t(estatusActual)}
            registrar={registrar}
            iniciar={iniciar}
          />
        </Route>
      </Switch>
    </Container>
  );
};

export default App;
