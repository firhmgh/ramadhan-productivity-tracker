import { motion } from 'motion/react';

export function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[999] bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-900 flex items-center justify-center overflow-hidden">
        
      {/* Lingkaran dekoratif di background */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 2, opacity: 0.15 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute w-96 h-96 bg-white rounded-full blur-3xl"
      />
      
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1.5, opacity: 0.1 }}
        transition={{ duration: 2, delay: 0.2, ease: "easeOut" }}
        className="absolute w-72 h-72 bg-white rounded-full blur-3xl"
      />

      {/* Konten Utama */}
      <div className="relative z-10 text-center">
        {/* Animasi Bulan */}
        <motion.div
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ 
            duration: 1.2, 
            type: "spring",
            stiffness: 100
          }}
          className="mb-8"
        >
          <motion.div
            animate={{ 
              y: [-10, 10, -10],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-9xl drop-shadow-2xl"
          >
            🌙
          </motion.div>
        </motion.div>

        {/* Nama Aplikasi */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">
            Ramadhan Care
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="text-emerald-100/80 text-lg font-medium"
          >
            Menyiapkan Perjalanan Spiritual Anda...
          </motion.p>
        </motion.div>

        {/* Indikator Loading (Titik-titik) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-12"
        >
          <div className="flex justify-center gap-3">
            {[0, 0.2, 0.4].map((delay, i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity, delay }}
                className="w-3 h-3 bg-white rounded-full shadow-lg"
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bintang Dekoratif */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            y: [0, -40]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeOut"
          }}
          className="absolute text-2xl"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
        >
          ✨
        </motion.div>
      ))}
    </div>
  );
}