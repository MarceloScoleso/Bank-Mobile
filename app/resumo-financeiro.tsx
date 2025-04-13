import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BotaoVoltarHome from '@/components/BotãoHome';
import { useRouter } from 'expo-router';

export default function ResumoTransacoes() {
  const [resumo, setResumo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [apelido, setApelido] = useState('');

  const router = useRouter();

  const buscarResumo = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const nome = await AsyncStorage.getItem('apelido');
      if (nome) setApelido(nome);

      if (!token) throw new Error('Token não encontrado');

      const res = await fetch(
        'https://mock-bank-mock-back.yexuz7.easypanel.host/contas/resumo-transacoes',
        {
          headers: {
            Accept: '*/*',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error('Erro ao buscar resumo de transações');

      const dados = await res.json();
      setResumo(dados);
    } catch (error) {
      console.error('Erro:', error);
      setErro('Erro ao carregar o resumo de transações');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarResumo();
  }, []);

  const formatarValor = (valor: number) =>
    valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <View style={styles.container}>
      <Header apelido={apelido} />

      <ScrollView style={styles.conteudo}>
        <Text style={styles.titulo}>📊 Resumo de Transações</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#4e9efc" />
        ) : erro ? (
          <Text style={styles.erro}>{erro}</Text>
        ) : resumo ? (
          <View>
            <View style={styles.card}>
              <Text style={styles.label}>Total de Entradas</Text>
              <Text style={[styles.valor, { color: '#22c55e' }]}>
                + {formatarValor(resumo.totalRecebido)}
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.label}>Total de Saídas</Text>
              <Text style={[styles.valor, { color: '#ef4444' }]}>
                - {formatarValor(resumo.totalEnviado)}
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.label}>Saldo Final</Text>
              <Text style={[styles.valor, { color: '#60a5fa' }]}>
                {formatarValor(resumo.saldo)}
              </Text>
            </View>

            {resumo.categorias && (
              <View style={styles.card}>
                <Text style={styles.label}>Gastos por Categoria</Text>
                {resumo.categorias.map((cat: any, index: number) => (
                  <View key={index} style={{ marginBottom: 8 }}>
                    <Text style={styles.categoria}>
                      {cat.nome}
                    </Text>
                    <Text style={styles.categoria}>
                      Enviado: {formatarValor(cat.enviado)} | Recebido: {formatarValor(cat.recebido)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ) : (
          <Text style={styles.erro}>Nenhum dado encontrado.</Text>
        )}

        
            <View style={{ marginBottom: 30 }}>
                <BotaoVoltarHome />
            </View>
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
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  titulo: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#2c2c3e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#cbd5e1',
    marginBottom: 6,
  },
  valor: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  categoria: {
    color: '#a1a1aa',
    fontSize: 14,
  },
  erro: {
    color: '#f87171',
    textAlign: 'center',
    marginTop: 20,
  }
});