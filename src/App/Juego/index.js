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
      <Row>
        <div className="col align-self-start">
            <div>
              <BackButton className="juego-back" />
            </div>
        </div>
        <div className="placeholderCard d-flex">
          <div className="winCard">
            <div>HOW TO WIN</div>
          </div>
        </div>
      </Row>
      <Row>
        <div className="col">
          <Tabla
            g={g}
            tabla={g.tabla}
            dimension={tablaDimension}
            marcar={marcar}
            marcadas={marcadas}
          />
        </div>
      </Row>
      <Row>
        <div className="text-center d-flex">
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
        <div className="d-flex">
          <Button className="loteria" onClick={() => g.verificar()}>
            {baraja.botones.ganar}
          </Button>
        </div>
      </Row>
    </Stack>
  </div>
);

export default Juego;
