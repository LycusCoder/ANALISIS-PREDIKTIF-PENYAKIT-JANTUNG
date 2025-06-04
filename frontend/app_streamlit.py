import streamlit as st
import requests
import pandas as pd
import json

# URL API FastAPI kamu (pastikan server FastAPI sudah berjalan)
API_URL = "http://127.0.0.1:8000/predict/"

st.set_page_config(page_title="Prediksi Penyakit Jantung", layout="wide")

st.title("🩺 Aplikasi Prediksi Risiko Penyakit Jantung")
st.markdown("""
Aplikasi ini menggunakan model Machine Learning (Logistic Regression Optimized)
untuk memprediksi risiko penyakit jantung berdasarkan data input pasien.
Masukkan data pasien di bawah ini untuk melihat hasil prediksi.
""")

st.sidebar.header("Input Data Pasien")

# --- Membuat Form Input di Sidebar ---
with st.sidebar.form(key="input_form"):
    age = st.number_input("Umur (tahun)", min_value=1, max_value=120, value=50, step=1)
    sex_option = st.selectbox("Jenis Kelamin", ["Male", "Female"], index=0)
    cp_option = st.selectbox("Tipe Nyeri Dada (cp)",
                             ["typical angina", "atypical angina", "non-anginal", "asymptomatic"], index=3)
    trestbps = st.number_input("Tekanan Darah Istirahat (trestbps, mm Hg)", min_value=50, max_value=250, value=120, step=1)
    chol = st.number_input("Kolesterol Serum (chol, mg/dl)", min_value=50, max_value=600, value=200, step=1)
    fbs_option = st.selectbox("Gula Darah Puasa > 120 mg/dl (fbs)", [True, False], index=1)
    restecg_option = st.selectbox("Hasil EKG Istirahat (restecg)",
                                  ["normal", "st-t abnormality", "lv hypertrophy"], index=0)
    thalch = st.number_input("Detak Jantung Maksimum (thalch)", min_value=50, max_value=220, value=150, step=1)
    exang_option = st.selectbox("Angina Akibat Olahraga (exang)", [True, False], index=1)
    oldpeak = st.number_input("Depresi ST Akibat Olahraga (oldpeak)", min_value=0.0, max_value=7.0, value=1.0, step=0.1, format="%.1f")
    slope_option = st.selectbox("Kemiringan Segmen ST (slope)",
                                ["upsloping", "flat", "downsloping"], index=0)
    ca = st.number_input("Jumlah Pembuluh Darah Besar (ca, 0-3)", min_value=0, max_value=3, value=0, step=1) # Seringkali 0-3 atau 0-4 di beberapa versi dataset. Sesuaikan.
    thal_option = st.selectbox("Kelainan Darah Thalassemia (thal)",
                               ["normal", "fixed defect", "reversable defect"], index=0)

    submit_button = st.form_submit_button(label="🔍 Prediksi Sekarang")

# --- Jika Tombol Prediksi Ditekan ---
if submit_button:
    # Kumpulkan data input menjadi format JSON yang diharapkan API
    input_data = {
        "age": age,
        "sex": sex_option,
        "cp": cp_option,
        "trestbps": trestbps,
        "chol": chol,
        "fbs": fbs_option,
        "restecg": restecg_option,
        "thalch": thalch,
        "exang": exang_option,
        "oldpeak": oldpeak,
        "slope": slope_option,
        "ca": float(ca), # Pastikan tipe datanya sesuai dengan Pydantic model di API
        "thal": thal_option
    }

    st.subheader("Data Input Pasien:")
    st.json(input_data) # Tampilkan data input untuk verifikasi

    try:
        # Kirim request ke API
        response = requests.post(API_URL, json=input_data)
        response.raise_for_status() # Akan error jika status code bukan 2xx

        result = response.json()

        st.subheader("Hasil Prediksi Model:")
        if result.get("predicted_class") == 1:
            st.error(f"Label Prediksi: **{result.get('prediction_label')}**")
        else:
            st.success(f"Label Prediksi: **{result.get('prediction_label')}**")

        st.metric(label="Kelas Prediksi (1: Risiko, 0: Rendah)", value=result.get("predicted_class"))
        st.metric(label="Skor Probabilitas Risiko Penyakit Jantung", value=f"{result.get('probability_score_class_1', 0.0):.2%}")

        # Visualisasi sederhana probabilitas
        prob = result.get('probability_score_class_1', 0.0)
        st.progress(prob)
        st.caption(f"Probabilitas {prob:.2%} model memprediksi adanya risiko penyakit jantung.")

    except requests.exceptions.ConnectionError:
        st.error("Gagal terhubung ke server API. Pastikan server FastAPI sudah berjalan.")
    except requests.exceptions.HTTPError as e:
        st.error(f"Error dari API: {e.response.status_code}")
        try:
            st.json(e.response.json())
        except json.JSONDecodeError:
            st.text(e.response.text)
    except Exception as e:
        st.error(f"Terjadi kesalahan: {e}")

st.sidebar.markdown("---")
st.sidebar.info("Aplikasi ini adalah prototipe dan tidak boleh digunakan untuk diagnosis medis sebenarnya.")