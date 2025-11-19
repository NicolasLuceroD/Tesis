import { useContext, useEffect, useState } from 'react'
import { DataContext } from '../context/DataContext'
import { formatCurrency } from './Utils/formatCurrency'
import App from '../App'
import axios from 'axios'
import DatePicker from 'react-datepicker'
import es from 'date-fns/locale/es';

const MovimientoUsuarios = () => {

//URL
const { URL } = useContext(DataContext)

//ESTADOS
const [movimientos, setMovimientos] = useState([])
const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());

//TRAER MOVIMIENTOS
// const verMovimientos = () => {
//     axios.get(`${URL}movimientosusuarios/verMovimientosUsuarios/${fechaSeleccionada}`).then((response) => {
//         setMovimientos(response.data)
//         console.log('Movimientos usuarios: ', response.data)
//     })
// }

//OBTENER EL ULTIMO DIA DEL MES
const lastDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

//FORMATEAR FECHA VENTA

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
      };


useEffect(()=>{
    const formattedDate = formatDate(fechaSeleccionada)
    axios.get(`${URL}movimientosusuarios/verMovimientosUsuarios/${formattedDate}`).then((response) => {
         setMovimientos(response.data)
         console.log('Movimientos usuarios: ', response.data)
    })
},[fechaSeleccionada])


  return (
   <>
        <App/>
        <div className="h3-subtitulos">
            <h3>MOVIMIENTO USUARIOS</h3>
        </div><br />
        <h2 className="text-center">
            VISUALIZA LAS ENTRADAS Y CIERRES DE LOS USUARIOS.
        </h2>
        <br /><br />

        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '10px', marginBottom: '10px' }}>
                <DatePicker
                        selected={fechaSeleccionada}
                        onChange={(date) => setFechaSeleccionada(date)}
                        className='form-control custom-date-picker custom-datepicker-wrapper'
                        dateFormat="yyyy/MM/d"
                        placeholderText='Ingrese una fecha'
                        locale={es}
                        maxDate={lastDayOfMonth}
                />
        </div>

        <table className='custom-table'>
            <thead>
                    <tr>
                        <th>FOLIO</th>
                        <th>USUARIO</th>
                        <th>FECHA APERTURA</th>
                        <th>FECHA CIERRE</th>
                        <th>MONTO INICIAL</th>
                        <th>MONTO ESPERADO</th>
                        <th>MONTO REAL</th>
                        <th>DIFERENCIA</th>
                    </tr>
            </thead>
          <tbody>
                {movimientos.length === 0 ? (
                    <tr>
                        <td colSpan="8" style={{ textAlign: 'center', padding: '20px', fontWeight: 'bold' }}>
                            No hay movimientos registrados en esta fecha.
                        </td>
                    </tr>
                ) : (
                    movimientos.map((val) => (
                        <tr key={val.Id_apertura}>
                            <td>{val.Id_apertura}</td>
                            <td className='fondo-usu'>{val.usuario}</td>
                            <td>{new Date(val.fecha_apertura).toLocaleString()}</td>
                            <td>{new Date(val.fecha_cierre).toLocaleString()}</td>
                            <td>{formatCurrency(val.monto_inicial)}</td>
                            <td className='fondo-esperado'>{formatCurrency(val.monto_esperado)}</td>
                            <td className='fondo-real'><b>{formatCurrency(val.monto_real)}</b></td>
                            <td className='fondo-dif'>{formatCurrency(val.diferencia)}</td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    </>
  )
}

export default MovimientoUsuarios