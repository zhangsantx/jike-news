import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout, Dropdown, Menu, Avatar, Tag } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { getItem } from '../../utils/storage'
import { connect } from 'react-redux' // 引入react-redux的connent，用于连接UI组件和redux

const { Header } = Layout

// 顶部导航栏
function TopHeader(props) {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(getItem('jikenews'))

  useEffect(() => {
    initUser()
    const localUser = getItem('jikenews')
    setCurrentUser({ ...localUser })
  }, [currentUser.username])

  // 获取用户信息
  const initUser = () => {
    const localUser = getItem('jikenews')
    setCurrentUser({ ...localUser })
  }

  // 退出登录
  const logOut = () => {
    // 清除token
    localStorage.removeItem('jikenews')
    // 跳转登录页
    navigate('/login')
  }

  const changeCollapsed = () => {
    // // 获取redux state值
    // console.log(props.isCollapsed)

    // 修改redux state值
    props.changeCollapsed()
  }

  const {
    role: { roleName },
    username
  } = currentUser

  // 下拉菜单列表
  const menu = (
    <Menu className="dropdown-menu">
      <Menu.Item key="1">{roleName}</Menu.Item>
      <Menu.Item key="3" danger onClick={logOut}>
        退出登录
      </Menu.Item>
    </Menu>
  )

  return (
    <Header className="site-layout-background">
      {/* logo */}
      <div className="header-logo">
        <img src={require('../../assets/jike-logo.png')} alt="" />
        <Tag
          color="geekblue"
          onClick={() => {
            changeCollapsed()
          }}
        >
          工作台
        </Tag>
      </div>
      {/* user warp */}
      <div className="right-user-warp">
        <span className="hello-user">欢迎回来，{username}</span>
        <Dropdown overlay={menu}>
          <span>
            <Avatar className="user-avator" size="large">
              {username.charAt(0).toUpperCase()}
            </Avatar>
          </span>
        </Dropdown>
      </div>
    </Header>
  )
}

// 定义容器组件
const mapStateToProps = ({ Collapsed: { isCollapsed } }) => {
  return {
    // 获取redux state数据
    isCollapsed
  }
}

const mapDispatchToProps = {
  changeCollapsed() {
    // 获取redux action方法
    return {
      type: 'change_ollapsed'
      // payload:
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopHeader)
