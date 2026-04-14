import { InformacionMensajeDTO } from './informacion-mensaje.dto'

export interface InformacionChatDTO {
  id: string
  estudiante1Id: string
  nombreEstudiante1: string
  estudiante2Id: string
  nombreEstudiante2: string
  mensajes: InformacionMensajeDTO[]
  ultimoMensaje: string
}
