const Cuadros = ({ jugadores, ganador }) => (
  <div className="cuadros-jugadores col-4">
    {jugadores.map((jugador) => (
      <div className="jugador" key={jugador[0]}>
        <div
          className={`cuadro-jugador ${
            ganador && jugador[0] === ganador ? "cuadro-ganador" : ""
          }`}
          style={{ backgroundColor: jugador[1] }}
        ></div>
        <div className="jugador-id">{jugador}</div>
      </div>
    ))}
  </div>
);

export default Cuadros;
