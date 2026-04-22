import { InformacionMensajeDTO } from './informacion-mensaje.dto';

export interface InformacionChatDTO {
  id: string;
  usuario1Id: string;
  nombreUsuario1: string;
  usuario2Id: string;
  nombreUsuario2: string;
  mensajes: InformacionMensajeDTO[];
  ultimoMensaje: string;
}