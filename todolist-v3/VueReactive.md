# 响应式原理

## Vue2.x

在 data 返回对象, vue 将返回对象的数据转为响应式数据

```vue
<template></template>
<script>
export default {
  data() {
    count: 2
  },
}
</script>
```

- [Object.getOwnPropertyDescriptor](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor)

```javascript
// 使用 Object.getOwnPropertyDescriptor() 从 data 对象获取到 count属性(不会从data的原型链上查找)
const property = Object.getOwnPropertyDescriptor(data, 'count');
```

```javascript
// 如果对象被冻结或者封闭,其属性不可配置
const one = { a: 'test' }
const propOne = Object.getOwnPropertyDescriptor(one, 'a')
console.log(propOne.configurable, 1)

const two = { a: 'test' }
Object.freeze(two);
const propTwo = Object.getOwnP· ropertyDescriptor(two, 'a')
console.log(propTwo.configurable, 1)

const three = { a: 'test' }
Object.seal(three)
const propThree = Object.getOwnPropertyDescriptor(three, 'a')
console.log(propThree.configurable, 1)
```

## vue3.x

```javascript
new Proxy({
  get() {
  },
  set() {
  },
})
```