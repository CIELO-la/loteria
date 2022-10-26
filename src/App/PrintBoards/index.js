import { Carta } from "../Juego/Carta";
import { barajas } from "../../Loteria/barajas";
import Button from "react-bootstrap/Button";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";

const groupArrayByCount = (list, count) => {
  return list.reduce((a, c, i) => {
    return i % count === 0 ? a.concat([list.slice(i, i + count)]) : a;
  }, []);
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const PrintBoards = () => {
  const { t } = useTranslation();
  const history = useHistory();
  let { playerBoardCount } = useParams();

  document.body.style.backgroundColor = "white";
  const dillaXhonBaraja = barajas.za01;
  const cartas = Object.entries(dillaXhonBaraja.cartas);
  let pages = [];

  if (playerBoardCount) {
    for (let i = 0; i < playerBoardCount; i++) {
      const shuffledCartas = shuffleArray(cartas).slice(0, 16); // 16 cards per board
      const rowsOfCartas = groupArrayByCount(shuffledCartas, 4);
      pages.push(rowsOfCartas);
    }
  } else {
    const rowsOfCartas = groupArrayByCount(cartas, 4);
    pages = groupArrayByCount(rowsOfCartas, 4);
  }

  return (
    <>
      <div className="print-buttons">
        <Button
          variant={"light"}
          size="md"
          className="print-hidden print-button"
          onClick={() => window.print()}
        >
          🖨 {t("print")}
        </Button>
        <Button
          variant={"light"}
          size="md"
          className="print-hidden"
          onClick={() => history.push("/download")}
        >
          ← {t("back")}
        </Button>
      </div>
      {pages.map((page, i) => {
        return (
          <table
            id="tabla"
            className="pagebreak tabla-printable tabla-printable-sm"
            key={`table-${i}`}
            style={{ marginBottom: "8px" }}
          >
            <tbody>
              {page.map((row, j) => {
                return (
                  <tr key={`row-${j}`}>
                    {row.map(([cartaId, carta]) => {
                      return (
                        <Carta
                          key={`carta-${cartaId}`}
                          carta={carta}
                          componible={true}
                          printView={true}
                        />
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        );
      })}
    </>
  );
};

export default PrintBoards;
