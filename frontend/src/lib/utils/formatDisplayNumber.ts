export function formatDisplayNumber(number: number): string {
  if (number > 1000000000000) {
    return `${(number / 1000000000000).toFixed(1).toString()}T`
  }
  if (number > 1000000000) {
    return `${(number / 1000000000).toFixed(1).toString()}B`
  }
  if (number > 1000000) {
    return `${(number / 1000000).toFixed(1).toString()}M`
  }
  if (number > 1000) {
    return `${(number / 1000).toFixed(1).toString()}K`
  }

  return number.toString()
}
