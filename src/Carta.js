import React from 'react';

export const Carta = ({ cartaId, carta, estilo, marcar }) => {
	return (
		<td
			key={cartaId}
			style={estilo}
			onClick={marcar(cartaId)}
		>{carta}</td>
	);
};
