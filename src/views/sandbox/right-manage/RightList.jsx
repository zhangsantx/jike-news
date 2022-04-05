import React, { useState, useEffect } from 'react'
import { Button, Table, Tag, Modal, message, Form, Switch } from 'antd'
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { getLimits, deleteFirstLimit, deleteSecondLimit, editFirstLimit, editSecondLimit } from '../../../api/authority'

const { confirm } = Modal

// 权限列表
export default function RightList() {
  const [dataSource, setDataSource] = useState([]) // 权限数据列表
  const [isTableLoading, setIsTableLoading] = useState(false) // 表格loading
  const [isShowEdit, setIsShowEdit] = useState(false) // 控制编辑权限对话框的显示与隐藏
  const [editItem, setEditItem] = useState({}) // 保存编辑权限时的item
  const [isEditLoading, setIsEditLoading] = useState(false) // 编辑权限对话框loading
  const [currentType, setcurrentType] = useState(1) // 当前权限的开启状态 0关闭 1开启

  useEffect(() => {
    initLimits()
  }, [])

  // 表头
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id'
    },
    {
      title: '权限名称',
      dataIndex: 'title'
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: (key) => (
        <>
          <Tag color="orange">{key}</Tag>
        </>
      )
    },
    {
      title: '操作',
      render: (limitItem) => (
        <>
          <Button
            shape="circle"
            style={{ marginRight: 10 }}
            disabled={limitItem.pagepermisson === undefined}
            onClick={() => editLimit(limitItem)}
            icon={<EditOutlined />}
          />
          <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => onConfirm(limitItem)} />
        </>
      )
    }
  ]

  // 获取权限列表
  const initLimits = async () => {
    const { data } = await getLimits()
    // data[0].children = ''
    // 修改children为空数组，则将其设置为空
    // const newData = data.map((item) => {
    //   if (item.children?.length === 0) {
    //     item.children = ''
    //   }
    //   return item
    // })
    data.forEach((item) => {
      if (item.children?.length === 0) item.children = ''
    })
    setDataSource(data)
  }

  // 点击编辑回调
  const editLimit = (limitItem) => {
    // 显示对话框
    setIsShowEdit(true)
    setEditItem({ ...limitItem })
    setcurrentType(limitItem.pagepermisson)
  }

  // switch切换
  const onSwitchChange = (key) => {
    setcurrentType(key === true ? 1 : 0)
  }

  // 保存编辑权限
  const handleEditLimit = async (editItem) => {
    // 开启loading
    setIsEditLoading(true)

    try {
      // 修改本地
      setDataSource(
        dataSource.filter((item) => {
          if (item.id === editItem.id) {
            item.pagepermisson = currentType
            return item
          }
          return item
        })
      )

      // 保存服务器
      if (editItem.grade === 1) {
        try {
          const data = await editFirstLimit(editItem.id, currentType)
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
      } else if (editItem.grade === 2) {
        try {
          const data = await editSecondLimit(editItem.id, currentType)
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
    } catch (error) {
      message.error('网络错误，请稍后重试')
      // 关闭loading
      setIsEditLoading(false)
    }
  }

  // 点击删除回调
  const onConfirm = (limitItem) => {
    confirm({
      title: '确定要删除此权限吗',
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        deleteMethod(limitItem)
      },
      onCancel() {}
    })
  }

  // 删除权限
  const deleteMethod = async (limitItem) => {
    // 开启loading
    setIsTableLoading(true)

    // limitItem.grade 1/2 一级菜单或二级菜单
    if (limitItem.grade === 1) {
      // 删除一级菜单
      try {
        // 删除本地
        setDataSource(dataSource.filter((dataItem) => dataItem.id !== limitItem.id))
        // 删除服务器
        const data = await deleteFirstLimit(limitItem.id)

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
    } else if (limitItem.grade === 2) {
      // 删除二级菜单
      try {
        // 删除本地
        // data.id === limitItem.rightId 对应的父级菜单
        // list 对应的父级菜单
        let list = dataSource.filter((data) => data.id === limitItem.rightId)
        // 重置父级菜单的children
        list[0].children = list[0].children.filter((data) => data.id !== limitItem.id)
        // ...dataSource dataSource第一级未改变会检测不到，需要使用展开
        setDataSource([...dataSource])

        // 删除服务器
        const data = await deleteSecondLimit(limitItem.id)

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
        title="权限配置项"
        okText="保存"
        cancelText="取消"
        destroyOnClose={true}
        visible={isShowEdit}
        confirmLoading={isEditLoading}
        onCancel={() => setIsShowEdit(false)}
        onOk={() => handleEditLimit(editItem)}
      >
        <Form preserve={false}>
          {/* () => onSwitchChange(editItem) */}
          <Form.Item label="权限名称">{editItem.title}</Form.Item>
          <Form.Item label="所属类型">{editItem.pagepermisson ? '页面权限' : '功能权限'}</Form.Item>
          <Form.Item label="权限路径">{editItem.key}</Form.Item>
          <Form.Item label="权限状态" valuePropName="checked">
            <Switch checked={currentType} onChange={onSwitchChange} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
