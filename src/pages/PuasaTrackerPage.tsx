import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase'; // Import supabase untuk fetch imsakiyah
import { motion, AnimatePresence } from 'motion/react';
import { Moon, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

export function PuasaTrackerPage() {
  const { user } = useAuth();
  const { getPuasaEntry, updatePuasaEntry, getStats } = useData();
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [puasaEntry, setPuasaEntry] = useState(getPuasaEntry(selectedDate));
  
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [reason, setReason] = useState('');
  const [sahurTime, setSahurTime] = useState('');
  
  // State untuk menyimpan data imsakiyah dari database
  const [imsakiyahData, setImsakiyahData] = useState<any>(null);

  // Effect untuk mengambil data puasa dan imsakiyah saat tanggal berubah
  useEffect(() => {
    const entry = getPuasaEntry(selectedDate);
    setPuasaEntry(entry);
    setSahurTime(entry.sahurTime || '');
    fetchImsakiyah();
  }, [selectedDate, user?.mazhab]);

  // Fungsi Fetch Imsakiyah dari Database
  const fetchImsakiyah = async () => {
    try {
      const table = user?.mazhab === 'muhammadiyah' ? 'imsakiyah_muhammadiyah' : 'imsakiyah_nu';
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('tanggal_masehi', selectedDate)
        .maybeSingle();

      if (error) throw error;
      setImsakiyahData(data);
    } catch (error) {
      console.error("Error fetching imsakiyah:", error);
    }
  };

  const handleSahurToggle = (done: boolean) => {
    if (done && !sahurTime) {
      toast.error('Mohon isi waktu sahur terlebih dahulu');
      return;
    }

    const updated = {
      ...puasaEntry,
      date: selectedDate, // Pastikan tanggal ikut terupdate
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
        date: selectedDate,
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

    const isAllowed = user?.gender === 'female' && reason === 'Haid';

    const updated = {
      ...puasaEntry,
      date: selectedDate,
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

      {/* Mazhab Info - Terintegrasi Database */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl p-6 border border-purple-200"
      >
        <h3 className="text-lg font-bold text-purple-900 mb-3 flex items-center gap-2">
          <Clock className="text-purple-600" />
          Waktu Berdasarkan Mazhab {user?.mazhab?.toUpperCase() || 'NU'}
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/70 rounded-xl p-3 text-center">
            <p className="text-xs text-purple-700 mb-1">Imsak</p>
            <p className="text-lg font-bold text-purple-900">
              {imsakiyahData?.imsak?.substring(0, 5) || '--:--'}
            </p>
          </div>
          <div className="bg-white/70 rounded-xl p-3 text-center">
            <p className="text-xs text-purple-700 mb-1">Subuh</p>
            <p className="text-lg font-bold text-purple-900">
              {imsakiyahData?.shubuh?.substring(0, 5) || '--:--'}
            </p>
          </div>
          <div className="bg-white/70 rounded-xl p-3 text-center">
            <p className="text-xs text-purple-700 mb-1">Berbuka</p>
            <p className="text-lg font-bold text-purple-900">
              {imsakiyahData?.maghrib?.substring(0, 5) || '--:--'}
            </p>
          </div>
        </div>
        {!imsakiyahData && (
          <p className="text-[10px] text-purple-500 mt-2 italic text-center">
            *Data jadwal untuk tanggal ini belum tersedia di database
          </p>
        )}
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
                className="w-full px-4 py-3 rounded-xl border border-gray-300 mb-4"
              >
                <option value="">Pilih alasan...</option>
                {user?.gender === 'female' && <option value="Haid">Haid</option>}
                <option value="Sakit">Sakit</option>
                <option value="Safar">Safar (Bepergian)</option>
                <option value="Lainnya">Lainnya</option>
              </select>
              
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