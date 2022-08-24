export const isObject = (value: Object) => {
    return typeof value === "object" && value !== null
}

export const isFunction = (value) => {
    return typeof value === 'function'
}

export const isString = (value) => {
    return typeof value === 'string'
}

export const isNumber = (value) => {
    return typeof value === 'number'
}
