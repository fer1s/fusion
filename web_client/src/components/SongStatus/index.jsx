import React from 'react'
import { SocketContext } from '../../contexts/SocketContext';
import './style.css';

const formatTime = (duration) => {
    // Hours, minutes and seconds
    var hrs = ~~(duration / 3600);
    var mins = ~~((duration % 3600) / 60);
    var secs = ~~duration % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}

const SongStatus = ({ artist, title, songID }) => {

    const socket = React.useContext(SocketContext)

    const [volume, setVolume] = React.useState(0);
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [duration, setDuration] = React.useState(0);
    const [currentTime, setCurrentTime] = React.useState(0);

    const audioRef = React.useRef();

    const updateSong = () => {
        audioRef.current.pause();
        audioRef.current.load();
        audioRef.current.play();
    }

    React.useEffect(() => {
        const savedVolume = window.localStorage.getItem('volume')
        if (savedVolume !== null) setVolume(savedVolume)
    }, [])
    React.useEffect(() => {
        window.localStorage.setItem('volume', volume)
        audioRef.current.volume = volume / 100
    }, [volume])
    React.useEffect(() => {
        if (isPlaying) {
            audioRef.current.play()
        } else {
            audioRef.current.pause()
        }
    }, [isPlaying])
    React.useEffect(() => {
        audioRef.current.ontimeupdate = () => {
            setCurrentTime(audioRef.current.currentTime)
            setDuration(audioRef.current.duration)
        }
    }, [])
    React.useEffect(() => {
        if(currentTime === duration) setIsPlaying(false);
    }, [currentTime, duration])
    React.useEffect(() => {
        socket.on('song', () => {
            updateSong()
         })
    }, [socket])

    const next = () => {
        socket.emit('next_song', songID)
    }
    const previous = () => {
        socket.emit('previous_song', songID)
    }

    return (
        <div className='song_status'>
            <audio ref={audioRef} controls>
                <source src={`http://${window.location.hostname}:3001/api/stream/song/${songID}`} />
            </audio>
            <div className="song">
                <h1>{artist}</h1>
                <p>{title}</p>
            </div>
            <div className="controls">
                <div className="buttons">
                    <button onClick={previous}><i className='bx bx-skip-previous' ></i></button>
                    <button className='play' onClick={() => { setIsPlaying(!isPlaying) }}>{isPlaying ? <i className='bx bx-pause'></i> : <i className='bx bx-play padding-left'></i>}</button>
                    <button onClick={next}><i className='bx bx-skip-next' ></i></button>
                </div>
                <div className="slider">
                    <span className="current_time">{formatTime(currentTime)}</span>
                    <input type="range" className="seek_bar" step={0.01} min={0} max={duration} value={currentTime} onChange={e => audioRef.current.currentTime = e.target.value} />
                    <span className="song_duration">{formatTime(duration)}</span>
                </div>
            </div>
            <div className="volume">
                <p>Volume <span>{volume}%</span></p>
                <input type="range" min={0} max={100} value={volume} onChange={e => setVolume(e.target.value)} />
            </div>
        </div>
    )
}

export default SongStatus