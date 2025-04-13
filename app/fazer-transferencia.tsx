import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Alert, ActivityIndicator, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BotaoVoltarHome from "@/components/BotãoHome";

export default function FazerTransferencia() {
  const [apelidoDestino, setApelidoDestino] = useState("");
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState(""); 
  const [carregando, setCarregando] = useState(false);
  const [saldoAtual, setSaldoAtual] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [apelido, setApelido] = useState("");
  const [mostrarSaldo, setMostrarSaldo] = useState(false); // Controle para mostrar ou esconder o saldo
  const router = useRouter();

  const buscarSaldo = async () => {
    try {
      const tokenSalvo = await AsyncStorage.getItem("token");
      const nome = await AsyncStorage.getItem("apelido");
      if (nome) setApelido(nome);

      if (!tokenSalvo) throw new Error("Token não encontrado");
      setToken(tokenSalvo);

      const res = await fetch(
        "https://mock-bank-mock-back.yexuz7.easypanel.host/contas/saldo",
        {
          headers: {
            Authorization: `Bearer ${tokenSalvo}`,
          },
        }
      );

      if (!res.ok) throw new Error("Erro ao buscar saldo.");
      const data = await res.json();
      setSaldoAtual(data.saldo);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível buscar o saldo.");
    }
  };

  useEffect(() => {
    buscarSaldo();
  }, []);

  const realizarTransferencia = async () => {
    if (!apelidoDestino || !valor) {
      Alert.alert("Campos obrigatórios", "Informe o apelido do destinatário e o valor.");
      return;
    }

    const valorNumerico = parseFloat(valor);
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      Alert.alert("Valor inválido", "Digite um valor numérico válido.");
      return;
    }

    if (saldoAtual === null) {
      Alert.alert("Aguarde", "Carregando saldo...");
      return;
    }

    if (valorNumerico > saldoAtual) {
      Alert.alert("Saldo insuficiente", `Seu saldo atual é R$ ${saldoAtual.toFixed(2)}.`);
      return;
    }

    setCarregando(true);
    try {
      const response = await fetch(
        "https://mock-bank-mock-back.yexuz7.easypanel.host/transferencias",
        {
          method: "POST",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            contaDestino: apelidoDestino,
            valor: valorNumerico,
            descricao: descricao || "Transferência",
            categoria: categoria || "Outros",
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao enviar transferência.");
      }

      Alert.alert("Sucesso", "Transferência realizada com sucesso!");
      router.push("/extrato");
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#111827" }}>
      <Header apelido={apelido} />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.titulo}>Enviar Dinheiro 💸</Text>

        <Text style={styles.saldo}>
          Saldo disponível:{" "}
          {saldoAtual === null
            ? "Carregando..."
            : mostrarSaldo
            ? `R$ ${saldoAtual.toFixed(2)}`
            : "••••••"
          }
          {/* Ícone de mostrar saldo */}
          {!carregando && saldoAtual !== null && (
            <TouchableOpacity onPress={() => setMostrarSaldo(!mostrarSaldo)}>
              <Text style={styles.olhoIcon}>
                {mostrarSaldo ? "🙈" : "👁️"}
              </Text>
            </TouchableOpacity>
          )}
        </Text>

        <TextInput
          placeholder="Apelido do destinatário"
          placeholderTextColor="#9ca3af"
          style={styles.input}
          value={apelidoDestino}
          onChangeText={setApelidoDestino}
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Valor (ex: 200)"
          placeholderTextColor="#9ca3af"
          style={styles.input}
          keyboardType="numeric"
          value={valor}
          onChangeText={setValor}
        />

        <TextInput
          placeholder="Descrição (opcional)"
          placeholderTextColor="#9ca3af"
          style={styles.input}
          value={descricao}
          onChangeText={setDescricao}
        />

        <Picker
          selectedValue={categoria}
          style={styles.picker}
          dropdownIconColor="#f9fafb"
          onValueChange={(itemValue) => setCategoria(itemValue)}
        >
          <Picker.Item label="Selecione uma categoria (opcional)" value="" />
          <Picker.Item label="Moradia" value="Moradia" />
          <Picker.Item label="Transporte" value="Transporte" />
          <Picker.Item label="Alimentação" value="Alimentação" />
          <Picker.Item label="Educação" value="Educação" />
          <Picker.Item label="Lazer" value="Lazer" />
          <Picker.Item label="Saúde" value="Saúde" />
          <Picker.Item label="Investimento" value="Investimento" />
          <Picker.Item label="Presentes" value="Presentes" />
          <Picker.Item label="Outros" value="Outros" />
        </Picker>

        {carregando ? (
          <ActivityIndicator size="large" color="#3b82f6" style={{ marginTop: 20 }} />
        ) : (
          <>
            <TouchableOpacity onPress={realizarTransferencia} style={styles.botao}>
              <Text style={styles.textoBotao}>Confirmar Transferência</Text>
            </TouchableOpacity>

            <BotaoVoltarHome />
          </>
        )}
      </ScrollView>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    justifyContent: "center",
  },
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "#f9fafb",
  },
  saldo: {
    fontSize: 18,
    marginBottom: 24,
    textAlign: "center",
    color: "#22d3ee",
    fontWeight: "bold",
  },
  olhoIcon: {
    fontSize: 20,
    marginLeft: 8,
    color: "#22d3ee",
  },
  input: {
    borderWidth: 1,
    borderColor: "#374151",
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#1f2937",
    color: "#f9fafb",
  },
  picker: {
    height: 56, 
    borderWidth: 1,
    borderColor: "#374151",
    borderRadius: 14,
    paddingHorizontal: 16,
    justifyContent: "center",
    backgroundColor: "#1f2937",
    color: "#f9fafb",
    marginBottom: 16,
  },
  botao: {
    backgroundColor: "#22c55e",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  textoBotao: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});