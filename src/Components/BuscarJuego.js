import React from 'react';

const BuscarJuego = ({ joinGame, hostGame, gameId, handleGameIdInput, barajaId, barajaIds, handleBarajaIdInput }) => (
	<div>
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
		<br/>
		<form onSubmit={hostGame}>
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
			<div>
				<input type="submit" value="Host" />
			</div>
		</form>
	</div>
);

export default BuscarJuego;
