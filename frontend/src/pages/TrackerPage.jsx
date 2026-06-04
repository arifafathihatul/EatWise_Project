import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Flame, Beef, Droplet, Egg, Calendar, AlertCircle, UserCircle } from 'lucide-react';
import Sidebar from '../components/SideBar'; 
import logo from '../assets/logo.png';
import apiClient from '../services/apiClient'; 

export default function TrackerPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentActiveFoods, setCurrentActiveFoods] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const [summary, setSummary] = useState({
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0
  });

  const [userBmr, setUserBmr] = useState(0); 

  const getTodayDateString = () => {
    return new Intl.DateTimeFormat('fr-CA', {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(new Date());
  };

  const [selectedDate, setSelectedDate] = useState(getTodayDateString()); 

  useEffect(() => {
    const fetchDailyMeals = async () => {
      try {
        const todayStr = getTodayDateString();
        const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone; 

        const res = await apiClient.get(`/api/tracker?date=${selectedDate}`, {
          headers: {
            'x-user-date': todayStr,
            'x-user-timezone': localTimezone
          }
        });
        
        const mealsFromDb = res.data?.data || [];

        const dbMappedFoods = mealsFromDb.map((meal) => {
          let jamMakan = "Baru saja";
          const tanggalMentah = meal.loggedAt || meal.createdAt || meal.date;
          
          if (tanggalMentah) {
            try {
              jamMakan = new Date(tanggalMentah).toLocaleTimeString('id-ID', {
                timeZone: 'Asia/Jakarta',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              }) + " WIB";
            } catch (e) {
              jamMakan = "Baru saja";
            }
          }

          const hasilRisikoAi = 
            meal.healthWarning || 
            meal.risiko ||
            "Aman";

          return {
            id: meal.id || Math.random(),
            nama: meal.foodName || "Makanan Tanpa Nama",
            waktu: jamMakan, 
            kalori: Number(meal.calories) || 0,
            protein: Number(meal.protein) || 0,
            lemak: Number(meal.fat) || 0,
            karbo: Number(meal.carbs) || 0, 
            risiko: hasilRisikoAi
          };
        });

        setCurrentActiveFoods(dbMappedFoods);

        try {
          const profileRes = await apiClient.get('/api/profile', {
            headers: { 'x-user-date': todayStr, 'x-user-timezone': localTimezone }
          }); 
          const userProfile = profileRes.data?.data || profileRes.data || {};

          const berat = Number(userProfile.weight) || 60;   
          const tinggi = Number(userProfile.height) || 160; 
          const umur = Number(userProfile.age) || 21;       
          const genderRaw = userProfile.gender ? userProfile.gender.toString().toLowerCase() : 'female'; 

          let calculatedBmr = 1300;
          if (genderRaw.includes('laki') || genderRaw.includes('pria') || genderRaw.includes('male')) {
            calculatedBmr = (10 * berat) + (6.25 * tinggi) - (5 * umur) + 5;
          } else {
            calculatedBmr = (10 * berat) + (6.25 * tinggi) - (5 * umur) - 161;
          }
          setUserBmr(Math.round(calculatedBmr));
        } catch (profileErr) {
          console.error("Gagal mengambil data profil, BMR kembali ke default:", profileErr);
        }

      } catch (err) {
        console.error("Gagal menarik data harian dari server:", err);
      }
    };

    fetchDailyMeals();
  }, [selectedDate]); 

  useEffect(() => {
    if (location.state?.newScannedMeal) {
      const transitMeal = location.state.newScannedMeal;
      
      const mappedTransit = {
        id: transitMeal.id || Date.now(),
        nama: transitMeal.foodName || "Makanan Tanpa Nama",
        waktu: transitMeal.waktu || "Baru saja",
        kalori: Number(transitMeal.calories || 0),
        protein: Number(transitMeal.protein || 0),
        lemak: Number(transitMeal.fat || 0),
        karbo: Number(transitMeal.carbs || 0),
        risiko: transitMeal.healthWarning || transitMeal.risiko || "Aman"
      };

      setCurrentActiveFoods(prev => {
        const isExist = prev.some(item => item.id === mappedTransit.id);
        if (isExist) return prev;
        return [mappedTransit, ...prev];
      });

      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    if (!currentActiveFoods || currentActiveFoods.length === 0) {
      setSummary({ calories: 0, protein: 0, fat: 0, carbs: 0 });
      return;
    }

    const totalCal = currentActiveFoods.reduce((sum, item) => sum + item.kalori, 0);
    const totalProt = currentActiveFoods.reduce((sum, item) => sum + item.protein, 0);
    const totalFat = currentActiveFoods.reduce((sum, item) => sum + item.lemak, 0);
    const totalCarb = currentActiveFoods.reduce((sum, item) => sum + item.karbo, 0);

    setSummary({
      calories: Number(totalCal.toFixed(0)), 
      protein: Number(totalProt.toFixed(1)),   
      fat: Number(totalFat.toFixed(1)),
      carbs: Number(totalCarb.toFixed(1))       
    });
  }, [currentActiveFoods]);

  return (
    <div className="font-sans h-screen bg-slate-50 flex flex-col md:flex-row w-full overflow-hidden text-left">
      
      <div className="md:hidden w-full bg-white border-b border-slate-200 px-5 py-3.5 flex justify-between items-center z-50 fixed top-0 left-0">
        <img src={logo} alt="EatWise" className="w-32 h-auto object-contain" />
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-700 p-1">
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} stream={null} />

      <main className="flex-grow h-full overflow-y-auto p-5 sm:p-6 md:p-8 md:pl-80 pt-24 md:pt-10 bg-slate-50 flex justify-center min-w-0 text-left">
        <div className="w-full max-w-5xl space-y-6 mx-auto text-left pb-12">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Daily Tracker</h1>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Pantauan asupan nutrisi harianmu</p>
            </div>
            
            <div className="flex items-center gap-3 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm self-stretch sm:self-auto justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                <Calendar className="w-3.5 h-3.5 text-[#2A6B3F]" />
                <label htmlFor="calendar-input" className="cursor-pointer">Pilih Tanggal:</label>
              </div>
              <input 
                id="calendar-input"
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="text-xs font-bold text-slate-700 outline-none bg-transparent cursor-pointer border border-slate-150 rounded-lg px-1.5 py-0.5 focus:border-[#2A6B3F] transition-colors"
              />
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ringkasan Nutrisi Hari Ini</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
              
              <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-sm flex flex-col items-center justify-center min-h-[110px]">
                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 mb-1.5 font-bold"><Flame className="w-4 h-4" /></div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Kalori</span>
                <span className="text-base font-black text-slate-800 mt-0.5">{summary.calories} kcal</span>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-sm flex flex-col items-center justify-center min-h-[110px]">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 mb-1.5 font-bold"><Beef className="w-4 h-4" /></div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Protein</span>
                <span className="text-base font-black text-slate-800 mt-0.5">{summary.protein} g</span>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-sm flex flex-col items-center justify-center min-h-[110px]">
                <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-500 mb-1.5 font-bold"><Droplet className="w-4 h-4" /></div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Lemak</span>
                <span className="text-base font-black text-slate-800 mt-0.5">{summary.fat} g</span>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-sm flex flex-col items-center justify-center min-h-[110px]">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mb-1.5 font-bold"><Egg className="w-4 h-4" /></div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Karbohidrat</span>
                <span className="text-base font-black text-slate-800 mt-0.5">{summary.carbs} g</span>
              </div>

            </div>

            <div className="bg-white text-[#2A6B3F] text-[11px] font-bold px-4 py-1.5 rounded-xl shadow-sm border border-[#D5ECD9] inline-block">
              BMR kamu: {userBmr} kcal / <span className="underline">
                {summary.calories} kcal {' '}
                {summary.calories === 0 
                  ? '(belum terpenuhi)' 
                  : summary.calories > userBmr 
                    ? '(melebihi)' 
                    : '(tercukupi)'}
              </span>
            </div>
          </div>

          <div className="space-y-3 w-full">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Makanan Hari Ini</h2>
            <div className="space-y-3 w-full">
              
              {currentActiveFoods.length > 0 ? (
                currentActiveFoods.map((food, idx) => {
                  const textRisiko = food.risiko ? food.risiko.toLowerCase() : "";
                  const isAman = textRisiko.includes("aman") || textRisiko.includes("seimbang") || textRisiko.includes("tercukupi") || textRisiko.includes("tidak ada") || textRisiko === "";
                  const boxBgColor = isAman ? "bg-emerald-500/[0.08] border-emerald-500/20 text-emerald-800" : "bg-rose-500/[0.08] border-rose-500/20 text-rose-800";
                  const iconColor = isAman ? "text-emerald-600" : "text-rose-600";
                  const textStatusColor = isAman ? "text-emerald-600" : "text-rose-600";

                  return (
                    <div key={food.id || idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-4 w-full">
                      
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 w-full pb-1">
                        <div>
                          <h3 className="font-black text-slate-800 text-base tracking-tight capitalize">{food.nama}</h3>
                          <p className="text-[10px] text-slate-400 font-bold mt-0.5">{food.waktu}</p>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-4 sm:gap-6 text-left sm:text-center text-[11px] w-full sm:w-auto pt-2.5 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                          <div><p className="text-[9px] text-slate-400 font-bold uppercase">Kalori</p><p className="font-black text-slate-800 mt-0.5">{food.kalori} kcal</p></div>
                          <div><p className="text-[9px] text-slate-400 font-bold uppercase">Protein</p><p className="font-bold text-slate-700 mt-0.5">{food.protein}g</p></div>
                          <div><p className="text-[9px] text-slate-400 font-bold uppercase">Lemak</p><p className="font-bold text-slate-700 mt-0.5">{food.lemak}g</p></div>
                          <div><p className="text-[9px] text-slate-400 font-bold uppercase">Karbo</p><p className="font-bold text-slate-700 mt-0.5">{food.karbo}g</p></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 border-t pt-3.5 border-slate-100 text-xs">
                        <div className={`flex items-center gap-2.5 p-2.5 rounded-xl border w-full text-left ${boxBgColor}`}>
                          <span className="text-sm shrink-0"><AlertCircle className={`w-4 h-4 ${iconColor}`} /></span>
                          <p className="leading-tight">
                            <span className="font-bold text-slate-700">Peringatan Kesehatan:</span>{' '}
                            <span className={`font-black ${textStatusColor}`}>
                              {food.risiko}
                            </span>
                          </p>
                        </div>
                      </div>

                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10 bg-white border border-dashed border-slate-200 rounded-xl text-slate-400 font-bold text-xs">
                   Belum ada riwayat makanan di tanggal ini.
                </div>
              )}

            </div>
          </div>

        </div>
      </main>

    </div>
  );
}