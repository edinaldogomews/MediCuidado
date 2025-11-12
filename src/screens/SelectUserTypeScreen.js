/**
 * ========================================
 * SELECT USER TYPE SCREEN - TELA DE SELEÇÃO DE TIPO DE USUÁRIO
 * ========================================
 *
 * Esta é a primeira tela que o usuário vê ao abrir o app.
 * Permite escolher entre dois tipos de usuário:
 *
 * TIPOS DE USUÁRIO:
 * 1. CUIDADOR (👨‍⚕️):
 *    - Acesso completo ao app
 *    - Pode adicionar, editar e excluir medicamentos
 *    - Pode gerenciar alarmes e estoque
 *    - Interface mais completa com todas as funcionalidades
 *
 * 2. IDOSO (👴):
 *    - Acesso simplificado
 *    - Pode visualizar medicamentos e alarmes
 *    - Pode marcar medicamentos como tomados
 *    - Interface simplificada e com fontes maiores
 *
 * FLUXO:
 * 1. Usuário abre o app
 * 2. Vê esta tela de seleção
 * 3. Escolhe o tipo de usuário
 * 4. É redirecionado para a tela inicial correspondente
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Para respeitar áreas seguras (notch, etc.)
import { useAuth } from '../contexts/AuthContext'; // Hook para gerenciar autenticação

/**
 * COMPONENTE PRINCIPAL - SelectUserTypeScreen
 *
 * Tela de seleção de tipo de usuário.
 *
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.navigation - Objeto de navegação do React Navigation
 */
const SelectUserTypeScreen = ({ navigation }) => {
  // Obtém a função para definir o tipo de usuário do contexto de autenticação
  const { setUserType } = useAuth();

  /**
   * Função chamada quando o usuário seleciona um tipo
   *
   * @param {string} type - Tipo selecionado ('cuidador' ou 'idoso')
   *
   * FLUXO:
   * 1. Recebe o tipo selecionado
   * 2. Chama setUserType para salvar no contexto
   * 3. O RootNavigator detecta a mudança e redireciona automaticamente
   */
  const handleUserTypeSelection = async (type) => {
    try {
      // Define o tipo de usuário no contexto
      await setUserType(type);

      // Não precisa navegar manualmente, o RootNavigator faz isso automaticamente
      // quando detecta que userType mudou de null para 'cuidador' ou 'idoso'
    } catch (error) {
      console.error('Erro ao selecionar tipo de usuário:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Título principal */}
        <Text style={styles.title}>Bem-vindo ao MediCuidado</Text>

        {/* Subtítulo */}
        <Text style={styles.subtitle}>Como você vai usar o aplicativo?</Text>

        {/* Container com as opções de tipo de usuário */}
        <View style={styles.optionsContainer}>

          {/* OPÇÃO 1: CUIDADOR */}
          <TouchableOpacity
            style={[styles.option, styles.cuidadorOption]}
            onPress={() => handleUserTypeSelection('cuidador')}
          >
            {/* Ícone do cuidador */}
            <Text style={styles.optionIcon}>👨‍⚕️</Text>

            {/* Título da opção */}
            <Text style={styles.optionTitle}>Sou Cuidador</Text>

            {/* Descrição da opção */}
            <Text style={styles.optionDescription}>
              Gerenciar medicamentos e cuidar de alguém
            </Text>
          </TouchableOpacity>

          {/* OPÇÃO 2: IDOSO */}
          <TouchableOpacity
            style={[styles.option, styles.idosoOption]}
            onPress={() => handleUserTypeSelection('idoso')}
          >
            {/* Ícone do idoso */}
            <Text style={styles.optionIcon}>👴</Text>

            {/* Título da opção */}
            <Text style={styles.optionTitle}>Sou Idoso</Text>

            {/* Descrição da opção */}
            <Text style={styles.optionDescription}>
              Visualizar meus medicamentos de forma simples
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  optionsContainer: {
    width: '100%',
    maxWidth: 400,
  },
  option: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 2,
  },
  cuidadorOption: {
    borderColor: '#4CAF50',
  },
  idosoOption: {
    borderColor: '#2196F3',
  },
  optionIcon: {
    fontSize: 50,
    marginBottom: 15,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default SelectUserTypeScreen;
