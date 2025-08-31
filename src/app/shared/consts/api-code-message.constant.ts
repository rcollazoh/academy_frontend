export class ApiCodeMessage {
  /** Mensajes de exito */
  /** TODO  -actualizarlos*/
  public static readonly MSG_CODE_200 = 'Consulta de datos exitosa';
  public static readonly MSG_CODE_201 = 'Registro creado correctamente';
  public static readonly MSG_CODE_204 = 'Registro eliminado correctamente';
  public static readonly MSG_CODE_205 = 'Registro modificado correctamente';
  public static readonly MSG_CODE_206 = 'Registro actualizado parcialmente';


  /** Mensajes de error Login service*/
  /** TODO  -actualizarlos*/
  public static readonly MSG_CODE_400_1 = 'El usuario no existe';

  /** Mensajes de error */
  /** TODO  -actualizarlos*/
  public static readonly MSG_CODE_400 = 'Elemento no encontrado';
  public static readonly MSG_CODE_401 = 'Recurso no autorizado';
  public static readonly MSG_CODE_404 = 'Recurso no encontrado';
  public static readonly MSG_CODE_406 = 'El nombre del campo ya existe';
  public static readonly MSG_CODE_500 = 'Error interno del servidor';


  public static readonly MSG_CODE_503 =
    'El servicio no se encuentra disponible';
  public static readonly MSG_CODE_UNKNOWN = 'Error desconocido del servidor';
}
