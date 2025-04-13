import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function BotaoVoltarHome() {
return (
    <TouchableOpacity style={styles.botaoVoltar} onPress={() => router.push('/home')}>
    <Text style={styles.textoBotao}>⬅️ Voltar para Home</Text>
    </TouchableOpacity>
);
}

const styles = StyleSheet.create({
botaoVoltar: {
    backgroundColor: '#4e9efc',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
},
textoBotao: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
},
});