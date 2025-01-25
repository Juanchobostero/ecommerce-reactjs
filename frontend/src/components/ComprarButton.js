import { Button } from "react-bootstrap";

const ComprarButton = () => {
  const toProducts = () => {
    window.location.href = "/catalogo";
  };

  return (
    <div className="d-flex justify-content-center mt-4">
      <Button
        onClick={() => toProducts()}
        className="bg-amber-600"
        style={{
          padding: "1rem 2rem",
          fontSize: "1rem",
        }}
      >
        COMPRAR
      </Button>
    </div>
  );
};

export default ComprarButton;
