import ReactDOM from 'react-dom';
import App from './App';
import { CounterContextProvider } from './CounterContext';

ReactDOM.render(
  <CounterContextProvider>
    <App />
  </CounterContextProvider>,
  document.getElementById('root')
)