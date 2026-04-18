import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

/**
 * Componente de chat
 * Bandeja lateral con chats + vista abierta del chat
 */
@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrls: ['./chat.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('mensajesScroll') private mensajesScroll!: ElementRef;

  chats: any[] = [];
  chatSeleccionado: any = null;
  cargando = false;
  enviando = false;
  nuevoMensaje = '';
  usuarioActualId = 'EST-101'; // Simulado - en producción viene del auth

  // ✅ DATOS MOCK
  chatsMock = [
    {
      id: 'CHAT-001',
      estudiante1Id: 'EST-101',
      nombreEstudiante1: 'Tú',
      estudiante2Id: 'EST-102',
      nombreEstudiante2: 'María López',
      ultimoMensaje: 'Hola, ¿cómo estás?',
      mensajes: [
        {
          id: 'MSG-001',
          remitenteId: 'EST-101',
          nombreRemitente: 'Tú',
          destinatarioId: 'EST-102',
          contenido: 'Hola María, ¿cómo estás?',
          fecha: '2024-04-18T10:30:00',
          esPropio: true
        },
        {
          id: 'MSG-002',
          remitenteId: 'EST-102',
          nombreRemitente: 'María López',
          destinatarioId: 'EST-101',
          contenido: 'Hola! Bien, ¿y tú?',
          fecha: '2024-04-18T10:31:00',
          esPropio: false
        },
        {
          id: 'MSG-003',
          remitenteId: 'EST-101',
          nombreRemitente: 'Tú',
          destinatarioId: 'EST-102',
          contenido: 'Bien también, necesitaba preguntarte sobre la tarea',
          fecha: '2024-04-18T10:32:00',
          esPropio: true
        }
      ]
    },
    {
      id: 'CHAT-002',
      estudiante1Id: 'EST-101',
      nombreEstudiante1: 'Tú',
      estudiante2Id: 'EST-103',
      nombreEstudiante2: 'Juan Pérez',
      ultimoMensaje: 'Ok, nos vemos después',
      mensajes: [
        {
          id: 'MSG-004',
          remitenteId: 'EST-101',
          nombreRemitente: 'Tú',
          destinatarioId: 'EST-103',
          contenido: 'Hola Juan, ¿me pasas tus apuntes?',
          fecha: '2024-04-17T14:00:00',
          esPropio: true
        },
        {
          id: 'MSG-005',
          remitenteId: 'EST-103',
          nombreRemitente: 'Juan Pérez',
          destinatarioId: 'EST-101',
          contenido: 'Claro, te los paso después de clase',
          fecha: '2024-04-17T14:05:00',
          esPropio: false
        }
      ]
    },
    {
      id: 'CHAT-003',
      estudiante1Id: 'EST-101',
      nombreEstudiante1: 'Tú',
      estudiante2Id: 'EST-104',
      nombreEstudiante2: 'Ana Martínez',
      ultimoMensaje: 'Gracias por la ayuda!',
      mensajes: []
    }
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarChats();
  }

  ngAfterViewChecked() {
    this.scrollAlFinal();
  }

  /**
   * Carga la lista de chats
   */
  private cargarChats() {
    this.cargando = true;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.chats = [...this.chatsMock];
      this.cargando = false;
      this.cdr.detectChanges();
    }, 500);
  }

  /**
   * Selecciona un chat
   */
  public seleccionarChat(chat: any) {
    this.chatSeleccionado = chat;
    this.nuevoMensaje = '';
    this.cdr.detectChanges();
  }

  /**
   * Envía un mensaje
   */
  public enviarMensaje() {
    if (!this.nuevoMensaje.trim() || !this.chatSeleccionado) {
      return;
    }

    this.enviando = true;
    this.cdr.detectChanges();

    const nuevoMensaje = {
      id: 'MSG-' + Date.now(),
      remitenteId: this.usuarioActualId,
      nombreRemitente: 'Tú',
      destinatarioId: this.chatSeleccionado.estudiante2Id === this.usuarioActualId 
        ? this.chatSeleccionado.estudiante1Id 
        : this.chatSeleccionado.estudiante2Id,
      contenido: this.nuevoMensaje,
      fecha: new Date().toISOString(),
      esPropio: true
    };

    this.chatSeleccionado.mensajes.push(nuevoMensaje);
    this.chatSeleccionado.ultimoMensaje = this.nuevoMensaje;
    this.nuevoMensaje = '';
    
    setTimeout(() => {
      this.enviando = false;
      this.cdr.detectChanges();
    }, 300);

    console.log('Mensaje enviado:', nuevoMensaje);
  }

  /**
   * Vuelve a la pantalla anterior
   */
  public volver() {
    this.chatSeleccionado = null;
    this.nuevoMensaje = '';
  }

  /**
   * Obtiene el nombre del otro usuario en el chat
   */
  public getNombreOtroUsuario(chat: any): string {
    return chat.estudiante1Id === this.usuarioActualId 
      ? chat.nombreEstudiante2 
      : chat.nombreEstudiante1;
  }

  /**
   * Scroll automático al final
   */
  private scrollAlFinal() {
    try {
      if (this.mensajesScroll) {
        setTimeout(() => {
          this.mensajesScroll.nativeElement.scrollTop = 
            this.mensajesScroll.nativeElement.scrollHeight;
        }, 100);
      }
    } catch (err) {
      // Silenciar error de scroll
    }
  }

  /**
   * Formatea la fecha
   */
  public formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    const hoy = new Date();
    const esHoy = date.toDateString() === hoy.toDateString();
    
    if (esHoy) {
      return date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
    }
    
    return date.toLocaleDateString('es-CO', { month: 'short', day: 'numeric' });
  }

  /**
   * Tronca el último mensaje para la bandeja
   */
  public truncarMensaje(mensaje: string, longitud: number = 50): string {
    return mensaje.length > longitud ? mensaje.substring(0, longitud) + '...' : mensaje;
  }

  /**
   * Verifica si un chat está seleccionado
   */
  public estaSeleccionado(chat: any): boolean {
    return this.chatSeleccionado && this.chatSeleccionado.id === chat.id;
  }
}