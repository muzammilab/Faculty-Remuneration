import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

import { Provider } from "react-redux";
import remunerationStore from "./store/index.js";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StrictMode>
      <Provider store={remunerationStore}>
        <App />
      </Provider>
    </StrictMode>
  </BrowserRouter>
);
