import React, { createContext, useContext, useState } from 'react';


const MedicamentosContext = createContext();

export const MedicamentosProvider = ({ children }) => {
  const [medicamentos, setMedicamentos] = useState([
    {
      id: 1,
      nome: 'Losartana 50mg',
      tipo: 'Anti-hipertensivo',
      estoque: 30,
      proximaData: '2025-09-22',
      horarios: ['08:00', '20:00'],
    },
    // ...outros medicamentos
  ]);

  const editarMedicamento = (id, novoMedicamento) => {
    setMedicamentos(meds =>
      meds.map(med => (med.id === id ? { ...med, ...novoMedicamento } : med))
    );
  };

  return (
    <MedicamentosContext.Provider value={{ medicamentos, setMedicamentos, editarMedicamento }}>
      {children}
    </MedicamentosContext.Provider>
  );
};

export const useMedicamentos = () => useContext(MedicamentosContext);

