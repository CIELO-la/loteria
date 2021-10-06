import React, { useState, useEffect } from 'react';
import { useLocalStorage } from './utils/localStorage';
import { Switch, Route, useHistory } from 'react-router-dom';
import Cantor from './Juego/Juego';
import Juego from './Components/Juego';
import Menu from './Components/Menu';
import BuscarJuego from './Components/BuscarJuego';
import Cuadros from './Components/Cuadros';
import Lobby from './Components/Lobby';
import { barajas } from './Juego/barajas';
import { estatus } from './Juego/estatus';
import { v4 as uuid4 } from 'uuid';
import './App.css';

// App flow:
// 	- Main: instantiate game, connect to db
// 		- Host: create new gameid, pass to game and db
// 		- Join: read gameid from uri
// 		- Search: read gameids from db list
//
// Rework:
//	- db.js
//	 	- do not require game id to start
// 			- sub instead fetches, bases return obj on games collection
// 		- returned methods object should contain more methods to
// 			- get a doc
// 			- add a new doc
// 			- sub to a doc c callback
// 			- update a doc
// 			- read list of open docs
// 			- snapshot
// 	- Juego.js
// 	 	- initialize s game id but
// 			- break initial values into f reset?/config?/clear?
// 		- conectar db deposito
// 		- buscar find and list games
// 		- registrar get game id, snapshot subscribe
// 		- iniciar have game id and play that game
// 	- App.js
// 		- g onEffect run once: instantiate, connect
// 		- link to host: create and send to /:gid, onEffect get game doc
// 			- registrar, subscribing c all the status-options happens here
// 		- link to join: send to /:gid, onEffect get game doc
// 			- same, do the registrar stuff
// 			- but isHost is false so you don't write new collection doc
// 		- link to find: send to /buscar, onEffect or sublink Juego.buscar
// 			- listing and linking to lobbies
// 			- game status 'registrar', less than max players

// TODO: separate out into Components
// 	- [ ] <Link to=""> host, buscar, options
// 	- [ ] generate new uuid->juegoId each link to Hostear
// 	- [ ] capture juegoId in join lobby
//
// TODO: búsqueda queries for list 
// 	- [ ] either pull out db from living inside game instance entirely
// 	- [ ] or make g object on load app
	
const App = () => {
	// app state for game
	const [state, setState] = useState({
		gameId: '',
		barajaId: '',
		g: null,
		cartaCantada: {},
		marcadas: [],
		estatusActual: '',
		mensaje: '',
	});
	// local storage for browser recall
	const [jugadorId, setJugadorId] = useLocalStorage(
		'jugadorId',	// localStorage key
		uuid4()			// default id if none locally
	);

	// router hooks
	//const { juegoIdParam } = useParams();	
	const history = useHistory();

	// game and app state references
	const barajaIds = [...Object.keys(barajas)];
	const { gameId, g, cartaCantada, marcadas, mensaje, estatusActual } = state;
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
			}
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
		// // route to lobby
		// if (estatusActual === estatus.registrar && gameId) {
		// 	history.push(`/${gameId}`);
		// }
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
	}, [estatusActual, gameId, history, g]);

	return (
		<div className="App">
			<div style={{color: 'gray', fontSize: 15, marginBottom: 20}}>{mensaje}</div>
			
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
					{/* TODO: remake into a finder not a host/join menu */}
					<BuscarJuego />
				</Route>
				<Route path="/jugar">
					<div>
						<Cuadros jugadores={g ? g.jugadores : []} />
						<Juego
							g={g}
							cartaCantada={cartaCantada}
							tablaDimension={4}
							marcar={marcar}
							marcadas={marcadas}
						/>
					</div>
				</Route>
				<Route path={`/${gameId}`}>
					{g 
						? // Lobby if game instantiated and player registered
							<div>
								<Cuadros jugadores={g.jugadores} />
								<Lobby
									registrar={registrar}
									jugadorId={jugadorId}
									isHost={g.isHost}
									jugadores={g.jugadores}
									estatusActual={estatusActual}
									iniciar={iniciar}
								/>
							</div>
						: // wait for player to register
							<div>
								Conectándose...
							</div>
					}
				</Route>
			</Switch>
		</div>
	);
};

export default App;
