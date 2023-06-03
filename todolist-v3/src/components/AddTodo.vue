<template>
  <div class="home">
    <h1>todo app</h1>
    <div class="todo-form">
      <a-button @click="handleShow">新增</a-button>
      <a-modal
          v-model:visible="visible"
          title="新增"
          @cancel="handleCancel"
          @ok="handleAddTodo"
      >
        <div class="my-form-item">
          <h3>title</h3>
          <a-input v-model:value="todo.title"></a-input>
        </div>
        <div class="my-form-item">
          <h3>desc</h3>
          <a-input v-model:value="todo.desc"></a-input>
        </div>
        <div class="my-form-item">
          <h3>deadline</h3>
          <a-date-picker
              v-model:value="todo.deadline"
              type="date"
          ></a-date-picker>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script lang="ts">
import useStorage from "@/hooks/useSotrage";
import MyStore from "@/util/MyStore";
import { UUID } from "@/util/UUID";
import { message } from "ant-design-vue";
import dayjs from "dayjs";
import { reactive, ref } from "vue";

export default {
  name: "AddTodo",
  setup() {
    const todo = reactive({
      title: "",
      desc: "",
      deadline: undefined
    });

    const { todoList } = useStorage();

    const visible = ref(false);
    const setVisible = (flag: boolean) => {
      visible.value = flag;
    };

    const todoStore = new MyStore();

    const handleClear = () => {
      todo.title = "";
      todo.desc = "";
      todo.deadline = undefined;
    };

    // 显示新增弹窗
    const handleShow = () => {
      setVisible(true);
    };

    // 取消
    const handleCancel = () => {
      handleClear();
      setVisible(false);
    };

    // const title = ref("");
    // const desc = ref("");
    // const deadline = ref(null);

    // 新增
    const handleAddTodo = () => {
      if (!todo.deadline || !todo.desc || !todo.title) {
        message.error("数据不完整");
        return;
      }

      // 是否存在
      const titleExist =
          todoList.findIndex((p: { title: string }) => p.title === todo.title) >
          -1;

      if (titleExist) {
        message.error("这个todo已经存在");
        return;
      }

      const uuid = UUID();
      const newTodo = {
        uuid,
        desc: todo.desc,
        title: todo.title,
        deadline: dayjs(todo.deadline)
            .startOf("days")
            .valueOf(),
        status: 'NOT_START',
      };

      const list = [...todoList, newTodo];

      todoStore.set("TODO_LIST", JSON.stringify(list));
      message.success("添加成功");
      handleCancel();
    };

    return {
      todo,
      visible,
      handleAddTodo,
      handleShow,
      handleCancel
    };
  }
};
</script>

<style lang="scss" scoped>
.home {
  margin: auto;
  width: 80vw;
  text-align: center;

  .todo-form {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      margin: 0;
    }
  }
}

.my-form-item {
  display: flex;
  align-items: center;
  margin: 0 0 16px 0;

  h3 {
    margin: 0 10px 0 0;
  }
}
</style>
