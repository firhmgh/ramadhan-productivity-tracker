import { useState, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { SplashScreen } from './components/ui/SplashScreen';
import { Toaster } from './components/ui/sonner';

function AppContent() {
  const { isLoading: authLoading } = useAuth();
  const { loading: dataLoading } = useData();
  const [minTimePassed, setMinTimePassed] = useState(false);

  // Timer untuk memastikan Splash Screen tampil minimal 3 detik
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimePassed(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Splash Screen hanya hilang jika:
  // 1. Waktu minimal 3 detik sudah lewat
  // 2. Auth sudah selesai loading
  // 3. Data database sudah selesai loading
  if (!minTimePassed || authLoading || dataLoading) {
    return <SplashScreen />;
  }

  return <RouterProvider router={router} />;
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
        <Toaster position="top-center" richColors />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;