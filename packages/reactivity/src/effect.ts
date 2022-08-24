
export let activeEffect = undefined // 当前正在运行的effect实例

/**
 * effect可以嵌套执行
 * 例如：
 *  effect(() => {
 *      effect(() => {})
 *  })
 * 参数fn 会根据对象属性的变化重新执行
 * @param fn 
 */
export function effect(fn, option: any = {}) {
    const _effect = new ReactiveEffect(fn, option.scheduler) // 创建响应式的effect
    _effect.run() // 默认先执行一次

    const runner = _effect.run.bind(_effect) // 将this绑定为_effect
    runner.effect = _effect // 将effect 挂在到runner 函数上
    return runner
}

/**
 * 这个类的目的是为了让属性改变时，让函数重新执行
 */
export class ReactiveEffect {

    /**
     * effect(() => { // 最外层effect（e1）的parent 是null，
     *      data.name   // 属性name对应的 effect 是 e1
     *      effect(() => { // 这个effect(e2) 的parent 是 e1
     *          data.age // 属性age对应的 effect 是 e2，当这边执行完之后，e2的active属性就会被设置为false
     *      })
     *      data.address  // 这边属性address 对应的effect 退回到 e1
     * })
     */
    parent = null // 这个属性是为了记载当前执行effect的父级，如果不为null, 说明effect是嵌套执行的

    deps = [] // 这个属性用来记录当前effect依赖了哪些属性值

    active = true // 这个属性表示这个effect是激活状态，也就是可以执行状态

    // 使用public修饰符，相当于将参数挂载到该对象上，也就是相对于 this.fn = fn
    constructor(public fn, public scheduler) {}

    run() {
        // 如果是非激活状态，那么只需要执行函数即可，不需要进行以来收集
        if(!this.active) {
            this.fn()
        }

        // 如果是激活状态，那么就要进行依赖收集
        try{
            this.parent = activeEffect // 记录父级执行的effect
           activeEffect = this // 如果这个effect是激活状态，那么久将this赋值给activeEffect

           
           clearUpEffect(this) // 在执行用户函数之前，需要先清空之前收集的内容

           return this.fn() // 这边调用fn方法就会执行到proxy的get的方法
        }finally {
            activeEffect = this.parent // 运行结束之后退回父级的effect
        }
    }

    stop() {
        if(this.active) {
            this.active = false
            clearUpEffect(this)
        }
    }

}

function clearUpEffect(effect) {
    const { deps } = effect // deps 里面装的是属性对应的effect
    for(let i = 0; i < deps.length; i++) {
        deps[i].delete(effect)
    }
    effect.deps.length = 0
}

const targetMap = new WeakMap();
/**
 * 依赖收集
 * 一个对象的某个属性可能对应这多个effect
 * 因此我们需要构建出一个结构为{对象：Map(name: Set())}
 * @param target 源对象
 * @param type get | set
 * @param key 属性
 * @returns 
 */
export function track(target, type, key) {
    if(!activeEffect) return 

    // 首先判断这个对象有没有被依赖收集过
    let depsMap = targetMap.get(target)
    if(!depsMap) {
        // 如果没有被收集，则添加到集合里面
        targetMap.set(target, (depsMap = new Map()))
    }

    // 在判断这个对象的属性有没有被收集过
    let dep = depsMap.get(key)
    if(!dep) {
        depsMap.set(key, (dep = new Set()))
    }
    let shouldTrack = !dep.has(activeEffect)
    if(shouldTrack) {
        dep.add(activeEffect) // 如果没有被收集过，则添加到依赖收集里面，一个属性对应多个effect

        // 一个effect对应多个属性
        // deps存放的是属性对应的Set
        // effect记住对应的dep，之后清理的时候会用到
        // 这边不存属性而是直接存属性的对应的set，是因为之后清理的是对属性依赖的effect，而不是属性
        // 如果存属性，那么还是要通过属性来查找对应的effect
        activeEffect.deps.push(dep) 
    }

}

export function trigger(target, type, key, value, oldValue) {
    const depsMap = targetMap.get(target);
    if(!depsMap) return; 

    let effects = depsMap.get(key);
    if(effects) {
        // 在执行之前先拷贝一份来执行，不要关联引用
        effects = new Set(effects) // 拷贝一份
        effects.forEach(effect => {
            // 如果有effect在执行，之后在调用effect，需要屏蔽掉，否则会出现死循环
            if(effect !== activeEffect) {
                if(effect.scheduler) {
                    effect.scheduler() // 如果用户传入了scheduler, 则执行用户自定义的调度器
                } else {
                    effect.run() // 否则使用默认的run方法刷新试图
                }
            }
        });
    }

}