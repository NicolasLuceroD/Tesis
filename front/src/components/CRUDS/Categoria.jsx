import { useState, useContext, useEffect } from 'react';
import App from '../../App'
import {MDBInputGroup} from 'mdb-react-ui-kit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard, faPenToSquare, faTrashAlt} from '@fortawesome/free-regular-svg-icons';
import { Button, ButtonGroup } from "react-bootstrap"
import { DataContext } from "../../context/DataContext";
import axios from 'axios'


const Categoria = () => {

//URL
const { URL } = useContext(DataContext);

//ESTADOS
const [verCategorias, setVerCategorias] = useState([])
const [Id_categoria, setIdCategoria] = useState("")
const [nombre_categoria, setNombreCategoria] = useState("")
const [botoneditar, setBotonEditar] = useState(false)

//OBTENER CATEGORIAS
const seeCategorias = () => {
    axios.get(`${URL}categoria/verCategoria`).then((response)=> {
        console.log('Categorias: ', response.data)
        setVerCategorias(response.data)
    })
}


//CREAR CATEGORIAS
const crearCategoria = () => {
    if(!nombre_categoria){
        alert('Debe completar los campos')
        return
    }
    axios.post(`${URL}categoria/post`,
    {
        nombre_categoria : nombre_categoria
    }).then(()=> {
        alert("Categoria creada con exito")
        seeCategorias()
        limpiarCampos()
    }).catch((error)=>{
        console.error("Error al crear categoria",error)
    })
}

//EDITAR CATEGORIAS
const editarCategoria = () => {
    axios.put(`${URL}categoria/put/${Id_categoria}`,
    {
        Id_categoria : Id_categoria,
        nombre_categoria : nombre_categoria
    }).then(()=> {
        alert("Categoria actualizada con exito")
        seeCategorias()
        limpiarCampos()
    }).catch((error)=> {
        console.error(error)
    })
}

//ELIMINAR CATEGORIAS
const eliminarCategoria = (val) => {
    axios.put(`${URL}categoria/delete/${val.Id_categoria}`).then(()=> {
        alert("Categoria eliminada con exito")
        seeCategorias()
    }).catch((error) => {
        console.error(error)
    })
}

//MANEJADOR DE EDICION
const handleCategoria = (val) => {
    setBotonEditar(true)
    setIdCategoria(val.Id_categoria)
    setNombreCategoria(val.nombre_categoria)
}


//LIMPIAR CAMPOS INPUT
const limpiarCampos = () => {
    setBotonEditar(false)
    setIdCategoria("")
    setNombreCategoria("")
}

//MONTAR MIS FUNCIONES
useEffect(()=>{
    seeCategorias()
},[])




  return (
    <>
    <App/>
<div className='h3-subtitulos'>
          <h3>CATEGORIAS</h3>
</div>

<div className='container-fluid'>
    <div className='container'><br />
        <h2 className='text-center'>ADMINISTRACION DE CATEGORIAS</h2>
        <h4 className='text-center'>Gestiona todos los departamentos de tu negocio</h4>
        <MDBInputGroup className='mb-3'>
        <span className='input-group-text'>
            <FontAwesomeIcon icon={faClipboard} size="lg" style={{color: "#ff5e5e"}}/>
        </span>
        <input className='form-control' type="text" placeholder='Ingrese nombre de categoria' value={nombre_categoria} onChange={(e) => setNombreCategoria(e.target.value)} />
        </MDBInputGroup><br />
        <div className='col-12 d-flex justify-content-center'>
            {botoneditar ? (
                <>
                <Button className="me-2" variant='warning' onClick={editarCategoria}>EDITAR</Button>
                <Button variant="danger" onClick={limpiarCampos}>CANCELAR</Button>
                </>
            ) : (
                <Button className="me-2" variant="success" onClick={crearCategoria}>GUARDAR</Button>
            )}
        </div>

   
</div>

<br /><br /><br />
    {/* TABLA */}
    <div className="container table">
          <div className="row">
            <div className="col">
            <table className="custom-table">
        <thead>
            <tr>
            <th>FOLIO</th>
            <th>NOMBRE</th>
            <th>ACCIONES</th>
            </tr>
        </thead>
        <tbody>
            {verCategorias.map((val)=>(
                <tr key={val.Id_categoria}>
                    <td>{val.Id_categoria}</td>
                    <td>{val.nombre_categoria}</td>
                    <td>
                        <ButtonGroup>
                            <Button className="me-2" variant='primary' onClick={()=> {handleCategoria(val)}}><FontAwesomeIcon icon={faPenToSquare}></FontAwesomeIcon></Button>
                            <Button variant='danger' onClick={() => {eliminarCategoria(val)}}><FontAwesomeIcon icon={faTrashAlt}></FontAwesomeIcon></Button>
                        </ButtonGroup>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
    </div>
          </div>
        </div>
</div>
    </>
  )
}

export default Categoria