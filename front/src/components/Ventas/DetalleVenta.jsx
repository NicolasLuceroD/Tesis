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
const [detalleventa, setDetalleVenta] = useState([])
const [ventaxdia, setVentaXDia] = useState([])
const [ver, setVer] = useState([]);
const [buscardetalle, setBuscarDetalle] = useState('')




//TRAER DETALLES COMPRA COMPLETOS
const verDetalleCompraCompleto = () => {
    axios.get(`${URL}detalleventa/verDetalleVentaCompletoAgrupado`).then((response) => {
        console.log('Detalle de venta: ', response.data)
        setDetalleVenta(response.data)
        setVer(response.data)
        setTotal(response.data.length)
    }).catch((err) => {
        console.error('Error al traer los detalles', err)
    })
}

const verTotalVentaXDia = () => {
    axios.get(`${URL}detalleventa/verTotalVentasXDia`).then((response)=> {
        setVentaXDia(response.data[0].total_ventas_dia)
    }).catch((err)=> {
        console.error('Error al obtener ventas x dia', err)
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
  const detallesFiltrados = detalleventa.filter((dato) => {
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
    verTotalVentaXDia()
},[])


  return (
    <>
    <App/>
     <div className="h3-subtitulos">
        <h3>DETALLE VENTA</h3>
    </div><br />
     <h2 className="text-center">
        VISUALIZA LOS DETALLES DE VENTA COMPLETOS.
    </h2>

    <p style={{marginLeft: '10px'}}>SUMA TOTAL DE VENTAS EN LA FECHA:  <strong>{formatCurrency(ventaxdia)}</strong></p>
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
  <table className="custom-table">
  <thead className="custom-table-header">
    <tr>
      <th>FOLIO</th>
      <th>PRODUCTO</th>
      <th>CANTIDAD</th>
      <th>TOTAL</th>
      <th>USUARIO QUE REGISTRO LA VENTA</th>
      <th>FECHA REGISTRO</th>
    </tr>
  </thead>
  <tbody>
    {detallesFiltrados.slice(primerIndex,ultimoIndex).map((venta) => (
      <tr key={venta.Id_venta}>
        <td>{venta.Id_venta}</td>

        {/* Lista de productos */}
        <td>
          <ul style={{ paddingLeft: "20px", marginBottom: 0 }}>
            {venta.productos.map((prod) => (
              <li key={prod.Id_detalleventa}>{prod.nombre_producto}</li>
            ))}
          </ul>
        </td>

        {/* Lista de cantidades */}
        <td>
          <ul style={{ paddingLeft: "20px", marginBottom: 0 }}>
            {venta.productos.map((prod) => (
              <li key={prod.Id_detalleventa}>{parseInt(prod.cantidadVendida)}</li>
            ))}
          </ul>
        </td>

        <td data-label="Total" style={{ fontWeight: "700", color: "#182848" }}>
          {formatCurrency(venta.precio_total)}
        </td>

         <td className='columna-detallev-usuario'>{venta.usuario}</td>
         
        {/* Lista de fechas */}
          <td>{new Date(venta.fecha_registro).toLocaleString()}</td>
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