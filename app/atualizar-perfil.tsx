import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView, Modal, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import MaskInput from 'react-native-mask-input';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BotaoVoltarHome from '@/components/BotãoHome';

export default function Page() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const tiposDeConta = ['Corrente', 'Poupança', 'Salário', 'Investimento'];
  const [apelido, setApelido] = useState<string | null>(null);

  const [form, setForm] = useState({
    email: '',
    telefone: '',
    dataNascimento: '',
    endereco: '',
    tipoConta: '',
  });

  useEffect(() => {
    const buscarToken = async () => {
      const t = await AsyncStorage.getItem('token');
      if (t) {
        setToken(t);
        try {
          const response = await fetch(
            'https://mock-bank-mock-back.yexuz7.easypanel.host/contas/perfil',
            {
              method: 'GET',
              headers: {
                Accept: '*/*',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${t}`,
              },
            }
          );
          const data = await response.json();
          if (response.status === 200) {
            const dadosFiltrados = {
              email: data.email || '',
              telefone: data.telefone || '',
              dataNascimento: formatarParaDDMMYYYY(data.dataNascimento || ''),
              endereco: data.endereco || '',
              tipoConta: data.tipoConta || '',
            };
            setForm(dadosFiltrados);
          } else {
            Alert.alert(
              'Erro',
              Array.isArray(data.message)
                ? data.message.join('\n')
                : data.message || 'Erro ao buscar perfil.'
            );
          }
        } catch (error) {
          Alert.alert('Erro', 'Erro na conexão ao buscar perfil.');
        }
      }
    };
    buscarToken();
  }, []);

  useEffect(() => {
    const buscarApelido = async () => {
      const valor = await AsyncStorage.getItem('apelido');
      setApelido(valor);
    };
    buscarApelido();
  }, []);

  const handleInputChange = (field: keyof typeof form, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const validarEmail = (email: string) => {
    const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return regex.test(email);
  };

  const formatarParaDDMMYYYY = (data: string) => {
    if (!data.includes('-')) return data;
    const [ano, mes, diaComHora] = data.split('-');
    const dia = diaComHora.split('T')[0];
    return `${dia}/${mes}/${ano}`;
  };

  const formatarParaYYYYMMDD = (data: string) => {
    if (!data.includes('/')) return data;
    const [dia, mes, ano] = data.split('/');
    return `${ano}-${mes}-${dia}`;
  };

  const atualizarPerfil = async () => {
    if (!validarEmail(form.email)) {
      Alert.alert('Email inválido', 'Por favor, insira um e-mail válido.');
      return;
    }

    const formData = {
      ...form,
      dataNascimento: formatarParaYYYYMMDD(form.dataNascimento),
    };

    try {
      const response = await fetch(
        'https://mock-bank-mock-back.yexuz7.easypanel.host/contas/perfil',
        {
          method: 'PUT',
          headers: {
            Accept: '*/*',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (response.status === 200) {
        Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
        router.push('/home');
      } else if (response.status === 409) {
        Alert.alert('Erro', 'E-mail já em uso.');
      } else {
        Alert.alert(
          'Erro',
          Array.isArray(data.message)
            ? data.message.join('\n')
            : data.message || 'Erro ao atualizar perfil.'
        );
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro na conexão com o servidor.');
    }
  };

  return (
    <View style={styles.wrapper}>
      {apelido && <Header apelido={apelido} />}

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>✍️ Atualizar Perfil</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="Digite seu email"
            value={form.email}
            onChangeText={(value) => handleInputChange('email', value)}
            style={styles.input}
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Telefone</Text>
          <MaskInput
            style={styles.input}
            value={form.telefone}
            onChangeText={(value) => handleInputChange('telefone', value)}
            mask={[
              '(', /\d/, /\d/, ')', ' ',
              /\d/, /\d/, /\d/, /\d/, /\d/, '-',
              /\d/, /\d/, /\d/, /\d/
            ]}
            placeholder="(00) 00000-0000"
            keyboardType="phone-pad"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Data de Nascimento</Text>
          <MaskInput
            style={styles.input}
            value={form.dataNascimento}
            onChangeText={(value) => handleInputChange('dataNascimento', value)}
            mask={[
              /\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/
            ]}
            placeholder="DD/MM/AAAA"
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Endereço</Text>
          <TextInput
            placeholder="Digite seu endereço"
            value={form.endereco}
            onChangeText={(value) => handleInputChange('endereco', value)}
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tipo de Conta</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setModalVisible(true)}
          >
            <Text style={{ color: form.tipoConta ? '#fff' : '#999' }}>
              {form.tipoConta || 'Selecione o tipo de conta'}
            </Text>
          </TouchableOpacity>
        </View>

        <Modal transparent animationType="slide" visible={modalVisible}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Selecione o tipo de conta</Text>
              <FlatList
                data={tiposDeConta}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      handleInputChange('tipoConta', item);
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.modalItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalItemText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <TouchableOpacity style={styles.button} onPress={atualizarPerfil}>
          <Text style={styles.buttonText}>💾 Salvar</Text>
        </TouchableOpacity>

        <BotaoVoltarHome />
      </ScrollView>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#1e1e2f',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 40,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: '#ccc',
    marginBottom: 6,
    fontSize: 14,
  },
  input: {
    backgroundColor: '#2a2a3c',
    color: '#fff',
    padding: 12,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 30,
  },
  modalContainer: {
    backgroundColor: '#2a2a3c',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomColor: '#444',
    borderBottomWidth: 1,
  },
  modalItemText: {
    color: '#fff',
    fontSize: 16,
  },
  modalCancel: {
    marginTop: 20,
    alignItems: 'center',
  },
});