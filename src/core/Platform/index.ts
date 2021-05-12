/*
 * @Author: Just be free
 * @Date:   2020-07-22 10:02:44
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-05-11 15:45:08
 * @E-mail: justbefree@126.com
 */
import { createApp } from "vue";
import { Component } from "../types";
import { PlatformConstructorParams } from "./types";
import { default as Application } from "../Application";
const app = new Application();
class Platform {
  private _appStack: Array<Promise<any>>;
  private _App: Component;
  private _id: string;
  constructor(args: PlatformConstructorParams) {
    this._appStack = [];
    this._App = args.App;
    this._id = args.id;
  }
  private getAppStack() {
    return this._appStack;
  }
  private registerApplication(app: Promise<any>): Platform {
    this._appStack.push(app);
    return this;
  }
  public install(appName: string | Array<string>): void {
    if (appName && Array.isArray(appName)) {
      (appName as Array<string>).forEach((name: string) => {
        this.registerApplication(app.register(name));
      });
    } else {
      this.registerApplication(app.register(appName));
    }
  }
  public startUp(): void {
    const apps = this.getAppStack();
    Promise.all(apps).then((res) => {
      console.log(`Platform has started ${res}`);
      const router = app.getRouter();
      const store = app.getStore();
      const i18n = app.getI18n();
      createApp(this._App).use(store).use(router).use(i18n).mount(this._id);
    });
  }
}
export default Platform;
