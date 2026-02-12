import { useState, useEffect } from 'react';
import { useData, SholatEntry, TilawahEntry, SedekahEntry } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, XCircle, Plus, BookOpen, Heart, Sun, MessageSquare, Mic2, Info, Trash2, Pencil } from 'lucide-react';
import { toast } from 'sonner';

type WajibKeys = 'subuh' | 'dzuhur' | 'ashar' | 'maghrib' | 'isya';

export function DailyTrackerPage() {
  const { user } = useAuth();
  const {
    getSholatEntry, updateSholatEntry, getSholatSunnahEntry, updateSholatSunnahEntry,
    getTilawahEntries, addTilawahEntry, updateTilawahEntry, deleteTilawahEntry,
    getSedekahEntries, addSedekahEntry, updateSedekahEntry, deleteSedekahEntry,
    getWeeklyEntry, updateWeeklyEntry, loading
  } = useData();

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [sholatEntry, setSholatEntry] = useState(getSholatEntry(selectedDate));
  const [sunnahEntry, setSunnahEntry] = useState(getSholatSunnahEntry(selectedDate));
  
  const isFriday = new Date(selectedDate).getDay() === 5;
  const startRamadhan = new Date('2026-02-18'); 
  const diffDays = Math.floor((new Date(selectedDate).getTime() - startRamadhan.getTime()) / (1000 * 3600 * 24));
  const currentWeek = diffDays < 0 ? 1 : Math.max(1, Math.ceil((diffDays + 1) / 7));
  const [weeklyEntry, setWeeklyEntry] = useState(getWeeklyEntry(currentWeek));

  // Modals & Forms State
  const [showReasonModal, setShowReasonModal] = useState<WajibKeys | null>(null);
  const [reason, setReason] = useState('');
  
  const [showTilawahModal, setShowTilawahModal] = useState(false);
  const [editingTilawahId, setEditingTilawahId] = useState<string | null>(null);
  const [tilawahSurah, setTilawahSurah] = useState('');
  const [tilawahFromAyah, setTilawahFromAyah] = useState('');
  const [tilawahToAyah, setTilawahToAyah] = useState('');

  const [showSedekahModal, setShowSedekahModal] = useState(false);
  const [editingSedekahId, setEditingSedekahId] = useState<string | null>(null);
  const [sedekahAmount, setSedekahAmount] = useState('');
  const [sedekahMethod, setSedekahMethod] = useState<'masjid' | 'online' | 'direct'>('masjid');
  const [sedekahNotes, setSedekahNotes] = useState('');

  // Rakaat State
  const [dhuhaRakaat, setDhuhaRakaat] = useState(2);
  const [tarawihRakaat, setTarawihRakaat] = useState(8);
  const [tahajudRakaat, setTahajudRakaat] = useState(2);
  const [witirRakaat, setWitirRakaat] = useState(3);

  useEffect(() => {
    setSholatEntry(getSholatEntry(selectedDate));
    setSunnahEntry(getSholatSunnahEntry(selectedDate));
    if (isFriday) setWeeklyEntry(getWeeklyEntry(currentWeek));
  }, [selectedDate, loading, getSholatEntry, getSholatSunnahEntry, getWeeklyEntry, isFriday, currentWeek]);

  // --- LOGIC SHOLAT ---
  const handleSholatToggle = (prayer: WajibKeys, type: 'done' | 'missed') => {
    const current = sholatEntry[prayer];
    let updated: SholatEntry;

    if (type === 'done') {
      if (current.done) {
        updated = { ...sholatEntry, [prayer]: { done: false, reason: '' } };
        toast.info(`Status ${prayer} di-reset`);
      } else {
        updated = { ...sholatEntry, [prayer]: { done: true, reason: '' } };
        toast.success(`${prayer} dicatat! ✅`);
      }
      setSholatEntry(updated);
      updateSholatEntry(updated);
    } else {
      if (current.reason) {
        updated = { ...sholatEntry, [prayer]: { done: false, reason: '' } };
        setSholatEntry(updated);
        updateSholatEntry(updated);
        toast.info(`Status ${prayer} di-reset`);
      } else { setShowReasonModal(prayer); }
    }
  };

  const handleReasonSubmit = () => {
    if (!showReasonModal) return;
    const updated = { ...sholatEntry, [showReasonModal]: { done: false, reason } };
    setSholatEntry(updated);
    updateSholatEntry(updated);
    setShowReasonModal(null);
    setReason('');
  };

  // --- LOGIC TILAWAH ---
  const handleEditTilawah = (entry: TilawahEntry) => {
    setEditingTilawahId(entry.id);
    setTilawahSurah(entry.surah);
    setTilawahFromAyah(entry.fromAyah.toString());
    setTilawahToAyah(entry.toAyah.toString());
    setShowTilawahModal(true);
  };

  const handleTilawahSubmit = async () => {
    const from = parseInt(tilawahFromAyah);
    const to = parseInt(tilawahToAyah);
    const data = { date: selectedDate, surah: tilawahSurah, fromAyah: from, toAyah: to, ayahCount: to - from + 1, timestamp: new Date().toISOString() };
    
    if (editingTilawahId) { await updateTilawahEntry(editingTilawahId, data); } 
    else { await addTilawahEntry(data); toast.success("Tilawah dicatat! 📖"); }
    
    setShowTilawahModal(false); setEditingTilawahId(null);
    setTilawahSurah(''); setTilawahFromAyah(''); setTilawahToAyah('');
  };

  // --- LOGIC SEDEKAH ---
  const handleEditSedekah = (entry: SedekahEntry) => {
    setEditingSedekahId(entry.id);
    setSedekahAmount(entry.amount.toString());
    setSedekahMethod(entry.method);
    setSedekahNotes(entry.notes || '');
    setShowSedekahModal(true);
  };

  const handleSedekahSubmit = async () => {
    const data = { date: selectedDate, amount: parseFloat(sedekahAmount), method: sedekahMethod, notes: sedekahNotes, timestamp: new Date().toISOString() };
    
    if (editingSedekahId) { await updateSedekahEntry(editingSedekahId, data); } 
    else { await addSedekahEntry(data); toast.success("Sedekah dicatat! 💖"); }
    
    setShowSedekahModal(false); setEditingSedekahId(null);
    setSedekahAmount(''); setSedekahNotes('');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Date Picker */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100">
        <label className="block text-sm font-medium text-emerald-700 mb-2">Pilih Tanggal</label>
        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
      </motion.div>
      
      {/* SHOLAT WAJIB */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100">
        <h3 className="text-xl font-bold text-emerald-800 mb-4">Sholat Wajib</h3>
        <div className="space-y-3">
          {(['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'] as WajibKeys[]).map((key) => {
            const prayer = sholatEntry[key];
            return (
              <div key={key} className={`p-4 rounded-xl border-2 transition-all ${prayer.done ? 'border-emerald-400 bg-emerald-50' : prayer.reason ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 capitalize">{key}</p>
                    {prayer.reason && <p className="text-xs text-red-600 mt-1">Alasan: {prayer.reason}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleSholatToggle(key, 'done')} className={`p-2 rounded-lg transition-colors ${prayer.done ? 'bg-emerald-500 text-white shadow-md' : 'bg-gray-100 text-gray-400 hover:bg-emerald-100'}`}><CheckCircle size={24} /></button>
                    <button onClick={() => handleSholatToggle(key, 'missed')} className={`p-2 rounded-lg transition-colors ${prayer.reason ? 'bg-red-500 text-white shadow-md' : 'bg-gray-100 text-gray-400 hover:bg-red-100'}`}><XCircle size={24} /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* JUMAT SECTION */}
      {isFriday && user?.gender === 'male' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-xl"><Mic2 size={22} className="text-emerald-600" /></div>
              <div><h3 className="text-xl font-bold text-emerald-800">Ibadah Jumat</h3><p className="text-xs text-emerald-600">Pekan {currentWeek}</p></div>
            </div>
          </div>
          <div className={`p-4 rounded-2xl border-2 flex items-center justify-between ${weeklyEntry.sholatJumat ? 'border-emerald-500 bg-emerald-50/50' : 'border-gray-100 bg-gray-50/30'}`}>
            <p className="font-bold text-gray-800">Sholat Jumat</p>
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => {
              const done = !weeklyEntry.sholatJumat;
              updateWeeklyEntry({...weeklyEntry, sholatJumat: done});
              updateSholatEntry({...sholatEntry, dzuhur: { done, reason: done ? 'Sholat Jumat' : '' }});
            }} className={`p-2 rounded-xl ${weeklyEntry.sholatJumat ? 'bg-emerald-500 text-white shadow-md' : 'bg-white text-gray-300 border border-gray-200'}`}><CheckCircle size={28} /></motion.button>
          </div>
          {weeklyEntry.sholatJumat && (
            <div className="mt-4 p-4 rounded-2xl border-2 border-emerald-100 bg-emerald-50/30">
              <textarea value={weeklyEntry.khutbahTopic || ''} onChange={(e) => updateWeeklyEntry({...weeklyEntry, khutbahTopic: e.target.value})} placeholder="Catatan hikmah khutbah..." className="w-full bg-transparent text-sm focus:outline-none resize-none" rows={2} />
            </div>
          )}
        </motion.div>
      )}

      {/* SUNNAH SECTION */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100">
        <h3 className="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-2"><Sun className="text-amber-200" /> Sholat Sunnah</h3>
        <div className="space-y-4">
          {(['dhuha', 'tarawih', 'tahajud', 'witir'] as const).map(type => (
            <div key={type} className={`p-4 rounded-xl border-2 ${sunnahEntry[type].done ? 'border-amber-200 bg-amber-50' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-gray-800 capitalize">{type}</p>
                <button onClick={() => {
                  let r = type === 'dhuha' ? dhuhaRakaat : type === 'tarawih' ? tarawihRakaat : type === 'tahajud' ? tahajudRakaat : witirRakaat;
                  updateSholatSunnahEntry({...sunnahEntry, [type]: { done: !sunnahEntry[type].done, rakaat: !sunnahEntry[type].done ? r : undefined }});
                }} className={`px-4 py-2 rounded-lg font-medium ${sunnahEntry[type].done ? 'bg-amber-500 text-white' : 'bg-white border text-gray-600'}`}>{sunnahEntry[type].done ? 'Sudah' : 'Belum'}</button>
              </div>
              {!sunnahEntry[type].done && (
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-500">Rakaat:</label>
                  <select value={type === 'dhuha' ? dhuhaRakaat : type === 'tarawih' ? tarawihRakaat : type === 'tahajud' ? tahajudRakaat : witirRakaat} onChange={(e) => {
                    const v = parseInt(e.target.value);
                    if(type==='dhuha') setDhuhaRakaat(v); else if(type==='tarawih') setTarawihRakaat(v); else if(type==='tahajud') setTahajudRakaat(v); else setWitirRakaat(v);
                  }} className="px-3 py-1 rounded-lg border text-sm">
                    {[1, 2, 3, 4, 6, 8, 11, 12, 20].map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              )}
              {sunnahEntry[type].done && <p className="text-xs text-amber-600 font-medium">{sunnahEntry[type].rakaat} Rakaat</p>}
            </div>
          ))}
        </div>
      </motion.div>

     {/* TILAWAH SECTION */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-emerald-800 flex items-center gap-2"><BookOpen className="text-blue-500" /> Tilawah</h3>
          <button onClick={() => { setEditingTilawahId(null); setShowTilawahModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium shadow-md"><Plus size={20} /> Tambah</button>
        </div>
        {getTilawahEntries(selectedDate).length === 0 ? <p className="text-gray-500 text-center py-4 bg-gray-50 rounded-xl border border-dashed">Belum ada tilawah</p> : (
          <div className="space-y-3">
            {getTilawahEntries(selectedDate).map((entry) => (
              <div key={entry.id} className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex justify-between items-center">
                <div><p className="font-bold text-blue-900">{entry.surah}</p><p className="text-sm text-blue-700">Ayat {entry.fromAyah}-{entry.toAyah} ({entry.ayahCount} Ayat)</p></div>
                <div className="flex gap-1">
                  <button onClick={() => handleEditTilawah(entry)} className="p-2 text-blue-400 hover:text-blue-600"><Pencil size={18} /></button>
                  <button onClick={() => { if(confirm('Hapus?')) deleteTilawahEntry(entry.id); }} className="p-2 text-red-400 hover:text-red-600"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* SEDEKAH SECTION */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-emerald-800 flex items-center gap-2"><Heart className="text-pink-500" /> Sedekah</h3>
          <button onClick={() => { setEditingSedekahId(null); setShowSedekahModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg font-medium shadow-md"><Plus size={20} /> Tambah</button>
        </div>
        {getSedekahEntries(selectedDate).length === 0 ? <p className="text-gray-500 text-center py-4 bg-gray-50 rounded-xl border border-dashed">Belum ada sedekah</p> : (
          <div className="space-y-3">
            {getSedekahEntries(selectedDate).map((entry) => (
              <div key={entry.id} className="p-4 rounded-xl bg-pink-50 border border-pink-200 flex justify-between items-center">
                <div><p className="font-bold text-pink-900">Rp {entry.amount.toLocaleString('id-ID')}</p><p className="text-xs text-pink-700">Via {entry.method} {entry.notes && `• ${entry.notes}`}</p></div>
                <div className="flex gap-1">
                  <button onClick={() => handleEditSedekah(entry)} className="p-2 text-pink-400 hover:text-pink-600"><Pencil size={18} /></button>
                  <button onClick={() => { if(confirm('Hapus?')) deleteSedekahEntry(entry.id); }} className="p-2 text-red-400 hover:text-red-600"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* MODALS */}
      <AnimatePresence>
        {showReasonModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Alasan Berhalangan</h3>
              <select value={reason} onChange={e => setReason(e.target.value)} className="w-full p-3 border rounded-xl mb-4 focus:ring-2 focus:ring-emerald-400 outline-none">
                <option value="">Pilih alasan...</option>
                <option value="Sakit">Sakit</option><option value="Safar">Safar</option><option value="Lupa">Lupa</option>
                {user?.gender === 'female' && <option value="Haid">Haid</option>}
                <option value="Lainnya">Lainnya</option>
              </select>
              <div className="flex gap-2"><button onClick={() => setShowReasonModal(null)} className="flex-1 p-3 border rounded-xl">Batal</button>
              <button onClick={handleReasonSubmit} className="flex-1 bg-emerald-500 text-white p-3 rounded-xl font-bold">Simpan</button></div>
            </div>
          </div>
        )}

        {showTilawahModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><BookOpen className="text-blue-500" /> {editingTilawahId ? 'Edit' : 'Tambah'} Tilawah</h3>
              <div className="space-y-3">
                <input type="text" value={tilawahSurah} onChange={(e) => setTilawahSurah(e.target.value)} placeholder="Surah / Juz" className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-400 outline-none" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="number" value={tilawahFromAyah} onChange={(e) => setTilawahFromAyah(e.target.value)} placeholder="Dari Ayat" className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-400 outline-none" />
                  <input type="number" value={tilawahToAyah} onChange={(e) => setTilawahToAyah(e.target.value)} placeholder="Sampai Ayat" className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-400 outline-none" />
                </div>
              </div>
              <div className="flex gap-2 mt-6"><button onClick={() => { setShowTilawahModal(false); setEditingTilawahId(null); }} className="flex-1 px-4 py-3 border rounded-xl">Batal</button>
              <button onClick={handleTilawahSubmit} className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-xl font-medium">Simpan</button></div>
            </div>
          </div>
        )}

        {showSedekahModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Heart className="text-pink-500" /> {editingSedekahId ? 'Edit' : 'Tambah'} Sedekah</h3>
              <div className="space-y-3">
                <input type="number" value={sedekahAmount} onChange={(e) => setSedekahAmount(e.target.value)} placeholder="Jumlah (Rp)" className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-pink-400 outline-none" />
                <div className="grid grid-cols-3 gap-2">
                  {(['masjid', 'online', 'direct'] as const).map((m) => (
                    <button key={m} onClick={() => setSedekahMethod(m)} className={`py-2 rounded-xl border-2 capitalize transition-all ${sedekahMethod === m ? 'border-pink-500 bg-pink-50 text-pink-700 font-semibold' : 'border-gray-200 text-gray-600 hover:border-pink-200'}`}>{m}</button>
                  ))}
                </div>
                <textarea value={sedekahNotes} onChange={(e) => setSedekahNotes(e.target.value)} placeholder="Catatan (Opsional)" rows={2} className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-pink-400 outline-none resize-none" />
              </div>
              <div className="flex gap-2 mt-6"><button onClick={() => { setShowSedekahModal(false); setEditingSedekahId(null); }} className="flex-1 px-4 py-3 border rounded-xl">Batal</button>
              <button onClick={handleSedekahSubmit} className="flex-1 px-4 py-3 bg-pink-500 text-white rounded-xl font-medium">Simpan</button></div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}