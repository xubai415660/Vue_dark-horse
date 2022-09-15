# Vue_PC_HR 人资项目

## 一. 准备阶段

1. 使用技术
   - vue2 核心技术
   - element-ui 组件库和 vue-element-admin 后台管理系统前端项目解决方案
   - git 管理
   - vuex 管理数据
   - scss 作为 css 扩展语言
   - axios
   - 模块化管理
2. 初始化项目
   - 拉取基础模板代码 git clone，克隆 vue-admin-template
   - 安装依赖包
   - 启动项目

## 二. 登录模块

1. 使用技术
   - 异步编程
   - vuex 管理数据
   - 组件化开发
   - token 缓存
   - axios 配置拦截器
   - 路由导航守卫
2. 实现流程
   - 登录界面基本布局
   - 实现登录表单验证（通过 el-form 的 model 和 rules 验证表单）
   - 调用接口，提交表单数据，缓存 token 信息，跳转到主页面，实现登录
   - 在 user 的 vuex 模块里封装用于登录的 action 方法，并在登录页面把该方法映射为函数，用于登录请求
   - 基于 vuex 管理 token：在 action 的登录方法中将 token 信息传到 mutations 中，并保存在 state 中
   - 基于第三方包 js-cookie 操作 cookie，封装 token 缓存相关操作（获取，设置，删除）
   - 处理响应拦截器，去掉 axios 返回的数据外面一层的 data
   - 处理路由导航守卫，设置白名单，判断当前是否登录，再判断是否为白名单
3. 问题总结
   - 登录模块，

## 三. 主页模块

1. 使用技术
   - element-ui 单页面开发
   - router 静态路由
   - vuex 信息管理
   - axios
2. 实现流程
   - 结合项目要求，处理 vue-admin-template 的样式布局
   - 调用接口，再请求拦截器中统一设置请求头，将 token 加到请求头中
   - 使用 vuex 存储用户信息，在 veux 的用户信息模块中的 actions 设置函数获取用户信息，并通过 mutations 保存在 state 中。并将相关信息存到 veux 的全局模块的 getters 属性中，方便直接调用（用户名，头像等等）
   - 将登录后的用户信息展示在顶部导航栏右侧，并实现退出登录功能，清除 token，清除用户信息，并跳转到登录页面
   - 设置响应拦截器，验证后端返回代码，判断 token 是否失效，token 失效，删除用户信息，并跳转至登录页面
3. 问题总结
   - 前端解决跨域问题：在 vue.config.js 文件中配置代理，将目标地址代理为不跨域的地址，并修改基准地址为此不跨域的地址。

## 四. 路由配置

1. 使用技术

   - 静态路由和动态路由结合

2. 实现流程

   - 删除基础模板中附带的多余页面并且删除多余的路由配置
   - 搭建业务模块页面
   - 配置模块路由规则
   - 左侧导航菜单是根据路由规则动态渲染出来的。
   - component 标签上可以通过属性绑定给动态组件或者 HTML 标签绑定属性，动态组件的 is 属性值支持原生 HTML 元素，vue 在做属性绑定时，可以一次性通过一个对象绑定多个属性（`v-bind='obj'`）
   - 给侧边栏菜单配置文字和图标，在对应的路由模块中设置即可
   - 拆分路由模块，将每个页面的路由单个封装，并统一保存在 router 文件夹下的 modules 文件夹里面
   - 将动态路由和静态路由暂时合并（因为后期要根据用户的权限决定用户可以访问哪些页面）
   - 给侧边栏添加样式

3. 问题总结

   无

## 五. 组织架构模块

1. 使用技术

   - 组织架构模块主要管理公司所有部门信息，支持添加、删除、编辑操作
   - 作用域插槽
   - 递归算法

2. 实现流程

   - 使用 element-UI 组件布局组织架构的基本布局

   - 使用树形组件，实现组织架构树形展示

   - 拆分树形展示模块，并使用作用域插槽自定义树形展示内容

   - 调用接口获取组织架构数据，并使用递归算法，将此数据转换为树形数据展示到页面上

   - 实现删除部门，封装删除部门接口模块，调用接口，将该部门 id 传入

     实现新增部门，封装新增部门 el-dialog 弹窗，通过父子组件传值控制状态位，实现弹窗关闭显示，在弹窗中布局，使用 element-ui 的表单，实现验证验证，调用接口，上次表单数据，实现新增

   - 实现编辑部门，和新增部门使用一个组件，用户点击编辑部门，传递参数，根据参数，调用接口获取部门数据渲染表单，并编辑，最后提交

3. 问题总结

   - 将普通列表转换为树形结构列

## 六. 角色管理模块

1. 使用技术
   - 实现角色的增删改查
2. 实现流程
   - 实现角色管理组件的布局，卡片组件，选项卡组件用法，表格组件的用法
   - 调用接口获取角色列表
   - 绑定表单数据
   - 使用 ElementUI 提供的分页组件实现分页 el-pagination，动态计算页数索引，调用接口获取一页数据
   - 实现删除功能，调用接口，传入 id 即可
   - 实现角色添加功能：封装添加角色的弹窗，调用接口获取，角色权限，用户输入角色名称，勾选角色权限，提交表单即可
   - 实现编辑角色功能，封装接口，和新增角色使用同一组件，渲染数据，在调用接口发送表单数据。
3. 问题总结

## 七. 员工管理模块

1. 单独封装顶部通用模块，使用具名插槽，实现自定义内容
2. 实现员工列表页面的基本布局和结构，获取员工列表数据，实现加载数据和分页逻辑
3. 将员工列表的数据进行格式化，将后台返回的数据进行格式化，根据数据对应关系，转换为正常的数据
4. 通过 moment 日期处理类库，和 vue 的插件机制，封装一个全局时间过滤器，将时间数据转换为正常数据
5. 实现员工的删除功能，封装接口，绑定事件，添加提示，调用接口删除，刷新列表
6. 新增员工，新建员工弹层组件，控制弹窗的出现和隐藏，进行表单验证绑定数据, 绑定校验，将后台获取的部门信息配合 el-tree 组件进行树状展示，封装接口，注册提交事件，提交表单
7. 员工 excel 批量导入，vue-element-admin 已经提供了上传 Excel 文件的组件，excel 导入功能需要使用 npm 包 xlsx，将导入功能新建一个组件，用户可进行选择文件上传，也可以拖拉文件上传，更改上传的表单的数据为后端要求的格式，调用接口，上传表单数据即可
8. 员工 excel 导出，也是基于 vue-element-admin 实现，使用 file-saver 和 script-loader 包并设置导出表的内容，调用接口获取表单内容，并将其转换为二维数组，实现表单导出

## 八. 员工 详情模块

1. 该模块实现了登录用户密码的修改，和员工个人详情的查看与修改
2. 为该模块配置二级路由，但是不显示到侧边栏
3. 建立基本架构，使用编程式导航$router.push 跳转
4. 修改密码页面：获取用户信息的用户名和密码，并渲染到该模块的表单中，并实现用户修改提交操作
5. 封装个人详情组件，准备模板和数据，然后导入组件并使用
6. 封装岗位组件，获取数据，注册并使用
7. 调用接口，读取和修改个人信息以及岗位信息
8. 将图片资源存到腾讯云，封装图片上传组件，安装 JavaScript SDK，npm i cos-js-sdk-v5，使用 element 的照片墙 picture-card，配置 cos 的身份识别 ID 和身份秘钥，将返回的图片地址保存道表单数据中，以便上传修改操作，实现上传操作
9. 将图片上传组件应用到个人详情页面
10. 实现个人详情的打印，新建打印页面组件，配置路由，调用接口渲染表单，下载 并使用 vue-print-nb 插件，给要打印的盒子指定 id，id="printbox"，使用 v-print 指令的方式进行打印(指定 id 是 printbox 的容器被打印) v-print="{ id: 'printbox' }"

English | [简体中文](./README-zh.md)

> A minimal vue admin template with Element UI & axios & iconfont & permission control & lint

**Live demo:** http://panjiachen.github.io/vue-admin-template

**The current version is `v4.0+` build on `vue-cli`. If you want to use the old version , you can switch branch to [tag/3.11.0](https://github.com/PanJiaChen/vue-admin-template/tree/tag/3.11.0), it does not rely on `vue-cli`**

## Build Setup

```bash
# clone the project
git clone https://github.com/PanJiaChen/vue-admin-template.git

# enter the project directory
cd vue-admin-template

# install dependency
npm install

# develop
npm run dev
```

This will automatically open http://localhost:9528

## Build

```bash
# build for test environment
npm run build:stage

# build for production environment
npm run build:prod
```

## Advanced

```bash
# preview the release environment effect
npm run preview

# preview the release environment effect + static resource analysis
npm run preview -- --report

# code format check
npm run lint

# code format check and auto fix
npm run lint -- --fix
```

Refer to [Documentation](https://panjiachen.github.io/vue-element-admin-site/guide/essentials/deploy.html) for more information

## Demo

![demo](https://github.com/PanJiaChen/PanJiaChen.github.io/blob/master/images/demo.gif)

## Extra

If you want router permission && generate menu by user roles , you can use this branch [permission-control](https://github.com/PanJiaChen/vue-admin-template/tree/permission-control)

For `typescript` version, you can use [vue-typescript-admin-template](https://github.com/Armour/vue-typescript-admin-template) (Credits: [@Armour](https://github.com/Armour))

## Related Project

- [vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)

- [electron-vue-admin](https://github.com/PanJiaChen/electron-vue-admin)

- [vue-typescript-admin-template](https://github.com/Armour/vue-typescript-admin-template)

- [awesome-project](https://github.com/PanJiaChen/vue-element-admin/issues/2312)

## Browsers support

Modern browsers and Internet Explorer 10+.

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IE10, IE11, Edge                                                                                                                                                                                                | last 2 versions                                                                                                                                                                                                   | last 2 versions                                                                                                                                                                                               | last 2 versions                                                                                                                                                                                               |

## License

[MIT](https://github.com/PanJiaChen/vue-admin-template/blob/master/LICENSE) license.

Copyright (c) 2017-present PanJiaChen
