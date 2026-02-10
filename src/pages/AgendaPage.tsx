import { useState } from 'react';
import { useData } from '../context/DataContext';
import { motion, AnimatePresence } from 'motion/react';
import { ClipboardList, Plus, Trash2, Bell, BellOff } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function AgendaPage() {
  const { getAgendaEntries, addAgendaEntry, deleteAgendaEntry } = useData();
  
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('');
  const [category, setCategory] = useState<'ibadah' | 'kajian' | 'sosial'>('ibadah');
  const [reminder, setReminder] = useState(true);
  const [notes, setNotes] = useState('');

  const agendas = getAgendaEntries();

  // Sort agendas by date and time
  const sortedAgendas = [...agendas].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  // Group by upcoming and past
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingAgendas = sortedAgendas.filter(a => {
    const agendaDate = new Date(a.date);
    agendaDate.setHours(0, 0, 0, 0);
    return agendaDate >= today;
  });

  const pastAgendas = sortedAgendas.filter(a => {
    const agendaDate = new Date(a.date);
    agendaDate.setHours(0, 0, 0, 0);
    return agendaDate < today;
  });

  const handleSubmit = () => {
    if (!title || !date || !time) {
      toast.error('Mohon lengkapi judul, tanggal, dan waktu');
      return;
    }

    addAgendaEntry({
      title,
      date,
      time,
      category,
      reminder,
      notes,
    });

    toast.success(`Agenda "${title}" berhasil ditambahkan! 📅`);
    
    // Reset form
    setShowModal(false);
    setTitle('');
    setDate(new Date().toISOString().split('T')[0]);
    setTime('');
    setCategory('ibadah');
    setReminder(true);
    setNotes('');
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Hapus agenda "${title}"?`)) {
      deleteAgendaEntry(id);
      toast.success('Agenda berhasil dihapus');
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'ibadah':
        return 'from-emerald-400 to-teal-500';
      case 'kajian':
        return 'from-blue-400 to-indigo-500';
      case 'sosial':
        return 'from-pink-400 to-rose-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getCategoryBg = (cat: string) => {
    switch (cat) {
      case 'ibadah':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'kajian':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'sosial':
        return 'bg-pink-100 text-pink-700 border-pink-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-8 text-white shadow-xl"
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Agenda Ramadhan</h2>
            <p className="text-blue-100">
              Atur jadwal ibadah dan kegiatan
            </p>
          </div>
          <ClipboardList size={48} className="text-blue-300 opacity-50" />
        </div>
      </motion.div>

      {/* Add Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowModal(true)}
        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-2xl font-semibold shadow-lg flex items-center justify-center gap-2"
      >
        <Plus size={24} />
        Tambah Agenda Baru
      </motion.button>

      {/* Upcoming Agendas */}
      {upcomingAgendas.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-gray-800">Agenda Mendatang</h3>
          {upcomingAgendas.map((agenda, index) => (
            <motion.div
              key={agenda.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl p-5 shadow-lg border-2 border-gray-200 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className={`w-16 h-16 bg-gradient-to-br ${getCategoryColor(agenda.category)} rounded-xl flex flex-col items-center justify-center text-white flex-shrink-0`}>
                  <div className="text-xs font-semibold">
                    {new Date(agenda.date).toLocaleDateString('id-ID', { month: 'short' }).toUpperCase()}
                  </div>
                  <div className="text-2xl font-bold">
                    {new Date(agenda.date).getDate()}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-lg font-bold text-gray-800">{agenda.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getCategoryBg(agenda.category)}`}>
                          {agenda.category}
                        </span>
                        {agenda.reminder && (
                          <span className="text-emerald-600 flex items-center gap-1 text-xs">
                            <Bell size={12} />
                            Pengingat aktif
                          </span>
                        )}
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(agenda.id, agenda.title)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    >
                      <Trash2 size={20} />
                    </motion.button>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <span>⏰ {agenda.time}</span>
                    <span>📅 {new Date(agenda.date).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                    })}</span>
                  </div>

                  {agenda.notes && (
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-xl mt-2">
                      {agenda.notes}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Past Agendas */}
      {pastAgendas.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-gray-800">Agenda Sebelumnya</h3>
          {pastAgendas.map((agenda, index) => (
            <motion.div
              key={agenda.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl p-5 shadow-md border border-gray-200 opacity-75"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-600 flex-shrink-0">
                  <div className="text-xs font-semibold">
                    {new Date(agenda.date).toLocaleDateString('id-ID', { month: 'short' }).toUpperCase()}
                  </div>
                  <div className="text-2xl font-bold">
                    {new Date(agenda.date).getDate()}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-gray-600">{agenda.title}</h4>
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize bg-gray-100 text-gray-600 mt-1">
                        {agenda.category}
                      </span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(agenda.id, agenda.title)}
                      className="text-gray-400 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </motion.button>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {agenda.time} • {new Date(agenda.date).toLocaleDateString('id-ID')}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {agendas.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-emerald-100">
          <ClipboardList size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Belum ada agenda</p>
          <p className="text-sm text-gray-400 mt-1">Klik tombol di atas untuk menambahkan</p>
        </div>
      )}

      {/* Add Agenda Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6">Tambah Agenda</h3>
              
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Judul Agenda
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Kajian Tafsir"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tanggal
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Waktu
                    </label>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['ibadah', 'kajian', 'sosial'] as const).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`py-3 rounded-xl border-2 capitalize transition-all ${
                          category === cat
                            ? getCategoryBg(cat) + ' font-semibold border-current'
                            : 'border-gray-200 text-gray-600'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reminder */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-2">
                    {reminder ? <Bell className="text-emerald-600" size={20} /> : <BellOff className="text-gray-400" size={20} />}
                    <span className="font-medium text-gray-700">Aktifkan Pengingat</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReminder(!reminder)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      reminder ? 'bg-emerald-500' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        reminder ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catatan (Opsional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Detail agenda..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-300 font-medium"
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-3 rounded-xl bg-blue-500 text-white font-medium"
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
