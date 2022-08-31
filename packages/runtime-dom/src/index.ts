
import { nodeOps } from "./nodeOps";
import { patchProp } from "./patchProp";

// 渲染器渲染的参数
export const renderOptions = Object.assign(nodeOps, { patchProp })