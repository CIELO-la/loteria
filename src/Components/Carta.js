import React from 'react';

export const Carta = ({ carta, slot, marcar, marcada, estilo }) => (
	<td>
		<button
			disabled={marcada}
			onClick={() => marcar(slot)}
		>
			{carta.nombre}
		</button>
	</td>
);
