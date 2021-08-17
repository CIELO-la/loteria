import React from 'react';

export const GameBoard = ({ G, ctx, moves }) => {
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

	// create table
	const tableDimensions = [3, 3];

	return(
		<div>
			<table id="board">
				<tbody>
					{new Array(tableDimensions[0]).fill(null).map((_, i) => 
						<tr key={i}>
							{new Array(tableDimensions[1]).fill(null).map((_, j) => (
								<td
									style={cellStyle}
									key={3 * i + j}
									onClick={() => moves.clickCell(3 * i + j)}
								>{G.cells[3 * i + j]}</td>
							))}
						</tr>
					)}
				</tbody>
			</table>
			{winner}
		</div>
	);
};
