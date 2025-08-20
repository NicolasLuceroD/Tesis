import { useContext, useState, useEffect } from 'react'
import App from '../App'
import { DataContext } from '../context/DataContext'
import axios from 'axios'
import Paginacion from './Common/Paginacion'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { MDBInputGroup } from 'mdb-react-ui-kit'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Row, Col, Card } from "react-bootstrap";
import { Accordion } from "react-bootstrap";

const Stock = () => {

//URL
const { URL } = useContext(DataContext)

//ESTADOS
const [stock, setStock] = useState([])

//FILTRO NOMBRE PRODUCTO
const [buscarproducto, setBuscarProducto] = useState('')
const [productoscategoria, setProductosCategoria] = useState([])
const [productosvencidos, setProductosVencidos] = useState([])
const [ver, setVer] = useState([]);

const verStock = () => {
    axios.get(`${URL}stock/verStock`).then((response)=> {
        const stockFormateado = transformarStock(response.data);
        setStock(stockFormateado)
        setVer(stockFormateado)
        setTotal(stockFormateado.length)
    }).catch((err)=> {
        console.error('Error al traer stock', err)
    })
}

const verProductosCategoria = () => {
  axios.get(`${URL}stock/verTotalProductoCategorias`).then((response) => {
    console.log('Productos con categorias: ', response.data)
    setProductosCategoria(response.data)
  }).catch((err) => {
    console.error('Error al obtener productos con categorias', err)
  })
}

const verProductosVencidos = () => {
  axios.get(`${URL}stock/verProductosVencidos`).then((response) => {
    console.log('Productos vencidos: ', response.data)
    setProductosVencidos(response.data)
  }).catch((err) => {
    console.error('Error al obtener productos vencidos', err)
  })
}

  //FILTRO POR NOMBRE PRODUCTO
  const buscador = (e) => {
    setBuscarProducto(e.target.value);
  };

// Filtrar productos
  const productosFiltrados = stock.filter((dato) =>
    dato.nombre_producto.toLowerCase().includes(buscarproducto.toLowerCase())
  );

//PAGINACION
const productosPorPagina = 5
const [actualPagina, setActualPagina] = useState(1)
const [total, setTotal] = useState(0)
const ultimoIndex = actualPagina * productosPorPagina;
const primerIndex = ultimoIndex - productosPorPagina;


const transformarStock = (datos) => {
  return Object.entries(datos).map(([nombre_producto, data]) => ({
    Id_producto: data.Id_producto,
    nombre_producto,
    total_disponible: data.total,
    detalle_fechas: data.detalle_fechas
  }));
};

const colores = [
  "#f8d7da", // Analgésicos - rojo suave
  "#d1ecf1", // Antiinflamatorios - celeste
  "#d9d4edff", // Antibióticos - verde
  "#fff3cd", // Cuidado solar - amarillo
  "#f5c6cb", // Pañales - rosa
  "#bee5eb", // Anticonceptivos - celeste claro
  "#c3e6cb", // Cuidado de piel - verde claro
  "#ffeeba", // Higiene y Limpieza - amarillo claro
  "#d6d8d9", // Salud Sexual - gris claro
  "#f0e68c", // Cremas Corporales - khaki
  "#e6e6fa"  // Extra o respaldo - lavanda
];

useEffect(()=>{
    verStock()
    verProductosCategoria()
    verProductosVencidos()
},[])

  return (
    <>
    <App/>
    <div className="h3-subtitulos">
            <h3>STOCK</h3>
    </div><br />
      <h2 className="text-center">
        VISUALIZA EL STOCK GENERAL DEL NEGOCIO.
      </h2>
    <br /><br />


<Accordion defaultActiveKey={null}>
      <Accordion.Item eventKey="0">
        <Accordion.Header>Productos Vencidos ({productosvencidos.length})</Accordion.Header>
        <Accordion.Body>
          {productosvencidos.length === 0 ? (
            <p>No hay productos vencidos</p>
          ) : (
            <ul className="lista-vencidos">
              {productosvencidos.map((prod, index) => (
                <li
                  key={prod.Id_producto}
                  className="fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <strong>{prod.nombre_producto}</strong> – Total vencido: {prod.total_vencido}
                </li>
              ))}
            </ul>
          )}
        </Accordion.Body>
      </Accordion.Item>
</Accordion>

    <div className="categoria-scroll">
      {productoscategoria.map((prod, index) => (
        <Card key={index} className="mb-3 shadow-sm card-categoria fade-up" style={{ backgroundColor: colores[index % colores.length], minWidth: '300px'}}>
          <Card.Body>
            <Card.Title>{prod.nombre_categoria}</Card.Title>
            <Card.Text>
              <strong>TOTAL DISPONIBLE: {prod.total_disponible}</strong>
            </Card.Text>
          </Card.Body>
        </Card>
      ))}
    </div>
<br />

 
<br />
    
         <MDBInputGroup className='mb-3'>
                <span className='input-group-text'>
                    <FontAwesomeIcon icon={faSearch} size="lg" style={{color: "#4b6cb7"}}/>
                </span>
              <input className='form-control' type="text" placeholder='Busca un producto...' value={buscarproducto} onChange={buscador} /><br />
          </MDBInputGroup>
   
   <table className='custom-table'>
       <thead>
          <tr>
            <th>FOLIO</th>
            <th>PRODUCTO</th>
            <th>TOTAL DISPONIBLE</th>
            <th>FECHAS DE VENCIMIENTO</th>
            <th>UNIDADES</th>
            <th>NRO DE LOTE</th>
          </tr>
        </thead>
        <tbody>
          {productosFiltrados.slice(primerIndex, ultimoIndex).map((val) => (
            <tr key={val.Id_producto}>
              <td>{val.Id_producto}</td>
              <td>{val.nombre_producto}</td>
              <td>{val.total_disponible}</td>

           <td>
            <ul style={{ margin: 0, paddingLeft: '1rem' }}>
              {val.detalle_fechas.map((detalle, i) => {
                const fechaVencimiento = new Date(detalle.fecha_vencimiento);
                const hoy = new Date();
                const estaVencido = fechaVencimiento < hoy; 
                return (
                  <li key={i} style={{ color: estaVencido ? 'red' : 'black', fontWeight: estaVencido ? 'bold' : 'normal' }}>
                    {fechaVencimiento.toLocaleDateString()}
                  </li>
                );
              })}
            </ul>
          </td>

            <td>
              <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                {val.detalle_fechas.map((detalle, i) => {
                  const fechaVencimiento = new Date(detalle.fecha_vencimiento);
                  const hoy = new Date();
                  const estaVencido = fechaVencimiento < hoy;

                  return (
                    <li key={i} style={{ color: estaVencido ? 'red' : 'black', fontWeight: estaVencido ? 'bold' : 'normal' }}>
                      {detalle.cantidad}
                    </li>
                  );
                })}
              </ul>
            </td>


              <td>
                <ul style={{margin: 0, paddingLeft: '1rem'}}>
                  {val.detalle_fechas.map((detalle, i) => (
                  <li key={i}>{detalle.nro_lote}</li>
                  ))}
                </ul>
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

export default Stock