import { useState } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuid4 } from 'uuid';

const Menu = ({ hostGame, joinGame, gameId, handleBarajaIdInput, handleGameIdInput, barajaId, barajaIds }) => {
	// temp gameId if hosting a new game
	const newGameId = uuid4();

	// toggle flow for displaying/hiding button options
	const [isLanguaging, setLanguaging] = useState(false);
	const prepareLanguaging = e => {
		e.preventDefault();
		setLanguaging(!isLanguaging)
	};
	// const [isJoining, setJoining] = useState(false);
	// const prepareJoin = e => {
	// 	e.preventDefault();
	// 	setJoining(!isJoining);
	// };

	return (
		<div>
			<ul className="menu-enlaces">
				<li>
					<Link
						to={`/${newGameId}`}
						onClick={e => hostGame(e, newGameId)}
					>
						<input type="button" value="Crear juego" />
					</Link>
				</li>
				{/* // Unirse
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
				*/}
				{/* // Buscar
					<li>
						<Link to="/buscar">
							<input type="button" value="Buscar" />
						</Link>
					</li>
				*/}
				<li>
					{!isLanguaging ?
						(
							<Link to="/" onClick={prepareLanguaging}>
								<input type="button" value={`Idioma (${barajaId})`} />
							</Link>
						) : (
							<div>
								<label>
									barajaId:
									<select onClick={e => setLanguaging(false)} onChange={handleBarajaIdInput} value={barajaId}>
										{barajaIds.map(baraja => (
											<option key={baraja} value={baraja}>{baraja}</option>
										))}
									</select>
								</label>
							</div>
						)
					}
				</li>
			</ul>
		</div>
	);
};

export default Menu;
