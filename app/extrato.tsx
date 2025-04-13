import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BotaoVoltarHome from '@/components/BotãoHome';
import { router } from 'expo-router';

export default function Page() {
  const [transacoes, setTransacoes] = useState<any[]>([]);
  const [saldo, setSaldo] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [pagina, setPagina] = useState(1);
  const [apelido, setApelido] = useState('');
  const [mostrarSaldo, setMostrarSaldo] = useState(false); // Estado para controle da visibilidade do saldo
  const itensPorPagina = 10;

  const buscarDados = async (reset = false, paginaAtual = 1) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const nome = await AsyncStorage.getItem('apelido');
      if (nome) setApelido(nome);

      if (!token) throw new Error('Token não encontrado');

      // Extrato
      const resTransacoes = await fetch(
        'https://mock-bank-mock-back.yexuz7.easypanel.host/contas/extrato?tipo=todas',
        {
          headers: {
            Accept: '*/*',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!resTransacoes.ok) throw new Error('Erro ao buscar extrato');

      const dadosTransacoes = await resTransacoes.json();
      const dadosPaginados = dadosTransacoes.slice(0, paginaAtual * itensPorPagina);

      setTransacoes(
        reset
          ? dadosPaginados
          : [...transacoes, ...dadosTransacoes.slice((paginaAtual - 1) * itensPorPagina, paginaAtual * itensPorPagina)]
      );

      // Saldo
      const resSaldo = await fetch(
        'https://mock-bank-mock-back.yexuz7.easypanel.host/contas/saldo',
        {
          headers: {
            Accept: '*/*',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const dadosSaldo = await resSaldo.json();
      setSaldo(dadosSaldo.saldo);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setErro('Erro ao carregar informações');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    buscarDados(true, 1);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPagina(1);
    buscarDados(true, 1);
  }, []);

  const carregarMais = () => {
    const novaPagina = pagina + 1;
    setPagina(novaPagina);
    buscarDados(false, novaPagina);
  };

  const renderItem = ({ item }: any) => {
    const tipo = item.tipo?.toLowerCase(); // 'recebida' ou 'enviada'
    const isCredito = tipo === 'recebida'; // Transação recebida (do destino)
    const corValor = isCredito ? '#22c55e' : '#ef4444'; // Verde para crédito, vermelho para débito
    const prefixo = isCredito ? '+' : '-'; // "+" para crédito e "-" para débito
    const valorFormatado = `${prefixo} R$ ${Math.abs(item.valor).toFixed(2)}`; // Valor formatado
    const categoria = item.categoria || 'Sem categoria'; // Categoria da transação, caso não exista, "Sem categoria"
  
    return (
      <View style={styles.transacao}>
        <Text style={styles.descricao}>
          {item.descricao} <Text style={styles.categoria}>({categoria})</Text>
        </Text>
        <Text style={styles.data}>{new Date(item.data).toLocaleDateString()}</Text>
        <Text style={[styles.valor, { color: corValor }]}>{valorFormatado}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header apelido={apelido} />

      <View style={styles.conteudo}>
        <Text style={styles.titulo}>📄 Extrato de Transações</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#4e9efc" />
        ) : erro ? (
          <Text style={styles.erro}>{erro}</Text>
        ) : (
          <>
            <View style={styles.saldoBox}>
              <Text style={styles.saldoTexto}>Saldo Atual</Text>
              <View style={styles.saldoValorContainer}>
                <Text style={styles.saldoValor}>
                  {mostrarSaldo ? `R$ ${saldo?.toFixed(2)}` : '•••••••'}
                </Text>
                <TouchableOpacity onPress={() => setMostrarSaldo(!mostrarSaldo)}>
                  <Text style={styles.olhinho}>{mostrarSaldo ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <FlatList
              data={transacoes}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
              onEndReached={carregarMais}
              onEndReachedThreshold={0.5}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
              ListFooterComponent={<View style={{ height: 20 }} />}
            />
          </>
        )}

        <TouchableOpacity style={styles.botaoNova} onPress={() => router.push('/fazer-transferencia')}>
          <Text style={styles.textoBotao}>➕ Nova Transação</Text>
        </TouchableOpacity>

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
  titulo: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  saldoBox: {
    backgroundColor: '#4e9efc',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  saldoTexto: {
    color: '#fff',
    fontSize: 16,
  },
  saldoValorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  saldoValor: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  olhinho: {
    fontSize: 28,
  },
  transacao: {
    backgroundColor: '#2c2c3e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
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
    marginBottom: 4,
  },
  valor: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  conteudo: {
    flex: 1,
    paddingHorizontal: 20,
  },
  botaoNova: {
    backgroundColor: '#22c55e',
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  erro: {
    color: '#f87171',
    fontSize: 16,
    textAlign: 'center',
  },
});