export function optional<T, U>(target: T, player: (it: T) => U): U {
  if (target === null || target === undefined) {
    return null;
  }
  return player(target);
}
