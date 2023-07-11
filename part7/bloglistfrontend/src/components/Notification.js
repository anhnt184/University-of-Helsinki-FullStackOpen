import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector((state) => state.notification)

  if (!notification) {
    return null
  }

  const notificationStyle = {
    background: 'lightgray',
    padding: '10px',
    marginBottom: '10px',
    fontSize: '1.5rem',
    color: notification.type === 'success' ? 'green' : 'red',
    border: notification.type === 'success' ? '2px solid green' : '2px solid red',
  }

  return (
    <div className="notification" style={notificationStyle}>
      {notification.message}
    </div>
  )
}

export default Notification
