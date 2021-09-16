<template>
  <div class="home">
    <img alt="Vue logo" src="@/assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <pre>
      <p>设置缓存 store.set("user", { name: "zhangsan", age: 20 })</p>
      <p>获取缓存 store.get("user")</p>
      <p>请打开控制台查看</p>
    </pre>
    <Parent />
  </div>
</template>

<script>
// @ is an alias to /src
import { defineAsyncComponent } from "vue";
import HelloWorld from "@/applications/test/hello-world";
import Parent from "@/overwrite/test/parent";
import { default as TestStorage } from "@/applications/test/lib/LocalStore";
const store = new TestStorage("session", "20200821");
console.log(store);
store.set("user", { name: "zhangsan", age: 20 });
console.log(store.get("user"));

export default {
  name: "Home",
  components: {
    Parent: defineAsyncComponent(Parent),
    HelloWorld: defineAsyncComponent(HelloWorld),
  },
};
</script>
