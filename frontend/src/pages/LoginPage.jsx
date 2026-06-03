import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, X, Eye, EyeOff } from 'lucide-react'; 
import authService from '../services/authService'; 

export default function LoginPage() {
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setShowAlert(false);
    setErrorMessage("");
    setLoading(true);
    
    const emailInput = e.target.elements.loginEmail.value.trim().toLowerCase();
    const passwordInput = e.target.elements.loginPassword.value;

    try {
      const data = await authService.login(emailInput, passwordInput);

      if (data && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('registeredUsername', data.user?.username || "User EatWise");
        localStorage.setItem('user_profile_data', JSON.stringify(data.user));
        
        window.dispatchEvent(new Event('storage_profile_updated'));
        
        navigate('/dashboard', { replace: true });
      } else {
        throw new Error("Gagal menghubungkan!");
      }
    } catch (error) {
      let serverMessage = "";

      if (error && typeof error === 'object') {
        serverMessage = error.message || error.error || "";
        
        if (error.response?.data) {
          serverMessage = error.response.data.message || error.response.data;
        }
      }

      if (!serverMessage && (error.message === "Network Error" || !error.response)) {
        setErrorMessage("Gagal terhubung ke server");
      } else {
        const lowerMessage = String(serverMessage).toLowerCase();

        if (lowerMessage.includes("password") || lowerMessage.includes("salah") || lowerMessage.includes("unauthorized")) {
          setErrorMessage("Email atau password yang Anda masukkan salah!");
        } else if (lowerMessage.includes("belum terdaftar") || lowerMessage.includes("tidak ditemukan")) {
          setErrorMessage("Email belum terdaftar");
        } else {
          setErrorMessage(serverMessage || "Email atau password yang Anda masukkan salah!");
        }
      }

      setShowAlert(true);
    } finally {
      loading && setLoading(false);
    }
  };

  return (
    <div className="font-sans min-h-screen flex items-center justify-center relative bg-white py-6">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80" style={{ backgroundImage: "url('https://i.pinimg.com/1200x/f6/bc/1c/f6bc1cecaf10f22798072e08fbbf7dcb.jpg')" }} />
      
      <div className="relative z-10 w-full max-w-md mx-4 animate-fadeIn">
        <div className="bg-white rounded-[20px] border border-slate-200 shadow-2xl p-6 sm:p-8 flex flex-col items-stretch justify-center w-full">
          
          <div className="text-center w-full">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
            <p className="text-slate-400 text-[11px] font-medium mt-0.5 mb-5">Masuk ke akun Eatwise kamu</p>
          </div>

          {showAlert && (
            <div className="w-full bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-4 flex items-center gap-2.5 relative text-left shadow-inner">
              <AlertTriangle className="w-4 h-4 text-[#2A6B3F] shrink-0" />
              <div className="flex-grow">
                <p className="text-[11px] text-[#2A6B3F] leading-relaxed font-bold">
                  {errorMessage}
                </p>
              </div>
              <button type="button" onClick={() => setShowAlert(false)} className="text-emerald-600 hover:text-emerald-800 transition p-1 cursor-pointer"><X className="w-3.5 h-3.5" /></button>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="w-full space-y-4">
            <div className="w-full text-left text-xs font-bold text-slate-600">
              <label className="block mb-1 ml-1 tracking-wide">Email</label>
              <input id="loginEmail" name="loginEmail" type="email" required placeholder="Masukkan email" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none transition text-slate-800 text-base bg-slate-50/50" />
            </div>
            
            <div className="w-full text-left text-xs font-bold text-slate-600">
              <label className="block mb-1 ml-1 tracking-wide">Password</label>
              <div className="relative w-full">
                <input 
                  id="loginPassword" 
                  name="loginPassword" 
                  type={showPassword ? "text" : "password"} 
                  required 
                  placeholder="Masukkan password" 
                  className="w-full pl-3.5 pr-11 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none transition text-slate-800 text-base bg-slate-50/50" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <div className="text-center pt-2 w-full">
              <button type="submit" disabled={loading} className="w-full bg-[#2A6B3F] hover:bg-[#1E5128] disabled:bg-slate-400 active:scale-98 text-white text-xs font-bold py-2.5 rounded-xl transition shadow-md shadow-green-900/10 cursor-pointer block">
                {loading ? "Memproses..." : "Login"}
              </button>
            </div>
          </form>

          <div className="mt-6 flex flex-col items-center gap-1.5 text-xs text-center w-full justify-center">
            <p className="text-slate-500 text-[11px]">Belum punya akun? <Link to="/register" className="text-green-700 font-black hover:underline">Daftar</Link></p>
            <Link to="/" className="text-slate-400 hover:text-slate-500 transition text-[10px] font-bold mt-1">Kembali ke Home</Link>
          </div> 

        </div>
      </div>
    </div>
  );
}

