import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { motion } from 'framer-motion'; 
import { BookOpen, Heart, Moon, DollarSign, Target, TrendingUp, Calendar, CheckSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HomePage() {
  const { user } = useAuth();
  const { getStats, targets } = useData();
  const stats = getStats();

  const today = new Date();
  const ramadhanStart = new Date('2026-02-28');
  const diffTime = today.getTime() - ramadhanStart.getTime();
  const dayOfRamadhan = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  const displayDay = dayOfRamadhan > 0 ? `Hari ke-${dayOfRamadhan}` : `Menuju Ramadhan`;

  const statCards = [
    { 
      label: 'Puasa Sempurna', 
      value: stats.totalPuasa, 
      icon: Moon, 
      color: 'from-purple-400 to-purple-600',
      unit: 'hari'
    },
    { 
      label: 'Sholat Terlaksana', 
      value: stats.totalSholat, 
      icon: Target, 
      color: 'from-emerald-400 to-emerald-600',
      unit: 'waktu'
    },
    { 
      label: 'Tilawah', 
      value: stats.totalTilawah, 
      icon: BookOpen, 
      color: 'from-blue-400 to-blue-600',
      unit: 'ayat'
    },
    { 
      label: 'Sedekah', 
      value: `Rp ${stats.totalSedekah.toLocaleString('id-ID')}`, 
      icon: Heart, 
      color: 'from-pink-400 to-pink-600',
      unit: ''
    },
  ];

  // Quick Actions Buttons config
  const quickActions = [
    { to: "/daily", label: "Daily Tracker", icon: CheckSquare, color: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" },
    { to: "/puasa", label: "Puasa Tracker", icon: Moon, color: "bg-purple-50 text-purple-700 hover:bg-purple-100" },
    { to: "/zakat", label: "Zakat", icon: DollarSign, color: "bg-amber-50 text-amber-700 hover:bg-amber-100" },
    { to: "/agenda", label: "Agenda", icon: Calendar, color: "bg-blue-50 text-blue-700 hover:bg-blue-100" }
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Welcome Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 text-white shadow-xl"
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">
               Ramadhan Mubarak, {user?.fullName?.split(' ')[0] || 'Saudara'}! 🌙
            </h2>
            <p className="text-emerald-100 text-lg mb-4">
              {displayDay} • Mazhab: {user?.mazhab?.toUpperCase() || '-'}
            </p>
            <p className="text-emerald-50">
              Semoga ibadah hari ini penuh berkah dan diterima oleh Allah SWT
            </p>
          </div>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-6xl"
          >
            ☪️
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100 hover:shadow-xl transition-shadow"
          >
            <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center mb-4`}>
              <card.icon size={24} className="text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-800 mb-1">
              {card.value}
              {card.unit && <span className="text-sm text-gray-500 ml-1">{card.unit}</span>}
            </p>
            <p className="text-sm text-gray-600">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100">
        <h3 className="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-2">
          <TrendingUp size={24} />
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link key={action.to} to={action.to}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full p-4 rounded-xl transition-colors text-sm font-medium flex flex-col items-center justify-center gap-2 ${action.color}`}
              >
                <action.icon size={24} />
                {action.label}
              </motion.button>
            </Link>
          ))}
        </div>
      </div>

      {/* Active Targets */}
      {(targets.sholatTepat || targets.tilawahHarian || targets.sedekahHarian || targets.puasaPenuh) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100"
        >
          <h3 className="text-xl font-bold text-emerald-800 mb-4">Target Aktif Hari Ini</h3>
          <div className="space-y-2">
            {targets.sholatTepat && (
              <div className="flex items-center gap-2 text-emerald-700">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span>Sholat Tepat Waktu</span>
              </div>
            )}
            {targets.tilawahHarian && (
              <div className="flex items-center gap-2 text-blue-700">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span>Tilawah Harian {targets.tilawahAyahTarget ? `(${targets.tilawahAyahTarget} ayat)` : ''}</span>
              </div>
            )}
            {targets.sedekahHarian && (
              <div className="flex items-center gap-2 text-pink-700">
                <div className="w-2 h-2 bg-pink-500 rounded-full" />
                <span>Sedekah Harian</span>
              </div>
            )}
            {targets.puasaPenuh && (
              <div className="flex items-center gap-2 text-purple-700">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <span>Puasa Penuh</span>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Zakat Summary */}
      {stats.totalZakat > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-6 shadow-lg border border-amber-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-800 font-semibold mb-1">Total Zakat Terbayar</p>
              <p className="text-3xl font-bold text-amber-900">
                Rp {stats.totalZakat.toLocaleString('id-ID')}
              </p>
            </div>
            <div className="p-3 bg-white/50 rounded-full">
              <DollarSign size={32} className="text-amber-600" />
            </div>
          </div>
        </motion.div>
      )}

      {/* Motivational Quote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-6 border-l-4 border-emerald-500 shadow-sm"
      >
        <p className="text-emerald-800 italic text-center font-medium text-lg">
          "Barangsiapa yang berpuasa Ramadhan karena iman dan mengharap ridha Allah,
          maka diampuni dosanya yang telah lalu."
        </p>
        <p className="text-emerald-600 text-sm text-center mt-2 font-semibold">— HR. Bukhari & Muslim</p>
      </motion.div>
    </div>
  );
}