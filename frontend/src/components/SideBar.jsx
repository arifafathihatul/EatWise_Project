import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Camera, LayoutGrid, User, LogOut, X } from 'lucide-react';
import logo from '../assets/logo.png';

export default function SidebarNew({ isSidebarOpen, setIsSidebarOpen, stream }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setIsSidebarOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setIsSidebarOpen(false);

    localStorage.removeItem('token');
    localStorage.removeItem('user'); 
    localStorage.clear();
    sessionStorage.clear();

    // 🎯 PERBAIKAN LOGOUT: Pindahkan langsung ke halaman awal/Landing Page ('/') dengan rute bersih
    navigate('/', { replace: true });
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <aside className={`
        fixed top-0 left-0 w-72 bg-[#E3EDE6] border-r border-[#D3DFD7] p-6 flex flex-col justify-between z-40 transition-transform duration-300 shrink-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        pt-24 md:pt-10 md:fixed
        h-[100dvh] pb-12
      `}>
        {/* 🎯 DI ATAS: Mengubah h-screen menjadi h-[100dvh] (Dynamic Viewport) + pb-12 agar tombol Logout terdorong naik di iPhone */}
        
        <div> 
          <div className="-mt-4 mb-6 flex justify-center md:justify-start">
            <img 
              src={logo} 
              alt="EatWise" 
              className="h-20 object-contain w-auto hidden md:block opacity-90 transition-all duration-300 hover:scale-102" 
            />
          </div>
          
          <nav className="space-y-2">
            {[
              { path: '/dashboard', label: 'Home', icon: Home },
              { path: '/scan', label: 'Scan Makanan', icon: Camera },
              { path: '/tracker', label: 'Daily Tracker', icon: LayoutGrid },
              { path: '/profile', label: 'Profile', icon: User },
            ].map((menu) => {
              const IconComponent = menu.icon;
              const active = isActive(menu.path);
              
              return (
                <button 
                  key={menu.path}
                  onClick={() => handleNavigation(menu.path)} 
                  className={`
                    w-full flex items-center gap-3.5 px-5 py-3 rounded-2xl text-xs font-black text-left 
                    relative overflow-hidden transition-all duration-300 group active:scale-98 cursor-pointer
                    ${active 
                      ? 'bg-[#2A6B3F] text-white shadow-md shadow-green-900/10 border border-[#215331]' 
                      : 'text-[#4A6B56] hover:text-[#2A6B3F] hover:bg-[#D6E3D9]'
                    }
                  `}
                >
                  <IconComponent className={`w-4.5 h-4.5 transition-transform duration-300 group-hover:scale-105 ${active ? 'text-white' : 'text-[#6B8E76] group-hover:text-[#2A6B3F]'}`} /> 
                  <span className="transition-transform duration-300 group-hover:translate-x-0.5">{menu.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <button 
          onClick={handleLogout} 
          className="w-full flex items-center gap-4 px-5 py-3.5 font-black text-[#8A6A6A] hover:text-rose-700 hover:bg-rose-100/60 rounded-2xl transition-all duration-200 active:scale-98 text-left text-xs cursor-pointer group mb-2"
        >
          <LogOut className="w-4.5 h-4.5 text-[#A68B8B] transition-transform group-hover:translate-x-0.5 group-hover:text-rose-600" /> 
          <span>Keluar</span>
        </button>
      </aside>

      {isSidebarOpen && (
        <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/10 z-30 md:hidden backdrop-blur-xs" />
      )}
    </>
  );
}