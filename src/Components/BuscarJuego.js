import React from 'react';

const BuscarJuego = ({ joinGame, hostGame, gameId, handleGameIdInput, barajaId, barajaIds, handleBarajaIdInput }) => (
	<div>
		<div>
			<label>
				barajaId:
				<select onChange={handleBarajaIdInput} value={barajaId}>
					{barajaIds.map(baraja => (
						<option key={baraja} value={baraja}>{baraja}</option>
					))}
				</select>
			</label>
		</div>
		<form onSubmit={joinGame}>
			<div>
				<label>
					gameId:
					<input
						type="text"
						value={gameId}
						onChange={handleGameIdInput}
					/>
				</label>
			</div>
			<div>
				<input type="submit" value="Join" />
			</div>
		</form>
		<form onSubmit={hostGame}>
			<input type="submit" value="Host" />
		</form>
	</div>
);

export default BuscarJuego;
