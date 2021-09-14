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
	
	// TAREA: elegir la baraja
	const hostGame = e => e.preventDefault && iniciar(barajaId, true);
	const joinGame = e => e.preventDefault && iniciar(barajaId, false);

	const iniciar = async (deckId, isHost) => {

		//TODO: get barajaId from host -- separate config/registrar from iniciar

		const g = new Cantor(deckId, jugadorId, isHost);

		console.log('RUNNING START');

		g.iniciar(isHost ? null : gameId, message => {
			switch(message.type) {
				case 'jugar':
					const { cartaCantada } = message;
					setState(state => ({ ...state, cartaCantada }));
					break;
				case 'ganar':
					const { mensaje } = message;
					setState(state => ({ ...state, mensaje }));
					break;
				default:
					// Nothing to do
					break;
			}
		});

		setState(state => ({
			...state,
			g,
			cartaCantada: {},
			marcadas: [],
		}));

		return () => { g.stop(); }
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
