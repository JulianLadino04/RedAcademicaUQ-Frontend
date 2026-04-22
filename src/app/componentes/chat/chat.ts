import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  AfterViewChecked
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { ChatService } from '../../servicios/chat';
import { Token } from '../../servicios/token';

import { InformacionChatDTO } from '../../dto/chat/informacion-chat.dto';
import { InformacionMensajeDTO } from '../../dto/chat/informacion-mensaje.dto';
import { CrearMensajeDTO } from '../../dto/chat/crear-mensaje.dto';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrls: ['./chat.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {

  chats: InformacionChatDTO[] = [];
  chatSeleccionado: InformacionChatDTO | null = null;

  cargando = false;
  enviando = false;
  mensajeError = '';
  nuevoMensaje = '';

  usuarioActualId: string | null = null;
  usuarioActualNombre = '';

  @ViewChild('mensajesScroll') mensajesScroll!: ElementRef<HTMLDivElement>;

  private debeBajarScroll = false;

  constructor(
    private chatService: ChatService,
    private tokenService: Token,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.obtenerUsuarioActual();

    this.route.paramMap.subscribe(params => {
      const chatId = params.get('id');
      this.cargarChats(chatId);
    });
  }

  ngAfterViewChecked(): void {
    if (this.debeBajarScroll) {
      this.scrollAlFinal();
      this.debeBajarScroll = false;
    }
  }

  private obtenerUsuarioActual(): void {
    const data = this.tokenService.verTokenDecodificado();

    this.usuarioActualId = data?.id || data?._id || data?.userId || null;
    this.usuarioActualNombre = data?.nombre || data?.name || '';

    console.log('🔐 Usuario actual chat:', data);
  }

  public cargarChats(chatIdAbrir: string | null = null): void {
    if (!this.usuarioActualId) {
      this.mensajeError = 'No fue posible identificar el usuario autenticado.';
      return;
    }

    this.cargando = true;
    this.mensajeError = '';

    this.chatService.obtenerChatsPorUsuario(this.usuarioActualId).subscribe({
      next: (resp) => {
        const lista = Array.isArray(resp?.datos) ? resp.datos : [];

        this.chats = lista.map(chat => this.prepararChat(chat));

        this.chats.sort((a, b) => {
          const fechaA = a.ultimoMensaje ? new Date(a.ultimoMensaje).getTime() : 0;
          const fechaB = b.ultimoMensaje ? new Date(b.ultimoMensaje).getTime() : 0;
          return fechaB - fechaA;
        });

        if (chatIdAbrir) {
          const chatEncontrado = this.chats.find(c => c.id === chatIdAbrir);
          if (chatEncontrado) {
            this.chatSeleccionado = chatEncontrado;
            this.debeBajarScroll = true;
          }
        } else if (this.chatSeleccionado) {
          const actualizado = this.chats.find(c => c.id === this.chatSeleccionado?.id);
          if (actualizado) {
            this.chatSeleccionado = actualizado;
            this.debeBajarScroll = true;
          }
        }

        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Error al cargar chats:', error);
        this.cargando = false;
        this.mensajeError =
          error.error?.mensaje ||
          error.error?.respuesta ||
          'No fue posible cargar los chats.';
        this.cdr.detectChanges();
      }
    });
  }

  private prepararChat(chat: InformacionChatDTO): InformacionChatDTO {
    const mensajesPreparados: InformacionMensajeDTO[] = (chat.mensajes || []).map(m => ({
      ...m,
      esPropio: m.remitenteId === this.usuarioActualId
    }));

    let ultimoMensajeFecha = chat.ultimoMensaje;

    if ((!ultimoMensajeFecha || ultimoMensajeFecha === '') && mensajesPreparados.length > 0) {
      ultimoMensajeFecha = mensajesPreparados[mensajesPreparados.length - 1].fecha;
    }

    return {
      ...chat,
      mensajes: mensajesPreparados,
      ultimoMensaje: ultimoMensajeFecha
    };
  }

  public seleccionarChat(chat: InformacionChatDTO): void {
    this.chatSeleccionado = chat;
    this.debeBajarScroll = true;
    this.router.navigate(['/chat', chat.id]);
  }

  public estaSeleccionado(chat: InformacionChatDTO): boolean {
    return this.chatSeleccionado?.id === chat.id;
  }

  public enviarMensaje(): void {
    if (!this.chatSeleccionado || !this.usuarioActualId || !this.nuevoMensaje.trim()) {
      return;
    }

    const destinatarioId = this.getIdOtroUsuario(this.chatSeleccionado);

    if (!destinatarioId) {
      this.mensajeError = 'No fue posible identificar el destinatario.';
      return;
    }

    this.enviando = true;
    this.mensajeError = '';

    const dto: CrearMensajeDTO = {
      remitenteId: this.usuarioActualId,
      destinatarioId,
      chatId: this.chatSeleccionado.id,
      contenido: this.nuevoMensaje.trim()
    };

    const textoTemporal = this.nuevoMensaje.trim();

    this.chatService.enviarMensaje(dto).subscribe({
      next: () => {
        this.nuevoMensaje = '';

        const mensajeLocal: InformacionMensajeDTO = {
          id: crypto.randomUUID(),
          remitenteId: this.usuarioActualId!,
          nombreRemitente: this.usuarioActualNombre,
          destinatarioId,
          contenido: textoTemporal,
          fecha: new Date().toISOString(),
          esPropio: true
        };

        this.chatSeleccionado?.mensajes.push(mensajeLocal);

        if (this.chatSeleccionado) {
          this.chatSeleccionado.ultimoMensaje = mensajeLocal.fecha;
        }

        this.actualizarChatEnLista(this.chatSeleccionado);
        this.enviando = false;
        this.debeBajarScroll = true;
        this.cdr.detectChanges();

        setTimeout(() => this.cargarChats(this.chatSeleccionado?.id || null), 300);
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Error al enviar mensaje:', error);
        this.enviando = false;
        this.mensajeError =
          error.error?.mensaje ||
          error.error?.respuesta ||
          'No fue posible enviar el mensaje.';
        this.cdr.detectChanges();
      }
    });
  }

  private actualizarChatEnLista(chatActualizado: InformacionChatDTO | null): void {
    if (!chatActualizado) return;

    const index = this.chats.findIndex(c => c.id === chatActualizado.id);
    if (index >= 0) {
      this.chats[index] = { ...chatActualizado };
    }

    this.chats.sort((a, b) => {
      const fechaA = a.ultimoMensaje ? new Date(a.ultimoMensaje).getTime() : 0;
      const fechaB = b.ultimoMensaje ? new Date(b.ultimoMensaje).getTime() : 0;
      return fechaB - fechaA;
    });
  }

  private scrollAlFinal(): void {
    try {
      if (this.mensajesScroll?.nativeElement) {
        const el = this.mensajesScroll.nativeElement;
        el.scrollTop = el.scrollHeight;
      }
    } catch (e) {
      console.warn('No fue posible hacer scroll automático', e);
    }
  }

  public getNombreOtroUsuario(chat: InformacionChatDTO): string {
    if (!this.usuarioActualId) return 'Usuario';

    const soyUsuario1 = chat.usuario1Id === this.usuarioActualId;

    if (soyUsuario1) {
      return chat.nombreUsuario2?.trim() || 'Usuario';
    }

    return chat.nombreUsuario1?.trim() || 'Usuario';
  }

  public getIdOtroUsuario(chat: InformacionChatDTO): string {
    if (!this.usuarioActualId) return '';

    return chat.usuario1Id === this.usuarioActualId
      ? chat.usuario2Id
      : chat.usuario1Id;
  }

  public truncarMensaje(texto?: string): string {
    if (!texto) {
      return 'Sin mensajes';
    }

    return texto.length > 30
      ? `${texto.substring(0, 30)}...`
      : texto;
  }

  public formatearFecha(fecha: string): string {
    if (!fecha) return '';

    return new Date(fecha).toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  public volver(): void {
    this.chatSeleccionado = null;
    this.router.navigate(['/chat']);
  }
}