/**
 * Extracts the first number in a string, and returns it as a number.
 * i.e., 'my string 123' -> 123
 */
export function extractNumber(str: string) {
    const [num] = str.match(/\d+/) || [];

    return Number(num);
}

/**
 * Extracts every number in a string, and returns it as an array of numbers.
 * i.e., 'my string 123 456' -> [123, 456]
 */
export function extractNumbers(str: string) {
    return [...str.matchAll(/\d+/g)].map(match => Number(match[0]));
}
