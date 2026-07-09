import React, { useCallback, useRef, useState } from "react";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { WebView } from "react-native-webview";
import AdminHeader from "../components/AdminHeader";
import { PageKey } from "../types/types";

interface Props {
  url: string;
  page: PageKey;
  onNavigate: (page: PageKey) => void;
  onOpenConfig: () => void;
}

export default function BrowserScreen({
  url,
  page,
  onNavigate,
  onOpenConfig,
}: Props) {
  const [headerVisible, setHeaderVisible] = useState(false);
  const clickCount = useRef(0);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Três toques na faixa invisível do topo revelam a barra administrativa
  // (equivalente ao handleSecretActivation do renderer.js)
  const handleSecretActivation = useCallback(() => {
    if (headerVisible) return;

    clickCount.current += 1;
    if (clickTimer.current) clearTimeout(clickTimer.current);

    if (clickCount.current === 3) {
      setHeaderVisible(true);
      clickCount.current = 0;
    } else {
      clickTimer.current = setTimeout(() => {
        clickCount.current = 0;
      }, 800);
    }
  }, [headerVisible]);

  const closeHeader = useCallback(() => {
    setHeaderVisible(false);
  }, []);

  const handleSelectPage = (target: PageKey) => {
    onNavigate(target);
    setHeaderVisible(false);
  };

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: url }}
        style={styles.webview}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        domStorageEnabled={true}
        javaScriptEnabled={true}
      />

      {/* Área invisível do topo — equivalente ao #trigger-zone */}
      <TouchableWithoutFeedback onPress={handleSecretActivation}>
        <View style={styles.triggerZone} />
      </TouchableWithoutFeedback>

      {headerVisible && (
        <AdminHeader
          activePage={page}
          onSelectPage={handleSelectPage}
          onOpenConfig={() => {
            setHeaderVisible(false);
            onOpenConfig();
          }}
          onCloseHeader={closeHeader}
        />
      )}

      <View style={styles.footer} pointerEvents="none"></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0b111e" },
  webview: { flex: 1, backgroundColor: "#0b111e" },
  triggerZone: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  footer: {
    position: "absolute",
    bottom: 8,
    left: 8,
  },
  footerText: {
    backgroundColor: "rgba(0,0,0,0.7)",
    color: "#fff",
    fontSize: 11,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
});
