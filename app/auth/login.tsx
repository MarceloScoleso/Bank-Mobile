import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons'; 

export default function Page() {
  const router = useRouter();

  const [apelido, setApelido] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!apelido || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    try {
      const response = await fetch('https://mock-bank-mock-back.yexuz7.easypanel.host/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apelido, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login bem-sucedido:', data);

        await AsyncStorage.setItem('apelido', apelido);
        await AsyncStorage.setItem('token', data.token);

      
        Alert.alert('Sucesso', `Bem-vindo, ${apelido}!`, [
          {
            text: 'OK',
            onPress: () => router.push('/home'),
          },
        ]);
      } else {
        Alert.alert('Erro ao fazer login', data?.mensagem || 'Credenciais inválidas.');
      }
    } catch (error) {
      console.error('Erro na conexão com a API:', error);
      Alert.alert('Erro', 'Não foi possível conectar à API.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏦 Bank</Text>
      <Text style={styles.description}>
        Seu banco digital moderno, rápido e seguro.
      </Text>
      <Text style={styles.subTitle}>Entrar no Sistema</Text>

      <TextInput
        style={styles.input}
        placeholder="Apelido"
        placeholderTextColor="#888"
        value={apelido}
        onChangeText={setApelido}
        autoCapitalize="none"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry={!showPassword} 
          placeholderTextColor="#888"
          value={senha}
          onChangeText={setSenha}
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
          <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={24} color="#a0a0c0" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/auth/register')}>
        <Text style={styles.registerText}>
          Não tem uma conta?{' '}
          <Text style={{ fontWeight: 'bold', color: '#4e9efc' }}>Registre-se</Text>
        </Text>
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
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
    marginTop: -20, 
  },
  subTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 40,
    textAlign: 'center',
    marginTop: 20, 
  },
  description: {
    fontSize: 16,
    color: '#a0a0c0',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
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
    width: '100%',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: '7%',
    padding: 10,
    zIndex: 1,
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
  registerText: {
    color: '#a0a0c0',
    fontSize: 14,
    textAlign: 'center',
  },
});