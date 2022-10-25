import { Carta } from "../Juego/Carta";
import { barajas } from "../../Loteria/barajas";

const DownloadDeck = () => {
    document.body.style.backgroundColor = "white"
    const dillaXhonBaraja = barajas.za01
    const cartas = Object.entries(dillaXhonBaraja.cartas)
    const res = cartas.reduce((a, c, i) => {
        return i % 2 === 0 ? a.concat([cartas.slice(i, i + 2)]) : a;
      }, []);

    // const middleIndex = Math.ceil(cartas.length / 2);

    // const firstHalf = cartas.splice(0, middleIndex);   
    // const secondHalf = cartas.splice(-middleIndex);
    return(
        <table id="tabla">
            <tbody>
                {res.map(row => {
                    return(
                        <tr>
                             {row.map(([cartaId, carta], i) => {
                                return(
                                    <div className="carta-printable">
                                        <Carta
                                            key={`carta-${cartaId}`}
                                            carta={carta}
                                            componible={true}
                                            printView={true}
                                        />
                                    </div>
                                )
                            })}    
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

export default DownloadDeck;
