import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import Profil from "./pages/Profil";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ini adalah "Nested Route". 
          Semua rute di dalamnya akan menggunakan komponen 'Layout' 
          (yang memiliki Navbar dan Footer) 
        */}
        <Route path="/" element={<Layout />}>
          {/* 'index' berarti ini halaman default (path: "/") */}
          <Route index element={<Home />} />

          {/* Ini halaman profil (path: "/profil") */}
          <Route path="profil" element={<Profil />} />

          {/* Di sini kita akan menambahkan rute lain nanti:
            <Route path="berita" element={<Berita />} />
            <Route path="dosen" element={<Dosen />} />
          */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
