import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useRef, useState } from "react";
import AppSettings from "../types/types";
import { DEFAULT_SETTINGS } from "../utils/constants";

const STORAGE_KEY = "@sga-app-settings";

export default function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  // Ref sempre aponta pro valor mais recente, pra evitar closures
  // desatualizadas dentro de save()
  const settingsRef = useRef(settings);
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  const load = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      }
    } catch (err) {
      console.warn("[useSettings] Falha ao carregar configurações:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const save = useCallback(async (partial: Partial<AppSettings>) => {
    const updated: AppSettings = { ...settingsRef.current, ...partial };
    settingsRef.current = updated;
    setSettings(updated);

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn("[useSettings] Falha ao salvar configurações:", err);
    }

    return updated;
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { settings, loading, save, reload: load };
}
