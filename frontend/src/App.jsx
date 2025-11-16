import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./Layout";
import Home from "./pages/Home";
import Profil from "./pages/Profil";
import ProdiDetail from "./pages/ProdiDetail";
import Dosen from "./pages/Dosen";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="profil" element={<Profil />} />
          <Route path="prodi/:id" element={<ProdiDetail />} />
          <Route path="dosen" element={<Dosen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
