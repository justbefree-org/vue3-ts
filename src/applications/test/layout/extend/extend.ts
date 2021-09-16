/*
 * @Author: Just be free
 * @Date:   2021-03-03 15:29:19
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-05-12 15:49:17
 * @E-mail: justbefree@126.com
 */
import "./style/index.scss";
import { BaseLayout, Options } from "@/base";
import { h, VNode } from "vue";
import ParentFun from "@/applications/test/parent";
import { defineAsyncComponent } from "vue";
const Parent = defineAsyncComponent(ParentFun);
@Options({
  name: "Extend",
})
export default class Extend extends BaseLayout {
  public appName = "test";
  test(): void {
    console.log("this is extend test");
  }
  render(): VNode {
    return h(
      "div",
      {},
      {
        default: () => [
          h("h2", {}, "extend examples"),
          h("span", {}, { default: () => [] }),
          h("button", { onClick: this.test }, "click me!"),
          h(Parent, {}, { default: () => [] }),
        ],
      }
    );
  }
}
