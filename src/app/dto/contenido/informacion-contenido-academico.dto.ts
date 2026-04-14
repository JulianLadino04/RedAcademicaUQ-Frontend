import { Tema } from '../enums/tema.enum'
import { TipoContenido } from '../enums/tipo-contenido.enum'
import { InformacionValoracionDTO } from '../valoracion'

export interface InformacionContenidoAcademicoDTO {
  id: string
  titulo: string
  tema: Tema
  autor: string
  contenido: string
  tipoContenido: TipoContenido
  valoraciones: InformacionValoracionDTO[]
  puntuacionPromedio: number
  fechaCreacion: string
}
