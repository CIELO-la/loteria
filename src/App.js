import React, { useState } from 'react'; // { useEffect } from 'react';
import './App.css';
import Cantor from './Game/Game';
import Tabla from './Components/Tabla';

const App = () => {
	const [state, setState] = useState({
		g: null,
		playerId: null,
		cartaCantada: {},
		marcadas: [],
	});

	// Run the first time the component is mounted
	// The empty array as the second argument means that the `useEffect`
	// will not fire again due to changes.
	// useEffect(() => {
	// 	const g = new Cantor('zapo-01');
	// 	const playerId = g.registrar();
	// 	const isHost = playerId === 0;
	// 	console.log(`soy el jugador número ${playerId}`);
	// 	setState({
	// 		g,
	// 		playerId,
	// 		isHost,
	// 		cartaCantada: {},
	// 		marcadas: [],
	// 	});

	// 	// Only run this for the host
	// 	if (!isHost) { return; }

	// 	g.iniciar(message => {
	// 		switch(message.type) {
	// 			case "carta":
	// 				const { cartaCantada } = message;
	// 				setState(state => ({ ...state, cartaCantada }));
	// 				break;
	// 			default:
	// 				// Nothing to do
	// 				break;
	// 		}
	// 	});
	// 	return () => { g.stop(); }
	// }, []);

	const { g, cartaCantada, playerId, marcadas } = state;
	
	// TAREA: elegir la baraja
	const hostGame = () => iniciar('zapo-01', true);

	const joinGame = () => {
		console.log(`TAREA: buscar juego y conectar...`);
	};

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

		g.iniciar(message => {
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

	return (
		<div className="App">
			{!g
				? (
					<div>
						<div><button onClick={() => hostGame()}>Host</button></div>
						<div><button onClick={() => joinGame()}>Join</button></div>
					</div>
				)
				: (
					<>
						<div>
							{cartaCantada && cartaCantada.nombre
								? <div>el {cartaCantada.nombre}</div>
								: <div>¡Corre y se va!</div>
							}
						</div>
						<div>
							<Tabla
								g={g}
								playerId={playerId}
								tabla={g.tablas[playerId]}
								dimension={4}
								marcar={marcar}
								marcadas={marcadas}
							/>
							<button onClick={() => g.verificar(playerId)}>¡¿pues gané?!</button>
						</div>
					</>
				)
			}
		</div>
	);
};

export default App;
