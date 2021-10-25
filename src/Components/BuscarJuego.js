import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BuscarJuego = (g, conectar) => {
	const [gameList, setGameList] = useState([]);

	// wrap db search
	const buscar = async () => {
		if (!g) {
			return;
		}
		if (!g.deposito) {
			await g.conectar();
		}
		console.log(g);
		const newList = await g.buscar(n => {});
		setGameList(newList);
	};

	console.log(gameList);

	useEffect(() => {
		buscar();
	}, [g]);

	return (
		<div>
			{!g
				? <p>TAREA: buscar juego</p>
				: <p>{gameList[0]}</p>
			}
			<Link to="/">volver</Link>
		</div>
	);
};

export default BuscarJuego;
