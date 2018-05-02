/**
 * @description 事件绑定，兼容各浏览器
 * @param target
 * 事件触发对象
 * @param type
 * 事件
 * @param func
 * 事件处理函数
 * @N
 */
export function addEvent(target, type, func, boolean) {
    var bln = boolean || false; //是否捕获事件
    if (target.addEventListener) {
        target.addEventListener(type, func, bln);
    } else if (target.attachEvent) {
        target.attachEvent('on' + type, func);
    } else {
        target["on" + type] = func;
    }
}

/**
 * @description 事件移除，兼容各浏览器
 * @param target
 * 事件触发对象
 * @param type
 * 事件
 * @param func
 * 事件处理函数
 * @N
 */
export function removeEvent(target, type, func, boolean) {
    var bln = boolean || false;
    if (target.removeEventListener) {
        target.removeEventListener(type, func, bln);
    } else if (target.detachEvent) {
        target.detachEvent('on' + type, func);
    } else {
        target["on" + type] = null;
    }
}
