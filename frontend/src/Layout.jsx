import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

function Layout() {
  return (
    <div className="app-layout">
      <Navbar />

      <main className="app-content">
        {/* <Outlet /> adalah 'placeholder' 
            React Router akan otomatis mengisi 
            halaman (Home, Profil) di sini 
        */}
        <Outlet />
      </main>

      {/* <Footer /> */}
    </div>
  );
}

export default Layout;
