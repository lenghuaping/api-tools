<template>
  <div class="todo-list">
    <div class="list-title">todo list</div>
    <div v-for="todo in list" :key="todo.uuid" class="todo-item">
      <p class="todo-title">{{ todo.title }}</p>
      <p class="todo-desc">{{ todo.desc }}</p>
      <p class="todo-deadline">{{ todo.deadline }}</p>
      <a-button class="todo-finish" @click="handleFinish(todo.uuid)">{{
          todo.status === "NOT_START" ? "开始" : "完成"
        }}
      </a-button>
    </div>
  </div>
</template>

<script lang="ts">
import useStorage from "@/hooks/useSotrage";
import { TodoItem } from "@/util/interface";
import dayjs from "dayjs";
import { onMounted, ref } from "vue";

export default {
  name: "TodoList",

  setup() {
    const list = ref([]);

    onMounted(() => {
      const { todoList } = useStorage();
      const newList = todoList.map((t: TodoItem) => {
        const { deadline, ...restItem } = t;
        return {
          ...restItem,
          deadline: dayjs(deadline).format("YYYY/MM/DD HH:mm:ss")
        };
      });
      list.value = newList;
    });

    const handleFinish = (uuid: string) => {
      console.info(uuid);
    };

    return {
      list,
      handleFinish
    };
  }
};
</script>

<style lang="scss" scoped>
.todo-list {
  //display: flex;
  //flex-direction: column;
  //justify-content: center;
  margin: auto;

  .todo-item {
    display: flex;
    align-items: center;
    color: #1996ff;
    padding: 0 2.5rem;
    margin-bottom: 2.5rem;

    .todo-title {
      flex: 1 0 15%;
      margin: 0;
    }

    .todo-desc {
      flex: 1 0 50%;
      margin: 0;
    }

    .todo-deadline {
      flex: 1 0 25%;
      margin: 0;
    }

    .todo-finish {
      flex: 1 0 10%;
      margin: 0;
    }
  }
}
</style>
