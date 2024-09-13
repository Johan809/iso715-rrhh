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
