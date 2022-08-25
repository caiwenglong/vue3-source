import { isFunction, isObject } from "packages/shared/src"
import { ReactiveEffect, trackEffect, triggerEffect } from "./effect"

/**
 * 
 * @param arg 传入的参数有两种情况
 * 1. () => {} // 传入是一个function, 那么这就是getter
 * 2. {get(){}, set() {}} // 传入是一个对象，那么这个对象就可能包含getter 和 setter
 */
export const computed = (arg) => {
    let isOnlyGetter = isFunction(arg) // 如果传入的参数是方法，那么这个方式就是getter
    let isObj = isObject(arg)
    let getter
    let setter

    if(isOnlyGetter) {
        // 如果传入的参数是方法，那么这个方法就是getter，setter则设置为空函数
        getter = arg
        setter = () => {}

    } else if(isObj) {
        // 传入是对象
        getter = arg.get
        setter = arg.set
    } else {
        // 传入的是其他类型的参数则报错
        alert('传入的参数有误, 参数只能是Function或者是Object类型')
    }

    return new ComputedRefImpl(getter, setter)
}

class ComputedRefImpl {
    private effect
    private _dirty = true // 默认在取值的时候进行计算
    private __v_isReadonly = true
    private __v_isRef = true
    private _value
    private dep = new Set
    constructor(public getter, public setter) {

        // 将用户的getter 方法放到effect中，（effect的作用就是根据根据属性值的变化来执行用户传入的方法）
        this.effect = new ReactiveEffect(getter, () => {
            // 稍后依赖的属性值变化会执行此调度函数
            console.log('执行了scheduler~~');

            if(!this._dirty) {
                this._dirty = true // 属性值变化了， 那么就将_dirty改为true

                // 实现触发更新操作
                triggerEffect(this.dep)
            }
            
        })
    }

    // 类中的属性访问器，底层就是Object.defineProperty
    get value() {

        // 取值的时候收集依赖
        trackEffect(this.dep)

        if(this._dirty) {
            this._dirty = false
            console.log(2)
            
            this._value = this.effect.run()
        }
        return this._value
    }

    set value(newValue) {
        this.setter(newValue)
    }
}