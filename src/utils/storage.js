// 本地存储封装模块（封装本地存储相关方法）

// 获取
export const getItem = (name) => {
  const data = window.localStorage.getItem(name)
  try {
    // data为json格式字符串形式，转换成对象返回
    return JSON.parse(data)
  } catch (error) {
    // data为非json格式字符串形式，直接返回
    return data
  }
}

// 存储
export const setItem = (name, value) => {
  if (typeof value === 'object') {
    // value为对象，转化成json字符串再进行存储
    value = JSON.stringify(value)
  }
  // value为非对象，直接存储
  window.localStorage.setItem(name, value)
}

// 删除
export const removeItem = (name) => {
  window.localStorage.removeItem(name)
}
