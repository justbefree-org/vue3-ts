/*
 * @Author: Just be free
 * @Date:   2020-08-06 15:55:08
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-05-12 15:52:53
 * @E-mail: justbefree@126.com
 */

import { mixins } from "vue-class-component";
import { BemParserContext } from "awesome-scss-bem/types";
import BEM, { createBem } from "awesome-scss-bem";
import Super from "@/core/Super";
class Props {}
BEM.config({
  blockPrefix: "",
});
// Define a Application class component
export default class Application extends mixins(Super).with(Props) {
  bem(b: BemParserContext, e?: BemParserContext): string {
    return createBem(b, e);
  }
}
