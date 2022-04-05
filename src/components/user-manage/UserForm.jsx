import React, { forwardRef, useState, useEffect } from 'react'
import { Form, Input, Select } from 'antd'
import { getItem } from '../../utils/storage'

const { Option } = Select

// 用户表单
const UserForm = forwardRef((props, ref) => {
  const [isDisableRegion, setIsDisableRegion] = useState(false) // 是否禁用区域选择框，当选择角色为超级管理员时禁用
  const currentUser = getItem('jikenews') // 当前登录用户
  // 获取当前登录用户类型(roleId 1-超级管理员 2-区域管理员 3-区域编辑)和所属区域
  const { roleId, region } = currentUser

  useEffect(() => {
    setIsDisableRegion(props.isDisableRegion)
  }, [props.isDisableRegion])

  // 判断角色决定是否禁用区域选择-角色为超级管理员（1）时禁用
  const onRoleChange = (value) => {
    if (value === 1) {
      // 禁用region
      setIsDisableRegion(true)
      // 清空region
      ref.current.setFieldsValue({
        region: ''
      })
    } else {
      // 取消禁用region
      setIsDisableRegion(false)
    }
  }

  /**
   * 区域和角色类型的option禁用说明
   *
   * 1.登录用户为超级管理员
   *    -添加用户
   *        --可选择所有的区域
   *        --可选择所有的角色类型
   *    -修改用户
   *        --可选择所有区域
   *        --可选择所有角色类型
   * 2.登录用户为区域管理员
   *    -添加用户
   *        --只能选择自己所属区域
   *        --只能选择区域编辑类型
   *    -修改用户
   *        --不能选择区域
   *        --不能选择类型
   * 3.登录用户为区域编辑--不具备用户管理能力
   */

  // 判断是否禁用region Option
  const onDisableRegionCheck = (item) => {
    // 判断当前操作为添加用户还是修改用户
    if (!props.isUpdate) {
      // 添加用户
      // 判断是否为超级管理员(roleId === 1)，超级管理员取消禁用，区域管理员禁用非自己所属区域的所有option
      if (roleId === 1) {
        return false
      } else {
        return item.value !== region
      }
    } else {
      // 修改用户
      // 判断是否为超级管理员(roleId === 1)，超级管理员取消禁用Option，区域管理员禁用所有Option
      if (roleId === 1) {
        return false
      } else {
        return true
      }
    }
  }

  // 判断是否禁用Role Option
  const onDisableRoleCheck = (item) => {
    // 判断当前操作为添加用户还是修改用户
    if (!props.isUpdate) {
      // 添加用户
      // 判断是否为超级管理员(roleId === 1)，超级管理员取消禁用，区域管理员只能选择区域编辑option
      if (roleId === 1) {
        return false
      } else {
        return item.id !== 3
      }
    } else {
      // 修改用户
      // 判断是否为超级管理员(roleId === 1)，超级管理员取消禁用Option，区域管理员禁用所有Option
      if (roleId === 1) {
        return false
      } else {
        return true
      }
    }
  }

  return (
    <Form ref={ref} labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} preserve={false}>
      <Form.Item name="username" label="用户名" rules={[{ required: true, message: '用户名不能为空' }]}>
        <Input autoComplete="off" />
      </Form.Item>
      <Form.Item name="password" label="登录密码" rules={[{ required: true, message: '登录密码不能为空' }]}>
        <Input.Password />
      </Form.Item>
      <Form.Item name="region" label="所属区域" rules={isDisableRegion ? [] : [{ required: true, message: '所属区域不能为空' }]}>
        <Select placeholder="选择区域" onChange={() => {}} allowClear disabled={isDisableRegion}>
          {props.regionList.map((item) => {
            return (
              <Option key={item.id} value={item.value} disabled={onDisableRegionCheck(item)}>
                {item.title}
              </Option>
            )
          })}
        </Select>
      </Form.Item>
      <Form.Item name="roleId" label="角色类型" rules={[{ required: true, message: '角色类型不能为空' }]}>
        <Select placeholder="选择类型" allowClear onChange={onRoleChange}>
          {props.roleList.map((item) => {
            return (
              <Option key={item.id} value={item.id} disabled={onDisableRoleCheck(item)}>
                {item.roleName}
              </Option>
            )
          })}
        </Select>
      </Form.Item>
    </Form>
  )
})

export default UserForm
