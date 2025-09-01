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

// ...existing code...
