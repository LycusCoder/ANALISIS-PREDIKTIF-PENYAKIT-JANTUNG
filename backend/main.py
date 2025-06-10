import pickle
import pandas as pd
import numpy as np
from fastapi import FastAPI
from pydantic import BaseModel, Field # Untuk validasi data input
from typing import Literal # Untuk tipe data literal seperti 'Male'/'Female'

# IMPORT BARU UNTUK CORS
from fastapi.middleware.cors import CORSMiddleware

# === PATH KONFIGURASI (Sesuaikan jika struktur foldermu berbeda) ===
MODELS_DIR = "models"
SCALER_PATH = f"{MODELS_DIR}/heart_disease_scaler.pkl"
MODEL_PATH = f"{MODELS_DIR}/lr_model_optimized.pkl" # Kita pakai model LR Optimized

# === INISIALISASI APLIKASI FastAPI ===
app = FastAPI(title="API Prediksi Penyakit Jantung",
              description="API untuk memprediksi risiko penyakit jantung menggunakan model Logistic Regression.",
              version="0.1.0")

# --- KODE BARU: KONFIGURASI CORS ---
# Daftar "origins" atau alamat frontend yang diizinkan untuk mengakses API ini.
origins = [
    "http://localhost:8080",  # Alamat frontend Vite lo
    "http://127.0.0.1:8080", # Variasi lain dari localhost
    # Tambahkan URL lain di sini jika frontend di-deploy ke domain lain
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # Mengizinkan origin dari daftar di atas
    allow_credentials=True,      # Mengizinkan cookies (jika ada)
    allow_methods=["*"],         # Mengizinkan semua method (GET, POST, OPTIONS, dll)
    allow_headers=["*"],         # Mengizinkan semua header
)
# --- BATAS KODE BARU ---


# === MUAT MODEL DAN SCALER SAAT APLIKASI DIMULAI ===
# Ini akan dimuat sekali saat server FastAPI pertama kali dijalankan
try:
    with open(MODEL_PATH, 'rb') as f_model:
        model = pickle.load(f_model)
    print(f"Model berhasil dimuat dari: {MODEL_PATH}")

    with open(SCALER_PATH, 'rb') as f_scaler:
        scaler = pickle.load(f_scaler)
    print(f"Scaler berhasil dimuat dari: {SCALER_PATH}")

except FileNotFoundError as e:
    print(f"Error saat memuat file model/scaler: {e}")
    print("Pastikan script train_model.py sudah dijalankan dan file .pkl ada di folder 'models'.")
    model = None
    scaler = None
except Exception as e:
    print(f"Terjadi error lain saat memuat file: {e}")
    model = None
    scaler = None

# === DEFINISIKAN MODEL INPUT (REQUEST BODY) MENGGUNAKAN PYDANTIC ===
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

    class Config:
        json_schema_extra = {
            "example": {
                "age": 63, "sex": "Male", "cp": "typical angina", "trestbps": 145.0, "chol": 233.0,
                "fbs": True, "restecg": "lv hypertrophy", "thalch": 150.0, "exang": False,
                "oldpeak": 2.3, "slope": "downsloping", "ca": 0.0, "thal": "fixed defect"
            }
        }

# === DAFTAR KOLOM YANG DIHARAPKAN MODEL SETELAH ENCODING ===
EXPECTED_COLUMNS_AFTER_DUMMIES = [
    'age', 'sex', 'trestbps', 'chol', 'fbs', 'thalch', 'exang', 'oldpeak', 'ca',
    'cp_atypical angina', 'cp_non-anginal', 'cp_typical angina',
    'restecg_normal', 'restecg_st-t abnormality',
    'slope_flat', 'slope_upsloping',
    'thal_normal', 'thal_reversable defect'
]

# === ENDPOINT PREDIKSI ===
@app.post("/predict/")
async def predict_heart_disease(data_input: HeartDiseaseInput):
    if not model or not scaler:
        return {"error": "Model atau scaler tidak berhasil dimuat. Cek log server."}

    try:
        # 1. Ubah data input Pydantic menjadi dictionary
        input_dict = data_input.dict()

        # 2. Buat DataFrame dari input_dict (hanya satu baris)
        input_df_raw = pd.DataFrame([input_dict])

        # 3. Lakukan pra-pemrosesan SAMA PERSIS seperti saat training:
        input_df_processed = input_df_raw.copy()
        input_df_processed['sex'] = input_df_processed['sex'].map({'Male': 1, 'Female': 0})
        input_df_processed['fbs'] = input_df_processed['fbs'].astype(int)
        input_df_processed['exang'] = input_df_processed['exang'].astype(int)

        categorical_cols_api = ['cp', 'restecg', 'slope', 'thal']
        input_df_processed = pd.get_dummies(input_df_processed, columns=categorical_cols_api, drop_first=True)
        
        input_df_final_features = input_df_processed.reindex(columns=EXPECTED_COLUMNS_AFTER_DUMMIES, fill_value=0)
        
        scaled_features_np = scaler.transform(input_df_final_features)

        # 4. Lakukan prediksi
        prediction_proba = model.predict_proba(scaled_features_np)
        prediction = model.predict(scaled_features_np)

        probability_class_1 = float(prediction_proba[0][1])
        predicted_class = int(prediction[0])

        return {
            "prediction_label": "Risiko Penyakit Jantung" if predicted_class == 1 else "Risiko Rendah",
            "predicted_class": predicted_class,
            "probability_score_class_1": probability_class_1,
            "detail_input": input_dict
        }

    except Exception as e:
        return {"error": f"Terjadi kesalahan saat prediksi: {str(e)}"}