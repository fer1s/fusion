import './style.css'
import React from 'react'
import { SocketContext } from '../../contexts/SocketContext';

const Sidebar = ({song}) => {

  const socket = React.useContext(SocketContext)
  const [devices, setDevices] = React.useState(null);
  const [percentage, setPercentage] = React.useState(0);
  const [youtubeURL, setYoutubeURL] = React.useState("");
  const [devicename, setDevicename] = React.useState("");

  React.useEffect(() => {
    socket.emit('device_connected', `Web client ${Math.floor(Math.random() * (999 - 100 + 1) + 100)}`)
    socket.on('devices_data', (data) => {
      setDevices(data)
    })

    socket.on('download_progress', (percentage) => {
      setPercentage(percentage)
      
      if(percentage === 100) socket.emit('fetch_songs')
    })
  }, [socket])

  const downloadLink = () => {
    socket.emit('download_youtube', youtubeURL)
    setYoutubeURL('');
  }

  const changeName = () => {
    socket.emit('set_devicename', devicename)
    setDevicename('');
  }

  return (
    <div className={`sidebar ${song && 'mini'}`}>
      <div>
        <h1>Fusion</h1>
        <p>created by fer1s</p>
      </div>
      {devices && (
        <div className='devices'>
          <h1>Devices</h1>
          <input type="text" placeholder='Name...' value={devicename} onChange={(e) => {setDevicename(e.target.value)}} />
          <button onClick={changeName}>Change</button>
          {devices.map((device, index) => {
            return <p key={index} id={device}><i className='bx bx-devices'></i> {device}</p>
          })}
        </div>
      )}
      <div>
        <h1>Add song</h1>
        <input type="text" placeholder='YouTube URL...' value={youtubeURL} onChange={(e) => {setYoutubeURL(e.target.value)}} />
        <button onClick={downloadLink}>Add</button>
        {(percentage > 0 && percentage < 100) && <input type="range" min={0} max={100} value={percentage}  />} 
      </div>
    </div>
  )
}

export default Sidebar