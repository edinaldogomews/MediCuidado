import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useMedicamentos } from '../screens/MedicamentosContext';

const EditMedicamentoScreen = ({ route, navigation }) => {
  const { medicamento } = route.params;
  const [nome, setNome] = useState(medicamento.nome);
  const [tipo, setTipo] = useState(medicamento.tipo);
  const [estoque, setEstoque] = useState(String(medicamento.estoque));
  const [proximaData, setProximaData] = useState(medicamento.proximaData);
  const { editarMedicamento } = useMedicamentos();

  const handleSalvar = () => {
    editarMedicamento(medicamento.id, {
      nome,
      tipo,
      estoque: Number(estoque),
      proximaData,
    });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome</Text>
      <TextInput value={nome} onChangeText={setNome} style={styles.input} />

      <Text style={styles.label}>Tipo</Text>
      <TextInput value={tipo} onChangeText={setTipo} style={styles.input} />

      <Text style={styles.label}>Estoque</Text>
      <TextInput value={estoque} onChangeText={setEstoque} style={styles.input} keyboardType="numeric" />

      <Text style={styles.label}>Próxima Data</Text>
      <TextInput value={proximaData} onChangeText={setProximaData} style={styles.input} />

      <TouchableOpacity style={styles.button} onPress={handleSalvar}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontWeight: 'bold', marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 8, marginTop: 5 },
  button: { backgroundColor: '#2196F3', padding: 15, borderRadius: 5, marginTop: 20, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

export default EditMedicamentoScreen;