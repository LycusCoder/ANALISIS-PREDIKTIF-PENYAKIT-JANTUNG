# ====================================================================
# main.py - Backend Flask API (Final & Sinkron dengan Frontend)
# ====================================================================

# 🚀 1. Import Library
import pandas as pd
import numpy as np
import pickle
import os
from flask import Flask, request, jsonify
from flask_cors import CORS

print("Library berhasil di-import.")

# 🧠 2. Inisialisasi Aplikasi Flask
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}) 

# --- Muat Semua Model Saat Startup ---
MODELS = {}
script_dir = os.path.dirname(__file__)
# Perhatikan path ini, disesuaikan dengan struktur di mana main.py ada di root projek
MODELS_DIR = os.path.join(script_dir, 'backend/models/jantung/optimize_non_pca')

def load_models():
    if not os.path.exists(MODELS_DIR):
        print(f"ERROR: Direktori model '{MODELS_DIR}' tidak ditemukan!")
        return
    for file in sorted(os.listdir(MODELS_DIR)):
        if file.endswith('.pkl'):
            model_name = file.replace('_optimized.pkl', '').replace('_', ' ').title()
            try:
                with open(os.path.join(MODELS_DIR, file), 'rb') as f:
                    MODELS[model_name] = pickle.load(f)
                print(f"Model '{model_name}' berhasil dimuat.")
            except Exception as e:
                print(f"Gagal memuat model {file}: {e}")

# 📌 3. Definisikan Kolom & Kamus Penerjemah
COLUMN_NAMES = [
    'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 
    'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal'
]
VALUE_MAPPINGS = {
    'sex': {'Male': 1.0, 'Female': 0.0},
    'cp': {'typical angina': 1.0, 'atypical angina': 2.0, 'non-anginal': 3.0, 'asymptomatic': 4.0},
    'fbs': {True: 1.0, False: 0.0},
    'restecg': {'normal': 0.0, 'st-t abnormality': 1.0, 'lv hypertrophy': 2.0},
    'exang': {True: 1.0, False: 0.0},
    'slope': {'upsloping': 1.0, 'flat': 2.0, 'downsloping': 3.0},
    'thal': {'normal': 3.0, 'fixed defect': 6.0, 'reversable defect': 7.0} # 'reversable' typo dari dataset asli
}

# 📡 4. Buat Endpoints API
@app.route('/models', methods=['GET'])
def get_models():
    if not MODELS: return jsonify({"error": "Model tidak dimuat"}), 404
    return jsonify(sorted(list(MODELS.keys())))

@app.route('/predict', methods=['POST'])
def predict():
    if not MODELS: return jsonify({"error": "Model tidak tersedia"}), 500
    data = request.get_json()
    if not data or 'model_choice' not in data or 'patient_data' not in data:
        return jsonify({"error": "Request JSON tidak valid"}), 400

    model_choice = data['model_choice']
    patient_data = data['patient_data']
    selected_model = MODELS.get(model_choice)
    if not selected_model:
        return jsonify({"error": f"Model '{model_choice}' tidak ditemukan."}), 400
        
    try:
        processed_data = patient_data.copy()
        for key, mapping in VALUE_MAPPINGS.items():
            if key in processed_data:
                processed_data[key] = mapping.get(processed_data[key], processed_data[key])
        
        input_df = pd.DataFrame([processed_data])[COLUMN_NAMES]
        prediction = selected_model.predict(input_df)[0]
        probability = selected_model.predict_proba(input_df)[0]
        confidence_score = probability[1]

        # --- PERBAIKAN UTAMA DI SINI ---
        # Kita sesuaikan nama kunci (key) di response agar sama persis
        # dengan yang diharapkan oleh interface 'PredictionResponse' di frontend.
        response = {
            'model_used': model_choice, # Ini bonus, bisa dipakai atau tidak di frontend
            'predicted_class': int(prediction), # Diubah dari 'prediction'
            'prediction_label': "Berisiko Penyakit Jantung" if prediction == 1 else "Risiko Rendah", # Diubah dari 'prediction_label'
            'probability_score_class_1': float(confidence_score) # Diubah dari 'confidence_score'
        }
        return jsonify(response)

    except Exception as e:
        return jsonify({"error": f"Terjadi error saat prediksi: {str(e)}"}), 500

# ⚡ 5. Jalankan Aplikasi Flask
if __name__ == '__main__':
    load_models()
    app.run(debug=True, port=8000)