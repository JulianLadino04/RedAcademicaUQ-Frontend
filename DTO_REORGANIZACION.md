# Estructura Reorganizada de DTOs - Red Académica UQ Frontend

## Resumen de la Reorganización

Se han reorganizado todos los DTOs del frontend en una estructura modular por dominios, siguiendo patrones de arquitectura escalable.

## Estructura de Carpetas

```
src/app/dto/
├── estudiante/                    # DTOs relacionados con estudiantes
│   ├── buscar-estudiante.dto.ts
│   ├── crear-estudiante.dto.ts
│   ├── editar-estudiante.dto.ts
│   ├── informacion-estudiante.dto.ts
│   └── item-estudiante.dto.ts
│
├── mentor/                        # DTOs relacionados con mentores
│   ├── crear-mentor.dto.ts
│   └── informacion-mentor.dto.ts
│
├── grupo/                         # DTOs relacionados con grupos de estudio
│   ├── abandonar-grupo.dto.ts
│   ├── crear-grupo-estudio.dto.ts
│   ├── informacion-grupo-estudio.dto.ts
│   ├── informacion-participante.dto.ts
│   ├── participante-grupo.dto.ts
│   ├── rechazar-grupo.dto.ts
│   └── unirse-grupo.dto.ts
│
├── contenido/                     # DTOs relacionados con contenido académico
│   ├── buscar-contenido.dto.ts
│   ├── crear-contenido-academico.dto.ts
│   ├── guardar-contenido.dto.ts
│   └── informacion-contenido-academico.dto.ts
│
├── chat/                          # DTOs relacionados con chats y mensajes
│   ├── crear-chat.dto.ts
│   ├── crear-mensaje.dto.ts
│   ├── informacion-chat.dto.ts
│   ├── informacion-mensaje.dto.ts
│   └── mensaje-dto.ts              # DTO genérico para respuestas HTTP
│
├── asesoria/                      # DTOs relacionados con asesorías
│   ├── actualizar-estado.dto.ts
│   ├── crear-asesoria.dto.ts
│   └── informacion-asesoria.dto.ts
│
├── solicitud/                     # DTOs relacionados con solicitudes de ayuda
│   ├── atender-solicitud.dto.ts
│   ├── crear-solicitud-ayuda.dto.ts
│   ├── informacion-solicitud-ayuda.dto.ts
│   └── resolver-solicitud.dto.ts
│
├── valoracion/                    # DTOs relacionados con valoraciones
│   ├── crear-valoracion.dto.ts
│   └── informacion-valoracion.dto.ts
│
├── cuenta/                        # DTOs relacionados con autenticación y cuenta
│   ├── cambiar-password.dto.ts
│   ├── crear-cuenta.dto.ts
│   ├── login.dto.ts
│   └── token.dto.ts
│
├── amistad/                       # DTOs relacionados con amistades
│   └── amigo.dto.ts
│
├── eventos/                       # DTOs relacionados con eventos
│   ├── crear-evento.dto.ts
│   ├── editar-evento.dto.ts
│   └── evento.dto.ts
│
├── shared/                        # DTOs compartidos/genéricos
│   └── response.dto.ts
│
└── enums/                         # Enumeraciones compartidas
    └── [enums files]
```

## Cambios en Imports

### Archivos Actualizados

#### Servicios
- `src/app/servicios/auth.ts`
  - `../dto/crear-cuenta-dto` → `../dto/cuenta/crear-cuenta.dto`
  - `../dto/login-dto` → `../dto/cuenta/login.dto`
  - `../dto/mensaje-dto` → `../dto/chat/mensaje-dto`

- `src/app/servicios/administrador.ts`
  - `../dto/mensaje-dto` → `../dto/chat/mensaje-dto`
  - `../dto/crear-evento-dto` → `../dto/eventos/crear-evento.dto`
  - `../dto/editar-evento-dto` → `../dto/eventos/editar-evento.dto`

- `src/app/servicios/publico.ts`
  - `../dto/mensaje-dto` → `../dto/chat/mensaje-dto`

- `src/app/servicios/eventos.ts`
  - `../dto/evento-dto` → `../dto/eventos/evento.dto`

#### Componentes
- `src/app/componentes/login/login.ts`
  - `../../dto/login-dto` → `../../dto/cuenta/login.dto`

- `src/app/componentes/registro/registro.ts`
  - `../../dto/crear-cuenta-dto` → `../../dto/cuenta/crear-cuenta.dto`

- `src/app/componentes/gestion-eventos/gestion-eventos.ts`
  - `../../dto/evento-dto` → `../../dto/eventos/evento.dto`

- `src/app/componentes/detalle-evento/detalle-evento.ts`
  - `../../dto/evento-dto` → `../../dto/eventos/evento.dto`

## Imports Internos de DTOs

Los siguientes DTOs tienen dependencias internas que fueron actualizadas:

1. **grupo/informacion-grupo-estudio.dto.ts**
   - Importa: `./informacion-participante.dto` (mismo módulo)

2. **contenido/informacion-contenido-academico.dto.ts**
   - Importa: `../valoracion/informacion-valoracion.dto` (cross-module dependency)

3. **chat/informacion-chat.dto.ts**
   - Importa: `./informacion-mensaje.dto` (mismo módulo)

4. **DTOs que usan enums**
   - Todos importan desde: `../enums` (un nivel arriba)
   - Enums utilizados: `Tema`, `TipoContenido`, `EstadoAsesoria`, `EstadoSolicitud`

## Beneficios de la Reorganización

✅ **Modularidad**: Cada dominio está en su propia carpeta
✅ **Escalabilidad**: Fácil agregar nuevos DTOs a un dominio
✅ **Mantenibilidad**: Estructura clara y predecible
✅ **Cohesión**: DTOs relacionados están agrupados
✅ **Bajo acoplamiento**: Minimiza dependencias entre módulos
✅ **Estándares**: Sigue convenciones de estructura escalable

## Estándares Aplicados

- ✅ Nombres en **kebab-case** para archivos
- ✅ Estructura de carpetas por **dominio funcional**
- ✅ Imports relativos actualizados
- ✅ DTOs compartidos en carpeta `shared/`
- ✅ Enumeraciones centralizadas en carpeta `enums/`
- ✅ Exports corregidos según el nuevo patrón

## Próximos Pasos Recomendados

1. Crear `index.ts` en cada carpeta de módulo para facilitar imports
   ```typescript
   // src/app/dto/estudiante/index.ts
   export * from './crear-estudiante.dto';
   export * from './editar-estudiante.dto';
   // ... etc
   ```

2. Considerar crear servicios especializados por dominio si no existen

3. Actualizar documentación del proyecto con la nueva estructura

4. Ejecutar tests para validar que todos los imports funcionan correctamente
