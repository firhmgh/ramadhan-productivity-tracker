import { useState } from 'react';
import { useData } from '../context/DataContext';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, Moon, CheckCircle, BookOpen, Heart } from 'lucide-react';

export function CalendarPage() {
  const {
    getPuasaEntry,
    getSholatEntry,
    getTilawahEntries,
    getSedekahEntries,
    getZakatEntries,
    getAgendaEntries,
  } = useData();

  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Generate calendar days for Ramadhan (assuming March 2026)
  const ramadhanStart = new Date('2026-02-28');
  const ramadhanDays = 30;

  const getDayData = (dayNumber: number) => {
    const date = new Date(ramadhanStart);
    date.setDate(ramadhanStart.getDate() + dayNumber - 1);
    const dateStr = date.toISOString().split('T')[0];

    const puasa = getPuasaEntry(dateStr);
    const sholat = getSholatEntry(dateStr);
    const tilawah = getTilawahEntries(dateStr);
    const sedekah = getSedekahEntries(dateStr);
    const agendas = getAgendaEntries().filter(a => a.date === dateStr);

    const sholatCount = [
      sholat.subuh.done,
      sholat.dzuhur.done,
      sholat.ashar.done,
      sholat.maghrib.done,
      sholat.isya.done,
    ].filter(Boolean).length;

    return {
      date,
      dateStr,
      puasa: puasa.puasa,
      sholatCount,
      tilawahCount: tilawah.reduce((sum, t) => sum + t.ayahCount, 0),
      sedekahCount: sedekah.length,
      agendaCount: agendas.length,
    };
  };

  const zakatEntries = getZakatEntries();

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white shadow-xl"
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Kalender Ramadhan</h2>
            <p className="text-indigo-100">
              Pantau aktivitas ibadah sepanjang bulan suci
            </p>
          </div>
          <CalendarIcon size={48} className="text-indigo-300 opacity-50" />
        </div>
      </motion.div>

      {/* Legend */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100">
        <h3 className="font-semibold text-gray-800 mb-3">Legenda</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded" />
            <span className="text-sm text-gray-700">Puasa</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-emerald-500 rounded" />
            <span className="text-sm text-gray-700">Sholat Lengkap</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded" />
            <span className="text-sm text-gray-700">Ada Tilawah</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-500 rounded" />
            <span className="text-sm text-gray-700">Ada Agenda</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6">30 Hari Ramadhan 1447 H</h3>
        
        <div className="grid grid-cols-5 md:grid-cols-7 gap-3">
          {Array.from({ length: ramadhanDays }, (_, i) => {
            const dayNumber = i + 1;
            const data = getDayData(dayNumber);
            const isToday = data.dateStr === new Date().toISOString().split('T')[0];

            return (
              <motion.div
                key={dayNumber}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.02 }}
                whileHover={{ scale: 1.05 }}
                className={`relative p-3 rounded-xl border-2 transition-all ${
                  isToday
                    ? 'border-emerald-500 bg-emerald-50 shadow-lg'
                    : 'border-gray-200 hover:border-emerald-300 hover:shadow-md'
                }`}
              >
                <div className="text-center mb-2">
                  <div className={`text-lg font-bold ${
                    isToday ? 'text-emerald-700' : 'text-gray-800'
                  }`}>
                    {dayNumber}
                  </div>
                  <div className="text-xs text-gray-500">
                    {data.date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </div>
                </div>

                {/* Indicators */}
                <div className="flex flex-wrap gap-1 justify-center">
                  {data.puasa && (
                    <div className="w-2 h-2 bg-purple-500 rounded-full" title="Puasa" />
                  )}
                  {data.sholatCount === 5 && (
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" title="Sholat Lengkap" />
                  )}
                  {data.tilawahCount > 0 && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full" title={`Tilawah ${data.tilawahCount} ayat`} />
                  )}
                  {data.sedekahCount > 0 && (
                    <div className="w-2 h-2 bg-pink-500 rounded-full" title={`${data.sedekahCount} sedekah`} />
                  )}
                  {data.agendaCount > 0 && (
                    <div className="w-2 h-2 bg-amber-500 rounded-full" title={`${data.agendaCount} agenda`} />
                  )}
                </div>

                {isToday && (
                  <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                    Hari Ini
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Zakat Dates */}
      {zakatEntries.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <CheckCircle className="text-amber-500" />
            Tanggal Pembayaran Zakat
          </h3>
          <div className="space-y-2">
            {zakatEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-4 rounded-xl bg-amber-50 border border-amber-200"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    {entry.type === 'fitrah' ? 'Zakat Fitrah' : 'Zakat Maal'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(entry.paymentDate).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })} • {entry.paymentTime}
                  </p>
                </div>
                <p className="font-bold text-amber-700">
                  Rp {entry.totalAmount.toLocaleString('id-ID')}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Monthly Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl p-6 border border-emerald-200"
      >
        <h3 className="text-xl font-bold text-emerald-900 mb-4">Ringkasan Bulan Ini</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/70 rounded-xl p-4">
            <Moon className="text-purple-600 mb-2" size={24} />
            <p className="text-2xl font-bold text-purple-900">
              {Array.from({ length: 30 }, (_, i) => getDayData(i + 1)).filter(d => d.puasa).length}
            </p>
            <p className="text-sm text-purple-700">Hari Puasa</p>
          </div>
          <div className="bg-white/70 rounded-xl p-4">
            <CheckCircle className="text-emerald-600 mb-2" size={24} />
            <p className="text-2xl font-bold text-emerald-900">
              {Array.from({ length: 30 }, (_, i) => getDayData(i + 1)).filter(d => d.sholatCount === 5).length}
            </p>
            <p className="text-sm text-emerald-700">Sholat Lengkap</p>
          </div>
          <div className="bg-white/70 rounded-xl p-4">
            <BookOpen className="text-blue-600 mb-2" size={24} />
            <p className="text-2xl font-bold text-blue-900">
              {Array.from({ length: 30 }, (_, i) => getDayData(i + 1)).reduce((sum, d) => sum + d.tilawahCount, 0)}
            </p>
            <p className="text-sm text-blue-700">Total Ayat</p>
          </div>
          <div className="bg-white/70 rounded-xl p-4">
            <Heart className="text-pink-600 mb-2" size={24} />
            <p className="text-2xl font-bold text-pink-900">
              {Array.from({ length: 30 }, (_, i) => getDayData(i + 1)).filter(d => d.sedekahCount > 0).length}
            </p>
            <p className="text-sm text-pink-700">Hari Sedekah</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
