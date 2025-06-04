# backend/main.py

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler, LabelEncoder, OneHotEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import pickle
import os

# --- Konfigurasi Path ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, 'data', 'heart_disease_uci.csv')
MODELS_PATH = os.path.join(BASE_DIR, 'models')

# Pastikan folder 'models' ada
if not os.path.exists(MODELS_PATH):
    os.makedirs(MODELS_PATH)

# --- 1. Load Dataset ---
df = pd.read_csv(DATA_PATH)

print("Dataset berhasil dimuat.")
print("Info dataset awal:")
df.info()
print("\nContoh 5 data pertama:")
print(df.head())
print("\nStatistik Deskriptif:")
print(df.describe(include='all'))