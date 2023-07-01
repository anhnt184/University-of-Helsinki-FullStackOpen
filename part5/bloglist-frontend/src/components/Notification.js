import PropTypes from 'prop-types'

function Notification({ message, type }) {
  const notificationStyle = {
    background: 'lightgray',
    padding: '10px',
    marginBottom: '10px',
    fontSize: '1.5rem',
    color: type === 'success' ? 'green' : 'red',
    border: type === 'success' ? '2px solid green' : '2px solid red',
  }

  return (
    <div className="notification" style={notificationStyle}>
      {message}
    </div>
  )
}

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
}


export default Notification
