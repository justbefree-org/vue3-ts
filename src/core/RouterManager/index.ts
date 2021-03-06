/*
 * @Author: Just be free
 * @Date:   2020-07-22 15:40:12
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-05-11 11:37:27
 * @E-mail: justbefree@126.com
 */
import { loadComponent } from "../utils/load";
import { RouteRecordRaw } from "vue-router";
class RouterManager {
  private baseDir: string;
  private routes: Array<RouteRecordRaw>;
  private nameSpace: string;
  constructor(baseDir: string, nameSpace?: string) {
    this.baseDir = baseDir;
    this.routes = [];
    this.nameSpace = nameSpace ? nameSpace : "";
  }
  private getBaseDir(): string {
    return this.baseDir;
  }
  private pushRoutes(route: RouteRecordRaw) {
    this.routes.push(route);
  }
  public getRoutes(): Array<RouteRecordRaw> {
    return this.routes;
  }
  register(routes: Array<any> = []) {
    routes.forEach((route) => {
      if (route.path.startsWith("/") && this.nameSpace !== "") {
        route.path = `/${this.nameSpace}${route.path}`;
      }
      if (
        route.redirect &&
        route.redirect.startsWith("/") &&
        this.nameSpace !== ""
      ) {
        route.redirect = `/${this.nameSpace}${route.redirect}`;
      }
      if (route.pathName) {
        const path = `${this.getBaseDir()}/${route.pathName}`;
        route.component = loadComponent(path);
        delete route.pathName;
        if (route.children && route.children.length > 0) {
          this.register(route.children);
        }
      }
      // 注册一级路由，以及404页面
      if (route.path.startsWith("/") || route.path === "*") {
        this.pushRoutes(route);
      }
    });
  }
}
export default RouterManager;
