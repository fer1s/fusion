import React from 'react'
import { motion } from 'framer-motion'
import { SocketContext } from '../../contexts/SocketContext';
import './style.css'

const Notifications = () => {

    const socket = React.useContext(SocketContext)
    const [notifications, setNotifications] = React.useState([]);

    const push = (object) => {
        setNotifications([...notifications, object])
    }

    React.useEffect(() => {
        socket.on("notification", (data) => {
            push(data)
            setTimeout(() => {
                setNotifications([])
            }, 3000)
        })
    }, [socket])

    return (
        <div className='notifications_parent'>
            {notifications.map((notification, index) => (
                <Notification key={index} title={notification.title} description={notification.description} accent={notification.accent} />
            ))}
        </div>
    )
}

export default Notifications



const Notification = ({ title, description, accent }) => {
    return (
        <motion.div className='notification'
            initial={{ opacity: 0, scale: 0.5, y: '-100%' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            <div className="accent" style={{ backgroundColor: accent }}></div>
            <div className="content">
                <h1>{title}</h1>
                <p>{description}</p>
            </div>
        </motion.div>
    )
}
