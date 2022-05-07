import React from "react";
import Cuadros from "./Cuadros";
import Tabla from "./Tabla";

const Juego = ({
  g,
  baraja,
  cartaCantada,
  tablaDimension,
  marcar,
  marcadas,
  ganador,
}) => (
  <div className="juego">
    <Cuadros jugadores={g.jugadores} ganador={ganador} />
    <div>
      {cartaCantada && cartaCantada.nombre ? (
        <div>{cartaCantada.nombre}</div>
      ) : (
        <div>¡Corre y se va!</div>
      )}
    </div>
    <div>
      <Tabla
        g={g}
        tabla={g.tabla}
        dimension={tablaDimension}
        marcar={marcar}
        marcadas={marcadas}
      />
      <button onClick={() => g.verificar()}>{baraja.botones.ganar}</button>
    </div>
  </div>
);

export default Juego;
