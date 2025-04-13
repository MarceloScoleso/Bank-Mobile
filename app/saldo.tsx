import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BotaoVoltarHome from '@/components/BotãoHome';

export default function Page() {
  const [saldo, setSaldo] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [mostrarSaldo, setMostrarSaldo] = useState(false);

  useEffect(() => {
    const buscarSaldo = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        if (!token) {
          throw new Error('Token não encontrado.');
        }

        const resposta = await fetch('https://mock-bank-mock-back.yexuz7.easypanel.host/contas/saldo', {
          method: 'GET',
          headers: {
            Accept: '*/*',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!resposta.ok) {
          throw new Error(`Erro na resposta: ${resposta.status}`);
        }

        const data = await resposta.json();
        setSaldo(data.saldo);
      } catch (error) {
        console.error('Erro ao buscar saldo:', error);
        setErro('Erro ao buscar saldo');
      } finally {
        setLoading(false);
      }
    };

    buscarSaldo();
  }, []);

  const [apelido, setApelido] = useState<string>('Carregando...');

  useEffect(() => {
    const buscarApelido = async () => {
      const nomeSalvo = await AsyncStorage.getItem('apelido');
      if (nomeSalvo) {
        setApelido(nomeSalvo);
      } else {
        setApelido('Visitante');
      }
    };

    buscarApelido();
  }, []);

  return (
    <View style={styles.container}>
      <Header apelido={apelido} />

      <View style={styles.content}>
        <Text style={styles.titulo}>💰 Seu Saldo Atual</Text>

        {loading && <ActivityIndicator size="large" color="#4e9efc" />}

        {!loading && erro && (
          <Text style={styles.erro}>{erro}</Text>
        )}

        {!loading && saldo !== null && (
          <View style={styles.cardSaldo}>
            <View style={styles.linhaSaldo}>
              <Text style={styles.valor}>
                {mostrarSaldo ? `R$ ${saldo.toFixed(2)}` : '•••••••'}
              </Text>

              <TouchableOpacity onPress={() => setMostrarSaldo(!mostrarSaldo)}>
                <Text style={styles.olhinho}>{mostrarSaldo ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {!loading && (
          <Text style={styles.frase}>
            “Quem guarda sempre tem... especialmente aqui no MockBank!” 🏦
          </Text>
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
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  cardSaldo: {
    backgroundColor: '#4e9efc',
    paddingVertical: 30,
    paddingHorizontal: 40,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 20,
  },
  linhaSaldo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  valor: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  olhinho: {
    fontSize: 28,
  },
  erro: {
    color: '#f87171',
    fontSize: 16,
    textAlign: 'center',
  },
  frase: {
    color: '#ccc',
    fontSize: 16,
    fontStyle: 'italic',
    marginTop: 16,
    textAlign: 'center',
  }
});