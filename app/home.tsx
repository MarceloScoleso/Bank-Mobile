import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import HomeHeader from '../components/Header';
import Footer from '../components/Footer';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const funcionalidades = [
  { titulo: 'Listar contas', rota: '/contas', emoji: '💳', cor: '#4e9efc' },
  { titulo: 'Consultar Saldo', rota: '/saldo', emoji: '💰', cor: '#3b82f6' },
  { titulo: 'Ver Extrato', rota: '/extrato', emoji: '📄', cor: '#38bdf8' },
  { titulo: 'Resumo Financeiro', rota: '/contas/resumo-transacoes', emoji: '📊', cor: '#14b8a6' },
  { titulo: 'Fazer Transferência', rota: '/fazer-transferencia', emoji: '🔁', cor: '#22c55e' },
  { titulo: 'Ver Transferências', rota: '/transferencias', emoji: '📑', cor: '#f59e0b' },
] as const;

export default function Page() {
  const [apelido, setApelido] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const buscarApelido = async () => {
      const valor = await AsyncStorage.getItem('apelido');
      setApelido(valor);
    };

    buscarApelido();
  }, []);

  return (
    <View style={styles.container}>
      {apelido && <HomeHeader apelido={apelido} />}
      
      <View style={styles.contentWrapper}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.hero}>
            <Text style={styles.heroTitle}>Controle sua vida financeira com estilo 😎</Text>
            <Text style={styles.heroSubtitle}>
              Veja seu saldo e muito mais com facilidade.
            </Text>
          </View>

          <View style={styles.metaCard}>
            <Text style={styles.metaTitle}>🎯 Meta de economia:</Text>
            <Text style={styles.metaValor}>R$ 5.000,00</Text>
          </View>

          <Text style={styles.sectionTitle}>⚙️ Funcionalidades</Text>

          <View style={styles.grid}>
            {funcionalidades.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.card, { backgroundColor: item.cor }]}
                onPress={() => router.push(item.rota as any)}
              >
                <Text style={styles.cardEmoji}>{item.emoji}</Text>
                <Text style={styles.cardTitulo}>{item.titulo}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Footer fixo fora do ScrollView */}
        <Footer />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e2f',
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'space-between',
  },
  scrollContent: {
    padding: 20,
  },
  hero: {
    marginBottom: 24,
    padding: 20,
    backgroundColor: '#2a2a3c',
    borderRadius: 16,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  heroSubtitle: {
    color: '#aaa',
    fontSize: 14,
  },
  metaCard: {
    backgroundColor: '#3b82f6',
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  metaTitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 6,
  },
  metaValor: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginVertical: 20,
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    letterSpacing: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '47%',
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
  },
  cardEmoji: {
    fontSize: 24,
    marginBottom: 6,
  },
  cardTitulo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
});
