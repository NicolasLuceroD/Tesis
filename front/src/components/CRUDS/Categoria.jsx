import { useState, useContext, useEffect } from 'react';
import App from '../../App'
import {MDBInputGroup} from 'mdb-react-ui-kit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard, faPenToSquare, faTrashAlt} from '@fortawesome/free-regular-svg-icons';
import { Button, ButtonGroup } from "react-bootstrap"
import { DataContext } from "../../context/DataContext";
import axios from 'axios'
import Paginacion from '../Common/Paginacion';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';


const Categoria = () => {

//URL
const { URL } = useContext(DataContext);

//ESTADOS
const [verCategorias, setVerCategorias] = useState([])
const [Id_categoria, setIdCategoria] = useState("")
const [nombre_categoria, setNombreCategoria] = useState("")
const [botoneditar, setBotonEditar] = useState(false)

//FILTRO DE BUSQUEDA
const [buscarcategoria, setBuscarCategoria] = useState("")
const [ver, setVer] = useState([]);

//OBTENER CATEGORIAS
const seeCategorias = () => {
    axios.get(`${URL}categoria/verCategoria`).then((response)=> {
        console.log('Categorias: ', response.data)
        setVerCategorias(response.data)
        setTotal(response.data.length)
        setVer(response.data)
    })
}


//CREAR CATEGORIAS
const crearCategoria = () => {
    if(!nombre_categoria){
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
    axios.post(`${URL}categoria/post`,
    {
        nombre_categoria : nombre_categoria
    }).then(()=> {
        Swal.fire({
         icon: 'success',
         title: 'Exito!',
         html: `La categoria <strong>${nombre_categoria}</strong> fue creada con exito!.`,
         showConfirmButton: true,
         timer: 2000,
         timerProgressBar: true
        })
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
        Swal.fire({
            icon: 'success',
            title: 'Exito!',
            html: `La categoria <strong>${nombre_categoria}</strong> fue editada con exito!.`,
            showConfirmButton: true,
            timer: 2000,
            timerProgressBar: true
        })
        seeCategorias()
        limpiarCampos()
    }).catch((error)=> {
        console.error(error)
    })
}

//ELIMINAR CATEGORIAS
const eliminarCategoria = (val) => {
  Swal.fire({
    title: '¿Estás seguro?',
    html: `¿Deseas eliminar la categoría "<strong>${val.nombre_categoria}</strong>"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      axios.put(`${URL}categoria/delete/${val.Id_categoria}`)
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: '¡Categoría eliminada!',
            html: `La categoría <strong>${val.nombre_categoria}</strong> fue eliminada correctamente.`,
            timer: 2500,
            timerProgressBar: true,
            showConfirmButton: true
          });
          seeCategorias();
        })
        .catch((error) => {
          console.error('Error al eliminar la categoría:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar la categoría.',
          });
        });
    }
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


//PAGINACION
const categoriasporpagina = 5
const [actualPagina, setActualPagina] = useState(1)
const [total, setTotal] = useState(0)
const ultimoIndex = actualPagina * categoriasporpagina;
const primerIndex = ultimoIndex - categoriasporpagina;

//FILTRO POR NOMBRE USUARIO
  const buscador = (e) => {
    setBuscarCategoria(e.target.value);
  };

// Filtrar productos
  const categoriasFiltradas = verCategorias.filter((dato) =>
    dato.nombre_categoria.toLowerCase().includes(buscarcategoria.toLowerCase())
  );


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
        <br /><br />
           <MDBInputGroup className='mb-3'>
                                    <span className='input-group-text'>
                                        <FontAwesomeIcon icon={faSearch} size="lg" style={{color: "#ff5e5e"}}/>
                                    </span>
            <input type="text" placeholder='Busca una categoria...' value={buscarcategoria} onChange={buscador} className='form-control' />
             </MDBInputGroup> 
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
            {categoriasFiltradas.slice(primerIndex,ultimoIndex).map((val)=>(
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
     <div style={{display:'flex',justifyContent:'center', marginTop: '10px'}}>
                    <Paginacion productosPorPagina={categoriasporpagina}
                        actualPagina={actualPagina}
                        setActualPagina={setActualPagina}
                        total={total}
                    />
    </div>
    </div>
          </div>
        </div>
</div>
    </>
  )
}

export default Categoria