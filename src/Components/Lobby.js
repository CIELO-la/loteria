import { useState, useEffect } from 'react';
import { Link, useLocation, matchPath } from 'react-router-dom';
import Cuadros from './Cuadros';

// TODO: handle or 404 cold joiners who lack g
const Lobby = ({ g, jugadorId, estatusActual, registrar, iniciar }) => {
	// lobby control flow
	const [isStarting, setStarting] = useState(false);
	const [isRegistering, setRegistering] = useState(false);

	// uri for path matching
	const location = useLocation();

	// move to game startup
	const leaveLobbyStartGame = e => {
		e.preventDefault();
		if (!g.isHost) { return; }
		// pre-game starting state (NOTE: currently for host only)
		setStarting(true);
		// message status so players route to /juego
		setTimeout(iniciar, 2000);
	};

	// immediately register players from uri
	useEffect(() => {
		if (!g || isRegistering) { return; }
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
	}, [g, registrar, location, isRegistering]);

	return (
		<div>
			<p>Lobby</p>
			{g && isRegistering
				? (
					<>{/* Lobby if game instantiated and player registered */}
						<Cuadros jugadores={g.jugadores} />
						<p>estatus: {estatusActual}</p>
						<div>
							{g.jugadores.map(jugadorIdColor => (
								<div key={jugadorIdColor[0]}>
									<span style={{color: jugadorIdColor[1]}}>■</span>
								</div>
							))}
						</div>
						<div>
							<Link to="/juego" onClick={leaveLobbyStartGame}>
								{!isStarting
									? <button
										disabled={!g.isHost}
									  >iniciar (HOST)</button>
									: <button disabled>Iniciando...</button>
								}
							</Link>
						</div>
					</>
				) : (
					<>{/* Wait for players to register*/}
						<p>Conectándose...</p>
					</>
				)
			}
		</div>
	);
}

export default Lobby;
