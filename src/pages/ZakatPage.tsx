import { useState } from 'react';
import { useData } from '../context/DataContext';
import { motion, AnimatePresence } from 'motion/react';
import { DollarSign, Plus, CheckCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function ZakatPage() {
  const { getZakatEntries, addZakatEntry } = useData();
  
  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState<'fitrah' | 'maal'>('fitrah');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentTime, setPaymentTime] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState('1');
  const [channel, setChannel] = useState<'masjid' | 'laz' | 'online'>('masjid');
  const [amountPerPerson, setAmountPerPerson] = useState('');
  const [notes, setNotes] = useState('');

  const zakatEntries = getZakatEntries();

  const handleSubmit = () => {
    const numPeople = parseInt(numberOfPeople);
    const amount = parseFloat(amountPerPerson);

    if (!paymentTime || !numPeople || !amount || numPeople <= 0 || amount <= 0) {
      toast.error('Mohon lengkapi semua field dengan benar');
      return;
    }

    const totalAmount = numPeople * amount;

    addZakatEntry({
      type,
      paymentDate,
      paymentTime,
      numberOfPeople: numPeople,
      channel,
      amountPerPerson: amount,
      totalAmount,
      notes,
    });

    toast.success(`Zakat ${type === 'fitrah' ? 'Fitrah' : 'Maal'} Rp ${totalAmount.toLocaleString('id-ID')} berhasil dicatat! 🎉`);
    
    // Reset form
    setShowModal(false);
    setType('fitrah');
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setPaymentTime('');
    setNumberOfPeople('1');
    setChannel('masjid');
    setAmountPerPerson('');
    setNotes('');
  };

  const totalZakat = zakatEntries.reduce((sum, entry) => sum + entry.totalAmount, 0);
  const fitrahEntries = zakatEntries.filter(e => e.type === 'fitrah');
  const maalEntries = zakatEntries.filter(e => e.type === 'maal');

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-8 text-white shadow-xl"
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Zakat & Infaq</h2>
            <p className="text-amber-100">
              Bersihkan harta, berkahi kehidupan
            </p>
          </div>
          <DollarSign size={48} className="text-amber-300 opacity-50" />
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
        Catat Pembayaran Zakat
      </motion.button>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100"
        >
          <p className="text-sm text-gray-600 mb-2">Total Zakat</p>
          <p className="text-3xl font-bold text-emerald-700">
            Rp {totalZakat.toLocaleString('id-ID')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100"
        >
          <p className="text-sm text-gray-600 mb-2">Zakat Fitrah</p>
          <p className="text-3xl font-bold text-blue-700">
            {fitrahEntries.length}
          </p>
          <p className="text-xs text-gray-500 mt-1">pembayaran</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100"
        >
          <p className="text-sm text-gray-600 mb-2">Zakat Maal</p>
          <p className="text-3xl font-bold text-purple-700">
            {maalEntries.length}
          </p>
          <p className="text-xs text-gray-500 mt-1">pembayaran</p>
        </motion.div>
      </div>

      {/* Zakat List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800">Riwayat Pembayaran</h3>
        
        {zakatEntries.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-emerald-100">
            <DollarSign size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Belum ada pembayaran zakat</p>
            <p className="text-sm text-gray-400 mt-1">Klik tombol di atas untuk menambahkan</p>
          </div>
        ) : (
          <div className="space-y-3">
            {zakatEntries.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`bg-white rounded-2xl p-6 shadow-lg border-2 ${
                  entry.type === 'fitrah' ? 'border-blue-200' : 'border-purple-200'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        entry.type === 'fitrah'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {entry.type === 'fitrah' ? 'Zakat Fitrah' : 'Zakat Maal'}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                        entry.channel === 'masjid'
                          ? 'bg-emerald-100 text-emerald-700'
                          : entry.channel === 'laz'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-teal-100 text-teal-700'
                      }`}>
                        {entry.channel}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">
                      Rp {entry.totalAmount.toLocaleString('id-ID')}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {entry.numberOfPeople} jiwa × Rp {entry.amountPerPerson.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <CheckCircle size={32} className="text-green-500" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Tanggal</p>
                    <p className="font-medium text-gray-800">
                      {new Date(entry.paymentDate).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Waktu</p>
                    <p className="font-medium text-gray-800">{entry.paymentTime}</p>
                  </div>
                </div>

                {entry.notes && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500">Catatan</p>
                    <p className="text-sm text-gray-700 mt-1">{entry.notes}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-l-4 border-blue-500"
      >
        <h4 className="font-semibold text-blue-800 mb-3">📚 Tentang Zakat Fitrah</h4>
        <ul className="text-sm text-blue-700 space-y-2">
          <li>• Wajib bagi setiap muslim yang mampu</li>
          <li>• Dibayarkan sebelum Sholat Idul Fitri</li>
          <li>• Standar: 2.5 kg beras atau setara uang</li>
          <li>• Membersihkan diri dari kesalahan selama Ramadhan</li>
        </ul>
      </motion.div>

      {/* Add Zakat Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full my-8"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6">Catat Pembayaran Zakat</h3>
              
              <div className="space-y-4">
                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jenis Zakat
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setType('fitrah')}
                      className={`py-3 rounded-xl border-2 transition-all ${
                        type === 'fitrah'
                          ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                          : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      Zakat Fitrah
                    </button>
                    <button
                      type="button"
                      onClick={() => setType('maal')}
                      className={`py-3 rounded-xl border-2 transition-all ${
                        type === 'maal'
                          ? 'border-purple-500 bg-purple-50 text-purple-700 font-semibold'
                          : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      Zakat Maal
                    </button>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tanggal
                    </label>
                    <input
                      type="date"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Waktu
                    </label>
                    <input
                      type="time"
                      value={paymentTime}
                      onChange={(e) => setPaymentTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                </div>

                {/* Number of People */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jumlah Jiwa
                  </label>
                  <input
                    type="number"
                    value={numberOfPeople}
                    onChange={(e) => setNumberOfPeople(e.target.value)}
                    min="1"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>

                {/* Channel */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Channel Pembayaran
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['masjid', 'laz', 'online'] as const).map((ch) => (
                      <button
                        key={ch}
                        type="button"
                        onClick={() => setChannel(ch)}
                        className={`py-2 rounded-xl border-2 capitalize transition-all ${
                          channel === ch
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold'
                            : 'border-gray-200 text-gray-600'
                        }`}
                      >
                        {ch}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount per Person */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nominal per Jiwa (Rp)
                  </label>
                  <input
                    type="number"
                    value={amountPerPerson}
                    onChange={(e) => setAmountPerPerson(e.target.value)}
                    placeholder="50000"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                  {amountPerPerson && numberOfPeople && (
                    <p className="text-sm text-emerald-600 mt-2">
                      Total: Rp {(parseFloat(amountPerPerson) * parseInt(numberOfPeople)).toLocaleString('id-ID')}
                    </p>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catatan (Opsional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Keterangan tambahan..."
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
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
                  className="flex-1 px-4 py-3 rounded-xl bg-emerald-500 text-white font-medium"
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
