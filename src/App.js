import React from 'react';
import './App.css';
import { Client } from 'boardgame.io/react';
import { Local } from 'boardgame.io/multiplayer';
import { INVALID_MOVE } from 'boardgame.io/core';
import { GameBoard } from './GameBoard';

/* GAME */

// TODO: win conditions
const ganar = (G, ctx) => G.tablas[ctx.currentPlayer] && G.tablas[ctx.currentPlayer]
	.map(carta => carta[1])
	.filter(Boolean).length >= 4
;
const empatar = G => G.cantadas >= G.cartas.length;

const crearTabla = (baraja, cuantas) => [...barajar(baraja).slice(0, cuantas)].map(
	carta => [carta, false]
);

const barajar = baraja => {
	const barajada = [...baraja].reverse();
	let temp, j;
	baraja.map((_, i) => {
		j = Math.floor(Math.random() * (i + 1));
		temp = barajada[i];
		barajada[i] = barajada[j];
		barajada[j] = temp;
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
	'1': crearTabla(cartas, 9),
	'2': crearTabla(cartas, 9)
};

const Loteria = {
	setup: () => ({
		tablas,
		cartas,
		cantadas: 0,
	}),
	turn: {
		moveLimit: 1
	},
	moves: {
		cantar: G => { G.cantadas++; },
		marcar: (G, ctx, cellId) => {
			const cell = G.tablas[ctx.currentPlayer][cellId];
			if (cell[1]) return INVALID_MOVE;
			if (G.cartas.slice(0, G.cantadas).includes(cell[0])) {
				cell[1] = true;
			}
		}
	},
	endIf: (G, ctx) => {
		if (ganar(G, ctx)) {
			return { winner: ctx.currentPlayer };
		}
		if (empatar(G)) {
			return { draw: true };
		}
	}
};

/* APP */

const App = () => {

	const GameClient = Client({
		game: Loteria,
		board: GameBoard,
		multiplayer: Local(),
		// debug: false
	});

	return (
		<div className="App">
			{Object.keys(tablas).map(playerID => (
				<div key={playerID}>
					Player {playerID}
					<GameClient
						key={playerID}
						playerID={playerID}
					/>
					<hr/>
				</div>
			))}
		</div>
	);
};

export default App;
