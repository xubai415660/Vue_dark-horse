// 分别导入三个组件，然后分别起一个别名，然后直接导出
export { default as Navbar } from './Navbar'
export { default as Sidebar } from './Sidebar'
export { default as AppMain } from './AppMain'

// ES6模块化导入成员可以起一个别名
// import { default as AppMain } from './AppMain'
// import { default as Navbar } from './Navbar'
// import { default as Sidebar } from './Sidebar'

// export {
//   AppMain,
//   Navbar,
//   Sidebar
// }

// ES6模块化导入本来就支持起一个别名
// import { info as info1 } from 'a.js'
// import { info as info2 } from 'b.js'
