import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Image as ImageIcon, Lightbulb, CheckCircle2, AlertCircle } from 'lucide-react';
import Sidebar from '../components/SideBar'; 
import { scanFood } from '../services/foodServices';
import apiClient from '../services/apiClient'; 
import logo from '../assets/logo.png';

export default function ScanPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stream, setStream] = useState(null); 
  const [capturedImage, setCapturedImage] = useState(null); 
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [aiResult, setAiResult] = useState({
    namaMakanan: "-",
    confidence: 0,
    kalori: 0,
    protein: 0,
    lemak: 0,
    karbo: 0,
    risiko: "-"
  });
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(s => { 
        setStream(s); 
        if (videoRef.current) videoRef.current.srcObject = s; 
      })
      .catch(e => console.error("Kamera gagal dimuat:", e));

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const v = videoRef.current;
      const c = canvasRef.current;
      
      c.width = v.videoWidth > 0 ? v.videoWidth : 640;
      c.height = v.videoHeight > 0 ? v.videoHeight : 480;
      c.getContext('2d').drawImage(v, 0, 0, c.width, c.height);
      
      const dataUrl = c.toDataURL('image/jpeg');
      setCapturedImage(dataUrl);
      
      c.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "captured_food.jpg", { type: "image/jpeg" });
          sendToAiBackend(file);
        }
      }, 'image/jpeg');

      if (v.srcObject) {
        v.srcObject.getTracks().forEach(track => track.stop());
      }
    }
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result); 
        if (videoRef.current && videoRef.current.srcObject) {
          videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
        sendToAiBackend(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const sendToAiBackend = async (fileToUpload) => {
    try {
      setLoading(true);
      setError("");
      setShowModal(true);

      const res = await scanFood(fileToUpload);

      if (res && res.success) {
        const rawAiData = res.data || {};
        let rawConfidence = res.confidence !== undefined ? res.confidence : rawAiData.confidence;
        let confidenceScore = Number(rawConfidence) || 0;
        if (confidenceScore > 0 && confidenceScore <= 1) {
          confidenceScore = confidenceScore * 100;
        }
        confidenceScore = Math.round(confidenceScore);

        const hasilRisikoAi = 
          rawAiData.healthWarning || 
          rawAiData.health_warning || 
          rawAiData.risiko || 
          res.healthWarning ||
          "Aman"; 

        const namaMakananAi = rawAiData.foodName || rawAiData.label || "Makanan Tidak Dikenali";
        const kaloriAi = Number(rawAiData.calories) || Number(rawAiData.kalori) || 0;
        const proteinAi = Number(rawAiData.protein) || 0;
        const lemakAi = Number(rawAiData.fat) || Number(rawAiData.lemak) || 0;
        const karboAi = Number(rawAiData.carbs) || Number(rawAiData.carbohydrate) || 0;

        setAiResult({
          namaMakanan: namaMakananAi,
          confidence: confidenceScore,
          kalori: kaloriAi,
          protein: proteinAi,
          lemak: lemakAi,
          karbo: karboAi, 
          risiko: hasilRisikoAi
        });
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "AI gagal menganalisis gambar makanan ini.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToTracker = async () => {
    try {
      setLoading(true);
      localStorage.removeItem('foodCapturedList');

      const saveResponse = await apiClient.post('/api/save', {
        foodName: aiResult.namaMakanan,
        calories: aiResult.kalori,
        protein: aiResult.protein,
        fat: aiResult.lemak,
        carbs: aiResult.karbo,
        healthWarning: aiResult.risiko
      });

      if (saveResponse && saveResponse.data && saveResponse.data.success) {
        const localDate = new Date().toLocaleDateString('en-CA'); 
        const now = new Date();
        const waktuWIB = now.toLocaleTimeString('id-ID', {
          timeZone: 'Asia/Jakarta',
          hour: '2-digit',
          minute: '2-digit'
        }) + " WIB";

        const transitMealData = {
          id: saveResponse.data.data?.newMeal?.id || Date.now(), 
          nama: aiResult.namaMakanan, 
          waktu: waktuWIB, 
          loggedAt: now.toISOString(), 
          date: localDate, 
          confidence: `${aiResult.confidence}%`,
          kalori: aiResult.kalori, 
          protein: aiResult.protein, 
          lemak: aiResult.lemak, 
          karbo: aiResult.karbo, 
          risiko: aiResult.risiko 
        };

        setShowModal(false);
        navigate('/tracker', { state: { newScannedMeal: transitMealData }, replace: true }); 
      } else {
        throw new Error("Gagal menyimpan data dari respons server.");
      }

    } catch (error) {
      console.error("Gagal memproses penyimpanan ke database:", error);
      setToastMessage(error.response?.data?.message || "Gagal menyimpan data ke Daily Tracker.");
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setShowModal(false);
    setError("");
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(s => { 
        setStream(s); 
        if (videoRef.current) videoRef.current.srcObject = s; 
      })
      .catch(e => console.error("Kamera gagal dimuat:", e));
  };

  const isAman = aiResult.risiko.toLowerCase().includes('aman') || aiResult.risiko.toLowerCase().includes('seimbang');

  return (
    <div className="font-sans min-h-screen bg-slate-50 flex flex-col md:flex-row relative w-full overflow-x-hidden text-left">
      <canvas ref={canvasRef} className="hidden" />

      {showErrorToast && (
        <div className="fixed bottom-5 right-5 z-[200] bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 shadow-xl flex items-center gap-3 animate-fadeIn w-80 text-xs font-bold text-left">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <div>
            <p className="font-black text-rose-900">Gagal Menyimpan</p>
            <p className="font-medium text-rose-700/90 mt-0.5 leading-relaxed">{toastMessage}</p>
          </div>
        </div>
      )}

      <div className="md:hidden w-full bg-white border-b border-slate-200 px-5 py-3.5 flex justify-between items-center z-50 fixed top-0 left-0">
        <img src={logo} alt="EatWise" className="w-32 h-auto object-contain" />
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-700 p-1">
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} stream={stream} /> 

      <main className="flex-grow h-full overflow-y-auto p-5 sm:p-6 md:p-8 md:pl-80 pt-24 md:pt-10 bg-slate-50 flex justify-center min-w-0 text-left">
        <div className="w-full max-w-4xl mx-auto text-left space-y-6 pb-12">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Scan Makanan</h1>
            <p className="text-xs md:text-sm text-slate-400 font-medium mt-0.5">Scan atau upload makanannya di sini, ya!</p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start w-full text-left">
            <div className="w-full max-w-sm bg-white border border-slate-200 rounded-[24px] p-4 shadow-sm shrink-0">
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
              <div className="w-full rounded-xl bg-[#1A1A1A] overflow-hidden flex flex-col">
                <div className="w-full py-2 text-center border-b border-white/5">
                  <span className="text-white text-[11px] font-medium opacity-60">
                    {capturedImage ? "Hasil Foto Makanan" : "Arahkan kamera ke makanan"}
                  </span>
                </div>
                <div className="w-full aspect-square bg-neutral-900 relative flex items-center justify-center">
                  {capturedImage ? <img src={capturedImage} alt="Food" className="w-full h-full object-cover" /> : <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />}
                  {!capturedImage && <div className="absolute w-36 h-36 border border-dashed border-white/30 rounded-xl z-10 animate-pulse" />}
                </div>
                <div className="w-full bg-[#1A1A1A] py-3 px-6 flex justify-between items-center relative">
                  <button type="button" onClick={triggerFileSelect} className="text-white opacity-60 p-2 hover:bg-white/10 rounded-full transition-all">
                    <ImageIcon className="w-5 h-5" />
                  </button>
                  {capturedImage ? (
                    <button type="button" onClick={handleRetake} className="bg-white text-neutral-900 font-bold text-[10px] px-4 py-1.5 rounded-full transition-all">Ulangi Foto</button>
                  ) : (
                    <button type="button" onClick={handleCapture} className="w-12 h-12 bg-white rounded-full border-[3px] border-neutral-700 active:scale-95 flex items-center justify-center shadow shadow-black/40 cursor-pointer z-10">
                      <div className="w-8 h-8 bg-white rounded-full border border-neutral-200 pointer-events-none" />
                    </button>
                  )}
                  <div className="w-10 h-10" />
                </div>
              </div>
            </div>

            <div className="w-full max-w-[240px] bg-emerald-50 border border-emerald-150 rounded-xl p-4 shadow-sm mt-0 md:mt-12 text-left">
              <div className="flex items-start gap-2.5 text-[#2A6B3F] font-bold text-xs text-left">
                <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="text-left">
                  <h3 className="font-bold text-left">Tips</h3>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-normal mt-0.5 text-left">Pastikan makanan terlihat jelas dan tidak terpotong agar hasil analisis lebih akurat</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative bg-white w-full max-w-md rounded-[24px] overflow-hidden shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto text-left">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-sm font-black text-slate-800 tracking-tight">Hasil Scan Makanan</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-slate-100 rounded-full cursor-pointer">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            
            {loading ? (
              <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
                <div className="w-10 h-10 border-4 border-[#2A6B3F] border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-bold text-slate-500">AI EatWise sedang memproses data nutrisi...</p>
              </div>
            ) : error ? (
              <div className="p-6 text-center space-y-4">
                <div className="text-rose-500 font-bold text-xs flex items-center justify-center gap-1.5">
                  <AlertCircle className="w-5 h-5 shrink-0" /> {error}
                </div>
                <button type="button" onClick={handleRetake} className="bg-slate-100 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl">Coba Ulang</button>
              </div>
            ) : aiResult.confidence < 25 ? (
              <div className="py-6 text-center flex flex-col items-center space-y-4 animate-fadeIn">
                <div className="w-16 h-16 bg-emerald-50 rounded-full border border-emerald-100 flex items-center justify-center shadow-inner">
                  <AlertCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <div className="space-y-1.5 px-2">
                  <h3 className="text-sm font-black text-emerald-900 uppercase tracking-wider">Analisis Belum Maksimal</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    AI kami belum bisa mengenali makanan ini dengan pasti. Silakan coba pilih foto lain yang lebih jelas agar hasil analisis lebih akurat.
                  </p>
                </div>
                <button type="button" onClick={handleRetake} className="w-full bg-[#2A6B3F] hover:bg-[#1E5128] text-white font-bold py-3 rounded-xl shadow text-xs uppercase tracking-wider transition-all active:scale-95">
                  Pilih Foto Lain
                </button>
              </div>
            ) : (
              <>
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-48 h-48 aspect-square rounded-xl overflow-hidden shadow-md border border-slate-100 mx-auto">
                    <img src={capturedImage} alt="Food Result" className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-base font-black text-slate-800 tracking-tight capitalize">{aiResult.namaMakanan}</h3>
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-[#E6F3EA] text-[#2A6B3F] rounded-full text-[10px] font-bold">
                    <CheckCircle2 className="w-3 h-3" /> AI Confidence {aiResult.confidence}%
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 space-y-2 border border-slate-200 text-xs font-bold text-slate-600">
                  <div className="flex justify-between"><span>Kalori</span><span className="text-slate-800 font-black">{aiResult.kalori} kcal</span></div>
                  <div className="h-px bg-slate-200" />
                  <div className="flex justify-between"><span>Protein</span><span className="text-slate-800 font-black">{aiResult.protein} g</span></div>
                  <div className="h-px bg-slate-200" />
                  <div className="flex justify-between"><span>Lemak</span><span className="text-slate-800 font-black">{aiResult.lemak} g</span></div>
                  <div className="h-px bg-slate-200" />
                  <div className="flex justify-between"><span>Karbohidrat</span><span className="text-slate-800 font-black">{aiResult.karbo} g</span></div>
                </div>

                <div className={`border rounded-xl p-4 text-[11px] font-bold space-y-1 ${isAman ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
                  <p className={`text-[9px] uppercase tracking-wide flex items-center gap-1 ${isAman ? 'text-emerald-600' : 'text-rose-500'}`}>
                    Peringatan Kesehatan <AlertCircle className="w-3 h-3" />
                  </p>
                  <p className={`leading-normal break-words font-medium ${isAman ? 'text-emerald-800' : 'text-rose-700'}`}>
                    {aiResult.risiko}
                  </p>
                </div>

                <p className="text-[9px] text-slate-400 font-medium italic text-center leading-tight pt-0.5">*Hasil analisis visual AI EatWise ini adalah estimasi, bukan rekam medis atau diagnosis resmi dokter.</p>

                <button onClick={handleSaveToTracker} className="w-full bg-[#2A6B3F] hover:bg-[#1E5128] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-1.5 shadow transition-all active:scale-95 cursor-pointer text-xs uppercase tracking-wider">
                  Simpan Ke Daily Tracker
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}