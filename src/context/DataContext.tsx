import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface SholatEntry {
  id: string;
  date: string;
  subuh: { done: boolean; reason?: string };
  dzuhur: { done: boolean; reason?: string };
  ashar: { done: boolean; reason?: string };
  maghrib: { done: boolean; reason?: string };
  isya: { done: boolean; reason?: string };
}

export interface SholatSunnahEntry {
  id: string;
  date: string;
  dhuha: { done: boolean; rakaat?: number };
  tahajud: { done: boolean; rakaat?: number };
  witir: { done: boolean; rakaat?: number };
}

export interface TilawahEntry {
  id: string;
  date: string;
  surah: string;
  fromAyah: number;
  toAyah: number;
  ayahCount: number;
  timestamp: string;
}

export interface SedekahEntry {
  id: string;
  date: string;
  amount: number;
  method: 'masjid' | 'online' | 'direct';
  notes?: string;
  timestamp: string;
}

export interface PuasaEntry {
  id: string;
  date: string;
  sahur: boolean;
  sahurTime?: string;
  puasa: boolean;
  reason?: string;
}

export interface ZakatEntry {
  id: string;
  type: 'fitrah' | 'maal';
  paymentDate: string;
  paymentTime: string;
  numberOfPeople: number;
  channel: 'masjid' | 'laz' | 'online';
  amountPerPerson: number;
  totalAmount: number;
  notes?: string;
}

export interface DailyTarget {
  sholatTepat: boolean;
  tilawahHarian: boolean;
  sedekahHarian: boolean;
  puasaPenuh: boolean;
  tilawahAyahTarget?: number;
  sedekahAmountTarget?: number;
}

export interface WeeklyEntry {
  id: string;
  week: number; // Week of Ramadhan
  sholatJumat?: boolean;
  khutbahTopic?: string;
  kajian: boolean;
  silaturahmi: boolean;
  amalSosial: boolean;
}

export interface AgendaEntry {
  id: string;
  title: string;
  date: string;
  time: string;
  category: 'ibadah' | 'kajian' | 'sosial';
  reminder: boolean;
  notes?: string;
}

interface DataContextType {
  // Targets
  targets: DailyTarget;
  setTargets: (targets: DailyTarget) => void;
  
  // Daily tracking
  getSholatEntry: (date: string) => SholatEntry;
  updateSholatEntry: (entry: SholatEntry) => void;
  getSholatSunnahEntry: (date: string) => SholatSunnahEntry;
  updateSholatSunnahEntry: (entry: SholatSunnahEntry) => void;
  getTilawahEntries: (date: string) => TilawahEntry[];
  addTilawahEntry: (entry: Omit<TilawahEntry, 'id'>) => void;
  getSedekahEntries: (date: string) => SedekahEntry[];
  addSedekahEntry: (entry: Omit<SedekahEntry, 'id'>) => void;
  
  // Puasa tracking
  getPuasaEntry: (date: string) => PuasaEntry;
  updatePuasaEntry: (entry: PuasaEntry) => void;
  
  // Zakat
  getZakatEntries: () => ZakatEntry[];
  addZakatEntry: (entry: Omit<ZakatEntry, 'id'>) => void;
  
  // Weekly
  getWeeklyEntry: (week: number) => WeeklyEntry;
  updateWeeklyEntry: (entry: WeeklyEntry) => void;
  
  // Agenda
  getAgendaEntries: () => AgendaEntry[];
  addAgendaEntry: (entry: Omit<AgendaEntry, 'id'>) => void;
  deleteAgendaEntry: (id: string) => void;
  
  // Stats
  getStats: () => {
    totalPuasa: number;
    totalSholat: number;
    totalTilawah: number;
    totalSedekah: number;
    totalZakat: number;
  };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [targets, setTargetsState] = useState<DailyTarget>({
    sholatTepat: true,
    tilawahHarian: true,
    sedekahHarian: false,
    puasaPenuh: true,
  });

  const getStorageKey = (key: string) => {
    return user ? `ramadhan_${user.id}_${key}` : `ramadhan_guest_${key}`;
  };

  // Load targets on mount
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(getStorageKey('targets'));
      if (stored) {
        setTargetsState(JSON.parse(stored));
      }
    }
  }, [user]);

  const setTargets = (newTargets: DailyTarget) => {
    setTargetsState(newTargets);
    localStorage.setItem(getStorageKey('targets'), JSON.stringify(newTargets));
  };

  // Sholat entries
  const getSholatEntry = (date: string): SholatEntry => {
    const entries = JSON.parse(localStorage.getItem(getStorageKey('sholat')) || '[]');
    const existing = entries.find((e: SholatEntry) => e.date === date);
    if (existing) return existing;
    
    return {
      id: `sholat_${date}`,
      date,
      subuh: { done: false },
      dzuhur: { done: false },
      ashar: { done: false },
      maghrib: { done: false },
      isya: { done: false },
    };
  };

  const updateSholatEntry = (entry: SholatEntry) => {
    const entries = JSON.parse(localStorage.getItem(getStorageKey('sholat')) || '[]');
    const index = entries.findIndex((e: SholatEntry) => e.date === entry.date);
    if (index >= 0) {
      entries[index] = entry;
    } else {
      entries.push(entry);
    }
    localStorage.setItem(getStorageKey('sholat'), JSON.stringify(entries));
  };

  // Sholat Sunnah
  const getSholatSunnahEntry = (date: string): SholatSunnahEntry => {
    const entries = JSON.parse(localStorage.getItem(getStorageKey('sholat_sunnah')) || '[]');
    const existing = entries.find((e: SholatSunnahEntry) => e.date === date);
    if (existing) return existing;
    
    return {
      id: `sunnah_${date}`,
      date,
      dhuha: { done: false },
      tahajud: { done: false },
      witir: { done: false },
    };
  };

  const updateSholatSunnahEntry = (entry: SholatSunnahEntry) => {
    const entries = JSON.parse(localStorage.getItem(getStorageKey('sholat_sunnah')) || '[]');
    const index = entries.findIndex((e: SholatSunnahEntry) => e.date === entry.date);
    if (index >= 0) {
      entries[index] = entry;
    } else {
      entries.push(entry);
    }
    localStorage.setItem(getStorageKey('sholat_sunnah'), JSON.stringify(entries));
  };

  // Tilawah
  const getTilawahEntries = (date: string): TilawahEntry[] => {
    const entries = JSON.parse(localStorage.getItem(getStorageKey('tilawah')) || '[]');
    return entries.filter((e: TilawahEntry) => e.date === date);
  };

  const addTilawahEntry = (entry: Omit<TilawahEntry, 'id'>) => {
    const entries = JSON.parse(localStorage.getItem(getStorageKey('tilawah')) || '[]');
    entries.push({
      ...entry,
      id: `tilawah_${Date.now()}`,
    });
    localStorage.setItem(getStorageKey('tilawah'), JSON.stringify(entries));
  };

  // Sedekah
  const getSedekahEntries = (date: string): SedekahEntry[] => {
    const entries = JSON.parse(localStorage.getItem(getStorageKey('sedekah')) || '[]');
    return entries.filter((e: SedekahEntry) => e.date === date);
  };

  const addSedekahEntry = (entry: Omit<SedekahEntry, 'id'>) => {
    const entries = JSON.parse(localStorage.getItem(getStorageKey('sedekah')) || '[]');
    entries.push({
      ...entry,
      id: `sedekah_${Date.now()}`,
    });
    localStorage.setItem(getStorageKey('sedekah'), JSON.stringify(entries));
  };

  // Puasa
  const getPuasaEntry = (date: string): PuasaEntry => {
    const entries = JSON.parse(localStorage.getItem(getStorageKey('puasa')) || '[]');
    const existing = entries.find((e: PuasaEntry) => e.date === date);
    if (existing) return existing;
    
    return {
      id: `puasa_${date}`,
      date,
      sahur: false,
      puasa: false,
    };
  };

  const updatePuasaEntry = (entry: PuasaEntry) => {
    const entries = JSON.parse(localStorage.getItem(getStorageKey('puasa')) || '[]');
    const index = entries.findIndex((e: PuasaEntry) => e.date === entry.date);
    if (index >= 0) {
      entries[index] = entry;
    } else {
      entries.push(entry);
    }
    localStorage.setItem(getStorageKey('puasa'), JSON.stringify(entries));
  };

  // Zakat
  const getZakatEntries = (): ZakatEntry[] => {
    return JSON.parse(localStorage.getItem(getStorageKey('zakat')) || '[]');
  };

  const addZakatEntry = (entry: Omit<ZakatEntry, 'id'>) => {
    const entries = getZakatEntries();
    entries.push({
      ...entry,
      id: `zakat_${Date.now()}`,
    });
    localStorage.setItem(getStorageKey('zakat'), JSON.stringify(entries));
  };

  // Weekly
  const getWeeklyEntry = (week: number): WeeklyEntry => {
    const entries = JSON.parse(localStorage.getItem(getStorageKey('weekly')) || '[]');
    const existing = entries.find((e: WeeklyEntry) => e.week === week);
    if (existing) return existing;
    
    return {
      id: `weekly_${week}`,
      week,
      kajian: false,
      silaturahmi: false,
      amalSosial: false,
    };
  };

  const updateWeeklyEntry = (entry: WeeklyEntry) => {
    const entries = JSON.parse(localStorage.getItem(getStorageKey('weekly')) || '[]');
    const index = entries.findIndex((e: WeeklyEntry) => e.week === entry.week);
    if (index >= 0) {
      entries[index] = entry;
    } else {
      entries.push(entry);
    }
    localStorage.setItem(getStorageKey('weekly'), JSON.stringify(entries));
  };

  // Agenda
  const getAgendaEntries = (): AgendaEntry[] => {
    return JSON.parse(localStorage.getItem(getStorageKey('agenda')) || '[]');
  };

  const addAgendaEntry = (entry: Omit<AgendaEntry, 'id'>) => {
    const entries = getAgendaEntries();
    entries.push({
      ...entry,
      id: `agenda_${Date.now()}`,
    });
    localStorage.setItem(getStorageKey('agenda'), JSON.stringify(entries));
  };

  const deleteAgendaEntry = (id: string) => {
    const entries = getAgendaEntries();
    const filtered = entries.filter(e => e.id !== id);
    localStorage.setItem(getStorageKey('agenda'), JSON.stringify(filtered));
  };

  // Stats
  const getStats = () => {
    const puasaEntries = JSON.parse(localStorage.getItem(getStorageKey('puasa')) || '[]');
    const sholatEntries = JSON.parse(localStorage.getItem(getStorageKey('sholat')) || '[]');
    const tilawahEntries = JSON.parse(localStorage.getItem(getStorageKey('tilawah')) || '[]');
    const sedekahEntries = JSON.parse(localStorage.getItem(getStorageKey('sedekah')) || '[]');
    const zakatEntries = getZakatEntries();

    const totalPuasa = puasaEntries.filter((e: PuasaEntry) => e.puasa).length;
    
    let totalSholat = 0;
    sholatEntries.forEach((e: SholatEntry) => {
      if (e.subuh.done) totalSholat++;
      if (e.dzuhur.done) totalSholat++;
      if (e.ashar.done) totalSholat++;
      if (e.maghrib.done) totalSholat++;
      if (e.isya.done) totalSholat++;
    });

    const totalTilawah = tilawahEntries.reduce((sum: number, e: TilawahEntry) => sum + e.ayahCount, 0);
    const totalSedekah = sedekahEntries.reduce((sum: number, e: SedekahEntry) => sum + e.amount, 0);
    const totalZakat = zakatEntries.reduce((sum: number, e: ZakatEntry) => sum + e.totalAmount, 0);

    return {
      totalPuasa,
      totalSholat,
      totalTilawah,
      totalSedekah,
      totalZakat,
    };
  };

  return (
    <DataContext.Provider
      value={{
        targets,
        setTargets,
        getSholatEntry,
        updateSholatEntry,
        getSholatSunnahEntry,
        updateSholatSunnahEntry,
        getTilawahEntries,
        addTilawahEntry,
        getSedekahEntries,
        addSedekahEntry,
        getPuasaEntry,
        updatePuasaEntry,
        getZakatEntries,
        addZakatEntry,
        getWeeklyEntry,
        updateWeeklyEntry,
        getAgendaEntries,
        addAgendaEntry,
        deleteAgendaEntry,
        getStats,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
