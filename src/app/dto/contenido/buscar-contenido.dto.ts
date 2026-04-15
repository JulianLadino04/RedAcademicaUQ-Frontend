import { Tema, TipoContenido } from '../enums'

export interface BuscarContenidoDTO {
  tema: Tema
  tipoContenido: TipoContenido
  autor: string
  textoBusqueda: string
  pagina: number
  tamano: number
}
