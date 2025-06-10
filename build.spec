# build.spec (REVISI LENGKAP)

import os
from PyInstaller.utils.hooks import collect_data_files

# --- LOKASI OUTPUT (Bisa disesuaikan) ---
output_path = "D:\\Kuliah\\Semester 4\\Machine Learning\\Persiapan UAS + Tugas 2"

# --- PENGUMPULAN DATA & HOOKS (INI BAGIAN PENTING) ---
# Kumpulkan semua file data penting dari library yang sering bikin masalah
datas = [
    ('backend/models', 'models'),
    ('frontend/dist', 'frontend/dist')
]
datas += collect_data_files('sklearn')
datas += collect_data_files('pandas')
datas += collect_data_files('uvicorn')
datas += collect_data_files('fastapi')

# Hidden imports untuk modul yang sering "terlewat" oleh PyInstaller
hiddenimports = [
    'sklearn.utils._cython_blas',
    'sklearn.neighbors._typedefs',
    'sklearn.neighbors._quad_tree',
    'sklearn.tree._utils',
    'uvicorn.logging',
    'uvicorn.loops',
    'uvicorn.loops.auto',
    'uvicorn.protocols',
    'uvicorn.protocols.http',
    'uvicorn.protocols.http.auto',
    'uvicorn.protocols.websockets',
    'uvicorn.protocols.websockets.auto',
    'uvicorn.lifespan',
    'uvicorn.lifespan.on',
]

# --- KONFIGURASI UTAMA ---
a = Analysis(
    ['backend/main.py'],
    pathex=[],
    binaries=[],
    datas=datas,
    hiddenimports=hiddenimports,
    hookspath=[],
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=None,
    noarchive=False,
)
pyz = PYZ(a.pure, a.zipped_data, cipher=None)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='PrediksiJantung',
    debug=False, # Set ke True kalau mau lihat debug di terminal saat .exe jalan
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=False, # Set ke True biar terminal muncul saat .exe di-klik
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    version='file_version_info.txt'
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='PrediksiJantung'
)