import React from 'react'
import moment from 'moment'
import { SocketContext } from '../../contexts/SocketContext';
import './style.css';

const Content = () => {

    const socket = React.useContext(SocketContext)
    const [songs, setSongs] = React.useState([]);

    React.useEffect(() => {
        socket.emit('fetch_songs', null);
        socket.on('songs_list', (songs_list) => {
            setSongs(songs_list)
            console.log(songs_list)
        })
    }, [socket])

    return (
        <div className='main-content'>
            <h1>Songs</h1>
            <div className="card">
                {songs.map((song, index) => {
                    return (
                        <div key={index} className="song">
                            <div>
                                <h1>{song.artist}</h1>
                                <p>{song.title}</p>
                            </div>
                            <div>
                                <span>{moment(song.createdDate).format("DD.MM.YYYY")}</span>
                                <button onClick={() => {socket.emit('play_song', song._id)}}>Play</button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Content