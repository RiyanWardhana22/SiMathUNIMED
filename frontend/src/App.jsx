import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import Profil from "./pages/Profil";
import ProdiDetail from "./pages/ProdiDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="profil" element={<Profil />} />

          {/* TAMBAHKAN RUTE DINAMIS INI:
            ':id' adalah parameter dinamis yang akan ditangkap oleh useParams()
          */}
          <Route path="prodi/:id" element={<ProdiDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
