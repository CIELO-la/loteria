import React, { useState } from 'react';
import './App.css';
import Cantor from './Game/Game';
import BuscarJuego from './Components/BuscarJuego';
import Juego from './Components/Juego';
import { barajas } from './Game/barajas';
import { v4 as uuid4 } from 'uuid';

const App = () => {
	const [state, setState] = useState({
		jugadorId: uuid4(),
		gameId: '',
		barajaId: '',
		g: null,
		cartaCantada: {},
		marcadas: [],
		mensaje: ''
	});

	const barajaIds = [...Object.keys(barajas)];

	const { jugadorId, gameId, g, cartaCantada, marcadas, mensaje } = state;

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
			const { mensaje, cartaCantada } = message;	
			switch(message.type) {
				case 'jugar':
					setState(state => ({ ...state, cartaCantada }));
					break;
				case 'ganar':
					setState(state => ({ ...state, mensaje }));
					break;
				case 'empate':
					setState(state => ({ ...state, mensaje }));
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
		}));

		// TAREA: llamar en lobby
		await g.iniciar();

		return () => { g.stop(); setState(state => ({ ...state, g: null })); };
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
