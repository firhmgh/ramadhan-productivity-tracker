import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { Moon, Star, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export function AuthPage() {
  const navigate = useNavigate();
  const { user, login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form
  const [regFullName, setRegFullName] = useState('');
  const [regAge, setRegAge] = useState('');
  const [regGender, setRegGender] = useState<'male' | 'female'>('male');
  const [regMazhab, setRegMazhab] = useState<'muhammadiyah' | 'nu'>('nu');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = await login(loginEmail, loginPassword);
    
    if (success) {
      toast.success('Selamat datang kembali!');
      navigate('/');
    } else {
      toast.error('Email atau password salah');
    }
    
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!regFullName || !regAge || !regEmail || !regPassword) {
      toast.error('Mohon lengkapi semua field');
      return;
    }

    if (parseInt(regAge) < 10 || parseInt(regAge) > 120) {
      toast.error('Usia tidak valid');
      return;
    }

    setIsLoading(true);
    
    const success = await register({
      fullName: regFullName,
      age: parseInt(regAge),
      gender: regGender,
      mazhab: regMazhab,
      email: regEmail,
      password: regPassword,
    });
    
    if (success) {
      toast.success('Registrasi berhasil! Selamat datang 🌙');
    } else {
      toast.error('Gagal mendaftar. Email mungkin sudah digunakan.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50 to-teal-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <motion.div
        className="absolute top-20 left-10 text-emerald-200"
        animate={{ rotate: 360, y: [0, -20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <Star size={40} fill="currentColor" />
      </motion.div>
      <motion.div
        className="absolute bottom-20 right-20 text-amber-200"
        animate={{ rotate: -360, y: [0, 20, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      >
        <Moon size={60} fill="currentColor" />
      </motion.div>
      <motion.div
        className="absolute top-40 right-40 text-teal-200"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        <Sparkles size={30} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-emerald-100">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full mx-auto mb-4 flex items-center justify-center"
            >
              <Moon size={40} className="text-white" fill="white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-emerald-800 mb-2">Ramadhan Care</h1>
            <p className="text-emerald-600">Track your spiritual journey</p>
          </div>

          {/* Toggle */}
          <div className="flex bg-emerald-50 rounded-full p-1 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-full transition-all ${
                isLogin ? 'bg-white shadow-md text-emerald-700 font-semibold' : 'text-emerald-600'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-full transition-all ${
                !isLogin ? 'bg-white shadow-md text-emerald-700 font-semibold' : 'text-emerald-600'
              }`}
            >
              Register
            </button>
          </div>

          {/* Forms */}
          {isLogin ? (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleLogin}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                  placeholder="your@email.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {isLoading ? 'Loading...' : 'Login'}
              </motion.button>
            </motion.form>
          ) : (
            <motion.form
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleRegister}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                  placeholder="Ahmad Abdullah"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-emerald-700 mb-1">
                    Usia
                  </label>
                  <input
                    type="number"
                    value={regAge}
                    onChange={(e) => setRegAge(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                    placeholder="25"
                    min="10"
                    max="120"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-emerald-700 mb-1">
                    Jenis Kelamin
                  </label>
                  <select
                    value={regGender}
                    onChange={(e) => setRegGender(e.target.value as 'male' | 'female')}
                    className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                  >
                    <option value="male">Laki-laki</option>
                    <option value="female">Perempuan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-1">
                  Mazhab Preference
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegMazhab('nu')}
                    className={`py-3 rounded-xl border-2 transition-all ${
                      regMazhab === 'nu'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold'
                        : 'border-emerald-200 text-emerald-600'
                    }`}
                  >
                    NU
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegMazhab('muhammadiyah')}
                    className={`py-3 rounded-xl border-2 transition-all ${
                      regMazhab === 'muhammadiyah'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold'
                        : 'border-emerald-200 text-emerald-600'
                    }`}
                  >
                    Muhammadiyah
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                  placeholder="Min. 6 karakter"
                  minLength={6}
                  required
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {isLoading ? 'Loading...' : 'Daftar Sekarang'}
              </motion.button>
            </motion.form>
          )}
        </div>

        <p className="text-center text-emerald-600 mt-6 text-sm">
          🌙 Ramadhan Mubarak 1446 H
        </p>
      </motion.div>
    </div>
  );
}