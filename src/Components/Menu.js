import { useState } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuid4 } from 'uuid';

const Menu = ({ hostGame, joinGame, gameId, handleBarajaIdInput, handleGameIdInput, barajaId, barajas }) => {
	// temp gameId if hosting a new game
	const newGameId = uuid4();

	// toggle flow for displaying/hiding button options
	const [isLanguaging, setLanguaging] = useState(false);
	const prepareLanguaging = e => {
		e.preventDefault();
		setLanguaging(!isLanguaging)
	};
	const changeBaraja = e => {
		setLanguaging(false);
		handleBarajaIdInput(e);
	};
	// const [isJoining, setJoining] = useState(false);
	// const prepareJoin = e => {
	// 	e.preventDefault();
	// 	setJoining(!isJoining);
	// };

	const baraja = barajas[barajaId];

	return (
		<div>
			<ul className="menu-enlaces">
				<li>
					<Link
						to={`/${newGameId}`}
						onClick={e => hostGame(e, newGameId)}
					>
						<input type="button" value={baraja.botones.crear} />
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
								<input type="button" value={`Baraja: ${baraja.nombre}`} />
							</Link>
						) : (
							<div>
								<label>
									<select onChange={changeBaraja} value={barajaId}>
										{Object.entries(barajas).map(([bId, bObj]) => (
											<option key={bId} value={bId}>{bObj.nombre}</option>
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
