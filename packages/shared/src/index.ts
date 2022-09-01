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


export const isArray = Array.isArray


export const enum ShapeFlags { // vue3提供的形状标识
    ELEMENT = 1, // 元素
    FUNCTIONAL_COMPONENT = 1 << 1, // 函数组件
    STATEFUL_COMPONENT = 1 << 2,
    TEXT_CHILDREN = 1 << 3, // children 是文本
    ARRAY_CHILDREN = 1 << 4, // children 是数组
    SLOTS_CHILDREN = 1 << 5,
    TELEPORT = 1 << 6,
    SUSPENSE = 1 << 7,
    COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8,
    COMPONENT_KEPT_ALIVE = 1 << 9,
    COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT
  }