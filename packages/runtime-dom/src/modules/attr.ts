export function patchAttr (el, key, nextValue) {
    // 如果有传入属性值，那么就直接给属性赋值
    if(nextValue) {
        el.setAttribute(key, nextValue)
    } else {
        // 如果没有传入属性值，说明这个属性值为空，则直接移除
        el.removeAttribute(key)
    }
}