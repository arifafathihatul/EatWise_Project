import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, X, Eye, EyeOff } from 'lucide-react'; 
import authService from '../services/authService'; 

export default function RegisterPage() {
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); 
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState(""); 
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Password dan Konfirmasi Password tidak cocok!");
      return;
    }

    try {
      const data = await authService.register({
        username,
        email: email.trim().toLowerCase(),
        password,
        weight,
        height,
        dateOfBirth: tanggalLahir, 
        gender: jenisKelamin       
      });

      if (data) {
        setShowSuccessAlert(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (error) {
      
      const serverErrorMsg = 
        error.response?.data?.message || 
        error.data?.message || 
        error.response?.message || 
        error.message || 
        "Pendaftaran gagal, periksa koneksi";
        
      setErrorMessage(serverErrorMsg);
    }
  };

  return (
    <div className="font-sans min-h-screen flex items-center justify-center relative bg-white py-6">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80" style={{ backgroundImage: "url('https://i.pinimg.com/1200x/f6/bc/1c/f6bc1cecaf10f22798072e08fbbf7dcb.jpg')" }} />

      <div className="relative z-10 w-full max-w-md mx-4 animate-fadeIn">
        <div className="bg-white rounded-[20px] border border-slate-200 shadow-2xl p-6 md:p-7 flex flex-col items-center">
          
          <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-5 text-center tracking-tight">Buat Akun EatWise</h2>

          {showSuccessAlert && (
            <div className="w-full bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-4 flex items-start gap-2.5 relative text-left">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="flex-grow">
                <h4 className="text-xs font-bold text-emerald-800">Pendaftaran Berhasil!</h4>
                <p className="text-[10px] text-emerald-700 mt-0.5 leading-relaxed">Akun EatWise Anda telah berhasil dibuat. Dialihkan ke halaman Login dalam 3 detik...</p>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="w-full bg-rose-50 border border-rose-200 rounded-xl p-3 mb-4 flex items-center justify-between text-left">
              <p className="text-[10px] font-bold text-rose-800">{errorMessage}</p>
              <button type="button" onClick={() => setErrorMessage("")} className="text-rose-500 hover:text-rose-700"><X className="w-3.5 h-3.5" /></button>
            </div>
          )}

          <form onSubmit={handleRegisterSubmit} className="w-full space-y-3.5">
            <div className="w-full text-left text-xs font-bold text-slate-600">
              <label className="block mb-1 ml-1 tracking-wide">Username</label>
              <input type="text" required placeholder="Masukkan username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none text-slate-800 text-base bg-slate-50/50" />
            </div>

            <div className="w-full text-left text-xs font-bold text-slate-600">
              <label className="block mb-1 ml-1 tracking-wide">Email</label>
              <input type="email" required placeholder="Masukkan email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none text-slate-800 text-base bg-slate-50/50" />
            </div>

            <div className="w-full text-left text-xs font-bold text-slate-600">
              <label className="block mb-1 ml-1 tracking-wide">Tanggal Lahir</label>
              <input type="date" required value={tanggalLahir} onChange={(e) => setTanggalLahir(e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none text-slate-800 text-base bg-white" />
            </div>

            <div className="w-full text-left text-xs font-bold text-slate-600">
              <label className="block mb-1 ml-1 tracking-wide">Jenis Kelamin</label>
              <select required value={jenisKelamin} onChange={(e) => setJenisKelamin(e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none text-slate-800 text-base bg-white">
                <option value="">Pilih Jenis Kelamin</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="text-left text-xs font-bold text-slate-600">
                <label className="block mb-1 ml-1 tracking-wide">Berat (kg)</label>
                <input type="number" required placeholder="e.g. 60" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none text-slate-800 text-base bg-slate-50/50" />
              </div>
              <div className="text-left text-xs font-bold text-slate-600">
                <label className="block mb-1 ml-1 tracking-wide">Tinggi (cm)</label>
                <input type="number" required placeholder="e.g. 165" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none text-slate-800 text-base bg-slate-50/50" />
              </div>
            </div>

            <div className="w-full text-left text-xs font-bold text-slate-600">
              <label className="block mb-1 ml-1 tracking-wide">Password</label>
              
              <div className="relative w-full">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  placeholder="Buat password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full pl-3.5 pr-11 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none text-slate-800 text-base bg-slate-50/50" 
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

            <div className="w-full text-left text-xs font-bold text-slate-600">
              <label className="block mb-1 ml-1 tracking-wide">Konfirmasi Password</label>
              
              <div className="relative w-full">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  required 
                  placeholder="Ulangi password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  className="w-full pl-3.5 pr-11 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none text-slate-800 text-base bg-slate-50/50" 
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer p-1"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button type="submit" className="w-full bg-[#2A6B3F] hover:bg-[#1E5128] active:scale-98 text-white text-xs font-bold py-2.5 rounded-xl transition shadow-md shadow-green-900/10 cursor-pointer">
                Daftar Sekarang
              </button>
            </div>
          </form>

          <div className="mt-5 text-xs text-center">
            <p className="text-slate-500 text-[11px]">Sudah punya akun? <Link to="/login" className="text-green-700 font-bold hover:underline">Login</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}