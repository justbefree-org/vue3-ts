/*
 * @Author: Just be free
 * @Date:   2021-03-03 16:07:25
 * @Last Modified by:   Just be free
 * @Last Modified time: 2021-03-03 16:07:49
 * @E-mail: justbefree@126.com
 */

export default () =>
  import(/* webpackChunkName: "overwriteParent" */ "./parent").then((res) => {
    return res.default;
  });
