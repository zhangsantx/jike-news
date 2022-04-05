import React from 'react'
// import routes from './routes/index' // 引入路由规则
// import { useRoutes } from 'react-router-dom'
import IndexRouter from './routes/IndexRouter'
// 引入Provider和store，用于将store精确的传递给每个需要store的组件
import { store, persistor } from './redux/store'
import { Provider } from 'react-redux'

import { PersistGate } from 'redux-persist/integration/react' // redux持久化配置
import './App.css'

export default function App() {
  // const element = useRoutes(routes) // 创建路由

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* 声明路由规则 */}
        {/* {element} */}
        <IndexRouter />
      </PersistGate>
    </Provider>
  )
}
