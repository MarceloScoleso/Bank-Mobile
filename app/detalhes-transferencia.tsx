import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type TransferenciaParams = {
  id?: string;
  tipo: string;
  descricao: string;
  categoria?: string;
  valor: string;
  data: string;
};

export default function DetalhesTransferencia() {
  const params = useLocalSearchParams<TransferenciaParams>();
  const [apelido, setApelido] = useState('');

  // Formata os dados recebidos
  const transferencia = {
    ...params,
    valor: parseFloat(params.valor),
    data: new Date(params.data)
  };

  useEffect(() => {
    const buscarApelido = async () => {
      const nome = await AsyncStorage.getItem('apelido');
      if (nome) setApelido(nome);
    };
    buscarApelido();
  }, []);

  // Formata os valores para exibição
  const prefixo = transferencia.tipo === 'recebida' ? '+' : '-';
  const corValor = transferencia.tipo === 'recebida' ? styles.valorRecebido : styles.valorEnviado;
  const valorFormatado = `${prefixo} R$ ${transferencia.valor.toFixed(2)}`;
  const dataFormatada = transferencia.data.toLocaleDateString('pt-BR');
  const horaFormatada = transferencia.data.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <View style={styles.container}>
      <Header apelido={apelido} />

      <ScrollView contentContainerStyle={styles.conteudo}>
        <Text style={styles.titulo}>📋 Detalhes da Transferência</Text>

        <View style={styles.card}>
          <Text style={[styles.valor, corValor]}>{valorFormatado}</Text>
          
          <View style={styles.detalheItem}>
            <Text style={styles.label}>Descrição:</Text>
            <Text style={styles.value}>{transferencia.descricao}</Text>
          </View>

          {transferencia.categoria && (
            <View style={styles.detalheItem}>
              <Text style={styles.label}>Categoria:</Text>
              <Text style={styles.value}>{transferencia.categoria}</Text>
            </View>
          )}

          <View style={styles.detalheItem}>
            <Text style={styles.label}>Data:</Text>
            <Text style={styles.value}>{dataFormatada} às {horaFormatada}</Text>
          </View>

          <View style={styles.detalheItem}>
            <Text style={styles.label}>Tipo:</Text>
            <Text style={styles.value}>
              {transferencia.tipo === 'recebida' ? 'Recebida' : 'Enviada'}
            </Text>
          </View>

          {transferencia.id && (
            <View style={styles.detalheItem}>
              <Text style={styles.label}>ID da Transação:</Text>
              <Text style={styles.value}>{transferencia.id}</Text>
            </View>
          )}
        </View>

        {/* Botão Voltar com novo estilo */}
        <TouchableOpacity 
          style={styles.botaoVoltar} 
          onPress={() => router.back()}
        >
          <Text style={styles.textoBotao}>⬅️ Voltar para transferências</Text>
        </TouchableOpacity>
      </ScrollView>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e2f',
  },
  conteudo: {
    padding: 20,
    paddingBottom: 40,
  },
  titulo: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#2c2c3e',
    padding: 20,
    borderRadius: 16,
    gap: 16,
  },
  valor: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  valorRecebido: {
    color: '#22c55e',
  },
  valorEnviado: {
    color: '#ef4444',
  },
  detalheItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#3f3f46',
  },
  label: {
    fontWeight: 'bold',
    color: '#a1a1aa',
    fontSize: 16,
  },
  value: {
    color: '#f8fafc',
    fontSize: 16,
    textAlign: 'right',
    flexShrink: 1,
    flexWrap: 'wrap',
    maxWidth: '60%',
  },
  // Estilos do botão igual ao da página VerTransferencias
  botaoVoltar: {
    backgroundColor: '#4e9efc',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});