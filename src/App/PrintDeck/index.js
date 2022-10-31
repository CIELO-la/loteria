import { Carta } from "../Juego/Carta";
import { barajas } from "../../Loteria/barajas";
import Button from "react-bootstrap/Button";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

const groupArrayByCount = (list, count) => {
  return list.reduce((a, c, i) => {
    return i % count === 0 ? a.concat([list.slice(i, i + count)]) : a;
  }, []);
};

const PrintDeck = () => {
  const { t } = useTranslation();
  const history = useHistory();

  document.body.style.backgroundColor = "white";
  const dillaXhonBaraja = barajas.za01;
  const cartas = Object.entries(dillaXhonBaraja.cartas);
  const rowsOfCartas = groupArrayByCount(cartas, 4);
  const pages = groupArrayByCount(rowsOfCartas, 3);

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
            className="pagebreak tabla-printable"
            key={`table-${i}`}
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

export default PrintDeck;
