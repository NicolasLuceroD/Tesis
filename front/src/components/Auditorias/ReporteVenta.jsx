import { useState, useEffect, useContext} from "react"
import {DataContext} from '../../context/DataContext'
import App from '../../App'
import DatePicker from 'react-datepicker'
import es from 'date-fns/locale/es';
import "react-datepicker/dist/react-datepicker.css";
import DataReportes from "../Common/DataReportes";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Bar,
  LabelList,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import axios from 'axios'
import { format } from 'date-fns'


const ReporteVenta = () => {

//URL
const { URL } = useContext(DataContext)

//ESTADOS ARRAY
const [totalvendido,setTotalVendido] = useState([])
const [totalvendidoclientes, setTotalVendidoClientes] = useState([])
const [totalvendidometodos, setTotalVendidoMetodos] = useState([])

//ESTADO PARA CALENDARIO
const [fechaInicio, setFechaInicio] = useState(null);
const [fechaFin, setFechaFin] = useState(null);

//OBTENER EL ULTIMO DIA DEL MES
const lastDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);


//TRAER TOTAL COMPRADO POR CADA DROGUERIA
  const verTotalVendido = () => {
    if (fechaInicio && fechaFin){
      const inicio = format(fechaInicio, 'yyyy-MM-dd');
      const fin = format(fechaFin, 'yyyy-MM-dd');
      axios.get(`${URL}reporteventa/verTotalVendido`,{
        params: 
        {
          fechaInicio: inicio,
          fechaFin: fin
        }
      }).then((response) => {
          setTotalVendido(response.data[0].total_vendido)
      }).catch((error=> {
        console.error('Error al traer total vendido', error)
      }))
    }
  }

//TRAER LA SUMATORIA GASTADA
  const verTotalVendidoClientes = () => {
    if (fechaInicio && fechaFin){
      const inicio = format(fechaInicio, 'yyyy-MM-dd');
      const fin = format(fechaFin, 'yyyy-MM-dd');
      axios.get(`${URL}reporteventa/verTotalVendidoClientes`,{
        params: 
        {
          fechaInicio: inicio,
          fechaFin: fin
        }
      }).then((response) => {
          setTotalVendidoClientes(response.data)
          console.log('Total vendido  a clientes: ',response.data)
      }).catch((error=> {
        console.error('Error al traer Total comprado', error)
      }))
    }
  }

  //TRAER PRODUCTOS MAS COMPRADOS
  const verTotalVendidoMetodos = () => {
    if (fechaInicio && fechaFin){
      const inicio = format(fechaInicio, 'yyyy-MM-dd')
      const fin = format(fechaFin, 'yyyy-MM-dd')
      axios.get(`${URL}reporteventa/verTotalVendidoMetodos`,{
        params: 
        {
          fechaInicio: inicio,
          fechaFin: fin
        }
      }).then((response) => {
        setTotalVendidoMetodos(response.data)
        console.log('Total vendido mp: ',response.data)
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


const Colors = [
  "#ff5e5e", // rojo coral (base)
  "#ff8c42", // naranja cálido
  "#ff3d71", // fucsia intenso
  "#ffb84d", // dorado suave
  "#e63e3e"  // rojo oscuro
];




useEffect(()=>{
  verTotalVendido()
  verTotalVendidoClientes()
  verTotalVendidoMetodos()
},[fechaInicio, fechaFin])


  return (
    <>
    <App/>
     <div className="h3-subtitulos">
            <h3>REPORTES VENTAS</h3>
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
  <p>MONTO TOTAL VENDIDO A LA FECHA: <strong>{formatCurrency(totalvendido)}</strong></p>
</div>

<div style={{ flex: '0 0 48%', marginBottom: '20px' }}>
    <h5 style={{textAlign: 'center'}}>TOTAL VENDIDO A CLIENTES</h5>
    {totalvendidoclientes.length === 0 ?(
      <DataReportes/>
    ) : (
      <ResponsiveContainer width="95%" height={500}>
              <BarChart data={totalvendidoclientes} layout="vertical">
                <CartesianGrid strokeDasharray="8 8" />
                <XAxis
                  type="number"
                  domain={[0, totalvendidoclientes.length > 0 ? Math.max(...totalvendidoclientes.map(item => item.total_vendido)) * 1.5 : 1000]}
                  tickFormatter={formatCurrency}
                />
                <YAxis 
                  type="category"  
                  dataKey="nombre_cliente" 
                  width={200} 
                />
                <Legend />
                <Bar dataKey="total_vendido" barSize={12} fill="#ff5e5e" isAnimationActive={true} animationDuration={1500}>
                  <LabelList 
                    dataKey="total_vendido" 
                    position="right" 
                    formatter={formatCurrency}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
    )}
  </div>

<br /><br />

 <div className="col" style={{ flex: '1 1 45%', marginTop: '100px', minWidth: '300px' }}>
           <h5 style={{textAlign: 'center'}}>TOTAL VENDIDO METODO DE PAGO</h5>
          <div>
              {totalvendidometodos.length === 0 ? (
                  <DataReportes />
              ) : (
                  <ResponsiveContainer width="100%" height={500}>
                  <PieChart>
                     <Pie
                        data={totalvendidometodos.map(item => ({...item,total_vendido: parseFloat(item.total_vendido)}))}
                        dataKey="total_vendido"
                        nameKey="metodo_pago"
                        innerRadius={120}
                        outerRadius={200}
                        fill="#82ca9d"
                        label={({ metodo_pago, total_vendido }) =>
                          `${metodo_pago}: ${formatCurrency(total_vendido)}`
                        }
                      >
                        {totalvendidometodos.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={Colors[index % Colors.length]} />
                        ))}
                      </Pie>

                  </PieChart>
                  </ResponsiveContainer>
              )}
          </div>
</div>

</>
  )
}

export default ReporteVenta