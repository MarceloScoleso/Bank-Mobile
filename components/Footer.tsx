import { View, Text, StyleSheet } from 'react-native';


export default function Footer() {
return (
    <View style={styles.footer}>
    <Text style={styles.text}>✨ MockBank © 2025 - Todos os direitos reservados</Text>
    <Text style={styles.subtext}>Versão 1.0.0</Text>
    </View>
);
}

const styles = StyleSheet.create({
footer: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#2c2c3c',
    borderTopWidth: 1,
    borderTopColor: '#3c3c50',
    alignItems: 'center',
},
text: {
    color: '#aaa',
    fontSize: 12,
    fontStyle: 'italic',
},
subtext: {
    color: '#666',
    fontSize: 10,
    marginTop: 4,
},
});