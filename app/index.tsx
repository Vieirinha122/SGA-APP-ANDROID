import React from "react";
import { StatusBar, Text, View } from "react-native";
import useSettings from "../src/hooks/useSettings";
import BrowserScreen from "../src/screens/BrowserScreen";
import ConfigScreen from "../src/screens/ConfigScreen";
import { getPainelUrl } from "../src/utils/urls";

export default function App() {
  const { settings, loading, save } = useSettings();
  const [isConfigOpen, setIsConfigOpen] = React.useState(false);

  // 1. Enquanto carrega o AsyncStorage, trava na tela de splash
  // Isso evita que o app tente injetar strings nulas ou indefinidas na WebView antes da hora
  if (loading || !settings) {
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

  // 2. Validação estrita e à prova de falhas do token
  const token = settings?.painelToken;
  const temTokenValido =
    token && typeof token === "string" && token.trim() !== "";

  // 3. Se NÃO tem token salvo ou veio a tela de configuração aberta, renderiza a tela de configuração
  if (!temTokenValido || isConfigOpen) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0b111e" }}>
        <StatusBar hidden={true} />
        <ConfigScreen
          settings={settings}
          onSave={async (partial) => {
            await save(partial);
          }}
          onBack={() => {
            if (temTokenValido) {
              setIsConfigOpen(false);
            }
          }}
        />
      </View>
    );
  }

  // 4. Monta a URL com proteção contra quebras de string
  let urlPainel = "";
  try {
    urlPainel = getPainelUrl(token);
  } catch (err) {
    console.warn("Erro ao gerar URL do painel:", err);
  }

  // Se a URL der errada por qualquer motivo, exibe o aviso em vez de fechar o app
  if (!urlPainel) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0b111e",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#ff4444" }}>Erro interno: URL inválida.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#0b111e" }}>
      {/* Oculta a barra de status para o modo TV/Kiosk total */}
      <StatusBar hidden={true} />

      <BrowserScreen
        url={urlPainel}
        page="painel"
        onNavigate={() => {}}
        onOpenConfig={() => {
          setIsConfigOpen(true);
        }}
      />
    </View>
  );
}
