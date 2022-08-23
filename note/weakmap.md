### WeakMap
- WeakMap 的Key只能是对象
- WeakMap 不会导致内存泄漏，更容易被清理
- WeakMap 不支持迭代以及 keys()，values() 和 entries() 方法。所以没有办法获取 WeakMap 的所有键或值。
- WeakMap 只有以下的方法：weakMap.get(key)、weakMap.set(key, value)、weakMap.delete(key)、weakMap.has(key)

> 所以 WeakMap 的主要优点是它们对对象是弱引用，被它们引用的对象很容易地被垃圾收集器移除。但这是以不支持一些对象方法为代价换来的~

#### 代码说明
```js
let john = { name: "John" };

let array = [ john ];

john = null; // 覆盖引用

console.log(array[0]) // {name: 'John'}

// 我们声明了一个 john 对象，然后在数组里面引用了它，然后再尝试清空它， john = null，然后再访问：array[0]，结果发现，仍然能成功打印

// 这说明 array 对 对象 john 的引用，导致内存无法正常清理
// WeakMap 就是来解决这个问题的：
``` 

```js

// map
let john1 = { name: "John" }; 
let map = new Map(); 
map.set(john1, "11");
john1 = null; // 覆盖引用
console.log(map.get(john)) // undefined
console.log(map.keys())

// john 被存储在了 map 中，
// 我们仍可以使用 map.keys() 来获取它

```

```js
// WeakMap
let john = { name: "John" };
let weakMap = new WeakMap();
weakMap.set(john, "...");
john = null; // 覆盖引用
console.log(weakMap.get(john)) // undefined

// WeakMap 中使用一个对象作为键，并且没有其他对这个对象的引用 —— 该对象将会被从内存（和map）中自动清除。

```