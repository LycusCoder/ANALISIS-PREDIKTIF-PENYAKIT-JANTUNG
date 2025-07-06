# main.py
# Backend API menggunakan Flask untuk prediksi penyakit jantung.
# Script ini akan memuat semua model yang telah dilatih dan menyediakan
# endpoint untuk melakukan prediksi berdasarkan input dari pengguna.

import os
import joblib
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS

# --- Inisialisasi Aplikasi Flask ---
app = Flask(__name__)
# Mengaktifkan CORS (Cross-Origin Resource Sharing) agar bisa diakses dari frontend React
CORS(app)

# --- Pemuatan Model ---
# Definisikan path ke folder tempat model disimpan
# Ambil path direktori tempat main.py berada
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Gabungkan dengan path ke folder model
MODEL_DIR = os.path.join(BASE_DIR, 'backend', 'hasil_model')

# Dictionary untuk menyimpan semua model yang telah dimuat
# Ini dilakukan agar model tidak perlu di-load setiap kali ada request,
# sehingga lebih efisien.
models = {}

# Daftar nama model yang diharapkan sesuai dengan file yang disimpan
model_files = {
    # Skenario Non-PCA
    'Non-PCA_Logistic_Regression': 'Non-PCA_Logistic_Regression_model.pkl',
    'Non-PCA_Random_Forest': 'Non-PCA_Random_Forest_model.pkl',
    'Non-PCA_XGBoost': 'Non-PCA_XGBoost_model.pkl',
    'Non-PCA_SVC': 'Non-PCA_SVC_model.pkl',
    # Skenario PCA
    'PCA_Logistic_Regression': 'PCA_Logistic_Regression_model.pkl',
    'PCA_Random_Forest': 'PCA_Random_Forest_model.pkl',
    'PCA_XGBoost': 'PCA_XGBoost_model.pkl',
    'PCA_SVC': 'PCA_SVC_model.pkl'
}

# Fungsi untuk memuat semua model saat aplikasi pertama kali dijalankan
def load_all_models():
    """Memuat semua file model .pkl dari direktori dan menyimpannya dalam dictionary."""
    print("Memuat semua model...")
    for model_name, file_name in model_files.items():
        path = os.path.join(MODEL_DIR, file_name)
        try:
            with open(path, 'rb') as f:
                models[model_name] = joblib.load(f)
            print(f"Model '{model_name}' berhasil dimuat.")
        except FileNotFoundError:
            print(f"Peringatan: File model tidak ditemukan di '{path}'. Model '{model_name}' tidak akan tersedia.")
        except Exception as e:
            print(f"Error saat memuat model '{model_name}': {e}")

# --- Definisi Fitur ---
# Urutan fitur ini HARUS SAMA dengan urutan saat melatih model
# karena pipeline Scikit-learn mengharapkan urutan kolom yang konsisten.
FEATURE_ORDER = [
    'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 
    'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal'
]

# --- Endpoint API untuk Prediksi ---
@app.route('/predict', methods=['POST'])
def predict():
    """
    Endpoint untuk menerima data pasien dan mengembalikan hasil prediksi.
    Request body harus dalam format JSON, contoh:
    {
        "model_name": "Non-PCA_SVC",
        "data": {
            "age": 63, "sex": 1, "cp": 1, "trestbps": 145, "chol": 233,
            "fbs": 1, "restecg": 2, "thalach": 150, "exang": 0,
            "oldpeak": 2.3, "slope": 3, "ca": 0, "thal": 6
        }
    }
    """
    try:
        # 1. Ambil data JSON dari request
        json_data = request.get_json()
        if not json_data:
            return jsonify({'error': 'Request body tidak valid atau kosong.'}), 400

        model_name = json_data.get('model_name')
        input_data = json_data.get('data')

        # 2. Validasi input
        if not model_name or not input_data:
            return jsonify({'error': 'Request harus menyertakan "model_name" dan "data".'}), 400

        if model_name not in models:
            return jsonify({'error': f"Model '{model_name}' tidak ditemukan atau tidak berhasil dimuat."}), 404

        # 3. Siapkan data untuk prediksi
        # Ubah dictionary input menjadi DataFrame dengan urutan kolom yang benar
        # Ini penting karena pipeline model sangat bergantung pada urutan fitur.
        input_df = pd.DataFrame([input_data])
        # Pastikan urutan kolom sesuai dengan saat training
        input_df = input_df[FEATURE_ORDER] 

        # 4. Lakukan Prediksi
        model = models[model_name]
        
        # Dapatkan hasil prediksi (kelas 0 atau 1)
        prediction_result = model.predict(input_df)
        
        # Dapatkan probabilitas prediksi
        # predict_proba mengembalikan array [[prob_kelas_0, prob_kelas_1]]
        prediction_proba = model.predict_proba(input_df)
        
        # Ambil probabilitas untuk kelas 1 (berisiko sakit)
        probability_of_risk = prediction_proba[0][1]

        # 5. Format dan kirim response
        # Ubah hasil prediksi numpy menjadi tipe data Python standar
        output_class = int(prediction_result[0])
        
        # Tentukan label hasil untuk kemudahan pembacaan di frontend
        result_label = "Berisiko Penyakit Jantung" if output_class == 1 else "Tidak Berisiko Penyakit Jantung"

        return jsonify({
            'model_used': model_name,
            'prediction': output_class,
            'result_label': result_label,
            'probability_of_risk': float(probability_of_risk)
        })

    except Exception as e:
        # Tangani error tak terduga
        return jsonify({'error': f'Terjadi kesalahan internal: {str(e)}'}), 500

# --- Menjalankan Aplikasi ---
if __name__ == '__main__':
    # Pastikan folder 'hasil_model' ada
    if not os.path.exists(MODEL_DIR):
        print(f"Error: Direktori '{MODEL_DIR}' tidak ditemukan. Pastikan semua file .pkl ada di dalamnya.")
    else:
        # Muat semua model saat startup
        load_all_models()
        # Jalankan server Flask
        # host='0.0.0.0' agar bisa diakses dari luar container (jika pakai Docker)
        # atau dari jaringan lokal.
        app.run(host='0.0.0.0', port=5000, debug=True)
