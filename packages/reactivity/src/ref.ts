import { isArray, isObject } from "packages/shared/src"
import { trackEffect, triggerEffect } from "./effect"
import { reactive } from "./reactive"

function toReactive(value) {
    // 如果传入的参数是对象，那么就转为proxy对象，如果不是则返回原始值
    return isObject(value) ? reactive(value) : value

}

class RefImpl {
    private _value
    private dep = new Set
    private __v_isRef = true
    constructor(public rawValue) {
        this._value = toReactive(rawValue)
    }

    get value() {

        trackEffect(this.dep) // 取值的时候收集依赖
        return this._value
    }

    set value(newValue) {

        // 如果传入的新值跟原来的值不一致才进行设置，如果跟原来的值一样，则不做处理
        if(this.rawValue !== newValue) {
            this._value = toReactive(newValue)
            this.rawValue = newValue // 赋值完成后，新值就会变成旧值
            triggerEffect(this.dep) // 设置值的时候触发依赖
        }
    }
}

export function ref(value) {
    return new RefImpl(value)
}

export function toRef(object, key) {
    return new ObjectRefImpl(object, key)
}

class ObjectRefImpl {
    constructor(public object, public key) {

    }

    get value() {
        return this.object[this.key]
    }
    set value(newValue) {
        this.object[this.key] = newValue
    }
}

/**
 * 
 * @param object 传入的参数可能数组也可能是对象
 */
export function toRefs(object) {
    
    // 对传入的参数进行拷贝，传入的参数可能是数组也可能是对象
    const result = isArray(object) ? new Array(object.length) : {}
    for(let key in object) {
        result[key] = toRef(object, key)
    }

    console.log(result)

    return result
}