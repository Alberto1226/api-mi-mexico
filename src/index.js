import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
//paginas
import {Error} from './pages/error/error404';
import {Home} from './pages/home/home';
import {Login} from './pages/login/login';
import {Registro} from './pages/registro/registro';
import {RegistroPasodos} from './pages/registro/registroPasodos';

const router = createBrowserRouter([
  {
      path: '/',
      element: <Home/>,
      errorElement: <Error/>,
  },
  {
      path: '/login',
      element: <Login/>,
      errorElement: <Error/>,
  },
  {
      path: '/registro',
      element: <Registro/>,
      errorElement: <Error/>,
  },
  {
    path: '/registroPasodos',
    element: <RegistroPasodos/>,
    errorElement: <Error/>,
},
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
