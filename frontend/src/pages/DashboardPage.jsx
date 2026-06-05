import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, UserCircle, Menu, X, Flame, Beef, Droplet, Egg, Trophy, CheckCircle2, AlertCircle } from 'lucide-react';
import Sidebar from '../components/SideBar'; 
import logo from '../assets/logo.png';
import bannerAsset from '../assets/nasgor.jpg';
import apiClient from '../services/apiClient';

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState({ nama: "User", fotoUrl: null });
  const [currentFoods, setCurrentFoods] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [nutritionSummary, setNutritionSummary] = useState({
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0
  });

  const [userBmr, setUserBmr] = useState(0); 

  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchRealDatabaseData = async () => {
      try {
        setError(null);
        const todayStr = getTodayDateString();
        const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        const [trackerRes, profileRes] = await Promise.all([
          apiClient.get(`/api/tracker/dashboard?date=${todayStr}`, {
            headers: { 'x-user-timezone': localTimezone }
          }),
          apiClient.get('/api/profile')
        ]);

        const trackerData = trackerRes?.data?.data || {};
        const profileResponse = profileRes?.data || {}; 

        const rawChallenges = trackerRes?.data?.dailyChallenges || trackerRes?.data?.challenges || [];
        const realUser = profileResponse.data || {}; 

        const berat = Number(realUser.weight) || 60;   
        const tinggi = Number(realUser.height) || 160; 
        const umur = Number(realUser.age) || 21;       
        const gender = realUser.gender ? realUser.gender.toLowerCase() : 'female'; 

        let calculatedBmr = 1300;
        if (gender === 'male' || gender === 'laki-laki' || gender === 'pria') {
          calculatedBmr = (10 * berat) + (6.25 * tinggi) - (5 * umur) + 5;
        } else {
          calculatedBmr = (10 * berat) + (6.25 * tinggi) - (5 * umur) - 161;
        }
        setUserBmr(Math.round(calculatedBmr));

        setProfile({
          nama: realUser.username || realUser.nama || "User",
          fotoUrl: realUser.profilePictureUrl || realUser.imageUrl || realUser.fotoUrl || null
        });

        const sqlSummary = trackerData.summary || {};
        setNutritionSummary({
          calories: Number(Number(sqlSummary.totalCalories || 0).toFixed(0)),
          protein: Number(Number(sqlSummary.totalProtein || 0).toFixed(1)),
          fat: Number(Number(sqlSummary.totalFat || 0).toFixed(1)),
          carbs: Number(Number(sqlSummary.totalCarbs || 0).toFixed(1))
        });

        const sqlLatestMeal = trackerData.latestMeal;
        if (sqlLatestMeal) {
          let jamMakan = "Baru saja";
          let tanggalTampilanStr = todayStr; 
          
          const tanggalMentah = sqlLatestMeal.loggedAt || sqlLatestMeal.createdAt || sqlLatestMeal.date;
          if (tanggalMentah) {
            try {
              const localDateObj = new Date(tanggalMentah);
              
              jamMakan = localDateObj.toLocaleTimeString('id-ID', {
                timeZone: 'Asia/Jakarta',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              }) + " WIB";

              tanggalTampilanStr = new Intl.DateTimeFormat('fr-CA', {
                timeZone: 'Asia/Jakarta',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
              }).format(localDateObj);

            } catch (e) {
              jamMakan = "Baru saja";
              tanggalTampilanStr = todayStr;
            }
          }

          const mappedLatestMeal = {
            id: sqlLatestMeal.id,
            foodName: sqlLatestMeal.foodName || "Makanan Tanpa Nama",
            time: jamMakan,
            date: tanggalTampilanStr, 
            calories: Number(sqlLatestMeal.calories) || 0,
            protein: Number(sqlLatestMeal.protein) || 0,
            fat: Number(sqlLatestMeal.fat) || 0,
            carbs: Number(sqlLatestMeal.carbs) || 0, 
            healthWarning: sqlLatestMeal.healthWarning || "Aman dikonsumsi."
          };

          setCurrentFoods([mappedLatestMeal]);
        } else {
          setCurrentFoods([]);
        }

        setChallenges(rawChallenges);

      } catch (err) {
        console.error("Gagal sinkronisasi", err);
        const errorMsg = err.response?.data?.message || "Gagal memuat data. Silakan coba beberapa saat lagi.";
        setError(errorMsg);
      }
    };

    fetchRealDatabaseData();
  }, []);

  const makananTerakhir = currentFoods.length > 0 ? currentFoods[0] : null;

  let healthScore = 100;
  let healthStatus = "Kondisi Sangat Baik!";

  if (nutritionSummary.calories === 0) {
    healthScore = 0;
    healthStatus = "Belum Ada Data Asupan";
  } else if (nutritionSummary.fat > 40) {
    healthScore -= 30;
    healthStatus = "Peringatan Kolesterol!";
  } else if (nutritionSummary.calories > userBmr) { 
    healthScore -= 20;
    healthStatus = "Surplus Kalori!";
  } else if (nutritionSummary.protein < 25) {
    healthScore -= 10;
    healthStatus = "Kurang Protein!";
  }

  const bmrPercentage = userBmr > 0 ? Math.min(Math.round((nutritionSummary.calories / userBmr) * 100), 100) : 0;
  const sisaKaloriBmr = userBmr > 0 ? userBmr - nutritionSummary.calories : 0;

  let kaloriAsistenMessage = "Belum ada catatan kesehatan aktif untuk hari ini.";
  if (nutritionSummary.calories === 0) {
    kaloriAsistenMessage = "Belum ada makanan yang dicatat. Silakan scan menu pertamamu hari ini.";
  } else if (nutritionSummary.fat > 40) {
    kaloriAsistenMessage = `Batas lemak harian terlampaui (${nutritionSummary.fat}g). Sebaiknya kurangi makanan berminyak atau gorengan.`;
  } else if (nutritionSummary.calories <= userBmr) {
    kaloriAsistenMessage = `Pola makanmu sudah baik dan kalori harianmu baru terpenuhi ${bmrPercentage}%. Tetap jaga porsi makanmu.`;
  } else {
    const surplus = nutritionSummary.calories - userBmr;
    kaloriAsistenMessage = `Kelebihan kalori sebanyak +${surplus} kcal dari kebutuhan dasar BMR. Batasi asupan makanan berat malam ini.`;
  }

  const toggleChallenge = (id) => {
    setChallenges(prev => prev.map(ch => ch.id === id ? { ...ch, completed: !ch.completed } : ch));
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50 font-sans font-bold text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-[#2A6B3F] border-t-transparent animate-spin"></div>
          <p>Menghubungkan</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 font-sans p-6 text-center">
        <div className="bg-white p-8 rounded-[24px] border border-rose-100 shadow-sm max-w-md space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-black text-slate-800">Koneksi Gagal</h2>
          <p className="text-xs text-slate-500 leading-relaxed">Gagal terhubung dengan server. Silakan periksa koneksi jaringan Anda atau coba beberapa saat lagi.</p>
          <p className="text-[11px] font-mono bg-rose-50 text-rose-600 p-2.5 rounded-xl border border-rose-100">{error}</p>
          <button onClick={() => window.location.reload()} className="w-full bg-[#2A6B3F] hover:bg-[#1E5128] text-white text-xs font-bold py-2.5 rounded-xl transition-all">
            Coba Hubungkan Ulang
          </button>
        </div>
      </div>
    );
  }

  const textRisiko = makananTerakhir && makananTerakhir.healthWarning ? makananTerakhir.healthWarning.toLowerCase() : "";
  const isAman = textRisiko.includes("aman") || 
                  textRisiko.includes("seimbang") || 
                  textRisiko.includes("tercukupi") || 
                  textRisiko.includes("tidak ada") || 
                  textRisiko === "";

  const isPerhatian = !isAman;

  const alertBgColor = isPerhatian ? "bg-rose-500/[0.08] border-rose-500/20 text-rose-800" : "bg-emerald-500/[0.08] border-emerald-500/20 text-emerald-800";
  const alertTextColor = isPerhatian ? "text-rose-600" : "text-emerald-600";
  const iconColor = isAman ? "text-emerald-600" : "text-rose-600";

  return (
    <div className="font-sans h-screen bg-slate-50 flex flex-col md:flex-row w-full overflow-hidden text-left">
      
      <div className="md:hidden w-full bg-white border-b border-slate-200 px-5 py-3.5 flex flex-row justify-between items-center z-50 fixed top-0 left-0">
        <img src={logo} alt="EatWise" className="w-32 h-auto object-contain" />
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-700 p-1">
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} stream={null} />

      <main className="flex-grow h-full overflow-y-auto p-5 sm:p-6 md:p-8 md:pl-80 pt-24 md:pt-10 bg-slate-50 flex justify-center min-w-0">
        <div className="w-full max-w-5xl space-y-6 mx-auto text-left">
          
          <div className="flex items-center gap-4 text-left justify-start">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-slate-200 shadow-sm shrink-0 overflow-hidden flex items-center justify-center bg-white">
              {profile.fotoUrl && profile.fotoUrl !== "" && profile.fotoUrl !== "null" ? (
                <img src={profile.fotoUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <UserCircle className="w-full h-full text-slate-400" />
              )}
            </div>
            <div className="text-left">
              <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight text-transform: capitalize">Halo, {profile.nama}!</h1>
              <p className="text-xs text-slate-400 font-semibold mt-1">
                Yuk, pantau asupan nutrisi dan jaga progres sehatmu hari ini!
              </p>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-[24px] flex flex-col lg:flex-row justify-between items-center border border-emerald-200 shadow-sm w-full overflow-hidden">
            <div className="text-center lg:text-left space-y-2.5 w-full p-6 md:p-8">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Scan MakananMU</h2>
              <p className="text-xs md:text-sm text-slate-500 max-w-md font-medium leading-relaxed">
                Dapatkan informasi nutrisi secara lengkap dari makanan Anda dalam hitungan detik.
              </p>
              <button onClick={() => navigate('/scan')} className="bg-[#2A6B3F] hover:bg-[#1E5128] text-white text-xs font-bold px-5 py-2.5 rounded-xl inline-flex items-center gap-2 shadow shadow-green-200/30 transition-all cursor-pointer mt-1">
                <Camera className="w-4 h-4" /> Scan Sekarang
              </button>
            </div>
            <div className="hidden lg:block shrink-0 w-40 h-40 lg:w-48 lg:h-48 border-l border-emerald-200/50">
              <img src={bannerAsset} alt="Nasi Goreng Banner" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm w-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-center">
              
              <div className="lg:col-span-1 flex flex-col justify-between gap-4 h-full">
                <div className="flex items-center gap-4 w-full">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0"><Trophy className="w-6 h-6" /></div>
                  <div className="text-left">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Skor Kesehatan Harian</p>
                    <h3 className="text-2xl font-black text-slate-800 mt-0.5">{healthScore}/100</h3>
                    <span className="text-[11px] font-bold text-emerald-600 block mt-0.5">{healthStatus}</span>
                  </div>
                </div>
                
                <div className="w-full border-t border-slate-100 pt-2">
                  <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                    <span>Energi Tubuh (BMR)</span>
                    <span>{bmrPercentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/40">
                    <div className="h-full bg-[#2A6B3F] transition-all duration-300" style={{ width: `${bmrPercentage}%` }}></div>
                  </div>
                  <p className="text-[10px] font-medium text-slate-400 mt-1 text-left">
                    {sisaKaloriBmr > 0 ? `Butuh ${sisaKaloriBmr} kcal lagi untuk batas BMR.` : 'Target kalori minimum tubuh terpenuhi.'}
                  </p>
                </div>
              </div>

              <div className="lg:col-span-2 border-t lg:border-t-0 lg:border-l border-slate-100 pt-5 lg:pt-0 lg:pl-8 flex flex-col justify-center h-full text-left">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2.5">
                  {challenges && challenges.length > 0 ? "Tantangan Mahasiswa Sehat" : "Catatan Kesehatan Hari Ini"}
                </p>
                
                <div className="w-full flex items-center">
                  {challenges && challenges.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
                      {challenges.map(ch => (
                        <div key={ch.id} onClick={() => toggleChallenge(ch.id)} className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer select-none transition-all ${ch.completed ? 'bg-emerald-50/60 border-emerald-200 text-emerald-800 font-bold shadow-inner' : 'bg-slate-50 border-slate-150 text-slate-600 hover:border-slate-300'}`}>
                          <CheckCircle2 className={`w-4 h-4 shrink-0 ${ch.completed ? 'text-emerald-600' : 'text-slate-300'}`} />
                          <span className="text-xs leading-tight font-medium">{ch.text || ch.nama_tantangan}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs font-semibold text-slate-500 leading-relaxed italic bg-slate-50 border border-slate-150 p-3.5 rounded-xl w-full flex items-center">
                      {kaloriAsistenMessage}
                    </p>
                  )}
                </div>
              </div>

            </div>
          </div>

          <div className="w-full text-left space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-left">Ringkasan Hari ini</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
              <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-sm flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 mb-2"><Flame className="w-4 h-4" /></div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Kalori</span>
                <span className="text-base font-black text-slate-800 mt-0.5">{nutritionSummary.calories} kcal</span>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-sm flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 mb-2"><Beef className="w-4 h-4" /></div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Protein</span>
                <span className="text-base font-black text-slate-800 mt-0.5">{nutritionSummary.protein} g</span>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-sm flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-500 mb-2"><Droplet className="w-4 h-4" /></div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Lemak</span>
                <span className="text-base font-black text-slate-800 mt-0.5">{nutritionSummary.fat} g</span>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-sm flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-2"><Egg className="w-4 h-4" /></div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Karbohidrat</span>
                <span className="text-base font-black text-slate-800 mt-0.5">{nutritionSummary.carbs} g</span>
              </div>
            </div>
            
            <div className="bg-white text-[#2A6B3F] text-[11px] font-bold px-4 py-1.5 rounded-xl shadow-sm border border-[#D5ECD9] inline-block">
              BMR kamu: {userBmr} kcal / <span className="underline">
                {nutritionSummary.calories} kcal {' '}
                {nutritionSummary.calories === 0 
                  ? '(belum terpenuhi)' 
                  : nutritionSummary.calories > userBmr 
                    ? '(melebihi)' 
                    : '(tercukupi)'}
              </span>
            </div>
          </div>

          <div className="pb-6 w-full text-left space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-left">Makanan Terakhir</h2>
            {makananTerakhir ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-4 w-full hover:border-[#2A6B3F] transition-all">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full pb-1 text-left">
                  <div className="text-left">
                    <h3 className="font-black text-slate-800 text-lg tracking-tight text-left capitalize">{makananTerakhir.foodName}</h3>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5 text-left">{makananTerakhir.time} • Date: {makananTerakhir.date}</p>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-6 sm:gap-8 text-left sm:text-center w-full sm:w-auto justify-between sm:justify-start border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Kalori</p>
                      <p className="text-sm font-black text-slate-900 mt-0.5">{makananTerakhir.calories} kcal</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Protein</p>
                      <p className="text-sm font-black text-slate-900 mt-0.5">{makananTerakhir.protein}g</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Lemak</p>
                      <p className="text-sm font-black text-slate-900 mt-0.5">{makananTerakhir.fat}g</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Karbo</p>
                      <p className="text-sm font-black text-slate-900 mt-0.5">{makananTerakhir.carbs}g</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 border-t pt-3.5 border-slate-100 text-xs text-left">
                  <div className={`flex items-center gap-2.5 p-2.5 rounded-xl border w-full text-left ${alertBgColor}`}>
                    <AlertCircle className={`w-4 h-4 shrink-0 ${iconColor}`} />
                    <p className="leading-tight text-left font-medium">
                      <span className="font-bold text-slate-700">Peringatan Kesehatan:</span>{' '}
                      <span className={`font-black ${alertTextColor}`}>
                        {makananTerakhir.healthWarning}
                      </span>
                    </p>
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-center py-10 bg-white border border-dashed border-slate-200 rounded-xl text-slate-400 font-bold text-xs">
                 Belum ada riwayat makan di database. Yuk mulai scan!
              </div>
            )}
          </div>

        </div>
      </main>

    </div>
  );
}