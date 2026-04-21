export interface CrearRespuestaSolicitudDTO {
  solicitudId: string;
  autorId: string;
  autorNombre: string;
  comentario: string;
  textoRespuesta: string;
  contenidoAcademicoId: string | null;
  esRespuestaFinal: boolean;
}