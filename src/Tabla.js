import React from 'react';
import Carta from './Carta';

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
	const anchura = 3;
	const marcar = cartaId => moves.marcar(G, playerId, cartaId);

	return(
		<div>
			<table id="tabla">
				<tbody>
					{new Array(anchura).fill(null).map((_, i) => (
						<tr key={i}>
							{new Array(anchura).fill(null).map((_, j) => (
								<Carta
									key={`carta-${i}-${j}`}
									cartaId={anchura * i + j}
									carta={tabla[anchura * i + j][0]}
									estilo={cardStyle}
									marcar={marcar}
								/>
							))}
				 		</tr>
					)}
				</tbody>
			</table>
			{winner}
		</div>
	);
};
