import { createRoot } from 'react-dom/client'

//IMPORTO TODO LO QUE NECESITO PARA CREAR RUTAS
import { BrowserRouter, Route, Routes} from 'react-router-dom'

//IMPORTO MIS RUTAS
import { categoria, app, clientes, metodopago, usuarios, venta, productos, droguerias,compra, detallecompra, stock, reportes, creditosc, detalleventa, reporteventa, movusuarios} from './routes/routes.js'

//IMPORTO SUS COMPONENTES
import Categoria from './components/CRUDS/Categoria.jsx'
import Clientes from './components/CRUDS/Clientes.jsx'
import MetodoPago from './components/CRUDS/MetodoPago.jsx'
import Usuarios from './components/CRUDS/Usuarios.jsx'
import Login from './components/Common/Login.jsx'
import Venta from './components/Ventas/Venta.jsx'
import DetalleVenta from './components/Ventas/DetalleVenta.jsx'
import App from './App.jsx'
import DataProvider from "./context/DataProvider.jsx"; 
import Productos from './components/CRUDS/Productos.jsx'
import Droguerias from './components/CRUDS/Droguerias.jsx'
import Compra from './components/Compras/Compra.jsx'
import DetalleCompra from './components/Compras/DetalleCompra.jsx'
import Stock from './components/Stock.jsx'
import ReportesCompras from './components/Auditorias/ReportesCompras.jsx'
import CreditosClientes from './components/Creditos/CreditosClientes.jsx'
import ReporteVenta from './components/Auditorias/ReporteVenta.jsx'
import MovimientoUsuarios from './components/MovimientoUsuarios.jsx'




createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route path={app} element = {<App/>} />
          <Route path= "/" element = {<Login/>} />
          <Route path={categoria} element={<Categoria/>}/>
          <Route path={clientes} element={<Clientes/>}/>        
          <Route path={metodopago} element={<MetodoPago/>}/>        
          <Route path={usuarios} element={<Usuarios/>}/>        
          <Route path={venta} element={<Venta/>}/>       
          <Route path={detalleventa} element={<DetalleVenta/>}/>       
          <Route path={productos} element={<Productos/>}/>        
          <Route path={droguerias} element={<Droguerias/>}/>        
          <Route path={compra} element={<Compra/>}/>        
          <Route path={detallecompra} element={<DetalleCompra/>}/>
          <Route path={stock} element={<Stock/>}/>
          <Route path={reportes} element={<ReportesCompras/>}/>
          <Route path={creditosc} element={<CreditosClientes/>}/>
          <Route path={reporteventa} element={<ReporteVenta/>}/>
          <Route path={movusuarios} element={<MovimientoUsuarios/>}/>
        </Routes>
      </BrowserRouter>
    </DataProvider>
  // {/* </StrictMode> */}
)
