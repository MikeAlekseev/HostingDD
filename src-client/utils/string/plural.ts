export function plural(num: number, oneKey: string, twoKey: string, polyKey: string) {
    const units = num % 10
    const tens = Math.floor(num / 10)

    if (units === 1 && tens !== 1) {
        return `${num} ${oneKey}`
    }

    if (2 <= units && units <= 4 && tens !== 1) {
        return `${num} ${twoKey}`
    }

    return `${num} ${polyKey}`
}
