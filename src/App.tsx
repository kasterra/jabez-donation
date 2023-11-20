import React from "react";
import { Route, Routes as ReactRoutes, BrowserRouter } from "react-router-dom";
import { NextUIProvider } from "@nextui-org/react";
import Main from "./pages/Main";

function App() {
  return (
    <NextUIProvider>
      <BrowserRouter>
        <ReactRoutes>
          <Route path="/" element={<Main />} />
        </ReactRoutes>
      </BrowserRouter>
    </NextUIProvider>
  );
}

export default App;
