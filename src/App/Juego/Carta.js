import React from "react";

export const Carta = ({ carta, slot, marcar, marcada, componible, printView }) => {
  const buttonOpts = marcar ? {"onClick": () => marcar(slot)} : {}
  
  return (
    <td>
      <button
        className={`carta-button ${componible ? `background-${carta.color}` : ""} carta-button-grida`}
        disabled={marcada}
        {...buttonOpts}
        style={marcar ? {} : {cursor: "auto"}}
      >
        { componible
          ? <>
              <p className="carta-numero">
                {carta.id}
              </p>
              <img
              className={`carta-imagen ${marcada ? "carta-marcada" : ""}`}
              src={carta.imagen}
              alt={carta.nombre}
              />
              <p className="carta-nombre">
                {carta.nombre}
              </p>
            </>
          : <img
              className={`carta-imagen ${marcada ? "carta-marcada" : ""}`}
              src={carta.imagen}
              alt={carta.nombre}
            />
        }

      </button>
    </td>
  )
};
