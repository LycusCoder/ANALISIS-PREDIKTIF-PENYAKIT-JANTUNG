import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HeartPredictionForm } from '@/components/HeartPredictionForm';
import { PredictionResult } from '@/components/PredictionResult';
import { UserGuide } from '@/components/UserGuide';
import { AcademicInfo } from '@/components/AcademicInfo';
import { Heart, Activity, Shield, BookOpen, GraduationCap, BarChart } from 'lucide-react';

export interface PredictionData {
  age: number;
  sex: string;
  cp: string;
  trestbps: number;
  chol: number;
  fbs: boolean;
  restecg: string;
  thalch: number;
  exang: boolean;
  oldpeak: number;
  slope: string;
  ca: number;
  thal: string;
}

export interface PredictionResponse {
  predicted_class: number;
  prediction_label: string;
  probability_score_class_1: number;
}

const Index = () => {
  const [predictionResult, setPredictionResult] = useState<PredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePredictionComplete = (result: PredictionResponse) => {
    setPredictionResult(result);
  };

  const handleReset = () => {
    setPredictionResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header Section */}
      <div className="medical-gradient text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                <Heart className="w-16 h-16 text-white" />
                <Activity className="w-8 h-8 text-white absolute -top-2 -right-2 animate-pulse" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Prediksi Risiko Penyakit Jantung
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Aplikasi berbasis Machine Learning (Logistic Regression Optimized) 
              untuk memprediksi risiko penyakit jantung berdasarkan data medis pasien
            </p>
            <div className="flex items-center justify-center gap-2 text-blue-100">
              <Shield className="w-5 h-5" />
              <span className="text-sm">Untuk keperluan penelitian dan edukasi medis</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-blue-100 text-sm">
              <GraduationCap className="w-4 h-4" />
              <span>STMIK YMI Tegal - Tugas UAS Machine Learning</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="prediction" className="max-w-7xl mx-auto">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 h-auto md:h-12 gap-2 md:gap-0 bg-white/80 backdrop-blur-sm border shadow-lg">
            <TabsTrigger value="prediction" className="flex items-center gap-2 h-12">
              <BarChart className="w-4 h-4" />
              <span className="hidden sm:inline">Prediksi</span>
            </TabsTrigger>
            <TabsTrigger value="guide" className="flex items-center gap-2 h-12">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Cara Penggunaan</span>
            </TabsTrigger>
            <TabsTrigger value="about" className="flex items-center gap-2 h-12">
              <GraduationCap className="w-4 h-4" />
              <span className="hidden sm:inline">Info Akademis</span>
            </TabsTrigger>
            <TabsTrigger value="disclaimer" className="flex items-center gap-2 h-12">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Disclaimer</span>
            </TabsTrigger>
          </TabsList>

          {/* Prediction Tab */}
          <TabsContent value="prediction" className="mt-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Form Section */}
              <div className="space-y-6">
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader className="text-center border-b bg-gradient-to-r from-blue-50 to-green-50">
                    <CardTitle className="text-2xl text-gray-800">
                      Input Data Pasien
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Masukkan data medis untuk mendapatkan prediksi risiko
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <HeartPredictionForm 
                      onPredictionComplete={handlePredictionComplete}
                      onReset={handleReset}
                      isLoading={isLoading}
                      setIsLoading={setIsLoading}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Results Section */}
              <div className="space-y-6">
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader className="text-center border-b bg-gradient-to-r from-green-50 to-blue-50">
                    <CardTitle className="text-2xl text-gray-800">
                      Hasil Prediksi
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Analisis risiko berdasarkan model AI
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <PredictionResult 
                      result={predictionResult} 
                      isLoading={isLoading}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* User Guide Tab */}
          <TabsContent value="guide" className="mt-8">
            <UserGuide />
          </TabsContent>

          {/* Academic Info Tab */}
          <TabsContent value="about" className="mt-8">
            <AcademicInfo />
          </TabsContent>

          {/* Disclaimer Tab */}
          <TabsContent value="disclaimer" className="mt-8">
            <Card className="border-amber-200 bg-amber-50/80 backdrop-blur-sm shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-amber-600" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-semibold text-amber-800">Pernyataan Medis Penting</h3>
                    
                    <div className="space-y-3 text-amber-700">
                      <p className="leading-relaxed">
                        <strong>Bukan Pengganti Diagnosis Medis:</strong> Aplikasi ini adalah prototipe untuk keperluan penelitian akademis dan edukasi. 
                        Hasil prediksi yang diberikan tidak boleh digunakan sebagai pengganti diagnosis medis profesional.
                      </p>
                      
                      <p className="leading-relaxed">
                        <strong>Konsultasi dengan Dokter:</strong> Selalu konsultasikan kondisi kesehatan Anda dengan dokter atau tenaga medis profesional 
                        untuk evaluasi kesehatan yang akurat dan pengambilan keputusan medis yang tepat.
                      </p>
                      
                      <p className="leading-relaxed">
                        <strong>Tujuan Akademis:</strong> Aplikasi ini dikembangkan sebagai tugas akhir semester mata kuliah Machine Learning 
                        di STMIK YMI Tegal untuk tujuan pembelajaran dan penelitian.
                      </p>
                      
                      <p className="leading-relaxed">
                        <strong>Tanggung Jawab Pengguna:</strong> Pengguna bertanggung jawab penuh atas penggunaan aplikasi ini dan 
                        tidak boleh mengandalkan hasil prediksi untuk keputusan medis tanpa konsultasi dengan profesional kesehatan.
                      </p>
                    </div>
                    
                    <div className="bg-amber-100 p-4 rounded-lg border border-amber-200">
                      <p className="text-sm text-amber-800 font-medium">
                        ⚠️ PENTING: Jika Anda mengalami gejala penyakit jantung, segera hubungi dokter atau layanan kesehatan darurat.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
