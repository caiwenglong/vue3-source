import { isArray, isObject } from "packages/shared/src";
import { createVnode, isVnode } from "./vnode";


/**
 * 创建虚拟节点
 * @param type 标签
 * @param propsChildren 属性
 * @param children children节点
 * 
 * h函数用法：
 * 1、有两个参数
 *      h('h1', '文本') // 第二个参数是文本
 *      h('h1', {style: {color: 'red'}}) // 第二个参数是对象
 *      h('h1', h('h2')) // 第二个参数是对象
 *      h('h1', [h('h2'), h('3')]) // 第二个参数是数组
 * 2、有三个参数
 *      h('h1', {style: {color: 'red'}}， '文本')
 *      h('h1', {style: {color: 'red'}}， h('h2'))
 *      h('h1', {style: {color: 'red'}}， [h('h2'), h('3')])
 * 3、
 *      h('h1', {style: {color: 'red'}}， '文本', '文本', h('h2'))
 */
export function h(type, propsChildren, children) {
    // 获取参数的个数
    let l = arguments.length

    if (l == 2) {
        /**
         * 两个参数的情况：
         *  h('h1', '文本') // 第二个参数是文本
         *  h('h1', {style: {color: 'red'}}) // 第二个参数是对象
         *  h('h1', h('h2')) // 第二个参数是对象
         *  h('h1', [h('h2'), h('3')]) // 第二个参数是数组
         */
        if (isObject(propsChildren) && !isArray(propsChildren)) {
            // 是对象且不是数组 有两种情况 
            // h('h1', {style: {color: 'red'}}) // 第二个参数是对象
            // h('h1', h('h2')) // 第二个参数是对象
            if (isVnode(propsChildren)) {
                // 如果是虚拟节点 就是 h('h1', h('h2')) 这种情况
                return createVnode(type, null, [propsChildren])
            } else {
                // 否则 就是 h('h1', {style: {color: 'red'}}) 这种情况
                return createVnode(type, propsChildren)
            }
        } else {
            // h('h1', '文本') || h('h1', [h('h2'), h('3')])
            return createVnode(type, null, propsChildren)
        }

    } else {
        if (l > 3) {
            // 如果参数大于三个，那么从第三个开始就是children
            children = Array.from(arguments).slice(2)

        } else if (l === 3 && isVnode(children)) {
            // h('h1', {style: {color: 'red'}}， h('h2'))
            children = [children] // 将第三个参数变为数组形式
        }

        return createVnode(type, propsChildren, children)
    }
}