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
const [resumenventas, setResumenVentas] = useState([])
const [productosmasvendidos, setProductosMasVendidos] = useState([])
const [usosporpresentacion, setUsosPorPresentacion] = useState([])

//ESTADO PARA CALENDARIO
const [fechaInicio, setFechaInicio] = useState(null);
const [fechaFin, setFechaFin] = useState(null);

//OBTENER EL ULTIMO DIA DEL MES
const lastDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);


//TRAER TOTAL VENDIDO EN UN RANGO DE FECHAS
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

//TRAER TOTAL VENDIDO A CLIENTES
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

  //TRAER TOTAL VENDIDO METODOS DE PAGO
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

  
  //TRAER RESUMEN VENTAS PAGADAS VS FALTAN PAGAR
  const verResumenVentas = () => {
    if (fechaInicio && fechaFin){
      const inicio = format(fechaInicio, 'yyyy-MM-dd')
      const fin = format(fechaFin, 'yyyy-MM-dd')
      axios.get(`${URL}reporteventa/verResumenVentas`,{
        params: 
        {
          fechaInicio: inicio,
          fechaFin: fin
        }
      }).then((response) => {
        setResumenVentas(response.data)
        console.log('Resumen: ',response.data)
      })
    }
  }

  //TRAER PRODUCTOS MAS VENDIDOS
  const verProductosMasVendidos = () => {
     if (fechaInicio && fechaFin){
      const inicio = format(fechaInicio, 'yyyy-MM-dd')
      const fin = format(fechaFin, 'yyyy-MM-dd')
      axios.get(`${URL}reporteventa/verProductosMasVendidos`,{
        params: 
        {
          fechaInicio: inicio,
          fechaFin: fin
        }
      }).then((response) => {
        setProductosMasVendidos(response.data)
        console.log('Productos mas vendidos: ',response.data)
      })
    }
  }

  //TRAER USOS POR PRESENTACION
  const verUsosPorPresentacion = () => {
     if (fechaInicio && fechaFin){
      const inicio = format(fechaInicio, 'yyyy-MM-dd')
      const fin = format(fechaFin, 'yyyy-MM-dd')
      axios.get(`${URL}reporteventa/verUsosPresentacion`,{
        params: 
        {
          fechaInicio: inicio,
          fechaFin: fin
        }
      }).then((response) => {
        setUsosPorPresentacion(response.data)
        console.log('presentacion: ',response.data)
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
  verResumenVentas()
  verProductosMasVendidos()
  verUsosPorPresentacion()
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

<div className="dashboard-grid">

  {/* ───────────────────────────────────────── */}
  {/* TOTAL VENDIDO A CLIENTES */}
  <div className="chart-box">
    <h5 style={{ textAlign: 'center' }}>TOTAL VENDIDO A CLIENTES</h5>
    {totalvendidoclientes.length === 0 ? (
      <DataReportes />
    ) : (
      <ResponsiveContainer width="95%" height={500}>
        <BarChart data={totalvendidoclientes} layout="vertical">
          <CartesianGrid strokeDasharray="8 8" />
          <XAxis
            type="number"
            domain={[
              0,
              totalvendidoclientes.length > 0
                ? Math.max(...totalvendidoclientes.map(item => item.total_vendido)) * 1.5
                : 1000
            ]}
            tickFormatter={formatCurrency}
          />
          <YAxis type="category" dataKey="nombre_cliente" width={200} />
          <Legend />
          <Bar dataKey="total_vendido" barSize={12} fill="#ff5e5e">
            <LabelList dataKey="total_vendido" position="right" formatter={formatCurrency} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    )}
  </div>

  {/* ───────────────────────────────────────── */}
  {/* TOTAL VENDIDO POR MÉTODO DE PAGO */}
  <div className="chart-box">
  <h5 style={{ textAlign: 'center' }}>TOTAL VENDIDO MÉTODO DE PAGO</h5>

  {totalvendidometodos.length === 0 ? (
    <DataReportes />
  ) : (
    <div
      style={{
        width: 420,           // 🔥 MÁS ANCHO PARA QUE NO SE CORTEN
        height: 330,
        margin: "0 auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            cx="50%"           // 🔥 FIJA LA POSICIÓN, EVITA RECORTES
            cy="50%"
            data={totalvendidometodos.map(item => ({
              ...item,
              total_vendido: parseFloat(item.total_vendido)
            }))}
            dataKey="total_vendido"
            nameKey="metodo_pago"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={2}
            labelLine={true}
            label={({ total_vendido }) =>
              `${formatCurrency(total_vendido)}`
            }
          >
            {totalvendidometodos.map((entry, index) => (
              <Cell key={index} fill={Colors[index % Colors.length]} />
            ))}
          </Pie>
          <Legend verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )}
</div>

  {/* ───────────────────────────────────────── */}
  {/* PAGADO VS FALTA PAGAR */}
  <div className="chart-box">
  <h5 style={{ textAlign: 'center' }}>FALTA PAGAR VS PAGADO</h5>
  {resumenventas.length === 0 ? (
    <DataReportes />
  ) : (
    <div
      style={{
        width: 420,      
        height: 330,      
        margin: "0 auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={resumenventas.map(item => ({
              ...item,
              total: parseFloat(item.total)
            }))}
            dataKey="total"
            nameKey="estado_venta"
            innerRadius={70}   
            outerRadius={100}  
            paddingAngle={2}
            labelLine={true}
            label={({ total }) =>
              `${(total)}`
            }
          >
            {resumenventas.map((entry, index) => (
              <Cell key={index} fill={Colors[index % Colors.length]} />
            ))}
          </Pie>
          <Legend verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )}
</div>

  {/* ───────────────────────────────────────── */}
  {/* TOP PRODUCTOS MÁS VENDIDOS */}
  <div className="chart-box">
    <h5 style={{ textAlign: 'center' }}>TOP PRODUCTOS MÁS VENDIDOS</h5>
    {productosmasvendidos.length === 0 ? (
      <DataReportes />
    ) : (
      <ResponsiveContainer width="95%" height={500}>
        <BarChart data={productosmasvendidos} layout="vertical">
          <CartesianGrid strokeDasharray="8 8" />
          <XAxis
            type="number"
            domain={[
              0,
              productosmasvendidos.length > 0
                ? Math.max(...productosmasvendidos.map(item => item.total_vendido)) * 1.5
                : 1000
            ]}
          />
          <YAxis type="category" dataKey="nombre_producto" width={200} />
          <Legend />
          <Bar dataKey="total_vendido" barSize={12} fill="#ff5e5e">
            <LabelList
              dataKey="total_vendido"
              position="right"
              formatter={value => parseInt(value)}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    )}
  </div>

  {/* ───────────────────────────────────────── */}
  {/* USOS POR PRESENTACIÓN */}
 <div className="chart-box">
  <h5 style={{ textAlign: 'center' }}>USOS POR PRESENTACIÓN</h5>
  {usosporpresentacion.length === 0 ? (
    <DataReportes />
  ) : (
    <div
      style={{
        width: 420,
        height: 330,
        margin: "0 auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            cx="50%"          
            cy="50%"
            data={usosporpresentacion.map((item) => ({...item,cantidad_usos: parseFloat(item.cantidad_usos)}))}
            dataKey="cantidad_usos"
            nameKey="tipoVenta"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={2}
            labelLine={true}
            label={({ cantidad_usos }) => cantidad_usos}
            labelStyle={{ fontSize: 11 }}
          >
            {usosporpresentacion.map((entry, index) => (
              <Cell key={index} fill={Colors[index % Colors.length]} />
            ))}
          </Pie>
          <Legend verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )}
</div>

</div>
</>
  )
}

export default ReporteVenta