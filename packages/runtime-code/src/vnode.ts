import { isArray, isObject, isString, ShapeFlags } from "packages/shared/src";

export const Text = Symbol(`Text`)
export const Fragment = Symbol(`Fragment`)

export function createVnode(type, props, children = null) {

    let shapeFlag = isString(type) // 如果传入的是字符串， 就说明是元素
        ? ShapeFlags.ELEMENT
        : isObject(type) // 如果传入的是对象，说明是组件
            ? ShapeFlags.STATEFUL_COMPONENT
            : 0

    const vnode = {
        type, // 也就是标签名
        props, // 属性对象
        children, // 子元素
        key: props?.key,
        __v_isVnode: true,
        shapeFlag, // 定义节点类型
    }

    if (children) {
        let type = 0
        if (isArray(children)) {
            type = ShapeFlags.ARRAY_CHILDREN // 标识儿子是数组
        } else if (isObject(children)) {
            type = ShapeFlags.SLOTS_CHILDREN // 如果children 是对象则说明是带有插槽的
        } else {
            children = String(children)
            type = ShapeFlags.TEXT_CHILDREN
        }
        vnode.shapeFlag |= type // 计算得出这个元素的类型
    }

    return vnode
}

export function isVnode(value) {
    return !!(value && value.__v_isVnode) // 看有没有__v_isVnode 这个属性并转换成布尔值
}

export const isSameVnode = (n1, n2) => {
    return n1.key === n2.key && n1.type === n2.type
}