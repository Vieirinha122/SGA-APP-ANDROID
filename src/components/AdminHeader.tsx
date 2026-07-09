import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PageKey } from "../types/types";

interface Props {
  activePage: PageKey;
  onSelectPage: (page: PageKey) => void;
  onOpenConfig: () => void;
  onCloseHeader: () => void;
}

export default function AdminHeader({
  activePage,
  onSelectPage,
  onOpenConfig,
  onCloseHeader,
}: Props) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onCloseHeader} style={styles.brand}>
        <Text style={styles.brandText}>SGA</Text>
      </TouchableOpacity>

      <View style={styles.nav}>
        <TouchableOpacity
          style={[
            styles.button,
            activePage === "painel" && styles.buttonActive,
          ]}
          onPress={() => onSelectPage("painel")}
        >
          <Text style={styles.buttonText}>Painel</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={onOpenConfig}>
          <Text style={styles.buttonText}>Configurações</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 999,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.85)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  brand: {
    paddingRight: 15,
    marginRight: 15,
    borderRightWidth: 1,
    borderRightColor: "rgba(255,255,255,0.2)",
  },
  brandText: { color: "#fff", fontWeight: "700" },
  nav: { flexDirection: "row" },
  button: {
    marginLeft: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  buttonActive: { backgroundColor: "rgba(96,165,250,0.2)" },
  buttonText: { color: "#fff", fontSize: 13 },
});
