import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Form, Input, message, PageHeader, Result, Select, Steps } from 'antd'
import { getItem } from '../../utils/storage'
import { getCategoriyList, getNewsInfo, saveNews, updateNews } from '../../api/news'
import NewsEditor from './NewsEditor'
import './NewsEdit.scss'

const { Step } = Steps
const { Option } = Select

// 编辑新闻
export default function NewsEdit(props) {
  const [currentStep, setCurrentStep] = useState(0) // 当前步骤
  const [categoryList, setCategoryList] = useState([]) // 新闻分类
  const [newsInfo, setNewsInfo] = useState('') // 新闻信息(标题+分类)
  const [newsContent, setNewsContent] = useState('') // 新闻内容
  const [resState, setResState] = useState(-2) // 操作状态 0-提交审核失败 1-保存草稿箱失败 2-提交审核成功 3-保存草稿箱成功 -1-网络错误
  const [isShowPrevious, setIsShowPrevious] = useState(true) // 是否显示上一页按钮
  const [isClearEditor, setIsClearEditor] = useState(false) // 是否清空富文本编辑器
  const [isShowPubLoading, setIsShowPubLoading] = useState(false) // 提交审核loading
  const [isShowDraftLoading, setIsShowDraftLoading] = useState(false) // 保存草稿loading
  const [isShowAgainLoading, setIsShowAgainLoading] = useState(false) // 再次提交loading

  const newsInfoForm = useRef(null) // 新闻信息表单
  const currentUser = getItem('jikenews') // 获取当前登录用户
  const navigate = useNavigate()

  const [currentNewsInfo, setCurrentNewsInfo] = useState(null) // 当前更新的路由信息

  useEffect(() => {
    initCategoryList()

    // props.updateNews 判断是否为修改新闻
    if (props.updateNews) {
      // 获取当前修改新闻详情
      const initCurrentNewsInfo = async () => {
        const { data } = await getNewsInfo(props.NewsId)
        setCurrentNewsInfo(data)
        // 设置当前新闻信息
        newsInfoForm.current.setFieldsValue({
          title: data.title,
          categoryId: data.categoryId
        })
      }
      initCurrentNewsInfo()
    }
  }, []) // eslint-disable-line

  // 获取新闻分类列表
  const initCategoryList = async () => {
    const { data } = await getCategoriyList()
    setCategoryList([...data])
  }

  // 上一步
  const handlePrevious = () => {
    setCurrentStep(currentStep - 1)
  }

  // 下一步
  const handleNext = () => {
    if (currentStep === 0) {
      // 校验表单
      newsInfoForm.current
        .validateFields()
        .then((res) => {
          // 校验通过
          setNewsInfo(res)
          // 跳转下一步
          setCurrentStep(currentStep + 1)
        })
        .catch((err) => {
          // 校验失败
        })
    }
  }

  // 保存至草稿箱（auditState=0）或提交审核（auditState=1）
  const handelSave = async (auditState) => {
    // 验证富文本编辑器内容
    if (newsContent === '' || newsContent.trim() === '<p></p>') {
      message.error('内容不能为空')
    } else {
      // auditState 0-保存草稿箱 1-提交审核
      // 跳转结果页
      setCurrentStep(2)

      if (auditState === 0) {
        // 开启loading
        setIsShowDraftLoading(true)
      } else if (auditState === 1) {
        // 开启loading
        setIsShowPubLoading(true)
      }
      setIsShowAgainLoading(true)

      // 保存服务器
      try {
        // 修改新闻
        if (props.updateNews) {
          const data = await updateNews(props.NewsId, {
            ...newsInfo, // 标题+分类
            content: newsContent, // 内容
            auditState // 审核状态 0-草稿箱 1-待审核 2-审核通过 3-审核驳回
          })
          if (data.status === 200) {
            // 关闭上一页按钮
            setIsShowPrevious(false)

            if (auditState === 0) {
              // 保存草稿成功
              setResState(3)
            } else if (auditState === 1) {
              // 提交审核成功
              setResState(2)
            }
          } else {
            if (auditState === 0) {
              // 保存草稿失败
              setResState(1)
            } else if (auditState === 1) {
              // 提交审核失败
              setResState(0)
            }
          }
        } else {
          // 添加新闻
          const data = await saveNews({
            ...newsInfo, // 标题+分类
            content: newsContent, // 内容
            region: currentUser.region ? currentUser.region : '全球', // 区域
            author: currentUser.username, // 作者
            roleId: currentUser.roleId,
            auditState, // 审核状态 0-草稿箱 1-待审核 2-审核通过 3-审核驳回
            publishState: 0, // 发布状态 0-未发布
            createTime: Date.now(), // 创建时间
            star: 0, // 点赞
            view: 0 // 浏览量
          })
          if (data.status === 201) {
            // 关闭上一页按钮
            setIsShowPrevious(false)

            if (auditState === 0) {
              // 保存草稿成功
              setResState(3)
            } else if (auditState === 1) {
              // 提交审核成功
              setResState(2)
            }
          } else {
            if (auditState === 0) {
              // 保存草稿失败
              setResState(1)
            } else if (auditState === 1) {
              // 提交审核失败
              setResState(0)
            }
          }
        }
      } catch (error) {
        // 操作失败
        setResState(-1)
      }
      setIsShowAgainLoading(false)
      setIsShowDraftLoading(false)
      setIsShowPubLoading(false)
    }
  }

  // 再写一篇
  const writeNewsAgain = () => {
    newsInfoForm.current.setFieldsValue({
      title: '',
      categoryId: ''
    })
    setIsClearEditor(true)
    setResState(-2)
    setIsShowPrevious(true)
    // 跳转步骤
    setCurrentStep(0)
  }

  return (
    <div className="news-add-warp">
      {/* 顶部标题 */}
      <PageHeader className="site-page-header" title="撰写新闻" />

      {/* 进度条 */}
      <Steps className="step-warp" current={currentStep}>
        <Step title="基本信息" description="新闻标题，新闻分类" />
        <Step title="新闻内容" description="新闻主题内容" />
        <Step title="新闻提交" description="保存草稿或提交审核" />
      </Steps>

      <div className="content-warp">
        {/* 步骤一内容区域 */}
        <div className={currentStep === 0 ? '' : 'hidden'}>
          <Form className="news-info-form" ref={newsInfoForm} name="basic">
            <Form.Item label="新闻标题" name="title" rules={[{ required: true, message: '新闻标题不能为空' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="所属分类" name="categoryId" rules={[{ required: true, message: '所属分类不能为空' }]}>
              <Select placeholder="选择新闻所属分类" allowClear>
                {categoryList.map((category) => {
                  return (
                    <Option key={category.id} value={category.id}>
                      {category.title}
                    </Option>
                  )
                })}
              </Select>
            </Form.Item>
          </Form>
        </div>

        {/* 步骤二内容区域 */}
        <div className={currentStep === 1 ? '' : 'hidden'}>
          {/* 富文本编辑器 */}
          <NewsEditor
            content={currentNewsInfo?.content}
            isClear={isClearEditor}
            getContent={(value) => {
              // 获取编辑器的内容
              setNewsContent(value)
            }}
          />
        </div>

        {/* 步骤三内容区域 */}
        <div className={currentStep === 2 ? 'res-warp' : 'res-warp hidden'}>
          {/* 操作结果-提交审核成功 */}
          {resState === 2 && (
            <Result
              status={'success'}
              title="提交审核成功"
              subTitle="请等待区域主管审核结果，预计耗时1-3小时"
              extra={[
                <Button
                  type="primary"
                  key="console"
                  onClick={() => {
                    navigate('/audit-manage/list')
                  }}
                >
                  查看进度
                </Button>,
                !props.updateNews && (
                  <Button key="buy" onClick={writeNewsAgain}>
                    再写一篇
                  </Button>
                )
              ]}
            />
          )}
          {/* 操作结果-保存草稿箱成功 */}
          {resState === 3 && (
            <Result
              status="success"
              title="保存草稿箱成功"
              subTitle="可前往草稿箱查看状态"
              extra={[
                <Button
                  type="primary"
                  key="console"
                  onClick={() => {
                    navigate('/news-manage/draft')
                  }}
                >
                  前往草稿箱
                </Button>,
                !props.updateNews && (
                  <Button key="buy" onClick={writeNewsAgain}>
                    再写一篇
                  </Button>
                )
              ]}
            />
          )}
          {/* 操作结果-提交审核失败 */}
          {resState === 0 && (
            <Result
              status="error"
              title="提交审核失败"
              subTitle="网络可能出现问题，请稍后重试"
              extra={[
                <Button
                  type="primary"
                  key="console"
                  loading={isShowAgainLoading}
                  onClick={() => {
                    handelSave(1)
                  }}
                >
                  重新提交
                </Button>
              ]}
            />
          )}
          {/* 操作结果-保存草稿箱失败 */}
          {resState === 1 && (
            <Result
              status="error"
              title="保存草稿箱失败"
              subTitle="网络可能出现问题，请稍后重试"
              extra={[
                <Button
                  type="primary"
                  key="console"
                  loading={isShowAgainLoading}
                  onClick={() => {
                    handelSave(0)
                  }}
                >
                  重新保存
                </Button>
              ]}
            />
          )}
          {/* 操作结果-网络错误 */}
          {resState === -1 && <Result status="error" title="网络错误" subTitle="网络可能出现问题，请稍后重试" />}
        </div>
      </div>

      {/* 按钮区域 */}
      <div className="btns-warp">
        {(currentStep === 1 || resState === -1) && isShowPrevious && (
          <Button style={{ marginRight: 8 }} onClick={handlePrevious}>
            上一步
          </Button>
        )}
        {currentStep < 1 && (
          <Button type="primary" onClick={handleNext}>
            下一步
          </Button>
        )}
        {currentStep === 1 && (
          <span>
            <Button
              style={{ marginRight: 8 }}
              type="primary"
              loading={isShowPubLoading}
              onClick={() => {
                handelSave(1)
              }}
            >
              提交审核
            </Button>
            <Button
              loading={isShowDraftLoading}
              onClick={() => {
                handelSave(0)
              }}
            >
              保存至草稿箱
            </Button>
          </span>
        )}
      </div>
    </div>
  )
}
