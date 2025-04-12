import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Page() {
const [perfil, setPerfil] = useState<any>(null);
const [carregando, setCarregando] = useState(true);
const router = useRouter();

useEffect(() => {
    const buscarPerfil = async () => {
    const token = await AsyncStorage.getItem('token');

    if (!token) {
        setCarregando(false);
        return;
    }

    try {
        const response = await fetch('https://mock-bank-mock-back.yexuz7.easypanel.host/contas/perfil', {
        method: 'GET',
        headers: {
            accept: '*/*',
            Authorization: `Bearer ${token}`,
        },
        });

        const data = await response.json();
        setPerfil(data);
    } catch (error) {
        console.error('Erro ao buscar perfil:', error);
    } finally {
        setCarregando(false);
    }
    };

    buscarPerfil();
}, []);

if (carregando) {
    return (
    <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4e9efc" />
        <Text style={styles.loadingText}>Carregando perfil...</Text>
    </View>
    );
}

return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
    <Text style={styles.titulo}>👤 Meu Perfil</Text>

    {perfil ? (
        <View style={styles.card}>
        <Text style={styles.label}>Nome:</Text>
        <Text style={styles.valor}>{perfil.nome}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.valor}>{perfil.email}</Text>

        <Text style={styles.label}>CPF:</Text>
        <Text style={styles.valor}>{perfil.cpf}</Text>

        <Text style={styles.label}>Telefone:</Text>
        <Text style={styles.valor}>{perfil.telefone}</Text>
        </View>
    ) : (
        <Text style={styles.erro}>Não foi possível carregar o perfil.</Text>
    )}

    <TouchableOpacity style={styles.botao} onPress={() => router.push('/home')}>
        <Text style={styles.textoBotao}>⬅️ Voltar para a Home</Text>
    </TouchableOpacity>
    </ScrollView>
);
}

const styles = StyleSheet.create({
container: {
    backgroundColor: '#1e1e2f',
    flex: 1,
},
scrollContent: {
    padding: 20,
},
titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    marginTop: 16,
    textAlign: 'center',
},
card: {
    backgroundColor: '#2a2a3c',
    borderRadius: 14,
    padding: 20,
    marginBottom: 30,
},
label: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 4,
    fontWeight: '600',
},
valor: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 14,
},
erro: {
    color: '#f87171',
    textAlign: 'center',
},
botao: {
    backgroundColor: '#3b82f6',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
},
textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
},
loadingContainer: {
    flex: 1,
    backgroundColor: '#1e1e2f',
    alignItems: 'center',
    justifyContent: 'center',
},
loadingText: {
    marginTop: 12,
    color: '#aaa',
},
});