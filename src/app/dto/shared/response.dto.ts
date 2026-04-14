export interface ResponseDTO<T> {
  exito: boolean
  mensaje: string
  datos: T | null
}
