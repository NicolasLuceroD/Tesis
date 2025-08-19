import { useState, useContext, useEffect } from 'react'
import App from '../../App'
import { DataContext } from '../../context/DataContext'
import axios from 'axios'
import Paginacion from '../Common/Paginacion'
import { MDBInputGroup } from 'mdb-react-ui-kit'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'


const DetalleCompra = () => {


//URL
const { URL } = useContext(DataContext)

//ESTADOS
const [detallecompra, setDetalleCompra] = useState([])
const [totalcompra, setTotalCompra] = useState([])
const [ver, setVer] = useState([]);
const [buscardetalle, setBuscarDetalle] = useState('')




//TRAER DETALLES COMPRA COMPLETOS
const verDetalleCompraCompleto = () => {
    axios.get(`${URL}detallecompra/verDetalleCompraCompleto`).then((response) => {
        console.log('Detalle de compra: ', response.data)
        setDetalleCompra(response.data)
        setVer(response.data)
        setTotal(response.data.length)
    }).catch((err) => {
        console.error('Error al traer los detalles', err)
    })
}

//TRAER LOS MONTOS TOTALES DE COMPRA
const verTotalCompra  = () => {
  axios.get(`${URL}detallecompra/verTotalCompras`).then((response) => {
    setTotalCompra(response.data[0].total_compras)
  }).catch((error) => {
    console.error('Error al obtener total compras', error)
  })
}

  //FUNCION PARA PASAR A PESOS ARG
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(value);
  };


 //FILTRO POR DETALLE
  const buscador = (e) => {
    setBuscarDetalle(e.target.value);
  };

// Filtrar detalle
  const detallesFiltrados = detallecompra.filter((dato) => {
    const fechaFormateada = new Date(dato.fecha_registro).toLocaleDateString(); //esto me lo convierte solo a fecha mes y año sacando la hora y minutos
    return fechaFormateada.includes(buscardetalle)
  });



  //PAGINACION
  const detalleporpagina = 10
  const [actualPagina, setActualPagina] = useState(1)
  const [total, setTotal] = useState(0)
  const ultimoIndex = actualPagina * detalleporpagina;
  const primerIndex = ultimoIndex - detalleporpagina;

useEffect(()=>{
    verDetalleCompraCompleto()
    verTotalCompra()
},[])


  return (
    <>
    <App/>
     <div className="h3-subtitulos">
        <h3>DETALLE COMPRA</h3>
    </div><br />
     <h2 className="text-center">
        VISUALIZA LOS DETALLES DE COMPRA COMPLETOS.
    </h2>

<br />
 <MDBInputGroup className='mb-3'>
                <span className='input-group-text'>
                    <FontAwesomeIcon icon={faSearch} size="lg" style={{color: "#4b6cb7"}}/>
                </span>
               <input
                  type="text"
                  className="form-control"
                  placeholder="Busca una compra por fecha (Ej: 19/6/2025)"
                  value={buscardetalle}
                  onChange={buscador}
                /><br />
  </MDBInputGroup>
 
<br />
<p style={{color: 'red', fontWeight: 'bold', marginLeft: '10px'}}>MONTO TOTAL DE COMPRAS: {formatCurrency(totalcompra)}</p>
  <table className="custom-table">
  <thead className="custom-table-header">
    <tr>
      <th>FOLIO</th>
      <th>PRODUCTO</th>
      <th>CANTIDAD</th>
      <th>PRECIO COSTO</th>
      <th>TOTAL</th>
      <th>FECHA REGISTRO</th>
    </tr>
  </thead>
  <tbody>
    {detallesFiltrados.slice(primerIndex,ultimoIndex).map((compra) => (
      <tr key={compra.Id_compra}>
        <td>{compra.Id_compra}</td>

        {/* Lista de productos */}
        <td>
          <ul style={{ paddingLeft: "20px", marginBottom: 0 }}>
            {compra.productos.map((prod) => (
              <li key={prod.Id_detalleCompra}>{prod.nombre_producto}</li>
            ))}
          </ul>
        </td>

        {/* Lista de cantidades */}
        <td>
          <ul style={{ paddingLeft: "20px", marginBottom: 0 }}>
            {compra.productos.map((prod) => (
              <li key={prod.Id_detalleCompra}>{prod.Cantidad}</li>
            ))}
          </ul>
        </td>

        {/* Lista de precios */}
        <td>
          <ul style={{ paddingLeft: "20px", marginBottom: 0 }}>
            {compra.productos.map((prod) => (
              <li key={prod.Id_detalleCompra}>
                {formatCurrency(prod.Precio_costo)}
              </li>
            ))}
          </ul>
        </td>
        
        {/* Total de la venta*/}
        <td data-label="Total" style={{ fontWeight: "700", color: "#182848", backgroundColor: '#8aeb9aff' }}>
          {formatCurrency(compra.precio_total)}
        </td>

        {/* Lista de fechas */}
          <td>{new Date(compra.fecha_registro).toLocaleString()}</td>
      </tr>
    ))}
  </tbody>
</table>

      <div style={{display:'flex',justifyContent:'center', marginTop: '10px'}}>
                      <Paginacion productosPorPagina={detalleporpagina}
                          actualPagina={actualPagina}
                          setActualPagina={setActualPagina}
                          total={total}
                      />
      </div>
    </>
  )
}

export default DetalleCompra