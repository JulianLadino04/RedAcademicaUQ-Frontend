import { InformacionAdjuntoRespuestaDTO } from "./informacion-adjunto-respuesta";

export interface InformacionRespuestaSolicitudDTO {
  id: string;
  solicitudId: string;
  autorId: string;
  autorNombre: string;
  comentario: string;
  textoRespuesta: string;
  contenidoAcademicoId: string | null;
  adjuntos: InformacionAdjuntoRespuestaDTO[];
  fechaCreacion: string;
  esRespuestaFinal: boolean;
}