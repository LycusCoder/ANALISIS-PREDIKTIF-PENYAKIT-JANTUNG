
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { GraduationCap, Users, Code, Award } from 'lucide-react';

export const AcademicInfo = () => {
  return (
    <div className="space-y-6">
      {/* Project Info */}
      <Card className="border-purple-200 bg-purple-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <GraduationCap className="w-5 h-5" />
            Informasi Proyek Akademis
          </CardTitle>
          <CardDescription>Tugas Ujian Akhir Semester (UAS) - Machine Learning</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-purple-800">Institusi:</span>
              <Badge variant="outline" className="text-purple-700 border-purple-300">STMIK YMI Tegal</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-semibold text-purple-800">Mata Kuliah:</span>
              <span className="text-purple-700">Machine Learning & Data Science</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-semibold text-purple-800">Jenis Tugas:</span>
              <Badge className="bg-purple-100 text-purple-800">Ujian Akhir Semester (UAS)</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-semibold text-purple-800">Developer:</span>
              <Badge variant="outline" className="text-purple-700 border-purple-300">@nourivex tech</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Members */}
      <Card className="border-indigo-200 bg-indigo-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-800">
            <Users className="w-5 h-5" />
            Tim Pengembang
          </CardTitle>
          <CardDescription>Anggota tim yang terlibat dalam pengembangan aplikasi</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Team Leader */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-indigo-200">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <Award className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-indigo-800">Muhammad Affif</h4>
                <p className="text-sm text-indigo-600">NIM: 24225046</p>
                <Badge size="sm" className="mt-1 bg-indigo-100 text-indigo-800">Ketua Tim</Badge>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="font-semibold text-indigo-800 mb-3">Anggota Tim:</h4>
              
              <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-indigo-200">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-indigo-600">1</span>
                </div>
                <div>
                  <h5 className="font-medium text-indigo-800">Arif Nur Syifa</h5>
                  <p className="text-sm text-indigo-600">NIM: 23215054</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-indigo-200">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-indigo-600">2</span>
                </div>
                <div>
                  <h5 className="font-medium text-indigo-800">Muhamad Djafar Ilyasa</h5>
                  <p className="text-sm text-indigo-600">NIM: 23215028</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-indigo-200">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-indigo-600">3</span>
                </div>
                <div>
                  <h5 className="font-medium text-indigo-800">Muhammad Yasir Ilhan Nabil</h5>
                  <p className="text-sm text-indigo-600">NIM: 23215040</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Information */}
      <Card className="border-slate-200 bg-slate-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <Code className="w-5 h-5" />
            Informasi Teknis
          </CardTitle>
          <CardDescription>Detail teknologi dan metodologi yang digunakan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-800">Model Machine Learning:</h4>
              <p className="text-slate-700">Logistic Regression (Optimized)</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-800">Backend Framework:</h4>
              <p className="text-slate-700">FastAPI (Python)</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-800">Frontend Framework:</h4>
              <p className="text-slate-700">React.js + TypeScript</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-800">UI Framework:</h4>
              <p className="text-slate-700">Tailwind CSS + shadcn/ui</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-800">Dataset:</h4>
              <p className="text-slate-700">Heart Disease Dataset</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-800">Tujuan:</h4>
              <p className="text-slate-700">Prediksi Risiko Penyakit Jantung</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
