import { EstadoSolicitud } from "../enums/estado-solicitud.enum";

export interface EstadisticaSolicitudDTO {
  estado: EstadoSolicitud;
  total: number;
}