export function resolvePath(parent?: string, child?: string) {
  if (!child) return parent || '/';
  if (child.startsWith('/')) return child;
  return `${parent}/${child}`;
}