import { useState, useEffect, useContext} from "react"
import App from "../App"
import { DataContext } from "../context/DataContext"
import DatePicker from 'react-datepicker'
import es from 'date-fns/locale/es';
import "react-datepicker/dist/react-datepicker.css";
import DataReportes from "./Common/DataReportes";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Bar,
  LabelList,
} from 'recharts';
import axios from 'axios'
import { format } from 'date-fns'


const Reportes = () => {

//URL
const { URL } = useContext(DataContext)

//ESTADOS ARRAY
const [totalDrogueria, setTotalDrogueria] = useState([])
const [montototalComprado, setMontoTotalComprado] = useState([])
const [productosmascomprados, setProductosMasComprados] = useState([])
const [promediogasto, setPromedioGasto] = useState([])


//ESTADO PARA CALENDARIO
const [fechaInicio, setFechaInicio] = useState(null);
const [fechaFin, setFechaFin] = useState(null);

//OBTENER EL ULTIMO DIA DEL MES
const lastDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);


//TRAER TOTAL COMPRADO POR CADA DROGUERIA
  const verTotalDrogueria = () => {
    if (fechaInicio && fechaFin){
      const inicio = format(fechaInicio, 'yyyy-MM-dd');
      const fin = format(fechaFin, 'yyyy-MM-dd');
      axios.get(`${URL}reportes/verTotalDrogueria`,{
        params: 
        {
          fechaInicio: inicio,
          fechaFin: fin
        }
      }).then((response) => {
          setTotalDrogueria(response.data)
          console.log("Total drogueria: ", response.data)
      }).catch((error=> {
        console.error('Error al traer Total drogueria', error)
      }))
    }
  }

//TRAER LA SUMATORIA GASTADA
  const verTotalGastado = () => {
    if (fechaInicio && fechaFin){
      const inicio = format(fechaInicio, 'yyyy-MM-dd');
      const fin = format(fechaFin, 'yyyy-MM-dd');
      axios.get(`${URL}reportes/verMontoTotalComprado`,{
        params: 
        {
          fechaInicio: inicio,
          fechaFin: fin
        }
      }).then((response) => {
          setMontoTotalComprado(response.data[0].total_comprado)
          console.log("Total comprado: ", response.data)
      }).catch((error=> {
        console.error('Error al traer Total comprado', error)
      }))
    }
  }

  //TRAER PRODUCTOS MAS COMPRADOS
  const verProductosMasComprados = () => {
    if (fechaInicio && fechaFin){
      const inicio = format(fechaInicio, 'yyyy-MM-dd')
      const fin = format(fechaFin, 'yyyy-MM-dd')
      axios.get(`${URL}reportes/verTopProductosComprados`,{
        params: 
        {
          fechaInicio: inicio,
          fechaFin: fin
        }
      }).then((response) => {
        setProductosMasComprados(response.data)
        console.log("Productos mas comprados: ", response.data)
      })
    }
  }

  //TRAER PROMEDIO DE GASTO POR COMPRA
  const verPromedioGastoPorCompra = () => {
    if (fechaInicio && fechaFin) {
      const inicio = format(fechaInicio, 'yyyy-MM-dd')
      const fin = format(fechaFin, 'yyyy-MM-dd')
      axios.get(`${URL}reportes/verPromedioGasto`, {
        params: 
        {
          fechaInicio: inicio,
          fechaFin: fin
        }
      }).then((response)=> {
        setPromedioGasto(response.data[0].promedio_gasto)
      })
    }
  }



//FUNCION FORMATO MONEDA
const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(value);
};



useEffect(()=>{
  verTotalDrogueria()
  verTotalGastado()
  verProductosMasComprados()
  verPromedioGastoPorCompra()
},[fechaInicio, fechaFin])


  return (
    <>
    <App/>
     <div className="h3-subtitulos">
            <h3>REPORTES</h3>
    </div><br />

    <h3 style={{ marginTop: '40px', textAlign: 'center' }}>
      SELECCIONE UN RANGO DE FECHAS PARA EMPEZAR A VER RESULTADOS
    </h3>

<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '30px' }}>
    <DatePicker
        selected={fechaInicio}
        onChange={(date) => setFechaInicio(date)}
        className='form-control custom-date-picker custom-datepicker-wrapper'
        dateFormat="yyyy/MM/d"
        placeholderText='Ingrese una fecha inicio'
        locale={es}
        maxDate={lastDayOfMonth}
    />
    <DatePicker
        selected={fechaFin}
        onChange={(date) => setFechaFin(date)}
        className='form-control custom-date-picker custom-datepicker-wrapper'
        dateFormat="yyyy/MM/d"
        placeholderText='Ingrese una fecha fin'
        locale={es}
        maxDate={lastDayOfMonth}
    />
</div>

<div style={{marginLeft: '15px'}}>
  <p>MONTO TOTAL COMPRADO A DROGUERIAS: <strong>{formatCurrency(montototalComprado)}</strong></p>
  <p>PROMEDIO DE GASTO POR COMPRA (%) : <strong>{formatCurrency(promediogasto)}</strong></p>
</div>

<div style={{ flex: '0 0 48%', marginBottom: '20px' }}>
    <h5 style={{textAlign: 'center'}}>TOTAL COMPRADO A DROGUERIAS</h5>
    {totalDrogueria.length === 0 ?(
      <DataReportes/>
    ) : (
      <ResponsiveContainer width="95%" height={500}>
              <BarChart data={totalDrogueria} layout="vertical">
                <CartesianGrid strokeDasharray="8 8" />
                <XAxis
                  type="number"
                  domain={[0, totalDrogueria.length > 0 ? Math.max(...totalDrogueria.map(item => item.total_comprado)) * 1.5 : 1000]}
                  tickFormatter={formatCurrency}
                />
                <YAxis 
                  type="category"  
                  dataKey="nombre_drogueria" 
                  width={200} 
                />
                <Legend />
                <Bar dataKey="total_comprado" barSize={12} fill="#ff5e5e" isAnimationActive={true} animationDuration={1500}>
                  <LabelList 
                    dataKey="total_comprado" 
                    position="right" 
                    formatter={formatCurrency}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
    )}
  </div>

<br /><br />

  <div style={{ flex: '0 0 48%', marginBottom: '20px' }}>
    <h5 style={{textAlign: 'center'}}>TOP PRODUCTOS MAS COMPRADOS</h5>
    {productosmascomprados.length === 0 ?(
      <DataReportes/>
    ) : (
      <ResponsiveContainer width="95%" height={500}>
              <BarChart data={productosmascomprados} layout="vertical">
                <CartesianGrid strokeDasharray="8 8" />
                <XAxis
                  type="number"
                  domain={[0, productosmascomprados.length > 0 ? Math.max(...productosmascomprados.map(item => item.total_cantidad)) * 1.5 : 1000]}
                />
                <YAxis 
                  type="category"  
                  dataKey="nombre_producto" 
                  width={200} 
                />
                <Legend />
                <Bar dataKey="total_cantidad" barSize={12} fill="#943e29ff" isAnimationActive={true} animationDuration={1500}>
                  <LabelList 
                    dataKey="total_cantidad" 
                    position="right" 
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
    )}
  </div>

</>
  )
}

export default Reportes