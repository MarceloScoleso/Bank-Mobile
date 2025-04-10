import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Login() {
const router = useRouter();

return (
    <View style={styles.container}>
    <Text style={styles.title}>Entrar na Conta</Text>

    <TextInput style={styles.input} placeholder="Apelido" placeholderTextColor="#888" />
    <TextInput style={styles.input} placeholder="Senha" secureTextEntry placeholderTextColor="#888" />

    <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Login</Text>
    </TouchableOpacity>

    <TouchableOpacity onPress={() => router.push('/auth/register')}>
        <Text style={styles.link}>Ainda não tem conta? Registre-se</Text>
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
    backgroundColor: '#4e9efc',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
},
buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
},
link: {
    color: '#4e9efc',
    textAlign: 'center',
    fontSize: 14,
},
});
