import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

// Componentes reutilizáveis
import HomeHeader from '../components/Header';
import Footer from '../components/Footer';
import BotaoVoltarHome from '@/components/BotãoHome';

interface Conta {
id: number;
nome: string;
apelido: string;
saldo: number;
tipoConta: string;
}

export default function Page() {
const [contas, setContas] = useState<Conta[]>([]);
const [loading, setLoading] = useState(true);
const [apelido, setApelido] = useState<string | null>(null);

useEffect(() => {
    const buscarDados = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        const apelidoSalvo = await AsyncStorage.getItem('apelido');
        setApelido(apelidoSalvo);

        if (!token) {
        console.warn('Token não encontrado!');
        setLoading(false);
        return;
        }
        
        const resposta = await fetch('https://mock-bank-mock-back.yexuz7.easypanel.host/contas', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
        },
        });
        
        if (!resposta.ok) {
        throw new Error(`Erro ${resposta.status}: ${resposta.statusText}`);
        }

        const dados = await resposta.json();
        setContas(dados);
    } catch (erro) {
        console.error('Erro ao buscar contas:', erro);
    } finally {
        setLoading(false);
    }
    };

    buscarDados();
}, []);

return (
    <View style={styles.container}>
{apelido && <HomeHeader apelido={apelido} />}

<View style={styles.conteudo}>
    <Text style={styles.titulo}>💳 Contas</Text>

    {loading ? (
    <ActivityIndicator size="large" color="#4e9efc" style={{ marginTop: 20 }} />
    ) : (
    <FlatList
        data={contas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
        <View style={styles.card}>
            <Text style={styles.nome}>🏷️ {item.nome}</Text>
            <Text style={styles.apelido}>✍️ Apelido da Conta: {item.apelido}</Text>
            <Text style={styles.saldo}>💰 Saldo: R$ {item.saldo.toFixed(2)}</Text>
            <Text style={styles.tipoConta}>📘 Tipo: {item.tipoConta}</Text>
        </View>
        )}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhuma conta encontrada.</Text>}
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
    paddingHorizontal: 0,
    paddingTop: 0,
},
conteudo: {
    paddingHorizontal: 20,
    flex: 1,
},
titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 15, 
    marginBottom: 20,
    textAlign: 'center',
},
card: {
    backgroundColor: '#2a2a3c',
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
},
nome: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
},
apelido: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 4,
},
saldo: {
    color: '#22c55e',
    fontSize: 16,
    marginBottom: 4,
    fontWeight: 'bold',
},
tipoConta: {
    color: '#38bdf8',
    fontSize: 14,
},
vazio: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
},
});