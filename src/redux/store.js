import { createStore } from 'redux'
import reducer from './reducers' // 引入汇总合并的reducer

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

const persistConfig = {
  key: 'jikenews-sider', // 存在localStorage中的key
  storage,
  blacklist: ['Loading'] // 黑名单，不持久化的数据
}

const persistedReducer = persistReducer(persistConfig, reducer)

const store = createStore(persistedReducer)
const persistor = persistStore(store)

export { store, persistor }
