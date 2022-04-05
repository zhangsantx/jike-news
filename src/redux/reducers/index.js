// 汇总reducer

import { combineReducers } from 'redux' // 引入combineReducers，用于汇总合并reducer

import { Collapsed } from './Collapsed'
import { Loading } from './Loading'

// 汇总合并reducers
export default combineReducers({
  Collapsed,
  Loading
})
