import { StorageService } from './StorageService';
import { Alarme, Medicamento } from '../types';

class NotificationService {
  static async scheduleNotification(medicamento: Medicamento) {
    const horarios = medicamento.horarios;
    
    for (const horario of horarios) {
      const [hora, minuto] = horario.split(':').map(Number);
      
      const alarme: Alarme = {
        id: `${medicamento.id}_${horario}`,
        medicamentoId: medicamento.id,
        horario,
        status: 'pendente',
        data: new Date().toISOString()
      };
      
      await StorageService.saveAlarme(alarme);
    }
  }

  static async checkPendingNotifications() {
    const alarmes = await StorageService.getAlarmes();
    const agora = new Date();
    const horaAtual = agora.getHours();
    const minutoAtual = agora.getMinutes();

    const alarmesAtrasados = alarmes.filter(alarme => {
      if (alarme.status !== 'pendente') return false;

      const [hora, minuto] = alarme.horario.split(':').map(Number);
      return (horaAtual > hora || (horaAtual === hora && minutoAtual >= minuto));
    });

    return alarmesAtrasados;
  }

  static async marcarAlarmeTomado(alarmeId: string) {
    const alarmes = await StorageService.getAlarmes();
    const alarmeIndex = alarmes.findIndex(a => a.id === alarmeId);
    
    if (alarmeIndex !== -1) {
      alarmes[alarmeIndex].status = 'tomado';
      await StorageService.saveAlarme(alarmes[alarmeIndex]);
    }
  }
}

export default NotificationService;
