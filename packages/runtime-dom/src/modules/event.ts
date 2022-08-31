function createInvoker(callback) {
    const invoker = (e) => invoker.value(e)
    invoker.value = callback
    return invoker
}

export function patchEvent (el, eventName, nextValue) {
    // _vei (vue event invoker): vue的事件调用，这属性用来记录元素上绑定了哪些事件
    let invokers = el._vei || (el._vei = {})
    let exits = invokers[eventName] // 是否绑定过该事件

    if(exits && nextValue) {
        exits.value = nextValue
    } else {
        let event = eventName.slice(2).toLowerCase()
        if(nextValue) {
            const invoker = (invokers[eventName] = createInvoker(nextValue))
            el.addEventListener(event, invoker)
        } else if (exits) {
            // 绑定过 但是没有新值，则需要移除事件
            el.removeEventListener(event, exits)
            invokers[eventName] = null // 清空相应的事件缓存
          }
    }
}