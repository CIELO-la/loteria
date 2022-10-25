import { Carta } from "../Juego/Carta";
import { barajas } from "../../Loteria/barajas";

const groupArrayByCount = (list, count) => {
  return list.reduce((a, c, i) => {
    return i % count === 0 ? a.concat([list.slice(i, i + count)]) : a;
  }, []);
};

const DownloadDeck = () => {
  document.body.style.backgroundColor = "white";
  const dillaXhonBaraja = barajas.za01;
  const cartas = Object.entries(dillaXhonBaraja.cartas);
  const rowsOfCartas = groupArrayByCount(cartas, 4);
  const pages = groupArrayByCount(rowsOfCartas, 3);

  return (
    <>
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

export default DownloadDeck;
