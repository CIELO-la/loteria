const Cabecera = ({ mensaje }) => (
	<>
		<div className="header-titulo">Lotería</div>
		<div className="header-subtitulo">juego de cartas y de palabras</div>
		<div style={{color: 'gray', fontSize: 15, marginBottom: 20}}>{mensaje}</div>
	</>
);

export default Cabecera;
