const EditQuantity = ({ qty, onQtyChange }) => {
  const handleIncrease = () => {
    onQtyChange(qty + 1); // Incrementa y notifica al padre
  };

  const handleDecrease = () => {
    if (qty > 0) {
      onQtyChange(qty - 1); // Decrementa y notifica al padre
    }
  };

  return (
    <div
      className="inline-flex p-0 transform"
      style={{ transform: "translateY(-0.5rem)" }}
    >
      <button
        className="bg-gradient-to-br from-sky-500 to-sky-300 text-white font-bold rounded-sm text-sm p-1 text-center inline-flex items-center hover:scale-110 transition-transform"
        onClick={handleDecrease}
      >
        -
      </button>
      <input
        type="text"
        value={qty} // Muestra el valor proveniente del padre
        readOnly
        style={styles.input}
        aria-label="Quantity"
      />
      <button
        className="bg-gradient-to-br from-sky-500 to-sky-300 text-white font-bold rounded-sm text-sm p-1 text-center inline-flex items-center me-2 hover:scale-110 transition-transform"
        onClick={handleIncrease}
      >
        +
      </button>
    </div>
  );
};

const styles = {
  input: {
    textAlign: "center",
    width: "40px",
    border: "none",
    outline: "none",
    fontSize: "14px",
    background: "transparent",
  },
};

export default EditQuantity;
