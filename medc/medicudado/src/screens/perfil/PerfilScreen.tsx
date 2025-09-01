import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StorageService } from '../../services/StorageService';
import { Perfil, PerfilIdoso, PerfilCuidador } from '../../types';

const PerfilScreen = () => {
  const [tipoPerfil, setTipoPerfil] = useState<'idoso' | 'cuidador'>('idoso');
  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [condicoesMedicas, setCondicoesMedicas] = useState('');
  const [alergias, setAlergias] = useState('');
  const [relacao, setRelacao] = useState('');

  useEffect(() => {
    carregarPerfilAtivo();
  }, []);

  const carregarPerfilAtivo = async () => {
    const perfil = await StorageService.getPerfilAtivo();
    if (perfil) {
      setTipoPerfil(perfil.tipo);
      setNome(perfil.nome);
      setDataNascimento(perfil.dataNascimento || '');
      setTelefone(perfil.telefone || '');

      if (perfil.tipo === 'idoso') {
        const perfilIdoso = perfil as PerfilIdoso;
        setCondicoesMedicas(perfilIdoso.condicoesMedicas?.join(', ') || '');
        setAlergias(perfilIdoso.alergias?.join(', ') || '');
      } else {
        const perfilCuidador = perfil as PerfilCuidador;
        setRelacao(perfilCuidador.relacao);
      }
    }
  };

  const salvarPerfil = async () => {
    if (!nome) {
      Alert.alert('Erro', 'Por favor, preencha o nome');
      return;
    }

    try {
      const perfilBase: Partial<Perfil> = {
        id: Date.now().toString(),
        nome,
        dataNascimento,
        telefone,
      };

      let perfil: PerfilIdoso | PerfilCuidador;

      if (tipoPerfil === 'idoso') {
        perfil = {
          ...perfilBase,
          tipo: 'idoso',
          condicoesMedicas: condicoesMedicas.split(',').map(c => c.trim()).filter(Boolean),
          alergias: alergias.split(',').map(a => a.trim()).filter(Boolean),
        } as PerfilIdoso;
      } else {
        perfil = {
          ...perfilBase,
          tipo: 'cuidador',
          relacao,
          idososVinculados: [],
        } as PerfilCuidador;
      }

      await StorageService.salvarPerfil(perfil);
      await StorageService.setPerfilAtivo(perfil.id);
      Alert.alert('Sucesso', 'Perfil salvo com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao salvar perfil');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Meu Perfil</Text>

        <View style={styles.tipoPerfilContainer}>
          <TouchableOpacity
            style={[
              styles.tipoPerfilButton,
              tipoPerfil === 'idoso' && styles.tipoPerfilSelected
            ]}
            onPress={() => setTipoPerfil('idoso')}
          >
            <Text style={[
              styles.tipoPerfilText,
              tipoPerfil === 'idoso' && styles.tipoPerfilTextSelected
            ]}>Idoso</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tipoPerfilButton,
              tipoPerfil === 'cuidador' && styles.tipoPerfilSelected
            ]}
            onPress={() => setTipoPerfil('cuidador')}
          >
            <Text style={[
              styles.tipoPerfilText,
              tipoPerfil === 'cuidador' && styles.tipoPerfilTextSelected
            ]}>Cuidador</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome *</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Digite seu nome completo"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Data de Nascimento</Text>
          <TextInput
            style={styles.input}
            value={dataNascimento}
            onChangeText={setDataNascimento}
            placeholder="DD/MM/AAAA"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Telefone</Text>
          <TextInput
            style={styles.input}
            value={telefone}
            onChangeText={setTelefone}
            placeholder="(00) 00000-0000"
            keyboardType="phone-pad"
          />
        </View>

        {tipoPerfil === 'idoso' ? (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Condições Médicas</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={condicoesMedicas}
                onChangeText={setCondicoesMedicas}
                placeholder="Digite suas condições médicas (separadas por vírgula)"
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Alergias</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={alergias}
                onChangeText={setAlergias}
                placeholder="Digite suas alergias (separadas por vírgula)"
                multiline
                numberOfLines={4}
              />
            </View>
          </>
        ) : (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Relação com o Idoso</Text>
            <TextInput
              style={styles.input}
              value={relacao}
              onChangeText={setRelacao}
              placeholder="Ex: filho(a), cônjuge, etc"
            />
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={salvarPerfil}>
          <Text style={styles.buttonText}>Salvar Perfil</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  tipoPerfilContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tipoPerfilButton: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  tipoPerfilSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  tipoPerfilText: {
    fontSize: 16,
    color: '#666',
  },
  tipoPerfilTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PerfilScreen;
