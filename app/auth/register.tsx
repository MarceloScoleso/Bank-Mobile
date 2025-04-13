import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function Page() {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [apelido, setApelido] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Estado para controlar a visibilidade da senha

  const handleRegister = async () => {
    if (!nome || !cpf || !apelido || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    try {
      const response = await fetch('https://mock-bank-mock-back.yexuz7.easypanel.host/contas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome,
          cpf,
          apelido,
          senha,
        }),
      });

      if (response.status === 201) {
        Alert.alert('Sucesso', 'Conta criada com sucesso!');
        router.push('/auth/login');
      } else if (response.status === 409) {
        Alert.alert('Erro', 'Apelido ou CPF já cadastrado.');
      } else {
        const errorText = await response.text();
        console.error('Erro inesperado:', errorText);
        Alert.alert('Erro', 'Erro ao criar conta. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      Alert.alert('Erro', 'Erro de conexão com o servidor.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏦 Bank</Text>
      <Text style={styles.description}>
        Seu banco digital moderno, rápido e seguro.
      </Text>
      <Text style={styles.subTitle}>Criar Conta</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        placeholderTextColor="#888"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Documento (CPF)"
        placeholderTextColor="#888"
        value={cpf}
        onChangeText={setCpf}
      />
      <TextInput
        style={styles.input}
        placeholder="Apelido"
        placeholderTextColor="#888"
        value={apelido}
        onChangeText={setApelido}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry={!showPassword} // Controla se a senha está visível ou não
          placeholderTextColor="#888"
          value={senha}
          onChangeText={setSenha}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
          <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={24} color="#a0a0c0" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
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
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#a0a0c0',
    textAlign: 'center',
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 40,
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