/**
 * Valida que una dirección (destination) cumpla con la nomenclatura de una dirección real en Colombia.
 * Ejemplo válido: "Cll 123 #34-23"
 *
 * @param address La dirección a validar.
 * @returns true si el formato es correcto, false de lo contrario.
 */
export function isValidAddress(address: string): boolean {
    const regex = /^(Cll|Calle|Cra|Kra|Carrera|Diag|Diagonal|Av|Avenida|Transversal)\s+\d+(\s*#\s*\d+(-\d+)?)?$/i;
    return regex.test(address.trim());
  }
  