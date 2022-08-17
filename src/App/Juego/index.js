import React from "react";
import Tabla from "./Tabla";
import BackButton from "../Common/BackButton";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import Sound from "./Sound";

const Juego = ({
  g,
  baraja,
  cartaCantada,
  tablaDimension,
  marcar,
  marcadas,
  ganador,
  playAudio
}) => (
  <div className="juego">
    <Stack direction="horizontal">
      <div className="col-3 align-self-start">
        <div>
          <BackButton className="juego-back" />
        </div>
      </div>
      <div className="col-3 ms-auto justify-content-center text-center d-flex">
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
    </Stack>
    <Row>
      <div className="col-8 justify-content-center text-center d-flex">
        <Tabla
          g={g}
          tabla={g.tabla}
          dimension={tablaDimension}
          marcar={marcar}
          marcadas={marcadas}
        />
      </div>
    </Row>
    <Button className="loteria col-3" onClick={() => g.verificar()}>
      {baraja.botones.ganar}
    </Button>
  </div>
);

export default Juego;
