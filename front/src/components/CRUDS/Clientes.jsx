import React from 'react'
import {useState, useEffect, useContext} from 'react'
import { DataContext } from "../../context/DataContext";
import App from '../../App'
import { MDBInputGroup } from 'mdb-react-ui-kit'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faCreditCard, faIdCard, faMap, faMoneyBill1, faUser, faUserCircle, faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import { faHome, faPhone, faSearch } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';
import { Button, ButtonGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Paginacion from '../Common/Paginacion';
import Swal from 'sweetalert2';
import { scrollToTop } from '../Utils/scroll';

const Clientes = () => {

//ESTADOS
const [Id_cliente, setIdCliente] = useState('')
const [verClientes, setVerClientes] = useState([])
const [nombre_cliente, setNombreCliente] = useState('')
const [apellido_cliente, setApellidoCliente] = useState('')
const [telefono_cliente, setTelefonoCliente] = useState('')
const [domicilio_cliente, setDomicilioCliente] = useState('')
const [documento_cliente, setDocumentoCliente] = useState('')
const [monto_credito, setMontoCredito] = useState('')
const [limite_credito, setLimiteCredito] = useState('')
const [botoneditar, setBotonEditar] = useState(false)

//FILTRO BUSCAR CLIENTE
const [buscarcliente, setBuscarCliente] = useState('')
const [ver, setVer] = useState([])

//URL
const { URL } = useContext(DataContext)
const navigate = useNavigate();

//TRAER CLIENTES
const seeClientes = () => {
    axios.get(`${URL}clientes/verClientes`).then((response)=> {
        console.log('Clientes: ', response.data)
        setVerClientes(response.data)
        setVer(response.data)
        setTotal(response.data.length)
    }).catch((error)=> {
        console.error('Error al traer los clientes', error)
    })
}

//CREAR CLIENTES
const crearCliente = () => {
    if(!nombre_cliente || !apellido_cliente || !telefono_cliente || !domicilio_cliente || !documento_cliente || !monto_credito || !limite_credito) {
         Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: 'Debe completar todos los campos.',
            showConfirmButton: true,
            timer: 2000,
            timerProgressBar: true
        })
        return
    }
    axios.post(`${URL}clientes/post`,
        {
         nombre_cliente : nombre_cliente,
         apellido_cliente : apellido_cliente,
         telefono_cliente : telefono_cliente, 
         domicilio_cliente : domicilio_cliente,
         documento_cliente : documento_cliente,
         monto_credito : monto_credito,
         limite_credito : limite_credito,
        }).then(()=> {
        Swal.fire({
            icon: 'success',
            title: 'Exito!',
            html: `El cliente <strong>${nombre_cliente}</strong> fue creada con exito!.`,
            showConfirmButton: true,
            timer: 2000,
            timerProgressBar: true
        })
        seeClientes()
        limpiarCampos()
    }).catch((error)=> {
        console.error('Error al crear cliente: ', error)
        if (error.response && error.response.status === 401){
            console.warn('Token expirado')
            alert('Tu sesion ha expirado. Por favor inicia sesion nuevamente')
            navigate('/')
        }
    })
}

const editarCliente = () => {
    axios.put(`${URL}clientes/put/${Id_cliente}`,
        {
            Id_cliente : Id_cliente,
            nombre_cliente : nombre_cliente,
            apellido_cliente : apellido_cliente,
            telefono_cliente : telefono_cliente, 
            domicilio_cliente : domicilio_cliente,
            documento_cliente : documento_cliente,
            monto_credito : monto_credito,
            limite_credito : limite_credito,
        }).then(()=> {
             Swal.fire({
                icon: 'success',
                title: 'Exito!',
                html: `El cliente <strong>${nombre_cliente}</strong> fue editado con exito!.`,
                showConfirmButton: true,
                timer: 2000,
                timerProgressBar: true
            })
            seeClientes()
            limpiarCampos()
        }).catch((error)=> {
            console.error('Error al editar el cliente', error)
        })
}

const eliminarCliente = (val) => {
  Swal.fire({
    title: '¿Estás seguro?',
    html: `¿Deseas eliminar al cliente "<strong>${val.nombre_cliente}</strong>"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      axios.put(`${URL}clientes/delete/${val.Id_cliente}`)
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: '¡Cliente eliminado!',
            html: `El cliente <strong>${val.nombre_cliente}</strong> fue eliminado correctamente.`,
            timer: 2500,
            timerProgressBar: true,
            showConfirmButton: true
          });
          seeClientes();
        })
        .catch((error) => {
          console.error('Error al eliminar cliente:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar el cliente.',
          });
        });
    }
  });
};


//MANEJADOR DE BOTON EDITAR
const handleCliente = (val) => {
    setBotonEditar(true)
    setIdCliente(val.Id_cliente)
    setNombreCliente(val.nombre_cliente)
    setApellidoCliente(val.apellido_cliente)
    setTelefonoCliente(val.telefono_cliente)
    setDomicilioCliente(val.domicilio_cliente)
    setDocumentoCliente(val.documento_cliente)
    setMontoCredito(val.monto_credito)
    setLimiteCredito(val.limite_credito)
    scrollToTop()
}

//LIMPIO CAMPOS
const limpiarCampos = () => {
    setNombreCliente('')
    setApellidoCliente('')
    setTelefonoCliente('')
    setDomicilioCliente('')
    setDocumentoCliente('')
    setMontoCredito('')
    setLimiteCredito('')
    setBotonEditar(false)
}


//FORMATEO DE MONEDA
const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(value);
  };

//PAGINACION
const clientesporpagina = 5
const [actualPagina, setActualPagina] = useState(1)
const [total, setTotal] = useState(0)
const ultimoIndex = actualPagina * clientesporpagina;
const primerIndex = ultimoIndex - clientesporpagina;

//FILTRO POR NOMBRE USUARIO
  const buscador = (e) => {
    setBuscarCliente(e.target.value);
  };

// Filtrar productos
  const clientesFiltrados = verClientes.filter((dato) =>
    dato.nombre_cliente.toLowerCase().includes(buscarcliente.toLowerCase())
  );

useEffect(()=> {
    seeClientes()
},[])

  return (
<>
        <App/>
<div className='h3-subtitulos'>
          <h3>CLIENTES</h3>
</div>
    <div className='container-fluid'>
        <div className='container'><br />
            <h2 className='text-center'>ADMINISTRACION DE CLIENTES</h2>
            <h4 className='text-center'>Gestiona todos los clientes de tu negocio.</h4>
    </div>
<br />

        {/* INPUTS */}
        {/* NOMBRE */}
            <MDBInputGroup className='mb-3'>
        <span className='input-group-text'>
            <FontAwesomeIcon icon={faUser} size="lg" style={{color: "#ff5e5e"}}/>
        </span>
        <input className='form-control' type="text" placeholder='Ingrese nombre...' value={nombre_cliente} onChange={(e) => setNombreCliente(e.target.value.toUpperCase())}/>
            </MDBInputGroup>

        {/* APELLIDO */}
            <MDBInputGroup className='mb-3'>
        <span className='input-group-text'>
            <FontAwesomeIcon icon={faUserCircle} size="lg" style={{color: "#ff5e5e"}}/>
        </span>
        <input className='form-control' type="text" placeholder='Ingrese apellido...' value={apellido_cliente} onChange={(e) => setApellidoCliente(e.target.value.toUpperCase())}/>
            </MDBInputGroup>

        {/* TELEFONO */}
            <MDBInputGroup className='mb-3'>
        <span className='input-group-text'>
            <FontAwesomeIcon icon={faPhone} size="lg" style={{color: "#ff5e5e"}}/>
        </span>
        <input className='form-control' type="text" placeholder='Ingrese telefono...' value={telefono_cliente} onChange={(e) => setTelefonoCliente(e.target.value)}/>
            </MDBInputGroup>

        {/* CASA */}
            <MDBInputGroup className='mb-3'>
        <span className='input-group-text'>
            <FontAwesomeIcon icon={faHome} size="lg" style={{color: "#ff5e5e"}}/>
        </span>
        <input className='form-control' type="text" placeholder='Ingrese domicilio...'  value={domicilio_cliente} onChange={(e) => setDomicilioCliente(e.target.value.toUpperCase())}/>
            </MDBInputGroup>

        {/* DOCUMENTO */}
            <MDBInputGroup className='mb-3'>
        <span className='input-group-text'>
            <FontAwesomeIcon icon={faIdCard} size="lg" style={{color: "#ff5e5e"}}/>
        </span>
        <input className='form-control' type="text" placeholder='Ingrese documento...' value={documento_cliente} onChange={(e)=> setDocumentoCliente(e.target.value)}/>
            </MDBInputGroup>

        {/* MONTO CREDITO */}
            <MDBInputGroup className='mb-3'>
        <span className='input-group-text'>
            <FontAwesomeIcon icon={faMoneyBill1} size="lg" style={{color: "#ff5e5e"}}/>
        </span>
        <input className='form-control' type="number" placeholder='Ingrese monto credito...' value={monto_credito} onChange={(e)=> setMontoCredito(e.target.value)}/>
            </MDBInputGroup>

        {/* LIMITE CREDITO */}
            <MDBInputGroup className='mb-3'>
        <span className='input-group-text'>
            <FontAwesomeIcon icon={faCreditCard} size="lg" style={{color: "#ff5e5e"}}/>
        </span>
        <input className='form-control' type="number" placeholder='Ingrese limite credito...' value={limite_credito} onChange={(e)=> setLimiteCredito(e.target.value)}/>
            </MDBInputGroup>
        </div>

     <div className='col-12 d-flex justify-content-center'>
        {botoneditar ? (
            <>
               <Button className="me-2"variant='warning' onClick={editarCliente}>EDITAR</Button>
               <Button variant='danger' onClick={limpiarCampos}>CANCELAR</Button>
            </>
        ) : (
            <>
            <Button variant='success' onClick={crearCliente}>GUARDAR</Button>
            </>
        )}  
    </div>
    <div style={{marginTop: '30px'}}>
        <MDBInputGroup className='mb-3'>
                <span className='input-group-text'>
                    <FontAwesomeIcon icon={faSearch} size="lg" style={{color: "#ff5e5e"}}/>
                </span>
        <input type="text" placeholder='Busca un cliente...' className='form-control' value={buscarcliente} onChange={buscador} />
        </MDBInputGroup> 
    </div>
    

    <div className='container-table'>
        <div className='row'>
            <div className='col'>
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>FOLIO</th>
                            <th>NOMBRE</th>
                            <th>APELLIDO</th>
                            <th>TELEFONO</th>
                            <th>DOMICILIO</th>
                            <th>DOCUMENTO</th>
                            <th>MONTO CREDITO</th>
                            <th>LIMITE CREDITO</th>
                            <th>ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientesFiltrados.slice(primerIndex,ultimoIndex).map((val)=>(
                            <tr key={val.Id_cliente}>
                            <td>{val.Id_cliente}</td>       
                            <td>{val.nombre_cliente}</td>
                            <td>{val.apellido_cliente}</td>
                            <td>{val.telefono_cliente}</td>
                            <td>{val.domicilio_cliente}</td>
                            <td>{val.documento_cliente}</td>
                            <td>{val.monto_credito}</td>
                            <td>{formatCurrency(val.limite_credito)}</td>
                            <td>
                            <ButtonGroup>
                                <Button className="me-2" variant='primary' onClick={() => {handleCliente(val)}}><FontAwesomeIcon icon={faPenToSquare}></FontAwesomeIcon></Button>
                                <Button variant='danger' onClick={() => {eliminarCliente(val)}}><FontAwesomeIcon icon={faTrashAlt}></FontAwesomeIcon></Button>
                            </ButtonGroup>
                            </td>
                            </tr>                   
                        ))}
                    </tbody>
                </table>
                <div style={{display:'flex',justifyContent:'center', marginTop: '10px'}}>
                                <Paginacion productosPorPagina={clientesporpagina}
                                    actualPagina={actualPagina}
                                    setActualPagina={setActualPagina}
                                    total={total}
                                />
                </div>
            </div>
        </div>
    </div>
</>
  )
}

export default Clientes