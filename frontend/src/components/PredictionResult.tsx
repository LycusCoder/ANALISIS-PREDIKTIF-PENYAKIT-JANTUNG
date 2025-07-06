import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Heart, TrendingUp, TrendingDown, Activity, AlertTriangle, CheckCircle, Info, BrainCircuit } from 'lucide-react';
import { PredictionResponse } from '@/pages/Index';

interface PredictionResultProps {
  result: PredictionResponse & { model_used?: string } | null;
  isLoading: boolean;
}

export const PredictionResult = ({ result, isLoading }: PredictionResultProps) => {
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-blue-200 rounded-full mx-auto animate-spin">
            <Activity className="w-16 h-16 text-blue-500 p-4" />
          </div>
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded mx-auto w-48"></div>
            <div className="h-4 bg-gray-200 rounded mx-auto w-64"></div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="text-center space-y-6 py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
          <Heart className="w-12 h-12 text-gray-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-600">Belum Ada Hasil</h3>
          <p className="text-gray-500">
            Masukkan data pasien dan klik "Prediksi Risiko" untuk melihat analisis
          </p>
        </div>
      </div>
    );
  }

  // --- Perubahan di sini: Sesuaikan nama properti dengan respons dari main.py ---
  const isHighRisk = result.prediction === 1; // Menggunakan 'prediction'
  const riskPercentage = (result.probability_of_risk * 100).toFixed(1); // Menggunakan 'probability_of_risk'
  const lowRiskPercentage = ((1 - result.probability_of_risk) * 100).toFixed(1); // Menggunakan 'probability_of_risk'

  const pieData = [
    { name: 'Risiko Tinggi', value: result.probability_of_risk * 100, color: '#ef4444' }, // Menggunakan 'probability_of_risk'
    { name: 'Risiko Rendah', value: (1 - result.probability_of_risk) * 100, color: '#10b981' } // Menggunakan 'probability_of_risk'
  ];

  const barData = [
    {
      name: 'Risiko Rendah',
      probability: parseFloat(lowRiskPercentage),
      fill: '#10b981'
    },
    {
      name: 'Risiko Tinggi',
      probability: parseFloat(riskPercentage),
      fill: '#ef4444'
    }
  ];

  const getRiskLevel = (percentage: number) => {
    if (percentage < 30) return { level: 'Rendah', color: 'green', icon: CheckCircle };
    if (percentage < 60) return { level: 'Sedang', color: 'yellow', icon: AlertTriangle };
    return { level: 'Tinggi', color: 'red', icon: AlertTriangle };
  };

  const riskLevel = getRiskLevel(parseFloat(riskPercentage));
  const RiskIcon = riskLevel.icon;

  return (
    <div className="space-y-6">
      {/* Main Result Card */}
      <Card className={`border-2 ${isHighRisk ? 'border-red-200 bg-red-50/50' : 'border-green-200 bg-green-50/50'}`}>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
              isHighRisk ? 'bg-red-100' : 'bg-green-100'
            }`}>
              {isHighRisk ? (
                <TrendingUp className="w-8 h-8 text-red-600" />
              ) : (
                <TrendingDown className="w-8 h-8 text-green-600" />
              )}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">
                {result.result_label} {/* Menggunakan 'result_label' */}
              </h3>
              <Badge
                variant={isHighRisk ? "destructive" : "default"}
                className={`mt-2 text-sm ${isHighRisk ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}
              >
                Kelas Prediksi: {result.prediction} {/* Menggunakan 'prediction' */}
              </Badge>
              {result.model_used && (
                <div className="mt-2">
                  <Badge variant="outline" className="text-sm bg-blue-100 text-blue-800">
                    <BrainCircuit className="w-4 h-4 mr-1" />
                    Model: {result.model_used}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Percentage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RiskIcon className={`w-5 h-5 text-${riskLevel.color}-600`} />
            Tingkat Risiko: {riskLevel.level}
          </CardTitle>
          <CardDescription>
            Probabilitas risiko penyakit jantung berdasarkan model AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Probabilitas Risiko</span>
              <span className="font-semibold">{riskPercentage}%</span>
            </div>
            <Progress
              value={parseFloat(riskPercentage)}
              className="h-3"
            />
          </div>
          <p className="text-sm text-gray-600">
            Model memprediksi probabilitas {riskPercentage}% untuk adanya risiko penyakit jantung
          </p>
        </CardContent>
      </Card>

      {/* Visual Charts */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribusi Risiko</CardTitle>
            <CardDescription>Visualisasi perbandingan risiko</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Risiko Rendah</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm">Risiko Tinggi</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Perbandingan Probabilitas</CardTitle>
            <CardDescription>Analisis risiko dalam bentuk diagram</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value: number) => `${value}%`} />
                <Bar dataKey="probability" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Interpretation */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Info className="w-5 h-5" />
            Interpretasi Hasil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-blue-800 space-y-2">
            <p>
              <strong>Hasil Prediksi:</strong> Model {result.model_used || 'terpilih'} mengklasifikasikan pasien ke dalam
              kategori <span className="font-semibold">{result.result_label}</span> {/* Menggunakan 'result_label' */}
              dengan tingkat kepercayaan {riskPercentage}%.
            </p>
            {isHighRisk ? (
              <div className="space-y-1">
                <p><strong>Rekomendasi:</strong></p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Konsultasi segera dengan ahli kardiologi</li>
                  <li>Lakukan pemeriksaan lebih lanjut sesuai anjuran dokter</li>
                  <li>Pantau tekanan darah dan kolesterol secara rutin</li>
                  <li>Terapkan gaya hidup sehat dan olahraga teratur</li>
                </ul>
              </div>
            ) : (
              <div className="space-y-1">
                <p><strong>Rekomendasi:</strong></p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Pertahankan gaya hidup sehat saat ini</li>
                  <li>Lakukan pemeriksaan kesehatan rutin</li>
                  <li>Tetap aktif dengan olahraga teratur</li>
                  <li>Pantau faktor risiko secara berkala</li>
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};