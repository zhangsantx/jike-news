// 全局请求loading
export const Loading = (
  prevStae = {
    // 是否loading
    isLoading: false
  },
  action
) => {
  const { type, payload } = action
  const newState = { ...prevStae }
  switch (type) {
    case 'change_loading':
      // 注意：不能直接修改旧状态
      newState.isLoading = payload
      return newState
    default:
      return prevStae
  }
}
