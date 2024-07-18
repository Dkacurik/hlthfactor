
const decimalToFraction = (decimal: number): string => {
    if (decimal.toString().indexOf('.') > -1) {
      let numerator = decimal * 100
      let denominator = 100

      // Simplify fraction
      let gcd = function (a: number, b: number): number {
        return b ? gcd(b, a % b) : a
      }
      let divisor = gcd(numerator, denominator)

      numerator /= divisor
      denominator /= divisor

      return numerator + '/' + denominator
    }
    return decimal.toString()
}


  const formatOutput = (text: string): string => {
    if (text.includes('pl') || text.includes('čl')) {
      const tmp = text.split('-')
      return `1 ks - ${tmp[1]}`
    }
    const splitText = text.split(' ')
    const quantity = splitText[0]
    let hasDecimal = quantity.includes('.')
    const ceil = Math.ceil(parseFloat(quantity))
    return `${ceil} ${splitText.slice(1).join(' ')}`
  }
  
export { decimalToFraction, formatOutput }