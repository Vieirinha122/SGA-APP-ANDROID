import * as ScreenOrientation from "expo-screen-orientation"; // <-- Faltava essa importação
import React, { useEffect } from "react";
import { StatusBar, Text, View } from "react-native";
import useSettings from "../src/hooks/useSettings";
import BrowserScreen from "../src/screens/BrowserScreen";
import ConfigScreen from "../src/screens/ConfigScreen";
import { getPainelUrl } from "../src/utils/urls";

export default function App() {
  const { settings, loading, save } = useSettings();

  // Força a orientação da TV para Paisagem (Deitado) assim que o app abre
  useEffect(() => {
    async function lockLandscape() {
      try {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT,
        );
      } catch (err) {
        console.warn("Não foi possível travar a orientação:", err);
      }
    }
    lockLandscape();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0b111e",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "#fff" }}>Carregando Painel...</Text>
      </View>
    );
  }

  // Validação direta do Token sem precisar de um useState intermediário redundante
  const temTokenValido =
    settings?.painelToken && settings.painelToken.trim() !== "";

  // Se NÃO tem token salvo, renderiza direto a tela de configuração
  if (!temTokenValido) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0b111e" }}>
        <StatusBar hidden={true} />
        <ConfigScreen
          settings={settings}
          onSave={async (partial) => {
            await save(partial);
            // O próprio hook useSettings vai atualizar o estado,
            // fazendo o componente re-renderizar direto para o Painel
          }}
          onBack={() => {}}
        />
      </View>
    );
  }

  // Se JÁ TEM token, monta a URL do painel e abre a WebView direto
  const urlPainel = getPainelUrl(settings.painelToken);

  return (
    <View style={{ flex: 1, backgroundColor: "#0b111e" }}>
      {/* Oculta a barra de status para o modo TV/Kiosk total */}
      <StatusBar hidden={true} />

      <BrowserScreen
        url={urlPainel}
        page="painel"
        onNavigate={() => {}}
        onOpenConfig={() => {
          // Comando secreto dos 3 toques limpa o token e joga instantaneamente na tela de login
          save({ painelToken: "" });
        }}
      />
    </View>
  );
}
