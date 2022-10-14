import io from 'socket.io-client'
import React from 'react'

export const socket = io(`http://${window.location.hostname}:3001`)
export const SocketContext = React.createContext();