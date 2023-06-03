import MyStore from "@/util/MyStore.ts";

function useStorage() {
  const todoStore = new MyStore();
  const preStore = todoStore.get("TODO_LIST");
  const preList = preStore ? JSON.parse(preStore) : [];

  return {
    todoList: preList
  };
}

export default useStorage
