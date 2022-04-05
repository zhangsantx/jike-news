// 侧边栏折叠
export const Collapsed = (
  prevStae = {
    // 是否折叠
    isCollapsed: false
  },
  action
) => {
  const { type } = action
  const newState = { ...prevStae }
  switch (type) {
    case 'change_ollapsed':
      // 注意：不能直接修改旧状态
      newState.isCollapsed = !newState.isCollapsed
      return newState
    default:
      return prevStae
  }
}
