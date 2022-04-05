import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, message, Tree } from 'antd'
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { getRoleList, deleteRole, updateRoleLimits } from '../../../api/role'
import { getLimits } from '../../../api/authority'

const { confirm } = Modal

// 角色列表
export default function RoleList() {
  const [dataSource, setDataSource] = useState([]) // 角色数据列表
  const [limitsList, setLimitsList] = useState([]) // 权限列表
  const [isTableLoading, setIsTableLoading] = useState(false) // 表格loading
  const [isShowEdit, setIsShowEdit] = useState(false) // 控制编辑对话框的显示与隐藏
  const [roleItem, setRoleItem] = useState({}) // 保存编辑权限时的item
  const [isEditLoading, setIsEditLoading] = useState(false) // 编辑权限对话框loading
  const [currentRoleRights, setCurrentRoleRights] = useState([]) // 当前编辑角色的权限列表

  useEffect(() => {
    initRolesList()
    initLimitsList()
  }, [])

  // 获取角色列表
  const initRolesList = async () => {
    const { data } = await getRoleList()
    setDataSource(data)
  }

  // 获取权限列表
  const initLimitsList = async () => {
    const { data } = await getLimits()
    setLimitsList(data)
  }

  // 表头
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id'
    },
    {
      title: '角色名称',
      dataIndex: 'roleName'
    },
    {
      title: '操作',
      render: (role) => (
        <>
          <Button shape="circle" style={{ marginRight: 10 }} icon={<EditOutlined />} onClick={() => editLimit(role)} />
          <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => onDelete(role)} />
        </>
      )
    }
  ]

  // 点击删除回调
  const onDelete = (role) => {
    confirm({
      title: '确定要删除此角色吗',
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        onDeleteRole(role)
      },
      onCancel() {}
    })
  }

  // 删除角色
  const onDeleteRole = async (role) => {
    // 开启loading
    setIsTableLoading(true)

    try {
      // 删除本地
      setDataSource(dataSource.filter((data) => data.id !== role.id))
      // 删除服务器
      const data = await deleteRole(role.id)
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

  // 点击编辑回调
  const editLimit = (role) => {
    // 显示对话框
    setIsShowEdit(true)
    setRoleItem({ ...role })
    setCurrentRoleRights(role.rights)
  }

  // 保存编辑角色权限
  const handleEditLimit = async (role) => {
    // 开启loading
    setIsEditLoading(true)

    try {
      // 修改本地
      setDataSource(
        dataSource.filter((item) => {
          if (item.id === role.id) {
            item.rights = currentRoleRights
            return item
          }
          return item
        })
      )

      // 修改服务器
      const data = await updateRoleLimits(role.id, currentRoleRights)

      if (data.status === 200) {
        message.success('修改成功')
        // 关闭对话框
        setIsShowEdit(false)
      } else {
        message.error('修改失败，请稍后重试')
      }
      // 关闭loading
      setIsEditLoading(false)
    } catch (error) {
      message.error('网络错误，请稍后重试')
      // 关闭loading
      setIsEditLoading(false)
    }
  }

  // 编辑角色权限
  const onRoleCheck = (checkedKey) => {
    // 同步到当前角色权限列表
    setCurrentRoleRights(checkedKey.checked)
  }

  return (
    <div>
      {/* 数据展示表格 */}
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={(Item) => Item.id}
        bordered={false}
        loading={isTableLoading}
        pagination={{
          pageSize: 10
        }}
      />
      {/* 编辑权限弹出对话框 */}
      <Modal
        title="权限分配"
        okText="保存"
        cancelText="取消"
        destroyOnClose={true}
        visible={isShowEdit}
        confirmLoading={isEditLoading}
        onCancel={() => setIsShowEdit(false)}
        onOk={() => handleEditLimit(roleItem)}
      >
        <Tree checkable checkStrictly checkedKeys={currentRoleRights} treeData={limitsList} onCheck={onRoleCheck} />
      </Modal>
    </div>
  )
}
