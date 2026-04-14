import { Tema, EstadoSolicitud } from '../enums'

export interface InformacionSolicitudAyudaDTO {
  id: string
  tema: Tema
  urgencia: number
  solicitanteId: string
  nombreSolicitante: string
  descripcion: string
  estado: EstadoSolicitud
  fechaCreacion: string
  idContenidoResuelto: string | null
  nombreContenidoResuelto: string | null
}
