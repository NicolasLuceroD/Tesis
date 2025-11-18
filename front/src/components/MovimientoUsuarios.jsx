import { useContext, useEffect, useState } from 'react'
import { DataContext } from '../context/DataContext'
import App from '../App'
import axios from 'axios'

const MovimientoUsuarios = () => {

//URL
const { URL } = useContext(DataContext)

//ESTADOS
const [movimientos, setMovimientos] = useState([])






//TRAER MOVIMIENTOS
const verMovimientos = () => {
    axios.get(`${URL}movimientosusuarios/verMovimientosUsuarios`).then((response) => {
        setMovimientos(response.data)
        console.log('Movimientos usuarios: ', response.data)
    })
}



useEffect(()=>{
    verMovimientos()
},[])




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
                {movimientos.map((val) => (
                    <tr key={val.Id_apertura}>
                    <td>{val.Id_apertura}</td>
                    <td>{val.usuario}</td>
                    <td>{val.fecha_apertura}</td>
                    <td>{val.fecha_cierre}</td>
                    <td>{val.monto_inicial}</td>
                    <td>{val.monto_esperado}</td>
                    <td>{val.monto_real}</td>
                    <td>{val.diferencia}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </>
  )
}

export default MovimientoUsuarios