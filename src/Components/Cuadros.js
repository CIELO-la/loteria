const Cuadros = ({ jugadores, ganador }) => (
	<div className="cuadros-jugadores">
		{jugadores.map(jugador => (
			<div
				key={jugador[0]}
				className={`cuadro-jugador ${ganador && jugador[0] === ganador ? 'cuadro-ganador' : ''}`}
				style={{backgroundColor: jugador[1]}}
			></div>
		))}
	</div>
);

export default Cuadros;
