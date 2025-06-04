# backend/train_model.py

import pandas as pd
import numpy as np

# Path ke dataset kamu
DATASET_PATH = "data/heart_disease_uci.csv"

# Memuat dataset
try:
    df = pd.read_csv(DATASET_PATH)
except FileNotFoundError:
    print(f"Error: File dataset tidak ditemukan di {DATASET_PATH}")
    exit()

print("===== 5 Baris Pertama Dataset =====")
print(df.head())
print("\n===== Informasi Dataset =====")
df.info()
print("\n===== Deskripsi Statistik Dataset =====")
print(df.describe(include='all'))
print("\n===== Jumlah Nilai Kosong per Kolom =====")
print(df.isnull().sum())
print("\n===== Jumlah Data Unik per Kolom =====")
for col in df.columns:
    print(f"Kolom '{col}': {df[col].nunique()} nilai unik")