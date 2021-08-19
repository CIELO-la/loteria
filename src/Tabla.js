import React from 'react';
import { Carta } from './Carta';

export const Tabla = ({ G, ctx, moves, playerId }) => {
	let winner = '';
	if (ctx.gameover) {
		winner = ctx.gameover.winner !== undefined ? (
			<div id="winner">Winner: {ctx.gameover.winner}</div>
		) : (
			<div id="winner">Draw!</div>
		);
	}

	const cardStyle = {
		border: '1px solid #555',
		width: '50px',
		height: '50px',
		lineHeight: '50px',
		textAlign: 'center',
	};

	const tabla = G.tablas[playerId];
	const anchura = Array(3).fill(null);

	const marcar = cartaId => moves.Marcar
		? console.log(`marcar (G, ctx, ${playerId}, ${cartaId})`) && moves.Marcar(playerId, cartaId)
		: {}
	;

	return tabla ? (
		<div>
			<table id="tabla">
				<tbody>
					{anchura.map((_, i) => (
						<tr key={i}>
							{anchura.map((_, j) => (
								<Carta
									key={`carta-${i}-${j}`}
									cartaId={anchura.length * i + j}
									carta={tabla[anchura.length * i + j][0]}
									estilo={cardStyle}
									marcar={marcar}
								/>
							))}
				 		</tr>
					))}
				</tbody>
			</table>
			{winner}
		</div>
	): (<div></div>);
};
