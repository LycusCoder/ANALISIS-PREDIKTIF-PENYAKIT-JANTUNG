
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Search, RotateCcw, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PredictionData, PredictionResponse } from '@/pages/Index';

interface HeartPredictionFormProps {
  onPredictionComplete: (result: PredictionResponse) => void;
  onReset: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const HeartPredictionForm = ({ 
  onPredictionComplete, 
  onReset, 
  isLoading, 
  setIsLoading 
}: HeartPredictionFormProps) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<PredictionData>({
    age: 50,
    sex: 'Male',
    cp: 'asymptomatic',
    trestbps: 120,
    chol: 200,
    fbs: false,
    restecg: 'normal',
    thalch: 150,
    exang: false,
    oldpeak: 1.0,
    slope: 'upsloping',
    ca: 0,
    thal: 'normal'
  });

  const handleInputChange = (field: keyof PredictionData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleReset = () => {
    setFormData({
      age: 50,
      sex: 'Male',
      cp: 'asymptomatic',
      trestbps: 120,
      chol: 200,
      fbs: false,
      restecg: 'normal',
      thalch: 150,
      exang: false,
      oldpeak: 1.0,
      slope: 'upsloping',
      ca: 0,
      thal: 'normal'
    });
    onReset();
    toast({
      title: "Form direset",
      description: "Semua data telah dikembalikan ke nilai default",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/predict/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: PredictionResponse = await response.json();
      onPredictionComplete(result);
      
      toast({
        title: "Prediksi berhasil",
        description: "Model telah menganalisis data pasien",
      });
    } catch (error) {
      console.error('Prediction error:', error);
      toast({
        title: "Gagal melakukan prediksi",
        description: "Pastikan server FastAPI sudah berjalan di http://127.0.0.1:8000",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Demographics Section */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-blue-800">Data Demografis</CardTitle>
          <CardDescription>Informasi dasar pasien</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age" className="text-sm font-medium">Umur (tahun)</Label>
              <Input
                id="age"
                type="number"
                min="1"
                max="120"
                value={formData.age}
                onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sex" className="text-sm font-medium">Jenis Kelamin</Label>
              <Select value={formData.sex} onValueChange={(value) => handleInputChange('sex', value)}>
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Laki-laki</SelectItem>
                  <SelectItem value="Female">Perempuan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Symptoms Section */}
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-green-800">Gejala & Kondisi</CardTitle>
          <CardDescription>Keluhan dan kondisi medis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cp" className="text-sm font-medium">Tipe Nyeri Dada</Label>
            <Select value={formData.cp} onValueChange={(value) => handleInputChange('cp', value)}>
              <SelectTrigger className="bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="typical angina">Angina Tipikal</SelectItem>
                <SelectItem value="atypical angina">Angina Atipikal</SelectItem>
                <SelectItem value="non-anginal">Non-Anginal</SelectItem>
                <SelectItem value="asymptomatic">Asimptomatik</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="fbs" className="text-sm font-medium">Gula Darah Puasa &gt; 120 mg/dl</Label>
              <Switch
                id="fbs"
                checked={formData.fbs}
                onCheckedChange={(value) => handleInputChange('fbs', value)}
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="exang" className="text-sm font-medium">Angina Akibat Olahraga</Label>
              <Switch
                id="exang"
                checked={formData.exang}
                onCheckedChange={(value) => handleInputChange('exang', value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vital Signs Section */}
      <Card className="border-purple-200 bg-purple-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-purple-800">Tanda Vital</CardTitle>
          <CardDescription>Pengukuran medis penting</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Tekanan Darah Istirahat: {formData.trestbps} mmHg</Label>
              <Slider
                value={[formData.trestbps]}
                onValueChange={(value) => handleInputChange('trestbps', value[0])}
                min={50}
                max={250}
                step={1}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Kolesterol: {formData.chol} mg/dl</Label>
              <Slider
                value={[formData.chol]}
                onValueChange={(value) => handleInputChange('chol', value[0])}
                min={50}
                max={600}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Detak Jantung Maksimum: {formData.thalch} bpm</Label>
            <Slider
              value={[formData.thalch]}
              onValueChange={(value) => handleInputChange('thalch', value[0])}
              min={50}
              max={220}
              step={1}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Advanced Tests Section */}
      <Card className="border-amber-200 bg-amber-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-amber-800">Pemeriksaan Lanjutan</CardTitle>
          <CardDescription>Hasil tes medis spesifik</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="restecg" className="text-sm font-medium">Hasil EKG Istirahat</Label>
              <Select value={formData.restecg} onValueChange={(value) => handleInputChange('restecg', value)}>
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="st-t abnormality">Abnormalitas ST-T</SelectItem>
                  <SelectItem value="lv hypertrophy">Hipertrofi LV</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="slope" className="text-sm font-medium">Kemiringan Segmen ST</Label>
              <Select value={formData.slope} onValueChange={(value) => handleInputChange('slope', value)}>
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upsloping">Upsloping</SelectItem>
                  <SelectItem value="flat">Flat</SelectItem>
                  <SelectItem value="downsloping">Downsloping</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Depresi ST: {formData.oldpeak}</Label>
              <Slider
                value={[formData.oldpeak]}
                onValueChange={(value) => handleInputChange('oldpeak', value[0])}
                min={0}
                max={7}
                step={0.1}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ca" className="text-sm font-medium">Pembuluh Darah Besar (0-3)</Label>
              <Input
                id="ca"
                type="number"
                min="0"
                max="3"
                value={formData.ca}
                onChange={(e) => handleInputChange('ca', parseInt(e.target.value))}
                className="bg-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="thal" className="text-sm font-medium">Kelainan Thalassemia</Label>
            <Select value={formData.thal} onValueChange={(value) => handleInputChange('thal', value)}>
              <SelectTrigger className="bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="fixed defect">Fixed Defect</SelectItem>
                <SelectItem value="reversable defect">Reversible Defect</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <Button 
          type="submit" 
          disabled={isLoading}
          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
        >
          {isLoading ? (
            <>
              <Activity className="w-4 h-4 mr-2 animate-spin" />
              Menganalisis...
            </>
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              Prediksi Risiko
            </>
          )}
        </Button>
        <Button 
          type="button" 
          variant="outline"
          onClick={handleReset}
          disabled={isLoading}
          className="border-gray-300 hover:bg-gray-50"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>
    </form>
  );
};
