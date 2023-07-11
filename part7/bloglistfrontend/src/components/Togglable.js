import { useState, useImperativeHandle, forwardRef } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }


  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility,
    }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
        <Button onClick={toggleVisibility} variant="primary" type="submit">
          {props.buttonLabel}
        </Button>
        {/* <button onClick={toggleVisibility}>{props.buttonLabel}</button> */}
      </div>
      <div style={showWhenVisible}>
        {props.children}
        {/* <button onClick={toggleVisibility}>cancel</button> */}
        <Button onClick={toggleVisibility} variant="primary" type="submit">
        cancel
        </Button>
        <br />
      </div>
    </div>
  )
})

Togglable.displayName = 'Togglable'

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}


export default Togglable
