import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

export interface SholatEntry { id: string; date: string; subuh: { done: boolean; reason?: string }; dzuhur: { done: boolean; reason?: string }; ashar: { done: boolean; reason?: string }; maghrib: { done: boolean; reason?: string }; isya: { done: boolean; reason?: string }; }
export interface SholatSunnahEntry { id: string; date: string; dhuha: { done: boolean; rakaat?: number }; tahajud: { done: boolean; rakaat?: number }; witir: { done: boolean; rakaat?: number }; tarawih: { done: boolean; rakaat?: number }; }
export interface TilawahEntry { id: string; date: string; surah: string; fromAyah: number; toAyah: number; ayahCount: number; timestamp: string; }
export interface SedekahEntry { id: string; date: string; amount: number; method: 'masjid' | 'online' | 'direct'; notes?: string; timestamp: string; }
export interface PuasaEntry { id: string; date: string; sahur: boolean; sahurTime?: string; puasa: boolean; reason?: string; }
export interface ZakatEntry { id: string; type: 'fitrah' | 'maal'; paymentDate: string; channel: 'masjid' | 'laz' | 'online'; totalAmount: number; notes?: string; numberOfPeople?: number; }
export interface DailyTarget { sholatTepat: boolean; tilawahHarian: boolean; sedekahHarian: boolean; puasaPenuh: boolean; tilawahAyahTarget?: number; sedekahAmountTarget?: number; }
export interface WeeklyEntry { id: string; week: number; sholatJumat?: boolean; khutbahTopic?: string; kajian: boolean; silaturahmi: boolean; amalSosial: boolean; }
export interface AgendaEntry { id: string; title: string; date: string; time: string; category: 'ibadah' | 'kajian' | 'sosial'; notes?: string; }

export interface ImsakiyahDay {
  hari_ke: number;
  tanggal_masehi: string;
  imsak: string;
  shubuh: string;
  zhuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
}

interface DataContextType {
  targets: DailyTarget;
  setTargets: (targets: DailyTarget) => void;
  getSholatEntry: (date: string) => SholatEntry;
  updateSholatEntry: (entry: SholatEntry) => void;
  getSholatSunnahEntry: (date: string) => SholatSunnahEntry;
  updateSholatSunnahEntry: (entry: SholatSunnahEntry) => void;
  getTilawahEntries: (date: string) => TilawahEntry[];
  addTilawahEntry: (entry: Omit<TilawahEntry, 'id'>) => Promise<void>;
  updateTilawahEntry: (id: string, entry: Partial<TilawahEntry>) => Promise<void>;
  deleteTilawahEntry: (id: string) => Promise<void>;
  getSedekahEntries: (date: string) => SedekahEntry[];
  addSedekahEntry: (entry: Omit<SedekahEntry, 'id'>) => Promise<void>;
  updateSedekahEntry: (id: string, entry: Partial<SedekahEntry>) => Promise<void>;
  deleteSedekahEntry: (id: string) => Promise<void>;
  getPuasaEntry: (date: string) => PuasaEntry;
  updatePuasaEntry: (entry: PuasaEntry) => void;
  getZakatEntries: () => ZakatEntry[];
  addZakatEntry: (entry: Omit<ZakatEntry, 'id'>) => void;
  getWeeklyEntry: (week: number) => WeeklyEntry;
  updateWeeklyEntry: (entry: WeeklyEntry) => void;
  getAgendaEntries: () => AgendaEntry[];
  addAgendaEntry: (entry: Omit<AgendaEntry, 'id'>) => void;
  deleteAgendaEntry: (id: string) => void;
  getStats: () => { totalPuasa: number; totalSholat: number; totalTilawah: number; totalSedekah: number; totalZakat: number; };
  loading: boolean;
  imsakiyah: ImsakiyahDay[];
  userProfile: any;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dailyActivities, setDailyActivities] = useState<any[]>([]);
  const [fastingLogs, setFastingLogs] = useState<any[]>([]);
  const [agendas, setAgendas] = useState<any[]>([]);
  const [zakatRecords, setZakatRecords] = useState<any[]>([]);
  const [tilawahLogs, setTilawahLogs] = useState<any[]>([]);
  const [weeklyLogs, setWeeklyLogs] = useState<any[]>([]);
  const [imsakiyah, setImsakiyah] = useState<ImsakiyahDay[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [targets, setTargetsState] = useState<DailyTarget>({ sholatTepat: true, tilawahHarian: true, sedekahHarian: false, puasaPenuh: true });

  useEffect(() => {
    if (user) { fetchData(); } else { setLoading(false); }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const userId = String(user!.id);
      
      // 1. Ambil Profil User dulu untuk cek Mazhab
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single();
      setUserProfile(profile);

      // 2. Tentukan tabel imsakiyah berdasarkan mazhab
      const imsakTable = profile?.mazhab?.toLowerCase() === 'muhammadiyah' 
      ? 'imsakiyah_muhammadiyah' 
      : 'imsakiyah_nu';

      const [acts, fasts, agds, zakats, tils, weeks, imsakData] = await Promise.all([
        supabase.from('daily_activities').select('*').eq('user_id', userId),
        supabase.from('fasting_logs').select('*').eq('user_id', userId),
        supabase.from('agenda').select('*').eq('user_id', userId),
        supabase.from('zakat_records').select('*').eq('user_id', userId),
        supabase.from('tilawah_logs').select('*').eq('user_id', userId),
        supabase.from('weekly_logs').select('*').eq('user_id', userId),
        supabase.from(imsakTable).select('*').order('hari_ke', { ascending: true })
      ]);

      if (acts.data) setDailyActivities(acts.data);
      if (fasts.data) setFastingLogs(fasts.data);
      if (agds.data) setAgendas(agds.data);
      if (zakats.data) setZakatRecords(zakats.data);
      if (tils.data) setTilawahLogs(tils.data);
      if (weeks.data) setWeeklyLogs(weeks.data);
      if (imsakData.data) setImsakiyah(imsakData.data);

    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const getFromNotes = (currentNotes: string, key: string) => {
    try { const noteObj = JSON.parse(currentNotes || '{}'); return noteObj[key]; } catch (e) { return undefined; }
  };

  const upsertDailyActivity = async (date: string, updates: any) => {
    if (!user) return;
    const existingIndex = dailyActivities.findIndex(d => d.date === date);
    let newActivities = [...dailyActivities];
    if (existingIndex >= 0) { newActivities[existingIndex] = { ...newActivities[existingIndex], ...updates }; }
    else { newActivities.push({ user_id: user.id, date, ...updates }); }
    setDailyActivities(newActivities);
    await supabase.from('daily_activities').upsert({ user_id: user.id, date, ...updates }, { onConflict: 'user_id, date' });
  };

  const setTargets = (newTargets: DailyTarget) => { setTargetsState(newTargets); };

  const getSholatEntry = (date: string): SholatEntry => {
    const act = dailyActivities.find(d => d.date === date);
    const notes = act?.notes || "";
    return {
      id: `sholat_${date}`, date,
      subuh: { done: act?.fajr || false, reason: getFromNotes(notes, 'subuh_reason') },
      dzuhur: { done: act?.dhuhr || false, reason: getFromNotes(notes, 'dzuhur_reason') },
      ashar: { done: act?.asr || false, reason: getFromNotes(notes, 'ashar_reason') },
      maghrib: { done: act?.maghrib || false, reason: getFromNotes(notes, 'maghrib_reason') },
      isya: { done: act?.isha || false, reason: getFromNotes(notes, 'isya_reason') },
    };
  };

  const updateSholatEntry = (entry: SholatEntry) => {
    const act = dailyActivities.find(d => d.date === entry.date);
    const currentNotes = act?.notes || "";
    let noteObj: any = {};
    try { noteObj = JSON.parse(currentNotes || '{}'); } catch (e) {}
    const prayers: ('subuh' | 'dzuhur' | 'ashar' | 'maghrib' | 'isya')[] = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'];
    prayers.forEach(p => {
      const key = `${p}_reason`;
      if (!entry[p].done && entry[p].reason) { noteObj[key] = entry[p].reason; }
      else { delete noteObj[key]; }
    });
    upsertDailyActivity(entry.date, { 
      fajr: entry.subuh.done, dhuhr: entry.dzuhur.done, asr: entry.ashar.done, maghrib: entry.maghrib.done, isha: entry.isya.done,
      notes: Object.keys(noteObj).length > 0 ? JSON.stringify(noteObj) : null 
    });
  };

  const getSholatSunnahEntry = (date: string): SholatSunnahEntry => {
    const act = dailyActivities.find(d => d.date === date);
    const notes = act?.notes || "";
    return { 
      id: `sunnah_${date}`, date, 
      dhuha: { done: act?.dhuha || false, rakaat: getFromNotes(notes, 'dhuha_r') || 2 }, 
      tahajud: { done: act?.tahajjud || false, rakaat: getFromNotes(notes, 'tahajud_r') || 2 }, 
      witir: { done: act?.witir || false, rakaat: getFromNotes(notes, 'witir_r') || 3 },
      tarawih: { done: act?.taraweeh || false, rakaat: getFromNotes(notes, 'tarawih_r') || 8 }
    };
  };

  const updateSholatSunnahEntry = (entry: SholatSunnahEntry) => {
    const act = dailyActivities.find(d => d.date === entry.date);
    const currentNotes = act?.notes || "";
    let noteObj: any = {};
    try { noteObj = JSON.parse(currentNotes || '{}'); } catch (e) {}
    noteObj['dhuha_r'] = entry.dhuha.rakaat;
    noteObj['tahajud_r'] = entry.tahajud.rakaat;
    noteObj['witir_r'] = entry.witir.rakaat;
    noteObj['tarawih_r'] = entry.tarawih.rakaat;
    upsertDailyActivity(entry.date, { dhuha: entry.dhuha.done, tahajjud: entry.tahajud.done, witir: entry.witir.done, taraweeh: entry.tarawih.done, notes: JSON.stringify(noteObj) });
  };

  const getTilawahEntries = (date: string): TilawahEntry[] => tilawahLogs.filter((t: any) => t.date === date).map((t: any) => ({ id: t.id, date: t.date, surah: t.surah, fromAyah: t.from_ayah, toAyah: t.to_ayah, ayahCount: t.ayah_count, timestamp: t.created_at }));
  
  const addTilawahEntry = async (entry: Omit<TilawahEntry, 'id'>) => {
    const { data } = await supabase.from('tilawah_logs').insert([{ user_id: user?.id, date: entry.date, surah: entry.surah, from_ayah: entry.fromAyah, to_ayah: entry.toAyah, ayah_count: entry.ayahCount }]).select();
    if (data) setTilawahLogs([...tilawahLogs, data[0]]);
  };

  const updateTilawahEntry = async (id: string, entry: Partial<TilawahEntry>) => {
    const { data } = await supabase.from('tilawah_logs').update({ surah: entry.surah, from_ayah: entry.fromAyah, to_ayah: entry.toAyah, ayah_count: entry.ayahCount }).eq('id', id).select();
    if (data) setTilawahLogs(prev => prev.map(item => item.id === id ? data[0] : item));
  };

  const deleteTilawahEntry = async (id: string) => {
    await supabase.from('tilawah_logs').delete().eq('id', id);
    setTilawahLogs(prev => prev.filter(item => item.id !== id));
  };

  const getSedekahEntries = (date: string): SedekahEntry[] => zakatRecords.filter((z: any) => z.payment_date === date && z.type === 'Sedekah').map((z: any) => ({ id: z.id, date: z.payment_date, amount: z.amount, method: z.channel, notes: z.notes, timestamp: z.created_at }));

  const addSedekahEntry = async (entry: any) => {
    const { data } = await supabase.from('zakat_records').insert([{ user_id: String(user!.id), type: 'Sedekah', amount: entry.amount, payment_date: entry.date, notes: entry.notes, channel: entry.method }]).select();
    if (data) setZakatRecords(prev => [...prev, data[0]]);
  };

  const updateSedekahEntry = async (id: string, entry: Partial<SedekahEntry>) => {
    const { data } = await supabase.from('zakat_records').update({ amount: entry.amount, channel: entry.method, notes: entry.notes }).eq('id', id).select();
    if (data) setZakatRecords(prev => prev.map(item => item.id === id ? data[0] : item));
  };

  const deleteSedekahEntry = async (id: string) => {
    await supabase.from('zakat_records').delete().eq('id', id);
    setZakatRecords(prev => prev.filter(item => item.id !== id));
  };

  const getPuasaEntry = (date: string): PuasaEntry => {
    const log = fastingLogs.find(f => f.date === date);
    return { id: log?.id || `p_${date}`, date, sahur: log?.sahur_check || false, puasa: log?.status === 'Berpuasa' };
  };

  const updatePuasaEntry = async (entry: PuasaEntry) => {
    const { data } = await supabase.from('fasting_logs').upsert({ user_id: String(user!.id), date: entry.date, status: entry.puasa ? 'Berpuasa' : (entry.reason || 'Tidak Berpuasa'), sahur_check: entry.sahur }, { onConflict: 'user_id, date' }).select();
    if (data) setFastingLogs(prev => [...prev.filter(f => f.date !== entry.date), data[0]]);
  };

  const getZakatEntries = (): ZakatEntry[] => zakatRecords.filter((z: any) => z.type.includes('Zakat')).map((z: any) => ({ id: z.id, type: z.type === 'Zakat Fitrah' ? 'fitrah' : 'maal', paymentDate: z.payment_date, channel: z.channel, totalAmount: z.amount, notes: z.notes }));
  
  const addZakatEntry = async (entry: any) => {
    const { data } = await supabase.from('zakat_records').insert([{ user_id: String(user!.id), type: entry.type === 'fitrah' ? 'Zakat Fitrah' : 'Zakat Mal', amount: entry.totalAmount, payment_date: entry.paymentDate, channel: entry.channel, notes: entry.notes, number_of_people: entry.numberOfPeople }]).select();
    if (data) setZakatRecords(prev => [...prev, data[0]]);
  };

  const getWeeklyEntry = (week: number): WeeklyEntry => {
    const w = weeklyLogs.find(l => l.week === week);
    return { id: w?.id || `w_${week}`, week, sholatJumat: w?.sholat_jumat || false, khutbahTopic: w?.khutbah_topic || '', kajian: w?.kajian || false, silaturahmi: w?.silaturahmi || false, amalSosial: w?.amal_sosial || false };
  };

  const updateWeeklyEntry = async (entry: WeeklyEntry) => {
    const { data } = await supabase.from('weekly_logs').upsert({ user_id: String(user!.id), week: entry.week, sholat_jumat: entry.sholatJumat, khutbah_topic: entry.khutbahTopic, kajian: entry.kajian, silaturahmi: entry.silaturahmi, amal_sosial: entry.amalSosial }, { onConflict: 'user_id, week' }).select();
    if (data) setWeeklyLogs(prev => [...prev.filter(l => l.week !== entry.week), data[0]]);
  };

  const getAgendaEntries = (): AgendaEntry[] => agendas.map((a: any) => ({ id: a.id, title: a.title, date: a.start_time.split('T')[0], time: a.start_time.split('T')[1].substring(0,5), category: 'ibadah', notes: a.description }));
  
  const addAgendaEntry = async (entry: any) => {
    const { data } = await supabase.from('agenda').insert([{ user_id: String(user!.id), title: entry.title, description: entry.notes, start_time: `${entry.date}T${entry.time}:00Z` }]).select();
    if (data) setAgendas(prev => [...prev, data[0]]);
  };

  const deleteAgendaEntry = async (id: string) => {
    await supabase.from('agenda').delete().eq('id', id);
    setAgendas(prev => prev.filter((a: any) => a.id !== id));
  };

  const getStats = () => ({
    totalPuasa: fastingLogs.filter(f => f.status === 'Berpuasa').length,
    totalSholat: dailyActivities.reduce((sum, a: any) => sum + [a.fajr, a.dhuhr, a.asr, a.maghrib, a.isha].filter(Boolean).length, 0),
    totalTilawah: tilawahLogs.reduce((sum, t: any) => sum + t.ayah_count, 0),
    totalSedekah: zakatRecords.filter(z => z.type === 'Sedekah').reduce((sum, z: any) => sum + z.amount, 0),
    totalZakat: zakatRecords.filter(z => z.type.includes('Zakat')).reduce((sum, z: any) => sum + z.amount, 0),
  });

  return (
    <DataContext.Provider value={{ targets, setTargets, getSholatEntry, updateSholatEntry, getSholatSunnahEntry, updateSholatSunnahEntry, getTilawahEntries, addTilawahEntry, updateTilawahEntry, deleteTilawahEntry, getSedekahEntries, addSedekahEntry, updateSedekahEntry, deleteSedekahEntry, getPuasaEntry, updatePuasaEntry, getZakatEntries, addZakatEntry, getWeeklyEntry, updateWeeklyEntry, getAgendaEntries, addAgendaEntry, deleteAgendaEntry, getStats, loading, imsakiyah, userProfile }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) throw new Error('useData must be used within a DataProvider');
  return context;
}