import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import {
  HomeOutlined,
  TeamOutlined,
  PartitionOutlined,
  NotificationOutlined,
  SoundOutlined,
  SendOutlined,
  LeftOutlined,
  RightOutlined,
  NodeIndexOutlined
} from '@ant-design/icons'
import { getMenuList } from '../../api/right-menu'
import { getItem } from '../../utils/storage'
import { connect } from 'react-redux' // 引入react-redux的connent，用于连接UI组件和redux

const { Sider } = Layout
const { SubMenu } = Menu

// 侧边导航栏
function SideMenu(props) {
  const [menuList, setMenuList] = useState([]) // 侧边菜单栏

  const navigate = useNavigate()
  const location = useLocation()

  const selectKey = location.pathname // 当前选中菜单项
  let openKey = ['/' + location.pathname.split('/')[1]] // 当前展开

  const currentUser = getItem('jikenews') // 获取当前登录用户

  useEffect(() => {
    initMenuList()
  }, [])

  // icons
  const iconList = {
    '/home': <HomeOutlined />,
    '/user-manage': <TeamOutlined />,
    '/right-manage': <PartitionOutlined />,
    '/news-manage': <NotificationOutlined />,
    '/audit-manage': <SoundOutlined />,
    '/publish-manage': <SendOutlined />
  }

  // 获取侧边菜单栏列表
  const initMenuList = async () => {
    const { data } = await getMenuList()
    setMenuList(data)
  }

  // 折叠展开侧边栏
  const toggle = () => {
    props.changeCollapsed()
  }

  // 判断是否需要渲染为菜单列表项
  // pagepermisson === 1 && 当前登录用户的权限列表.icludes(item.key)
  const checkPagePermisssion = (item) => {
    // 获取当前登录用户的权限列表
    const {
      role: { rights }
    } = currentUser

    return item.pagepermisson === 1 && rights.includes(item.key)
  }

  // 渲染menu结构
  const renderMenu = (menuList) => {
    return menuList.map((menu) => {
      // return menu.children && menu.children.length > 0 && checkPagePermisssion(menu) ? (
      return menu.children?.length > 0 && checkPagePermisssion(menu) ? (
        <SubMenu key={menu.key} icon={iconList[menu.key]} title={menu.title}>
          {/* 递归渲染子menu */}
          {renderMenu(menu.children)}
        </SubMenu>
      ) : (
        checkPagePermisssion(menu) && (
          <Menu.Item
            key={menu.key}
            icon={iconList[menu.key]}
            onClick={() => {
              navigate(menu.key)
            }}
          >
            {menu.title}
          </Menu.Item>
        )
      )
    })
  }

  return (
    <Sider theme="light" trigger={null} collapsed={props.isCollapsed} onCollapse={props.changeCollapsed}>
      <Menu className="sider-menu-warp" theme="light" mode="inline" defaultSelectedKeys={selectKey} defaultOpenKeys={openKey}>
        <Menu.Item
          key={'/news'}
          icon={<NodeIndexOutlined />}
          onClick={() => {
            navigate('/news')
          }}
        >
          主站
        </Menu.Item>
        {renderMenu(menuList)}
      </Menu>

      {/* 折叠侧边菜单按钮 */}
      <div className="fold-sider">{props.isCollapsed ? <RightOutlined onClick={toggle} /> : <LeftOutlined onClick={toggle} />}</div>
    </Sider>
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

export default connect(mapStateToProps, mapDispatchToProps)(SideMenu)
