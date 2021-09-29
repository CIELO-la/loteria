import React, { useState, useEffect } from 'react';
import { useLocalStorage } from './utils/localStorage';
import { Switch, Route, useHistory, useParams, useLocation, matchPath } from 'react-router-dom';
import Cantor from './Juego/Juego';
import Juego from './Components/Juego';
import BuscarJuego from './Components/BuscarJuego';
import Cuadros from './Components/Cuadros';
import Lobby from './Components/Lobby';
import { barajas } from './Juego/barajas';
import { estatus } from './Juego/estatus';
import { v4 as uuid4 } from 'uuid';
import './App.css';

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
		'loteriaJugadorId', // localStorage key
		uuid4()				// default id if none locally
	);

	// router hooks
	//const { juegoIdParam } = useParams();
	const location = useLocation();
	const history = useHistory();

	// game and app state references
	const barajaIds = [...Object.keys(barajas)];
	const { gameId, g, cartaCantada, marcadas, mensaje, estatusActual } = state;
	// TODO: read do not manipulate deck id
	const barajaId = !state.barajaId ? barajaIds[0] : state.barajaId;

	// wrap game registration for host (create game id) vs guest (follow id)
	const hostGame = e => {
		e.preventDefault();
		registrar(null, barajaId, true);
	};
	const joinGame = e => {
		e.preventDefault();
		registrar(gameId, barajaId, false);
	};

	// TODO: access (allow/disallow depending on joined game status)
	const registrar = async (juegoId, deckId, isHost) => {
		// start local game instance
		const g = new Cantor(deckId, jugadorId, isHost);

		// connect game to db and cb on status change
		const joinedGameId = await g.registrar(
			isHost ? null : juegoId,
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

		// TODO: route 404 if g failed to register

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

	// reroute depending on status changes
	useEffect(() => {
		// route to lobby
		if (estatusActual === estatus.registrar && gameId) {
			history.push(`/${gameId}`);
		}
		// route to tabla
		else if (estatusActual === estatus.iniciar && gameId) {
			history.push(`/jugar`);
		}
		// route on win
		// else if (estatusActual === estatus.ganar && gameId) {
		// 	history.push(`/ganar`);
		// }

		// cleanup
		return () => {};
	}, [estatusActual, gameId, history, g]);

	// register players joining game via link
	useEffect(() => {
		// register joiner
		const match = matchPath(location.pathname, {
			path: '/:juegoIdParam',
			exact: true,
			strict: false,
		});
		if (match && !g) {
			registrar(match.params.juegoIdParam, null, false);
		}
	}, []);

	return (
		<div className="App">
			<div style={{color: 'gray', fontSize: 15, marginBottom: 20}}>{mensaje}</div>
			
			<Switch>
				<Route exact path="/">
					<BuscarJuego
						hostGame={hostGame}
						joinGame={joinGame}
						gameId={gameId}
						handleGameIdInput={handleGameIdInput}
						barajaId={barajaId}
						barajaIds={barajaIds}
						handleBarajaIdInput={handleBarajaIdInput}
					/>
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
				<Route path="/:juegoIdParam">
					{g 
						? 
							<div>
								<Cuadros jugadores={g.jugadores} />
								<Lobby
									jugadorId={jugadorId}
									isHost={g.isHost}
									jugadores={g.jugadores}
									estatusActual={estatusActual}
									iniciar={iniciar}
								/>
							</div>
						:
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
