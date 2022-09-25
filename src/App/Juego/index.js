import React from "react";
import Tabla from "./Tabla";
import BackButton from "../Common/BackButton";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import Sound from "./Sound";
import FinDelJuego from "./FinDelJuego";

const Juego = ({
  g,
  jugadorId,
  baraja,
  cartaCantada,
  tablaDimension,
  marcar,
  marcadas,
  ganador,
  playAudio,
  winConditionHeader,
  winConditionText
}) => (
  <div className="juego">
    <Stack direction="horizontal">
      <Row className="winRow">
        <div>
          <BackButton className="juego-back" />
        </div>
        <div className="winCardHolder">
          <div className="winCard">
            <div>{winConditionHeader}</div>
            <div className="winCondition">
              <p className="winConditionText">{winConditionText}</p>
            </div>
          </div>
        </div>
      </Row>
      <Row>
        {ganador ? (
          <FinDelJuego
            jugadorId={jugadorId}
            ganador={ganador}
          />
        ) : (
          <></>
        )}
        <div className="col">
          <Tabla
            g={g}
            tabla={g.tabla}
            dimension={tablaDimension}
            marcar={marcar}
            marcadas={marcadas}
            componible={baraja.componible}
          />
        </div>
      </Row>
      <Row>
        <div className="cartaCantadaDiv">
          <div className="text-center">
            {cartaCantada && cartaCantada.nombre ? (
              <div>
                <img
                  className="cartaCantada"
                  src={cartaCantada.imagen}
                  alt={cartaCantada.nombre}
                />
                <Sound
                  playAudio={playAudio}
                  audioURI={cartaCantada.audio}
                />
              </div>
            ) : (
              <div className="juego-start-header">¡Corre y se va!</div>
            )}
          </div>
          <Button className="loteria" onClick={() => g.verificar()}>
            {baraja.botones.ganar}
          </Button>
        </div>
      </Row>
    </Stack>
  </div>
);

export default Juego;
