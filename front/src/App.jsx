import { useEffect } from 'react';
import { Button, NavDropdown } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom'; 
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function App() {

  // Cerrar sesión
  const cerrarTurno = () => {
    localStorage.removeItem('nombreUsuario');
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiration');
    navigate('/');
  };

  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenExpiration = () => {
      const tokenExpiration = localStorage.getItem('tokenExpiration');

      if (tokenExpiration) {
        const currentTime = new Date().getTime(); // Obtener el tiempo actual en milisegundos

        if (currentTime >= tokenExpiration) {
          // Token ha expirado
          Swal.fire({
            icon: 'warning',
            title: 'Sesión expirada',
            text: 'Tu sesión ha expirado. Por favor, iniciá sesión nuevamente.',
            confirmButtonText: 'OK'
          }).then(() => {
            // Limpiar el almacenamiento local y redirigir al login
            localStorage.removeItem('token');
            localStorage.removeItem('tokenExpiration');
            localStorage.removeItem('nombreUsuario')
            navigate('/'); // Redirigir al login
          });
        }
      }
    };

    checkTokenExpiration(); // Verificamos la expiración del token

    // Hacemos esto cada 30 segundos, por ejemplo, para verificar si el token sigue válido
    const interval = setInterval(checkTokenExpiration, 30000); // Verifica cada 30 segundos

    // Limpiamos el intervalo cuando el componente se desmonta
    return () => clearInterval(interval);
  }, [navigate]);


  return (
    <>
      <Navbar className="nobel-navbar" style={{ backgroundColor: '#9e5959' }}>
  <Container>
    <Navbar.Brand as={Link} to="/venta">FARMACIA NOBEL</Navbar.Brand>
    <Nav className="me-auto">
      <Nav.Link as={Link} to="/venta" className="text-white">VENTA</Nav.Link>
      <Nav.Link as={Link} to="/productos" className="text-white">PRODUCTOS</Nav.Link>
      <Nav.Link as={Link} to="/categoria" className="text-white">CATEGORIAS</Nav.Link>
      <Nav.Link as={Link} to="/clientes" className="text-white">CLIENTES</Nav.Link>
      <Nav.Link as={Link} to="/usuarios" className="text-white">USUARIOS</Nav.Link>
      <Nav.Link as={Link} to="/droguerias" className="text-white">DROGUERIAS</Nav.Link>
      <Nav.Link as={Link} to="/metodopago" className="text-white">METODO PAGO</Nav.Link>
      <Nav.Link as={Link} to="/stock" className="text-white">STOCK</Nav.Link>

      {/* Desplegable para COMPRAS */}
      <NavDropdown title="COMPRAS" id="nav-dropdown-compras">
        <NavDropdown.Item as={Link} to="/compra">REGISTRAR COMPRA</NavDropdown.Item>
        <NavDropdown.Item as={Link} to="/detallecompra">DETALLE COMPRA</NavDropdown.Item>
      </NavDropdown>
    </Nav>

    <Button variant="outline-light" onClick={cerrarTurno}>
      CERRAR TURNO
    </Button>
  </Container>
</Navbar>
    </>
  )
}


export default App

