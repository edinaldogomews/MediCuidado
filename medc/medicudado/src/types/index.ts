export interface Medicamento {
  id: string;
  nome: string;
  dosagem: string;
  horarios: string[];
  instrucoes: string;
  duracao: {
    inicio: string;
    fim?: string;
  };
  frequencia: {
    tipo: 'diaria' | 'semanal' | 'especifica';
    dias?: number[]; // dias da semana (0-6) para frequência semanal
    intervalo?: number; // intervalo em horas para frequência específica
  };
  estoque?: {
    quantidade: number;
    unidade: string;
  };
}

export interface Alarme {
  id: string;
  medicamentoId: string;
  horario: string;
  status: 'pendente' | 'tomado' | 'ignorado';
  data: string;
}
