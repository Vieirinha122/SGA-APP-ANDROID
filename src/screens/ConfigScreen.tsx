import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AppSettings from "../types/types";

interface Props {
  settings: AppSettings;
  onSave: (partial: Partial<AppSettings>) => Promise<void>;
  onBack: () => void;
}

export default function ConfigScreen({ settings, onSave, onBack }: Props) {
  const [painelToken, setPainelToken] = useState(settings.painelToken);

  const handleSave = async () => {
    // Garante que o app saiba que a última página acessada foi o painel
    await onSave({
      painelToken,
      lastPage: "painel",
    });
    onBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Configuração do Painel TV</Text>
        <Text style={styles.subtitle}>
          Insira os dados para conectar ao chamador de senhas
        </Text>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Token do Painel</Text>
        <TextInput
          style={styles.input}
          value={painelToken}
          onChangeText={setPainelToken}
          placeholder="Insira o token ou a URL completa do painel"
          placeholderTextColor="#6b7280"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.btnSave]}
          onPress={handleSave}
        >
          <Text style={styles.btnText}>Conectar Painel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#0b111e",
    padding: 24,
    justifyContent: "center",
  },
  header: {
    marginBottom: 32,
    borderBottomWidth: 1,
    borderBottomColor: "#1f2937",
    paddingBottom: 16,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    color: "#9ca3af",
    fontSize: 14,
    textAlign: "center",
    marginTop: 6,
  },
  formGroup: {
    marginBottom: 32,
  },
  label: {
    color: "#e5e7eb",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#111827",
    color: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  actions: {
    flexDirection: "row",
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  btnSave: {
    backgroundColor: "#2563eb",
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
