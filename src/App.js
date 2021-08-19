import React from 'react';
import './App.css';
import { Client } from 'boardgame.io/react';
import { Local } from 'boardgame.io/multiplayer';
import { INVALID_MOVE } from 'boardgame.io/core';
import { Tabla } from './Tabla';

/* GAME */

const crearTabla = (baraja, cuantas) => [...barajar(baraja).slice(0, cuantas)];

const barajar = baraja => {
	const barajada = [...baraja].reverse();
	let temp, j;
	baraja.map((_, i) => {
		j = Math.floor(Math.random() * (i + 1));
		temp = barajada[i];
		barajada[i] = barajada[j];
		barajada[j] = temp;
		return null;
	});
	return barajada;
};

const cartas = barajar([
	'A', 'B', 'C', 'D', 'E', 'F', 'G',
	'H', 'I', 'J', 'K', 'L', 'M', 'N',
	'O', 'P', 'Q', 'R', 'S', 'T', 'U',
	'V', 'W', 'X', 'Y', 'Z'
]);
const tablas = {
	'01': crearTabla(cartas, 9),
	'02': crearTabla(cartas, 9),
};
const marcadas = {
	'01': [],
	'02': [],
};

const Cantar = (G, ctx) => {
	G.cantadas = G.cantadas + 1;
};

const Marcar = (G, ctx, playerId, cartaId) => {
	const carta = G.tablas[playerId]
		? G.tablas[playerId][cartaId]
		: null
	;
	console.log(`jugador ${playerId} eligió la carta ${carta}`);
	if (carta === null || G.marcadas[playerId].includes(carta) || !G.cartas.slice(0, G.cantadas).includes(carta)) {
		console.log(`no se marcó`);
		return INVALID_MOVE;
	}
	G.marcadas[playerId].push(carta);
	console.log(`sí se pudo marcar`);
};

// TODO: win conditions
const Ganar = tabla => tabla.map(carta => carta[1]).filter(Boolean).length >= 4;
const Empatar = G => G.cantadas >= G.cartas.length;

const Loteria = {
	setup: () => ({
		cartas,
		cantadas: 0,
		tablas,
		marcadas,
	}),
	turn: {
		//moveLimit: 1,
		onBegin: (G, ctx) => {
			console.log(`Corre y se va... el ${G.cartas[G.cantadas]}`);
			Cantar(G, ctx);
			setInterval(() => ctx.events.endTurn(), 4000);
		},
		onEnd: (G, ctx) => {
			console.log(`se acabó el turno`);
		}
	},
	moves: {
		Marcar
	},
	// phases: {
	// 	play: {
	// 		start: true,
	// 		moves: {
	// 			Marcar: (G, ctx, playerId, cartaId) => {}
	// 		},
	// 		onBegin: (G, ctx) => {
	// 			G.cantadas++;
	// 			console.log(G);
	// 			ctx.events.endPhase();
	// 		},
	// 		next: 'play'
	// 	},
	// 	end: {
	// 		moves: { Marcar },
	// 		onBegin: (G, ctx) => setTimeout(() => ctx.events.endPhase(), 4000),
	// 		next: 'call'
	// 	}
	// },
	endIf: (G, ctx) => {
		const playerId = '01'; 	// TODO: pass arg
		if (!G.tablas) return;
		if (Ganar(G.tablas[playerId])) {
			return { winner: playerId };
		}
		if (Empatar(G)) {
			return { draw: true };
		}
	}
};

/* APP */

const App = () => {

	const GameClient = Client({
		game: Loteria,
		board: Tabla,
		multiplayer: Local(),
		// debug: false
	});

	return (
		<div className="App">
			{Object.keys(tablas).map(playerId => (
				<div key={playerId}>
					Player {playerId}
					<GameClient
						key={playerId}
						playerId={playerId}
					/>
					<hr/>
				</div>
			))}
		</div>
	);
};

export default App;
