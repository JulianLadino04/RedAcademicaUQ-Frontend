import { Tema, TipoContenido } from '../enums'

export interface CrearContenidoAcademicoDTO {
  titulo: string
  tema: Tema
  autor: string
  contenido: string
  tipoContenido: TipoContenido
}
