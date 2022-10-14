import { useState, useEffect } from 'react'
import { SocketContext, socket } from './contexts/SocketContext'

import SongStatus from './components/SongStatus'
import Sidebar from './components/Sidebar'
import Notifications from './components/Notifications'
import Content from './components/Content'

function App() {

   const [artist, setArtist] = useState("");
   const [songID, setSongID] = useState("");
   const [title, setTitle] = useState("");

   useEffect(() => {
      socket.on('song', (data) => {
         setArtist(data.artist)
         setSongID(data.id)
         setTitle(data.title)
      })

      
   }, [])

   return (
      <SocketContext.Provider value={socket}>
         <div>
            <Notifications />
            <Sidebar song={songID}/>
            <Content />
            {songID && <SongStatus artist={artist} title={title} songID={songID} />}
         </div>
      </SocketContext.Provider>
   )
}

export default App
