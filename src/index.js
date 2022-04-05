import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter } from 'react-router-dom'
import App from './App'
import reportWebVitals from './reportWebVitals'
import zhCN from 'antd/lib/locale/zh_CN'
import { ConfigProvider } from 'antd'
import './index.css'

ReactDOM.render(
  <HashRouter>
    <ConfigProvider locale={zhCN}>
      {/* <React.StrictMode> */}
      <App />
      {/* </React.StrictMode> */}
    </ConfigProvider>
  </HashRouter>,
  document.getElementById('root')
)

reportWebVitals()
