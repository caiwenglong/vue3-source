import { isObject } from "packages/shared/src";
import { track, trigger } from "./effect";
import { reactive } from "./reactive";

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

        // 使用Reflect的目的是为了将对象中的this指向为代理对象，而不是原对象
        let res = Reflect.get(target, key, receiver)
        if(isObject(res)) {
            return reactive(res); // 深度代理
        }
        return res;
    },
    set(target, key: string, value, receiver) {
        

        let oldValue = target[key]
        let result = Reflect.set(target, key, value, receiver)

        if(oldValue !== value) {
            // 在set的时候出发更新
            trigger(target, 'set', key, value, oldValue)
        } 

        return result
    }
}