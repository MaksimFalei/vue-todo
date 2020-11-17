import _capitalize from 'lodash/capitalize';
export function capitalize(val) {
  return val
    .split(" ")
    .map((s) => _capitalize(s))
    .join(" ");
}
