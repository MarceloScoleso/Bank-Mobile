import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Register() {
const router = useRouter();

return (
    <View style={styles.container}>
    <Text style={styles.title}>Criar Conta</Text>

    <TextInput style={styles.input} placeholder="Nome" placeholderTextColor="#888" />
    <TextInput style={styles.input} placeholder="Documento" placeholderTextColor="#888" />
    <TextInput style={styles.input} placeholder="Apelido" placeholderTextColor="#888" />
    <TextInput style={styles.input} placeholder="Senha" secureTextEntry placeholderTextColor="#888" />

    <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Registrar</Text>
    </TouchableOpacity>

    <TouchableOpacity onPress={() => router.push('/auth/login')}>
        <Text style={styles.link}>Já tem uma conta? Faça login</Text>
    </TouchableOpacity>
    </View>
);
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#1e1e2f',
    padding: 24,
    justifyContent: 'center',
},
title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 24,
    textAlign: 'center',
},
input: {
    backgroundColor: '#2c2c3c',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#3c3c50',
},
button: {
    backgroundColor: '#22c55e',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
},
buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
},
link: {
    color: '#22c55e',
    textAlign: 'center',
    fontSize: 14,
},
});
