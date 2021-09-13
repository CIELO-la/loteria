import React from 'react';

const BuscarJuego = ({ joinGame, hostGame, gameId, handleGameIdInput }) => (
	<div>
		<form onSubmit={joinGame}>
			<label>
				gameId:
				<input
					type="text"
					value={gameId}
					onChange={handleGameIdInput}
				/>
			</label>
			<input type="submit" value="Join" />
		</form>
		<form onSubmit={hostGame}>
			<input type="submit" value="Host" />
		</form>
	</div>
);

export default BuscarJuego;
