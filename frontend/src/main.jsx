import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { store } from "./store/store.js";
import { Provider } from 'react-redux';
import "./index.css"
import { Toaster } from "react-hot-toast";
import { RouterProvider } from 'react-router-dom';
import { router } from "./router/router.jsx"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <Toaster />
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
