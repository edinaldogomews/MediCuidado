interface Medicamento {
  nome: string;
  fabricantes: string[];
  formas: string[];
  categoria: string;
  restricoes?: string[];
  interacoes?: string[];
  horariosRecomendados?: string[];
  efeitosColateraisComuns?: string[];
  observacoes?: string;
}

export const medicamentosPopulares: Medicamento[] = [
  // Analgésicos e Anti-inflamatórios
  {
    nome: "Dipirona",
    fabricantes: ["EMS", "Neo Química", "Medley"],
    formas: ["Comprimido 500mg", "Comprimido 1g", "Solução oral 500mg/mL", "Solução injetável 500mg/mL"],
    categoria: "Analgésicos e Anti-inflamatórios",
    restricoes: ["Alergia à dipirona", "Problemas hepáticos graves"],
    interacoes: ["Álcool", "Anticoagulantes"],
    horariosRecomendados: ["6/6 horas", "8/8 horas conforme prescrição"],
    efeitosColateraisComuns: ["Reações alérgicas", "Queda de pressão", "Tontura"],
    observacoes: "Tomar com água. Em caso de febre alta, procure atendimento médico."
  },
  {
    nome: "Paracetamol",
    fabricantes: ["EMS", "Neo Química", "Medley"],
    formas: ["Comprimido 500mg", "Comprimido 750mg", "Solução oral 200mg/mL"],
    categoria: "Analgésicos e Anti-inflamatórios",
    restricoes: ["Doença hepática", "Consumo regular de álcool"],
    interacoes: ["Álcool", "Varfarina"],
    horariosRecomendados: ["4/4 horas", "6/6 horas", "Máximo 4g/dia"],
    efeitosColateraisComuns: ["Náusea", "Dor abdominal"],
    observacoes: "Não exceder a dose máxima diária. Evitar uso prolongado."
  },
  {
    nome: "Ibuprofeno",
    fabricantes: ["Medley", "Prati-Donaduzzi", "EMS"],
    formas: ["Comprimido 400mg", "Comprimido 600mg", "Suspensão oral 50mg/mL"],
    categoria: "Analgésicos e Anti-inflamatórios",
    restricoes: ["Úlcera péptica ativa", "Insuficiência renal grave"],
    interacoes: ["Anticoagulantes", "Anti-hipertensivos"],
    horariosRecomendados: ["8/8 horas", "12/12 horas conforme prescrição"],
    efeitosColateraisComuns: ["Dor de estômago", "Náusea", "Tontura"],
    observacoes: "Tomar com alimentos para reduzir irritação gástrica."
  },

  // Anti-hipertensivos
  {
    nome: "Losartana Potássica",
    fabricantes: ["EMS", "Medley", "Neo Química"],
    formas: ["Comprimido 50mg", "Comprimido 100mg"],
    categoria: "Anti-hipertensivos",
    restricoes: ["Gravidez", "Insuficiência renal grave"],
    interacoes: ["Anti-inflamatórios", "Suplementos de potássio"],
    horariosRecomendados: ["Manhã", "12/12 horas conforme prescrição"],
    efeitosColateraisComuns: ["Tontura", "Hipotensão", "Tosse seca"],
    observacoes: "Tomar preferencialmente no mesmo horário todos os dias."
  },
  {
    nome: "Enalapril",
    fabricantes: ["EMS", "Medley", "Neo Química"],
    formas: ["Comprimido 5mg", "Comprimido 10mg", "Comprimido 20mg"],
    categoria: "Anti-hipertensivos",
    restricoes: ["Gravidez", "História de angioedema"],
    interacoes: ["Diuréticos", "Suplementos de potássio"],
    horariosRecomendados: ["Manhã", "12/12 horas conforme prescrição"],
    efeitosColateraisComuns: ["Tontura", "Cansaço", "Dor de cabeça"],
    observacoes: "Monitorar a pressão arterial regularmente."
  },
  {
    nome: "Atenolol",
    fabricantes: ["EMS", "Medley", "Neo Química"],
    formas: ["Comprimido 25mg", "Comprimido 50mg", "Comprimido 100mg"],
    categoria: "Anti-hipertensivos",
    restricoes: ["Asma brônquica", "Bradicarida"],
    interacoes: ["Antidepressivos", "Anti-inflamatórios"],
    horariosRecomendados: ["Manhã", "Com ou sem alimentos"],
    efeitosColateraisComuns: ["Fadiga", "Tontura", "Depressão"],
    observacoes: "Não interromper o uso abruptamente."
  },
  {
    nome: "Anlodipino",
    fabricantes: ["EMS", "Medley", "Biosintética"],
    formas: ["Comprimido 5mg", "Comprimido 10mg"],
    categoria: "Anti-hipertensivos",
    restricoes: ["Hipotensão", "Estreitamento da válvula aórtica"],
    interacoes: ["Anticoagulantes", "Inibidores da PDE5"],
    horariosRecomendados: ["Manhã", "12/12 horas conforme prescrição"],
    efeitosColateraisComuns: ["Edema", "Dor de cabeça", "Tontura"],
    observacoes: "Pode ser tomado com ou sem alimentos."
  },

  // Antidiabéticos
  {
    nome: "Metformina",
    fabricantes: ["Merck", "Medley", "EMS"],
    formas: ["Comprimido 500mg", "Comprimido 850mg", "Comprimido 1g"],
    categoria: "Antidiabéticos",
    restricoes: ["Insuficiência renal", "Acidose metabólica"],
    interacoes: ["Álcool", "Contraste radiológico"],
    horariosRecomendados: ["Durante ou após as refeições"],
    efeitosColateraisComuns: ["Diarreia", "Náusea", "Gosto metálico"],
    observacoes: "Tomar com alimentos para reduzir efeitos gastrointestinais."
  },
  {
    nome: "Glibenclamida",
    fabricantes: ["Medley", "EMS"],
    formas: ["Comprimido 5mg"],
    categoria: "Antidiabéticos",
    restricoes: ["Cetoacidose diabética", "Alergia a sulfonamidas"],
    interacoes: ["Anticoagulantes", "Beta-bloqueadores"],
    horariosRecomendados: ["Café da manhã", "Jantar"],
    efeitosColateraisComuns: ["Hipoglicemia", "Ganho de peso"],
    observacoes: "Monitorar a glicemia regularmente."
  },
  {
    nome: "Gliclazida",
    fabricantes: ["Servier", "EMS"],
    formas: ["Comprimido 30mg MR", "Comprimido 60mg MR"],
    categoria: "Antidiabéticos",
    restricoes: ["Diabetes tipo 1", "Cetoacidose diabética"],
    interacoes: ["Anticoagulantes", "Beta-bloqueadores"],
    horariosRecomendados: ["Café da manhã", "Jantar"],
    efeitosColateraisComuns: ["Hipoglicemia", "Ganho de peso"],
    observacoes: "Tomar com alimentos para melhor absorção."
  },

  // Antiulcerosos
  {
    nome: "Omeprazol",
    fabricantes: ["Medley", "EMS", "Neo Química"],
    formas: ["Cápsula 20mg", "Cápsula 40mg"],
    categoria: "Antiulcerosos",
    restricoes: ["Alergia a omeprazol", "Gravidez"],
    interacoes: ["Anticoagulantes", "Digoxina"],
    horariosRecomendados: ["Antes do café da manhã", "Com água"],
    efeitosColateraisComuns: ["Dor de cabeça", "Náusea", "Diarréia"],
    observacoes: "Não mastigar ou partir as cápsulas."
  },
  {
    nome: "Pantoprazol",
    fabricantes: ["Medley", "EMS", "Neo Química"],
    formas: ["Comprimido 20mg", "Comprimido 40mg"],
    categoria: "Antiulcerosos",
    restricoes: ["Alergia a pantoprazol", "Gravidez"],
    interacoes: ["Anticoagulantes", "Digoxina"],
    horariosRecomendados: ["Antes do café da manhã", "Com água"],
    efeitosColateraisComuns: ["Dor de cabeça", "Náusea", "Diarréia"],
    observacoes: "Não mastigar ou partir os comprimidos."
  },

  // Antilipêmicos
  {
    nome: "Sinvastatina",
    fabricantes: ["EMS", "Medley", "Neo Química"],
    formas: ["Comprimido 10mg", "Comprimido 20mg", "Comprimido 40mg"],
    categoria: "Antilipêmicos",
    restricoes: ["Gravidez", "Doença hepática ativa"],
    interacoes: ["Anticoagulantes", "Fibratos"],
    horariosRecomendados: ["À noite", "Comprimido inteiro"],
    efeitosColateraisComuns: ["Dor de cabeça", "Tontura", "Gastrointestinais"],
    observacoes: "Monitorar função hepática durante o tratamento."
  },
  {
    nome: "Atorvastatina",
    fabricantes: ["Pfizer", "EMS", "Medley"],
    formas: ["Comprimido 10mg", "Comprimido 20mg", "Comprimido 40mg", "Comprimido 80mg"],
    categoria: "Antilipêmicos",
    restricoes: ["Gravidez", "Doença hepática ativa"],
    interacoes: ["Anticoagulantes", "Fibratos"],
    horariosRecomendados: ["À noite", "Comprimido inteiro"],
    efeitosColateraisComuns: ["Dor de cabeça", "Tontura", "Gastrointestinais"],
    observacoes: "Monitorar função hepática durante o tratamento."
  },

  // Antidepressivos
  {
    nome: "Fluoxetina",
    fabricantes: ["EMS", "Medley", "Neo Química"],
    formas: ["Cápsula 20mg"],
    categoria: "Antidepressivos",
    restricoes: ["Uso de IMAO nos últimos 14 dias", "Gravidez/amamentação"],
    interacoes: ["Outros antidepressivos", "Tramadol", "Aspirina"],
    horariosRecomendados: ["Manhã", "Com ou sem alimentos"],
    efeitosColateraisComuns: ["Náusea", "Insônia", "Disfunção sexual"],
    observacoes: "Não interromper abruptamente. Efeitos podem demorar 2-4 semanas."
  },
  {
    nome: "Sertralina",
    fabricantes: ["EMS", "Medley", "Neo Química"],
    formas: ["Comprimido 50mg", "Comprimido 100mg"],
    categoria: "Antidepressivos",
    restricoes: ["Uso de IMAO nos últimos 14 dias", "Gravidez/amamentação"],
    interacoes: ["Outros antidepressivos", "Tramadol", "Aspirina"],
    horariosRecomendados: ["Manhã", "Com ou sem alimentos"],
    efeitosColateraisComuns: ["Náusea", "Insônia", "Disfunção sexual"],
    observacoes: "Não interromper abruptamente. Efeitos podem demorar 2-4 semanas."
  },
  {
    nome: "Escitalopram",
    fabricantes: ["Lundbeck", "EMS", "Medley"],
    formas: ["Comprimido 10mg", "Comprimido 20mg"],
    categoria: "Antidepressivos",
    restricoes: ["Uso de IMAO nos últimos 14 dias", "Gravidez/amamentação"],
    interacoes: ["Outros antidepressivos", "Tramadol", "Aspirina"],
    horariosRecomendados: ["Manhã", "Com ou sem alimentos"],
    efeitosColateraisComuns: ["Náusea", "Insônia", "Disfunção sexual"],
    observacoes: "Não interromper abruptamente. Efeitos podem demorar 2-4 semanas."
  },

  // Anticonvulsivantes
  {
    nome: "Carbamazepina",
    fabricantes: ["EMS", "Medley", "Teuto"],
    formas: ["Comprimido 200mg", "Comprimido 400mg"],
    categoria: "Anticonvulsivantes",
    restricoes: ["Bloqueio atrioventricular", "História de depressão medular"],
    interacoes: ["Anticoagulantes", "Contraceptivos orais"],
    horariosRecomendados: ["Com alimentos", "Horário fixo"],
    efeitosColateraisComuns: ["Sonolência", "Tontura", "Náusea"],
    observacoes: "Evitar álcool. Monitorar sinais de depressão."
  },
  {
    nome: "Clonazepam",
    fabricantes: ["Roche", "EMS", "Medley"],
    formas: ["Comprimido 0,5mg", "Comprimido 2mg", "Solução oral 2,5mg/mL"],
    categoria: "Anticonvulsivantes",
    restricoes: ["Glaucoma de ângulo fechado", "Depressão respiratória"],
    interacoes: ["Álcool", "Antidepressivos"],
    horariosRecomendados: ["Ao deitar", "Com ou sem alimentos"],
    efeitosColateraisComuns: ["Sonolência", "Tontura", "Fadiga"],
    observacoes: "Evitar atividades que exijam atenção até saber como o medicamento afeta você."
  },

  // Antialérgicos
  {
    nome: "Loratadina",
    fabricantes: ["EMS", "Medley", "Neo Química"],
    formas: ["Comprimido 10mg", "Xarope 1mg/mL"],
    categoria: "Antialérgicos",
    restricoes: ["Alergia conhecida ao medicamento"],
    interacoes: ["Álcool", "Inibidores da MAO"],
    horariosRecomendados: ["Uma vez ao dia", "Preferencialmente à noite"],
    efeitosColateraisComuns: ["Sonolência", "Secura na boca", "Tontura"],
    observacoes: "Pode causar sonolência. Evitar dirigir ou operar máquinas pesadas."
  },
  {
    nome: "Desloratadina",
    fabricantes: ["Mantecorp", "EMS", "Medley"],
    formas: ["Comprimido 5mg", "Solução oral 0,5mg/mL"],
    categoria: "Antialérgicos",
    restricoes: ["Alergia conhecida ao medicamento"],
    interacoes: ["Álcool", "Inibidores da MAO"],
    horariosRecomendados: ["Uma vez ao dia", "Preferencialmente à noite"],
    efeitosColateraisComuns: ["Sonolência", "Secura na boca", "Tontura"],
    observacoes: "Pode causar sonolência. Evitar dirigir ou operar máquinas pesadas."
  },

  // Hormônios
  {
    nome: "Levotiroxina Sódica",
    fabricantes: ["Merck", "Abbott", "Sanofi"],
    formas: ["Comprimido 25mcg", "Comprimido 50mcg", "Comprimido 75mcg", "Comprimido 100mcg", "Comprimido 125mcg", "Comprimido 150mcg"],
    categoria: "Hormônios",
    restricoes: ["Alergia ao princípio ativo", "Tireotoxicose"],
    interacoes: ["Anticoagulantes", "Antidepressivos tricíclicos"],
    horariosRecomendados: ["Em jejum", "30 minutos antes do café"],
    efeitosColateraisComuns: ["Palpitações", "Insônia", "Nervosismo"],
    observacoes: "Monitorar função tireoidiana regularmente."
  },
  {
    nome: "Prednisona",
    fabricantes: ["EMS", "Medley", "Neo Química"],
    formas: ["Comprimido 5mg", "Comprimido 20mg"],
    categoria: "Hormônios",
    restricoes: ["Infecções fúngicas sistêmicas", "Alergia ao princípio ativo"],
    interacoes: ["Anticoagulantes", "Antidiabéticos"],
    horariosRecomendados: ["Manhã", "Com alimentos"],
    efeitosColateraisComuns: ["Retenção de líquidos", "Aumento da pressão arterial", "Alterações de humor"],
    observacoes: "Não interromper o uso abruptamente. Pode causar supressão adrenal."
  },

  // Anticoagulantes
  {
    nome: "AAS",
    fabricantes: ["EMS", "Neo Química"],
    formas: ["Comprimido 100mg", "Comprimido 500mg"],
    categoria: "Anticoagulantes",
    restricoes: ["Úlcera péptica ativa", "Hemorragia gastrointestinal"],
    interacoes: ["Anticoagulantes orais", "Metotrexato"],
    horariosRecomendados: ["Comprimido inteiro", "Com água"],
    efeitosColateraisComuns: ["Sangramento", "Dor abdominal", "Náusea"],
    observacoes: "Evitar uso em conjunto com outros anti-inflamatórios não esteroides."
  },
  {
    nome: "Varfarina",
    fabricantes: ["Farmoquímica"],
    formas: ["Comprimido 2,5mg", "Comprimido 5mg"],
    categoria: "Anticoagulantes",
    restricoes: ["Sangramento ativo", "Cirurgias recentes"],
    interacoes: [
      "Aspirina",
      "Anti-inflamatórios",
      "Alimentos ricos em vitamina K",
      "Álcool"
    ],
    horariosRecomendados: ["Mesmo horário todos os dias", "Preferência à tarde"],
    efeitosColateraisComuns: ["Sangramento", "Hematomas", "Náusea"],
    observacoes: "Monitoramento regular do INR necessário. Dieta consistente importante."
  },

  // Vitaminas e Suplementos
  {
    nome: "Vitamina D3",
    fabricantes: ["Mantecorp", "EMS", "Neo Química"],
    formas: ["Comprimido 1.000 UI", "Comprimido 7.000 UI", "Comprimido 50.000 UI"],
    categoria: "Vitaminas e Suplementos",
    restricoes: ["Hipervitaminose D", "Doenças renais graves"],
    interacoes: ["Digoxina", "Benzodiazepínicos"],
    horariosRecomendados: ["Após as refeições", "Com água"],
    efeitosColateraisComuns: ["Náusea", "Vômito", "Constipação"],
    observacoes: "Monitorar níveis de vitamina D e cálcio."
  },
  {
    nome: "Complexo B",
    fabricantes: ["EMS", "Medley", "Neo Química"],
    formas: ["Comprimido", "Solução oral"],
    categoria: "Vitaminas e Suplementos",
    restricoes: ["Alergia a qualquer componente"],
    interacoes: ["Anticoagulantes", "Antibióticos"],
    horariosRecomendados: ["Após as refeições", "Com água"],
    efeitosColateraisComuns: ["Náusea", "Dor abdominal", "Diarréia"],
    observacoes: "Manter em local fresco e seco. Evitar exposição à luz."
  },

  // Anti-vertiginosos
  {
    nome: "Betaistina",
    fabricantes: ["EMS", "Medley", "Apsen"],
    formas: ["Comprimido 16mg", "Comprimido 24mg"],
    categoria: "Anti-vertiginosos",
    restricoes: ["Feocromocitoma", "Gravidez"],
    interacoes: ["Antidepressivos", "Antipsicóticos"],
    horariosRecomendados: ["Com alimentos", "Horário fixo"],
    efeitosColateraisComuns: ["Náusea", "Dor de cabeça", "Tontura"],
    observacoes: "Evitar álcool. Monitorar pressão arterial."
  },
  {
    nome: "Meclizina",
    fabricantes: ["Apsen"],
    formas: ["Comprimido 12,5mg", "Comprimido 25mg"],
    categoria: "Anti-vertiginosos",
    restricoes: ["Glaucoma", "Obstrução do trato urinário"],
    interacoes: ["Antidepressivos", "Antipsicóticos"],
    horariosRecomendados: ["Com alimentos", "Horário fixo"],
    efeitosColateraisComuns: ["Sonolência", "Secura na boca", "Tontura"],
    observacoes: "Evitar atividades que exijam atenção até saber como o medicamento afeta você."
  },

  // Antiespasmódicos
  {
    nome: "Escopolamina",
    fabricantes: ["EMS", "Neo Química"],
    formas: ["Comprimido 10mg", "Solução oral"],
    categoria: "Antiespasmódicos",
    restricoes: ["Glaucoma", "Hiperplasia prostática"],
    interacoes: ["Antidepressivos", "Antipsicóticos"],
    horariosRecomendados: ["Antes das refeições", "Com água"],
    efeitosColateraisComuns: ["Boca seca", "Visão turva", "Tontura"],
    observacoes: "Evitar álcool. Pode causar sonolência."
  },
  {
    nome: "Dimeticona",
    fabricantes: ["EMS", "Medley", "Neo Química"],
    formas: ["Comprimido 40mg", "Solução oral 75mg/mL"],
    categoria: "Antiespasmódicos",
    restricoes: ["Obstrução intestinal", "Alergia a qualquer componente"],
    interacoes: ["Anticoagulantes", "Antibióticos"],
    horariosRecomendados: ["Comprimido inteiro", "Com água"],
    efeitosColateraisComuns: ["Dor abdominal", "Náusea", "Vômito"],
    observacoes: "Manter em local fresco e seco. Evitar exposição à luz."
  },

  // Antibióticos (Nova categoria)
  {
    nome: "Amoxicilina",
    fabricantes: ["EMS", "Medley", "Neo Química"],
    formas: ["Cápsula 500mg", "Suspensão 250mg/5mL", "Suspensão 400mg/5mL"],
    categoria: "Antibióticos",
    restricoes: ["Alergia a penicilinas", "Mononucleose"],
    interacoes: ["Anticoagulantes", "Contraceptivos orais"],
    horariosRecomendados: ["8/8 horas", "12/12 horas conforme prescrição"],
    efeitosColateraisComuns: ["Diarreia", "Náusea", "Candidíase"],
    observacoes: "Completar todo o tratamento mesmo com melhora dos sintomas."
  },

  // Antiasmáticos (Nova categoria)
  {
    nome: "Salbutamol",
    fabricantes: ["GSK", "Neo Química", "Teuto"],
    formas: ["Aerossol 100mcg/dose", "Solução para nebulização 5mg/mL"],
    categoria: "Antiasmáticos",
    restricoes: ["Hipersensibilidade ao salbutamol"],
    interacoes: ["Beta-bloqueadores", "Diuréticos"],
    horariosRecomendados: ["Conforme necessidade", "Máximo 4-6 vezes ao dia"],
    efeitosColateraisComuns: ["Tremor", "Taquicardia", "Nervosismo"],
    observacoes: "Agitar bem antes de usar. Limpar o bocal após o uso."
  },

  // Osteoporose (Nova categoria)
  {
    nome: "Alendronato de Sódio",
    fabricantes: ["EMS", "Merck", "Medley"],
    formas: ["Comprimido 70mg"],
    categoria: "Osteoporose",
    restricoes: ["Problemas esofágicos", "Incapacidade de ficar em pé"],
    interacoes: ["Suplementos de cálcio", "Antiácidos"],
    horariosRecomendados: ["Em jejum", "30 minutos antes do café"],
    efeitosColateraisComuns: ["Dor abdominal", "Azia", "Dor muscular"],
    observacoes: "Tomar com um copo cheio de água. Permanecer em pé por 30 minutos."
  },

  // Medicamentos Oncológicos
  {
    nome: "Tamoxifeno",
    fabricantes: ["AstraZeneca", "Libbs", "Novartis"],
    formas: ["Comprimido 10mg", "Comprimido 20mg"],
    categoria: "Oncológicos",
    restricoes: ["Gravidez", "História de tromboembolismo"],
    interacoes: ["Anticoagulantes", "Antidepressivos ISRS"],
    horariosRecomendados: ["Mesmo horário todos os dias"],
    efeitosColateraisComuns: ["Fogachos", "Náusea", "Retenção de líquidos"],
    observacoes: "Monitorar periodicamente função hepática e hemograma."
  },
  {
    nome: "Anastrozol",
    fabricantes: ["AstraZeneca", "EMS", "Zodiac"],
    formas: ["Comprimido 1mg"],
    categoria: "Oncológicos",
    restricoes: ["Gravidez", "Amamentação"],
    interacoes: ["Tamoxifeno", "Estrogênios"],
    horariosRecomendados: ["Uma vez ao dia", "Mesmo horário"],
    efeitosColateraisComuns: ["Artralgia", "Fogachos", "Osteoporose"],
    observacoes: "Monitorar densidade óssea regularmente."
  },

  // Antipsicóticos
  {
    nome: "Quetiapina",
    fabricantes: ["AstraZeneca", "EMS", "Medley"],
    formas: ["Comprimido 25mg", "Comprimido 100mg", "Comprimido 200mg"],
    categoria: "Antipsicóticos",
    restricoes: ["Glaucoma", "Demência em idosos"],
    interacoes: ["Antidepressivos", "Anticonvulsivantes"],
    horariosRecomendados: ["Noite", "Longe das refeições"],
    efeitosColateraisComuns: ["Sonolência", "Ganho de peso", "Tontura"],
    observacoes: "Aumento gradual da dose conforme prescrição."
  },
  {
    nome: "Risperidona",
    fabricantes: ["Janssen", "EMS", "Medley"],
    formas: ["Comprimido 1mg", "Comprimido 2mg", "Solução oral 1mg/mL"],
    categoria: "Antipsicóticos",
    restricoes: ["Demência em idosos", "Insuficiência renal grave"],
    interacoes: ["Levodopa", "Antidepressivos"],
    horariosRecomendados: ["1-2 vezes ao dia", "Com ou sem alimentos"],
    efeitosColateraisComuns: ["Insônia", "Ansiedade", "Tremores"],
    observacoes: "Monitorar glicemia e peso regularmente."
  },

  // Medicamentos para Doenças Autoimunes
  {
    nome: "Metotrexato",
    fabricantes: ["Blau", "Wyeth"],
    formas: ["Comprimido 2,5mg", "Injetável 25mg/mL"],
    categoria: "Doenças Autoimunes",
    restricoes: ["Gravidez", "Amamentação", "Insuficiência renal"],
    interacoes: ["AINEs", "Penicilinas", "Sulfas"],
    horariosRecomendados: ["Uma vez por semana", "Mesmo dia da semana"],
    efeitosColateraisComuns: ["Náusea", "Fadiga", "Alterações hepáticas"],
    observacoes: "Suplementar com ácido fólico conforme prescrição."
  },
  {
    nome: "Adalimumabe",
    fabricantes: ["AbbVie", "Amgen"],
    formas: ["Injetável 40mg/0,8mL"],
    categoria: "Doenças Autoimunes",
    restricoes: ["Infecções ativas", "Tuberculose"],
    interacoes: ["Imunossupressores", "Vacinas vivas"],
    horariosRecomendados: ["A cada 14 dias", "Via subcutânea"],
    efeitosColateraisComuns: ["Reação no local", "Infecções", "Cefaleia"],
    observacoes: "Manter refrigerado. Monitorar sinais de infecção."
  },

  // Medicamentos para Diabetes Tipo 2 (expandindo categoria)
  {
    nome: "Dapagliflozina",
    fabricantes: ["AstraZeneca"],
    formas: ["Comprimido 5mg", "Comprimido 10mg"],
    categoria: "Antidiabéticos",
    restricoes: ["Insuficiência renal grave", "Cetoacidose"],
    interacoes: ["Diuréticos", "Insulina"],
    horariosRecomendados: ["Pela manhã", "Com ou sem alimentos"],
    efeitosColateraisComuns: ["Infecção urinária", "Hipoglicemia"],
    observacoes: "Manter boa hidratação. Monitorar função renal."
  },
  {
    nome: "Empagliflozina",
    fabricantes: ["Boehringer"],
    formas: ["Comprimido 10mg", "Comprimido 25mg"],
    categoria: "Antidiabéticos",
    restricoes: ["Insuficiência renal grave", "Cetoacidose"],
    interacoes: ["Diuréticos", "Insulina"],
    horariosRecomendados: ["Pela manhã", "Com ou sem alimentos"],
    efeitosColateraisComuns: ["Infecção urinária", "Hipoglicemia"],
    observacoes: "Monitorar função renal e pressão arterial."
  },

  // Medicamentos para Osteoartrite
  {
    nome: "Condroitina + Glicosamina",
    fabricantes: ["Zodiac", "Ache"],
    formas: ["Sachê", "Comprimido"],
    categoria: "Osteoartrite",
    restricoes: ["Alergia a frutos do mar"],
    interacoes: ["Anticoagulantes"],
    horariosRecomendados: ["Uma vez ao dia", "Com alimentos"],
    efeitosColateraisComuns: ["Náusea", "Dor abdominal"],
    observacoes: "Resultados podem demorar algumas semanas."
  },

  // Medicamentos para Insônia
  {
    nome: "Zolpidem",
    fabricantes: ["Sanofi", "EMS", "Medley"],
    formas: ["Comprimido 5mg", "Comprimido 10mg"],
    categoria: "Hipnóticos",
    restricoes: ["Apneia do sono", "Insuficiência hepática grave"],
    interacoes: ["Álcool", "Depressores do SNC"],
    horariosRecomendados: ["Ao deitar", "Estômago vazio"],
    efeitosColateraisComuns: ["Sonolência", "Amnésia", "Tontura"],
    observacoes: "Usar pelo menor tempo possível. Evitar uso prolongado."
  },

  // Medicamentos para Enxaqueca
  {
    nome: "Sumatriptano",
    fabricantes: ["GSK", "EMS"],
    formas: ["Comprimido 25mg", "Comprimido 50mg", "Spray nasal"],
    categoria: "Antimigranosos",
    restricoes: ["Doença cardíaca", "HAS não controlada"],
    interacoes: ["ISRS", "Ergotamina"],
    horariosRecomendados: ["Ao primeiro sinal de enxaqueca"],
    efeitosColateraisComuns: ["Parestesia", "Sonolência", "Náusea"],
    observacoes: "Não usar mais que 2 doses em 24h."
  },

  // Medicamentos para DPOC
  {
    nome: "Tiotrópio",
    fabricantes: ["Boehringer"],
    formas: ["Cápsula para inalação 18mcg"],
    categoria: "Broncodilatadores",
    restricoes: ["Glaucoma", "Retenção urinária"],
    interacoes: ["Outros anticolinérgicos"],
    horariosRecomendados: ["Uma vez ao dia", "Mesmo horário"],
    efeitosColateraisComuns: ["Boca seca", "Tosse", "Constipação"],
    observacoes: "Usar com inalador específico. Lavar a boca após uso."
  },

  // Medicamentos Oftalmológicos
  {
    nome: "Latanoprosta",
    fabricantes: ["Pfizer", "EMS", "Novartis"],
    formas: ["Solução oftálmica 0,005%"],
    categoria: "Oftalmológicos",
    restricoes: ["Inflamação ocular ativa"],
    interacoes: ["Outros colírios"],
    horariosRecomendados: ["1 gota à noite"],
    efeitosColateraisComuns: ["Vermelhidão", "Crescimento dos cílios", "Escurecimento da íris"],
    observacoes: "Aguardar 5 minutos entre aplicações de diferentes colírios."
  },
  {
    nome: "Dexametasona + Tobramicina",
    fabricantes: ["Novartis", "Allergan"],
    formas: ["Solução oftálmica 0,1% + 0,3%"],
    categoria: "Oftalmológicos",
    restricoes: ["Infecções virais", "Glaucoma"],
    interacoes: ["Outros colírios"],
    horariosRecomendados: ["4/4 horas", "6/6 horas conforme prescrição"],
    efeitosColateraisComuns: ["Ardência", "Visão turva temporária"],
    observacoes: "Lavar as mãos antes da aplicação. Não tocar o conta-gotas."
  },

  // Medicamentos Dermatológicos
  {
    nome: "Betametasona",
    fabricantes: ["Mantecorp", "EMS"],
    formas: ["Creme 0,1%", "Pomada 0,1%"],
    categoria: "Dermatológicos",
    restricoes: ["Infecções cutâneas", "Rosácea"],
    interacoes: ["Outros medicamentos tópicos"],
    horariosRecomendados: ["1-2 vezes ao dia", "Após limpeza da pele"],
    efeitosColateraisComuns: ["Afinamento da pele", "Manchas"],
    observacoes: "Não usar por período prolongado na face."
  },
  {
    nome: "Adapaleno",
    fabricantes: ["Galderma", "EMS"],
    formas: ["Gel 0,1%", "Gel 0,3%"],
    categoria: "Dermatológicos",
    restricoes: ["Queimaduras solares", "Eczema"],
    interacoes: ["Produtos com álcool", "Outros retinoides"],
    horariosRecomendados: ["Uma vez ao dia", "À noite"],
    efeitosColateraisComuns: ["Vermelhidão", "Descamação", "Ressecamento"],
    observacoes: "Usar protetor solar durante o tratamento."
  },

  // Medicamentos para Saúde Mental (expandindo)
  {
    nome: "Venlafaxina",
    fabricantes: ["Wyeth", "EMS", "Medley"],
    formas: ["Cápsula 75mg", "Cápsula 150mg"],
    categoria: "Saúde Mental",
    restricoes: ["Uso de IMAO", "Glaucoma"],
    interacoes: ["Outros antidepressivos", "Anti-inflamatórios"],
    horariosRecomendados: ["Manhã", "Com alimentos"],
    efeitosColateraisComuns: ["Náusea", "Sudorese", "Ansiedade"],
    observacoes: "Não interromper abruptamente. Monitorar pressão arterial."
  },
  {
    nome: "Bupropiona",
    fabricantes: ["GSK", "EMS"],
    formas: ["Comprimido 150mg", "Comprimido 300mg"],
    categoria: "Saúde Mental",
    restricoes: ["Epilepsia", "Transtornos alimentares"],
    interacoes: ["Antidepressivos", "Anticonvulsivantes"],
    horariosRecomendados: ["12/12 horas", "Longe das refeições"],
    efeitosColateraisComuns: ["Insônia", "Boca seca", "Agitação"],
    observacoes: "Evitar tomar próximo ao horário de dormir."
  },

  // Medicamentos Reumáticos
  {
    nome: "Leflunomida",
    fabricantes: ["Sanofi", "EMS"],
    formas: ["Comprimido 20mg"],
    categoria: "Reumáticos",
    restricoes: ["Gravidez", "Insuficiência hepática"],
    interacoes: ["Metotrexato", "Rifampicina"],
    horariosRecomendados: ["Uma vez ao dia"],
    efeitosColateraisComuns: ["Diarreia", "Alopecia", "Hipertensão"],
    observacoes: "Monitorar função hepática regularmente."
  },
  {
    nome: "Tocilizumabe",
    fabricantes: ["Roche"],
    formas: ["Injetável 162mg/0,9mL"],
    categoria: "Reumáticos",
    restricoes: ["Infecções ativas", "Neutropenia"],
    interacoes: ["Imunossupressores", "Vacinas vivas"],
    horariosRecomendados: ["Semanal ou quinzenal", "Via subcutânea"],
    efeitosColateraisComuns: ["Infecções", "Neutropenia", "Elevação de enzimas hepáticas"],
    observacoes: "Manter refrigerado. Monitorar hemograma."
  },

  // Medicamentos Cardíacos
  {
    nome: "Sacubitril/Valsartana",
    fabricantes: ["Novartis"],
    formas: ["Comprimido 24/26mg", "Comprimido 49/51mg", "Comprimido 97/103mg"],
    categoria: "Cardíacos",
    restricoes: ["Angioedema prévio", "Gravidez"],
    interacoes: ["iECA", "Diuréticos poupadores de potássio"],
    horariosRecomendados: ["12/12 horas"],
    efeitosColateraisComuns: ["Hipotensão", "Hipercalemia", "Tontura"],
    observacoes: "Monitorar pressão arterial e função renal."
  },
  {
    nome: "Ranolazina",
    fabricantes: ["Gilead", "EMS"],
    formas: ["Comprimido 500mg", "Comprimido 1000mg"],
    categoria: "Cardíacos",
    restricoes: ["Cirrose hepática", "Arritmias graves"],
    interacoes: ["Antiarrítmicos", "Digoxina"],
    horariosRecomendados: ["12/12 horas", "Com ou sem alimentos"],
    efeitosColateraisComuns: ["Tontura", "Constipação", "Náusea"],
    observacoes: "Não partir ou esmagar os comprimidos."
  },

  // Medicamentos para Osteoporose (expandindo)
  {
    nome: "Denosumabe",
    fabricantes: ["Amgen"],
    formas: ["Injetável 60mg/mL"],
    categoria: "Osteoporose",
    restricoes: ["Hipocalcemia", "Gravidez"],
    interacoes: ["Imunossupressores"],
    horariosRecomendados: ["A cada 6 meses", "Via subcutânea"],
    efeitosColateraisComuns: ["Dor nas costas", "Dor nos membros", "Hipocalcemia"],
    observacoes: "Suplementar cálcio e vitamina D durante tratamento."
  },

  // Medicamentos para Próstata
  {
    nome: "Tansulosina",
    fabricantes: ["Boehringer", "EMS"],
    formas: ["Cápsula 0,4mg"],
    categoria: "Próstata",
    restricoes: ["Hipotensão ortostática"],
    interacoes: ["Anti-hipertensivos", "Inibidores da PDE5"],
    horariosRecomendados: ["Uma vez ao dia", "Após café da manhã"],
    efeitosColateraisComuns: ["Tontura", "Ejaculação anormal", "Congestão nasal"],
    observacoes: "Tomar sempre no mesmo horário."
  },

  // Medicamentos para Glaucoma
  {
    nome: "Timolol",
    fabricantes: ["Merck", "Allergan"],
    formas: ["Colírio 0,25%", "Colírio 0,5%"],
    categoria: "Glaucoma",
    restricoes: ["Asma", "Bradicardia"],
    interacoes: ["Beta-bloqueadores orais", "Bloqueadores do canal de cálcio"],
    horariosRecomendados: ["12/12 horas"],
    efeitosColateraisComuns: ["Ardência", "Visão borrada", "Olho seco"],
    observacoes: "Comprimir o canto do olho após aplicação."
  }
];
