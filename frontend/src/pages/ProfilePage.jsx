import { useState, useEffect, useRef } from 'react';
import { Menu, X, Edit3, UserCircle, UploadCloud, CheckCircle2, AlertTriangle } from 'lucide-react';
import Sidebar from '../components/SideBar'; 
import logo from '../assets/logo.png';
import apiClient from '../services/apiClient'; 

export default function ProfilePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const fileInputRef = useRef(null);

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [userProfile, setUserProfile] = useState({
    nama: "Loading...",
    email: "-",
    tanggalLahir: "",
    jenisKelamin: "female",
    tinggiBadan: "-",
    beratBadan: "-",
    fotoUrl: null 
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [tempProfile, setTempProfile] = useState({ ...userProfile }); 
  const [tempPhoto, setTempPhoto] = useState(null); 
  const [rawFile, setRawFile] = useState(null); 
  const [isSaving, setIsSaving] = useState(false); 

  const fetchProfileData = async () => {
    try {
      const res = await apiClient.get('/api/profile');
      const realUser = res.data?.data || res.data; 
      
      if (realUser) {
        console.log("Data profil berhasil disinkronisasi.", realUser);
        
        let formattedDate = "";
        if (realUser.dateOfBirth) {
          formattedDate = realUser.dateOfBirth.substring(0, 10);
        }

        setUserProfile({
          nama: realUser.username || "User",
          email: realUser.email || "-",
          tanggalLahir: formattedDate || "-", 
          jenisKelamin: realUser.gender || "female", 
          tinggiBadan: realUser.height ? `${realUser.height} cm` : "-",
          beratBadan: realUser.weight ? `${realUser.weight} kg` : "-",
          fotoUrl: realUser.profilePictureUrl || realUser.imageUrl || realUser.fotoUrl || null
        });
      }
    } catch (err) {
      console.error("Gagal memuat, coba beberapa saat lagi ", err);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  useEffect(() => {
    if (showEditModal) {
      setTempProfile({
        ...userProfile,
        tinggiBadan: userProfile.tinggiBadan.replace(' cm', '').replace('-', ''),
        beratBadan: userProfile.beratBadan.replace(' kg', '').replace('-', ''),
        tanggalLahir: userProfile.tanggalLahir === "-" ? "" : userProfile.tanggalLahir
      });
    }
  }, [showEditModal, userProfile]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRawFile(file); 
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempPhoto(reader.result); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhotoOnly = () => {
    setTempPhoto(null); 
    setRawFile(null);
    setTempProfile(prev => ({ ...prev, fotoUrl: "" }));
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setTempPhoto(null);
    setRawFile(null);
  };

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);

      if (tempProfile.fotoUrl === "") {
        await apiClient.delete('/api/profile/picture');
      }

      const formData = new FormData();
      formData.append('username', tempProfile.nama);
      formData.append('email', tempProfile.email);
      formData.append('dateOfBirth', tempProfile.tanggalLahir);
      formData.append('gender', tempProfile.jenisKelamin);
      
      if (tempProfile.tinggiBadan) formData.append('height', Number(tempProfile.tinggiBadan));
      if (tempProfile.beratBadan) formData.append('weight', Number(tempProfile.beratBadan));

      if (rawFile) {
        formData.append('image', rawFile); 
      }

      await apiClient.put('/api/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      await fetchProfileData();
      
      localStorage.setItem('registeredUsername', tempProfile.nama);
      window.dispatchEvent(new Event('storage_profile_updated'));
      
      setShowEditModal(false);
      setTempPhoto(null);
      setRawFile(null);
    
      setToastMessage("Profil berhasil diperbarui!");
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);

    } catch (error) {
      console.error("Gagal menyimpan perubahan profil:", error);
      setShowSuccessToast(false); 
      setToastMessage("Gagal memuat data. Silakan coba beberapa saat lagi.");
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
    } finally {
      setIsSaving(false); 
    }
  };

  return (
    <div className="font-sans h-screen bg-slate-50 flex flex-col md:flex-row w-full overflow-hidden text-left relative">

      <div className="fixed top-5 right-5 z-[200] space-y-2 pointer-events-none">
        {showSuccessToast && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 shadow-xl flex items-center gap-3 animate-fadeIn w-80 text-xs font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <p>{toastMessage}</p>
          </div>
        )}
        {showErrorToast && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 shadow-xl flex items-center gap-3 animate-fadeIn w-80 text-xs font-bold">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <p>{toastMessage}</p>
          </div>
        )}
      </div>

      <div className="md:hidden w-full bg-white border-b border-slate-200 px-5 py-3.5 flex justify-between items-center z-50 fixed top-0 left-0">
        <img src={logo} alt="EatWise" className="w-32 h-auto object-contain" />
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-700 p-1">
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} stream={null} />

      <main className="flex-grow h-full overflow-y-auto p-5 sm:p-6 md:p-8 md:pl-80 pt-24 md:pt-10 bg-slate-50 flex justify-center min-w-0">
        <div className="w-full max-w-4xl space-y-6 mx-auto text-left pb-12">
          
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Profil</h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Kelola informasi harian dan preferensi kesehatanmu</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-[20px] p-5 md:p-8 shadow-sm w-full flex flex-col items-center animate-fadeIn">
            
            <div className="w-20 h-20 rounded-full overflow-hidden border border-slate-200 shadow-sm mb-6 shrink-0 flex items-center justify-center bg-slate-100">
              {userProfile.fotoUrl && userProfile.fotoUrl !== "" && userProfile.fotoUrl !== "null" ? (
                <img src={userProfile.fotoUrl} alt="Foto Profil" className="w-full h-full object-cover" />
              ) : (
                <UserCircle className="w-14 h-14 text-slate-400" strokeWidth={1} />
              )}
            </div>

            <div className="w-full max-w-2xl space-y-4 text-xs font-semibold text-slate-700">
              <div className="w-full border-t border-slate-100 pt-3 flex justify-between items-center">
                <span className="text-slate-400 font-bold">Nama</span>
                <span className="text-slate-800 font-black text-transform: capitalize">{userProfile.nama}</span>
              </div>
              <div className="w-full border-t border-slate-100 pt-3 flex justify-between items-center">
                <span className="text-slate-400 font-bold">Email</span>
                <span className="text-slate-800 font-black break-all text-right">{userProfile.email}</span>
              </div>
              <div className="w-full border-t border-slate-100 pt-3 flex justify-between items-center">
                <span className="text-slate-400 font-bold">Tanggal Lahir</span>
                <span className="text-slate-800 font-black">{userProfile.tanggalLahir}</span>
              </div>
              <div className="w-full border-t border-slate-100 pt-3 flex justify-between items-center">
                <span className="text-slate-400 font-bold">Jenis Kelamin</span>
                <span className="text-slate-800 font-black">
                  {userProfile.jenisKelamin.toLowerCase() === 'female' || userProfile.jenisKelamin === 'Perempuan' ? 'Perempuan' : 'Laki-laki'}
                </span>
              </div>
              <div className="w-full border-t border-slate-100 pt-3 flex justify-between items-center">
                <span className="text-slate-400 font-bold">Tinggi Badan</span>
                <span className="text-slate-800 font-black">{userProfile.tinggiBadan}</span>
              </div>
              <div className="w-full border-t border-slate-100 pt-3 pb-3 flex justify-between items-center">
                <span className="text-slate-400 font-bold">Berat Badan</span>
                <span className="text-slate-800 font-black">{userProfile.beratBadan}</span>
              </div>
            </div>

            <div className="w-full max-w-2xl flex justify-end pt-3">
              <button 
                onClick={() => setShowEditModal(true)}
                className="inline-flex items-center gap-2 border border-emerald-500/30 bg-white hover:bg-[#E6F3EA] text-[#2A6B3F] font-bold text-[11px] px-4 py-2 rounded-xl transition-all duration-150 active:scale-95 shadow-sm cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#2A6B3F]" />
                Edit Informasi
              </button>
            </div>

          </div>
        </div>
      </main>

      {showEditModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative bg-white w-full max-w-xl rounded-[24px] overflow-hidden shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto animate-fadeIn text-left">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-sm font-black text-slate-900">Edit Informasi Profil</h2>
              <button onClick={closeEditModal} disabled={isSaving} className="p-1.5 hover:bg-slate-100 rounded-full cursor-pointer"><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            
            <div className="flex flex-col items-center space-y-3 border border-dashed border-slate-200 rounded-xl p-4 bg-slate-50/50">
              <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" className="hidden" />
              <div className="w-16 h-16 rounded-full overflow-hidden border border-white flex items-center justify-center bg-slate-100 shadow-sm shrink-0">
                {tempPhoto || (tempProfile.fotoUrl && tempProfile.fotoUrl !== "") ? (
                  <img src={tempPhoto || tempProfile.fotoUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <UserCircle className="w-full h-full text-slate-300" strokeWidth={1} />
                )}
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isSaving} className="bg-[#2A6B3F] hover:bg-[#1E5128] text-white text-[10px] font-bold px-3 py-2 rounded-lg inline-flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-sm"><UploadCloud className="w-3.5 h-3.5" /> Upload Foto</button>
                {(tempPhoto || (tempProfile.fotoUrl && tempProfile.fotoUrl !== "")) && (
                  <button type="button" onClick={handleRemovePhotoOnly} disabled={isSaving} className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/50 text-[10px] font-bold px-3 py-2 rounded-lg inline-flex items-center cursor-pointer transition-all active:scale-95">Hapus Foto</button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
              <div className="space-y-1"><label className="font-bold text-slate-500">Nama Lengkap</label><input type="text" disabled={isSaving} value={tempProfile.nama} onChange={(e) => setTempProfile({ ...tempProfile, nama: e.target.value })} className="w-full border border-slate-200 rounded-lg p-2 outline-none focus:border-[#2A6B3F]" /></div>
              <div className="space-y-1"><label className="font-bold text-slate-500">Email</label><input type="email" disabled={isSaving} value={tempProfile.email} onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })} className="w-full border border-slate-200 rounded-lg p-2 outline-none focus:border-[#2A6B3F]" /></div>
              <div className="space-y-1"><label className="font-bold text-slate-500">Tanggal Lahir</label><input type="date" disabled={isSaving} value={tempProfile.tanggalLahir} onChange={(e) => setTempProfile({ ...tempProfile, tanggalLahir: e.target.value })} className="w-full border border-slate-200 rounded-lg p-2 outline-none focus:border-[#2A6B3F]" /></div>
              
              <div className="space-y-1">
                <label className="font-bold text-slate-500">Jenis Kelamin</label>
                <select 
                  disabled={isSaving} 
                  value={tempProfile.jenisKelamin.toLowerCase()} 
                  onChange={(e) => setTempProfile({ ...tempProfile, jenisKelamin: e.target.value })} 
                  className="w-full border border-slate-200 bg-white rounded-lg p-2 outline-none focus:border-[#2A6B3F]"
                >
                  <option value="female">Perempuan</option>
                  <option value="male">Laki-laki</option>
                </select>
              </div>

              <div className="space-y-1"><label className="font-bold text-slate-500">Tinggi Badan (cm)</label><input type="text" disabled={isSaving} placeholder="Contoh: 170" value={tempProfile.tinggiBadan} onChange={(e) => setTempProfile({ ...tempProfile, tinggiBadan: e.target.value })} className="w-full border border-slate-200 rounded-lg p-2 outline-none focus:border-[#2A6B3F]" /></div>
              <div className="space-y-1"><label className="font-bold text-slate-500">Berat Badan (kg)</label><input type="text" disabled={isSaving} placeholder="Contoh: 65" value={tempProfile.beratBadan} onChange={(e) => setTempProfile({ ...tempProfile, beratBadan: e.target.value })} className="w-full border border-slate-200 rounded-lg p-2 outline-none focus:border-[#2A6B3F]" /></div>
            </div>
            
            <div className="flex flex-row items-center gap-3 pt-3 border-t border-slate-100 w-full">
              <button type="button" onClick={closeEditModal} disabled={isSaving} className="flex-1 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-600 font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer text-center text-xs">Batal</button>
              <button 
                type="button" 
                onClick={handleSaveChanges} 
                disabled={isSaving}
                className={`flex-1 bg-[#2A6B3F] hover:bg-[#1E5128] active:scale-95 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer text-center text-xs ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSaving ? (
                  <>
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                    <span>Menyimpan</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> 
                    <span>Simpan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}