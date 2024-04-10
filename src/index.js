import React from "react";
import ReactDOM from "react-dom/client";
import './index.css'
import App from "./App";
import { Provider } from "react-redux";
import  store  from "./store";
import { ToastContainer } from 'react-toastify';


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
    <Provider store={store}>
      <App />
      <ToastContainer
    position="top-right"
    autoClose={1500}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    draggable
    pauseOnHover
    theme="light"
    />
    </Provider>
    
  // </React.StrictMode>
);
