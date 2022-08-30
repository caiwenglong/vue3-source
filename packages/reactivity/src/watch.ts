import { isFunction, isObject } from "packages/shared/src";
import { ReactiveEffect } from "./effect";
import { isReactive } from "./reactive";

function traversal(value, set = new Set()) {
    if(!isObject(value)) return value // 如果不是对象则不用做处理

    // 如果被遍历过的对象，则不用在循环遍历一遍
    if(set.has(value)) {
        return value
    }

    set.add(value) // 如果没有被遍历过，则记录下来
    for (const key in value) { // 遍历对象的所有属性
        traversal(value[key]) // 递归
    }

    return value
}

export function watch(source, cb) {
    let getter
    let oldValue

    
    // 判断传入的参数是否是响应式的，如果是响应式的将他变成一个函数
    if(isReactive(source)) {
        // 对用户传入的参数进行循环访问
        getter = () => traversal(source)
    } else if(isFunction(source)) {
        getter = source
    } else {
        return 
    }

    let cleanup
    const onCleanup = (fn) => {
        cleanup = fn
    }

    // 每次有属性值更新是时候就会调用job方法
    const job = () => {
        if (cleanup) cleanup() // 下一次watch 执行的时候就会触发上一次 watch 的清理
        const newValue = effect.run()
        cb(newValue, oldValue, onCleanup) // 回调函数执行之后，上次的 newValue 应该变成这次的老值
        oldValue = newValue
    }

    // 监控函数内的所有涉及到的属性，当其中有属性值变化的时候执行调度函数，这边也就是job方法
    const effect = new ReactiveEffect(getter, job)


    // 默认调用一次run方法，run方法会返回计算后的值，这个值是初始值
    oldValue = effect.run()
}