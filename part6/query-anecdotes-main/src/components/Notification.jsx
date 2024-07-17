import { useEffect } from 'react'
import { useNotificationValue, useNotificationDispatch } from '../NotificationContext'

const Notification = () => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }
  const delay = 5000
  const dispatch = useNotificationDispatch()
  const notification = useNotificationValue()

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => { dispatch({ type: 'CLEAR' }) }, delay)
      return () => clearTimeout(timer)
    }
  }, [notification, dispatch])

  if (!notification)
    return <></>
  return (
    <div style={style}>
      {notification}
    </div>
  )

}

export default Notification
