export interface Perfil {
  id: string;
  tipo: 'idoso' | 'cuidador';
  nome: string;
  dataNascimento?: string;
  telefone?: string;
  endereco?: string;
  foto?: string;
}

export interface PerfilIdoso extends Perfil {
  tipo: 'idoso';
  condicoesMedicas?: string[];
  alergias?: string[];
  cuidadorId?: string;
}

export interface PerfilCuidador extends Perfil {
  tipo: 'cuidador';
  relacao: string; // filho, cônjuge, etc
  idososVinculados: string[]; // IDs dos idosos
}

export interface Medicamento {
  id: string;
  nome: string;
  dosagem: string;
  horario: string;
  instrucoes?: string;
  estoque: {
    quantidade: number;
    unidade: string;
    alertaQuandoAbaixoDe?: number;
  };
  fabricante?: string;
  status: 'ativo' | 'inativo';
  dataCriacao: string;
  dataAtualizacao: string;
}

export interface Alarme {
  id: string;
  medicamentoId: string;
  horario: string;
  status: 'pendente' | 'tomado' | 'perdido';
  dataCriacao: string;
  dataAtualizacao: string;
}
