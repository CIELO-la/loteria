import { useState } from 'react';

const Lobby = ({ jugadorId, isHost, jugadores, estatusActual, iniciar }) => {
	const [isStarting, setStarting] = useState(false);

	const leaveLobbyStartGame = () => {
		setStarting(true);
		setTimeout(iniciar, 2000);
	};

	return (
		<div>
			<p>Lobby</p>
			<p>estatus: {estatusActual}</p>
			<div>
				{jugadores.map(jugadorIdColor => (
					<div key={jugadorIdColor[0]}>
						<span style={{color: jugadorIdColor[1]}}>■</span>
					</div>
				))}
			</div>
			<div>
				{!isStarting
					? <button
						onClick={leaveLobbyStartGame}
						disabled={!isHost}
					  >iniciar (HOST)</button>
					: <button disabled>Iniciando...</button>
				}
			</div>
		</div>
	);
}

export default Lobby;
