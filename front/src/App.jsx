import { useEffect } from 'react';
import { Button, NavDropdown } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom'; 
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faDoorOpen, faFileAlt, faShoppingCart, faUsers, faBoxOpen, faTags, faUser, faClinicMedical, faTools, faChartPie, faCashRegister, faHandshake } from '@fortawesome/free-solid-svg-icons';

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
    <Navbar className="nobel-navbar px-3" style={{ backgroundColor: '#9e5959' }}>
  <Container fluid className="d-flex justify-content-between align-items-center">
    <Navbar.Brand as={Link} to="/venta" className="text-white fw-bold me-4">
      FARMACIA NOBEL
    </Navbar.Brand>


    <Nav className="d-flex align-items-center gap-3 flex-nowrap">
     <Nav.Link as={Link} to="/venta" className="text-white">
        <FontAwesomeIcon icon={faCashRegister} className="me-2" /> VENTA
     </Nav.Link>

      <Nav.Link as={Link} to="/stock" className="text-white">
        <FontAwesomeIcon icon={faBoxOpen} /> STOCK
      </Nav.Link>

    {/* DROPDWON DE COMPRAS */}
     <NavDropdown title={<><FontAwesomeIcon icon={faShoppingCart} className="me-2" />COMPRAS</>} id="nav-dropdown-compras">
        <NavDropdown.Item as={Link} to="/compra">
          <FontAwesomeIcon icon={faCashRegister} className="me-2" />
          REGISTRAR COMPRA
        </NavDropdown.Item>
        <NavDropdown.Item as={Link} to="/detallecompra">
          <FontAwesomeIcon icon={faFileAlt} className="me-2" />
          DETALLE COMPRA
        </NavDropdown.Item>
      </NavDropdown>

    {/* DROPDOWN DE CREDITOS */}
      <NavDropdown title={<><FontAwesomeIcon icon={faCreditCard} className="me-2" />CRÉDITOS</>} id="nav-dropdown-compras">
        <NavDropdown.Item as={Link} to="/creditosc">
          <FontAwesomeIcon icon={faUsers} className="me-2" /> CLIENTES
        </NavDropdown.Item>
        <NavDropdown.Item as={Link} to="/creditosp">
          <FontAwesomeIcon icon={faHandshake} className="me-2" /> PROVEEDORES
        </NavDropdown.Item>
      </NavDropdown>

    {/* DROPDOWN DE CRUDS */}
      <NavDropdown title={<><FontAwesomeIcon icon={faTools} className='me-2'/>CONFIGURACION</>} id="nav-dropdown-configuracion">
        <NavDropdown.Item as={Link} to="/productos">
          <FontAwesomeIcon icon={faBoxOpen} /> PRODUCTOS
        </NavDropdown.Item>
        <NavDropdown.Item as={Link} to="/categoria">
          <FontAwesomeIcon icon={faTags} /> CATEGORIAS
        </NavDropdown.Item>
        <NavDropdown.Item as={Link} to="/usuarios">
          <FontAwesomeIcon icon={faUsers} /> USUARIOS
        </NavDropdown.Item>
        <NavDropdown.Item as={Link} to="/clientes">
          <FontAwesomeIcon icon={faUser} /> CLIENTES
        </NavDropdown.Item>
        <NavDropdown.Item as={Link} to="/droguerias">
          <FontAwesomeIcon icon={faClinicMedical} /> DROGUERIAS
        </NavDropdown.Item>
        <NavDropdown.Item as={Link} to="/metodopago">
          <FontAwesomeIcon icon={faCreditCard} /> METODOS DE PAGO
        </NavDropdown.Item>
      </NavDropdown>

    {/* DROPDOWN DE REPORTES */}
      <NavDropdown title={<><FontAwesomeIcon icon={faChartPie} className='me-2' />AUDITORIAS</>} id="nav-dropdown-reportes">
        <NavDropdown.Item as={Link} to="/reportes">REPORTE COMPRA</NavDropdown.Item>
      </NavDropdown>
    </Nav>


    <Button variant="outline-light" onClick={cerrarTurno}>
      <FontAwesomeIcon icon={faDoorOpen} className="me-2" />
        CERRAR TURNO
    </Button>
  </Container>
</Navbar>
    </>
  )
}


export default App

