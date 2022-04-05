import React, { useEffect } from 'react'
import { Card, Avatar, Col, Row, List } from 'antd'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons'
import './Home.scss'

const { Meta } = Card

export default function Home() {
  useEffect(() => {
    document.title = '即刻新闻 | 工作台'
  }, [])
  useEffect(() => {}, [])

  return (
    <div className="home-warp">
      <Row gutter={16}>
        <Col span={17}>
          <div className="hello-warp">hello Admin，今天是你加入即刻ke的第一天，祝你开心每一天！</div>
          <Row gutter={16}>
            <Col span={12}>
              <Card className="card-item" title="用户浏览榜" extra={<div>More</div>}>
                <List size="small" dataSource={['111', '222', '333']} renderItem={(item) => <List.Item>{item}</List.Item>} />
              </Card>
            </Col>
            <Col span={12}>
              <Card className="card-item" title="用户点赞榜" extra={<div>More</div>}>
                <List size="small" dataSource={['111', '222', '333']} renderItem={(item) => <List.Item>{item}</List.Item>} />
              </Card>
            </Col>
          </Row>
        </Col>

        <Col span={7}>
          <Card
            className="card-item"
            cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}
            actions={[<SettingOutlined key="setting" />, <EditOutlined key="edit" />, <EllipsisOutlined key="ellipsis" />]}
          >
            <Meta avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />} title="Card title" description="This is the description" />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
