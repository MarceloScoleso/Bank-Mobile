import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏦 Bank</Text>
      <Text style={styles.description}>
        Seu banco digital moderno, rápido e seguro.
      </Text>

      <TouchableOpacity
        style={[styles.button, styles.loginButton]}
        onPress={() => router.push('/auth/login')}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.registerButton]}
        onPress={() => router.push('/auth/register')}
      >
        <Text style={styles.buttonText}>Registrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e2f',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#a0a0c0',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    width: '80%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 8,
  },
  loginButton: {
    backgroundColor: '#4e9efc',
  },
  registerButton: {
    backgroundColor: '#22c55e',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
