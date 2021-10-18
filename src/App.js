import React, { useState, useEffect } from 'react';
import { useLocalStorage } from './utils/localStorage';
import { Switch, Route, useHistory } from 'react-router-dom';
import Cantor from './Juego/Loteria';
import Header from './Components/Header';
import Juego from './Components/Juego';
import Menu from './Components/Menu';
import BuscarJuego from './Components/BuscarJuego';
import Lobby from './Components/Lobby';
import { barajas } from './Juego/barajas';
import { estatus } from './Juego/estatus';
import { v4 as uuid4 } from 'uuid';
import './App.css';

// flow:
// - App.js <-> Juego.js
// 		(- barajas, estatus)
// 		- Menu -> BuscarJuego, Lobby
// 		- BuscarJuego -> Lobby
// 		- Lobby -> Juego
// 			- Cuadros
// 		- Juego
// 			- Cuadros, Tabla
// 		- Tabla
// 			- Carta
// - Juego.js <-> db.js
//  	- barajas
// 		- estatus

const App = () => {
	// app state for game
	const [state, setState] = useState({
		gameId: '',
		barajaId: '',
		g: null,
		cartaCantada: {},
		marcadas: [],
		estatusActual: '',
		ganador: '',
		mensaje: '',
	});
	// local storage for browser recall
	const jugadorId = useLocalStorage(
		'jugadorId',	// localStorage key
		uuid4()			// default id if none locally
	)[0];

	// router hooks
	//const { juegoIdParam } = useParams();	
	const history = useHistory();

	// game and app state references
	const barajaIds = [...Object.keys(barajas)];
	const { gameId, g, cartaCantada, marcadas, estatusActual, ganador, mensaje } = state;
	// TODO: read do not manipulate deck id
	const barajaId = !state.barajaId ? barajaIds[0] : state.barajaId;

	// wrap game registration for host (create game id) vs guest (follow id)
	const hostGame = async (e, newGameId) => {
		e.preventDefault();
		g.asignarHost(true);
		g.seleccionarBaraja(barajaId);
		history.push(`/${newGameId}`);
	};
	const joinGame = async e => {
		e.preventDefault();
		g.asignarHost(false);
		history.push(`/${gameId}`);
	};

	// TODO: access (allow/disallow depending on joined game status)
	// TODO: route 404 if g failed to connect or register
	const registrar = async juegoId => {
		// connect to remote db
		if (!g.deposito) {
			await g.conectar();
		}

		// TODO: set and read access flow (in store: { ..., privado: bool })
		const privado = g.isHost;

		// attach listener to db with cb on status change
		const joinedGameId = await g.registrar(
			juegoId,
			// callback for game to update app state depending on status
			datos => {
				// pull apart data
				const { estatusActual, barajaId, cartaCantada, ganador } = datos;
				// state options
				const estatusEstados = {
					[estatus.registrar]: {
						estatusActual,
						barajaId,
						mensaje: `registrar - en el lobby`,
					},
					[estatus.iniciar]: {
						estatusActual,
						barajaId,					
						mensaje: `iniciar`,
					},
					[estatus.jugar]: {
						estatusActual,
						cartaCantada,
						mensaje: `jugar`,
					},
					[estatus.ganar]: {
						estatusActual,
						ganador,
						mensaje: `ganar - ganó el jugador ${ganador}`,
					},
					[estatus.empate]: {
						estatusActual,
						mensaje: `empate - no ganó nadie`,
					},
				};
				// update state based on status state options
				setState(prevState => ({
					...prevState,
					...estatusEstados[estatusActual],
				}));
			},
			privado
		);

		// initial game state in app
		setState(prevState => ({
			...prevState,
			gameId: joinedGameId,
			g,
			cartaCantada: {},
			marcadas: [],
			estatusActual: estatus.registrar,
		}));

		return () => {
			g.stop();
			setState(currentState => ({ ...currentState, g: null }));
		};
	};

	// wrap game startup
	const iniciar = async () => {
		await g.iniciar();
	};

	// mark a called slot on tabla
	const marcar = slotId => {
		const marcada = g.marcar(slotId);
		marcada && !marcadas.includes(slotId) && setState(state => ({
			...state,
			marcadas: [...marcadas, slotId]
		}));
	};

	// text input when searching for game
	const handleGameIdInput = event => setState(state => ({
		...state, gameId: event.target.value.trim()
	}));

	// dropdown selected deck id
	const handleBarajaIdInput = event => {
		event.preventDefault();
		event.target.value && setState(state => ({
			...state, barajaId: event.target.value
		}));
	};

	// connect to game
	useEffect(() => {
		// start local game instance
		setState(prevState => ({
			...prevState,
			g: new Cantor(jugadorId)
		}));
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

	return (
		<div className="App">
			<Header mensaje={mensaje} />
			<Switch>
				<Route exact path="/">
					<Menu
						hostGame={hostGame}
						joinGame={joinGame}
						gameId={gameId}
						handleGameIdInput={handleGameIdInput}
						handleBarajaIdInput={handleBarajaIdInput}
						barajaId={barajaId}
						barajaIds={barajaIds}
					/>
				</Route>
				<Route path="/buscar">	
					<BuscarJuego />
				</Route>
				<Route path="/jugar">
					<Juego
						g={g}
						cartaCantada={cartaCantada}
						tablaDimension={4}
						marcar={marcar}
						marcadas={marcadas}
						ganador={ganador}
					/>
				</Route>
				<Route path={`/${gameId}`}>
					<Lobby
						g={g}
						jugadorId={jugadorId}
						estatusActual={estatusActual}
						registrar={registrar}
						iniciar={iniciar}
					/>
				</Route>
			</Switch>
		</div>
	);
};

export default App;
