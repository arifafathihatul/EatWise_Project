"""
EatWise Dashboard - Aplikasi Analisis Nutrisi & Rekomendasi Makanan Sehat
Capstone Project | Streamlit Interactive Dashboard
"""

import streamlit as st
import pandas as pd
import numpy as np
import os
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots


# ──────────────────────────────────────────────
# KONFIGURASI HALAMAN
# ──────────────────────────────────────────────
st.set_page_config(
    page_title="EatWise Dashboard",
    page_icon="🥗",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ──────────────────────────────────────────────
# CUSTOM CSS
# ──────────────────────────────────────────────
st.markdown("""
<style>
    /* Background */
    .stApp { background-color: #f8fdf4; }

    /* Header */
    .main-header {
        background: linear-gradient(135deg, #2e7d32, #66bb6a);
        padding: 2rem 2.5rem;
        border-radius: 16px;
        margin-bottom: 1.5rem;
        color: white;
        text-align: center;
        box-shadow: 0 4px 20px rgba(46,125,50,0.3);
    }
    .main-header h1 { font-size: 2.6rem; margin: 0; font-weight: 800; letter-spacing: 1px; }
    .main-header p  { font-size: 1.05rem; opacity: 0.9; margin: 0.5rem 0 0; }

    /* KPI Cards */
    .metric-card {
        background: white;
        border-radius: 14px;
        padding: 1.4rem;
        text-align: center;
        box-shadow: 0 2px 12px rgba(0,0,0,0.07);
        border-left: 5px solid #66bb6a;
        height: 100%;
    }
    .metric-card .value { font-size: 2rem; font-weight: 700; color: #2e7d32; }
    .metric-card .label { font-size: 0.85rem; color: #666; margin-top: 0.25rem; }

    /* Risk badges */
    .badge-safe   { background:#e8f5e9; color:#2e7d32; padding:3px 10px; border-radius:20px; font-size:0.82rem; font-weight:600; }
    .badge-warn   { background:#fff8e1; color:#f57f17; padding:3px 10px; border-radius:20px; font-size:0.82rem; font-weight:600; }
    .badge-danger { background:#ffebee; color:#c62828; padding:3px 10px; border-radius:20px; font-size:0.82rem; font-weight:600; }

    /* Section titles */
    .section-title {
        font-size: 1.3rem; font-weight: 700;
        color: #1b5e20; margin: 1.5rem 0 0.75rem;
        border-bottom: 2px solid #a5d6a7;
        padding-bottom: 0.4rem;
    }

    /* Sidebar */
    [data-testid="stSidebar"] { background: #1b5e20 !important; }
    [data-testid="stSidebar"] * { color: white !important; }
    [data-testid="stSidebar"] .stSelectbox label,
    [data-testid="stSidebar"] .stSlider label { color: #c8e6c9 !important; font-weight: 600; }

    /* DataTable */
    .stDataFrame { border-radius: 10px; overflow: hidden; }

    /* Alert boxes */
    .alert-danger { background:#ffebee; border-left:4px solid #e53935; padding:12px 16px; border-radius:8px; margin:10px 0; }
    .alert-safe   { background:#e8f5e9; border-left:4px solid #43a047; padding:12px 16px; border-radius:8px; margin:10px 0; }
    .alert-warn   { background:#fff8e1; border-left:4px solid #ffb300; padding:12px 16px; border-radius:8px; margin:10px 0; }
</style>
""", unsafe_allow_html=True)


# ──────────────────────────────────────────────
# DATA GENERATION  (meniru logika notebook)
# ──────────────────────────────────────────────
# @st.cache_data
def load_data():
    # Mendapatkan path absolut folder tempat dashboard.py berada
    base_path = os.path.dirname(os.path.abspath(__file__))
    
    # Path ke file dataset
    path_csv = os.path.join(base_path, 'eatwise_final_dataset.csv')
    path_nutrition = os.path.join(base_path, 'nutrition.csv')

    # 1. Coba baca file utama
    if os.path.exists(path_csv):
        return pd.read_csv(path_csv)
    
    # 2. Coba baca file alternatif
    elif os.path.exists(path_nutrition):
        return pd.read_csv(path_nutrition, sep=';')
    
    # 3. Jika keduanya gagal, gunakan data representatif
    else:
        st.warning("Dataset tidak ditemukan. Menggunakan data representatif untuk demo.")
        
        np.random.seed(42)
        n = 120
        names_base = [
            "Nasi Putih","Ayam Bakar","Tempe Goreng","Tahu Goreng","Sayur Lodeh",
            "Gado-Gado","Soto Ayam","Bakso Sapi","Mie Goreng","Nasi Uduk",
            "Pecel Lele","Rendang Sapi","Ikan Bakar","Cap Cay","Tumis Kangkung",
            "Bubur Ayam","Ketoprak","Siomay","Batagor","Martabak Telur",
            "Pisang Goreng","Onde-Onde","Klepon","Lupis","Risol",
            "Air Mineral","Teh Manis","Jus Jeruk","Es Kelapa","Kopi Susu",
            "Salad Buah","Yoghurt","Roti Gandum","Oatmeal","Granola",
        ]
        food_names = names_base * (n // len(names_base) + 1)
        food_names = [f"{n} #{i+1}" if i >= len(names_base) else n
                      for i, n in enumerate(food_names[:n])]

        df = pd.DataFrame({
            'id': range(1, n+1),
            'name': food_names,
            'calories':     np.random.randint(30, 750, n).astype(float),
            'proteins':     np.random.uniform(0.5, 40, n).round(1),
            'fat':          np.random.uniform(0, 40, n).round(1),
            'carbohydrate': np.random.uniform(0, 110, n).round(1),
        })
        return df
    # ── Tambah makanan lokal ──────────────────────────────────────────
    makanan_lokal = pd.DataFrame([
        {'id':2001,'name':'Ayam Geprek',        'calories':550,'proteins':25.0,'fat':30.0,'carbohydrate':40.0},
        {'id':2002,'name':'Nasi Goreng Spesial', 'calories':630,'proteins':15.0,'fat':22.0,'carbohydrate':85.0},
        {'id':2003,'name':'Sate Padang',         'calories':420,'proteins':20.0,'fat':18.0,'carbohydrate':45.0},
        {'id':2004,'name':'Mie Ayam Bakso',      'calories':480,'proteins':18.0,'fat':15.0,'carbohydrate':70.0},
        {'id':2005,'name':'Nasi Padang',         'calories':710,'proteins':28.0,'fat':35.0,'carbohydrate':78.0},
        {'id':2006,'name':'Gado-Gado',           'calories':310,'proteins':12.0,'fat':16.0,'carbohydrate':32.0},
        {'id':2007,'name':'Soto Betawi',         'calories':390,'proteins':22.0,'fat':20.0,'carbohydrate':28.0},
        {'id':2008,'name':'Bubur Ayam',          'calories':240,'proteins':14.0,'fat': 8.0,'carbohydrate':35.0},
        {'id':2009,'name':'Salad Sayur Segar',   'calories': 90,'proteins': 4.0,'fat': 3.0,'carbohydrate':12.0},
        {'id':2010,'name':'Tempe Orek',          'calories':180,'proteins':11.0,'fat': 9.0,'carbohydrate':15.0},
    ])

    # Pastikan kolom numerik
    for col in ['calories','proteins','fat','carbohydrate']:
        df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)

    df = pd.concat([df, makanan_lokal], ignore_index=True)
    df.drop_duplicates(subset=['name'], keep='last', inplace=True)
    df['name'] = df['name'].str.strip()
    for col in ['calories','proteins','fat','carbohydrate']:
        df[col] = df[col].clip(lower=0)

    # ── Health risk label ─────────────────────────────────────────────
    def health_risk(row):
        labels = []
        if row['calories'] > 600:       labels.append("Sangat Tinggi Kalori")
        if row['fat'] > 25:             labels.append("Tinggi Lemak")
        if row['carbohydrate'] > 75:    labels.append("Tinggi Karbo")
        return ", ".join(labels) if labels else "Normal"

    df['health_risk'] = df.apply(health_risk, axis=1)

    # ── Diagnosa penyakit ─────────────────────────────────────────────
    def diagnosa(row):
        d = []
        if row['calories'] > 600:                            d.append("Obesitas Visceral")
        if row['fat'] > 25:                                  d.append("Hipertensi & Kolesterol")
        if row['carbohydrate'] > 75:                         d.append("Diabetes Melitus Tipe 2")
        if row['fat'] > 20 and row['carbohydrate'] > 60:    d.append("NAFLD (Perlemakan Hati)")
        if row['proteins'] > 35:                             d.append("Hiperurisemia (Asam Urat)")
        return " & ".join(list(set(d))) if d else "Resiko Rendah"

    df['diagnosis_penyakit'] = df.apply(diagnosa, axis=1)
    df['action_plan'] = df['diagnosis_penyakit'].apply(
        lambda x: "⚠️ Cari Alternatif" if x != "Resiko Rendah" else "✅ Aman")

    # ── Simple Calorie-based Clustering (tanpa sklearn) ──────────────
    cal_33 = df['calories'].quantile(0.33)
    cal_66 = df['calories'].quantile(0.66)
    def cluster_label(cal):
        if cal <= cal_33:   return "🟢 Ringan"
        elif cal <= cal_66: return "🟡 Sedang"
        else:               return "🔴 Berat"
    df['Cluster_Label'] = df['calories'].apply(cluster_label)
    df['Cluster'] = df['Cluster_Label'].map({"🟢 Ringan": 0, "🟡 Sedang": 1, "🔴 Berat": 2})

    return df


# ──────────────────────────────────────────────
# LOAD DATA
# ──────────────────────────────────────────────
df = load_data()


# ──────────────────────────────────────────────
# SIDEBAR
# ──────────────────────────────────────────────
with st.sidebar:
    st.markdown("## 🥗 EatWise")
    st.markdown("**Sistem Analisis Nutrisi Cerdas**")
    st.divider()

    halaman = st.radio(
        "📌 Navigasi",
        ["🏠 Overview", "📊 EDA & Visualisasi", "📅 Pola Konsumsi 7 Hari",
         "💡 Rekomendasi Sehat", "🔬 Analisis Lanjutan", "🗄️ Dataset"],
        index=0
    )

    st.divider()
    st.markdown("**⚙️ Filter Data**")

    target_kalori = st.slider("Target Kalori Harian (kcal)", 1500, 3000, 2000, 50)
    risk_filter = st.multiselect(
        "Filter Risiko Kesehatan",
        options=df['health_risk'].unique().tolist(),
        default=df['health_risk'].unique().tolist()
    )

    st.divider()
    st.markdown("**📋 Info Dataset**")
    st.info(f"Total makanan: **{len(df)}**\nKolom: **{len(df.columns)}**")


# Filter berdasarkan sidebar
df_filtered = df[df['health_risk'].isin(risk_filter)]


# ──────────────────────────────────────────────
# HELPER
# ──────────────────────────────────────────────
def kpi_card(value, label, prefix="", suffix=""):
    return f"""
    <div class="metric-card">
        <div class="value">{prefix}{value}{suffix}</div>
        <div class="label">{label}</div>
    </div>"""

def section(title):
    st.markdown(f'<div class="section-title">{title}</div>', unsafe_allow_html=True)


# ══════════════════════════════════════════════
# HALAMAN 1: OVERVIEW
# ══════════════════════════════════════════════
if halaman == "🏠 Overview":
    st.markdown("""
    <div class="main-header">
        <h1>🥗 EatWise Dashboard</h1>
        <p>Capstone Project · Sistem Identifikasi Pola Konsumsi & Rekomendasi Nutrisi</p>
    </div>
    """, unsafe_allow_html=True)

    # KPI Row
    c1, c2, c3, c4 = st.columns(4)
    berisiko = len(df[df['diagnosis_penyakit'] != 'Resiko Rendah'])
    pct_risk  = f"{berisiko/len(df)*100:.0f}%"
    avg_cal   = int(df['calories'].mean())
    top_cal   = int(df['calories'].max())

    with c1: st.markdown(kpi_card(len(df), "Total Jenis Makanan"), unsafe_allow_html=True)
    with c2: st.markdown(kpi_card(avg_cal, "Rata-rata Kalori", suffix=" kcal"), unsafe_allow_html=True)
    with c3: st.markdown(kpi_card(berisiko, "Makanan Berisiko"), unsafe_allow_html=True)
    with c4: st.markdown(kpi_card(pct_risk, "Persentase Berisiko"), unsafe_allow_html=True)

    st.markdown("<br>", unsafe_allow_html=True)

    # Dua kolom: pie chart + bar chart
    section("📊 Distribusi Risiko Kesehatan")
    col_a, col_b = st.columns(2)

    with col_a:
        risk_dist = df_filtered['health_risk'].value_counts().reset_index()
        risk_dist.columns = ['Kategori','Jumlah']
        fig_pie = px.pie(risk_dist, values='Jumlah', names='Kategori',
                         color_discrete_sequence=px.colors.qualitative.Safe,
                         hole=0.4, title="Proporsi Kategori Risiko")
        fig_pie.update_layout(paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)')
        st.plotly_chart(fig_pie, use_container_width=True)

    with col_b:
        fig_bar = px.bar(risk_dist.sort_values('Jumlah'), x='Jumlah', y='Kategori',
                         orientation='h', color='Jumlah',
                         color_continuous_scale='RdYlGn_r',
                         title="Jumlah Makanan per Kategori Risiko")
        fig_bar.update_layout(paper_bgcolor='rgba(0,0,0,0)', showlegend=False,
                               yaxis_title=None, xaxis_title="Jumlah Makanan")
        st.plotly_chart(fig_bar, use_container_width=True)

    # Top 10 makanan paling tinggi kalori
    section("🚨 Top 10 Makanan Tertinggi Kalori (Danger Zone)")
    top10 = df.nlargest(10, 'calories')[['name','calories','fat','carbohydrate','diagnosis_penyakit']]
    fig_top = px.bar(top10, x='calories', y='name', orientation='h',
                     color='calories', color_continuous_scale='Reds',
                     hover_data=['fat','carbohydrate','diagnosis_penyakit'],
                     labels={'calories':'Kalori (kcal)','name':'Makanan'})
    fig_top.update_layout(paper_bgcolor='rgba(0,0,0,0)', yaxis={'categoryorder':'total ascending'})
    st.plotly_chart(fig_top, use_container_width=True)

    # Pertanyaan riset
    section("❓ Pertanyaan Riset")
    q1, q2 = st.columns(2)
    with q1:
        st.info("**Pertanyaan 1**\nBagaimana EatWise mengidentifikasi pola konsumsi yang menyebabkan pengguna melebihi 30% kebutuhan kalori atau lemak harian dalam 7 hari?")
    with q2:
        st.success("**Pertanyaan 2**\nBagaimana EatWise merekomendasikan alternatif makanan dengan kandungan kalori, gula, atau lemak minimal 20% lebih rendah?")


# ══════════════════════════════════════════════
# HALAMAN 2: EDA & VISUALISASI
# ══════════════════════════════════════════════
elif halaman == "📊 EDA & Visualisasi":
    st.markdown('<div class="main-header"><h1>📊 EDA & Visualisasi</h1><p>Eksplorasi distribusi nutrisi pada dataset EatWise</p></div>', unsafe_allow_html=True)

    # Statistik deskriptif
    section("📋 Statistik Deskriptif")
    st.dataframe(df_filtered[['calories','proteins','fat','carbohydrate']].describe().round(2),
                 use_container_width=True)

    # Distribusi kalori
    section("📈 Distribusi Kalori")
    fig_hist = px.histogram(df_filtered, x='calories', nbins=40,
                            color_discrete_sequence=['#66bb6a'],
                            title="Distribusi Kalori Makanan",
                            labels={'calories':'Kalori (kcal)','count':'Jumlah Makanan'})
    fig_hist.add_vline(x=target_kalori*0.3, line_dash="dash", line_color="orange",
                       annotation_text="30% Target Harian")
    fig_hist.add_vline(x=target_kalori*0.4, line_dash="dot", line_color="red",
                       annotation_text="40% Target (Danger)")
    fig_hist.update_layout(paper_bgcolor='rgba(0,0,0,0)')
    st.plotly_chart(fig_hist, use_container_width=True)

    # Scatter Fat vs Calories
    col1, col2 = st.columns(2)
    with col1:
        section("🔵 Lemak vs Kalori")
        fig_sc = px.scatter(df_filtered, x='fat', y='calories',
                            color='health_risk', size='carbohydrate',
                            hover_name='name',
                            color_discrete_sequence=px.colors.qualitative.Safe,
                            labels={'fat':'Lemak (g)','calories':'Kalori (kcal)'})
        fig_sc.update_layout(paper_bgcolor='rgba(0,0,0,0)')
        st.plotly_chart(fig_sc, use_container_width=True)

    with col2:
        section("🟠 Karbo vs Protein")
        fig_sc2 = px.scatter(df_filtered, x='carbohydrate', y='proteins',
                             color='health_risk', size='calories',
                             hover_name='name',
                             color_discrete_sequence=px.colors.qualitative.Safe,
                             labels={'carbohydrate':'Karbohidrat (g)','proteins':'Protein (g)'})
        fig_sc2.update_layout(paper_bgcolor='rgba(0,0,0,0)')
        st.plotly_chart(fig_sc2, use_container_width=True)

    # Box plot tiap nutrisi
    section("📦 Box Plot Distribusi Nutrisi")
    nutrisi_choice = st.selectbox("Pilih Nutrisi:", ['calories','proteins','fat','carbohydrate'])
    fig_box = px.box(df_filtered, x='health_risk', y=nutrisi_choice,
                     color='health_risk', points='outliers',
                     color_discrete_sequence=px.colors.qualitative.Safe,
                     labels={nutrisi_choice: nutrisi_choice.capitalize(),'health_risk':'Kategori Risiko'})
    fig_box.update_layout(paper_bgcolor='rgba(0,0,0,0)', showlegend=False)
    st.plotly_chart(fig_box, use_container_width=True)

    # Diagnosis penyakit
    section("🏥 Distribusi Diagnosis Penyakit")
    diag_dist = df_filtered['diagnosis_penyakit'].value_counts().reset_index()
    diag_dist.columns = ['Diagnosis','Jumlah']
    fig_diag = px.treemap(diag_dist, path=['Diagnosis'], values='Jumlah',
                          color='Jumlah', color_continuous_scale='RdYlGn_r')
    fig_diag.update_layout(paper_bgcolor='rgba(0,0,0,0)')
    st.plotly_chart(fig_diag, use_container_width=True)


# ══════════════════════════════════════════════
# HALAMAN 3: POLA KONSUMSI 7 HARI
# ══════════════════════════════════════════════
elif halaman == "📅 Pola Konsumsi 7 Hari":
    st.markdown('<div class="main-header"><h1>📅 Pola Konsumsi 7 Hari</h1><p>Identifikasi hari-hari yang melebihi batas aman kalori harian</p></div>', unsafe_allow_html=True)

    section("✏️ Masukkan Data Konsumsi Mingguan")
    days = ['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu']
    default_vals = [1850, 2450, 1900, 2700, 2100, 2900, 1750]

    cols = st.columns(7)
    kalori_input = []
    for i, (col, day, val) in enumerate(zip(cols, days, default_vals)):
        with col:
            k = st.number_input(day, min_value=0, max_value=5000, value=val, step=50, key=f"day_{i}")
            kalori_input.append(k)

    df_week = pd.DataFrame({'Hari': days, 'Total_Kalori': kalori_input})
    batas = target_kalori * 1.3

    # Status tiap hari
    df_week['Status'] = df_week['Total_Kalori'].apply(
        lambda x: "🔴 Danger" if x > batas else ("🟡 Waspada" if x > target_kalori else "🟢 Aman"))
    df_week['Pct_Target'] = (df_week['Total_Kalori'] / target_kalori * 100).round(1)

    # Line chart
    section("📈 Tren Kalori Mingguan")
    fig_line = go.Figure()
    fig_line.add_trace(go.Scatter(
        x=df_week['Hari'], y=df_week['Total_Kalori'],
        mode='lines+markers+text',
        text=[f"{v:,}" for v in df_week['Total_Kalori']],
        textposition='top center',
        line=dict(color='#2196F3', width=3),
        marker=dict(size=10, color=df_week['Total_Kalori'],
                    colorscale='RdYlGn_r', showscale=False),
        name='Asupan Kalori'
    ))
    fig_line.add_hline(y=target_kalori, line_dash='dash', line_color='#4CAF50',
                       annotation_text=f"Target ({target_kalori} kcal)", annotation_position="top right")
    fig_line.add_hline(y=batas, line_dash='dot', line_color='#F44336',
                       annotation_text=f"Danger Zone ({batas:.0f} kcal)", annotation_position="top right")
    fig_line.add_hrect(y0=batas, y1=max(df_week['Total_Kalori'])+300,
                       fillcolor='rgba(244,67,54,0.07)', line_width=0)
    fig_line.update_layout(
        paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)',
        yaxis_title='Kalori (kcal)', xaxis_title=None,
        yaxis=dict(gridcolor='rgba(0,0,0,0.05)'),
        height=420
    )
    st.plotly_chart(fig_line, use_container_width=True)

    # Ringkasan tabel + bar
    col_l, col_r = st.columns([2,1])
    with col_l:
        section("📊 Detail Per Hari")
        fig_bar2 = px.bar(df_week, x='Hari', y='Total_Kalori',
                          color='Status',
                          color_discrete_map={'🟢 Aman':'#4CAF50','🟡 Waspada':'#FFC107','🔴 Danger':'#F44336'},
                          text='Pct_Target',
                          labels={'Total_Kalori':'Kalori (kcal)'},
                          title="Persentase vs Target Harian")
        fig_bar2.update_traces(texttemplate='%{text}%', textposition='outside')
        fig_bar2.add_hline(y=target_kalori, line_dash='dash', line_color='green')
        fig_bar2.update_layout(paper_bgcolor='rgba(0,0,0,0)', showlegend=True)
        st.plotly_chart(fig_bar2, use_container_width=True)

    with col_r:
        section("📋 Status Harian")
        st.dataframe(df_week[['Hari','Total_Kalori','Pct_Target','Status']],
                     use_container_width=True, hide_index=True)

        total = sum(kalori_input)
        rata  = total // 7
        over_days = df_week[df_week['Total_Kalori'] > batas]['Hari'].tolist()

        st.markdown("---")
        st.metric("Total Minggu", f"{total:,} kcal")
        st.metric("Rata-rata/hari", f"{rata:,} kcal",
                  delta=f"{rata - target_kalori:+,} dari target")

        if over_days:
            st.markdown(f'<div class="alert-danger">⚠️ Hari melampaui danger zone: <br><b>{", ".join(over_days)}</b></div>', unsafe_allow_html=True)
        else:
            st.markdown('<div class="alert-safe">✅ Semua hari dalam batas aman!</div>', unsafe_allow_html=True)

    # Insight otomatis
    section("🔍 Insight Otomatis EatWise")
    ic1, ic2, ic3 = st.columns(3)
    with ic1:
        days_danger = len(df_week[df_week['Total_Kalori'] > batas])
        st.metric("Hari di Danger Zone", f"{days_danger}/7",
                  delta="⚠️ Perlu perhatian" if days_danger > 0 else "✅ Bagus")
    with ic2:
        max_day = df_week.loc[df_week['Total_Kalori'].idxmax()]
        st.metric("Hari Tertinggi", max_day['Hari'], delta=f"{int(max_day['Total_Kalori'])} kcal")
    with ic3:
        min_day = df_week.loc[df_week['Total_Kalori'].idxmin()]
        st.metric("Hari Terendah", min_day['Hari'], delta=f"{int(min_day['Total_Kalori'])} kcal")


# ══════════════════════════════════════════════
# HALAMAN 4: REKOMENDASI SEHAT
# ══════════════════════════════════════════════
elif halaman == "💡 Rekomendasi Sehat":
    st.markdown('<div class="main-header"><h1>💡 Rekomendasi Alternatif Sehat</h1><p>Temukan makanan pengganti dengan kalori minimal 20% lebih rendah</p></div>', unsafe_allow_html=True)

    section("🔎 Cari Makanan & Dapatkan Rekomendasi")
    col_search, col_opts = st.columns([2,1])

    with col_search:
        food_list = sorted(df['name'].tolist())
        selected_food = st.selectbox("Pilih atau ketik nama makanan:", food_list)

    with col_opts:
        reduction_pct = st.slider("Target pengurangan kalori (%)", 10, 50, 20, 5)
        top_n = st.slider("Tampilkan top N rekomendasi", 3, 10, 5)

    # ── Helper: gambar makanan ────────────────────────────────────────
    def get_food_image(food_name, row=None):
        """Return URL gambar jika tersedia di data, else None."""
        if row is not None and 'image' in row.index:
            val = row.get('image', None)
            if val and str(val).startswith('http'):
                return str(val)
        return None

    def food_card_html(name, cal, protein, fat, carbo, diagnosis, img_url, is_selected=False):
        border = "3px solid #F44336" if is_selected else "2px solid #4CAF50"
        tag = ('<span style="background:#ffebee;color:#c62828;padding:2px 8px;border-radius:12px;' +
               'font-size:0.75rem;font-weight:700;">DIPILIH</span>') if is_selected else (
              '<span style="background:#e8f5e9;color:#2e7d32;padding:2px 8px;border-radius:12px;' +
               'font-size:0.75rem;font-weight:700;">✓ ALTERNATIF</span>')
        diag_short = (diagnosis[:40] + "…") if len(diagnosis) > 40 else diagnosis
        placeholder_color = "#ffebee" if is_selected else "#e8f5e9"
        no_img_html = (
            f'<div style="width:100%;height:160px;background:{placeholder_color};display:none;'
            f'flex-direction:column;align-items:center;justify-content:center;gap:6px;">'
            f'<span style="font-size:2.8rem;">🍽️</span>'
            f'<span style="font-size:0.75rem;color:#888;font-weight:500;">Foto tidak tersedia</span>'
            f'</div>'
        )
        fallback_div = no_img_html.replace("display:none", "display:flex")
        img_html = (
            f'<img src="{img_url}" style="width:100%;height:160px;object-fit:cover;" '
            f'onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\';" />'
            + no_img_html
            if img_url else fallback_div
        )
        return f"""
        <div style="background:white;border-radius:14px;overflow:hidden;border:{border};
                    box-shadow:0 3px 14px rgba(0,0,0,0.09);margin-bottom:4px;">
            {img_html}
            <div style="padding:12px 14px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                    <b style="font-size:0.92rem;color:#1b5e20;">{name}</b>
                    {tag}
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-bottom:8px;">
                    <div style="background:#fff8e1;border-radius:8px;padding:5px 8px;text-align:center;">
                        <div style="font-size:1.1rem;font-weight:700;color:#f57f17;">{cal:.0f}</div>
                        <div style="font-size:0.7rem;color:#888;">kcal</div>
                    </div>
                    <div style="background:#e3f2fd;border-radius:8px;padding:5px 8px;text-align:center;">
                        <div style="font-size:1.1rem;font-weight:700;color:#1565c0;">{protein:.1f}g</div>
                        <div style="font-size:0.7rem;color:#888;">protein</div>
                    </div>
                    <div style="background:#fce4ec;border-radius:8px;padding:5px 8px;text-align:center;">
                        <div style="font-size:1.1rem;font-weight:700;color:#c62828;">{fat:.1f}g</div>
                        <div style="font-size:0.7rem;color:#888;">lemak</div>
                    </div>
                    <div style="background:#f3e5f5;border-radius:8px;padding:5px 8px;text-align:center;">
                        <div style="font-size:1.1rem;font-weight:700;color:#6a1b9a;">{carbo:.1f}g</div>
                        <div style="font-size:0.7rem;color:#888;">karbo</div>
                    </div>
                </div>
                <div style="background:#f5f5f5;border-radius:8px;padding:5px 8px;font-size:0.72rem;color:#555;">
                    ⚕️ {diag_short}
                </div>
            </div>
        </div>"""

    if selected_food:
        target_row = df[df['name'] == selected_food].iloc[0]
        threshold  = target_row['calories'] * (1 - reduction_pct / 100)

        # ── Info makanan dipilih + gambar ─────────────────────────────
        section(f"📌 Informasi Nutrisi: {selected_food}")
        img_col, info_col = st.columns([1, 3])
        with img_col:
            img_sel = get_food_image(selected_food, target_row)
            placeholder_sel = (
                '<div style="width:100%;height:210px;background:#ffebee;display:none;'
                'flex-direction:column;align-items:center;justify-content:center;gap:8px;">'
                '<span style="font-size:3.5rem;">🍽️</span>'
                '<span style="font-size:0.8rem;color:#999;font-weight:500;">Foto tidak tersedia</span>'
                '</div>'
            )
            if img_sel:
                inner_img = (
                    f'<img src="{img_sel}" style="width:100%;height:210px;object-fit:cover;" '
                    f'onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\';" />'
                    + placeholder_sel
                )
            else:
                inner_img = placeholder_sel.replace('display:none', 'display:flex')
            st.markdown(
                f'<div style="border-radius:14px;overflow:hidden;border:3px solid #F44336;'
                f'box-shadow:0 3px 16px rgba(244,67,54,0.2);">'
                f'{inner_img}</div>',
                unsafe_allow_html=True)

        with info_col:
            m1, m2, m3, m4 = st.columns(4)
            m1.metric("🔥 Kalori",      f"{target_row['calories']:.0f} kcal")
            m2.metric("🥩 Protein",     f"{target_row['proteins']:.1f} g")
            m3.metric("🧈 Lemak",       f"{target_row['fat']:.1f} g")
            m4.metric("🍚 Karbohidrat", f"{target_row['carbohydrate']:.1f} g")
            if target_row['diagnosis_penyakit'] != 'Resiko Rendah':
                st.markdown(f'<div class="alert-danger">⚠️ Berisiko: <b>{target_row["diagnosis_penyakit"]}</b></div>',
                            unsafe_allow_html=True)
            else:
                st.markdown('<div class="alert-safe">✅ Makanan ini termasuk kategori aman.</div>',
                            unsafe_allow_html=True)

        # ── Rekomendasi ───────────────────────────────────────────────
        section(f"💡 Rekomendasi Alternatif (≤ {threshold:.0f} kcal | -{reduction_pct}%)")
        alternatives = df[
            (df['calories'] <= threshold) &
            (df['name'] != selected_food)
        ].sort_values('calories', ascending=False).head(top_n)

        if alternatives.empty:
            st.warning("😔 Tidak ditemukan alternatif yang cocok. Coba perbesar persentase pengurangan.")
        else:
            # ── Kartu bergambar ───────────────────────────────────────
            all_items = [{"row": target_row, "is_selected": True}] +                         [{"row": r, "is_selected": False} for _, r in alternatives.iterrows()]
            max_cols = 3
            for i in range(0, len(all_items), max_cols):
                batch = all_items[i:i+max_cols]
                cols  = st.columns(len(batch))
                for col, item in zip(cols, batch):
                    r = item["row"]
                    col.markdown(
                        food_card_html(
                            r['name'], r['calories'], r['proteins'],
                            r['fat'], r['carbohydrate'], r['diagnosis_penyakit'],
                            get_food_image(r['name'], r),
                            is_selected=item["is_selected"]
                        ),
                        unsafe_allow_html=True
                    )
                st.markdown("<br>", unsafe_allow_html=True)

            # ── Bar chart perbandingan ─────────────────────────────────
            compare_df = pd.concat([
                pd.DataFrame({'Makanan': [selected_food], 'Kalori': [target_row['calories']], 'Tipe': ['Dipilih']}),
                pd.DataFrame({'Makanan': alternatives['name'].values,
                              'Kalori': alternatives['calories'].values,
                              'Tipe': ['Alternatif']*len(alternatives)})
            ])
            fig_cmp = px.bar(compare_df, x='Makanan', y='Kalori',
                             color='Tipe',
                             color_discrete_map={'Dipilih':'#F44336','Alternatif':'#4CAF50'},
                             title=f"Perbandingan Kalori: {selected_food} vs Alternatif",
                             text='Kalori')
            fig_cmp.update_traces(texttemplate='%{text:.0f}', textposition='outside')
            fig_cmp.add_hline(y=threshold, line_dash='dash', line_color='orange',
                              annotation_text=f"Batas -{reduction_pct}%")
            fig_cmp.update_layout(paper_bgcolor='rgba(0,0,0,0)', xaxis_tickangle=-30)
            st.plotly_chart(fig_cmp, use_container_width=True)

            # ── Penghematan kalori ────────────────────────────────────
            section("💰 Estimasi Penghematan Kalori")
            best_alt = alternatives.iloc[0]
            saving   = target_row['calories'] - best_alt['calories']
            weekly   = saving * 7
            monthly  = saving * 30
            sc1, sc2, sc3 = st.columns(3)
            sc1.metric("Hemat per Porsi",  f"{saving:.0f} kcal", delta=f"-{saving/target_row['calories']*100:.0f}%")
            sc2.metric("Hemat per Minggu", f"{weekly:.0f} kcal")
            sc3.metric("Hemat per Bulan",  f"{monthly:.0f} kcal")


# ══════════════════════════════════════════════
# HALAMAN 5: ANALISIS LANJUTAN
# ══════════════════════════════════════════════
elif halaman == "🔬 Analisis Lanjutan":
    st.markdown('<div class="main-header"><h1>🔬 Analisis Lanjutan</h1><p>Korelasi Nutrisi & K-Means Clustering Makanan</p></div>', unsafe_allow_html=True)

    # Heatmap Korelasi
    section("🌡️ Heatmap Korelasi Nutrisi")
    corr = df_filtered[['calories','proteins','fat','carbohydrate']].corr()
    fig_heat = go.Figure(go.Heatmap(
        z=corr.values.round(2),
        x=corr.columns, y=corr.columns,
        colorscale='RdBu', zmid=0,
        text=corr.values.round(2), texttemplate="%{text}",
        showscale=True
    ))
    fig_heat.update_layout(title="Korelasi Antar Kolom Nutrisi",
                           paper_bgcolor='rgba(0,0,0,0)', height=400)
    st.plotly_chart(fig_heat, use_container_width=True)

    st.info("💡 Angka mendekati **1.0** = korelasi positif kuat. Mendekati **-1.0** = korelasi negatif kuat. Mendekati **0** = tidak berkorelasi.")

    # K-Means Clustering
    section("🤖 K-Means Clustering Makanan")
    col_x, col_y = st.columns(2)
    with col_x:
        axis_x = st.selectbox("Sumbu X", ['fat','calories','carbohydrate','proteins'], index=0)
    with col_y:
        axis_y = st.selectbox("Sumbu Y", ['calories','fat','carbohydrate','proteins'], index=0)

    fig_cluster = px.scatter(
        df_filtered, x=axis_x, y=axis_y,
        color='Cluster_Label', hover_name='name',
        symbol='Cluster_Label', size='calories',
        color_discrete_map={'🟢 Ringan':'#4CAF50','🟡 Sedang':'#FFC107','🔴 Berat':'#F44336'},
        labels={axis_x: axis_x.capitalize(), axis_y: axis_y.capitalize()},
        title="Pengelompokan Makanan (K-Means Clustering)"
    )
    fig_cluster.update_layout(paper_bgcolor='rgba(0,0,0,0)', height=480)
    st.plotly_chart(fig_cluster, use_container_width=True)

    # Rata-rata per cluster
    section("📋 Rata-rata Nutrisi per Cluster")
    cluster_mean = df_filtered.groupby('Cluster_Label')[['calories','proteins','fat','carbohydrate']].mean().round(1)
    st.dataframe(cluster_mean, use_container_width=True)

    # Radar chart per cluster
    section("🕸️ Radar Chart Profil Nutrisi per Cluster")
    categories = ['calories','proteins','fat','carbohydrate']
    fig_radar = go.Figure()
    colors_map = {'🟢 Ringan':'green','🟡 Sedang':'orange','🔴 Berat':'red'}
    for label, row in cluster_mean.iterrows():
        vals = row[categories].tolist()
        vals_norm = [v / cluster_mean[c].max() for v, c in zip(vals, categories)]
        vals_norm += [vals_norm[0]]
        fig_radar.add_trace(go.Scatterpolar(
            r=vals_norm,
            theta=categories + [categories[0]],
            fill='toself',
            name=label,
            line_color=colors_map.get(label, 'blue'),
            opacity=0.6
        ))
    fig_radar.update_layout(polar=dict(radialaxis=dict(visible=True, range=[0,1])),
                            paper_bgcolor='rgba(0,0,0,0)', height=420)
    st.plotly_chart(fig_radar, use_container_width=True)

    # Diagnosis sunburst
    section("☀️ Sunburst Risiko Kesehatan vs Cluster")
    fig_sun = px.sunburst(df_filtered, path=['Cluster_Label','health_risk'],
                          color='Cluster_Label',
                          color_discrete_map={'🟢 Ringan':'#4CAF50','🟡 Sedang':'#FFC107','🔴 Berat':'#F44336'})
    fig_sun.update_layout(paper_bgcolor='rgba(0,0,0,0)', height=480)
    st.plotly_chart(fig_sun, use_container_width=True)


# ══════════════════════════════════════════════
# HALAMAN 6: DATASET
# ══════════════════════════════════════════════
elif halaman == "🗄️ Dataset":
    st.markdown('<div class="main-header"><h1>🗄️ Dataset EatWise</h1><p>Jelajahi dan filter seluruh data makanan</p></div>', unsafe_allow_html=True)

    section("🔍 Filter & Eksplorasi Data")
    col_f1, col_f2, col_f3 = st.columns(3)
    with col_f1:
        cal_range = st.slider("Rentang Kalori (kcal)", 0, int(df['calories'].max()), (0, int(df['calories'].max())))
    with col_f2:
        fat_range = st.slider("Rentang Lemak (g)", 0.0, float(df['fat'].max()), (0.0, float(df['fat'].max())))
    with col_f3:
        search_name = st.text_input("Cari nama makanan:", "")

    df_view = df[
        (df['calories'].between(*cal_range)) &
        (df['fat'].between(*fat_range))
    ]
    if search_name:
        df_view = df_view[df_view['name'].str.contains(search_name, case=False)]

    st.success(f"Menampilkan **{len(df_view)}** dari **{len(df)}** makanan")

    show_cols = ['name','calories','proteins','fat','carbohydrate','health_risk','diagnosis_penyakit','action_plan','Cluster_Label']
    st.dataframe(df_view[show_cols].rename(columns={
        'name':'Makanan','calories':'Kalori','proteins':'Protein',
        'fat':'Lemak','carbohydrate':'Karbo','health_risk':'Risiko',
        'diagnosis_penyakit':'Diagnosis','action_plan':'Action','Cluster_Label':'Cluster'
    }), use_container_width=True, hide_index=True, height=480)

    # Download
    section("⬇️ Download Data")
    csv_data = df_view[show_cols].to_csv(index=False).encode('utf-8')
    st.download_button(
        label="📥 Download CSV (data yang difilter)",
        data=csv_data,
        file_name='eatwise_filtered.csv',
        mime='text/csv'
    )


# ──────────────────────────────────────────────
# FOOTER
# ──────────────────────────────────────────────
st.markdown("---")
st.markdown("""
<div style="text-align:center; color:#888; font-size:0.85rem; padding:0.5rem">
    🥗 <b>EatWise Dashboard</b> · Capstone Project · Built with Streamlit + Plotly<br>
    Sistem Identifikasi Pola Konsumsi & Rekomendasi Nutrisi Sehat
</div>
""", unsafe_allow_html=True)
