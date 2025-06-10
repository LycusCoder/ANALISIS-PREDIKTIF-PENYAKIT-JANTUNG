
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BookOpen, Users, Play, AlertTriangle, Info, Target } from 'lucide-react';

export const UserGuide = () => {
  return (
    <div className="space-y-6">
      {/* How to Use Section */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Play className="w-5 h-5" />
            Cara Penggunaan Aplikasi
          </CardTitle>
          <CardDescription>Panduan langkah demi langkah menggunakan aplikasi prediksi</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-1 text-blue-600 border-blue-300">1</Badge>
              <div>
                <h4 className="font-semibold text-blue-800">Isi Data Demografis</h4>
                <p className="text-sm text-blue-700">Masukkan umur pasien (1-120 tahun) dan pilih jenis kelamin.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-1 text-blue-600 border-blue-300">2</Badge>
              <div>
                <h4 className="font-semibold text-blue-800">Input Gejala & Kondisi</h4>
                <p className="text-sm text-blue-700">Pilih tipe nyeri dada dan atur kondisi gula darah puasa serta angina akibat olahraga.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-1 text-blue-600 border-blue-300">3</Badge>
              <div>
                <h4 className="font-semibold text-blue-800">Atur Tanda Vital</h4>
                <p className="text-sm text-blue-700">Sesuaikan nilai tekanan darah istirahat, kolesterol, dan detak jantung maksimum menggunakan slider.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-1 text-blue-600 border-blue-300">4</Badge>
              <div>
                <h4 className="font-semibold text-blue-800">Lengkapi Pemeriksaan Lanjutan</h4>
                <p className="text-sm text-blue-700">Isi hasil EKG, kemiringan segmen ST, depresi ST, jumlah pembuluh darah besar, dan kelainan thalassemia.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-1 text-blue-600 border-blue-300">5</Badge>
              <div>
                <h4 className="font-semibold text-blue-800">Jalankan Prediksi</h4>
                <p className="text-sm text-blue-700">Klik tombol "Prediksi Risiko" untuk mendapatkan analisis dari model AI. Hasil akan ditampilkan dengan visualisasi yang mudah dipahami.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medical Terms Explanation */}
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <BookOpen className="w-5 h-5" />
            Penjelasan Istilah Medis
          </CardTitle>
          <CardDescription>Keterangan istilah medis untuk membantu pemahaman</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-green-800">Tipe Nyeri Dada (Chest Pain Type)</h4>
              <ul className="text-sm text-green-700 space-y-1 pl-4">
                <li><strong>Angina Tipikal:</strong> Nyeri dada klasik yang berhubungan dengan penyakit jantung</li>
                <li><strong>Angina Atipikal:</strong> Nyeri dada yang tidak khas tetapi masih terkait jantung</li>
                <li><strong>Non-Anginal:</strong> Nyeri dada yang tidak berhubungan dengan jantung</li>
                <li><strong>Asimptomatik:</strong> Tidak ada gejala nyeri dada</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-green-800">Nilai Normal Referensi</h4>
              <ul className="text-sm text-green-700 space-y-1 pl-4">
                <li><strong>Tekanan Darah Normal:</strong> 120/80 mmHg atau lebih rendah</li>
                <li><strong>Kolesterol Normal:</strong> Kurang dari 200 mg/dl</li>
                <li><strong>Gula Darah Puasa Normal:</strong> Kurang dari 120 mg/dl</li>
                <li><strong>Detak Jantung Maksimum:</strong> Sekitar 220 - umur (tahun)</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-green-800">Pemeriksaan EKG</h4>
              <ul className="text-sm text-green-700 space-y-1 pl-4">
                <li><strong>Normal:</strong> Hasil EKG dalam batas normal</li>
                <li><strong>Abnormalitas ST-T:</strong> Kelainan pada gelombang ST-T</li>
                <li><strong>Hipertrofi LV:</strong> Pembesaran ventrikel kiri jantung</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Card className="border-amber-200 bg-amber-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-800">
            <AlertTriangle className="w-5 h-5" />
            Catatan Penting untuk Pengguna
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-amber-800 space-y-2">
            <p><strong>Keakuratan Data:</strong> Pastikan semua data yang dimasukkan akurat dan sesuai dengan hasil pemeriksaan medis terbaru.</p>
            <p><strong>Konsultasi Medis:</strong> Hasil prediksi ini hanya sebagai referensi. Selalu konsultasikan dengan dokter atau tenaga medis profesional.</p>
            <p><strong>Bukan Diagnosis:</strong> Aplikasi ini tidak menggantikan diagnosis medis dan tidak boleh digunakan sebagai dasar pengambilan keputusan medis.</p>
            <p><strong>Penelitian & Edukasi:</strong> Aplikasi ini dibuat untuk keperluan penelitian akademis dan edukasi medis.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
