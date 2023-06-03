import AntVue from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

type TIsCoder = "react" | "jquery" | "vue" | "angular"

interface ICoder {
  name: string;
  proficiency: string;
}

const coder: Record<TIsCoder, ICoder> = {
  // TS2741: Property 'proficiency' is missing in type '{ name: string; }' but required in type 'ICoder'.
  angular: {
    name: 'zhangsan'
  }
}

createApp(App)
  .use(store)
  .use(router)
  .use(AntVue)
  .mount("#app");
