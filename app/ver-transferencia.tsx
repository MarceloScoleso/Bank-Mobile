import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BotaoVoltarHome from '@/components/BotãoHome';

export default function VerTransferencias() {
  const [transferencias, setTransferencias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [apelido, setApelido] = useState('');

  const buscarTransferencias = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const nome = await AsyncStorage.getItem('apelido');
      if (nome) setApelido(nome);

      if (!token) throw new Error('Token não encontrado');

      const res = await fetch(
        'https://mock-bank-mock-back.yexuz7.easypanel.host/transferencias?tipo=todas',
        {
          headers: {
            Accept: '*/*',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error('Erro ao buscar transferências');

      const dados = await res.json();
      setTransferencias(dados);
    } catch (error) {
      console.error('Erro:', error);
      setErro('Erro ao carregar transferências');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    buscarTransferencias();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    buscarTransferencias();
  }, []);

  const renderItem = ({ item }: any) => {
    const prefixo = item.tipo === 'recebida' ? '+' : '-';
    const corValor = item.tipo === 'recebida' ? styles.valorRecebido : styles.valorEnviado;
    const valorFormatado = `${prefixo} R$ ${item.valor.toFixed(2)}`;
    const data = new Date(item.data).toLocaleDateString();

    return (
      <TouchableOpacity
        onPress={() =>
            router.push({
                pathname: '/detalhes-transferencia',
                params: {
                  id: item.id.toString(),
                  tipo: item.tipo,
                  descricao: item.descricao,
                  categoria: item.categoria || '',
                  valor: item.valor.toString(),
                  data: new Date(item.data).toISOString(),
                }
              })
        }
        style={styles.card}
      >
        <Text style={[styles.valor, corValor]}>{valorFormatado}</Text>
        <Text style={styles.descricao}>{item.descricao}</Text>
        <Text style={styles.categoria}>{item.categoria || 'Sem categoria'}</Text>
        <Text style={styles.data}>{data}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header apelido={apelido} />

      <View style={styles.conteudo}>
        <Text style={styles.titulo}>💳 Minhas Transferências</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#4e9efc" />
        ) : erro ? (
          <Text style={styles.erro}>{erro}</Text>
        ) : (
          <FlatList
            data={transferencias}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListFooterComponent={<View style={{ height: 20 }} />}
          />
        )}

        <BotaoVoltarHome />
      </View>

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
  },
  titulo: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#2c2c3e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  valor: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  valorRecebido: {
    color: '#22c55e',
  },
  valorEnviado: {
    color: '#ef4444',
  },
  descricao: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 4,
  },
  categoria: {
    color: '#a1a1aa',
    fontSize: 14,
    fontStyle: 'italic',
  },
  data: {
    color: '#a1a1aa',
    fontSize: 14,
  },
  erro: {
    color: '#f87171',
    textAlign: 'center',
    marginTop: 20,
  }
});