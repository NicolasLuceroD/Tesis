import { useState, useEffect, useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Modal, Table } from 'react-bootstrap'
import axios from 'axios'
import Swal from 'sweetalert2'
import App from '../../App'
import Paginacion from '../Common/Paginacion'
import { DataContext } from '../../context/DataContext'
import { faDollar, faEye } from '@fortawesome/free-solid-svg-icons'

const CreditosClientes = () => {

//ESTADOS
const [clientes, setClientes] = useState([])
const [detalleCliente, setDetalleCliente] = useState([])
const [montoCredito, setMontoCredito] = useState('')
const [telefono, setTelefono] = useState('')
const [idCliente, setIdCliente] = useState('')
const [nombreCliente, setNombreCliente] = useState('')
const [domicilioCliente, setDomicilioCliente]= useState('')
const [showModalClientes, setShowModalClientes] = useState(false)


//FILTRO BUSCAR CLIENTE
const [buscarcliente, setBuscarCliente] = useState('')
const [ver, setVer] = useState([])

//URL
const { URL } = useContext(DataContext)

const handleShowModalClientes = () => setShowModalClientes(true)
const handleCloseModalClientes = () => setShowModalClientes(false)




//TRAER CLIENTES
const verClientes = () => {
  axios.get(`${URL}clientes/verClientes`).then((response) => {
    console.log('Clientes: ', response.data)
    setClientes(response.data)
    setVer(response.data)
    setTotal(response.data.length)
  }).catch((err) =>{
    console.error('Error al traer clientes', err)
  })
}

//TRAER EL DETALLE DEL CLIENTE
const obtenerDetalleClienteVenta = (Id_cliente) => {
  axios.get(`${URL}credito/verElCreditoCompleto/${Id_cliente}`)
    .then((response) => {
      console.log('Respuesta del backend:', response.data)
      if (response.data.length === 0) {
        Swal.fire('No hay deudas pendientes', '', 'info');
      } else {
        setDetalleCliente(response.data);
        setMontoCredito(response.data[0].cliente.monto_credito);
        setTelefono(response.data[0].cliente.telefono_cliente);
        setIdCliente(response.data[0].cliente.Id_cliente); 
        setNombreCliente(response.data[0].cliente.nombre_cliente);
        setDomicilioCliente(response.data[0].cliente.domicilio_cliente);
        // setClienteEncontrado(1);
        // setEstadoCredito(0);
      }
    })
    .catch((error) => {
      console.log('error al obtener el detalle', error);
    });
};



//FILTRO POR NOMBRE USUARIO
  const buscador = (e) => {
    setBuscarCliente(e.target.value);
  };

// Filtrar productos
  const clientesFiltrados = clientes.filter((dato) =>
    dato.nombre_cliente.toLowerCase().includes(buscarcliente.toLowerCase())
  );


//PAGINACION
const clientesporpagina = 5
const [actualPagina, setActualPagina] = useState(1)
const [total, setTotal] = useState(0)
const ultimoIndex = actualPagina * clientesporpagina;
const primerIndex = ultimoIndex - clientesporpagina;


//USEEFFECT
useEffect(()=>{
  verClientes()
},[])


  return (
    <>
      <App/>
      <div className="h3-subtitulos">
        <h3>CREDITOS CLIENTES</h3>
      </div><br />

      <div style={{textAlign: 'center', marginTop: '10px'}}>
        <h3>ADMINISTRA LOS ESTADOS DE CUENTA DE TUS CLIENTES</h3>
        <h5>Lleva un control de los pagos parciales y totales de los clientes.</h5>
      </div>

      <Button onClick={handleShowModalClientes} style={{backgroundColor: '#ff5e5e', border: 'none'}}> MOSTRAR CLIENTES</Button>
        <Modal show={showModalClientes} onHide={handleCloseModalClientes}>
          <Modal.Header closeButton>
            <Modal.Title>VER ESTADO DE CUENTA CLIENTES</Modal.Title>
          </Modal.Header>
        <Modal.Body>
          <input value={buscarcliente} onChange={buscador} type="text" placeholder='Busca un cliente...' className='form-control'/>
          <div className='container-table'>
            <Table>
              <thead className='custom-table'>
                <tr>
                  <th>NOMBRE</th>
                  <th>CREDITOS</th>
                  <th>MOVIMIENTOS</th>
                </tr>
              </thead>
              <tbody>
                {clientesFiltrados.slice(primerIndex,ultimoIndex).map((cli) => (
                  <tr key={cli.Id_cliente}>
                    <td>{cli.nombre_cliente}</td>
                    <td>
                      <Button onClick={() => obtenerDetalleClienteVenta(cli.Id_cliente)}>
                        <FontAwesomeIcon icon={faEye}/>
                      </Button>
                    </td>
                    <td>
                      <Button>
                        <FontAwesomeIcon icon={faDollar} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div style={{display:'flex',justifyContent:'center', marginTop: '10px'}}>
                <Paginacion productosPorPagina={clientesporpagina}
                    actualPagina={actualPagina}
                    setActualPagina={setActualPagina}
                    total={total}
                />
            </div>
          </div>
        </Modal.Body>
        </Modal>
    </>
  )
}

export default CreditosClientes