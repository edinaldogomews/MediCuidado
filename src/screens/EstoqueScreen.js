import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useThemePreference } from '../contexts/ThemeContext';
import databaseService from '../database/DatabaseService';

const EstoqueScreen = ({ navigation }) => {
  const themeContext = useThemePreference();
  const isDark = themeContext?.isDark ?? false;
  const [estoque, setEstoque] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('Todos'); // Todos, Baixo, Normal
  const [ordenacao, setOrdenacao] = useState('alfabetica'); // alfabetica, estoque, vencimento
  const [modalVisible, setModalVisible] = useState(false);
  const [modalSaidaVisible, setModalSaidaVisible] = useState(false);
  const [selectedMedicamento, setSelectedMedicamento] = useState(null);
  const [quantidadeEntrada, setQuantidadeEntrada] = useState('');
  const [quantidadeSaida, setQuantidadeSaida] = useState('');
  const [motivoSaida, setMotivoSaida] = useState('');

  // Carregar dados do banco ao iniciar
  useEffect(() => {
    carregarEstoque();
  }, []);

  // Recarregar quando a tela ganhar foco
  useFocusEffect(
    React.useCallback(() => {
      carregarEstoque();
    }, [])
  );

  const carregarEstoque = async () => {
    try {
      setIsLoading(true);
      const estoqueData = await databaseService.getAllEstoque();

      // Formata os dados para exibição
      const estoqueFormatado = await Promise.all(estoqueData.map(async (item) => {
        const medicamento = await databaseService.getMedicamentoById(item.medicamento_id);

        // Calcula dias até vencimento
        let diasVencimento = null;
        let statusVencimento = 'normal';
        if (item.vencimento) {
          const hoje = new Date();
          const dataVenc = new Date(item.vencimento);
          const diffTime = dataVenc - hoje;
          diasVencimento = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diasVencimento <= 0) {
            statusVencimento = 'vencido';
          } else if (diasVencimento <= 30) {
            statusVencimento = 'vencendo';
          }
        }

        // Determina status do estoque
        let statusEstoque = 'normal';
        if (item.quantidade === 0) {
          statusEstoque = 'zerado';
        } else if (item.quantidade <= item.minimo) {
          statusEstoque = 'baixo';
        }

        return {
          id: item.id,
          medicamento: medicamento ? `${medicamento.nome} ${medicamento.dosagem}` : 'Medicamento não encontrado',
          medicamento_id: item.medicamento_id,
          quantidade: item.quantidade,
          minimo: item.minimo,
          maximo: item.maximo,
          vencimento: item.vencimento,
          diasVencimento: diasVencimento,
          statusVencimento: statusVencimento,
          status: statusEstoque,
          lote: item.lote
        };
      }));

      setEstoque(estoqueFormatado);

      // Verifica e cria alertas automáticos
      await databaseService.verificarECriarAlertas();
    } catch (error) {
      console.error('Erro ao carregar estoque:', error);
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


  // Filtra e ordena estoque
  const estoqueProcessado = React.useMemo(() => {
    let resultado = [...estoque];

    // Filtro por busca
    if (searchQuery) {
      resultado = resultado.filter(item =>
        item.medicamento.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtro por status
    if (filtroStatus !== 'Todos') {
      if (filtroStatus === 'Baixo') {
        resultado = resultado.filter(item => item.status === 'baixo' || item.status === 'zerado');
      } else if (filtroStatus === 'Normal') {
        resultado = resultado.filter(item => item.status === 'normal');
      }
    }

    // Ordenação
    if (ordenacao === 'alfabetica') {
      resultado.sort((a, b) => a.medicamento.localeCompare(b.medicamento, 'pt-BR'));
    } else if (ordenacao === 'estoque') {
      resultado.sort((a, b) => a.quantidade - b.quantidade);
    } else if (ordenacao === 'vencimento') {
      resultado.sort((a, b) => {
        if (!a.diasVencimento) return 1;
        if (!b.diasVencimento) return -1;
        return a.diasVencimento - b.diasVencimento;
      });
    }

    return resultado;
  }, [estoque, searchQuery, filtroStatus, ordenacao]);

  // Estatísticas
  const stats = React.useMemo(() => {
    const baixo = estoque.filter(item => item.status === 'baixo').length;
    const zerado = estoque.filter(item => item.status === 'zerado').length;
    const vencendo = estoque.filter(item => item.statusVencimento === 'vencendo').length;
    const total = estoque.length;

    return { baixo, zerado, vencendo, total };
  }, [estoque]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'zerado': return '#D32F2F';
      case 'baixo': return '#F44336';
      case 'vencendo': return '#FF9800';
      default: return '#4CAF50';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'zerado': return 'ZERADO';
      case 'baixo': return 'Estoque Baixo';
      case 'vencendo': return 'Vencendo';
      default: return 'Normal';
    }
  };

  const handleAdicionarEntrada = async () => {
    if (!selectedMedicamento) {
      Alert.alert('Erro', 'Selecione um medicamento');
      return;
    }
    if (!quantidadeEntrada || isNaN(quantidadeEntrada) || parseInt(quantidadeEntrada) <= 0) {
      Alert.alert('Erro', 'Digite uma quantidade válida');
      return;
    }

    try {
      const quantidade = parseInt(quantidadeEntrada);

      // Adiciona quantidade no estoque
      await databaseService.adicionarQuantidade(selectedMedicamento.medicamento_id, quantidade);

      // Registra movimentação
      await databaseService.addMovimentacao({
        medicamento_id: selectedMedicamento.medicamento_id,
        tipo: 'entrada',
        quantidade: quantidade,
        data: new Date().toISOString().split('T')[0],
        usuario: 'Usuário',
        motivo: 'Entrada manual'
      });

      Alert.alert('Sucesso', `${quantidadeEntrada} unidades adicionadas a ${selectedMedicamento.medicamento}`);
      setModalVisible(false);
      setSelectedMedicamento(null);
      setQuantidadeEntrada('');

      // Recarrega o estoque
      await carregarEstoque();
    } catch (error) {
      console.error('Erro ao adicionar entrada:', error);
      Alert.alert('Erro', 'Não foi possível adicionar a entrada. Tente novamente.');
    }
  };

  const handleAdicionarSaida = async () => {
    if (!selectedMedicamento) {
      Alert.alert('Erro', 'Selecione um medicamento');
      return;
    }
    if (!quantidadeSaida || isNaN(quantidadeSaida) || parseInt(quantidadeSaida) <= 0) {
      Alert.alert('Erro', 'Digite uma quantidade válida');
      return;
    }

    const quantidade = parseInt(quantidadeSaida);

    if (quantidade > selectedMedicamento.quantidade) {
      Alert.alert('Erro', `Quantidade insuficiente em estoque. Disponível: ${selectedMedicamento.quantidade}`);
      return;
    }

    try {
      // Remove quantidade do estoque
      await databaseService.removerQuantidade(selectedMedicamento.medicamento_id, quantidade);

      // Registra movimentação
      await databaseService.addMovimentacao({
        medicamento_id: selectedMedicamento.medicamento_id,
        tipo: 'saida',
        quantidade: quantidade,
        data: new Date().toISOString().split('T')[0],
        usuario: 'Usuário',
        motivo: motivoSaida || 'Saída manual'
      });

      Alert.alert('Sucesso', `${quantidadeSaida} unidades removidas de ${selectedMedicamento.medicamento}`);
      setModalSaidaVisible(false);
      setSelectedMedicamento(null);
      setQuantidadeSaida('');
      setMotivoSaida('');

      // Recarrega o estoque
      await carregarEstoque();
    } catch (error) {
      console.error('Erro ao adicionar saída:', error);
      Alert.alert('Erro', 'Não foi possível registrar a saída. Tente novamente.');
    }
  };

  const renderItem = ({ item }) => {
    const isZerado = item.status === 'zerado';
    const isBaixo = item.status === 'baixo';
    const isVencendo = item.statusVencimento === 'vencendo';
    const isVencido = item.statusVencimento === 'vencido';

    return (
      <View style={[
        styles.itemCard,
        { backgroundColor: isDark ? '#1e1e1e' : '#fff' },
        isZerado && styles.itemCardZerado,
        isVencido && styles.itemCardVencido
      ]}>
        <View style={styles.itemInfo}>
          <Text style={[
            styles.medicamentoNome,
            { color: isDark ? '#ddd' : '#333' },
            isZerado && styles.textoZerado
          ]}>
            {item.medicamento}
          </Text>

          <Text style={[
            styles.quantidade,
            { color: isDark ? '#bbb' : '#555' },
            isZerado && styles.textoZerado
          ]}>
            📦 {item.quantidade} unidades
            {isZerado && ' ⚠️ ZERADO'}
          </Text>

          {item.vencimento && (
            <Text style={[
              styles.vencimento,
              { color: isDark ? '#bbb' : '#555' },
              isVencendo && styles.textoVencendo,
              isVencido && styles.textoVencido
            ]}>
              📅 {isVencido ? 'VENCIDO' :
                   item.diasVencimento !== null ?
                   `Vence em ${item.diasVencimento} dias` :
                   `Vence em: ${item.vencimento}`}
            </Text>
          )}

          <Text style={[styles.minimo, { color: isDark ? '#888' : '#777' }]}>
            ⚠️ Mínimo: {item.minimo} unidades
          </Text>
        </View>

        <View style={styles.statusContainer}>
          {isZerado && (
            <View style={[styles.statusBadge, { backgroundColor: '#D32F2F', marginBottom: 5 }]}>
              <Text style={styles.statusText}>ZERADO</Text>
            </View>
          )}
          {isBaixo && !isZerado && (
            <View style={[styles.statusBadge, { backgroundColor: '#F44336', marginBottom: 5 }]}>
              <Text style={styles.statusText}>Baixo</Text>
            </View>
          )}
          {isVencendo && (
            <View style={[styles.statusBadge, { backgroundColor: '#FF9800' }]}>
              <Text style={styles.statusText}>Vencendo</Text>
            </View>
          )}
          {isVencido && (
            <View style={[styles.statusBadge, { backgroundColor: '#D32F2F' }]}>
              <Text style={styles.statusText}>Vencido</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Controle de Estoque</Text>
          <View style={styles.addButton} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#9C27B0" />
          <Text style={[styles.loadingText, { color: isDark ? '#fff' : '#333' }]}>
            Carregando estoque...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Controle de Estoque</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalSaidaVisible(true)}
          >
            <Text style={styles.addButtonText}>📤 Saída</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.addButton, { marginLeft: 5 }]}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addButtonText}>📥 Entrada</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Estatísticas */}
      <View style={styles.alertsContainer}>
        <View style={[styles.alertCard, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
          <Text style={[styles.alertNumber, { color: '#D32F2F' }]}>{stats.zerado}</Text>
          <Text style={[styles.alertLabel, { color: isDark ? '#bbb' : '#666' }]}>Zerado</Text>
        </View>
        <View style={[styles.alertCard, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
          <Text style={[styles.alertNumber, { color: '#F44336' }]}>{stats.baixo}</Text>
          <Text style={[styles.alertLabel, { color: isDark ? '#bbb' : '#666' }]}>Baixo</Text>
        </View>
        <View style={[styles.alertCard, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
          <Text style={[styles.alertNumber, { color: '#FF9800' }]}>{stats.vencendo}</Text>
          <Text style={[styles.alertLabel, { color: isDark ? '#bbb' : '#666' }]}>Vencendo</Text>
        </View>
        <View style={[styles.alertCard, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
          <Text style={[styles.alertNumber, { color: '#4CAF50' }]}>{stats.total}</Text>
          <Text style={[styles.alertLabel, { color: isDark ? '#bbb' : '#666' }]}>Total</Text>
        </View>
      </View>

      {/* Busca */}
      <View style={[styles.searchContainer, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
        <TextInput
          style={[styles.searchInput, { color: isDark ? '#fff' : '#333' }]}
          placeholder="🔍 Buscar medicamento..."
          placeholderTextColor={isDark ? '#888' : '#999'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filtros */}
      <View style={[styles.filtroContainer, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtroScroll}
        >
          {['Todos', 'Baixo', 'Normal'].map(status => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filtroButton,
                { backgroundColor: filtroStatus === status ? '#9C27B0' : (isDark ? '#2a2a2a' : '#f0f0f0') }
              ]}
              onPress={() => setFiltroStatus(status)}
            >
              <Text style={[
                styles.filtroButtonText,
                { color: filtroStatus === status ? '#fff' : (isDark ? '#ddd' : '#333') }
              ]}>
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Ordenação */}
      <View style={[styles.ordenacaoContainer, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
        <Text style={[styles.ordenacaoLabel, { color: isDark ? '#bbb' : '#666' }]}>Ordenar por:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.ordenacaoScroll}
        >
          {[
            { key: 'alfabetica', label: 'A-Z' },
            { key: 'estoque', label: 'Estoque' },
            { key: 'vencimento', label: 'Vencimento' }
          ].map(ord => (
            <TouchableOpacity
              key={ord.key}
              style={[
                styles.ordenacaoButton,
                { backgroundColor: ordenacao === ord.key ? '#9C27B0' : (isDark ? '#2a2a2a' : '#f0f0f0') }
              ]}
              onPress={() => setOrdenacao(ord.key)}
            >
              <Text style={[
                styles.ordenacaoButtonText,
                { color: ordenacao === ord.key ? '#fff' : (isDark ? '#ddd' : '#333') }
              ]}>
                {ord.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={estoqueProcessado}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={[styles.emptyText, { color: isDark ? '#888' : '#666' }]}>
              {searchQuery ? 'Nenhum medicamento encontrado' : 'Nenhum medicamento em estoque'}
            </Text>
            {!searchQuery && (
              <Text style={[styles.emptySubtext, { color: isDark ? '#666' : '#999' }]}>
                Adicione medicamentos para começar
              </Text>
            )}
          </View>
        }
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
            <Text style={[styles.modalTitle, { color: isDark ? '#fff' : '#333' }]}>📦 Adicionar Entrada de Estoque</Text>

            {/* Medicamento Selecionado */}
            {selectedMedicamento && (
              <View style={[styles.selectedMedicamentoBox, { backgroundColor: isDark ? '#2a2a2a' : '#e3f2fd' }]}>
                <Text style={[styles.selectedMedicamentoLabel, { color: isDark ? '#aaa' : '#666' }]}>
                  Medicamento selecionado:
                </Text>
                <Text style={[styles.selectedMedicamentoText, { color: isDark ? '#fff' : '#1976d2' }]}>
                  {selectedMedicamento.medicamento}
                </Text>
                <Text style={[styles.selectedMedicamentoSubtext, { color: isDark ? '#888' : '#666' }]}>
                  Estoque atual: {selectedMedicamento.quantidade} unidades
                </Text>
              </View>
            )}

            <Text style={[styles.label, { color: isDark ? '#bbb' : '#333', marginTop: 15 }]}>
              Selecione o medicamento:
            </Text>
            <ScrollView style={styles.medicamentoList}>
              {estoque.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.medicamentoOption,
                    selectedMedicamento?.id === item.id && styles.medicamentoOptionSelected,
                    {
                      backgroundColor: selectedMedicamento?.id === item.id
                        ? (isDark ? '#1976d2' : '#2196F3')
                        : (isDark ? '#2a2a2a' : '#f5f5f5'),
                      borderColor: selectedMedicamento?.id === item.id ? '#1976d2' : 'transparent',
                      borderWidth: 2,
                    }
                  ]}
                  onPress={() => setSelectedMedicamento(item)}
                >
                  <Text style={[
                    styles.medicamentoOptionText,
                    { color: selectedMedicamento?.id === item.id ? '#fff' : (isDark ? '#fff' : '#333') }
                  ]}>
                    {item.medicamento}
                  </Text>
                  <Text style={[
                    styles.medicamentoOptionSubtext,
                    { color: selectedMedicamento?.id === item.id ? '#e3f2fd' : (isDark ? '#aaa' : '#666') }
                  ]}>
                    Estoque atual: {item.quantidade} un.
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={[styles.label, { color: isDark ? '#bbb' : '#333', marginTop: 15 }]}>
              Quantidade a adicionar:
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: isDark ? '#fff' : '#333',
                  borderColor: isDark ? '#444' : '#ddd',
                  backgroundColor: isDark ? '#2a2a2a' : '#fff',
                  fontSize: 18,
                  fontWeight: 'bold',
                }
              ]}
              placeholder="Ex: 30"
              placeholderTextColor={isDark ? '#666' : '#999'}
              keyboardType="numeric"
              value={quantidadeEntrada}
              onChangeText={setQuantidadeEntrada}
            />

            {selectedMedicamento && quantidadeEntrada && !isNaN(quantidadeEntrada) && (
              <View style={[styles.previewBox, { backgroundColor: isDark ? '#1e3a1e' : '#e8f5e9' }]}>
                <Text style={[styles.previewText, { color: isDark ? '#81c784' : '#2e7d32' }]}>
                  ✅ Novo estoque: {selectedMedicamento.quantidade + parseInt(quantidadeEntrada)} unidades
                </Text>
              </View>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setSelectedMedicamento(null);
                  setQuantidadeEntrada('');
                }}
              >
                <Text style={styles.buttonText}>❌ Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={handleAdicionarEntrada}
                disabled={!selectedMedicamento || !quantidadeEntrada}
              >
                <Text style={styles.buttonText}>✅ Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Saída */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalSaidaVisible}
        onRequestClose={() => setModalSaidaVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
            <Text style={[styles.modalTitle, { color: isDark ? '#fff' : '#333' }]}>📤 Registrar Saída de Estoque</Text>

            {/* Medicamento Selecionado */}
            {selectedMedicamento && (
              <View style={[styles.selectedMedicamentoBox, { backgroundColor: isDark ? '#2a2a2a' : '#fff3e0' }]}>
                <Text style={[styles.selectedMedicamentoLabel, { color: isDark ? '#aaa' : '#666' }]}>
                  Medicamento selecionado:
                </Text>
                <Text style={[styles.selectedMedicamentoText, { color: isDark ? '#fff' : '#f57c00' }]}>
                  {selectedMedicamento.medicamento}
                </Text>
                <Text style={[styles.selectedMedicamentoSubtext, { color: isDark ? '#888' : '#666' }]}>
                  Disponível: {selectedMedicamento.quantidade} unidades
                </Text>
              </View>
            )}

            <Text style={[styles.label, { color: isDark ? '#bbb' : '#333', marginTop: 15 }]}>
              Selecione o medicamento:
            </Text>
            <ScrollView style={styles.medicamentoList}>
              {estoque.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.medicamentoOption,
                    selectedMedicamento?.id === item.id && styles.medicamentoOptionSelected,
                    {
                      backgroundColor: selectedMedicamento?.id === item.id
                        ? (isDark ? '#f57c00' : '#FF9800')
                        : (isDark ? '#2a2a2a' : '#f5f5f5'),
                      borderColor: selectedMedicamento?.id === item.id ? '#f57c00' : 'transparent',
                      borderWidth: 2,
                    }
                  ]}
                  onPress={() => setSelectedMedicamento(item)}
                >
                  <Text style={[
                    styles.medicamentoOptionText,
                    { color: selectedMedicamento?.id === item.id ? '#fff' : (isDark ? '#fff' : '#333') }
                  ]}>
                    {item.medicamento}
                  </Text>
                  <Text style={[
                    styles.medicamentoOptionSubtext,
                    { color: selectedMedicamento?.id === item.id ? '#fff3e0' : (isDark ? '#aaa' : '#666') }
                  ]}>
                    Disponível: {item.quantidade} un.
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={[styles.label, { color: isDark ? '#bbb' : '#333', marginTop: 15 }]}>
              Quantidade a remover:
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: isDark ? '#fff' : '#333',
                  borderColor: isDark ? '#444' : '#ddd',
                  backgroundColor: isDark ? '#2a2a2a' : '#fff',
                  fontSize: 18,
                  fontWeight: 'bold',
                }
              ]}
              placeholder="Ex: 5"
              placeholderTextColor={isDark ? '#666' : '#999'}
              keyboardType="numeric"
              value={quantidadeSaida}
              onChangeText={setQuantidadeSaida}
            />

            {selectedMedicamento && quantidadeSaida && !isNaN(quantidadeSaida) && (
              <View style={[
                styles.previewBox,
                {
                  backgroundColor: parseInt(quantidadeSaida) > selectedMedicamento.quantidade
                    ? (isDark ? '#3a1e1e' : '#ffebee')
                    : (isDark ? '#3a2e1e' : '#fff3e0')
                }
              ]}>
                {parseInt(quantidadeSaida) > selectedMedicamento.quantidade ? (
                  <Text style={[styles.previewText, { color: isDark ? '#ef5350' : '#c62828' }]}>
                    ⚠️ Quantidade insuficiente! Disponível: {selectedMedicamento.quantidade}
                  </Text>
                ) : (
                  <Text style={[styles.previewText, { color: isDark ? '#ffb74d' : '#f57c00' }]}>
                    ✅ Novo estoque: {selectedMedicamento.quantidade - parseInt(quantidadeSaida)} unidades
                  </Text>
                )}
              </View>
            )}

            <Text style={[styles.label, { color: isDark ? '#bbb' : '#333', marginTop: 10 }]}>
              Motivo (opcional):
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: isDark ? '#fff' : '#333',
                  borderColor: isDark ? '#444' : '#ddd',
                  backgroundColor: isDark ? '#2a2a2a' : '#fff'
                }
              ]}
              placeholder="Ex: Consumo, Descarte, Vencido..."
              placeholderTextColor={isDark ? '#666' : '#999'}
              value={motivoSaida}
              onChangeText={setMotivoSaida}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setModalSaidaVisible(false);
                  setSelectedMedicamento(null);
                  setQuantidadeSaida('');
                  setMotivoSaida('');
                }}
              >
                <Text style={styles.buttonText}>❌ Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={handleAdicionarSaida}
                disabled={!selectedMedicamento || !quantidadeSaida}
              >
                <Text style={styles.buttonText}>✅ Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#9C27B0',
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
  headerButtons: {
    flexDirection: 'row',
  },
  addButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  alertsContainer: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
  },
  alertCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  alertNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  alertLabel: {
    fontSize: 11,
    color: '#666',
  },
  searchContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
  },
  filtroContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filtroScroll: {
    gap: 10,
  },
  filtroButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  filtroButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  ordenacaoContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
  },
  ordenacaoLabel: {
    fontSize: 14,
    marginRight: 10,
    fontWeight: '600',
  },
  ordenacaoScroll: {
    gap: 8,
  },
  ordenacaoButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
  },
  ordenacaoButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  list: {
    padding: 15,
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  itemCardZerado: {
    borderLeftWidth: 4,
    borderLeftColor: '#D32F2F',
  },
  itemCardVencido: {
    borderLeftWidth: 4,
    borderLeftColor: '#D32F2F',
  },
  itemInfo: {
    flex: 1,
  },
  medicamentoNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  quantidade: {
    fontSize: 14,
    color: '#555',
    marginBottom: 3,
  },
  vencimento: {
    fontSize: 14,
    color: '#555',
    marginBottom: 3,
  },
  minimo: {
    fontSize: 14,
    color: '#777',
  },
  textoZerado: {
    color: '#D32F2F',
    fontWeight: 'bold',
  },
  textoVencendo: {
    color: '#FF9800',
    fontWeight: 'bold',
  },
  textoVencido: {
    color: '#D32F2F',
    fontWeight: 'bold',
  },
  statusContainer: {
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 15,
  },
  medicamentoList: {
    maxHeight: 200,
    marginBottom: 15,
  },
  medicamentoOption: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  medicamentoOptionSelected: {
    borderColor: '#9C27B0',
    backgroundColor: 'rgba(156, 39, 176, 0.1)',
  },
  medicamentoOptionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  medicamentoOptionSubtext: {
    fontSize: 12,
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  confirmButton: {
    backgroundColor: '#9C27B0',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedMedicamentoBox: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  selectedMedicamentoLabel: {
    fontSize: 12,
    marginBottom: 5,
  },
  selectedMedicamentoText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  selectedMedicamentoSubtext: {
    fontSize: 14,
  },
  previewBox: {
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  previewText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default EstoqueScreen;
