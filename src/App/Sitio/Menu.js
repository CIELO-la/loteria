import { useState } from "react";
import { Link } from "react-router-dom";
import { v4 as uuid4 } from "uuid";
import { useTranslation } from "react-i18next";
import Idiomas from "./Idiomas";
import Button from 'react-bootstrap/Button';

const Menu = ({
  hostGame,
  joinGame,
  gameId,
  handleBarajaIdInput,
  handleGameIdInput,
  barajaId,
  barajas,
}) => {
  const { t } = useTranslation();

  // temp gameId if hosting a new game
  const newGameId = uuid4();

  // toggle flow for displaying/hiding button options
  const [isLanguaging, setLanguaging] = useState(false);
  const prepareLanguaging = (e) => {
    e.preventDefault();
    setLanguaging(!isLanguaging);
  };
  const changeBaraja = (e) => {
    setLanguaging(false);
    handleBarajaIdInput(e);
  };
  // const [isJoining, setJoining] = useState(false);
  // const prepareJoin = e => {
  // 	e.preventDefault();
  // 	setJoining(!isJoining);
  // };

  const baraja = barajas[barajaId];

  return (
    <div>
      <ul className="menu-enlaces">
        <li>
          <Link to={`/${newGameId}`} onClick={(e) => hostGame(e, newGameId)}>
            <Button>
              {t("crearJuego")}
            </Button>
          </Link>
        </li>
        {/* // Unirse
					<li>
						<Link
							to={`/${gameId}`}
							onClick={isJoining && gameId
								? joinGame
								: prepareJoin
							}
						>
							<input type="button" value="Unirse" />
						</Link>
						{isJoining && (
							<div>
								<label>
									gameId:
									<input
										type="text"
										value={gameId}
										onChange={handleGameIdInput}
									/>
								</label>
							</div>
						)}
					</li>
				*/}
        {/* // Buscar
					<li>
						<Link to="/buscar">
							<input type="button" value="Buscar" />
						</Link>
					</li>
				*/}
        <li>
          {!isLanguaging ? (
            <Link to="/" onClick={prepareLanguaging}>
              <Button variant="light">
                {`${t("baraja")}: ${baraja.nombre}`} 
              </Button>
            </Link>
          ) : (
            <div>
              <label>
                <select onChange={changeBaraja} value={barajaId}>
                  {Object.entries(barajas).map(([bId, bObj]) => (
                    <option key={bId} value={bId}>
                      {bObj.nombre}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}
        </li>
      </ul>
      <Idiomas />
    </div>
  );
};

export default Menu;
