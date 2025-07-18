type ReplaceNullWithUndefined<T> = T extends null
  ? undefined
  : T extends Array<infer U>
    ? Array<ReplaceNullWithUndefined<U>>
    : T extends object
      ? { [K in keyof T]: ReplaceNullWithUndefined<T[K]> }
      : T;

export function replaceNullWithUndefined<T>(
  data: T
): ReplaceNullWithUndefined<T> {
  if (data === null) {
    return undefined as ReplaceNullWithUndefined<T>;
  }

  if (Array.isArray(data)) {
    return data.map((item) =>
      replaceNullWithUndefined(item)
    ) as ReplaceNullWithUndefined<T>;
  }

  if (typeof data === 'object' && data !== null) {
    const result: Record<string, ReplaceNullWithUndefined<T>> = {};
    for (const [key, value] of Object.entries(data)) {
      result[key] = replaceNullWithUndefined(value);
    }
    return result as ReplaceNullWithUndefined<T>;
  }

  return data as ReplaceNullWithUndefined<T>;
}
