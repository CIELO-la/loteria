import { useState, useEffect } from 'react';
import { Link, useLocation, matchPath } from 'react-router-dom';

const Lobby = ({ jugadorId, isHost, jugadores, estatusActual, registrar, iniciar }) => {
	// lobby control flow
	const [isStarting, setStarting] = useState(false);
	const [isRegistering, setRegistering] = useState(false);

	// uri for path matching
	const location = useLocation();

	// move to game startup
	const leaveLobbyStartGame = () => {
		setStarting(true);
		setTimeout(iniciar, 2000);
	};

	// immediately register players from uri
	useEffect(() => {
		if (isRegistering) { return; }
		const registerOnLoad = async () => {
			const match = matchPath(location.pathname, {
				path: '/:juegoIdParam',
				exact: true,
				strict: false,
			});
			setRegistering(true);
			await registrar(match.params.juegoIdParam);
		}
		registerOnLoad();
		return () => {};
	}, [registrar, location, isRegistering]);

	return (
		<div>
			<p>Lobby</p>
			{isRegistering
				? (
					<>
						<p>estatus: {estatusActual}</p>
						<div>
							{jugadores.map(jugadorIdColor => (
								<div key={jugadorIdColor[0]}>
									<span style={{color: jugadorIdColor[1]}}>■</span>
								</div>
							))}
						</div>
						<div>
							<Link to="">
								{!isStarting
									? <button
										onClick={leaveLobbyStartGame}
										disabled={!isHost}
									  >iniciar (HOST)</button>
									: <button disabled>Iniciando...</button>
								}
							</Link>
						</div>
					</>
				) : (
					<p>Registering...</p>
				)
			}
		</div>
	);
}

export default Lobby;
