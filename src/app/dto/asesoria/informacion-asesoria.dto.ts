import { EstadoAsesoria } from '../enums'

export interface InformacionAsesoriaDTO {
  id: string
  solicitanteId: string
  nombreSolicitante: string
  asesorId: string
  nombreAsesor: string
  tema: string
  fechaHora: string
  descripcion: string
  medio: string
  estado: EstadoAsesoria
}
