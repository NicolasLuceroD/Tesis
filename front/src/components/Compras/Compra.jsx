import { v4 as uuidv4 } from 'uuid';
import App from "../../App";
import { useState, useEffect, useContext, useRef } from "react";
import { DataContext } from "../../context/DataContext";
import axios from "axios";
import { Button, ButtonGroup, Modal } from "react-bootstrap";
import Paginacion from "../Common/Paginacion";
import Swal from 'sweetalert2';
import { generarPDF } from '../../pdf/PdfCompra';

const Compra = () => {

  //URL
  const { URL } = useContext(DataContext);

  //ESTADOS
  const [verDroguerias, setVerDroguerias] = useState([]);
  const [verProductos, setVerProductos] = useState([])
  const [metodospagos, setMetodosPagos] = useState([])
  const [metodopagoseleccionado ,setMetodoPagoSeleccionado] = useState('')
  const [nombreDrogueria, setNombreDrogueria] = useState("");
  const [telefonoDrogueria, setTelefonoDrogueria] = useState("");
  const [direccion_drogueria, setDireccionDrogueria] = useState("");
  const [correo_drogueria, setCorreoDrogueria] = useState("");
  const [cuit_drogueria, setCuitDrogueria] = useState('')
  const [productosCompra, setProductosCompra] = useState([])
  const [Id_drogueria, setIdDrogueria] = useState(null)
  
  //FILTRO BUSCAR DROGUERIA
  const [buscardrogueria, setBuscarDrogueria] = useState("");
  const [ver, setVer] = useState([]);
  
  //FILTRO BUSCAR PRODUCTOS
  const [buscarproducto, setBuscarProducto] = useState('')
  const [ver2, setVer2] = useState([])
  
  //REF PARA LOS INPUTS DROGUERIA Y PRODUCTOS
  const inputRef = useRef(null);
  const inputRefProductos = useRef(null)

  //MODAL DROGUERIAS
  const [showModalDroguerias, setShowModalDroguerias] = useState(false);
  const handleShowModalDroguerias = () => setShowModalDroguerias(true);

  const handleCloseModalDroguerias = () => {
    setShowModalDroguerias(false);
    setBuscarDrogueria("");
  };

  //MODAL PRODUCTOS
  const [showModalProductos, setShowModalProductos] = useState('')
  const handleShowModalProductos = () => {
  if (!Id_drogueria) {
    Swal.fire({
      icon: 'warning',
      title: 'Atención',
      text: 'Por favor, seleccione un proveedor antes de agregar productos.',
      confirmButtonColor: '#3085d6'
    });
    return;
  }
  setShowModalProductos(true);
}
  const handleCloseModalProductos = () => setShowModalProductos(false)

  //MODAL DETALLE DE COMPRA
  const [showModalDetalleCompra, setShowModalDetalleCompra] = useState('')
  const handleShowModalDetalleCompra = () => setShowModalDetalleCompra(true)
  const handleCloseModalDetalleCompra = () => setShowModalDetalleCompra(false)

  //TRAER DROGUERIAS
  const seeDroguerias = () => {
    axios
      .get(`${URL}droguerias/verDroguerias`)
      .then((response) => {
        console.log("Droguerias: ", response.data);
        setVerDroguerias(response.data);
        setVer(response.data);
      })
      .catch((err) => {
        console.error("Error al obtener droguerias", error);
      });
  };

  //TRAER PRODUCTOS
  const seeProductos = () => {
    axios.get(`${URL}productos/verProductos`).then((response)=> {
        console.log('Productos: ',response.data)
        setVerProductos(response.data)
        setTotal(response.data.length)
        setVer2(response.data)
    })
  }

  //TRAER METODOS PAGOS
  const verMetodoPago = () => {
    axios.get(`${URL}metodopago/verMetodoPago`).then((response)=> {
      console.log('Metodos pago: ', response.data)
      setMetodosPagos(response.data)
    }).catch((err)=> {
      console.error('Error al obtener metodos ', err)
    })
  }

  //REGISTRAR COMPRA Y LOTE
  const registrarCompraYLote = () => {
  if (!metodopagoseleccionado) {
    Swal.fire({
      icon: 'warning',
      title: 'Método de pago requerido',
      text: 'Por favor, seleccione un método de pago antes de continuar con la compra.',
      confirmButtonColor: '3085d6',
      timer: 3500,
      timerProgressBar: true
    });
    return;
  }

  const cantidadProductos = productosCompra.length;
  const descripciondecompra = `Se realizó la compra de: ${cantidadProductos} medicamentos.`;

 const algunProductoSinFecha = productosCompra.some(
    producto => !producto.fecha_vencimiento || producto.fecha_vencimiento.trim() === ''
  );

  if (algunProductoSinFecha) {
    alert('Por favor colocar fecha de vencimiento a todos los productos');
    return;
  }
  axios.post(`${URL}compra/post`, {
    descripcion_compra: descripciondecompra,
    Id_drogueria: Id_drogueria,
    Id_metodoPago: metodopagoseleccionado,
    Total: totalCompra
  }).then((response) => {
    const Id_compra = response.data.insertId; // <-- recibimos el ID de la compra creada
    // Registramos cada producto como un detalle de compra
    const promesas = productosCompra.map(producto => {
      return axios.post(`${URL}detallecompra/post`, {
        Id_compra: Id_compra,
        Id_producto: producto.Id_producto,
        Cantidad: producto.cantidad,
        Precio_costo: producto.precio_costo
      }).then(() => {
        return axios.post(`${URL}lote/post`, 
        {
          Id_compra: Id_compra,
          Id_producto: producto.Id_producto,
          fecha_vencimiento: producto.fecha_vencimiento,
          cantidad: producto.cantidad,
          cantidad_disponible: producto.cantidad
        })
      })
    });
    // Esperamos a que todas las inserciones se completen
    return Promise.all(promesas).then(() => Id_compra);
  }).then((Id_compra) => {
    const metodoPago = metodospagos.find(m => m.Id_metodoPago === Number(metodopagoseleccionado));
    const nombreMetodoPago = metodoPago ? metodoPago.nombre_metodopago : 'Desconocido';
    // const proveedor = verDroguerias.find(d => d.Id_drogueria ===)
    // console.log('Métodos de pago cargados:', metodoPago);
    // console.log('Método seleccionado:', metodopagoseleccionado);
    const detalleCompra = {
      Nro_comprobante: Id_compra.toString().padStart(5, '0'),
      descripcion: descripciondecompra,
      Id_drogueria: Id_drogueria,
      Id_metodoPago: metodopagoseleccionado,
      nombre_metodoPago: nombreMetodoPago,
      total: totalCompra,
      productos: productosCompra,
      nombre_drogueria: nombreDrogueria,
      telefono: telefonoDrogueria,
      direccion: direccion_drogueria,
      correo: correo_drogueria,
      cuit: cuit_drogueria
    }
    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      html: `Compra realizada con éxito a <b>${nombreDrogueria}</b>.`,
      confirmButtonColor: '#3085d6',
      timer: 4500,
      timerProgressBar: true,
      width: '600px'
    }).then(() => {
      setProductosCompra([]);
      limpiarCamposInputs();
      handleCloseModalDetalleCompra();
      setMetodoPagoSeleccionado('');
      generarPDF(detalleCompra);
    });
  })
  .catch((err) => {
    console.error('Error al realizar la compra', err);
  });
};



  //FILTRO POR NOMBRE DROGUERIA
  const buscador = (e) => {
    setBuscarDrogueria(e.target.value);
  };

  let drogueriasfiltradas = [];
  if (!buscardrogueria) {
    drogueriasfiltradas = ver;
  } else {
    drogueriasfiltradas = ver.filter((dato) =>
      dato.nombre_drogueria
        .toLowerCase()
        .includes(buscardrogueria.toLowerCase())
    );
}

//AGREGAR PRODUCTOS A COMPRA
const agregarProductoACompra = (producto) => {
  setProductosCompra(prev => {
    const nuevosProductos = [
      ...prev,
      {
        ...producto,
        tempId: uuidv4(), 
        cantidad: 1,
        fecha_vencimiento: '',
        nro_lote: ''
      }
    ];
    console.log("Productos agregados:", nuevosProductos);
    return nuevosProductos;
  });
};


  //FILTRO POR NOMBRE PRODUCTO
  const buscadorproducto = (e) => {
  const valor = e.target.value;
  setBuscarProducto(valor);

  const productoExacto = ver2.find(p => p.codigobarras_producto === valor);

  if (productoExacto) {
    agregarProductoACompra(productoExacto);
    setBuscarProducto(""); 
  }
};


  let productosfiltrados = [];
  if (!buscadorproducto) {
    productosfiltrados = ver2;
  } else {
    productosfiltrados = ver2.filter((dato) => 
      dato.nombre_producto.toLowerCase().includes(buscarproducto.toLowerCase()) ||
      dato.codigobarras_producto?.toLowerCase().includes(buscarproducto.toLowerCase())
    );
  }


  //LIMPIAR INPUT MODAL PROVEEDORES
  const limpiarInput = () => {
    setBuscarDrogueria("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  //LIMPIAR INPUT MODAL PRODUCTOS
  const limpiarInputProductos = () => {
    setBuscarProducto("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  //LIMPIAR CAMPOS INPUTS
  const limpiarCamposInputs = () => {
    setNombreDrogueria('')
    setTelefonoDrogueria('')
    setDireccionDrogueria('')
    setCorreoDrogueria('')
    setCuitDrogueria('')
  }

  //LIMPIAR INPUTS DE DROGUERIAS
  const limpiarDroguerias = () => {
    setNombreDrogueria("");
    setTelefonoDrogueria("");
    setDireccionDrogueria("");
    setCorreoDrogueria("");
  };

  //LISTAR EN INPUTS DROGUERIAS
  const handleDrogueria = (val) => {
    setNombreDrogueria(val.nombre_drogueria);
    setTelefonoDrogueria(val.telefono_drogueria);
    setDireccionDrogueria(val.direccion_drogueria);
    setCorreoDrogueria(val.correo_drogueria);
    setCuitDrogueria(val.Cuit_drogueria)
    setIdDrogueria(val.Id_drogueria)
    handleCloseModalDroguerias(true);
  };


  //VALIDACION DE FECHA Y AGREGAR CANTIDAD A LA TABLA
  const validarFechaDuplicadaYAgregarCantidad = (index, e) => {

  // 1. Obtener la nueva fecha y el producto que se está editando
  const nuevaFecha = e.target.value;
  const productoActual = productosCompra[index];

  // 2. Manejo de fechas vacías
  // Si la fecha está vacía, simplemente actualizamos la fecha y salimos.
  // La validación de unidades solo aplica cuando hay una fecha.
  if (!nuevaFecha) {
    const nuevosProductos = [...productosCompra];
    nuevosProductos[index].fecha_vencimiento = nuevaFecha;
    setProductosCompra(nuevosProductos);
    return;
  }

  //3. Buscar un producto existente con el mismo ID y la misma nueva fecha de vencimiento
  const productoConMismaFechaIndex = productosCompra.findIndex((p, i) =>
    i !== index &&
    p.Id_producto === productoActual.Id_producto &&
    p.fecha_vencimiento === nuevaFecha
  );

    // 4. Se encontró un duplicado o no?
  if (productoConMismaFechaIndex > -1) {
    // Caso 1: existe un duplicado exacto de Id_producto y fecha_vencimiento
    // sumo cantidades y elimino la fila actual.

    const productosActualizados = [...productosCompra];

    // Sumar la cantidad del producto actual a la del producto existente
    productosActualizados[productoConMismaFechaIndex].cantidad =
      (productosActualizados[productoConMismaFechaIndex].cantidad || 1) +
      (productoActual.cantidad || 1); // Suma las cantidades actuales

    // Eliminar el producto actual (ya que su cantidad se ha sumado a otro)
    productosActualizados.splice(index, 1); //con splice elimino elementos de un array

    // Actualizar el estado
    setProductosCompra(productosActualizados);

    alert("Producto con la misma fecha de vencimiento encontrado. Se ha sumado la cantidad al producto existente.");

  } else {
    // Caso 2: No existe un duplicado exacto.
    // actualizamos la fecha de vencimiento del producto actual.
    const nuevosProductos = [...productosCompra];
    nuevosProductos[index].fecha_vencimiento = nuevaFecha;
    setProductosCompra(nuevosProductos);
  }
};

  //ELIMINAR PRODUCTOS DE LA TABLA
  const eliminarproductotabla = (tempIdAEliminar) => {
    const nuevosProductos = productosCompra.filter(pr => pr.tempId !== tempIdAEliminar)
    setProductosCompra(nuevosProductos)
  }

  //PAGINACION
  const productosPorPagina = 10
  const [actualPagina, setActualPagina] = useState(1)
  const [total, setTotal] = useState(0)
  const ultimoIndex = actualPagina * productosPorPagina;
  const primerIndex = ultimoIndex - productosPorPagina;

  //FUNCION PARA PASAR A PESOS ARG
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(value);
  };

 //CALCULAR TOTAL DE COMPRA
  const totalCompra = productosCompra.reduce((acc, producto) => {
  const precio = parseFloat(producto.precio_costo) || 0;
  const cantidad = parseInt(producto.cantidad) || 1;
  return acc + precio * cantidad;
}, 0);

  useEffect(() => {
    seeDroguerias();
    seeProductos()
    verMetodoPago()

    //VALIDACIONES PARA LOS INPUTS REF
    if (showModalDroguerias && inputRef.current) {
      inputRef.current.focus();
    }
    if (showModalProductos && inputRefProductos.current) {
        inputRefProductos.current.focus()
    }
  }, [showModalDroguerias, showModalProductos]);

  return (
    <>
      <App />
      <div className="h3-subtitulos">
        <h3>COMPRAS</h3>
      </div><br />
      <h2 className="text-center">
        REALIZA COMPRAS Y GENERA LOTES PARA TU NEGOCIO
      </h2>
      <ButtonGroup>
        <Button className="me-2" onClick={handleShowModalDroguerias} variant="success" style={{backgroundColor: '#ff5e5e', border: 'none'}}>
          PROVEEDORES
        </Button>
        {(nombreDrogueria || telefonoDrogueria || direccion_drogueria || correo_drogueria) && (
          <Button variant="warning" onClick={limpiarDroguerias}>
            LIMPIAR
          </Button>
        )}
      </ButtonGroup>
    <div className="mt-5">
      <input
        className="form-control mb-3"
        type="text"
        placeholder="NOMBRE"
        value={nombreDrogueria}
        readOnly
      />
      <input
        className="form-control mb-3"
        type="text"
        placeholder="TELEFONO"
        value={telefonoDrogueria}
        readOnly
      />
      <input
        className="form-control mb-3"
        type="text"
        placeholder="DIRECCION"
        value={direccion_drogueria}
        readOnly
      />
      <input
        className="form-control mb-3"
        type="text"
        placeholder="CORREO"
        value={correo_drogueria}
        readOnly
      />
       <input
        className="form-control mb-3"
        type="text"
        placeholder="CUIT"
        value={cuit_drogueria}
        readOnly
      />
    </div>

    <Button onClick={handleShowModalProductos} variant="success" style={{backgroundColor: '#ff5e5e', border: 'none'}}>PRODUCTOS</Button>

   <table className="table table-striped table-hover mt-5 shadow-lg custom-table">
  <thead className="custom-table-header">
    <tr>
      <th>PRODUCTO</th>
      <th>CATEGORIA</th>
      <th>PRECIO</th>
      <th>CANTIDAD</th>
      <th>F. VENCIMIENTO</th>
      <th>SUBTOTAL</th>
      <th>ACCIONES</th>
    </tr>
  </thead>
  <tbody>
    {productosCompra.map((pr, index) => (
      <tr key={pr.tempId}>
        <td>{pr.nombre_producto}</td>
        <td>{pr.nombre_categoria}</td>
        <td>{formatCurrency(pr.precio_costo)}</td>

         <td>
          <input style={{ width: '150px' }} className="form-control" type="number" min="1" value={pr.cantidad || 1}
            onChange={e => {
              const nuevosProductos = [...productosCompra];
              nuevosProductos[index].cantidad = Number(e.target.value);
              setProductosCompra(nuevosProductos);
            }}
          />
        </td>
         <td>
  <input
    style={{ width: '150px' }}
    className="form-control"
    type="date"
    value={pr.fecha_vencimiento || ''}
    onChange={e => validarFechaDuplicadaYAgregarCantidad(index, e)} 
  />
</td>
         <td>
          {formatCurrency((pr.precio_costo || 0) * (pr.cantidad || 1))}
        </td>
        <td><Button variant="danger" onClick={() => eliminarproductotabla(pr.tempId)}>ELIMINAR</Button></td>
      </tr>     
    ))}
  </tbody>
  <tfoot>
    <tr>
      <td colSpan="3" style={{ textAlign: "right", fontWeight: "bold"}}>TOTAL:</td>
      <td style={{ fontWeight: "bold", color: 'green' }}>{formatCurrency(totalCompra)}</td>
    </tr>
  </tfoot>
</table>

<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
  <Button onClick={handleShowModalDetalleCompra} style={{backgroundColor: '#ff5e5e', border: 'none'}}>VER DETALLE DE COMPRA</Button>
</div>


{/* --------------------------MODALES-------------------------- */}
      {/* MODAL DROGUERIAS */}
      <Modal show={showModalDroguerias} onHide={handleCloseModalDroguerias} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>DROGUERIAS</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex align-items-center gap-2">
            <input
              className="form-control"
              type="text"
              value={buscardrogueria}
              onChange={buscador}
              placeholder="Busca un proveedor..."
              ref={inputRef}
            />
            <Button variant="warning" onClick={limpiarInput}>LIMPIAR</Button>
          </div>
          <table className="table table-striped table-hover mt-5 shadow-lg custom-table">
            <thead className="custom-table-header">
              <tr>
                <th>FOLIO</th>
                <th>NOMBRE</th>
                <th>TELEFONO</th>
                <th>DIRECCION</th>
                <th>CORREO</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {drogueriasfiltradas.map((val) => (
                <tr key={val.Id_drogueria}>
                  <td>{val.Id_drogueria}</td>
                  <td>{val.nombre_drogueria}</td>
                  <td>{val.telefono_drogueria}</td>
                  <td>{val.direccion_drogueria}</td>
                  <td>{val.correo_drogueria}</td>
                  <td>
                    <Button onClick={() => handleDrogueria(val)}>
                      SELECCIONAR
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCloseModalDroguerias}>CERRAR</Button>
        </Modal.Footer>
      </Modal>



      {/* MODAL PRODUCTOS */}
    <Modal show={showModalProductos} onHide={handleCloseModalProductos} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>PRODUCTOS</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex align-items-center gap-2">
            <input
              className="form-control"
              type="text"
              value={buscarproducto}
              onChange={buscadorproducto}
              placeholder="Busca un producto..."
              ref={inputRefProductos}
            />
            <Button variant="warning" onClick={limpiarInputProductos}>
              LIMPIAR
            </Button>
          </div>
          <table className="table table-striped table-hover mt-5 shadow-lg custom-table">
            <thead className="custom-table-header">
              <tr>
                <th>FOLIO</th>
                <th>CODIGO DE BARRAS</th>
                <th>NOMBRE</th>
                <th>PRECIO</th>
                <th>CATEGORIA</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {productosfiltrados.slice(primerIndex, ultimoIndex).map((val) => (
                <tr key={val.Id_producto}>
                  <td>{val.Id_producto}</td>
                  <td>{val.codigobarras_producto}</td>
                  <td>{val.nombre_producto}</td>
                  <td>{formatCurrency(val.precio_costo)}</td>
                  <td>{val.nombre_categoria}</td>
                  <td>
                    <Button onClick={() => agregarProductoACompra(val)}>
                      COMPRAR
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
           <div style={{display:'flex',justifyContent:'center'}}>
                          <Paginacion productosPorPagina={productosPorPagina}
                              actualPagina={actualPagina}
                              setActualPagina={setActualPagina}
                              total={total}
                          />
            </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCloseModalProductos}>CERRAR</Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL DETALLE DE COMPRA */}
      
      <Modal show={showModalDetalleCompra} onHide={handleCloseModalDetalleCompra} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>DETALLE DE LA COMPRA</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {productosCompra.length === 0 || !nombreDrogueria ? (
            <div className="alert alert-warning text-center" role="alert">
              <p className="mb-0">
                <strong>¡Atención!</strong> No se encontró detalle de compra.
                <br />
                Asegúrate de seleccionar un proveedor y agregar productos a la compra.
              </p>
            </div>
          ) : (
            <>
          <p><strong>Proveedor:</strong> {nombreDrogueria}</p>
          {nombreDrogueria && ( 
            <div>
              <p><strong>Teléfono:</strong> {telefonoDrogueria}</p>
              <p><strong>Dirección:</strong> {direccion_drogueria}</p>
              <p><strong>Correo:</strong> {correo_drogueria}</p>
              <p><strong>Cuit:</strong> {cuit_drogueria}</p>
              <select
                className="form-select form-select"
                style={{ width: '360px' }}
                value={metodopagoseleccionado}
                onChange={(e) => setMetodoPagoSeleccionado(e.target.value)}
              >
                <option value="" disabled>Seleccione un metodo de pago</option>
                {metodospagos.map((val, index) => (
                  <option key={index} value={val.Id_metodoPago}>
                    {val.nombre_metodopago}
                  </option>
                ))}
              </select>
            </div>
          )}
        <table className="table table-striped table-hover mt-5 shadow-lg custom-table">
          <thead>
            <tr>
              <th>PRODUCTO</th>
              <th>CANTIDAD</th>
              <th>SUBTOTAL</th>
              <th>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {productosCompra.map((producto, index)=> (
            <tr key={index}>
            <td>{producto.nombre_producto}</td>
            <td>{producto.cantidad}</td>
            <td>{formatCurrency(producto.precio_costo)}</td>
            <td>{formatCurrency(producto.cantidad * producto.precio_costo)}</td>
            </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" style={{ textAlign: "right", fontWeight: "bold"}}>TOTAL:</td>
              <td style={{ fontWeight: "bold", color: 'green' }}>{formatCurrency(totalCompra)}</td>
            </tr>
          </tfoot>
        </table>
        </>
        )}
        {productosCompra.length != 0 && nombreDrogueria != '' && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <Button onClick={registrarCompraYLote}>GENERAR ORDEN DE COMPRA Y LOTE</Button>
        </div>
        )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCloseModalDetalleCompra}>CERRAR</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Compra;
