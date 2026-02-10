import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { motion } from 'motion/react';
import { User, Calendar, Award, TrendingUp } from 'lucide-react';

export function ProfilePage() {
  const { user } = useAuth();
  const { getStats } = useData();
  
  if (!user) return null;

  const stats = getStats();
  const memberSince = new Date(user.createdAt);

  const achievements = [
    {
      title: 'Hari Puasa',
      value: stats.totalPuasa,
      icon: '🌙',
      color: 'from-purple-400 to-purple-600',
    },
    {
      title: 'Sholat Terlaksana',
      value: stats.totalSholat,
      icon: '🕌',
      color: 'from-emerald-400 to-emerald-600',
    },
    {
      title: 'Ayat Dibaca',
      value: stats.totalTilawah,
      icon: '📖',
      color: 'from-blue-400 to-blue-600',
    },
    {
      title: 'Total Sedekah',
      value: `Rp ${stats.totalSedekah.toLocaleString('id-ID')}`,
      icon: '💝',
      color: 'from-pink-400 to-pink-600',
    },
    {
      title: 'Total Zakat',
      value: `Rp ${stats.totalZakat.toLocaleString('id-ID')}`,
      icon: '💰',
      color: 'from-amber-400 to-amber-600',
    },
  ];

  const getProgressPercentage = () => {
    // Calculate overall progress based on targets
    const maxPuasa = 30;
    const maxSholat = 150; // 30 days * 5 prayers
    
    const puasaProgress = (stats.totalPuasa / maxPuasa) * 100;
    const sholatProgress = (stats.totalSholat / maxSholat) * 100;
    
    return Math.round((puasaProgress + sholatProgress) / 2);
  };

  const progress = getProgressPercentage();

  return (
    <div className="space-y-6 pb-20">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 text-white shadow-xl"
      >
        <div className="flex items-start gap-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-white/20 backdrop-blur rounded-full flex items-center justify-center flex-shrink-0"
          >
            <User size={48} className="text-white" />
          </motion.div>
          
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2">{user.fullName}</h2>
            <div className="space-y-1 text-emerald-100">
              <p>📧 {user.email}</p>
              <p>👤 {user.gender === 'male' ? 'Laki-laki' : 'Perempuan'} • {user.age} tahun</p>
              <p>🕌 Mazhab: {user.mazhab.toUpperCase()}</p>
              <p className="flex items-center gap-2 mt-2">
                <Calendar size={16} />
                Bergabung sejak {memberSince.toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Progress Circle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-8 shadow-lg border border-emerald-100"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <TrendingUp className="text-emerald-600" />
          Progress Ramadhan
        </h3>
        
        <div className="flex flex-col items-center">
          <div className="relative w-48 h-48">
            <svg className="w-48 h-48 transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="#e5e7eb"
                strokeWidth="12"
                fill="none"
              />
              <motion.circle
                cx="96"
                cy="96"
                r="88"
                stroke="url(#gradient)"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDashoffset: 553 }}
                animate={{ strokeDashoffset: 553 - (553 * progress) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                strokeDasharray="553"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#14b8a6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-5xl font-bold text-emerald-600">{progress}%</p>
                <p className="text-sm text-gray-600 mt-1">Tercapai</p>
              </div>
            </div>
          </div>
          
          <p className="text-gray-600 text-center mt-4">
            Terus semangat! Masih ada {100 - progress}% lagi untuk mencapai target sempurna
          </p>
        </div>
      </motion.div>

      {/* Achievements */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Award className="text-amber-500" />
          Pencapaian
        </h3>
        
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-5 shadow-lg border border-emerald-100 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 bg-gradient-to-br ${achievement.color} rounded-xl flex items-center justify-center text-3xl flex-shrink-0`}>
                {achievement.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">{achievement.title}</p>
                <p className="text-2xl font-bold text-gray-800">{achievement.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200"
        >
          <h4 className="font-semibold text-blue-800 mb-2">Mazhab Preference</h4>
          <p className="text-blue-700 mb-3">
            Anda menggunakan jadwal waktu sholat berdasarkan mazhab <strong>{user.mazhab.toUpperCase()}</strong>
          </p>
          <p className="text-sm text-blue-600">
            Waktu imsak dan berbuka disesuaikan dengan ketentuan mazhab Anda.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200"
        >
          <h4 className="font-semibold text-purple-800 mb-2">Fitur Khusus</h4>
          <div className="space-y-2 text-sm text-purple-700">
            {user.gender === 'female' && (
              <p>✓ Alasan "Haid" tersedia untuk tracking puasa</p>
            )}
            {user.gender === 'male' && (
              <p>✓ Reminder Sholat Jumat aktif</p>
            )}
            <p>✓ Data tersimpan secara lokal</p>
            <p>✓ Reminder berdasarkan mazhab</p>
          </div>
        </motion.div>
      </div>

      {/* Motivational Quote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-6 border-l-4 border-emerald-500"
      >
        <p className="text-emerald-800 italic text-center">
          "Dan orang-orang yang berjihad untuk (mencari keridhaan) Kami, 
          benar-benar akan Kami tunjukkan kepada mereka jalan-jalan Kami."
        </p>
        <p className="text-emerald-600 text-sm text-center mt-2">— QS. Al-Ankabut: 69</p>
      </motion.div>

      {/* Account Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gray-50 rounded-2xl p-6 border border-gray-200"
      >
        <h4 className="font-semibold text-gray-800 mb-3">Informasi Akun</h4>
        <div className="space-y-2 text-sm text-gray-600">
          <p>ID Pengguna: {user.id}</p>
          <p>Tanggal Bergabung: {memberSince.toLocaleString('id-ID')}</p>
          <p className="mt-4 text-xs text-gray-500">
            💾 Semua data Anda disimpan secara lokal di perangkat ini.
            Data akan hilang jika Anda menghapus cache browser atau logout.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
