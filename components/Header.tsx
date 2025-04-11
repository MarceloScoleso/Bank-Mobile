import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function HomeHeader({ apelido }: { apelido: string }) {
const [menuAberto, setMenuAberto] = useState(false);
const router = useRouter();

return (
    <View style={styles.header}>
    <View>
        <Text style={styles.bemVindo}>Bem-vindo,</Text>
        <Text style={styles.apelido}>{apelido}</Text>
        <Text style={styles.status}>Status: <Text style={styles.ativo}>Ativa ✅</Text></Text>
    </View>

    <View>
        <TouchableOpacity onPress={() => setMenuAberto(!menuAberto)}>
        <Ionicons name="menu" size={30} color="#fff" />
        </TouchableOpacity>

        {menuAberto && (
        <View style={styles.menu}>
            <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
                setMenuAberto(false);
                router.push('./perfil');
            }}
            >
            <Text style={styles.menuText}>👤 Ver Perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
                setMenuAberto(false);
                router.push('./atualizar-perfil');
            }}
            >
            <Text style={styles.menuText}>✏️ Atualizar Perfil</Text>
            </TouchableOpacity>
        </View>
        )}
    </View>
    </View>
);
}

const styles = StyleSheet.create({
header: {
    backgroundColor: '#12121a',
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#2e2e3e',
},
bemVindo: {
    color: '#aaa',
    fontSize: 16,
},
apelido: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
},
status: {
    color: '#ccc',
    marginTop: 4,
},
ativo: {
    color: '#22c55e',
    fontWeight: 'bold',
},
menu: {
    backgroundColor: '#1e1e2f',
    borderRadius: 8,
    marginTop: 12,
    padding: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
},
menuItem: {
    paddingVertical: 8,
},
menuText: {
    color: '#fff',
    fontSize: 16,
},
});