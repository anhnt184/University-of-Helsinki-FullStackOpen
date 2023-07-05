import { createContext, useReducer, useContext, useEffect  } from 'react';
const notificationReducer = (state, action) => {
    switch (action.type) {
      case 'SHOW_NOTIFICATION':
        return action.payload;
      case 'HIDE_NOTIFICATION':
        return null;
      default:
        return state;
    }
  }

const NotificationContext = createContext();

export const useNotificationState = () => {
    const state = useContext(NotificationContext);
    if (!state) {
      throw new Error('useNotificationState must be used within a NotificationContextProvider');
    }
    return state;
  };
  

export const useNotificationDispatch = () => {
    const { notification, showNotification } = useContext(NotificationContext);
    if (!showNotification) {
      throw new Error('useNotificationDispatch must be used within a NotificationContextProvider');
    }
    return { notification, showNotification };
  }

  export const NotificationContextProvider = ({ children }) => {
    const [notification, dispatch] = useReducer(notificationReducer, null);
  
    useEffect(() => {
      if (notification) {
        const timer = setTimeout(() => {
          dispatch({ type: 'HIDE_NOTIFICATION' });
        }, 5000);
        return () => {
          clearTimeout(timer);
        };
      }
    }, [notification]);
  
    const showNotification = (message) => {
      dispatch({ type: 'SHOW_NOTIFICATION', payload: message });
    }
    return (
        <NotificationContext.Provider value={{ notification, showNotification }}>
          {children}
        </NotificationContext.Provider>
      );
    }


export default NotificationContext;
