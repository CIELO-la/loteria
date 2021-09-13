import React from 'react';
import Tabla from './Tabla';

const Juego = ({ g, cartaCantada, playerId, tablaDimension, marcar, marcadas }) => (
	<>
		<div>{g.isHost ? `HOST` : `GUEST`}</div>
		<div>
			{cartaCantada && cartaCantada.nombre
				? <div>{cartaCantada.nombre}</div>
				: <div>¡Corre y se va!</div>
			}
		</div>
		<div>
			<Tabla
				g={g}
				playerId={playerId}
				tabla={g.tablas[playerId]}
				dimension={tablaDimension}
				marcar={marcar}
				marcadas={marcadas}
			/>
			<button onClick={() => g.verificar(playerId)}>¡¿pues gané?!</button>
		</div>
	</>
);

export default Juego;
