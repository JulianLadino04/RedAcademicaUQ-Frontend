export interface InformacionMensajeDTO {
  id: string
  remitenteId: string
  nombreRemitente: string
  destinatarioId: string
  contenido: string
  fecha: string
  esPropio: boolean
}
