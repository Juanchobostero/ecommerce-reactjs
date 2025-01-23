const ComprarButton = () => {
    const handleRedirect = () => {
      // Redirige al catálogo de productos
      window.location.href = '/catalogo';
    };
  
    return (
      <button
        onClick={handleRedirect}
        style={{
          backgroundColor: '#f5c16c', // Color cálido similar al caramelo
          color: '#fff', // Texto blanco para contraste
          border: 'none',
          borderRadius: '8px',
          padding: '15px 40px',
          fontSize: '24px',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'all 0.3s ease-in-out',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#d9a65c'; // Más oscuro al hover
          e.target.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#f5c16c'; // Regresa al color original
          e.target.style.transform = 'scale(1)';
        }}
      >
        COMPRAR
      </button>
    );
  };
  
  export default ComprarButton;
  