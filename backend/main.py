# ====================================================================
# main.py - Backend Flask untuk Prediksi Penyakit Jantung
# ====================================================================

# 🚀 1. Import Library yang Dibutuhkan
import pandas as pd
import numpy as np
import pickle
import os
from flask import Flask, request, jsonify
from flask_cors import CORS

print("Library berhasil di-import.")

# 🧠 2. Inisialisasi Aplikasi Flask & Muat Semua Model
# Inisialisasi aplikasi
app = Flask(__name__)
# Aktifkan CORS (Cross-Origin Resource Sharing) agar bisa diakses dari frontend
CORS(app)

# Dictionary untuk menampung semua model yang kita muat
models = {}

# Fungsi untuk memuat model dari direktori tertentu
def load_models_from_dir(directory, model_type):
    if not os.path.exists(directory):
        print(f"Peringatan: Direktori '{directory}' tidak ditemukan.")
        return
    for file in os.listdir(directory):
        if file.endswith('.pkl'):
            model_name = file.replace('_optimized.pkl', '').replace('_', ' ').title()
            # Buat key yang unik, contoh: 'SVC (Non-PCA)'
            unique_key = f"{model_name} ({model_type})"
            with open(os.path.join(directory, file), 'rb') as f:
                models[unique_key] = pickle.load(f)
            print(f"✅ Model '{unique_key}' berhasil dimuat.")

# Muat semua model yang sudah dioptimasi
load_models_from_dir('models/jantung/optimize_non_pca', 'Non-PCA')
load_models_from_dir('models/jantung/optimize_pca', 'PCA')

if not models:
    print("❌ Peringatan Keras: Tidak ada model yang berhasil dimuat! Endpoint prediksi tidak akan berfungsi.")

# 📌 3. Definisikan Kolom
# Urutan kolom harus SAMA PERSIS dengan saat training
# Ini adalah kolom SEBELUM di-encode atau di-scale
COLUMN_ORDER = [
    'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 
    'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal'
]

# 📡 4. Buat Endpoint Prediksi API
@app.route('/predict', methods=['POST'])
def predict():
    """Endpoint untuk menerima data dan mengembalikan prediksi."""
    # Ambil data JSON yang dikirim dari frontend
    data = request.get_json()

    if not data:
        return jsonify({"error": "Data tidak valid"}), 400

    # Ambil pilihan model dari data input
    model_choice = data.get('model_choice')
    if model_choice not in models:
        return jsonify({"error": f"Model '{model_choice}' tidak ditemukan. Pilihan yang ada: {list(models.keys())}"}), 400
        
    try:
        # Ubah data input menjadi DataFrame Pandas
        # Pastikan urutan kolomnya benar!
        input_df = pd.DataFrame([data['patient_data']], columns=COLUMN_ORDER)
        
        # Pilih model yang sesuai
        selected_model = models[model_choice]

        # Lakukan prediksi
        prediction_result = selected_model.predict(input_df)[0]
        prediction_proba = selected_model.predict_proba(input_df)[0]

        # Format hasil
        result_label = "Berisiko Penyakit Jantung" if prediction_result == 1 else "Tidak Berisiko Penyakit Jantung"
        confidence_score = prediction_proba[1] # Probabilitas kelas 1 (sakit)

        # Kirim respons kembali ke frontend dalam format JSON
        response = {
            'model_used': model_choice,
            'prediction': int(prediction_result),
            'prediction_label': result_label,
            'confidence_score': float(confidence_score)
        }
        return jsonify(response)

    except Exception as e:
        # Tangani error jika terjadi
        return jsonify({"error": f"Terjadi error saat prediksi: {str(e)}"}), 500

# ⚡ 5. Jalankan Aplikasi Flask
if __name__ == '__main__':
    # Gunakan port 5000 dan aktifkan debug mode untuk pengembangan
    app.run(port=5000, debug=True)