import React from 'react';
import './App.css';
import { Client } from 'boardgame.io/react';
import { Local } from 'boardgame.io/multiplayer';
import { INVALID_MOVE } from 'boardgame.io/core';
import { GameBoard } from './GameBoard';

/* GAME */

// Return true if `cells` is in a winning configuration.
const IsVictory = cells => {
	const positions = [
		[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],
		[1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
	];
	const isRowComplete = row => {
		const symbols = row.map(i => cells[i]);
		return symbols.every(i => i !== null && i === symbols[0]);
	};
	return positions.map(isRowComplete).some(i => i === true);
};

// Return true if all `cells` are occupied.
const IsDraw = cells => cells.filter(c => c === null).length === 0;

const crearTabla = (baraja, cuantas) => {
	let cartasRestantes = [...baraja];
	let cartaElegida;
	return Array(cuantas).fill(null).map(_ => {
		const i = Math.floor(Math.random() * cartasRestantes.length);
		cartaElegida = cartasRestantes[i];
		cartasRestantes = [...cartasRestantes.slice(0, i), ...cartasRestantes.slice(i + 1)];
		return cartaElegida;
	});
};

const cartas = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const cantadas = [];
const tablas = {
	'1': crearTabla(cartas, 9),
	'2': crearTabla(cartas, 9)
};

const TicTacToe = {
	setup: () => ({
		tablas,
		cartas,
		cantadas
	}),
	turn: {
		moveLimit: 1
	},
	moves: {
		clickCell: (G, ctx, playerId, cellId) => {
			if (G.tablas[playerId].includes(cellId)) return INVALID_MOVE;
			G.cells[playerId].push(ctx.currentPlayer);
		}
	},
	endIf: (G, ctx) => {
		if (IsVictory(G.cells)) {
			return { winner: ctx.currentPlayer };
		}
		if (IsDraw(G.cells)) {
			return { draw: true };
		}
	}
};

/* APP */

const App = () => {

	const GameClient = Client({
		game: TicTacToe,
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
