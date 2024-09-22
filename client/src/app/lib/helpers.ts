export class ObjectHelper {
  static CopyObject<T>(target: T, source: Partial<T>): T {
    for (let key in source) {
      if (source.hasOwnProperty(key)) {
        (target as any)[key] = (source as any)[key];
      }
    }
    return target;
  }
}

export class CedulaHelper {
  static readonly Regex = /^\d{3}-\d{7}-\d{1}$/;

  static ValidarCedula(cedula: string): boolean {
    cedula = cedula.replace(/-/g, '');
    if (cedula.length !== 11) {
      return false;
    }

    const digits = cedula.split('').map(Number);
    const weights = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2];
    let sum = 0;

    for (let i = 0; i < 10; i++) {
      let product = digits[i] * weights[i];
      if (product >= 10) {
        product = Math.floor(product / 10) + (product % 10);
      }
      sum += product;
    }

    const checksumDigit = (10 - (sum % 10)) % 10;
    return checksumDigit === digits[10];
  }
}
