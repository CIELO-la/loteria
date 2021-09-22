const Cuadros = ({ jugadores }) => (
	<div className="cuadros-jugadores">
		{jugadores.map(jugador => (
			<div
				key={jugador[0]}
				className="cuadro-jugador"
				style={{backgroundColor: jugador[1]}}
			></div>
		))}
	</div>
);

export default Cuadros;
