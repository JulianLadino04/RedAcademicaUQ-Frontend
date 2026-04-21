import { Tema } from '../enums';

export interface CrearSolicitudAyudaDTO {
  tema: Tema;
  urgencia: number;
  solicitanteId: string;
  descripcion: string;
}