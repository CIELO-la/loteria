import { useState } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuid4 } from 'uuid';

const Menu = ({ hostGame, joinGame, gameId, handleBarajaIdInput, handleGameIdInput, barajaId, barajaIds }) => {
	// temp gameId if hosting a new game
	const newGameId = uuid4();

	const [isJoining, setJoining] = useState(false);
	const [isHosting, setHosting] = useState(false);

	const prepareHost = e => {
		e.preventDefault();
		setHosting(!isHosting)
	};

	const prepareJoin = e => {
		e.preventDefault();
		setJoining(!isJoining);
	};

	return (
		<div>
			<ul className="menu-enlaces">
				<li>
					<Link
						to={`/${newGameId}`}
						onClick={isHosting && barajaId
							? e => hostGame(e, newGameId)
							: prepareHost
						}
					>
						<input type="button" value="Crear juego" />
					</Link>
					{isHosting && (
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
					)}
				</li>
				<li>
					<Link
						to={`/${gameId}`}
						onClick={isJoining && gameId
							? joinGame
							: prepareJoin
						}
					>
						<input type="button" value="Unirse" />
					</Link>
					{isJoining && (
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
					)}
				</li>
				<li>
					<Link to="/buscar">
						<input type="button" value="Buscar" />
					</Link>
				</li>
			</ul>
		</div>
	);
};

export default Menu;
