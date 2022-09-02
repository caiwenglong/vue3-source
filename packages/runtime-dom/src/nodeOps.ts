// 实现dom节点的增删改查

export const nodeOps = {

    /**
     * 插入节点
     * @param child 要被插入的节点
     * @param parent 这个节点要插入到哪里
     * @param anchor 参照物，如果为null 那么就插入到父节点的最后面，相当于appendChild
     */
    insert(child, parent, anchor = null) {
        parent.insertBefore(child, anchor)
    },


    /**
     * 创建节点
     * @param tagName 节点名称 如 div
     * @returns 返回创建的节点
     */
    createElement(tagName) {
        return document.createElement(tagName)
    },

    /**
     * 创建文本
     * @param text 要创建的文本
     * @returns 返回创建的文本
     */
    createText(text) {
        return document.createTextNode(text)
    },

    /**
     * 修改元素文本
     * @param el 要被修改的元素
     * @param text 新的文本值
     */
    setElementText(el, text) {
        el.textContent = text
    },

    /**
     * 修改文本节点的文本值
     * @param node 文本节点
     * @param text 文本值
     */
    setText(node, text) {
        node.nodeValue = text
    },

    /**
     * 移除节点
     * @param child 要被移除的节点
     */
    remove(child) {
        const parentNode = child.parentNode
        if (parentNode) {
            parentNode.removeChild(child)
        }
    },

    /**
     * 查询元素
     * @param selector 查询条件
     */
    querySelector(selector) {
        document.querySelector(selector)
    },

    /**
     * 获取父节点
     * @param node 被查的节点
     * @returns 
     */
    parentNode(node) {
        return node.parentNode
    },

    /**
     * 获取兄弟节点
     * @param node 被查询的节点
     * @returns 返回兄弟节点
     */
    nextSibling(node) {
        return node.nextSibling
    }


}