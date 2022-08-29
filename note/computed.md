### computed执行过程拆解
```js

<script>
        const { effect, reactive, computed } = VueReactivity

        const state = reactive({
            firstName: 'cai-',
            lastName: 'yby'
        })
        const fullName = computed({
            get() {
                console.log('run~~');
                return state.firstName + state.lastName
            },
            set(newValue) {
                console.log(newValue)
            }
        })

        console.log(fullName);

        // fullName.value // 通过.value 的方式就可以触发computed的get方法，
        // fullName.value // 如果computed的值没有变化，多次取值就只会执行一次get方法。
        // fullName.value = '111'
        // fullName.value

        // 首先执行这边
        effect(() => {
            console.log('首先执行effect的run方法~~~')
            console.log('run方法会执行传给effect的方法')
            // 
            app.innerHTML = fullName.value
        })

        setTimeout(() => {
            state.lastName = '更新后的name'
        }, 1000)

    </script>

```

```js
/**
 * 1、首先执行computed，computed会创建一个ComputedRefImpl
 *  ，然后执行effect创建一个ReactiveEffect 然后执行这个ReactiveEffect的run方法~~~ 
 *      _effect.run()
 * 2、effect的run方法会调用传给effect的参数方法
 *      return this.fn()
 * 3、this.fn() 就是执行 app.innerHTML = fullName.value
 * 4、这边fullName.value取值就会执行类中的属性访问器 get value()
 * 5、get value() 在取值的时候会进行依赖收集并且执行computed的set 方法：return state.firstName + state.lastName
 * 6、state.firstName 和state.lastName 这两个取值会触发依赖收集，也就是收集这两个属性所依赖的effect
 */
```
