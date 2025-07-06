// HeartPredictionForm.tsx (Versi Lengkap & Sudah Diperbaiki)
// Kode ini sudah disesuaikan untuk berkomunikasi dengan backend Flask di main.py

import { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Search, RotateCcw, Activity, BrainCircuit, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// --- Tipe Data untuk Payload dan Response ---
// Ini untuk memastikan data yang dikirim dan diterima sesuai
export interface PredictionData {
  age: number;
  sex: number;
  cp: number;
  trestbps: number;
  chol: number;
  fbs: number;
  restecg: number;
  thalach: number;
  exang: number;
  oldpeak: number;
  slope: number;
  ca: number;
  thal: number;
}

export interface PredictionResponse {
  model_used: string;
  prediction: number;
  result_label: string;
  probability_of_risk: number;
}
// --- Akhir Tipe Data ---


interface HeartPredictionFormProps {
  onPredictionComplete: (result: PredictionResponse) => void;
  onReset: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

// [FIX 1] URL API disesuaikan dengan port Flask (default: 5000)
const API_URL = 'http://127.0.0.1:5000'; 

// [FIX 2] Nama model terbaik disesuaikan dengan nama file dari notebook
const RECOMMENDED_MODEL = 'Non-PCA_SVC';

// [FIX 3] Daftar model didefinisikan secara statis di frontend
const AVAILABLE_MODELS = [
  'Non-PCA_SVC', 'Non-PCA_Logistic_Regression', 'Non-PCA_Random_Forest', 'Non-PCA_XGBoost',
  'PCA_SVC', 'PCA_Logistic_Regression', 'PCA_Random_Forest', 'PCA_XGBoost'
];

export const HeartPredictionForm = ({ 
  onPredictionComplete, 
  onReset, 
  isLoading, 
  setIsLoading 
}: HeartPredictionFormProps) => {
  const { toast } = useToast();
  
  // [FIX 4] Initial state diubah menjadi numerik agar sesuai dengan model
  const initialFormData: PredictionData = {
    age: 50,
    sex: 1,        // 1: Laki-laki, 0: Perempuan
    cp: 1,         // 1: typical angina, 2: atypical angina, 3: non-anginal, 4: asymptomatic
    trestbps: 120,
    chol: 200,
    fbs: 1,        // 1: True (> 120 mg/dl), 0: False
    restecg: 2,    // 0: normal, 1: st-t abnormality, 2: lv hypertrophy
    thalach: 150,
    exang: 0,      // 0: No, 1: Yes
    oldpeak: 1.0,
    slope: 3,      // 1: upsloping, 2: flat, 3: downsloping
    ca: 0,
    thal: 6        // 3: normal, 6: fixed defect, 7: reversable defect
  };
  
  const [formData, setFormData] = useState<PredictionData>(initialFormData);
  const [selectedModel, setSelectedModel] = useState<string>(RECOMMENDED_MODEL);

  const handleInputChange = (field: keyof PredictionData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: Number(value) }));
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setSelectedModel(RECOMMENDED_MODEL);
    onReset();
    toast({ title: "Form Direset", description: "Semua data telah kembali ke nilai awal." });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // [FIX 5] Struktur payload disesuaikan dengan backend
    const payload = {
      model_name: selectedModel,
      data: formData
    };

    try {
      const response = await axios.post<PredictionResponse>(`${API_URL}/predict`, payload);
      onPredictionComplete(response.data);
      toast({
        title: "Prediksi Berhasil!",
        description: `Model ${selectedModel} telah menganalisis data.`,
      });
    } catch (error: any) {
      console.error('Prediction error:', error);
      const errorMessage = error.response?.data?.error || "Terjadi kesalahan saat menghubungi server.";
      toast({
        title: "Gagal Melakukan Prediksi",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="border-indigo-200 bg-indigo-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-indigo-800 flex items-center">
            <BrainCircuit className="w-5 h-5 mr-2" />
            Pilih Model Algoritma
          </CardTitle>
          <CardDescription>Pilih algoritma untuk prediksi. Model dengan <Star className="w-4 h-4 inline text-yellow-500" /> direkomendasikan.</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Pilih model" />
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_MODELS.map(modelName => (
                <SelectItem key={modelName} value={modelName}>
                  {modelName} {modelName === RECOMMENDED_MODEL && <Star className="w-4 h-4 inline text-yellow-500 ml-1" />}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-blue-800">Data Demografis</CardTitle>
          <CardDescription>Informasi dasar pasien</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age" className="text-sm font-medium">Umur (tahun)</Label>
              <Input id="age" type="number" min="1" max="120" value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)} className="bg-white"/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sex" className="text-sm font-medium">Jenis Kelamin</Label>
              <Select value={String(formData.sex)} onValueChange={(value) => handleInputChange('sex', value)}>
                <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Laki-laki</SelectItem>
                  <SelectItem value="0">Perempuan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-green-200 bg-green-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-green-800">Gejala & Kondisi</CardTitle>
          <CardDescription>Keluhan dan kondisi medis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cp" className="text-sm font-medium">Tipe Nyeri Dada (cp)</Label>
            <Select value={String(formData.cp)} onValueChange={(value) => handleInputChange('cp', value)}>
              <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1: Angina Tipikal</SelectItem>
                <SelectItem value="2">2: Angina Atipikal</SelectItem>
                <SelectItem value="3">3: Nyeri Non-Anginal</SelectItem>
                <SelectItem value="4">4: Asimptomatik</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between space-x-2 rounded-md border p-4 bg-white/50">
              <Label htmlFor="fbs" className="text-sm font-medium">Gula Darah Puasa > 120 mg/dl (fbs)</Label>
              <Switch id="fbs" checked={Boolean(formData.fbs)} onCheckedChange={(value) => handleInputChange('fbs', value ? 1 : 0)} />
            </div>
            <div className="flex items-center justify-between space-x-2 rounded-md border p-4 bg-white/50">
              <Label htmlFor="exang" className="text-sm font-medium">Angina Akibat Olahraga (exang)</Label>
              <Switch id="exang" checked={Boolean(formData.exang)} onCheckedChange={(value) => handleInputChange('exang', value ? 1 : 0)} />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-purple-200 bg-purple-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-purple-800">Tanda Vital</CardTitle>
          <CardDescription>Pengukuran medis penting</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Tekanan Darah Istirahat: {formData.trestbps} mmHg</Label>
              <Slider value={[formData.trestbps]} onValueChange={(value) => handleInputChange('trestbps', value[0])} min={50} max={250} step={1} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Kolesterol: {formData.chol} mg/dl</Label>
              <Slider value={[formData.chol]} onValueChange={(value) => handleInputChange('chol', value[0])} min={50} max={600} step={1} />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Detak Jantung Maksimum: {formData.thalach} bpm</Label>
            <Slider value={[formData.thalach]} onValueChange={(value) => handleInputChange('thalach', value[0])} min={50} max={220} step={1} />
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-amber-200 bg-amber-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-amber-800">Pemeriksaan Lanjutan</CardTitle>
          <CardDescription>Hasil tes medis spesifik</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="restecg" className="text-sm font-medium">Hasil EKG Istirahat</Label>
              <Select value={String(formData.restecg)} onValueChange={(value) => handleInputChange('restecg', value)}>
                <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0: Normal</SelectItem>
                  <SelectItem value="1">1: Abnormalitas ST-T</SelectItem>
                  <SelectItem value="2">2: Hipertrofi LV</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="slope" className="text-sm font-medium">Kemiringan Segmen ST</Label>
              <Select value={String(formData.slope)} onValueChange={(value) => handleInputChange('slope', value)}>
                <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1: Upsloping</SelectItem>
                  <SelectItem value="2">2: Flat</SelectItem>
                  <SelectItem value="3">3: Downsloping</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Depresi ST (oldpeak): {formData.oldpeak}</Label>
              <Slider value={[formData.oldpeak]} onValueChange={(value) => handleInputChange('oldpeak', value[0])} min={0} max={7} step={0.1} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ca" className="text-sm font-medium">Pembuluh Darah Besar (0-3)</Label>
              <Input id="ca" type="number" min="0" max="3" value={formData.ca}
                onChange={(e) => handleInputChange('ca', e.target.value)} className="bg-white" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="thal" className="text-sm font-medium">Kelainan Thalassemia</Label>
            <Select value={String(formData.thal)} onValueChange={(value) => handleInputChange('thal', value)}>
              <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3: Normal</SelectItem>
                <SelectItem value="6">6: Fixed Defect</SelectItem>
                <SelectItem value="7">7: Reversible Defect</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="flex gap-4 pt-4">
        <Button type="submit" disabled={isLoading} className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg">
          {isLoading ? (
            <><Activity className="w-4 h-4 mr-2 animate-spin" /> Menganalisis...</>
          ) : (
            <><Search className="w-4 h-4 mr-2" /> Prediksi Risiko</>
          )}
        </Button>
        <Button type="button" variant="outline" onClick={handleReset} disabled={isLoading} className="border-gray-300 hover:bg-gray-50">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>
    </form>
  );
};