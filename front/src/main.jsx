import { createRoot } from 'react-dom/client'

//IMPORTO TODO LO QUE NECESITO PARA CREAR RUTAS
import { BrowserRouter, Route, Routes} from 'react-router-dom'

//IMPORTO MIS RUTAS
import { categoria, app, clientes, metodopago, usuarios, venta, productos, droguerias,compra, detallecompra, stock, reportes, creditosc, creditosp} from './routes/routes.js'

//IMPORTO SUS COMPONENTES
import Categoria from './components/CRUDS/Categoria.jsx'
import Clientes from './components/CRUDS/Clientes.jsx'
import MetodoPago from './components/CRUDS/MetodoPago.jsx'
import Usuarios from './components/CRUDS/Usuarios.jsx'
import Login from './components/Common/Login.jsx'
import Venta from './components/Venta.jsx'
import App from './App.jsx'
import DataProvider from "./context/DataProvider.jsx"; 
import Productos from './components/CRUDS/Productos.jsx'
import Droguerias from './components/CRUDS/Droguerias.jsx'
import Compra from './components/Compras/Compra.jsx'
import DetalleCompra from './components/Compras/DetalleCompra.jsx'
import Stock from './components/Stock.jsx'
import Reportes from './components/Reportes.jsx'
import CreditosClientes from './components/Creditos/CreditosClientes.jsx'
import CreditosProveedores from './components/Creditos/CreditosProveedores.jsx'



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
          <Route path={productos} element={<Productos/>}/>        
          <Route path={droguerias} element={<Droguerias/>}/>        
          <Route path={compra} element={<Compra/>}/>        
          <Route path={detallecompra} element={<DetalleCompra/>}/>
          <Route path={stock} element={<Stock/>}/>
          <Route path={reportes} element={<Reportes/>}/>
          <Route path={creditosp} element={<CreditosProveedores/>}/>
          <Route path={creditosc} element={<CreditosClientes/>}/>
                  
        </Routes>
      </BrowserRouter>
    </DataProvider>
  // {/* </StrictMode> */}
)
