import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { Button, Form, Input, message, Modal, Table } from 'antd'
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { getCategoriyList } from '../../../api/news'
import { deleteCategory, updateCategory } from '../../../api/category'

const { confirm } = Modal

// 新闻分类
export default function NewsCategory() {
  const [categoryList, setCategoryList] = useState([])
  const [isTableLoading, setIsTableLoading] = useState(false) // 表格loading
  const EditableContext = createContext(null)

  useEffect(() => {
    initCategoryList()
  }, [])

  // 获取分类列表
  const initCategoryList = async () => {
    const { data } = await getCategoriyList()
    setCategoryList(data)
  }

  // 表头
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id'
    },
    {
      title: '分类名称',
      dataIndex: 'title',
      width: '40%',
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex: 'title',
        title: '分类名称',
        handleSave: handleSave
      })
    },
    {
      title: '操作',
      render: (category) => (
        <>
          <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => handleDleteCategory(category)} />
        </>
      )
    }
  ]

  // 点击删除回调
  const handleDleteCategory = (category) => {
    confirm({
      title: '确定要删除此分类吗',
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        onDeleteCategory(category)
      },
      onCancel() {}
    })
  }

  // 删除权限
  const onDeleteCategory = async (category) => {
    // 开启loading
    setIsTableLoading(true)

    try {
      // 删除本地
      setCategoryList(categoryList.filter((data) => data.id !== category.id))

      // 删除服务器
      const data = await deleteCategory(category.id)

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

  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm()
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    )
  }

  const EditableCell = ({ title, editable, children, dataIndex, record, handleSave, ...restProps }) => {
    const [editing, setEditing] = useState(false)
    const inputRef = useRef(null)
    const form = useContext(EditableContext)
    useEffect(() => {
      if (editing) {
        inputRef.current.focus()
      }
    }, [editing])

    const toggleEdit = () => {
      setEditing(!editing)
      form.setFieldsValue({
        [dataIndex]: record[dataIndex]
      })
    }

    const save = async () => {
      try {
        const values = await form.validateFields()
        toggleEdit()
        handleSave({ ...record, ...values })
      } catch (errInfo) {}
    }

    let childNode = children

    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`
            }
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      )
    }
    return <td {...restProps}>{childNode}</td>
  }

  // 修改分类
  const handleSave = async (record) => {
    // 开启loading
    setIsTableLoading(true)

    try {
      // 修改本地
      setCategoryList(
        categoryList.map((data) => {
          if (data.id === record.id) {
            return {
              id: data.id,
              title: record.title,
              value: record.title
            }
          } else {
            return data
          }
        })
      )

      // 修改服务器
      const data = await updateCategory(record.id, {
        title: record.title,
        value: record.title
      })
      if (data.status === 200) {
        message.success('修改成功')
      } else {
        message.error('修改失败，请稍后重试')
      }
    } catch (error) {
      message.error('网络错误，请稍后重试')
      // 关闭loading
      setIsTableLoading(false)
    }
    // 关闭loading
    setIsTableLoading(false)
  }

  return (
    <div>
      {/* 数据展示表格 */}
      <Table
        dataSource={categoryList}
        columns={columns}
        rowKey={(Item) => Item.id}
        bordered={false}
        loading={isTableLoading}
        pagination={{
          pageSize: 10
        }}
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell
          }
        }}
      />
    </div>
  )
}
