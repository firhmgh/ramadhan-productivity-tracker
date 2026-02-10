import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, XCircle, Plus, BookOpen, Heart, Sun } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function DailyTrackerPage() {
  const { user } = useAuth();
  const {
    getSholatEntry,
    updateSholatEntry,
    getSholatSunnahEntry,
    updateSholatSunnahEntry,
    getTilawahEntries,
    addTilawahEntry,
    getSedekahEntries,
    addSedekahEntry,
  } = useData();

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Sholat Wajib
  const [sholatEntry, setSholatEntry] = useState(getSholatEntry(selectedDate));
  
  // Sholat Sunnah
  const [sunnahEntry, setSunnahEntry] = useState(getSholatSunnahEntry(selectedDate));
  
  // Modals
  const [showReasonModal, setShowReasonModal] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  
  // Tilawah Modal
  const [showTilawahModal, setShowTilawahModal] = useState(false);
  const [tilawahSurah, setTilawahSurah] = useState('');
  const [tilawahFromAyah, setTilawahFromAyah] = useState('');
  const [tilawahToAyah, setTilawahToAyah] = useState('');
  
  // Sedekah Modal
  const [showSedekahModal, setShowSedekahModal] = useState(false);
  const [sedekahAmount, setSedekahAmount] = useState('');
  const [sedekahMethod, setSedekahMethod] = useState<'masjid' | 'online' | 'direct'>('masjid');
  const [sedekahNotes, setSedekahNotes] = useState('');
  
  // Dhuha rakaat
  const [dhuhaRakaat, setDhuhaRakaat] = useState(2);

  useEffect(() => {
    setSholatEntry(getSholatEntry(selectedDate));
    setSunnahEntry(getSholatSunnahEntry(selectedDate));
  }, [selectedDate]);

  const handleSholatToggle = (prayer: keyof typeof sholatEntry, isDone: boolean) => {
    if (!isDone) {
      setShowReasonModal(prayer as string);
    } else {
      const updated = {
        ...sholatEntry,
        [prayer]: { done: true },
      };
      setSholatEntry(updated);
      updateSholatEntry(updated);
      toast.success(`${prayer} berhasil dicatat! ✅`);
    }
  };

  const handleReasonSubmit = () => {
    if (!showReasonModal) return;
    
    const updated = {
      ...sholatEntry,
      [showReasonModal]: { done: false, reason },
    };
    setSholatEntry(updated);
    updateSholatEntry(updated);
    toast.info(`Alasan dicatat: ${reason}`);
    setShowReasonModal(null);
    setReason('');
  };

  const handleDhuhaToggle = (done: boolean) => {
    if (done) {
      const updated = {
        ...sunnahEntry,
        dhuha: { done: true, rakaat: dhuhaRakaat },
      };
      setSunnahEntry(updated);
      updateSholatSunnahEntry(updated);
      toast.success(`Sholat Dhuha ${dhuhaRakaat} rakaat tercatat! 🌟`);
    } else {
      const updated = {
        ...sunnahEntry,
        dhuha: { done: false },
      };
      setSunnahEntry(updated);
      updateSholatSunnahEntry(updated);
    }
  };

  const handleSunnahToggle = (type: 'tahajud' | 'witir', done: boolean) => {
    const updated = {
      ...sunnahEntry,
      [type]: { done },
    };
    setSunnahEntry(updated);
    updateSholatSunnahEntry(updated);
    if (done) toast.success(`Sholat ${type} tercatat! ✨`);
  };

  const handleTilawahSubmit = () => {
    const from = parseInt(tilawahFromAyah);
    const to = parseInt(tilawahToAyah);
    
    if (!tilawahSurah || !from || !to || from > to) {
      toast.error('Mohon lengkapi data dengan benar');
      return;
    }

    const ayahCount = to - from + 1;
    
    addTilawahEntry({
      date: selectedDate,
      surah: tilawahSurah,
      fromAyah: from,
      toAyah: to,
      ayahCount,
      timestamp: new Date().toISOString(),
    });

    toast.success(`Tilawah ${ayahCount} ayat tercatat! 📖`);
    setShowTilawahModal(false);
    setTilawahSurah('');
    setTilawahFromAyah('');
    setTilawahToAyah('');
  };

  const handleSedekahSubmit = () => {
    const amount = parseFloat(sedekahAmount);
    
    if (!amount || amount <= 0) {
      toast.error('Jumlah sedekah tidak valid');
      return;
    }

    addSedekahEntry({
      date: selectedDate,
      amount,
      method: sedekahMethod,
      notes: sedekahNotes,
      timestamp: new Date().toISOString(),
    });

    toast.success(`Sedekah Rp ${amount.toLocaleString('id-ID')} tercatat! 💝`);
    setShowSedekahModal(false);
    setSedekahAmount('');
    setSedekahNotes('');
  };

  const tilawahEntries = getTilawahEntries(selectedDate);
  const sedekahEntries = getSedekahEntries(selectedDate);

  const prayerNames = {
    subuh: 'Subuh',
    dzuhur: 'Dzuhur',
    ashar: 'Ashar',
    maghrib: 'Maghrib',
    isya: 'Isya',
  };

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

      {/* Sholat Wajib */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100"
      >
        <h3 className="text-xl font-bold text-emerald-800 mb-4">Sholat Wajib</h3>
        <div className="space-y-3">
          {Object.entries(prayerNames).map(([key, name]) => {
            const prayer = sholatEntry[key as keyof typeof sholatEntry] as { done: boolean; reason?: string };
            return (
              <motion.div
                key={key}
                whileHover={{ scale: 1.01 }}
                className={`p-4 rounded-xl border-2 transition-all ${
                  prayer.done
                    ? 'border-emerald-400 bg-emerald-50'
                    : prayer.reason
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{name}</p>
                    {prayer.reason && (
                      <p className="text-sm text-red-600 mt-1">Alasan: {prayer.reason}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleSholatToggle(key as any, true)}
                      className={`p-2 rounded-lg ${
                        prayer.done
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-100 text-gray-400 hover:bg-emerald-100 hover:text-emerald-600'
                      }`}
                    >
                      <CheckCircle size={24} />
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleSholatToggle(key as any, false)}
                      className={`p-2 rounded-lg ${
                        prayer.reason
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-600'
                      }`}
                    >
                      <XCircle size={24} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Sholat Sunnah */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100"
      >
        <h3 className="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-2">
          <Sun className="text-amber-500" />
          Sholat Sunnah
        </h3>
        
        {/* Dhuha */}
        <div className="mb-4 p-4 rounded-xl bg-amber-50 border border-amber-200">
          <div className="flex items-center justify-between mb-2">
            <p className="font-semibold text-gray-800">Dhuha</p>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handleDhuhaToggle(!sunnahEntry.dhuha.done)}
              className={`px-4 py-2 rounded-lg font-medium ${
                sunnahEntry.dhuha.done
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white text-emerald-600 border border-emerald-300'
              }`}
            >
              {sunnahEntry.dhuha.done ? '✓ Sudah' : 'Belum'}
            </motion.button>
          </div>
          {sunnahEntry.dhuha.done ? (
            <p className="text-sm text-gray-600">{sunnahEntry.dhuha.rakaat} rakaat</p>
          ) : (
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Rakaat:</label>
              <select
                value={dhuhaRakaat}
                onChange={(e) => setDhuhaRakaat(parseInt(e.target.value))}
                className="px-3 py-1 rounded-lg border border-amber-300 text-sm"
              >
                <option value={2}>2</option>
                <option value={4}>4</option>
                <option value={6}>6</option>
                <option value={8}>8</option>
                <option value={12}>12</option>
              </select>
            </div>
          )}
        </div>

        {/* Tahajud & Witir */}
        <div className="space-y-2">
          {(['tahajud', 'witir'] as const).map((type) => (
            <div
              key={type}
              className={`p-3 rounded-lg border flex items-center justify-between ${
                sunnahEntry[type].done ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <p className="font-medium text-gray-700 capitalize">{type}</p>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleSunnahToggle(type, !sunnahEntry[type].done)}
                className={`px-4 py-1 rounded-lg text-sm font-medium ${
                  sunnahEntry[type].done
                    ? 'bg-purple-500 text-white'
                    : 'bg-white text-purple-600 border border-purple-300'
                }`}
              >
                {sunnahEntry[type].done ? '✓' : '○'}
              </motion.button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Tilawah */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-emerald-800 flex items-center gap-2">
            <BookOpen className="text-blue-500" />
            Tilawah
          </h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowTilawahModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium"
          >
            <Plus size={20} />
            Tambah
          </motion.button>
        </div>

        {tilawahEntries.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Belum ada tilawah hari ini</p>
        ) : (
          <div className="space-y-2">
            {tilawahEntries.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 rounded-xl bg-blue-50 border border-blue-200"
              >
                <p className="font-semibold text-blue-900">{entry.surah}</p>
                <p className="text-sm text-blue-700">
                  Ayat {entry.fromAyah} - {entry.toAyah} ({entry.ayahCount} ayat)
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Sedekah */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-emerald-800 flex items-center gap-2">
            <Heart className="text-pink-500" />
            Sedekah
          </h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSedekahModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg font-medium"
          >
            <Plus size={20} />
            Tambah
          </motion.button>
        </div>

        {sedekahEntries.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Belum ada sedekah hari ini</p>
        ) : (
          <div className="space-y-2">
            {sedekahEntries.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 rounded-xl bg-pink-50 border border-pink-200"
              >
                <p className="font-semibold text-pink-900">
                  Rp {entry.amount.toLocaleString('id-ID')}
                </p>
                <p className="text-sm text-pink-700 capitalize">Via: {entry.method}</p>
                {entry.notes && <p className="text-sm text-pink-600 mt-1">{entry.notes}</p>}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Reason Modal */}
      <AnimatePresence>
        {showReasonModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowReasonModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Alasan Tidak Sholat</h3>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <option value="">Pilih alasan...</option>
                <option value="Lupa">Lupa</option>
                <option value="Haid">Haid</option>
                <option value="Sakit">Sakit</option>
                <option value="Safar">Safar</option>
                <option value="Lainnya">Lainnya</option>
              </select>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowReasonModal(null)}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-300 font-medium"
                >
                  Batal
                </button>
                <button
                  onClick={handleReasonSubmit}
                  disabled={!reason}
                  className="flex-1 px-4 py-3 rounded-xl bg-emerald-500 text-white font-medium disabled:opacity-50"
                >
                  Simpan
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tilawah Modal */}
      <AnimatePresence>
        {showTilawahModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowTilawahModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Tambah Tilawah</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Surah / Juz
                  </label>
                  <input
                    type="text"
                    value={tilawahSurah}
                    onChange={(e) => setTilawahSurah(e.target.value)}
                    placeholder="Contoh: Al-Baqarah atau Juz 1"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dari Ayat
                    </label>
                    <input
                      type="number"
                      value={tilawahFromAyah}
                      onChange={(e) => setTilawahFromAyah(e.target.value)}
                      placeholder="1"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sampai Ayat
                    </label>
                    <input
                      type="number"
                      value={tilawahToAyah}
                      onChange={(e) => setTilawahToAyah(e.target.value)}
                      placeholder="10"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setShowTilawahModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-300 font-medium"
                >
                  Batal
                </button>
                <button
                  onClick={handleTilawahSubmit}
                  className="flex-1 px-4 py-3 rounded-xl bg-blue-500 text-white font-medium"
                >
                  Simpan
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sedekah Modal */}
      <AnimatePresence>
        {showSedekahModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSedekahModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Tambah Sedekah</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jumlah (Rp)
                  </label>
                  <input
                    type="number"
                    value={sedekahAmount}
                    onChange={(e) => setSedekahAmount(e.target.value)}
                    placeholder="10000"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Metode
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['masjid', 'online', 'direct'] as const).map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setSedekahMethod(method)}
                        className={`py-2 rounded-xl border-2 capitalize transition-all ${
                          sedekahMethod === method
                            ? 'border-pink-500 bg-pink-50 text-pink-700 font-semibold'
                            : 'border-gray-200 text-gray-600'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catatan (Opsional)
                  </label>
                  <textarea
                    value={sedekahNotes}
                    onChange={(e) => setSedekahNotes(e.target.value)}
                    placeholder="Untuk..."
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setShowSedekahModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-300 font-medium"
                >
                  Batal
                </button>
                <button
                  onClick={handleSedekahSubmit}
                  className="flex-1 px-4 py-3 rounded-xl bg-pink-500 text-white font-medium"
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
