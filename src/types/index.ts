export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  city?: string;
}

export interface Agenda {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  start_time: string; // ISO String
  end_time?: string;
  location?: string;
  is_completed: boolean;
  created_at?: string;
}

export interface Target {
  id: string;
  user_id: string;
  title: string;
  target_value: number;
  current_value: number;
  unit: string;
  is_completed: boolean;
  deadline?: string;
}

export interface ZakatRecord {
  id: string;
  user_id: string;
  type: 'Zakat Fitrah' | 'Zakat Mal' | 'Sedekah' | 'Infaq';
  amount: number;
  recipient?: string;
  payment_date: string;
  notes?: string;
}

export interface DailyActivity {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
  taraweeh: boolean;
  witir: boolean;
  tahajjud: boolean;
  dhuha: boolean;
  quran_pages_read: number;
  notes?: string;
}

export interface FastingLog {
  id: string;
  user_id: string;
  date: string;
  status: 'Berpuasa' | 'Tidak Berpuasa' | 'Haid' | 'Sakit' | 'Musafir';
  sahur_check: boolean;
  iftar_check: boolean;
  mood?: string;
}