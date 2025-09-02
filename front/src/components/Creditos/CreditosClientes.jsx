import { useState, useEffect, useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Modal, Table } from 'react-bootstrap'
import { DataContext } from '../../context/DataContext'
import { faCheck, faDollar, faEye } from '@fortawesome/free-solid-svg-icons'
import { formatCurrency } from '../Utils/formatCurrency'
import axios from 'axios'
import Swal from 'sweetalert2'
import App from '../../App'
import Paginacion from '../Common/Paginacion'
import { QRCodeCanvas } from "qrcode.react";


const CreditosClientes = () => {

//ESTADOS
const [clientes, setClientes] = useState([])
const [detalleCliente, setDetalleCliente] = useState([])
const [montoCredito, setMontoCredito] = useState('')
const [telefono, setTelefono] = useState('')
const [idCliente, setIdCliente] = useState('')
const [nombreCliente, setNombreCliente] = useState('')
const [domicilioCliente, setDomicilioCliente]= useState('')
const [clienteEncontrado, setClienteEncontrado] = useState(0)
const [showModalClientes, setShowModalClientes] = useState(false)
const [ordenSeleccionada, setOrdenSeleccionada] = useState(null)


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
        setClienteEncontrado(1);
        setShowModalClientes(false)
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
        <Button onClick={handleShowModalClientes} style={{backgroundColor: '#ff5e5e', border: 'none', marginTop: '35px'}}> MOSTRAR CLIENTES</Button>
      </div>


        <Modal show={showModalClientes} onHide={handleCloseModalClientes}>
          <Modal.Header closeButton>
            <Modal.Title>VER ESTADO DE CUENTA CLIENTES</Modal.Title>
          </Modal.Header>
        <Modal.Body>
          <input value={buscarcliente} onChange={buscador} type="text" placeholder='Busca un cliente...' className='form-control'/>
          <div className='container-table'>
            <table className='table-striped table-hover mt-2 shadow-lg custom-table'>
              <thead className='custom-table-header'>
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
                      <Button variant='danger'>
                        <FontAwesomeIcon icon={faDollar} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

        {/* TABLA DEL DETALLE DEL CLIENTE */}
    {clienteEncontrado === 1 && (
    <div className="container mt-4">
   <h4 className="mb-4 text-center fw-bold">
      DETALLE DEL CLIENTE
   </h4>

<div className="card shadow-lg border-0 rounded-4 p-4">
  <div className="card-body">
    <div className="row align-items-center">
      {/* Columna izquierda: Datos del cliente */}
      <div className="col-md-7 mb-3 mb-md-0">
        <p className="mb-2">
          <strong className="text-secondary">NOMBRE:</strong> {nombreCliente}
        </p>
        <p className="mb-2">
          <strong className="text-secondary">TELÉFONO:</strong> {telefono}
        </p>
        <p className="mb-2">
          <strong className="text-secondary">DOMICILIO:</strong> {domicilioCliente}
        </p>
        <p className="fs-5 fw-semibold text-danger mb-0">
          SALDO PENDIENTE: {formatCurrency(montoCredito)}
        </p>
      </div>

      {/* Columna derecha: QR de WhatsApp */}
      <div className="col-md-5 text-center">
        <h6 className="fw-bold text-success mb-3">
          Escaneá para hablar por WhatsApp 
        </h6>
        <div className="d-inline-block p-3 bg-light rounded-3 shadow-sm">
          <QRCodeCanvas
            value={`https://wa.me/54${telefono}?text=Hola ${nombreCliente}, me comunico sobre tu estado de cuenta, tu saldo pendiente a la fecha es de: ${formatCurrency(montoCredito)}, regulariza lo antes posible.`}
            size={140}
            bgColor="#ffffff"
            fgColor="#198754"
            level="H"
            imageSettings={{
            src: '/wp-icon.png', 
            x: null,                
            y: null,
            height: 32,             
            width: 32,               
            excavate: false         
          }}
          />
        </div>
      </div>
    </div>
  </div>
</div>

<br />
    <h5 className="mt-4">Ventas y movimientos</h5>
   <table className='table table-striped table-hover  shadow-lg custom-table'>
   <thead className="custom-table-header">
    <tr>
      <th>FOLIO</th>
      <th>FECHA</th>
      <th>PRODUCTOS</th>
      <th>CANTIDAD</th>
      <th>TOTAL VENTA</th>
      <th>TOTAL DEUDA</th>
      <th>COBRAR</th>
    </tr>
  </thead>
  <tbody>
    {detalleCliente.map((venta, index) => (
      <tr key={index}>

        {/* Id venta */}
        <td>{venta.Id_venta}</td>

        {/* Fecha */}
        <td>{new Date(venta.fecha_registro).toLocaleDateString()}</td>

        {/* Columna productos */}
        <td>
          <ul style={{ marginBottom: 0, paddingLeft: "20px" }}>
            {venta.productos.map((prod, i) => (
              <li key={i}>{prod.nombre_producto}</li>
            ))}
          </ul>
        </td>

        {/* Columna cantidades */}
        <td>
          <ul style={{ marginBottom: 0, paddingLeft: "20px" }}>
            {venta.productos.map((prod, i) => (
              <li key={i}>{parseInt(prod.cantidadVendida)}</li>
            ))}
          </ul>
        </td>

        {/* Total */}
        <td>{formatCurrency(venta.precioTotal_Venta)}</td>
        
        {/* Falta pagar */}
        <td>{formatCurrency(venta.faltaPagar)}</td>
      

        {/* Boton para cobrar */}
        <td>
          <Button onClick={() => setOrdenSeleccionada(venta)}>
            <FontAwesomeIcon icon={faCheck}/>
          </Button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
  </div>
)}

{/* ORDEN DE COBRO SELECCIONADA */}
{ordenSeleccionada && (
  <div className="mt-5">
    <h5 className="fw-bold text-primary">
      Orden de cobro seleccionada: {ordenSeleccionada.Id_venta}
    </h5>
    <table className="table table-bordered table-striped mt-3 shadow-sm">
      <thead>
        <tr>
          <th>PRODUCTOS</th>
          <th>CANTIDAD</th>
          <th>Precio Unitario</th>
          <th>Subtotal</th>
        </tr>
      </thead>
      <tbody>
        {ordenSeleccionada.productos.map((prod, idx) => (
          <tr key={idx}>
            <td>{prod.nombre_producto}</td>
            <td>{parseInt(prod.cantidadVendida)}</td>
            <td>{formatCurrency(prod.precio_caja)}</td>
            <td>{formatCurrency(prod.cantidadVendida * prod.precio_caja)}</td>
          </tr>
        ))}
        <tr>
          <td colSpan={3} className="fw-bold text-end">Total</td>
          <td className="fw-bold text-success">
            {formatCurrency(ordenSeleccionada.precioTotal_Venta)}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
)}

    </>
  )
}

export default CreditosClientes