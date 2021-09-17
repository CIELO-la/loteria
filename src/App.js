import React, { useState } from 'react';
import './App.css';
import Cantor from './Juego/Juego';
import Juego from './Components/Juego';
import BuscarJuego from './Components/BuscarJuego';
import { barajas } from './Juego/barajas';
import { estatus } from './Juego/estatus';
import { v4 as uuid4 } from 'uuid';

const App = () => {
	const [state, setState] = useState({
		jugadorId: uuid4(),
		gameId: '',
		barajaId: '',
		g: null,
		cartaCantada: {},
		marcadas: [],
		estatusActual: '',
		mensaje: '',
	});

	const barajaIds = [...Object.keys(barajas)];

	const { jugadorId, gameId, g, cartaCantada, marcadas, mensaje, estatusActual } = state;

	const barajaId = !state.barajaId ? barajaIds[0] : state.barajaId;
	
	const hostGame = e => {
		e.preventDefault();
		registrar(barajaId, true);
	};
	const joinGame = e => {
		e.preventDefault();
		registrar(barajaId, false);
	};

	const registrar = async (deckId, isHost) => {
		//TODO: get barajaId from host
		const g = new Cantor(deckId, jugadorId, isHost);

		const joinedGameId = await g.registrar(isHost ? null : gameId, message => {
			// TODO: d.r.y. map status:function
			const { tipo, mensaje, cartaCantada } = message;
			switch(tipo) {
				case 'registrar':
					setState(state => ({
						...state,
						mensaje,
						estatusActual: tipo,
					}));
					break;
				case 'iniciar':
					setState(state => ({
						...state,
						mensaje,
						estatusActual: tipo,						
					}));
					break;
				case 'jugar':
					setState(state => ({
						...state,
						mensaje,
						cartaCantada,
						estatusActual: tipo,
					}));
					break;
				case 'ganar':
					setState(state => ({
						...state,
						mensaje,
						estatusActual: tipo,
					}));
					break;
				case 'empate':
					setState(state => ({
						...state,
						mensaje,
						estatusActual: tipo,
					}));
					break;
				default:
					// Nothing to do
					break;
			}
		});

		setState(state => ({
			...state,
			gameId: joinedGameId,
			g,
			cartaCantada: {},
			marcadas: [],
			estatusActual: estatus.registrar,
		}));

		return () => {
			g.stop();
			setState(state => ({ ...state, g: null }));
		};
	};

	const iniciar = async () => {
		await g.iniciar();
	};

	const marcar = slotId => {
		const marcada = g.marcar(slotId);
		marcada && !marcadas.includes(slotId) && setState(state => ({
			...state,
			marcadas: [...marcadas, slotId]
		}));
	};

	const handleGameIdInput = event => setState(state => ({
		...state, gameId: event.target.value.trim()
	}));

	const handleBarajaIdInput = event => {
		event.preventDefault();
		event.target.value && setState(state => ({
			...state, barajaId: event.target.value
		}));
	};

	return (
		<div className="App">
			<div>{mensaje}</div>
			{!g
				? (
					<BuscarJuego
						hostGame={hostGame}
						joinGame={joinGame}
						gameId={gameId}
						handleGameIdInput={handleGameIdInput}
						barajaId={barajaId}
						barajaIds={barajaIds}
						handleBarajaIdInput={handleBarajaIdInput}
					/>
				) : estatusActual === estatus.registrar
					? (
						<div>
							<p>Lobby</p>
							<p>estatus: {estatusActual}</p>
							<ul>jugadores:
								{g.jugadores.map(jugador => (
									<li>{jugador}</li>
								))}
							</ul>
							<button onClick={iniciar}>iniciar</button>
						</div>
					) : (
						<Juego
							g={g}
							cartaCantada={cartaCantada}
							tablaDimension={4}
							marcar={marcar}
							marcadas={marcadas}
						/>
					)
			}
		</div>
	);
};

export default App;
