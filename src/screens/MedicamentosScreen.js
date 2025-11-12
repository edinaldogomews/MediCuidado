// ========================================
// TELA: MEDICAMENTOS
// ========================================
//
// DESCRIÇÃO:
// Tela principal de gerenciamento de medicamentos do cuidador.
// Permite visualizar, buscar, filtrar, adicionar, editar e excluir medicamentos.
//
// FUNCIONALIDADES:
// - 📋 Lista todos os medicamentos cadastrados
// - 🔍 Busca por nome ou dosagem
// - 🏷️ Filtro por categoria (Todos, Cardiovascular, Diabetes, etc.)
// - ➕ Adicionar novo medicamento
// - ✏️ Editar medicamento existente
// - 🗑️ Excluir medicamento
// - 📊 Exibe informações de estoque (quantidade, alertas)
// - ⏰ Exibe horários de alarmes configurados
// - 🔄 Atualização automática ao focar na tela
// - 🌓 Suporte a tema claro/escuro
//
// NAVEGAÇÃO:
// - Vem de: HomeScreen (menu principal)
// - Vai para: AddMedicamentoScreen (adicionar), EditMedicamentoScreen (editar)
//
// PERMISSÕES:
// - Apenas cuidadores podem acessar esta tela
// - Idosos não têm acesso (usam CuidadoHomeScreen)
// ========================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useThemePreference } from '../contexts/ThemeContext';
import databaseService from '../database/DatabaseService';

const MedicamentosScreen = ({ navigation }) => {
  // ========================================
  // ESTADOS E CONTEXTOS
  // ========================================

  const themeContext = useThemePreference();
  const isDark = themeContext?.isDark ?? false; // Proteção contra undefined

  const [searchQuery, setSearchQuery] = useState('');           // Texto da busca
  const [medicamentos, setMedicamentos] = useState([]);         // Lista de medicamentos
  const [isLoading, setIsLoading] = useState(false);            // Indicador de carregamento
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todos'); // Filtro por categoria

  // ========================================
  // EFEITOS E CARREGAMENTO
  // ========================================

  /**
   * Carrega medicamentos ao montar o componente
   */
  useEffect(() => {
    carregarMedicamentos();
  }, []);

  /**
   * Recarrega medicamentos sempre que a tela recebe foco
   * Útil para atualizar a lista após adicionar/editar medicamentos
   */
  useFocusEffect(
    React.useCallback(() => {
      console.log('🔄 Tela de Medicamentos focada - Recarregando lista...');
      carregarMedicamentos();
    }, [])
  );

  /**
   * Carrega medicamentos do banco de dados
   *
   * PROCESSO:
   * 1. Busca medicamentos completos (com estoque e alarmes)
   * 2. Formata dados para exibição
   * 3. Calcula status de estoque (zerado, baixo, normal)
   * 4. Calcula intervalo entre horários de alarmes
   * 5. Atualiza estado com lista formatada
   */
  const carregarMedicamentos = async () => {
    // Evita múltiplas chamadas simultâneas
    if (isLoading) return;

    try {
      setIsLoading(true);

      // Garante que o banco está inicializado
      await databaseService.ensureInitialized();

      // Busca medicamentos com estoque e alarmes
      const medicamentosData = await databaseService.getMedicamentosCompletos();

      console.log(`📋 Carregados ${medicamentosData.length} medicamentos do banco`);

      // Formata os medicamentos para exibição
      const medicamentosFormatados = medicamentosData.map(med => {
        // Extrai informações de estoque
        const estoque = med.estoque ? med.estoque.quantidade : 0;
        const estoqueMinimo = med.estoque ? med.estoque.minimo : 10;
        const alarmes = med.alarmes || [];
        const horarios = alarmes.map(a => a.horario);

        // Verifica status do estoque
        const estoqueZerado = estoque === 0;                      // Sem estoque
        const estoqueBaixo = estoque > 0 && estoque <= estoqueMinimo; // Estoque baixo

        // Calcula o intervalo entre horários (se houver)
        let intervaloTexto = '';
        if (horarios.length > 1) {
          // Calcula diferença entre primeiro e segundo horário
          const [h1, m1] = horarios[0].split(':').map(Number);
          const [h2, m2] = horarios[1].split(':').map(Number);
          const diffMinutos = (h2 * 60 + m2) - (h1 * 60 + m1);
          const diffHoras = diffMinutos / 60;

          intervaloTexto = `${horarios.length}x ao dia (a cada ${diffHoras}h)`;
        } else if (horarios.length === 1) {
          intervaloTexto = `1x ao dia (${horarios[0]})`;
        }

        // Retorna medicamento formatado
        return {
          id: med.id,
          nome: med.nome,
          tipo: med.categoria || 'Medicamento',
          dosagem: med.dosagem,
          estoque: estoque,
          estoqueMinimo: estoqueMinimo,
          estoqueZerado: estoqueZerado,
          estoqueBaixo: estoqueBaixo,
          proximaData: alarmes.length > 0 ? new Date().toISOString().split('T')[0] : '-',
          horarios: horarios.length > 0 ? horarios : [],
          intervaloTexto: intervaloTexto
        };
      });

      setMedicamentos(medicamentosFormatados);
      console.log(`✅ Lista atualizada com ${medicamentosFormatados.length} medicamentos`);
    } catch (error) {
      console.error('Erro ao carregar medicamentos:', error);
      Alert.alert(
        'Erro',
        'Não foi possível carregar os medicamentos. Tente novamente.',
        [{ text: 'OK' }]
      );
      setMedicamentos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (navigation && typeof navigation.canGoBack === 'function' && navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    const state = typeof navigation.getState === 'function' ? navigation.getState() : undefined;
    const routeNames = state && Array.isArray(state.routeNames) ? state.routeNames : [];

    if (routeNames.includes('Main')) {
      navigation.navigate('Main');
      return;
    }
    if (routeNames.includes('CuidadoHome')) {
      navigation.navigate('CuidadoHome');
      return;
    }
    if (routeNames.includes('SelectUserType')) {
      navigation.navigate('SelectUserType');
      return;
    }
  };

  const handleExcluirMedicamento = async (medicamento) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja realmente excluir ${medicamento.nome}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await databaseService.deleteMedicamento(medicamento.id);
              Alert.alert('Sucesso', 'Medicamento excluído com sucesso!');
              await carregarMedicamentos(); // Recarrega a lista
            } catch (error) {
              console.error('Erro ao excluir medicamento:', error);
              Alert.alert('Erro', 'Não foi possível excluir o medicamento');
            }
          }
        }
      ]
    );
  };

  // Lista de categorias únicas (normalizadas e ordenadas)
  const categorias = React.useMemo(() => {
    if (!Array.isArray(medicamentos)) return ['Todos'];

    // Função para normalizar: primeira letra maiúscula, resto minúsculo
    const normalizar = (texto) => {
      if (!texto) return '';
      return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
    };

    // Pega todas as categorias, normaliza e remove duplicatas
    const cats = medicamentos
      .map(m => normalizar(m.tipo))
      .filter(Boolean);

    const uniqueCats = [...new Set(cats)];

    // Ordena alfabeticamente
    uniqueCats.sort((a, b) => a.localeCompare(b, 'pt-BR'));

    return ['Todos', ...uniqueCats];
  }, [medicamentos]);

  const filteredMedicamentos = React.useMemo(() => {
    if (!Array.isArray(medicamentos)) return [];

    // Função para normalizar: primeira letra maiúscula, resto minúsculo
    const normalizar = (texto) => {
      if (!texto) return '';
      return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
    };

    return medicamentos.filter(med => {
      if (!med || !med.nome) return false;

      // Filtro por busca
      const matchBusca = med.nome.toLowerCase().includes(searchQuery.toLowerCase());

      // Filtro por categoria (normalizado)
      const categoriaNormalizada = normalizar(med.tipo);
      const matchCategoria = categoriaFiltro === 'Todos' || categoriaNormalizada === categoriaFiltro;

      return matchBusca && matchCategoria;
    });
  }, [medicamentos, searchQuery, categoriaFiltro]);

  const renderMedicamento = ({ item }) => {
    if (!item) return null;

    // Define cor e texto do estoque
    let estoqueColor = isDark ? '#bbb' : '#555';
    let estoqueTexto = `📦 Estoque: ${item.estoque} unidades`;
    let estoqueIcon = '';

    if (item.estoqueZerado) {
      estoqueColor = '#D32F2F'; // Vermelho mais escuro
      estoqueTexto = `📦 Estoque: ${item.estoque} unidades`;
      estoqueIcon = '❌ SEM ESTOQUE!';
    } else if (item.estoqueBaixo) {
      estoqueColor = '#F44336'; // Vermelho normal
      estoqueTexto = `📦 Estoque: ${item.estoque} unidades`;
      estoqueIcon = '⚠️ BAIXO!';
    }

    return (
    <View style={[
      styles.medicamentoCard,
      { backgroundColor: isDark ? '#1e1e1e' : '#fff' },
      item.estoqueZerado && styles.medicamentoCardSemEstoque,
      item.estoqueBaixo && styles.medicamentoCardAlerta
    ]}>
      <View style={styles.medicamentoHeader}>
        <View style={styles.medicamentoNomeContainer}>
          <Text style={[styles.medicamentoNome, { color: isDark ? '#ddd' : '#333' }]}>
            {item.nome} {item.dosagem}
          </Text>
          {item.estoqueZerado && (
            <Text style={styles.alertaIconCritico}>❌</Text>
          )}
          {item.estoqueBaixo && !item.estoqueZerado && (
            <Text style={styles.alertaIcon}>⚠️</Text>
          )}
        </View>
        <Text style={[styles.medicamentoTipo, { color: isDark ? '#bbb' : '#666' }]}>{item.tipo}</Text>
      </View>

      <View style={styles.medicamentoDetails}>
        <Text style={[
          styles.detailText,
          { color: estoqueColor },
          (item.estoqueBaixo || item.estoqueZerado) && styles.detailTextBold
        ]}>
          {estoqueTexto} {estoqueIcon}
        </Text>
        {item.intervaloTexto ? (
          <Text style={[styles.detailText, { color: isDark ? '#bbb' : '#555' }]}>
            ⏰ {item.intervaloTexto}
          </Text>
        ) : (
          <Text style={[styles.detailText, { color: isDark ? '#888' : '#999', fontStyle: 'italic' }]}>
            ⏰ Sem horários configurados
          </Text>
        )}
      </View>

      <View style={styles.medicamentoActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditMedicamento', { medicamento: item })}
        >
          <Text style={styles.editButtonText}>✏️ Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleExcluirMedicamento(item)}
        >
          <Text style={styles.deleteButtonText}>🗑️ Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Medicamentos</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddMedicamento')}
        >
          <Text style={styles.addButtonText}>+ Adicionar</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5', color: isDark ? '#ddd' : '#000' }]}
          placeholder="Buscar medicamento..."
          placeholderTextColor={isDark ? '#888' : undefined}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* Contador de medicamentos */}
        <Text style={[styles.contador, { color: isDark ? '#888' : '#666' }]}>
          📊 {medicamentos.length} {medicamentos.length === 1 ? 'medicamento cadastrado' : 'medicamentos cadastrados'}
        </Text>
      </View>

      {/* Filtro por categoria */}
      {categorias.length > 1 && (
        <View style={[styles.filtroContainer, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtroScroll}
          >
            {categorias.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.filtroButton,
                  categoriaFiltro === cat && styles.filtroButtonActive,
                  { backgroundColor: categoriaFiltro === cat ? '#4CAF50' : (isDark ? '#2a2a2a' : '#f0f0f0') }
                ]}
                onPress={() => setCategoriaFiltro(cat)}
              >
                <Text style={[
                  styles.filtroButtonText,
                  { color: categoriaFiltro === cat ? '#fff' : (isDark ? '#ddd' : '#333') }
                ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Indicador de carregamento */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={[styles.loadingText, { color: isDark ? '#888' : '#666' }]}>
            Carregando medicamentos...
          </Text>
        </View>
      ) : filteredMedicamentos.length === 0 ? (
        // Mensagem quando não há resultados
        <View style={styles.emptyContainer}>
          {medicamentos.length === 0 ? (
            // Lista vazia
            <>
              <Text style={styles.emptyIcon}>📦</Text>
              <Text style={[styles.emptyTitle, { color: isDark ? '#ddd' : '#333' }]}>
                Nenhum medicamento cadastrado
              </Text>
              <Text style={[styles.emptySubtitle, { color: isDark ? '#888' : '#666' }]}>
                Clique em "+ Adicionar" para cadastrar{'\n'}seu primeiro medicamento
              </Text>
            </>
          ) : (
            // Busca sem resultados
            <>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={[styles.emptyTitle, { color: isDark ? '#ddd' : '#333' }]}>
                Nenhum medicamento encontrado
              </Text>
              <Text style={[styles.emptySubtitle, { color: isDark ? '#888' : '#666' }]}>
                Tente buscar por outro nome ou{'\n'}altere o filtro de categoria
              </Text>
            </>
          )}
        </View>
      ) : (
        // Lista de medicamentos
        <FlatList
          data={filteredMedicamentos}
          keyExtractor={item => item.id.toString()}
          renderItem={renderMedicamento}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 20,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 5,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  searchContainer: {
    padding: 15,
    backgroundColor: '#fff',
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 10,
  },
  contador: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
  filtroContainer: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filtroScroll: {
    paddingHorizontal: 15,
  },
  filtroButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  filtroButtonActive: {
    backgroundColor: '#4CAF50',
  },
  filtroButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  list: {
    padding: 15,
  },
  medicamentoCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  medicamentoCardAlerta: {
    borderWidth: 2,
    borderColor: '#F44336',
    backgroundColor: '#FFEBEE',
  },
  medicamentoCardSemEstoque: {
    borderWidth: 3,
    borderColor: '#D32F2F',
    backgroundColor: '#FFCDD2',
  },
  medicamentoHeader: {
    marginBottom: 10,
  },
  medicamentoNomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  medicamentoNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  alertaIcon: {
    fontSize: 20,
    marginLeft: 8,
  },
  alertaIconCritico: {
    fontSize: 20,
    marginLeft: 8,
  },
  medicamentoTipo: {
    fontSize: 14,
    color: '#666',
  },
  medicamentoDetails: {
    marginBottom: 15,
  },
  detailText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 3,
  },
  detailTextBold: {
    fontWeight: 'bold',
  },
  medicamentoActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    flex: 0.45,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
    flex: 0.45,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default MedicamentosScreen;
