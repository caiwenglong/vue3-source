import { track, trigger } from "./effect";

export const enum ReactiveFlags {
    IS_REACTIVE = '__v_isReactive' // 是否被代理过的标识
}

// 基本的处理响应式处理逻辑
export const mutableHandlers = {
    get(target, key: string, receiver) {

        // 如果传入的参数是Proxy对象，则直接返回true，无需做任何处理
        if(key === ReactiveFlags.IS_REACTIVE) {
            return true
        }

        // 在get的时候进行依赖收集
        track(target, 'get', key)

        // return target[key]
        // 使用Reflect的目的是为了将对象中的this指向为代理对象，而不是原对象
        return Reflect.get(target, key, receiver);
    },
    set(target, key: string, value, receiver) {
        

        let oldValue = target[key]
        let newValue = Reflect.set(target, key, value, receiver)

        if(oldValue !== newValue) {
            // 在set的时候出发更新
            trigger(target, 'get', key, value, oldValue)
        } 

        return newValue
    }
}