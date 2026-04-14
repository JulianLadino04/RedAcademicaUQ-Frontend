import { Tema } from '../enums'
import { InformacionParticipanteDTO } from './informacion-participante.dto'

export interface InformacionGrupoEstudioDTO {
  id: string
  nombre: string
  tema: Tema
  descripcion: string
  participantes: InformacionParticipanteDTO[]
  cantidadParticipantes: number
  fechaCreacion: string
  esParticipante: boolean
}
