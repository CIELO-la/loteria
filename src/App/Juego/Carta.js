import React from "react";

export const Carta = ({ carta, slot, marcar, marcada, componible, printView }) => {
  if (marcar) {
    return (
      <td>
        <button
          className={`carta-button ${componible ? `background-${carta.color}` : ""}`}
          disabled={marcada}
          onClick={() => marcar(slot)}
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
  } else {
    // Print view
    return (
      <td>
        <div
          className={`carta-button ${componible ? `background-${carta.color}` : ""} carta-button-printable`}
          disabled={marcada}
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
  
        </div>
      </td>
    )
  }
};
