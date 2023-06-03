<template>
  <div class="hello">
    <div>{{ data.count }}</div>

    <button @click="data.increase">increase</button>
    <button @click="data.diminish">increase</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch } from "vue";

export default defineComponent({
  name: "HelloWorld",
  setup() {
    const title = ref("title");
    // reactive 将相关的属性封装，便于维护
    const data = reactive({
      count: 0,
      increase: () => {
        data.count++;
      },
      diminish: () => {
        data.count--;
      }
    });

    watch([() => data.count, () => title.value], () => {
      // title.value = title.value + title.value;
      document.title = `${title.value} - ${data.count}`;
    });
    // vue2.x Object.freeze(data); Object.seal(data);
    // vue3.x Object.freeze(data);
    // 可以使用结构语法将data对象直接暴露给模板，但是要使用 toRefs 包装，否则会失去响应式
    return {
      data
    };
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
