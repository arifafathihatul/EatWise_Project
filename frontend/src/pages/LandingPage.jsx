import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

import logo from '../assets/logo.png';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToFAQ = (e) => {
    e.preventDefault();
    setIsMenuOpen(false); 
    
    setTimeout(() => {
      const faqSection = document.getElementById('faq-section');
      if (faqSection) {
        faqSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const scrollToHome = (e) => {
    e.preventDefault();
    setIsMenuOpen(false); 
    
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  };

  return (
    <div className="font-sans flex flex-col min-h-screen">
      
      <nav className="fixed top-0 left-0 w-full py-6 px-6 md:px-16 flex justify-between items-center z-50 bg-transparent transition-all duration-300">
        <div className="flex items-center">
          <img src={logo} alt="EatWise Logo" className="h-16 md:h-20 w-auto object-contain" />
        </div>

        <div className="hidden md:flex items-center gap-10 font-bold text-slate-800 text-sm md:text-base">
          <a href="#" onClick={scrollToHome} className="hover:text-green-600 transition cursor-pointer">Home</a>
          <a href="#faq-section" onClick={scrollToFAQ} className="hover:text-green-600 transition cursor-pointer">FAQ</a>
          <Link 
            to="/login" 
            className="bg-green-600 text-white px-5 py-1.5 rounded-full hover:bg-green-700 transition shadow-md text-xs"
          >
            Login
          </Link>
        </div>

        <button 
          className="md:hidden text-slate-800 bg-white/50 p-2 rounded-lg"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {isMenuOpen && (
        <div className="fixed top-[112px] left-0 w-full bg-white shadow-lg p-6 flex flex-col gap-4 text-center z-40 font-bold text-slate-800 border-b border-slate-100 text-xs">
          <a href="#" onClick={scrollToHome} className="hover:text-green-600 transition py-2 border-b border-slate-100">Home</a>
          <a href="#faq-section" onClick={scrollToFAQ} className="hover:text-green-600 transition py-2 border-b border-slate-100">FAQ</a>
          <Link 
            to="/login" 
            className="bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700 transition"
          >
            Login
          </Link>
        </div>
      )}

      <div className="relative min-h-screen flex flex-col justify-center pt-24 bg-white">
        
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80" 
          style={{ 
            backgroundImage: "url('https://i.pinimg.com/1200x/f6/bc/1c/f6bc1cecaf10f22798072e08fbbf7dcb.jpg')" 
          }}
        />

        <main className="relative z-10 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
            Pahami Nutrisimu, <br className="hidden md:block" />
            <span className="text-green-600">Cegah Risiko</span> Kesehatan
          </h1>
          
          <p className="mt-5 text-slate-800 text-sm md:text-base max-w-2xl mx-auto font-medium leading-relaxed">
            EatWise memantau asupan nutrisimu dan memberikan peringatan dini terhadap risiko kesehatan berdasarkan pola konsumsi harianmu.
          </p>
          
          <div className="mt-8 mb-6">
            <Link 
              to="/login" 
              className="inline-block bg-green-600 text-white text-xs md:text-sm font-bold px-6 py-2.5 rounded-full shadow-lg hover:bg-green-700 hover:shadow-green-200 transition transform hover:-translate-y-1"
            >
              Mulai Hidup Sehat Sekarang!
            </Link>
          </div>
        </main>
      </div>

      <section id="faq-section" className="py-24 bg-white px-6 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-900 mb-12">
            Mengapa Harus Menggunakan EatWise?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-slate-100 rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-all bg-white hover:-translate-y-1">
              <h3 className="text-green-600 font-bold text-lg mb-4">Identifikasi Instan</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Cukup pindai citra makanan Anda, dan sistem AI kami akan langsung mengenali jenis makanan serta mengestimasi kandungan nutrisinya.
              </p>
            </div>

            <div className="border border-slate-100 rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-all bg-white hover:-translate-y-1">
              <h3 className="text-green-600 font-bold text-lg mb-4">Analisis Personal</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Rekomendasi yang disesuaikan dengan profil fisik Anda (BMR) untuk menentukan target nutrisi harian yang tepat.
              </p>
            </div>

            <div className="border border-slate-100 rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-all bg-white hover:-translate-y-1">
              <h3 className="text-green-600 font-bold text-lg mb-4">Peringatan Dini</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Dapatkan peringatan konsumsi berlebih dan insight potensi risiko penyakit jangka panjang berdasarkan pola makan Anda.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-50 py-6 text-center text-slate-400 text-xs md:text-sm border-t border-slate-100 mt-auto">
        © 2026 EatWise Team. All rights reserved.
      </footer>

    </div>
  );
}