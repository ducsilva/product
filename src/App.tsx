import HomePage from "pages/Home";
import { Detail } from "pages/index";
import { Route, Routes } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/product/:productId" element={<Detail />} />
    </Routes>
  );
}

export default App;
