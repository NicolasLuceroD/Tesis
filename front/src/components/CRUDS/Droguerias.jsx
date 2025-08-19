import App from '../../App'
import '../../App.css'
import { useState, useEffect, useContext } from 'react'
import { DataContext } from '../../context/DataContext'
import axios from 'axios'
import { MDBInputGroup } from 'mdb-react-ui-kit'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faIdCard, faPenToSquare, faTrashAlt, faUser } from '@fortawesome/free-regular-svg-icons'
import { faLocationDot, faPhone, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Button, ButtonGroup } from 'react-bootstrap'
import Paginacion from "../Common/Paginacion";
import { scrollToTop } from '../Utils/scroll'

const Droguerias = () => {

//ESTADOS
const [droguerias, setVerDroguerias] = useState([])
const [Id_drogueria, setIdDrogueria] = useState('')
const [nombre_drogueria, setNombreDrogueria] = useState('')
const [cuit_drogueria, setCuitDrogueria] = useState('')
const [telefono_drogueria, setTelefonoDrogueria] = useState('')
const [direccion_drogueria, setDireccionDrogueria] = useState('')
const [correo_drogueria, setCorreoDrogueria] = useState('')
const [botoneditar, setBotonEditar] = useState(false)

//FILTRO NOMBRE DROGUERIA
const [buscardrogueria, setBuscarDrogueria] = useState('')
const [ver, setVer] = useState([]);

//URL
const { URL } = useContext(DataContext)

//TRAER DROGUERIAS
const verDroguerias = () => {
  axios.get(`${URL}droguerias/verDroguerias`).then((response)=>{
  console.log('Droguerias: ', response.data)
  setVerDroguerias(response.data)
  setVer(response.data)
  setTotal(response.data.length)
  }).catch((err)=>{
    console.error('Error al obtener droguerias', err)
  })
}

//CREAR DROGUERIAS
const crearDrogueria = () => {
  if(!nombre_drogueria || !cuit_drogueria || !telefono_drogueria || !direccion_drogueria || !correo_drogueria)
  {
    alert('Debe completar todos los campos')
    return
  }
  axios.post(`${URL}droguerias/post`,
    {
      nombre_drogueria: nombre_drogueria,
      Cuit_drogueria: cuit_drogueria,
      telefono_drogueria : telefono_drogueria,
      direccion_drogueria : direccion_drogueria,
      correo_drogueria : correo_drogueria
    }).then(()=>{
      alert('Drogueria creada con exito')
      verDroguerias()
      limpiarCampos()
    })
}

//EDITAR DROGUERIAS
const editarDrogueria = () => {
  axios.put(`${URL}droguerias/put/${Id_drogueria}`,
    {
      Id_drogueria : Id_drogueria,
      nombre_drogueria : nombre_drogueria,
      Cuit_drogueria : cuit_drogueria,
      telefono_drogueria : telefono_drogueria,
      direccion_drogueria : direccion_drogueria,
      correo_drogueria : correo_drogueria
    }).then(()=>{
      alert('Drogueria editada con exito')
      verDroguerias()
      limpiarCampos()
    }).catch((err)=> {
      console.error('Error al editar drogueria', err)
    })
}

const eliminarDrogueria = (val) => {
  axios.put(`${URL}droguerias/delete/${val.Id_drogueria}`).then(()=>{
    alert('Drogueria eliminada con exito')
    verDroguerias()
  }).catch((err)=>{
    console.error('Error al eliminar drogueria',err)
  })
}


const handleDrogueria = (val) => {
  setIdDrogueria(val.Id_drogueria)
  setNombreDrogueria(val.nombre_drogueria)
  setCuitDrogueria(val.Cuit_drogueria)
  setTelefonoDrogueria(val.telefono_drogueria)
  setDireccionDrogueria(val.direccion_drogueria)
  setCorreoDrogueria(val.correo_drogueria)
  setBotonEditar(true)
  scrollToTop()
}


const limpiarCampos = () => {
  setNombreDrogueria('')
  setCuitDrogueria('')
  setDireccionDrogueria('')
  setCorreoDrogueria('')
  setTelefonoDrogueria('')
  setBotonEditar(false)
}

 //FILTRO POR NOMBRE PRODUCTO
  const buscador = (e) => {
    setBuscarDrogueria(e.target.value);
  };

// Filtrar productos
  const drogueriasFiltradas = droguerias.filter((dato) =>
    dato.nombre_drogueria.toLowerCase().includes(buscardrogueria.toLowerCase())
  );

//PAGINACION
const drogueriasporpagina = 5
const [actualPagina, setActualPagina] = useState(1)
const [total, setTotal] = useState(0)
const ultimoIndex = actualPagina * drogueriasporpagina;
const primerIndex = ultimoIndex - drogueriasporpagina;

useEffect(() =>{
verDroguerias()
},[])


  return (
    <>
    <App/>
        <div className='h3-subtitulos'>
            <h3>DROGUERIAS</h3>
        </div>
        <br />
        <h2 className='text-center'>ADMINISTRACION DE DROGUERIAS</h2>
        <h4 className='text-center'>Gestiona todas las droguerias con las que se trabaja de manera centralizada.</h4>

        {/* INPUTS */}
        {/* NOMBRE */}
        <div className='container-fluid'>
          <div className='container'>
   
         <MDBInputGroup className='mb-3'>
        <span className='input-group-text'>
            <FontAwesomeIcon icon={faUser} size="lg" style={{color: "#ff5e5e"}}/>
        </span>
        <input className='form-control' type="text" placeholder='Ingrese nombre...' value={nombre_drogueria} onChange={(e) => setNombreDrogueria(e.target.value.toUpperCase())}/>
         </MDBInputGroup>

         {/* CUIT */}
           <MDBInputGroup className='mb-3'>
        <span className='input-group-text'>
            <FontAwesomeIcon icon={faIdCard} size="lg" style={{color: "#ff5e5e"}}/>
        </span>
        <input className='form-control' type="text" placeholder='Ingrese cuit...' value={cuit_drogueria} onChange={(e) => setCuitDrogueria(e.target.value.toUpperCase())}/>
         </MDBInputGroup>

         {/* TELEFONO */}
         <MDBInputGroup className='mb-3'>
        <span className='input-group-text'>
            <FontAwesomeIcon icon={faPhone} size="lg" style={{color: "#ff5e5e"}}/>
        </span>
        <input className='form-control' type="text" placeholder='Ingrese telefono...' value={telefono_drogueria} onChange={(e) => setTelefonoDrogueria(e.target.value)}/>
         </MDBInputGroup>

         {/* DIRECCION */}
        <MDBInputGroup className='mb-3'>
        <span className='input-group-text'>
            <FontAwesomeIcon icon={faLocationDot} size="lg" style={{color: "#ff5e5e"}}/>
        </span>
        <input className='form-control' type="text" placeholder='Ingrese direccion...' value={direccion_drogueria} onChange={(e) => setDireccionDrogueria(e.target.value.toUpperCase())}/>
         </MDBInputGroup>

         {/* CORREO */}
        <MDBInputGroup className='mb-3'>
        <span className='input-group-text'>
            <FontAwesomeIcon icon={faEnvelope} size="lg" style={{color: "#ff5e5e"}}/>
        </span>
        <input className='form-control' type="text" placeholder='Ingrese correo...' value={correo_drogueria} onChange={(e) => setCorreoDrogueria(e.target.value)}/>
         </MDBInputGroup>
     </div>
</div>
         <div className='col-12 d-flex justify-content-center'>
        {botoneditar ? (
            <>
               <Button className="me-2" variant='warning' onClick={editarDrogueria}>EDITAR</Button>
               <Button variant='danger' onClick={limpiarCampos}>CANCELAR</Button>
            </>
        ) : (
            <>
            <Button variant='success' onClick={crearDrogueria}>GUARDAR</Button>
            </>
        )}  
        </div>
<br /><br />
           <MDBInputGroup className='mb-3'>
                <span className='input-group-text'>
                    <FontAwesomeIcon icon={faSearch} size="lg" style={{color: "#ff5e5e"}}/>
                </span>
                <input type="text" placeholder='Busca una drogueria...' className='form-control' value={buscardrogueria} onChange={buscador} /><br />
             </MDBInputGroup>
      

        <table className="custom-table">
          <thead>
            <tr>
              <th>NOMBRE</th>
              <th>CUIT</th>
              <th>TELEFONO</th>
              <th>DIRECCION</th>
              <th>CORREO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {drogueriasFiltradas.slice(primerIndex,ultimoIndex).map((val) =>(
              <tr key={val.Id_drogueria}>
                <td>{val.nombre_drogueria}</td>
                <td>{val.Cuit_drogueria}</td>
                <td>{val.telefono_drogueria}</td>
                <td>{val.direccion_drogueria}</td>
                <td>{val.correo_drogueria}</td>
                <td>
                <ButtonGroup>
                    <Button className="me-2" variant='primary' onClick={() => {handleDrogueria(val)}}><FontAwesomeIcon icon={faPenToSquare}></FontAwesomeIcon></Button>
                    <Button variant='danger' onClick={() => {eliminarDrogueria(val)}}><FontAwesomeIcon icon={faTrashAlt}></FontAwesomeIcon></Button>
                </ButtonGroup>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
                <div style={{display:'flex',justifyContent:'center', marginTop: '10px'}}>
                <Paginacion productosPorPagina={drogueriasporpagina}
                    actualPagina={actualPagina}
                    setActualPagina={setActualPagina}
                    total={total}
                />
            </div>
    </>
  )
}

export default Droguerias