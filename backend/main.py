import pickle
import pandas as pd
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import Literal

# IMPORT BARU UNTUK CORS
from fastapi.middleware.cors import CORSMiddleware

# === PATH KONFIGURASI (Sesuaikan jika struktur foldermu berbeda) ===
MODELS_DIR = "models"
SCALER_PATH = f"{MODELS_DIR}/heart_disease_scaler.pkl"

# --- PERUBAHAN 1: DEFINISIKAN SEMUA MODEL YANG AKAN DIMUAT ---
# Kita akan memuat semua model yang sudah dioptimasi ke dalam sebuah dictionary
MODELS_TO_LOAD = {
    "logistic_regression": f"{MODELS_DIR}/lr_model_optimized.pkl",
    "xgboost": f"{MODELS_DIR}/xgb_model_optimized.pkl",
    "random_forest": f"{MODELS_DIR}/rf_model_optimized.pkl", # Bonus: RF juga dimuat
    "svc": f"{MODELS_DIR}/svc_model_optimized.pkl" # Bonus: SVC juga dimuat
}

# === INISIALISASI APLIKASI FastAPI ===
app = FastAPI(
    title="API Prediksi Penyakit Jantung (Multi-Model)",
    description="API untuk memprediksi risiko penyakit jantung menggunakan beberapa model machine learning.",
    version="1.2.0"
)

# --- KONFIGURASI CORS ---
origins = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === MUAT SEMUA MODEL DAN SCALER SAAT APLIKASI DIMULAI ===
# --- PERUBAHAN 2: Ganti 'model' menjadi dictionary 'loaded_models' ---
loaded_models = {}

print("Memuat model dan scaler...")
try:
    # Muat scaler (hanya satu)
    with open(SCALER_PATH, 'rb') as f_scaler:
        scaler = pickle.load(f_scaler)
    print(f"Scaler berhasil dimuat dari: {SCALER_PATH}")

    # Muat semua model dalam perulangan
    for name, path in MODELS_TO_LOAD.items():
        try:
            with open(path, 'rb') as f_model:
                loaded_models[name] = pickle.load(f_model)
            print(f"Model '{name}' berhasil dimuat dari: {path}")
        except FileNotFoundError:
            print(f"WARNING: File model untuk '{name}' tidak ditemukan di '{path}'. Model ini akan dilewati.")
            continue

    if not loaded_models:
        raise RuntimeError("Tidak ada model yang berhasil dimuat. Hentikan aplikasi.")

except Exception as e:
    print(f"FATAL ERROR saat setup awal: {e}")
    scaler = None
    loaded_models = {}

# === DEFINISIKAN MODEL INPUT (REQUEST BODY) - TANPA PERUBAHAN ===
class HeartDiseaseInput(BaseModel):
    age: int = Field(..., example=52, description="Umur pasien (tahun)")
    sex: Literal['Male', 'Female'] = Field(..., example='Male', description="Jenis kelamin pasien")
    cp: Literal['typical angina', 'atypical angina', 'non-anginal', 'asymptomatic'] = Field(..., example='asymptomatic', description="Tipe nyeri dada")
    trestbps: float = Field(..., example=120, description="Tekanan darah istirahat (mm Hg)")
    chol: float = Field(..., example=215, description="Kolesterol serum (mg/dl)")
    fbs: bool = Field(..., example=False, description="Gula darah puasa > 120 mg/dl (True/False)")
    restecg: Literal['normal', 'st-t abnormality', 'lv hypertrophy'] = Field(..., example='normal', description="Hasil elektrokardiografi istirahat")
    thalch: float = Field(..., example=150, description="Detak jantung maksimum tercapai")
    exang: bool = Field(..., example=False, description="Angina akibat olahraga (True/False)")
    oldpeak: float = Field(..., example=1.0, description="Depresi ST akibat olahraga relatif terhadap istirahat")
    slope: Literal['upsloping', 'flat', 'downsloping'] = Field(..., example='upsloping', description="Kemiringan segmen ST puncak olahraga")
    ca: float = Field(..., example=0.0, description="Jumlah pembuluh darah besar (0-3) yang diwarnai oleh fluoroskopi")
    thal: Literal['normal', 'fixed defect', 'reversable defect'] = Field(..., example='normal', description="Kelainan darah Thalassemia")

# === DAFTAR KOLOM YANG DIHARAPKAN MODEL SETELAH ENCODING - TANPA PERUBAHAN ===
EXPECTED_COLUMNS_AFTER_DUMMIES = [
    'age', 'sex', 'trestbps', 'chol', 'fbs', 'thalch', 'exang', 'oldpeak', 'ca',
    'cp_atypical angina', 'cp_non-anginal', 'cp_typical angina',
    'restecg_normal', 'restecg_st-t abnormality',
    'slope_flat', 'slope_upsloping',
    'thal_normal', 'thal_reversable defect'
]

# === ENDPOINT BARU UNTUK MENGECEK MODEL YANG TERSEDIA ===
@app.get("/", summary="Daftar Model Tersedia")
async def get_available_models():
    """
    Mengembalikan daftar nama model yang berhasil dimuat dan siap digunakan untuk prediksi.
    """
    if not loaded_models:
        raise HTTPException(status_code=503, detail="Server sedang dalam masalah, tidak ada model yang tersedia.")
    return {"available_models": list(loaded_models.keys())}


# === ENDPOINT PREDIKSI YANG DIMODIFIKASI ===
# --- PERUBAHAN 3: Tambahkan '{model_name}' pada URL ---
@app.post("/predict/{model_name}", summary="Prediksi Penyakit Jantung")
async def predict_heart_disease(model_name: str, data_input: HeartDiseaseInput):
    """
    Lakukan prediksi penyakit jantung menggunakan model yang dipilih.

    - **model_name**: Nama model yang ingin digunakan. Dapatkan daftar model yang tersedia dari endpoint `/`.
    - **Request Body**: Data pasien untuk prediksi.
    """
    # Validasi apakah model dan scaler sudah siap
    if not loaded_models or not scaler:
        raise HTTPException(status_code=503, detail="Model atau scaler tidak berhasil dimuat. Cek log server.")

    # Validasi apakah model_name yang diminta tersedia
    if model_name not in loaded_models:
        raise HTTPException(status_code=404, detail=f"Model '{model_name}' tidak ditemukan. Model yang tersedia: {list(loaded_models.keys())}")

    try:
        # --- PERUBAHAN 4: Pilih model yang sesuai dari dictionary ---
        selected_model = loaded_models[model_name]

        # 1. Ubah data input Pydantic menjadi dictionary
        input_dict = data_input.dict()

        # 2. Buat DataFrame dari input_dict
        input_df_raw = pd.DataFrame([input_dict])

        # 3. Lakukan pra-pemrosesan (SAMA PERSIS seperti saat training)
        input_df_processed = input_df_raw.copy()
        input_df_processed['sex'] = input_df_processed['sex'].map({'Male': 1, 'Female': 0})
        input_df_processed['fbs'] = input_df_processed['fbs'].astype(int)
        input_df_processed['exang'] = input_df_processed['exang'].astype(int)
        
        categorical_cols_api = ['cp', 'restecg', 'slope', 'thal']
        input_df_processed = pd.get_dummies(input_df_processed, columns=categorical_cols_api, drop_first=True)
        
        input_df_final_features = input_df_processed.reindex(columns=EXPECTED_COLUMNS_AFTER_DUMMIES, fill_value=0)
        
        scaled_features_np = scaler.transform(input_df_final_features)

        # 4. Lakukan prediksi menggunakan model yang dipilih
        prediction_proba = selected_model.predict_proba(scaled_features_np)
        prediction = selected_model.predict(scaled_features_np)

        probability_class_1 = float(prediction_proba[0][1])
        predicted_class = int(prediction[0])

        return {
            "model_used": model_name, # Tambahkan info model yang digunakan
            "prediction_label": "Risiko Penyakit Jantung" if predicted_class == 1 else "Risiko Rendah",
            "predicted_class": predicted_class,
            "probability_score_class_1": probability_class_1,
            "detail_input": input_dict
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Terjadi kesalahan saat prediksi: {str(e)}")