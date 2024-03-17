import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { createGlobalStyle } from 'styled-components';
import ChatComponent from './components/ChatComponent';

// import reportWebVitals from './reportWebVitals';

const rootElm = document.getElementById('root');
const root = ReactDOM.createRoot(rootElm);

const GlobalStyle = createGlobalStyle`
   body {
    background-color: rgba(10, 80, 150, 0.1);
   }
`;

const Main = () => {
  return (
    <StrictMode>
      <GlobalStyle />
        <ChatComponent />
    </StrictMode>
  );
}

root.render(<Main/>);


