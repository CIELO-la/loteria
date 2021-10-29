import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Busqueda = ({ g }) => {
	// fetch list of open games from game db
	const [gameList, setGameList] = useState([]);
	useEffect(() => (
		g && g.buscar(newList => setGameList(newList))
	), [g]);

	return (
		<div>
			<ul>
				{gameList.map(gameDoc => (
					<li key={gameDoc.id}>
						<Link to={`/${gameDoc.id}`}>
							baraja: {`${gameDoc.data().barajaId}`},
							estatus: {`${gameDoc.data().estatus}`},
							privado: {`${gameDoc.data().privado}`},
							jugadores: {`${gameDoc.data().jugadores.length}`}
						</Link>
					</li>
				))}
			</ul>
			<Link to="/">volver</Link>
		</div>
	);
};

export default Busqueda;
