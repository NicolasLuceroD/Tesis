import { useContext, useState, useEffect } from 'react'
import App from '../App'
import { DataContext } from '../context/DataContext'
import axios from 'axios'
import Paginacion from './Common/Paginacion'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { MDBInputGroup } from 'mdb-react-ui-kit'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const Stock = () => {

//URL
const { URL } = useContext(DataContext)

//ESTADOS
const [stock, setStock] = useState([])

//FILTRO NOMBRE PRODUCTO
const [buscarproducto, setBuscarProducto] = useState('')
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


useEffect(()=>{
    verStock()
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
                {val.detalle_fechas.map((detalle, i) => (
                  <li key={i}>{new Date(detalle.fecha_vencimiento).toLocaleDateString()}</li>
                ))}
              </ul>
            </td>

            <td>
              <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                {val.detalle_fechas.map((detalle, i) => (
                  <li key={i}>{detalle.cantidad}</li>
                ))}
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