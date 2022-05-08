import { useTranslation } from "react-i18next";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Row from "react-bootstrap/Row";

const BarajaButton = ({ handleBarajaIdInput, barajaId, barajas }) => {
  const { t } = useTranslation();

  const baraja = barajas[barajaId];

  return (
    <Row>
      <DropdownButton
        variant="light"
        title={`${t("baraja")}: ${baraja.nombre}`}
      >
        {Object.entries(barajas).map(([bId, bObj]) => (
          <Dropdown.Item
            key={bId}
            value={bId}
            onClick={() => handleBarajaIdInput(bId)}
          >
            {bObj.nombre}
          </Dropdown.Item>
        ))}
      </DropdownButton>
    </Row>
  );
};

export default BarajaButton;
