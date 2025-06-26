import { useContext, useState, useEffect } from 'react'
import App from '../../App'
import { DataContext } from '../../context/DataContext'
import axios from 'axios'
import { Button, ButtonGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrashAlt, faUser } from '@fortawesome/free-regular-svg-icons'
import { MDBInputGroup } from 'mdb-react-ui-kit'
import { faWallet } from '@fortawesome/free-solid-svg-icons'

const MetodoPago = () => {

//ESTADOS 
const [verMetodoPago, setVerMetodoPago] = useState ([])
const [Id_metodoPago, setIdMetodoPago] = useState ('')
const [nombre_metodopago, setNombreMetodoPago] = useState ('')
const [botoneditar, setBotonEditar] = useState(false)

//URL 
const {URL} = useContext(DataContext)


//TRAER METODOS
const verMetodos = () => {
  axios.get(`${URL}metodopago/verMetodoPago`).then((response)=>{
    console.log(response.data)
   setVerMetodoPago(response.data) 
  }).catch((error)=>{
    console.error('Error al obtener metodo de pago', error)
  })
}


//CREAR METODO DE PAGO
const crearMetodoPago = () => {
  if(!nombre_metodopago) {
    alert('Debe completar los campos').
    return
  }
  axios.post(`${URL}metodopago/post`,
    {
      nombre_metodopago : nombre_metodopago
    }).then(()=> {
      alert('Metodo de pago creado exitosamente')
      limpiarCampos()
      verMetodos()
    }).catch((error)=> {
      console.error('Error al obtener los metodos de pago',error)
    })
}

//EDITAR METODO DE PAGO
const editarMetodoPago = () => {
  axios.put(`${URL}metodopago/put/${Id_metodoPago}`,
    {
      Id_metodoPago : Id_metodoPago,
      nombre_metodopago: nombre_metodopago
    }
  ).then(()=> {
    alert('Metodo de pago actualizado')
    limpiarCampos()
    verMetodos()
  }).catch((error)=> {
    console.error('Error al editar el metodo de pago', error)
  })
}

//ELIMINAR METODOS
const eliminarMetodoPago = (val) => {
  axios.put(`${URL}metodopago/delete/${val.Id_metodoPago}`).then(()=> {
      alert('Metodo de pago eliminado')
      verMetodos()
    })
}

//MANEJADOR DE METODO DE PAGO
const handleMetodoPago = (val) => {
setBotonEditar(true)
setIdMetodoPago(val.Id_metodoPago)
setNombreMetodoPago(val.nombre_metodopago)
}

//LIMPIAR CAMPOS
const limpiarCampos = () => {
  setNombreMetodoPago('')
  setBotonEditar(false)
}

useEffect(()=>{
  verMetodos()
},[])



  return (
    <>
    <App/>
<div className='h3-subtitulos'>
          <h3>METODOS DE PAGO</h3>
</div>
    <h2 className='text-center'>METODO DE PAGO</h2>
    <h4 className='text-center'>Administra metodos de pago de tu negocio</h4>
    <br />




 <div className="container table">
    <div className="row">
    <div className="col">
     <MDBInputGroup className='mb-3'>
        <span className='input-group-text'>
            <FontAwesomeIcon icon={faWallet} size="lg" style={{color: "#ff5e5e"}}/>
        </span>
        <input className='form-control' type="text" placeholder='Ingrese nombre...' value={nombre_metodopago} onChange={(e) => setNombreMetodoPago(e.target.value.toUpperCase())}/>
     </MDBInputGroup>
     <br /><br />

    <div className='col-12 d-flex justify-content-center'>
            {botoneditar ? (
                <>
                   <Button className="me-2" variant='warning' onClick={editarMetodoPago}>EDITAR</Button>
                   <Button variant='danger' onClick={limpiarCampos}>CANCELAR</Button>
                </>
            ) : (
                <>
                <Button variant='success' onClick={crearMetodoPago}>GUARDAR</Button>
                </>
            )}  
        </div>
    <table className="custom-table">
      <thead>
      <tr>
          <th>FOLIO</th>
          <th>NOMBRE</th>
          <th>ACCIONES</th>
     </tr>
      </thead>
      <tbody>
        {verMetodoPago.map((val) =>(
          <tr key={val.Id_metodoPago}>
            <td>{val.Id_metodoPago}</td>
            <td>{val.nombre_metodopago}</td>
            <td>
              <ButtonGroup>
                <Button className="me-2" onClick={() => handleMetodoPago((val))}><FontAwesomeIcon icon={faPenToSquare}></FontAwesomeIcon></Button>
                <Button variant='danger' onClick={() => eliminarMetodoPago((val))}><FontAwesomeIcon icon={faTrashAlt}></FontAwesomeIcon></Button>
              </ButtonGroup>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
   </div>
  </div>
 </div>


    </>
  )
}

export default MetodoPago