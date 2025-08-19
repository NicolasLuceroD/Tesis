import { useState, useEffect, useContext} from 'react'
import App from '../../App'
import { DataContext } from '../../context/DataContext'
import { faBarcode, faClipboard, faDollar, faPenToSquare, faSearch, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { MDBInputGroup } from 'mdb-react-ui-kit'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { Button, ButtonGroup } from 'react-bootstrap'
import Paginacion from "../Common/Paginacion";
import Swal from 'sweetalert2'
import { scrollToTop } from '../Utils/scroll'

const Productos = () => {


const [verProductos, setVerProductos] = useState([])
const [Id_producto, setId_producto] = useState('')
const [nombre_producto, setNombre_producto] = useState('')
const [precio_costo, setPrecio_costo] = useState('')
const [precio_unitario, setPrecio_unitario] = useState('')
const [precio_tira, setPrecio_tira] = useState('')
const [precio_caja, setPrecio_caja] = useState('')
const [codigobarras_producto, setCodigobarras_producto] = useState('')
const [inventario_minimo, setInventario_minimo] = useState('')
const [botoneditar, setBotonEditar] = useState(false)
const [verCategorias, setVerCategorias] = useState([])
const [Id_categoria, setId_categoria] = useState(0);
const [buscarproducto, setBuscarProducto] = useState('')
const [ver, setVer] = useState([]);

//URL
const { URL } =  useContext(DataContext)

//TRAER PRODUCTOS
const seeProductos = () =>{
  axios.get(`${URL}productos/verProductos`).then((response)=>{
    console.log(response.data)
    setVerProductos(response.data)
    setTotal(response.data.length)
    setVer(response.data)
  }).catch((error)=>{
    console.error('error al obtener productos', error)
  })
}

//CREAR PRODUCTOS
const crearProductos = () => {
    if(!nombre_producto || !precio_costo || !precio_tira || !precio_unitario || !precio_caja || !inventario_minimo || !codigobarras_producto) 
    {
       Swal.fire({
        icon: 'warning',
        title: 'Advertencia!',
        text: 'Debe completar todos los campos.',
        showConfirmButton: true,
        timerProgressBar: true,
        timer: 2000
       })
       return
    }
  axios.post(`${URL}productos/post`,
    {
      nombre_producto:nombre_producto,
      precio_costo:precio_costo,
      precio_unitario:precio_unitario,
      precio_tira:precio_tira,
      precio_caja:precio_caja,
      codigobarras_producto:codigobarras_producto,
      inventario_minimo:inventario_minimo,
      Id_categoria : Id_categoria
    }).then(()=>{
      Swal.fire({
        icon: 'success',
        title: 'Éxito!',
        text: 'Se registro el producto con éxito',
        showConfirmButton: true,
        timerProgressBar: true,
        timer: 2000,
      })
      seeProductos()
      limpiarCampos()
    })
}

//EDITAR PRODCUTOS
const editarProductos = () => {
  axios.put(`${URL}productos/put/${Id_producto}`,
    {
      Id_producto: Id_producto,
      nombre_producto:nombre_producto,
      precio_costo:precio_costo,
      precio_unitario:precio_unitario,
      precio_tira:precio_tira,
      precio_caja:precio_caja,
      codigobarras_producto:codigobarras_producto,
      inventario_minimo:inventario_minimo,
      Id_categoria : Id_categoria
    }).then(()=>{
      Swal.fire({
        icon: 'success',
        title: 'Éxito!',
        html: `El producto <strong>${nombre_producto}</strong> fue editado con éxito!.`,
        timerProgressBar: true,
        timer: 2500,
        showConfirmButton: true
      })
      seeProductos()
      limpiarCampos()
  })
}

//ELIMINAR PRODUCTO
const eliminarProducto = (val) => {
  Swal.fire({
    title: '¿Estás seguro?',
    html: `¿Deseas eliminar el producto "<strong>${val.nombre_producto}</strong>"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      axios.put(`${URL}productos/delete/${val.Id_producto}`)
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Producto eliminado',
            html: `El producto <strong>${val.nombre_producto}</strong> fue eliminado correctamente.`,
            timer: 2500,
            timerProgressBar: true,
            showConfirmButton: true
          });
          seeProductos();
        })
        .catch((error) => {
          console.error('Error al borrar usuario', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar el producto.',
          });
        });
    }
  });
}; 

//VER CATEGORIAS
const seeCategorias = () => {
    axios.get(`${URL}categoria/verCategoria`).then((response)=> {
        console.log(response.data)
        setVerCategorias(response.data)
    }).catch((error)=> {
        if (error) throw error
        console.error('Error al traer categorias', error)
    })
}

//LIMPIAR CAMPOS
const limpiarCampos = () =>{
  setBotonEditar(false)
  setNombre_producto('')
  setPrecio_costo('')
  setPrecio_unitario('')
  setPrecio_tira('')
  setPrecio_caja('')
  setCodigobarras_producto('')
  setInventario_minimo('')
  setId_categoria(0)
}


//MANEJADOR DE EDICION
const handleProducto = (val) => {
    setBotonEditar(true)
    setCodigobarras_producto(val.codigobarras_producto)
    setNombre_producto(val.nombre_producto)
    setPrecio_costo(val.precio_costo)
    setPrecio_unitario(val.precio_unitario)
    setPrecio_tira(val.precio_tira)
    setPrecio_caja(val.precio_caja)
    setInventario_minimo(val.inventario_minimo)
    setId_producto(val.Id_producto)
    setId_categoria(val.Id_categoria)
    scrollToTop()
}


 //FILTRO POR NOMBRE PRODUCTO
  const buscador = (e) => {
    setBuscarProducto(e.target.value);
  };

// Filtrar productos
  const productosFiltrados = verProductos.filter((dato) =>
    dato.nombre_producto.toLowerCase().includes(buscarproducto.toLowerCase())
  );

//PAGINACION NUEVA
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


useEffect(()=>{
    seeProductos()
    seeCategorias()
},[])

  return (
    <>
    <App/>
    <div className='h3-subtitulos'>
          <h3>PRODUCTOS</h3>
    </div>
     <div className='container-fluid'>
        <div className='container'><br />

        {/* CODIGO BARRAS */}
        <MDBInputGroup className='mb-3'>
        <span className='input-group-text'>
            <FontAwesomeIcon icon={faBarcode} size="lg" style={{color: "#ff5e5e"}}/>
        </span>
        <input className='form-control' type="text" placeholder='Codigo de barras' value={codigobarras_producto} onChange={(e) => setCodigobarras_producto(e.target.value)} />
        </MDBInputGroup>

        {/* NOMBRE PRODUCTO */}
        <MDBInputGroup className='mb-3'>
        <span className='input-group-text'>
            <FontAwesomeIcon icon={faClipboard} size="lg" style={{color: "#ff5e5e"}}/>
        </span>
        <input className='form-control' type='text'  placeholder='Nombre producto' value={nombre_producto} onChange={(e) => setNombre_producto(e.target.value)} />
        <span className='input-group-text'>
         <FontAwesomeIcon icon={faClipboard}/>
        </span>
        </MDBInputGroup>

        
        {/* PRECIO COSTO */}
         <MDBInputGroup className='mb-3'>
        <span className='input-group-text'>
            <FontAwesomeIcon icon={faDollar} size="lg" style={{color: "#ff5e5e"}}/>
        </span>
        <input className='form-control' type='number'  placeholder='Precio costo' value={precio_costo} onChange={(e) => setPrecio_costo(e.target.value)} />
        <span className='input-group-text'>
         <FontAwesomeIcon icon={faDollar}/>
        </span>
        </MDBInputGroup>

        {/* PRECIO UNITARIO */}
         <MDBInputGroup className='mb-3'>
        <span className='input-group-text'>
            <FontAwesomeIcon icon={faDollar} size="lg" style={{color: "#ff5e5e"}}/>
        </span>
        <input className='form-control' type='number'  placeholder='Precio unitario' value={precio_unitario} onChange={(e) => setPrecio_unitario(e.target.value)} />
        <span className='input-group-text'>
         <FontAwesomeIcon icon={faDollar}/>
        </span>
        </MDBInputGroup>

        {/* PRECIO TIRA*/}
         <MDBInputGroup className='mb-3'>
        <span className='input-group-text'>
            <FontAwesomeIcon icon={faDollar} size="lg" style={{color: "#ff5e5e"}}/>
        </span>
        <input className='form-control' type='number'  placeholder='Precio tira' value={precio_tira} onChange={(e) => setPrecio_tira(e.target.value)} />
        <span className='input-group-text'>
         <FontAwesomeIcon icon={faDollar}/>
        </span>
        </MDBInputGroup>


        {/* PRECIO CAJA*/}
         <MDBInputGroup className='mb-3'>
        <span className='input-group-text'>
            <FontAwesomeIcon icon={faDollar} size="lg" style={{color: "#ff5e5e"}}/>
        </span>
        <input className='form-control' type='number'  placeholder='Precio caja' value={precio_caja} onChange={(e) => setPrecio_caja(e.target.value)} />
        <span className='input-group-text'>
         <FontAwesomeIcon icon={faDollar}/>
        </span>
        </MDBInputGroup>
        
        
        {/* INVENTRARIO MINIMO*/}
         <MDBInputGroup className='mb-3'>
        <span className='input-group-text'>
            <FontAwesomeIcon icon={faClipboard} size="lg" style={{color: "#ff5e5e"}}/>
        </span>
        <input className='form-control' type='number'  placeholder='Inventario minimo' value={inventario_minimo} onChange={(e) => setInventario_minimo(e.target.value)} />
        <span className='input-group-text'>
         <FontAwesomeIcon icon={faClipboard}/>
        </span>
        </MDBInputGroup>


  {/*CATEGORIAS SELECT*/}
               <MDBInputGroup className='mb-3'>
                <span className='input-group-text'>
                    <FontAwesomeIcon icon={faClipboard} size="lg" style={{ color: "#ff5e5e" }} />
                </span>

                <select
                    className='form-control'
                    value={Id_categoria}
                    onChange={(e) => setId_categoria(e.target.value)}
                >
                    <option value="">Selecciona una categoría</option>
                    {verCategorias.map((cat) => (
                    <option key={cat.Id_categoria} value={cat.Id_categoria}>
                        {cat.nombre_categoria}
                    </option>
                    ))}
                </select>

                <span className='input-group-text'>
                    <FontAwesomeIcon icon={faClipboard} />
                </span>
                </MDBInputGroup>
    </div>
    </div>
<br />


      <div className='col-12 d-flex justify-content-center'>
            {botoneditar ? (
                <>
                <Button className="me-2" variant='warning' onClick={editarProductos}>EDITAR</Button>
                <Button variant="danger" onClick={limpiarCampos}>CANCELAR</Button>
                </>
            ) : (
                <Button className="me-2" variant="success" onClick={crearProductos}>GUARDAR</Button>
            )}
        </div>
        <br /><br />
    
     <MDBInputGroup className='mb-3'>
        <span className='input-group-text'>
            <FontAwesomeIcon icon={faSearch} size="lg" style={{color: "#ff5e5e"}}/>
        </span>
         <input type="text" placeholder='Busca un producto...' className='form-control' value={buscarproducto} onChange={buscador} /><br />
     </MDBInputGroup>
   

     <table className='custom-table'>
            <thead>
                <tr>
                    <th>FOLIO</th>
                    <th>CODIGO DE BARRAS</th>
                    <th>NOMBRE PRODUCTO</th>
                    <th>PRECIO COSTO</th>
                    <th>PRECIO UNITARIO</th>
                    <th>PRECIO TIRA</th>
                    <th>PRECIO CAJA</th>
                    <th>INVENTARIO MINIMO</th>
                    <th>CATEGORIA</th>
                    <th>FECHA REGISTRO</th>
                    <th>ACCIONES</th>
                </tr>
                </thead>
                <tbody>
                {productosFiltrados.slice(primerIndex, ultimoIndex).map((val) => (
                <tr key={val.Id_producto}>
                <td>{val.Id_producto}</td>
                <td>{val.codigobarras_producto}</td>
                <td>{val.nombre_producto}</td>
                <td><strong>{formatCurrency(val.precio_costo)}</strong></td>
                <td><strong>{formatCurrency(val.precio_unitario)}</strong></td>
                <td><strong>{formatCurrency(val.precio_tira)}</strong></td>
                <td><strong>{formatCurrency(val.precio_caja)}</strong></td>
                <td><strong>{parseInt(val.inventario_minimo)}</strong></td>
                <td>{val.nombre_categoria}</td>
                <td>{new Date(val.FechaRegistro).toLocaleDateString()}</td>
                <td>
                    <ButtonGroup>
                        <Button className="me-2" onClick={() => handleProducto((val))}><FontAwesomeIcon icon={faPenToSquare}></FontAwesomeIcon></Button>
                        <Button variant='danger' onClick={() => eliminarProducto((val))}><FontAwesomeIcon icon={faTrashCan}></FontAwesomeIcon></Button>
                    </ButtonGroup>
                </td>
                </tr>
                ))}
                </tbody>
         </table>
         <div style={{display:'flex',justifyContent:'center', marginTop: '10px'}}>
                <Paginacion productosPorPagina={productosPorPagina}
                    actualPagina={actualPagina}
                    setActualPagina={setActualPagina}
                    total={total}
                />
        </div>

    </>
  )
}

export default Productos