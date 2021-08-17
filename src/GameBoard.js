import React from 'react';

export const GameBoard = ({ G, ctx, moves, playerID }) => {
	let winner = '';
	if (ctx.gameover) {
		winner = ctx.gameover.winner !== undefined ? (
			<div id="winner">Winner: {ctx.gameover.winner}</div>
		) : (
			<div id="winner">Draw!</div>
		);
	}

	const cellStyle = {
		border: '1px solid #555',
		width: '50px',
		height: '50px',
		lineHeight: '50px',
		textAlign: 'center',
	};

	const tabla = G.tablas[playerID];
	const anchura = 3;

	return(
		<div>
			<table id="board">
				<tbody>
					{new Array(anchura).fill(null).map((_, i) => 
						<tr key={i}>
							{new Array(anchura).fill(null).map((_, j) => (
								<td
									style={cellStyle}
									key={anchura * i + j}
									onClick={() => moves.marcar(anchura * i + j)}
								>{tabla[anchura * i + j][0]}</td>
							))}
						</tr>
					)}
				</tbody>
			</table>
			{winner}
		</div>
	);
};
