import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function PuasaTrackerPage() {
  const { user } = useAuth();
  const { getPuasaEntry, updatePuasaEntry, getStats } = useData();
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [puasaEntry, setPuasaEntry] = useState(getPuasaEntry(selectedDate));
  
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [reason, setReason] = useState('');
  const [sahurTime, setSahurTime] = useState('');

  useEffect(() => {
    const entry = getPuasaEntry(selectedDate);
    setPuasaEntry(entry);
    setSahurTime(entry.sahurTime || '');
  }, [selectedDate]);

  const handleSahurToggle = (done: boolean) => {
    if (done && !sahurTime) {
      toast.error('Mohon isi waktu sahur terlebih dahulu');
      return;
    }

    const updated = {
      ...puasaEntry,
      sahur: done,
      sahurTime: done ? sahurTime : undefined,
    };
    setPuasaEntry(updated);
    updatePuasaEntry(updated);
    
    if (done) {
      toast.success(`Sahur jam ${sahurTime} tercatat! 🌙`);
    } else {
      toast.info('Status sahur diperbarui');
    }
  };

  const handlePuasaToggle = (done: boolean) => {
    if (!done) {
      setShowReasonModal(true);
    } else {
      const updated = {
        ...puasaEntry,
        puasa: true,
        reason: undefined,
      };
      setPuasaEntry(updated);
      updatePuasaEntry(updated);
      toast.success('Puasa hari ini tercatat! Semangat! 💪');
    }
  };

  const handleReasonSubmit = () => {
    if (!reason) {
      toast.error('Mohon pilih alasan');
      return;
    }

    // Check if female and reason is Haid - this is allowed
    const isAllowed = user?.gender === 'female' && reason === 'Haid';

    const updated = {
      ...puasaEntry,
      puasa: false,
      reason,
    };
    setPuasaEntry(updated);
    updatePuasaEntry(updated);
    
    if (isAllowed) {
      toast.info('Alasan dicatat. Semoga lekas sehat kembali 🤲');
    } else {
      toast.warning(`Alasan dicatat: ${reason}`);
    }
    
    setShowReasonModal(false);
    setReason('');
  };

  const stats = getStats();

  // Mazhab reminder
  const getMazhabReminder = () => {
    if (user?.mazhab === 'muhammadiyah') {
      return {
        imsak: '04:30',
        subuh: '04:40',
        berbuka: '18:05',
      };
    } else {
      return {
        imsak: '04:20',
        subuh: '04:30',
        berbuka: '18:05',
      };
    }
  };

  const times = getMazhabReminder();

  return (
    <div className="space-y-6 pb-20">
      {/* Date Selector */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100"
      >
        <label className="block text-sm font-medium text-emerald-700 mb-2">
          Pilih Tanggal
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
      </motion.div>

      {/* Mazhab Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl p-6 border border-purple-200"
      >
        <h3 className="text-lg font-bold text-purple-900 mb-3 flex items-center gap-2">
          <Clock className="text-purple-600" />
          Waktu Berdasarkan Mazhab {user?.mazhab.toUpperCase()}
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/70 rounded-xl p-3">
            <p className="text-xs text-purple-700 mb-1">Imsak</p>
            <p className="text-lg font-bold text-purple-900">{times.imsak}</p>
          </div>
          <div className="bg-white/70 rounded-xl p-3">
            <p className="text-xs text-purple-700 mb-1">Subuh</p>
            <p className="text-lg font-bold text-purple-900">{times.subuh}</p>
          </div>
          <div className="bg-white/70 rounded-xl p-3">
            <p className="text-xs text-purple-700 mb-1">Berbuka</p>
            <p className="text-lg font-bold text-purple-900">{times.berbuka}</p>
          </div>
        </div>
      </motion.div>

      {/* Sahur Tracker */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100"
      >
        <h3 className="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-2">
          <Moon className="text-indigo-500" />
          Sahur
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Waktu Sahur
            </label>
            <input
              type="time"
              value={sahurTime}
              onChange={(e) => setSahurTime(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className={`p-4 rounded-xl border-2 transition-all ${
            puasaEntry.sahur
              ? 'border-indigo-400 bg-indigo-50'
              : 'border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800">Status Sahur</p>
                {puasaEntry.sahur && puasaEntry.sahurTime && (
                  <p className="text-sm text-indigo-600 mt-1">Sahur jam {puasaEntry.sahurTime}</p>
                )}
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleSahurToggle(true)}
                  className={`p-2 rounded-lg ${
                    puasaEntry.sahur
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-100 text-gray-400 hover:bg-indigo-100 hover:text-indigo-600'
                  }`}
                >
                  <CheckCircle size={24} />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleSahurToggle(false)}
                  className={`p-2 rounded-lg ${
                    !puasaEntry.sahur
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-400 hover:bg-orange-100 hover:text-orange-600'
                  }`}
                >
                  <XCircle size={24} />
                </motion.button>
              </div>
            </div>
          </div>

          {!puasaEntry.sahur && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-3">
              <p className="text-sm text-orange-700">
                ⚠️ Tidak sahur dapat mengurangi stamina puasa. Pastikan tubuh tetap terhidrasi!
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Puasa Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100"
      >
        <h3 className="text-xl font-bold text-emerald-800 mb-4">Status Puasa Hari Ini</h3>

        <div className={`p-6 rounded-xl border-2 transition-all ${
          puasaEntry.puasa
            ? 'border-emerald-400 bg-emerald-50'
            : puasaEntry.reason
            ? 'border-red-300 bg-red-50'
            : 'border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <p className="text-lg font-semibold text-gray-800">Apakah puasa hari ini?</p>
              {puasaEntry.reason && (
                <div className="mt-2">
                  <p className="text-sm text-red-600">Alasan: {puasaEntry.reason}</p>
                  {user?.gender === 'female' && puasaEntry.reason === 'Haid' && (
                    <p className="text-xs text-gray-500 mt-1">
                      ✓ Haid adalah alasan yang sah untuk tidak berpuasa
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handlePuasaToggle(true)}
              className={`flex-1 py-4 rounded-xl font-semibold transition-all ${
                puasaEntry.puasa
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : 'bg-emerald-100 text-emerald-700 border-2 border-emerald-300'
              }`}
            >
              ✓ Ya, Puasa
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handlePuasaToggle(false)}
              className={`flex-1 py-4 rounded-xl font-semibold transition-all ${
                puasaEntry.reason
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'bg-red-100 text-red-700 border-2 border-red-300'
              }`}
            >
              ✗ Tidak Puasa
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 shadow-xl text-white"
      >
        <h3 className="text-lg font-semibold mb-4">Total Puasa Ramadhan</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-5xl font-bold">{stats.totalPuasa}</p>
            <p className="text-purple-200 mt-1">hari puasa sempurna</p>
          </div>
          <Moon size={64} className="text-purple-300 opacity-50" />
        </div>
        <div className="mt-4 bg-white/20 rounded-xl p-3">
          <p className="text-sm text-purple-100">
            Tersisa: {30 - stats.totalPuasa} hari lagi menuju Ramadhan sempurna! 💪
          </p>
        </div>
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border-l-4 border-amber-500"
      >
        <h4 className="font-semibold text-amber-800 mb-2">💡 Tips Puasa Sehat</h4>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>• Sahur dengan makanan bergizi dan cukup air putih</li>
          <li>• Hindari makanan terlalu manis atau asin saat berbuka</li>
          <li>• Istirahat cukup dan jaga pola tidur</li>
          <li>• Perbanyak ibadah dan dzikir di waktu luang</li>
        </ul>
      </motion.div>

      {/* Reason Modal */}
      <AnimatePresence>
        {showReasonModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowReasonModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Alasan Tidak Puasa</h3>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 mb-4 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                <option value="">Pilih alasan...</option>
                {user?.gender === 'female' && <option value="Haid">Haid</option>}
                <option value="Sakit">Sakit</option>
                <option value="Safar">Safar (Bepergian)</option>
                <option value="Lainnya">Lainnya</option>
              </select>
              
              {user?.gender === 'female' && reason === 'Haid' && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-sm text-blue-700">
                    ℹ️ Haid adalah alasan yang sah untuk tidak berpuasa dan wajib mengqadha di hari lain.
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => setShowReasonModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-300 font-medium"
                >
                  Batal
                </button>
                <button
                  onClick={handleReasonSubmit}
                  disabled={!reason}
                  className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-medium disabled:opacity-50"
                >
                  Simpan
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
