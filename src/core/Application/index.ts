/*
 * @Author: Just be free
 * @Date:   2020-07-22 13:36:56
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-05-11 17:44:19
 * @E-mail: justbefree@126.com
 */
declare let require: any;
import { StoreOptions } from "vuex/types";
import { default as StoreManager } from "../StoreManager";
import { ApplicationObject } from "./types";
import { AnyObject } from "../types";
import { RouteRecordRaw } from "vue-router";
import { getEnvironment } from "@/config";
const debug = getEnvironment() !== "production";
import { loadApplication } from "../utils/load";
import { hasProperty, camelize } from "../utils";
import { createStore } from "vuex";
import { createRouter, createWebHistory } from "vue-router";
import { createI18n } from "vue-i18n";

class Application {
  private _store: StoreOptions<any>;
  private _applications: Array<ApplicationObject>;
  private _routes: Array<RouteRecordRaw>;
  private _messages: AnyObject;
  constructor() {
    this._applications = [];
    this._store = {};
    this._routes = [];
    this._messages = {};
  }

  private processingModule(name: string, StoreArr: StoreManager[] = []): void {
    const store: Record<string, any> = {
      state: {},
      actions: {},
      mutations: {},
      getters: {},
      strict: debug,
    };
    const modules: Record<string, any> = { ...this.getModules() };
    StoreArr.forEach((s) => {
      if (!hasProperty(modules, name)) {
        modules[name] = {};
      }
      modules[name]["namespaced"] = true;
      modules[name]["state"] = { ...modules[name]["state"], ...s.getState() };
      modules[name]["mutations"] = {
        ...modules[name]["mutations"],
        ...s.getMutation(),
      };
      modules[name]["actions"] = {
        ...modules[name]["actions"],
        ...s.getAction(),
      };
      modules[name]["getters"] = {
        ...modules[name]["getters"],
        ...s.getGetters(),
      };
    });
    console.log(`The ${name} module has been registered`);
    store["modules"] = modules;
    this._store = store;
  }
  private getStoreObject(): StoreOptions<any> {
    return this._store;
  }
  private addApplication(application: ApplicationObject): void {
    this._applications.push(application);
  }

  private setRoutes(routes: Array<RouteRecordRaw>): void {
    this._routes = routes;
  }
  private getRoutes(): Array<RouteRecordRaw> {
    return this._routes;
  }

  private processingMessages(appName: string, i18n: AnyObject): void {
    Object.keys(i18n).forEach((key) => {
      const path: string = key.replace(/\.locale.*.lang/, "");
      const lang: string = key.replace(/\S+(locale.)(\S+)(.lang)$/, "$2");
      const pathArr = path.split(".");
      if (!hasProperty(this._messages, lang)) {
        this._messages[lang] = {};
      }
      if (!hasProperty(this._messages[lang], appName)) {
        this._messages[lang][appName] = {};
      }
      const componentName = pathArr[pathArr.length - 1];
      this._messages[lang][appName][camelize(componentName, true)] = i18n[key];
    });
  }

  private getMessages(): AnyObject {
    return this._messages;
  }

  public register(applicationName: string): Promise<any> {
    if (!applicationName) {
      return Promise.reject("Application name is required!");
    }
    return loadApplication(applicationName)
      .then((module) => {
        let application = {} as ApplicationObject;
        if (module && Array.isArray(module)) {
          const parentApplication = module[0].default;
          const childApplication = module[1].default;
          application = {
            i18n: { ...parentApplication.i18n, ...childApplication.i18n },
            name: parentApplication.name,
            routes: [...parentApplication.routes, ...childApplication.routes],
          };
        } else {
          application = module.default;
        }
        this.registerStore(application.name);
        this.addApplication(application);
        this.processingMessages(application.name, application.i18n);
        const routes = [...this.getRoutes(), ...application.routes];
        this.setRoutes(routes);
        return Promise.resolve(application);
      })
      .catch((err) => {
        console.log("load plugin fail ", err);
        return Promise.reject(err);
      });
  }

  private registerStore(moduleName: string): void {
    const name: string = moduleName.toLocaleLowerCase();
    try {
      const parentModuleStore: StoreManager[] =
        require(`@/applications/${moduleName}/store/index.ts`)["default"];
      const childModuleStore: StoreManager[] =
        require(`@/overwrite/${moduleName}/store/index.ts`)["default"];
      this.processingModule(name, [...parentModuleStore, ...childModuleStore]);
    } catch (err) {
      try {
        const moduleStore: StoreManager[] =
          require(`@/applications/${moduleName}/store/index.ts`)["default"];
        this.processingModule(name, moduleStore);
      } catch (err) {
        const moduleStore: StoreManager[] =
          require(`@/overwrite/${moduleName}/store/index.ts`)["default"];
        console.log("overwrite module", moduleStore);
        this.processingModule(name, moduleStore);
      }
    }
  }

  public getStore() {
    const store = this.getStoreObject();
    return createStore({
      ...store,
    });
  }

  private getModules() {
    return this._store.modules || {};
  }

  public getRouter() {
    const routes = this.getRoutes();
    return createRouter({ history: createWebHistory(), routes });
  }

  public getI18n() {
    const messages = this.getMessages();
    return createI18n({
      locale: "zh-CN",
      messages,
      fallbackLocale: "zh-CN",
    });
  }
}

export default Application;
