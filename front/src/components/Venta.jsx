import { Container, Row, Col, Form, Table, Button, Card } from 'react-bootstrap';
import { useState, useEffect, useContext, useRef } from 'react';
import App from '../App'
import { DataContext } from '../context/DataContext';
import axios from 'axios';
import Swal from 'sweetalert2';

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
        lotes: [item],
      });
    }
    return acc;
  }, []);
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

  const totalVenta = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  // Armar el array de productos con lo que espera el backend
  const productosParaBackend = carrito.map(item => ({
    Id_producto: item.Id_producto,
    Id_lote: item.lote.Id_lote,
    cantidad: item.cantidad,
    precio_unitario: item.precio
  }));

  axios.post(`${URL}venta/registrarVenta`, {
    precioTotal_Venta: totalVenta,
    Id_cliente: clienteSeleccionado,
    Id_usuario: idUsuario,
    Id_metodoPago: metodopagoseleccionado,
    productos: productosParaBackend
  })
  .then((response) => {
    Swal.fire({
      icon: 'success',
      title: '¡Venta registrada!',
      html: `Venta registrada exitosamente.`,
      confirmButtonColor: '#3085d6',
      timer: 4000,
      timerProgressBar: true,
      width: '500px'
    }).then(() => {
      limpiarCampos();
    });
  })
  .catch((error) => {
    console.error('Error al registrar la venta', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Ocurrió un error al registrar la venta.',
    });
  });
};



//AGREGAR A LA VENTA
const agregarAlCarrito = (producto) => {
  const loteCercano = producto.lotes.reduce((prev, curr) =>
    new Date(prev.fecha_vencimiento) < new Date(curr.fecha_vencimiento) ? prev : curr
  );

  const stockDisponible = loteCercano.cantidad_disponible; 

  const existe = carrito.find(
    (item) =>
      item.Id_producto === producto.Id_producto &&
      item.lote.Id_lote === loteCercano.Id_lote
  );

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
        precio: producto.precio_caja,
        cantidad: 1,
        lote: loteCercano,
      };
      setCarrito([...carrito, nuevoItem]);
    } else {
      alert("Este lote no tiene stock disponible.");
    }
  }
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

  const totalVenta = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const vuelto = montorecibido ? montorecibido - totalVenta : 0;

useEffect(()=>{
  verMetodosPagos()
  verClientes()
  verProductos()
},[])




  return (
    <>
        <App/>
        <div className='h3-subtitulos'>
            <h3>VENTA</h3>
        </div>

   <Container fluid className="mt-4">
      <Row>
        {/* Columna izquierda: búsqueda + carrito */}
        <Col md={8}>

      {/* CARD DE LA BUSQUEDA DE PRODUCTOS */}
          <Card className="mb-3">
            <Card.Header>Búsqueda de productos</Card.Header>
            <Card.Body>
              <Form.Control type="text" placeholder="Buscar producto o escanear código" value={buscarproducto} onChange={buscador}/>
              <Table bordered hover size="sm" className="mt-3">
                <thead>
                  <tr>
                    <th>PRODUCTO</th>
                    <th>PRECIO</th>
                    <th>ACCION</th>
                  </tr>
                </thead>
               <tbody>
                  {productosFiltrados.map((prod) => {
                    const loteCercano = prod.lotes.reduce((prev, curr) =>
                      new Date(prev.fecha_vencimiento) < new Date(curr.fecha_vencimiento) ? prev : curr
                    );

                    const hoy = new Date();
                    const vto = new Date(loteCercano.fecha_vencimiento);
                    const diasRestantes = Math.ceil((vto - hoy) / (1000 * 60 * 60 * 24));
                    const estaPorVencer = diasRestantes <= 5;

                    return (
                      <tr key={prod.Id_producto} className={estaPorVencer ? 'table-warning' : ''}>
                        <td>
                          <strong>{prod.nombre_producto}</strong><br />
                          <small>Código: {prod.codigobarras_producto}</small><br />
                          <small>Vto: {new Date(loteCercano.fecha_vencimiento).toLocaleDateString()}</small><br />
                          <small>Stock disponible: {loteCercano.cantidad_disponible}</small><br />
                           {/* 🔶 Aviso si hay otro lote posterior */}
                            {prod.lotes.some(l => new Date(l.fecha_vencimiento) > new Date(loteCercano.fecha_vencimiento)) && (
                              <small style={{ color: 'green', fontWeight: 'bold' }}>
                                📦 Hay mas stock en otro lote, no te preocupes!.
                              </small>
                            )}
                             {/* No hay más stock en otros lotes */}
                              {!prod.lotes.some(l => l.Id_lote !== loteCercano.Id_lote && l.cantidad_disponible > 0) && (
                                <small style={{ color: 'red', fontWeight: 'bold' }}>
                                  ⚠️ Este es el unico lote con stock. Debes comprar!
                                </small>
                              )}
                          {estaPorVencer && (
                            <div>
                              <small style={{ color: 'red' }}>
                                ⚠ Lote vence en {diasRestantes} días
                              </small>
                            </div>
                          )}
                        </td>
                        <td>{formatCurrency(prod.precio_caja)}</td>
                        <td>
                          <Button size="sm" variant="outline-success" onClick={() => agregarAlCarrito(prod)}>
                            +
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

      {/* CARD DEL CARRITO */}
          <Card>
              <Card.Header>Detalle de venta</Card.Header>
              <Card.Body>
                <Table bordered size="sm">
                  <thead>
                    <tr>
                      <th>PRODUCTO</th>
                      <th>CANTIDAD</th>
                      <th>PRECIO</th>
                      <th>SUBTOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {carrito.map((item, index) => (
                      <tr key={index}>
                        <td>{item.nombre_producto}</td>
                        <td>{item.cantidad}</td>
                        <td>{formatCurrency(item.precio)}</td>
                        <td>{formatCurrency(item.precio * item.cantidad)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
        </Col>

        {/* COLUMNA DE RESUMEN Y PAGO */}
        <Col md={4}>
          <Card>
            <Card.Header>Resumen y Pago</Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>Cliente</Form.Label>
               <Form.Select value={clienteSeleccionado} onChange={(e) => setClienteSeleccionado(e.target.value)}>
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
                  <option value= ''>Seleccione</option>
                  {metodospago.map((mp) => (
                    <option key={mp.Id_metodoPago} value={mp.Id_metodoPago}>
                      {mp.nombre_metodopago}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

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

              <p className='total'>TOTAL: <strong>{formatCurrency(totalVenta)}</strong></p>
              <p className='vuelto'>VUELTO: <strong>{formatCurrency(vuelto >= 0 ? vuelto : 0)}</strong></p>

              <Button variant="success" size="lg" className="w-100 mt-3" onClick={(FinalizarVenta)}>Finalizar venta</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>

    </>
  )
}

export default Venta