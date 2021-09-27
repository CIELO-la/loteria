import { useState, useEffect } from 'react';

const Lobby = ({ jugadorId, jugadores, estatusActual, iniciar }) => {
	const [areReady, setReady] = useState([]);
	const [isStarting, setStarting] = useState(false);

	const handleReady = checkedPlayerId => {
		if (!checkedPlayerId === jugadorId) {
			console.log(`is not player`)
			return;
		}
		!checkReady(checkedPlayerId)
			? setReady(prevReadies => [
				...prevReadies,
				checkedPlayerId
			]) : setReady(prevReadies => prevReadies.filter(
				readyPlayerId => checkedPlayerId !== readyPlayerId
			))
		;
	};

	const checkReady = checkedPlayerId => areReady.includes(checkedPlayerId);

	const leaveLobbyStartGame = () => {
		setStarting(true);
		setTimeout(iniciar, 2000);
	};

	return (
		<div>
			<p>Lobby</p>
			<p>estatus: {estatusActual}</p>
			<div>
				<div>listos: {areReady.length}/{jugadores.length}</div>
				{jugadores.map(jugadorIdColor => (
					<div key={jugadorIdColor[0]}>
						<label>
							<span style={{color: jugadorIdColor[1]}}>■</span>
							<input
								type="checkbox"
								checked={checkReady(jugadorIdColor[0])}
								onChange={() => handleReady(jugadorIdColor[0])}
							/>
						</label>
					</div>
				))}
			</div>
			<div>
				{!isStarting
					? <button
						onClick={leaveLobbyStartGame}
						disabled={areReady.length !== jugadores.length}
					  >iniciar</button>
					: <button disabled>Iniciando...</button>
				}
			</div>
		</div>
	);
}

export default Lobby;
