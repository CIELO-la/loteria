const Lobby = ({ estatusActual, iniciar }) => (
	<div>
		<p>Lobby</p>
		<p>estatus: {estatusActual}</p>
		<button onClick={iniciar}>iniciar</button>
	</div>
);

export default Lobby;
