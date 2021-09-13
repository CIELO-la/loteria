import React, { useState } from 'react';
import './App.css';
import Cantor from './Game/Game';
import BuscarJuego from './Components/BuscarJuego';
import Juego from './Components/Juego';
import { barajas } from './Game/barajas';

const App = () => {
	const [state, setState] = useState({
		gameId: '',
		barajaId: '',
		g: null,
		playerId: null,
		cartaCantada: {},
		marcadas: [],
	});

	const barajaIds = [...Object.keys(barajas)];

	const { g, cartaCantada, playerId, gameId, marcadas } = state;

	const barajaId = !state.barajaId ? barajaIds[0] : state.barajaId;
	
	// TAREA: elegir la baraja
	const hostGame = () => iniciar(barajaId, true);
	const joinGame = () => iniciar(barajaId, false);

	const iniciar = (deckId, isHost) => {
		const g = new Cantor(deckId, isHost);
		const playerId = g.registrar();
		console.log(`soy el jugador número ${playerId}`);
		setState({
			g,
			playerId,
			cartaCantada: {},
			marcadas: [],
		});

		g.iniciar(isHost ? null : gameId, message => {
			switch(message.type) {
				case "carta":
					const { cartaCantada } = message;
					setState(state => ({ ...state, cartaCantada }));
					break;
				default:
					// Nothing to do
					break;
			}
		});
		return () => { g.stop(); }
	};

	const marcar = slotId => {
		const marcada = g.marcar(playerId, slotId);
		if (marcada && !marcadas.includes(slotId)) {
			console.log(`marcando el eslot ${slotId}`);
			setState(state => ({ ...state, marcadas: [...marcadas, slotId] }));
		}
	};

	const handleGameIdInput = event => setState({ gameId: event.target.value.trim() });

	const handleBarajaIdInput = event => {
		event.preventDefault();
		event.target.value && setState({ barajaId: event.target.value });
	};

	return (
		<div className="App">
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
						playerId={playerId}
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
