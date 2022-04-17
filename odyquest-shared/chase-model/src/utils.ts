
function getIdString(): string {
  // tslint:disable-next-line:no-bitwise
  const S6 = (((1 + Math.random()) * 0x1000000) | 0).toString(16).substring(1);
  return S6;
}
/**
 * returns an unique id which is not yet part of given list
 */
export function createUniqueId(list: string[]): string {
    let uuid;
    do {
      uuid = getIdString();
    } while (list.includes(uuid));
    return uuid;
}

