import { useState, useEffect, useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Modal, Table } from 'react-bootstrap'
import { DataContext } from '../../context/DataContext'
import { faCheck, faDollar, faEye } from '@fortawesome/free-solid-svg-icons'
import { formatCurrency } from '../Utils/formatCurrency'
import { scrollToEnd } from '../Utils/scrollToEnd'
import { QRCodeCanvas } from "qrcode.react";
import { PdfPagosClientes } from '../../pdf/PdfPagosClientes'
import { OverlayTrigger, Popover } from 'react-bootstrap';
import ScrollToTopButton from '../Utils/ScrollToTopButton'
import jsPDF from 'jspdf';
import autoTable from "jspdf-autotable";
import axios from 'axios'
import Swal from 'sweetalert2'
import App from '../../App'
import Paginacion from '../Common/Paginacion'
import DatePicker from 'react-datepicker';
import es from 'date-fns/locale/es';
import logo from '../../assets/LogoNobel.jpg';

const CreditosClientes = () => {

//ESTADOS
const [clientes, setClientes] = useState([])
const [detalleCliente, setDetalleCliente] = useState([])
const [metodospago, setMetodosPago] = useState([])
const [movimientos, setMovimientos] = useState([])
const [montoCredito, setMontoCredito] = useState('')
const [telefono, setTelefono] = useState('')
const [idCliente, setIdCliente] = useState('')
const [nombreCliente, setNombreCliente] = useState('')
const [domicilioCliente, setDomicilioCliente]= useState('')
const [clienteEncontrado, setClienteEncontrado] = useState(0)
const [monto, setMonto] = useState('')
const [ordenSeleccionada, setOrdenSeleccionada] = useState(null)
const [metodopagoseleccionado, setMetodoPagoSeleccionado] = useState('')
const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());



//MODALES
const [showModalClientes, setShowModalClientes] = useState(false)
const [showModalMovimientos, setShowModalMovimientos] = useState(false)
const [showModalProductos, setShowModalProductos] = useState(false)


//FILTRO BUSCAR CLIENTE
const [buscarcliente, setBuscarCliente] = useState('')
const [ver, setVer] = useState([])

//URL
const { URL } = useContext(DataContext)

//LOCALSTORAGE
const idUsuario = localStorage.getItem('idUsuario')

//MODALES
const handleShowModalClientes = () => setShowModalClientes(true)
const handleCloseModalClientes = () => setShowModalClientes(false)

const handleShowModalProductos = () => setShowModalProductos(true)
const handleCloseModalProductos = () => setShowModalProductos(false)




//TRAER CLIENTES
const verClientes = () => {
  axios.get(`${URL}clientes/verClientes`).then((response) => {
    console.log('CLientes obtenidos de mi consulta: ',response.data)
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
      if (response.data.length === 0) {
        Swal.fire('No hay deudas pendientes', '', 'info');
        setDetalleCliente([])
        setOrdenSeleccionada(null)
        setClienteEncontrado(0)

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

//TRAER METODOS DE PAGO
const verMetodosDePago = () => {
  axios.get(`${URL}metodopago/verMetodoPago`).then((response) => {
    console.log('Metodos de p: ', response.data)
    setMetodosPago(response.data)
  }).catch((err) => {
    console.error('Error al traer los metodos de pago',err)
  })
}

//TRAER MOVIMIENTOS
const obtenerMovimientosCliente = (Id_cliente) => {
  const formattedDate = formatDate(fechaSeleccionada)
  axios.get(`${URL}clientes/verMovimientosClientes/${Id_cliente}/${formattedDate}`).then((response) => {
    console.log('Movimientos de clientes: ', response.data)
    setMovimientos(response.data)
  }).catch((err) => {
    console.error('Error al traer los movimientos' ,err)
    Swal.fire("Error", "No se pudieron cargar los movimientos", "error");
  })
}

//FORMATO DE FECHA
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

//ULTIMO DIA DEL MES
const lastDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

//REGISTRAR PAGO
const registrarPago = () => {
  if (!monto || monto <= 0) {
    Swal.fire("Error", "Debe ingresar un monto válido", "error");
    return;
  }
  if (!metodopagoseleccionado) {
    Swal.fire("Error", "Debe seleccionar un método de pago", "error");
    return;
  }

  Swal.fire({
    title: '¿Querés generar un PDF?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, imprimir',
    cancelButtonText: 'No',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#aaa'
  }).then((result) => {
    const generarPDF = result.isConfirmed;

    // 1️⃣ Registrar pago en pagosclientes
    axios.post(`${URL}credito/registrarPago/registrar`, {
      monto: monto,
      Id_metodoPago: parseInt(metodopagoseleccionado),
      Id_cliente: idCliente,
      Id_venta: ordenSeleccionada.Id_venta,
      Id_usuario: idUsuario,
      observacion: 'test'
    })
    .then(() => {
      // 2️⃣ Actualizar faltaPagar en ventas
      const nuevoFaltaPagar = ordenSeleccionada.faltaPagar - monto;

      return axios.put(`${URL}venta/actualizarFaltaPagar/${ordenSeleccionada.Id_venta}`, 
      {
        faltaPagar: nuevoFaltaPagar
      });
    })
    .then(() => {
      // 3️⃣ Actualizar monto_credito en clientes
      const nuevoCredito = montoCredito - monto;

      return axios.put(`${URL}clientes/actualizarCredito/${idCliente}`, {
        monto_credito: nuevoCredito
      });
    })
     // 4️⃣ Insertar movimiento en movimientosclientes
    .then(() => {
      return axios.post(`${URL}clientes/registrarmovimiento`, 
        {
          Id_cliente: idCliente,
          montoCredito: 0,
          montoDebito: monto,
          Saldo: montoCredito - monto,
          Id_venta: ordenSeleccionada.Id_venta 
        })
    })
    .then(() => {
      // Mostrar alerta de éxito
      Swal.fire("Éxito", "El pago se registró y las deudas se actualizaron", "success")
        .then(() => { 
          setClienteEncontrado(0);
          setMonto('');
          setMetodoPagoSeleccionado('');
          setOrdenSeleccionada(null);

        // Generar pdf
          if (generarPDF) {
            PdfPagosClientes({ 
              nombreCliente, 
              telefono, 
              monto, 
              ordenSeleccionada 
            });
          }
        });
    })
    .catch((err) => {
      console.error("Error en el proceso de registrar pago:", err);
      Swal.fire("Error", "No se pudo completar la operación", "error");
    });
  });
};

//ABRIR MODAL MOVIMIENTOS
const abrirModalMovimientos = (Id_cliente) => {
  setIdCliente(Id_cliente); 
  setShowModalMovimientos(true);
  obtenerMovimientosCliente(Id_cliente);
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
  verMetodosDePago()

  //validacion para llevar abajo la pag
  if (detalleCliente.length > 0 || ordenSeleccionada) {
    scrollToEnd()
  }

  if(showModalMovimientos && idCliente) {
    obtenerMovimientosCliente(idCliente)
  }
},[detalleCliente,ordenSeleccionada,fechaSeleccionada,showModalMovimientos])



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
                      <Button variant='danger' onClick={() => abrirModalMovimientos(cli.Id_cliente)}>
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
    <h5 className="mt-4">Ventas sin pagar</h5>
   <table className='table table-striped table-hover  shadow-lg custom-table'>
   <thead className="custom-table-header">
    <tr>
      <th>FOLIO</th>
      <th>FECHA</th>
      <th>PRODUCTOS</th>
      <th>CANTIDAD</th>
      <th>SUBTOTAL X PRODUCTO</th>
      <th>TIPO VENTA</th>
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


        {/* Subtotal x productos (precio aplicado) */}
        <td>
          <ul style={{ marginBottom: 0, paddingLeft: "20px" }}>
            {venta.productos.map((prod, i) => (
              <li key={i}>{formatCurrency(prod.precioAplicado)}</li>
            ))}
          </ul>
        </td>

        {/* Tipo venta */}
         <td>
          <ul style={{ marginBottom: 0, paddingLeft: "20px" }}>
            {venta.productos.map((prod, i) => (
              <li key={i}>{(prod.tipoVenta)}</li>
            ))}
          </ul>
        </td>
       

        {/* Total */}
        <td style={{backgroundColor: '#8aeb9aff', fontWeight: 'bold'}}>{formatCurrency(venta.precioTotal_Venta)}</td>
        
        {/* Falta pagar */}
        <td style={{backgroundColor: '#fc908cda'}}>{formatCurrency(venta.faltaPagar)}</td>
      

        {/* Boton para cobrar */}
        <td>
         <Button onClick={() => setOrdenSeleccionada(venta)}>
            <FontAwesomeIcon icon={faCheck} />
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
  <div className="container mt-5">

    {/* Título */}
    <div className="text-start mb-3">
      <h5>Orden de cobro seleccionada: {ordenSeleccionada.Id_venta}</h5>
    </div>

    {/* Método de pago */}
    <div className="mb-3">
      <div className="d-flex align-items-center gap-2">
        <p className="mb-1 fw-semibold">Método de pago:</p>
        <select className="form-select" style={{ width: '30%' }} value={metodopagoseleccionado} onChange={(e) => setMetodoPagoSeleccionado(e.target.value)}>
            <option value="">Seleccione un método de pago</option>
              {metodospago.filter((mp) => mp.Id_metodoPago !== 5).map((mp) => (
                  <option key={mp.Id_metodoPago} value={mp.Id_metodoPago}>
                    {mp.nombre_metodopago}
                  </option>
              ))}
          </select>
        <p className="mb-1 fw-semibold">Abona con:</p>
        <input className="form-control" type="number" style={{ width: '30%' }} placeholder='$0,00' value={monto} onChange={(e) => setMonto(Number(e.target.value))}/>
      </div>
    </div>

    {/* Tabla de productos */}
    <div className="table-responsive">
    <table className="table table-striped table-hover shadow-lg custom-table text-center">
        <thead className='custom-table-header'>
          <tr>
            <th>PRODUCTOS</th>
            <th>CANTIDAD</th>
            <th>PRESENTACION</th>
            <th>PRECIO PRESENTACIÓN</th>
            <th>SUBTOTAL</th>
          </tr>
        </thead>
        <tbody>
          {ordenSeleccionada.productos.map((prod, idx) => (
            <tr key={idx}>
              <td>{prod.nombre_producto}</td>
              <td>{parseInt(prod.cantidadVendida)}</td>
              <td>{prod.tipoVenta}</td>
              <td>{formatCurrency(prod.precioAplicado)}</td>
              <td><strong>{formatCurrency(prod.precioAplicado * prod.cantidadVendida)}</strong></td>
            </tr>
          ))}
          {/* Fila TOTAL DE LA VENTA */}
          <tr>
            <td colSpan={4} className="fw-bold text-end">TOTAL DE LA VENTA</td>
            <td className="fw-bold text-success">{formatCurrency(ordenSeleccionada.precioTotal_Venta)}</td>
          </tr>
          {/* Fila TOTAL DEUDA */}
          <tr>
            <td colSpan={4} className="fw-bold text-end">TOTAL DEUDA</td>
            <td className="fw-bold text-danger">{formatCurrency(ordenSeleccionada.faltaPagar)}</td>
          </tr>
        </tbody>
    </table>
    <div className='d-flex justify-content-center mt-5'>
      <Button onClick={registrarPago}>GENERAR ORDEN DE COBRO</Button>
    </div>
      
    </div>
  </div>
)}

{/* MODAL DE MOVIMIENTOS */}
<Modal show={showModalMovimientos} onHide={() => setShowModalMovimientos(false)} size="xl">
  <Modal.Header closeButton>
    <Modal.Title>Movimientos del Cliente</Modal.Title>
  </Modal.Header>
  <Modal.Body>
      <DatePicker
        selected={fechaSeleccionada}
        onChange={(date) => {
            setFechaSeleccionada(date)
        }}
        className='form-control custom-date-picker custom-datepicker-wrapper'
        dateFormat="yyyy/MM/d"
        locale={es}
        placeholderText='Ingrese una fecha'
        maxDate={lastDayOfMonth
        }
    />
    {movimientos.length > 0 ? (
      <table className="table table-striped table-hover shadow-lg custom-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>N Venta</th>
            <th>Crédito</th>
            <th>Débito</th>
            <th>Saldo</th>
            <th>Detalle</th>
          </tr>
        </thead>
        <tbody>
          {movimientos.map((mov) => (
            <tr key={mov.Id_movimientoCliente}>
              <td>{new Date(mov.fechaRegistro).toLocaleString()}</td>
              <td>{mov.Id_venta || "-"}</td>
              <td className="text-success fw-bold">
                {mov.Credito > 0 ? formatCurrency(mov.Credito) : "-"}
              </td>
              <td className="text-danger fw-bold">
                {mov.Debito > 0 ? formatCurrency(mov.Debito) : "-"}
              </td>
              <td className="fw-bold">{formatCurrency(mov.Saldo)}</td>
             <td>
                <OverlayTrigger
                  trigger="click"
                  placement="right"
                  rootClose
                  overlay={
                    <Popover id={`popover-${mov.Id_movimientoCliente}`}>
                      <Popover.Header as="h6">Productos de la venta</Popover.Header>
                      <Popover.Body>
                        {mov.productos && mov.productos.length > 0 ? (
                          mov.productos.map((prod, i) => (
                            <div key={i}>
                              • {prod.nombre_producto} ({parseInt(prod.cantidadVendida)} {prod.tipoVenta})
                            </div>
                          ))
                        ) : (
                          <div>No hay productos</div>
                        )}
                      </Popover.Body>
                    </Popover>
                  }
                >
                  <Button variant="success">VER</Button>
                </OverlayTrigger>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p className="text-center text-muted">No hay movimientos registrados.</p>
    )}
  </Modal.Body>
</Modal>
<ScrollToTopButton />
    </>
  )
}

export default CreditosClientes