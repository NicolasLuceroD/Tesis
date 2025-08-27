import { Container, Row, Col, Form, Table, Button, Card } from 'react-bootstrap';
import { MDBInputGroup } from 'mdb-react-ui-kit';
import { useState, useEffect, useContext, useRef } from 'react';
import App from '../../App'
import { DataContext } from '../../context/DataContext';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollar, faFilePrescription, faSearch, faShoppingCart, faTrash } from '@fortawesome/free-solid-svg-icons';
import Paginacion from '../Common/Paginacion';
import { imprimirTicket } from '../Utils/ImprimirTicket';

const Venta = () => {

//URL
const { URL } = useContext(DataContext);

//ESTADOS
const [metodospago, setMetodosPagos] = useState([])
const [clientes, setClientes] = useState([])
const [productos, setProductos] = useState([])
const [clienteSeleccionado, setClienteSeleccionado] = useState(1)
const [metodopagoseleccionado, setMetodopagoseleccionado] = useState('')
const [buscarproducto, setBuscarProducto] = useState('')
const [carrito, setCarrito] = useState([])
const [montorecibido, setMontoRecibido] = useState('');
const [interes, setInteres] = useState('')
const [creditoActual, setCreditoActual] = useState(0)
const [idCliente, setId_Cliente] = useState(null)
const [limiteCredito, setLimiteCredito] = useState(0)
const [ver, setVer] = useState([]);

//OBTENER EL ID USUARIO QUE VIENE DEL LOCAL STORAGE
const idUsuario = localStorage.getItem('idUsuario')

const verMetodosPagos = () => {
  axios.get(`${URL}metodopago/verMetodoPago`).then((response) => {
    console.log('Metodos pagos: ', response.data)
    setMetodosPagos(response.data)
  }).catch((err)=> {
    console.error('Error al obtener los mp', err)
  })
}

const verClientes = () => {
  axios.get(`${URL}clientes/verClientes`).then((response) => {
    console.log('Clientes: ', response.data)
    setClientes(response.data)
  }).catch((err) => {
    console.error('Error al obtener los clientes', err)
  })
}

const verProductos = () => {
  axios.get(`${URL}productos/productosConStock`)
    .then((response) => {
      const agrupados = agruparProductosPorLote(response.data);
      setProductos(agrupados);
      setTotal(response.data.length)
    })
    .catch((err) => {
      console.error('Error al traer productos con lotes', err);
    });
};

//AGRUPAR PRODUCTOS POR LOTES
const agruparProductosPorLote = (data) => {
  return data.reduce((acc, item) => {
    const existente = acc.find(p => p.Id_producto === item.Id_producto);
    if (existente) {
      existente.lotes.push(item);
    } else {
      acc.push({
        Id_producto: item.Id_producto,
        nombre_producto: item.nombre_producto,
        codigobarras_producto: item.codigobarras_producto,
        precio_caja: item.precio_caja,
        precio_tira: item.precio_tira,     
        precio_unitario: item.precio_unitario, 
        lotes: [item],
      });
    }
    return acc;
  }, []);
};

const seleccionarCliente = (Id_Cliente) => {
  setId_Cliente(Id_Cliente);
  const cliente = clientes.find(c => c.Id_cliente === parseInt(Id_Cliente));
  if (cliente) {
    setCreditoActual(cliente.montoCredito);
    setLimiteCredito(cliente.limite_credito);
  } else {
    console.log('Cliente no encontrado');
  }
};

const FinalizarVenta = () => {
  if (!metodopagoseleccionado || !clienteSeleccionado) {
    Swal.fire({
      icon: 'warning',
      title: 'Faltan datos',
      text: 'Por favor seleccione un cliente y un método de pago.',
      confirmButtonColor: '#3085d6',
      timer: 3500,
      timerProgressBar: true
    });
    return;
  }

  if (carrito.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Carrito vacío',
      text: 'Debe agregar al menos un producto a la venta.',
      confirmButtonColor: '#3085d6',
      timer: 3500,
      timerProgressBar: true
    });
    return;
  }

  Swal.fire({
    title: '¿Querés imprimir el ticket?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, imprimir',
    cancelButtonText: 'No',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#aaa'
  }).then(async (result) => {
    try {
      const totalVenta = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0); 
      const interesNumero = parseFloat(interes) || 0;
      const totalConInteres = totalVenta + (totalVenta * interesNumero / 100);

      const cliente = clientes.find(c => c.Id_cliente === parseInt(clienteSeleccionado));
      const creditoActual = cliente ? parseFloat(cliente.monto_credito) : 0;
      const nuevoCredito = creditoActual + totalConInteres;

      // 1️⃣ Validar límite de crédito si es venta a crédito
      if (parseInt(metodopagoseleccionado) === 5 && nuevoCredito >= limiteCredito) {
        Swal.fire({
          icon: 'error',
          title: 'Límite de crédito superado',
          html: `
            <ul style="text-align:left">
              <li>Límite de crédito del cliente: <b>${formatCurrency(limiteCredito)}</b></li>
              <li>Total de esta venta: <b>${formatCurrency(totalConInteres)}</b></li>
              <li>Crédito actual: <b>${formatCurrency(creditoActual)}</b></li>
              <li>Excedido por: <b>${formatCurrency(nuevoCredito - limiteCredito)}</b></li>
            </ul>
          `
        });
        return; // No registrar la venta ni descontar stock
      }

      // 2️⃣ Preparar productos para enviar al backend
      const productosParaBackend = carrito.map(item => ({
        Id_producto: item.Id_producto,
        Id_lote: item.lote.Id_lote,
        cantidad: item.cantidad,
        precio_unitario: item.precio
      }));

      // 3️⃣ Registrar la venta
      const resVenta = await axios.post(`${URL}venta/registrarVenta`, {
        precioTotal_Venta: totalVenta,
        Id_cliente: clienteSeleccionado,
        Id_usuario: idUsuario,
        Id_metodoPago: metodopagoseleccionado,
        productos: productosParaBackend
      });
      const Id_venta = resVenta.data.Id_venta;

      // 4️⃣ Si es venta a crédito, actualizar crédito y registrar movimiento
      if (parseInt(metodopagoseleccionado) === 5) {
        await axios.put(`${URL}clientes/aumentarCredito`, {
          Id_cliente: parseInt(clienteSeleccionado),
          monto_credito: Number(totalConInteres.toFixed(2))
        });

        await axios.post(`${URL}credito/movimientosclientes/registrar`, {
          Id_cliente: parseInt(clienteSeleccionado),
          montoCredito: Number(totalConInteres.toFixed(2)),
          montoDebito: 0,
          Id_venta: parseInt(Id_venta),
          Saldo: Number(nuevoCredito.toFixed(2))
        });

        console.log("Crédito actualizado y movimiento registrado correctamente");
      }

      // 5️⃣ Imprimir ticket o mostrar confirmación
      if (result.isConfirmed) {
        imprimirTicket({ carrito, clientes, clienteSeleccionado, metodospago, metodopagoseleccionado, formatCurrency });
        Swal.fire({
          icon: 'success',
          title: '¡Venta registrada e impresa!',
          timer: 3000,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: '¡Venta registrada!',
          timer: 3000,
          showConfirmButton: false
        });
      }

      // 6️⃣ Limpiar campos
      limpiarCampos();

    } catch (error) {
      console.error("Error al finalizar la venta:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al registrar la venta o el crédito.',
      });
    }
  });
};




//AGREGAR A LA VENTA
const agregarAlCarrito = (producto) => {

  // filtramos solo los lotes que no estén vencidos
  const lotesValidos = producto.lotes.filter(l => {
    const diasRestantes = Math.ceil((new Date(l.fecha_vencimiento) - new Date()) / (1000 * 60 * 60 * 24)); //esto calcula cuantos dias faltan para el vencimiento
    return diasRestantes >= 0; // solo lotes no vencidos
  });

  //validamos si hay lotes validos
  if (lotesValidos.length === 0) {
    alert("No hay lotes disponibles válidos para este producto.");
    return;
  }

  // tomamos el lote más cercano a vencer entre los válidos
  const loteCercano = lotesValidos.reduce((prev, curr) =>
    new Date(prev.fecha_vencimiento) < new Date(curr.fecha_vencimiento) ? prev : curr
  );

  // tomamos la cantidad disp de ese lote
  const stockDisponible = loteCercano.cantidad_disponible;

  // verificamos si el prod ya esta en el carrito
  const existe = carrito.find((item) =>
    item.Id_producto === producto.Id_producto && item.lote.Id_lote === loteCercano.Id_lote
  );

  // si ya esta en el carrito aumentar cantidad
  if (existe) {
    if (existe.cantidad < stockDisponible) {
      const nuevoCarrito = carrito.map((item) => {
        if (
          item.Id_producto === producto.Id_producto &&
          item.lote.Id_lote === loteCercano.Id_lote
        ) {
          return {
            ...item,
            cantidad: item.cantidad + 1,
          };
        }
        return item;
      });
      setCarrito(nuevoCarrito);
    } else {
      alert("No hay más stock disponible para este lote.");
    }
  } else {
    // Agrega solo si hay al menos 1 disponible
    if (stockDisponible > 0) {
      const nuevoItem = {
        Id_producto: producto.Id_producto,
        nombre_producto: producto.nombre_producto,
        precio: 0,
        precio_caja: producto.precio_caja,
        precio_tira: producto.precio_tira,
        precio_unitario: producto.precio_unitario,
        cantidad: 1,
        tipoPrecio: "",
        lote: loteCercano,
      };
      setCarrito([...carrito, nuevoItem]);
    } else {
      alert("Este lote no tiene stock disponible.");
    }
  }
};


const cambiarTipoPrecio = (index, nuevoTipo) => {
  const nuevoCarrito = [...carrito];
  const item = nuevoCarrito[index];

  let nuevoPrecio;

  switch (nuevoTipo) {
    case "unidad":
      nuevoPrecio = item.precio_unitario;
      break;
    case "tira":
      nuevoPrecio = item.precio_tira;
      break;
    case "caja":
    default:
      nuevoPrecio = item.precio_caja;
      break;
  }

  item.tipoPrecio = nuevoTipo;
  item.precio = nuevoPrecio;

  setCarrito(nuevoCarrito);
};



//FORMATEO DE MONEDA
const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(value);
};

//FILTRO POR NOMBRE PRODUCTO
  const buscador = (e) => {
    setBuscarProducto(e.target.value);
  };

  // FILTRAR PRODUCTOS
  const productosFiltrados = productos.filter((dato) =>
    dato.nombre_producto.toLowerCase().includes(buscarproducto.toLowerCase()) ||
    dato.codigobarras_producto?.toLowerCase().includes(buscarproducto.toLowerCase())
  );

  //LIMPIAR TODOS LOS CAMPOS AL FINALIZAR LA VENTA
  const limpiarCampos = () => {
    setClienteSeleccionado(1)
    setMetodopagoseleccionado('')
    setCarrito([])
    verProductos()
    setMontoRecibido('')
  }

  // ELIMINAR PRODUCTO DEL CARRITO
  const eliminarDelCarrito = (index) => { //recibe como parametros index que seria el indice del producto A BORRAR en la tabla (lo manda el boton)
    const carritoActualizado = carrito.filter((productoActual, posicionActual) => posicionActual !== index) 
    setCarrito(carritoActualizado);
  };

  //FUNCIONES DE PRECIOS
  const totalVenta = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const interesNumero = parseFloat(interes) || 0
  const totalConInteres = totalVenta + (totalVenta * interesNumero / 100);
  const vuelto = montorecibido ? montorecibido - totalVenta : 0;
  const subtotal = totalVenta

//PAGINACION
  const productosPorPagina = 5
  const [actualPagina, setActualPagina] = useState(1)
  const [total, setTotal] = useState(0)
  const ultimoIndex = actualPagina * productosPorPagina;
  const primerIndex = ultimoIndex - productosPorPagina;

useEffect(()=>{
  verMetodosPagos()
  verClientes()
  verProductos()
},[])




  return (
    <>
  <App />
  <div className="h3-subtitulos">
    <h3>VENTA</h3>
  </div>
   <div className="validaciones">
    <a
      href="https://www.misvalidaciones.com.ar/"
      target="_blank"
      rel="noopener noreferrer"
      className="link-validacion"
    >
      <FontAwesomeIcon icon={faFilePrescription} className="me-2" />
      ⚠️ Validá tus recetas aquí.
    </a>
  </div>

  <Container fluid className="mt-4">
    <Row>
      {/* Sección principal: productos + carrito */}
      <Col md={8}>
        <Row>
          {/* Búsqueda de productos */}
          <Col md={5}>
            <Card className="mb-3">
              <Card.Header>
                <FontAwesomeIcon icon={faSearch} /> Búsqueda de productos
                </Card.Header>
              <Card.Body>
                <MDBInputGroup className="mb-3">
                  <span className="input-group-text">
                    <FontAwesomeIcon icon={faSearch} size="lg" style={{ color: "#4b6cb7" }} />
                  </span>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Buscar producto o escanear código"
                    value={buscarproducto}
                    onChange={buscador}
                  />
                </MDBInputGroup>

                <Table bordered hover size="sm" className="table table-striped table-hover mt-3 shadow-sm custom-table">
                  <thead>
                    <tr>
                      <th>PRODUCTO</th>
                      <th>PRECIO</th>
                      <th>ACCIÓN</th>
                    </tr>
                  </thead>
                  <tbody>
                      {productosFiltrados.slice(primerIndex, ultimoIndex).map((prod) => {
                      /* Aca filtro los lotes que no esten vencidos*/
                      const lotesValidos = prod.lotes.filter(l => {
                        const diasRestantes = Math.ceil((new Date(l.fecha_vencimiento) - new Date()) / (1000 * 60 * 60 * 24));
                        return diasRestantes >= 0; // solo lotes no vencidos
                      });

                       // Tomamos el lote más cercano a vencer
                      const loteCercano = lotesValidos.reduce((prev, curr) =>
                        new Date(prev.fecha_vencimiento) < new Date(curr.fecha_vencimiento) ? prev : curr
                      );
                      const diasRestantes = Math.ceil((new Date(loteCercano.fecha_vencimiento) - new Date()) / (1000 * 60 * 60 * 24));
                      const estaPorVencer = diasRestantes <= 5;

                      return (
                        <tr key={prod.Id_producto} className={estaPorVencer ? "table-warning" : ""}>
                          <td>
                            <strong>{prod.nombre_producto}</strong><br />
                            <small>Código: {prod.codigobarras_producto}</small><br />
                            <strong><small>Vto: {new Date(loteCercano.fecha_vencimiento).toLocaleDateString()}</small></strong><br />
                            <small>Stock disponible: {loteCercano.cantidad_disponible}</small><br />
                            <small>Lote: {loteCercano.nro_lote}</small><br />

                            {prod.lotes.some(l => new Date(l.fecha_vencimiento) > new Date(loteCercano.fecha_vencimiento)) && (
                              <small style={{ color: "green", fontWeight: "bold" }}>
                                📦 Hay más stock en otro lote, no te preocupes!
                              </small>
                            )}

                            {!prod.lotes.some(l => l.Id_lote !== loteCercano.Id_lote && l.cantidad_disponible > 0) && (
                              <small style={{ color: "red", fontWeight: "bold" }}>
                                ⚠️ Este es el único lote con stock. ¡Debes comprar!
                              </small>
                            )}

                            {estaPorVencer && (
                              <div>
                                <small style={{ color: "red" }}>
                                  ⚠ Lote vence en {diasRestantes} días!
                                </small>
                              </div>
                            )}
                          </td>
                          <td>{formatCurrency(prod.precio_caja)}</td>
                          <td>
                            <Button size="md" variant="outline-success" onClick={() => agregarAlCarrito(prod)}>
                              +
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>

                <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                  <Paginacion
                    productosPorPagina={productosPorPagina}
                    actualPagina={actualPagina}
                    setActualPagina={setActualPagina}
                    total={total}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Detalle del carrito */}
          <Col md={7}>
            <Card>
             <Card.Header>
                <FontAwesomeIcon icon={faShoppingCart} /> Detalle de venta
            </Card.Header>
              <Card.Body>
                <Table bordered size="sm" className="table table-striped table-hover mt-3 shadow-sm custom-table">
                  <thead>
                    <tr>
                      <th>PRODUCTO</th>
                      <th>CANTIDAD</th>
                      <th>PRECIO</th>
                      <th>TIPO PRECIO</th>
                      <th>SUBTOTAL</th>
                      <th>ELIMINAR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {carrito.map((item, index) => (
                      <tr key={index}>
                        <td>{item.nombre_producto}</td>
                        <td>{item.cantidad}</td>
                        <td>{item.precio > 0 ? formatCurrency(item.precio) : '-'}</td>
                        <td>
                          <Form.Select
                            size="sm"
                            value={item.tipoPrecio || ""}
                            onChange={(e) => cambiarTipoPrecio(index, e.target.value)}
                          >
                            <option value="" disabled>
                              Seleccione tipo de precio
                            </option>
                            {item.precio_unitario > 0 && <option value="unidad">Unidad</option>}
                            {item.precio_tira > 0 && <option value="tira">Tira</option>}
                            {item.precio_caja > 0 && <option value="caja">Caja</option>}
                          </Form.Select>
                        </td>
                        <td><b>{formatCurrency(item.precio * item.cantidad)}</b></td>
                        <td>
                          <button className="btn btn-danger" onClick={() => eliminarDelCarrito(index)}>
                            <FontAwesomeIcon icon={faTrash} color="white" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Col>

      {/* Resumen y pago */}
      <Col md={4}>
        <Card>
          <Card.Header>
           <FontAwesomeIcon icon={faDollar} /> Resumen y Pago
            </Card.Header>
          <Card.Body>
            <Form.Group className="mb-3">
              <Form.Label>Cliente</Form.Label>
            <Form.Select
                value={clienteSeleccionado}
                onChange={(e) => {
                  const Id_Cliente = e.target.value;
                  setClienteSeleccionado(Id_Cliente);
                  seleccionarCliente(Id_Cliente); 
                }}
              >
                {clientes.map((cl) => (
                  <option key={cl.Id_cliente} value={cl.Id_cliente}>
                    {cl.nombre_cliente}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Método de pago</Form.Label>
              <Form.Select value={metodopagoseleccionado} onChange={(e) => setMetodopagoseleccionado(e.target.value)}>
                <option value="">Seleccione</option>
                {metodospago.map((mp) => (
                  <option key={mp.Id_metodoPago} value={mp.Id_metodoPago}>
                    {mp.nombre_metodopago}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          
          {(parseInt(metodopagoseleccionado) === 2 || parseInt(metodopagoseleccionado) === 3) && (
            <Form.Group className='mb-3'>
              <Form.Label>Interes (%)</Form.Label>
              <Form.Control type='number' value={interes} onChange={(e) => setInteres(e.target.value)} placeholder='0'/>
            </Form.Group>
          )}
            

            <Form.Group className="mb-3">
              <Form.Label>Monto recibido</Form.Label>
              <Form.Control
                type="number"
                placeholder="$0,00"
                value={montorecibido}
                onChange={(e) => setMontoRecibido(Number(e.target.value))}
              />
            </Form.Group>

            <hr />
            
            <p className='subtotal'> SUBTOTAL: <strong>{formatCurrency(subtotal)}</strong></p>
            <p className="total">TOTAL: <strong>{formatCurrency(totalConInteres)}</strong></p>
            <p className="vuelto">VUELTO: <strong>{formatCurrency(vuelto >= 0 ? vuelto : 0)}</strong></p>

            <Button variant="success" size="lg" className="w-100 mt-3" onClick={FinalizarVenta}>
              Finalizar venta
            </Button>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Container>
</>
  )
}

export default Venta