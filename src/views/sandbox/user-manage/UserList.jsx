import React, { useState, useEffect, useRef } from 'react'
import { Table, Button, Modal, Switch, message } from 'antd'
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import UserForm from '../../../components/user-manage/UserForm'
import { getUserList, addUser, deleteUser, updateUser } from '../../../api/user'
import { getRegionList } from '../../../api/region'
import { getRoleList } from '../../../api/role'
import { getItem } from '../../../utils/storage'

const { confirm } = Modal

// 用户列表
export default function UserList() {
  const [userList, setUserList] = useState([]) // 用户数据列表
  const [isTableLoading, setIsTableLoading] = useState(false) // 表格loading
  const [isShowAdd, setIsShowAdd] = useState(false) // 控制添加用户对话框的显示与隐藏
  const [isAddLoading, setIsAddLoading] = useState(false) // 添加用户对话框loading
  const [isShowEdit, setIsShowEdit] = useState(false) // 控制修改用户对话框的显示与隐藏
  const [isEditLoading, setIsEditLoading] = useState(false) // 修改用户对话框loading
  const [roleList, setRoleList] = useState([]) // 角色列表
  const [regionList, setRegionList] = useState([]) // 区域列表
  const [isStateLoading, setIsStateLoading] = useState(false) // 用户状态loading
  const [isDisableRegion, setIsDisableRegion] = useState(false) // 是否禁用区域选择
  const [currentEditUser, setCurrentEditUser] = useState(null)

  const addForm = useRef(null) // 添加用户表单
  const updateForm = useRef(null) // 修改用户表单

  const currentUser = getItem('jikenews') // 当前登录用户
  // 获取当前登录用户名、用户类型(roleId 1-超级管理员 2-区域管理员 3-区域编辑)和所属区域、用户id
  const { username, roleId, region, id } = currentUser

  useEffect(() => {
    // 获取用户列表
    const initUserList = async () => {
      const { data } = await getUserList()

      // 判断当前登录用户类型提供不同的用户列表
      setUserList(
        // 超级管理员，提供所有用户
        roleId === 1
          ? data
          : [
              // 区域管理员，提供用户自已和所属区域的所有区域编辑（roleId === 3）
              ...data.filter((item) => item.username === username),
              ...data.filter((item) => item.region === region && item.roleId === 3)
            ]
      )
    }
    initUserList()

    initRegionList()
    initRoleList()
  }, [region, roleId, username])

  // 表头
  const columns = [
    {
      title: '所属区域',
      dataIndex: 'region',
      render: (region) => {
        return region === '' ? '全球' : region
      },
      filters:
        // 当登录用户为超级管理员（roleId === 1）时提供所有区域，区域管理员仅提供自己所在区域
        currentUser.role.roleId === 1
          ? [
              ...regionList.map((item) => ({
                text: item.title,
                value: item.value
              })),
              {
                text: '全球',
                value: ''
              }
            ]
          : [{ text: currentUser.region, value: currentUser.region }],
      onFilter: (value, item) => item.region === value
    },
    {
      title: '用户类型',
      dataIndex: 'role',
      render: (role) => {
        return role.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username'
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, user) => {
        return (
          <Switch
            checked={roleState}
            disabled={user.default}
            loading={isStateLoading}
            onChange={() => {
              onStateChange(user)
            }}
          ></Switch>
        )
      }
    },
    {
      title: '操作',
      render: (user) => (
        <>
          {/* disabled={user.default} 当用户为默认用户时禁用编辑 */}
          <Button shape="circle" style={{ marginRight: 10 }} icon={<EditOutlined />} disabled={user.default} onClick={() => onEdit(user)} />
          {/* disabled={user.default || user.id === id} 当用户为默认用户或当前登录用户时禁用删除 */}
          <Button danger shape="circle" icon={<DeleteOutlined />} disabled={user.default || user.id === id} onClick={() => onDelete(user)} />
        </>
      )
    }
  ]

  // 获取区域列表
  const initRegionList = async () => {
    const { data } = await getRegionList()
    setRegionList(data)
  }

  // 获取角色列表
  const initRoleList = async () => {
    const { data } = await getRoleList()
    setRoleList(data)
  }

  // 添加用户
  const onAddUser = () => {
    // 获取验证通过的表单的值
    addForm.current
      .validateFields()
      .then(async (value) => {
        // 验证通过
        // value 表单数据
        // 开启loading
        setIsAddLoading(true)

        try {
          // 服务器添加
          const data = await addUser({
            ...value,
            roleState: true,
            default: false
          })

          // 添加本地
          setUserList([
            ...userList,
            {
              ...data.data,
              role: roleList.filter((item) => item.id === data.data.roleId)[0]
            }
          ])

          if (data.status === 201) {
            message.success('添加成功')
            // 关闭对话框
            setIsShowAdd(false)
            // 清空form表单
            addForm.current.resetFields()
          } else {
            message.error('添加失败，请稍后重试')
          }
          // 关闭loading
          setIsAddLoading(false)
        } catch (error) {
          message.error('网络错误，请稍后重试')
          // 关闭loading
          setIsAddLoading(false)
        }
      })
      .catch((err) => {})
  }

  // 点击删除回调
  const onDelete = (user) => {
    confirm({
      title: '确定要删除此用户吗',
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        onDeleteRole(user)
      },
      onCancel() {}
    })
  }

  // 删除用户
  const onDeleteRole = async (user) => {
    // 开启loading
    setIsTableLoading(true)

    try {
      // 删除本地
      setUserList(userList.filter((data) => data.id !== user.id))
      // 删除服务器
      const data = await deleteUser(user.id)

      if (data.status === 200) {
        message.success('删除成功')
      } else {
        message.error('删除失败，请稍后重试')
      }
    } catch (error) {
      message.error('网络错误，请稍后重试')
      // 关闭loading
      setIsTableLoading(false)
    }
    // 关闭loading
    setIsTableLoading(false)
  }

  // 切换用户状态
  const onStateChange = async (user) => {
    // 开启loading
    setIsStateLoading(true)

    try {
      // 修改本地
      user.roleState = !user.roleState
      setUserList([...userList])
      // 修改服务器
      const data = await updateUser(user.id, { roleState: user.roleState })
      if (data.status === 200) {
        data.data.roleState ? message.success('已开启') : message.warn('已关闭')
      } else {
        message.error('操作失败，请稍后重试')
      }
    } catch (error) {
      message.error('网络错误，请稍后重试')
      // 关闭loading
      setIsTableLoading(false)
    }
    // 关闭loading
    setIsStateLoading(false)
  }

  // 点击修改回调
  const onEdit = (user) => {
    // 打开对话框并设置表单值
    // 注意：react更新是异步的，对话框刚显示里面的表单可能还未渲染完成，可能获取不到，需要改成同步状态，将其包裹在异步里即可，类似于vue的$nextTick
    setIsShowEdit(true)
    setCurrentEditUser(user)
    setTimeout(() => {
      // console.log(updateForm.current)
      // 当角色为超级管理员式禁用区域选择
      if (user.roleId === 1) {
        // 禁用
        setIsDisableRegion(true)
      } else {
        // 取消禁用
        setIsDisableRegion(false)
      }
      // 设置表单内容
      updateForm.current.setFieldsValue(user)
    }, 0)
  }

  // 修改用户
  const onUpdateUser = () => {
    // 获取验证通过的表单的值
    updateForm.current
      .validateFields()
      .then(async (value) => {
        // 验证通过
        // value 表单数据
        // 开启loading
        setIsEditLoading(true)

        try {
          // 添加本地
          setUserList(
            userList.map((item) => {
              if (item.id === currentEditUser.id) {
                return {
                  ...item,
                  ...value,
                  role: roleList.filter((data) => data.id === value.roleId)[0]
                }
              } else {
                return item
              }
            })
          )
          // 服务器修改
          const data = await updateUser(currentEditUser.id, value)
          if (data.status === 200) {
            message.success('修改成功')
            // 关闭对话框
            setIsShowEdit(false)
            // 清空form表单
            updateForm.current.resetFields()
          } else {
            message.error('修改失败，请稍后重试')
          }
          // 关闭loading
          setIsEditLoading(false)
        } catch (error) {
          console.log(error)
          message.error('网络错误，请稍后重试')
          // 关闭loading
          setIsEditLoading(false)
        }
        // 关闭loading
        setIsEditLoading(false)
      })
      .catch((err) => {})
  }

  return (
    <div>
      {/* 添加用户 */}
      <Button
        type="primary"
        style={{ marginBottom: 20 }}
        onClick={() => {
          setIsShowAdd(true)
        }}
      >
        添加用户
      </Button>

      {/* 数据展示表格 */}
      <Table
        dataSource={userList}
        columns={columns}
        rowKey={(Item) => Item.id}
        bordered={false}
        loading={isTableLoading}
        pagination={{
          pageSize: 10
        }}
      />

      {/* 添加用户弹出对话框 */}
      <Modal
        visible={isShowAdd}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        confirmLoading={isAddLoading}
        destroyOnClose={true}
        onCancel={() => {
          setIsShowAdd(false)
        }}
        onOk={() => {
          onAddUser()
        }}
      >
        {/* 用户表单 */}
        <UserForm ref={addForm} regionList={regionList} roleList={roleList} />
      </Modal>

      {/* 修改用户弹出对话框 */}
      <Modal
        visible={isShowEdit}
        title="修改用户"
        okText="保存"
        cancelText="取消"
        confirmLoading={isEditLoading}
        destroyOnClose={true}
        onCancel={() => {
          setIsShowEdit(false)
        }}
        onOk={() => {
          onUpdateUser()
        }}
      >
        {/* 用户表单 */}
        <UserForm ref={updateForm} regionList={regionList} roleList={roleList} isDisableRegion={isDisableRegion} isUpdate={true} />
      </Modal>
    </div>
  )
}
