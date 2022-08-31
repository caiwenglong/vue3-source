export function patchClass(el, nextValue) {
    if(nextValue == null) {
        // 如果没有传入class，说明class为空，则直接移除class
        el.removeAttribute('class')
    } else {
        el.className = nextValue
    }
}