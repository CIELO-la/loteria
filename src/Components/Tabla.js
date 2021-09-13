import React from 'react';
import { Carta } from './Carta';

const Tabla = ({ g, playerId, tabla, dimension, marcar, marcadas }) => {

	const estilo = {
		border: '1px solid #555',
		width: '50px',
		height: '50px',
		lineHeight: '50px',
		textAlign: 'center',
	};

	const anchura = Array(dimension).fill(null);

	return (
		<table id="tabla">
			<tbody>
				{anchura.map((_, i) => (
					<tr key={i}>
						{anchura.map((_, j) => {
							const slot = anchura.length * i + j;
							const cartaId = tabla[slot][0];
							return (
								<Carta
									key={`carta-${slot}`}
									carta={g.leerCarta(cartaId)}
									slot={slot}
									marcar={marcar}
									marcada={marcadas.includes(slot)}
									estilo={estilo}
								/>
							);
						})}
			 		</tr>
				))}
			</tbody>
		</table>
	);
};

export default Tabla;
