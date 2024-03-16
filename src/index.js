import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import ChatComponent from './components/ChatComponent';

// import reportWebVitals from './reportWebVitals';

const rootElm = document.getElementById('root');
const root = ReactDOM.createRoot(rootElm);

const Main = () => {
  return (
    <StrictMode>
      <ChatComponent />
    </StrictMode>
  );
}

root.render(<Main/>);


