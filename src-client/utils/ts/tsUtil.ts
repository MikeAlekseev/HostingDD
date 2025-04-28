export function filterNonNullable<TValue>(value: TValue | null | undefined): value is NonNullable<TValue> {
    return value !== null && value !== undefined
}
