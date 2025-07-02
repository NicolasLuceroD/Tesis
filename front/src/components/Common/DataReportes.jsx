import { TailSpin } from 'react-loader-spinner';

const DataReportes = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
    <h5 style={{ color: 'red' }}>No se encontraron datos</h5>
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      height: '500px', 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center' 
    }}>
      <TailSpin height="50" width="50" color="red" />
    </div>
  </div>
  )
}

export default DataReportes