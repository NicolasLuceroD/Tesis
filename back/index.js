require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { Sequelize } = require('sequelize');
const {connection} = require('./database/config')
const bodyParser = require('body-parser');


const app = express();
const port = 2201;


app.use(express.json())
app.use(cors())
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
const sequelize = new Sequelize('dbfarmacia', 'root', 'Lola2201', {
    host: 'localhost',
    dialect: 'mysql'
});

const store = new SequelizeStore({
    db: sequelize
});

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    store: store
}));


const Categoria = require('./routes/Categoria')
const Clientes = require('./routes/Clientes')
const Usuarios = require('./routes/Usuarios')
const Login = require('./routes/Login')
const MetodoPago = require ('./routes/MetodoPago')
const Productos = require('./routes/Productos')
const Droguerias = require('./routes/Droguerias')
const Compra = require('./routes/Compra')
const DetalleCompra = require('./routes/DetalleCompra')
const Lotes = require('./routes/Lotes')
const Stock = require('./routes/Stock')

app.use('/api/categoria', Categoria)
app.use('/api/clientes', Clientes)
app.use('/api/usuarios', Usuarios)
app.use('/api/login', Login)
app.use('/api/metodopago', MetodoPago)
app.use('/api/productos', Productos)
app.use('/api/droguerias', Droguerias)
app.use('/api/compra', Compra)
app.use('/api/detallecompra', DetalleCompra)
app.use('/api/lote', Lotes)
app.use('/api/stock', Stock)

app.listen(3001)

connection.connect((error) => {
    if (error) throw error;
    console.log('bd conectada');
});

store.sync().then(() => {
    app.listen(port, () => {
        console.log(`Server listening at http://localhost:${port}`);
    });
});

app.get("/", (req,res)=>{
    console.log('servidor activo')
})
