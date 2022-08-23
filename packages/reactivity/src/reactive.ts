import { isObject } from "@vue/shared";
import { mutableHandlers, ReactiveFlags } from "./baseHandler";

// 用来缓存被代理过的对象， 防止一个对象被多次代理
const reactiveWeakMap = new WeakMap(); 

export function reactive(target: any) {

    // 判断一下传入的参数是否是一个对象，如果传入的参数不是一个对象，则直接返回
    if(!isObject(target)) {
        return 
    }

    // 判断一下传入的对象是否被代理过，如果被代理过直接返回被代理的proxy对象
    const exitingProxy = reactiveWeakMap.get(target);
    if(exitingProxy) {
        return exitingProxy
    }

    /**
     * 判断一下传入的对象是否是Proxy对象，如果是 Porxy对象，则不需要处理直接返回参数target
     * 如果参数传入的对象是Proxy对象，则target[ReactiveFlags.IS_REACTIVE]就相当于访问了Proxy的get方法
     * 这事会触发Proxy的get() 方法，则在get() 的方法中不应该做任何处理，应直接返回true
     */
    if(target[ReactiveFlags.IS_REACTIVE]) {
        return target
    }

    const proxy = new Proxy(target, mutableHandlers)

    // 将原对象，跟被代理过的对象对应，缓存起来
    reactiveWeakMap.set(target, proxy);

    return proxy
}