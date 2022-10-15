import { useTranslation } from "react-i18next";
import { Carta } from "../Juego/Carta";
import { barajas } from "../../Loteria/barajas";

const DownloadDeck = ({}) => {
    const { t } = useTranslation();
    document.body.style.backgroundColor = "white"
    let dillaXhonBaraja = barajas.za01

    return(
        <table id="tabla">
            <tbody>
                <tr>
                    {Object.entries(dillaXhonBaraja.cartas).map(([cartaId, carta], i) => {
                        console.log(carta, "carta")
                        return(
                            <Carta
                                key={`carta-${cartaId}`}
                                carta={carta}
                                // slot={slot}
                                // marcar={marcar}
                                // marcada={marcadas.includes(slot)}
                                componible={true}
                            />
                        )
                    })}
                </tr>
            </tbody>
        </table>
    )
}

export default DownloadDeck;
