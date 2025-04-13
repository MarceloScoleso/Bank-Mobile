import { Link, Stack } from 'expo-router';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Página não encontrada' }} />
      <View style={styles.container}>
        <Text style={styles.emoji}>🕵️‍♂️</Text>
        <Text style={styles.title}>Página não encontrada</Text>
        <Text style={styles.description}>
          Parece que você se perdeu no caminho. Vamos voltar?
        </Text>

        <Link href="/" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Voltar para a Home</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#cccccc',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#1e90ff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});