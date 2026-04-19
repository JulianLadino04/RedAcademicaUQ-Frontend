import { Tema } from '../enums/tema.enum'
import { TipoContenido } from '../enums/tipo-contenido.enum'

export interface InformacionContenidoAcademicoDTO {
  id: string
  titulo: string
  tema: Tema
  autor: string
  tipoContenido: TipoContenido
  nombreArchivo: string
  contentType: string
  tamanoBytes: number
  archivoId: string
  fechaCreacion: string
}