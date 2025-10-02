import { useEffect,useContext } from 'react';
import { Button, NavDropdown } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom'; 
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faDoorOpen, faFileAlt, faShoppingCart, faUsers, faBoxOpen, faTags, faUser, faClinicMedical, faTools, faChartPie, faCashRegister, faHandshake } from '@fortawesome/free-solid-svg-icons';
import { DataContext } from '../src/context/DataContext'
import axios from 'axios';
import { formatCurrency } from '../src/components/Utils/formatCurrency'

function App() {

//URL
const { URL } = useContext(DataContext)

//OBTENER APERTURA POR LOCAL STORAGE
const idApertura = localStorage.getItem('idApertura')

//CERRAR TURNO
const cerrarTurno = async () => {
  try {
    const idUsuario = localStorage.getItem('idUsuario');

    // 1️⃣ Traer total esperado de la caja
    const response = await axios.get(`${URL}caja/totalVentasDia/${idUsuario}/${idApertura}`);
    const totalEsperado = response.data.total_esperado;

    // 2️⃣ Mostrar Swal con total esperado y un input para monto real
    Swal.fire({
      title: 'Cierre de Turno',
      html: `<p>Total esperado en caja: <b>${formatCurrency(totalEsperado)}</b></p>`,
      input: 'number',
      inputLabel: 'Ingrese el monto contado en caja',
      inputAttributes: {
        min: 0,
        step: 0.01
      },
      showCancelButton: true,
      confirmButtonText: 'Registrar cierre',
      allowOutsideClick: false,
      inputValidator: (value) => {
        if (!value || value < 0) {
          return 'Debes ingresar un monto válido';
        }
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        const montoReal = parseFloat(result.value);
        const diferencia = totalEsperado - montoReal

        // 3️⃣ Enviar cierre de caja al backend
        await axios.post(`${URL}caja/registrarCierreCaja`, {
          Id_apertura: idApertura,
          monto_ventas: totalEsperado,
          monto_esperado: totalEsperado,
          monto_real: montoReal,
          diferencia: diferencia
        });

        Swal.fire({
          icon: 'success',
          title: 'Turno cerrado',
          text: `Cierre registrado correctamente.`,
          timer: 2500,
          showConfirmButton: false
        });

        // Limpiar sesión y redirigir
        localStorage.removeItem('nombreUsuario');
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiration');
        localStorage.removeItem('idApertura');
        localStorage.removeItem('idUsuario');
        navigate('/');
      }
    });

  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo cerrar el turno. Intente nuevamente.'
    });
  }
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
      <NavDropdown title={<><FontAwesomeIcon icon={faShoppingCart} className="me-2" />VENTAS Y DETALLE</>} id="nav-dropdown-ventas">
        <NavDropdown.Item as={Link} to="/venta">
          <FontAwesomeIcon icon={faCashRegister} className="me-2" />
          REGISTRAR VENTA
        </NavDropdown.Item>
        <NavDropdown.Item as={Link} to="/detalleventa">
          <FontAwesomeIcon icon={faFileAlt} className="me-2" />
          DETALLE VENTA
        </NavDropdown.Item>
      </NavDropdown>

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
        <NavDropdown.Item as={Link} to="/reporteventa">REPORTE VENTAS</NavDropdown.Item>
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

