import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ResponseDTO } from '../dto/shared/response.dto';
import { CrearChatDTO } from '../dto/chat/crear-chat.dto';
import { CrearMensajeDTO } from '../dto/chat/crear-mensaje.dto';
import { InformacionChatDTO } from '../dto/chat/informacion-chat.dto';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private chatURL = 'http://localhost:8080/api/chats';

  constructor(private http: HttpClient) {}

  public crearChat(dto: CrearChatDTO): Observable<ResponseDTO<string>> {
    return this.http.post<ResponseDTO<string>>(this.chatURL, dto);
  }

  public obtenerChatPorId(id: string): Observable<ResponseDTO<InformacionChatDTO>> {
    return this.http.get<ResponseDTO<InformacionChatDTO>>(`${this.chatURL}/${id}`);
  }

  public obtenerChatsPorUsuario(usuarioId: string): Observable<ResponseDTO<InformacionChatDTO[]>> {
    return this.http.get<ResponseDTO<InformacionChatDTO[]>>(
      `${this.chatURL}/usuario/${usuarioId}`
    );
  }

  public obtenerChatsEntreUsuarios(usuario1Id: string, usuario2Id: string): Observable<ResponseDTO<InformacionChatDTO[]>> {
    return this.http.get<ResponseDTO<InformacionChatDTO[]>>(
      `${this.chatURL}/entre/${usuario1Id}/${usuario2Id}`
    );
  }

  public enviarMensaje(dto: CrearMensajeDTO): Observable<ResponseDTO<string>> {
    return this.http.post<ResponseDTO<string>>(
      `${this.chatURL}/mensaje`,
      dto
    );
  }

  public eliminarChat(id: string): Observable<ResponseDTO<string>> {
    return this.http.delete<ResponseDTO<string>>(`${this.chatURL}/${id}`);
  }
}