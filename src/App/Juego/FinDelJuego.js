import React from "react";

const FinDelJuego = ({ jugadorId, ganador }) => {
  const isWinner = ganador === jugadorId;
  return(
    <div>
      {isWinner
        ? <p>You won!</p>
        : <p>You lost!</p>
      }
    </div>
  )
};

export default FinDelJuego;
