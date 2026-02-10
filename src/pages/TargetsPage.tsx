import { useState } from 'react';
import { useData } from '../context/DataContext';
import { motion } from 'motion/react';
import { Target, CheckCircle, Save } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function TargetsPage() {
  const { targets, setTargets } = useData();
  
  const [sholatTepat, setSholatTepat] = useState(targets.sholatTepat);
  const [tilawahHarian, setTilawahHarian] = useState(targets.tilawahHarian);
  const [sedekahHarian, setSedekahHarian] = useState(targets.sedekahHarian);
  const [puasaPenuh, setPuasaPenuh] = useState(targets.puasaPenuh);
  const [tilawahAyahTarget, setTilawahAyahTarget] = useState(targets.tilawahAyahTarget?.toString() || '');
  const [sedekahAmountTarget, setSedekahAmountTarget] = useState(targets.sedekahAmountTarget?.toString() || '');

  const handleSave = () => {
    const newTargets = {
      sholatTepat,
      tilawahHarian,
      sedekahHarian,
      puasaPenuh,
      tilawahAyahTarget: tilawahHarian && tilawahAyahTarget ? parseInt(tilawahAyahTarget) : undefined,
      sedekahAmountTarget: sedekahHarian && sedekahAmountTarget ? parseFloat(sedekahAmountTarget) : undefined,
    };

    setTargets(newTargets);
    toast.success('Target berhasil disimpan! 🎯');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-3xl p-8 text-white shadow-xl"
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Target Harian</h2>
            <p className="text-teal-100">
              Tentukan target ibadah yang ingin dicapai
            </p>
          </div>
          <Target size={48} className="text-teal-300 opacity-50" />
        </div>
      </motion.div>

      {/* Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-50 border-l-4 border-blue-500 rounded-xl p-5"
      >
        <p className="text-blue-800 text-sm">
          💡 <strong>Tip:</strong> Pilih target yang realistis dan sesuai dengan kemampuan Anda. 
          Target yang aktif akan muncul di dashboard dan membantu Anda tetap fokus pada ibadah.
        </p>
      </motion.div>

      {/* Target Cards */}
      <div className="space-y-4">
        {/* Sholat Tepat Waktu */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`bg-white rounded-2xl p-6 shadow-lg border-2 transition-all ${
            sholatTepat ? 'border-emerald-400' : 'border-gray-200'
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Sholat Tepat Waktu</h3>
              <p className="text-sm text-gray-600">
                Melaksanakan sholat 5 waktu di awal waktu
              </p>
            </div>
            <button
              onClick={() => setSholatTepat(!sholatTepat)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                sholatTepat ? 'bg-emerald-500' : 'bg-gray-300'
              }`}
            >
              <motion.div
                animate={{ x: sholatTepat ? 28 : 2 }}
                className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
              />
            </button>
          </div>
          {sholatTepat && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl"
            >
              <CheckCircle className="text-emerald-600" size={20} />
              <span className="text-sm text-emerald-700 font-medium">Target aktif</span>
            </motion.div>
          )}
        </motion.div>

        {/* Tilawah Harian */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className={`bg-white rounded-2xl p-6 shadow-lg border-2 transition-all ${
            tilawahHarian ? 'border-blue-400' : 'border-gray-200'
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Tilawah Harian</h3>
              <p className="text-sm text-gray-600">
                Membaca Al-Quran setiap hari
              </p>
            </div>
            <button
              onClick={() => setTilawahHarian(!tilawahHarian)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                tilawahHarian ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <motion.div
                animate={{ x: tilawahHarian ? 28 : 2 }}
                className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
              />
            </button>
          </div>
          {tilawahHarian && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-3"
            >
              <div className="p-3 bg-blue-50 rounded-xl">
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Target ayat per hari (opsional)
                </label>
                <input
                  type="number"
                  value={tilawahAyahTarget}
                  onChange={(e) => setTilawahAyahTarget(e.target.value)}
                  placeholder="Contoh: 20"
                  min="1"
                  className="w-full px-4 py-2 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <p className="text-xs text-blue-600 mt-2">
                  Kosongkan jika tidak ingin menentukan target spesifik
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Sedekah Harian */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className={`bg-white rounded-2xl p-6 shadow-lg border-2 transition-all ${
            sedekahHarian ? 'border-pink-400' : 'border-gray-200'
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Sedekah Harian</h3>
              <p className="text-sm text-gray-600">
                Bersedekah setiap hari selama Ramadhan
              </p>
            </div>
            <button
              onClick={() => setSedekahHarian(!sedekahHarian)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                sedekahHarian ? 'bg-pink-500' : 'bg-gray-300'
              }`}
            >
              <motion.div
                animate={{ x: sedekahHarian ? 28 : 2 }}
                className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
              />
            </button>
          </div>
          {sedekahHarian && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-3"
            >
              <div className="p-3 bg-pink-50 rounded-xl">
                <label className="block text-sm font-medium text-pink-700 mb-2">
                  Target nominal per hari (opsional)
                </label>
                <input
                  type="number"
                  value={sedekahAmountTarget}
                  onChange={(e) => setSedekahAmountTarget(e.target.value)}
                  placeholder="Contoh: 10000"
                  min="0"
                  className="w-full px-4 py-2 rounded-lg border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
                <p className="text-xs text-pink-600 mt-2">
                  Kosongkan jika tidak ingin menentukan target spesifik
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Puasa Penuh */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className={`bg-white rounded-2xl p-6 shadow-lg border-2 transition-all ${
            puasaPenuh ? 'border-purple-400' : 'border-gray-200'
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Puasa Penuh</h3>
              <p className="text-sm text-gray-600">
                Menyelesaikan puasa 30 hari Ramadhan
              </p>
            </div>
            <button
              onClick={() => setPuasaPenuh(!puasaPenuh)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                puasaPenuh ? 'bg-purple-500' : 'bg-gray-300'
              }`}
            >
              <motion.div
                animate={{ x: puasaPenuh ? 28 : 2 }}
                className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
              />
            </button>
          </div>
          {puasaPenuh && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-center gap-2 p-3 bg-purple-50 rounded-xl"
            >
              <CheckCircle className="text-purple-600" size={20} />
              <span className="text-sm text-purple-700 font-medium">Target aktif</span>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Save Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSave}
        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-2xl font-semibold shadow-lg flex items-center justify-center gap-2"
      >
        <Save size={24} />
        Simpan Target
      </motion.button>

      {/* Active Targets Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-6 border border-amber-200"
      >
        <h3 className="text-lg font-bold text-amber-900 mb-4">Target yang Aktif</h3>
        <div className="space-y-2">
          {sholatTepat && (
            <div className="flex items-center gap-2 text-emerald-700">
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
              <span className="font-medium">Sholat Tepat Waktu</span>
            </div>
          )}
          {tilawahHarian && (
            <div className="flex items-center gap-2 text-blue-700">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span className="font-medium">
                Tilawah Harian {tilawahAyahTarget && `(${tilawahAyahTarget} ayat/hari)`}
              </span>
            </div>
          )}
          {sedekahHarian && (
            <div className="flex items-center gap-2 text-pink-700">
              <div className="w-2 h-2 bg-pink-500 rounded-full" />
              <span className="font-medium">
                Sedekah Harian {sedekahAmountTarget && `(Rp ${parseFloat(sedekahAmountTarget).toLocaleString('id-ID')}/hari)`}
              </span>
            </div>
          )}
          {puasaPenuh && (
            <div className="flex items-center gap-2 text-purple-700">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              <span className="font-medium">Puasa Penuh 30 Hari</span>
            </div>
          )}
          {!sholatTepat && !tilawahHarian && !sedekahHarian && !puasaPenuh && (
            <p className="text-amber-700 text-sm italic">Belum ada target yang aktif</p>
          )}
        </div>
      </motion.div>

      {/* Motivational Quote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-6 border-l-4 border-emerald-500"
      >
        <p className="text-emerald-800 italic text-center">
          "Sebaik-baik target adalah yang konsisten, bukan yang besar tapi tidak terlaksana."
        </p>
      </motion.div>
    </div>
  );
}
