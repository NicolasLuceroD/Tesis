import {useState, useEffect, useContext} from 'react'
import { DataContext } from '../../context/DataContext'
import App from '../../App'
import axios from 'axios'
import { MDBInputGroup } from 'mdb-react-ui-kit'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faPenToSquare, faTrashAlt, faUser } from '@fortawesome/free-regular-svg-icons'
import { faKey, faUserShield, faEyeSlash, faCheck, faSearch } from '@fortawesome/free-solid-svg-icons'
import {  Button, ButtonGroup, Modal } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'; 
import Paginacion from '../Common/Paginacion'
import Swal from 'sweetalert2'

const Usuarios = () => {

//ESTADOS
const [verUsuarios, setVerUsuarios] = useState([])
const [usuariosbaja, setUsuariosBaja] = useState([])
const [Id_usuario, setIdUsuario] = useState('')
const [nombre_usuario, setNombreUsuario] = useState('')
const [clave_usuario, setClaveUsuario] = useState('')
const [rol_usuario, setRolUsuario] = useState('0')
const [botoneditar, setBotonEditar] = useState(false)
const [mostrarClave, setMostrarClave] = useState(false)

//FILTRO BUSCAR USUARIO
const [buscarusuario, setBuscarUsuario] = useState('')
const [ver, setVer] = useState([]);


//MODALES
const [showModalUsuarios, setShowModalUsuarios] = useState(false);

const handleShowModalUsuarios = () => {
    seeUsuariosDadosBaja(); 
    setShowModalUsuarios(true);
}

const handleCloseModalUsuarios = () => setShowModalUsuarios(false);

//URL
const { URL }  = useContext(DataContext)

//TRAER USUARIOS
const seeUsuarios = () => {
    axios.get(`${URL}usuarios/verUsuarios`).then((response)=> {
        console.log(response.data)
        setVerUsuarios(response.data)
        setVer(response.data)
        setTotal(response.data.length)
    }).catch((error)=> {
        console.error('Error al obtener usuarios',error)
    })
}


//TRAER USUARIOS DADOS DE BAJA
const seeUsuariosDadosBaja = () => {
    axios.get(`${URL}usuarios/verUsuariosBaja`).then((response)=> {
        console.log(response.data)
        setUsuariosBaja(response.data)
    }).catch((error)=> {
        console.error('Error al trear usuarios dado de baja', error)
    })
}


//CREAR USUARIOS
const crearUsuarios = () => {
  if (!nombre_usuario || !clave_usuario || rol_usuario === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'CAMPOS INCOMPLETOS',
      text: 'Debe completar todos los campos antes de continuar.',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: true
    })
    return
  }
axios.post(`${URL}usuarios/post`, {
    nombre_usuario: nombre_usuario,
    clave: clave_usuario,
    rol_usuario: rol_usuario
  }).then(() => {
    Swal.fire({
      icon: 'success',
      title: '¡Usuario creado con éxito!',
      html: `El usuario <strong>${nombre_usuario}</strong> ha sido creado con éxito.`,
      confirmButtonColor: '#3085d6',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: true
    })
    seeUsuarios()
    limpiarCampos()
  }).catch((error) => {
    Swal.fire({
      icon: 'error',
      title: 'Error al crear usuario',
      text: 'Ocurrió un problema al registrar el usuario.',
    })
    console.error(error)
  })
}

//EDITAR USUARIOS
const editarUsuarios = () => {
    axios.put(`${URL}usuarios/put/${Id_usuario}`,
    {
        nombre_usuario : nombre_usuario,
        clave : clave_usuario,
        rol_usuario : rol_usuario
    }).then(()=>{
        Swal.fire({
            icon: 'success',
            title: 'Usuario editado con éxito',
            html: `El usuario <strong>${nombre_usuario}</strong> ha sido editado con éxito`,
            confirmButtonColor: '#3085d6',
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: true
        })
        seeUsuarios()
        limpiarCampos()
    })
}

//ELIMINAR USUARIOS
const eliminarUsuario = (val) => {
    Swal.fire({
        title: '¿Estás seguro?',
        html: `¿Deseas eliminar al usuario "<strong>${val.nombre_usuario}</strong>"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            axios.put(`${URL}usuarios/delete/${val.Id_usuario}`)
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Usuario eliminado',
                    html: `El usuario <strong>${val.nombre_usuario}</strong> fue eliminado correctamente.`,
                    timer: 2500,
                    timerProgressBar: true,
                    showConfirmButton: true
                })
                seeUsuarios()
                seeUsuariosDadosBaja()
            })
            .catch((error) => {
                console.error('Error al borrar usuario', error)
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo eliminar el usuario.'
                })
            })
        }
    })
}

//DAR DE ALTA A USUARIOS (MODAL)
const daraltausuarios = (usu) => {
    axios.put(`${URL}usuarios/altausuario/${usu.Id_usuario}`)
        .then(() => {
            Swal.fire({
                icon: 'success',
                title: 'Usuario dado de alta',
                html: `El usuario <strong>${usu.nombre_usuario}</strong> ha sido dado de alta nuevamente!.`,
                timerProgressBar: true,
                timer: 2500,
                showConfirmButton: true
            })
            seeUsuarios()
            seeUsuariosDadosBaja()
        })
        .catch((error) => {
            console.error('Error al dar de alta el usuario', error);
        });
}
//MANEJADOR DE USUARIO
const hanldeUsuario = (val) => {
    setBotonEditar(true)
    setIdUsuario(val.Id_usuario)
    setNombreUsuario(val.nombre_usuario)
    setClaveUsuario(val.clave)
    setRolUsuario(val.rol_usuario)
}

//LIMPIAR CAMPOS
const limpiarCampos = () => {
    setBotonEditar(false)
    setIdUsuario('')
    setNombreUsuario('')
    setClaveUsuario('')
    setRolUsuario(0)
}

//PAGINACION
const usuariosporpagina = 5
const [actualPagina, setActualPagina] = useState(1)
const [total, setTotal] = useState(0)
const ultimoIndex = actualPagina * usuariosporpagina;
const primerIndex = ultimoIndex - usuariosporpagina;

//FILTRO POR NOMBRE USUARIO
  const buscador = (e) => {
    setBuscarUsuario(e.target.value);
  };

// Filtrar productos
  const usuariosFiltrados = verUsuarios.filter((dato) =>
    dato.nombre_usuario.toLowerCase().includes(buscarusuario.toLowerCase())
  );

useEffect(()=>{
    seeUsuarios()
},[])

  return (
    <>
    <App/>
<div className='h3-subtitulos'>
          <h3>USUARIOS</h3>
</div>
        <h2 className='text-center'>ADMINISTRACION DE USUARIOS</h2>
        <h4 className='text-center'>Gestiona todos los usuarios de tu negocio</h4>

        <div className='container-fluid'>
        <div className='container'><br />

        {/* NOMBRE USUARIO */}
        <MDBInputGroup className='mb-3'>
        <span className='input-group-text'>
            <FontAwesomeIcon icon={faUser} size="lg" style={{color: "#ff5e5e"}}/>
        </span>
        <input className='form-control' type="text" placeholder='Ingrese usuario' value={nombre_usuario} onChange={(e) => setNombreUsuario(e.target.value)} />
        </MDBInputGroup>

        {/* CLAVE USUARIO */}
        <MDBInputGroup className='mb-3'>
        <span className='input-group-text'>
            <FontAwesomeIcon icon={faKey} size="lg" style={{color: "#ff5e5e"}}/>
        </span>
        <input className='form-control' type={mostrarClave ? 'text' : 'password'} placeholder='Ingrese clave' value={clave_usuario} onChange={(e) => setClaveUsuario(e.target.value)} />
        <span className='input-group-text' style = {{cursor: 'pointer'}} onClick={() => setMostrarClave(!mostrarClave)}>
         <FontAwesomeIcon icon={mostrarClave ? faEyeSlash : faEye} />
        </span>
        </MDBInputGroup>

        {/* SELECT PARA EL ROL */}
        <MDBInputGroup className='mb-3'>
            <span className="input-group-text">
                <FontAwesomeIcon icon={faUserShield} size="lg" style={{color: "#ff5e5e"}}/>
            </span>
            <Form.Select
                aria-label="Tipo de venta"
                value={rol_usuario}
                onChange={(e) => setRolUsuario(e.target.value)}
                id="usuariosRol"
            >
                <option value="0">Selecciona un rol</option>
                <option value="admin">admin</option>
                <option value="empleado">empleado</option>
                <option value="encargado">encargado</option>
            </Form.Select>
        </MDBInputGroup>
     
    <br />
        {/* BOTONES */}
        <div className='col-12 d-flex justify-content-center'>
            {botoneditar ? (
                <>
                <Button className="me-2" variant='warning' onClick={editarUsuarios}>EDITAR</Button>
                <Button variant="danger" onClick={limpiarCampos}>CANCELAR</Button>
                </>
            ) : (
                <Button className="me-2" variant="success" onClick={crearUsuarios} >GUARDAR</Button>
            )}
        </div>
        <br />
         <MDBInputGroup className='mb-3'>
                        <span className='input-group-text'>
                            <FontAwesomeIcon icon={faSearch} size="lg" style={{color: "#ff5e5e"}}/>
                        </span>
        <input type="text" placeholder='Busca un usuario...' className='form-control' value={buscarusuario} onChange={buscador}/> 
          </MDBInputGroup> 
</div>
</div>    


        {/* TABLA */}
        <br /><br /><br />
        <div className="container table">
                <div className="row">
                    <div className="col">
                    <table className="custom-table">
                <thead>
                    <tr>
                    <th>FOLIO</th>
                    <th>NOMBRE</th>
                    <th>ROL</th>
                    <th>CLAVE</th>
                    <th>ACCIONES</th>
                    </tr>
                </thead>
                <tbody>
                    {usuariosFiltrados.slice(primerIndex, ultimoIndex).map((val)=>(
                        <tr key={val.Id_usuario}>
                            <td>{val.Id_usuario}</td>
                            <td>{val.nombre_usuario}</td>
                            <td>{val.rol_usuario}</td>
                            <td>{val.clave}</td>
                            <td>
                                <ButtonGroup>
                                    <Button className="me-2" variant='primary' onClick={()=> {hanldeUsuario(val)}}><FontAwesomeIcon icon={faPenToSquare}></FontAwesomeIcon></Button>
                                    <Button variant='danger' onClick={() => {eliminarUsuario(val)}}><FontAwesomeIcon icon={faTrashAlt}></FontAwesomeIcon></Button>
                                </ButtonGroup>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div style={{display:'flex',justifyContent:'center', marginTop: '10px'}}>
                <Paginacion productosPorPagina={usuariosporpagina}
                    actualPagina={actualPagina}
                    setActualPagina={setActualPagina}
                    total={total}
                />
            </div>
            </div>
        </div>
        </div>

        <div style={{textAlign: 'center'}}>
            <Button onClick={() => handleShowModalUsuarios()}>USUARIOS DADOS DE BAJA</Button>
        </div>

          <Modal show={showModalUsuarios} onHide={handleCloseModalUsuarios} size='lg'>
        <Modal.Header closeButton>
         <Modal.Title>USUARIOS DADOS DE BAJA</Modal.Title>
        </Modal.Header>
      <Modal.Body>
      <table className='table table-striped table-hover mt-5 shadow-lg custom-table'>
          <thead className='custom-table-header'>
            <tr>
              <th>FOLIO</th>
              <th>NOMBRE</th>
              <th>ROL</th>
              <th>DAR DE ALTA</th>
            </tr>
          </thead>
          <tbody>
            {
            usuariosbaja.map((usu)=>(
              <tr key={usu.Id_usuario}>
                <td>{usu.Id_usuario}</td>
                <td>{usu.nombre_usuario}</td>
                <td>{usu.rol_usuario}</td>
                <td><Button onClick={() => {daraltausuarios(usu)}}><FontAwesomeIcon icon={faCheck}></FontAwesomeIcon></Button></td>
              </tr>
            ))
            }
          </tbody>
        </table>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={(handleCloseModalUsuarios)}>CERRAR</Button>
      </Modal.Footer>
      </Modal>
    </>
  )
}

export default Usuarios