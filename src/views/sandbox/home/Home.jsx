import React, { useEffect, useRef, useState } from 'react'
import { Card, Avatar, Col, Row, List, Drawer } from 'antd'
import { EditOutlined, EllipsisOutlined, PieChartOutlined } from '@ant-design/icons'
import { getTopSearchByView, getTopSearchByStar, getAllNews } from '../../../api/news'
import { getItem } from '../../../utils/storage'
import * as echarts from 'echarts'
import _ from 'lodash'
import './Home.scss'

const { Meta } = Card

export default function Home() {
  const [topSearchByView, setTopSearchByView] = useState([]) // 浏览排行榜新闻
  const [topSearchByStar, setTopSearchByStar] = useState([]) // 点赞排行榜新闻
  const [isShowDrawer, setIsShowDrawer] = useState(false) // 是否显示抽屉
  const [categoryDataEchart, setCategoryDataEchart] = useState(null) // 分类数据图
  const [userDataEchart, setUserDataEchart] = useState(null) // 分类数据图
  const [allNews, setAllNews] = useState([]) // 所有新闻

  const currentUser = getItem('jikenews') // 获取当前登录用户
  const categoryDataEchartRef = useRef() // 分类数据图
  const userDataEchartRef = useRef() // 用户分类数据图

  const {
    username,
    region,
    role: { roleName }
  } = currentUser

  useEffect(() => {
    document.title = '即刻新闻 | 工作台'
  }, [])

  useEffect(() => {
    initTopSearchByView()
    initTopSearchByStar()
  }, [])

  // 获取浏览榜新闻
  const initTopSearchByView = async () => {
    const { data } = await getTopSearchByView()
    setTopSearchByView(data)
  }

  // 获取点赞榜新闻
  const initTopSearchByStar = async () => {
    const { data } = await getTopSearchByStar()
    setTopSearchByStar(data)
  }

  // 初始化分类数据图
  useEffect(() => {
    // 获取所有新闻
    const initAllNews = async () => {
      // 获取所有新闻
      const { data } = await getAllNews()
      setAllNews(data)
      initCategoryDataEchart(_.groupBy(data, (item) => item.category.title))
    }
    initAllNews()
    return () => {
      window.onresize = null
    }
  }, []) // eslint-disable-line

  // 渲染分类数据图
  const initCategoryDataEchart = (news) => {
    // 初始化echarts实例
    let myChart

    // 判断是否已经创建实例,避免重复创建
    if (!categoryDataEchart) {
      myChart = echarts.init(categoryDataEchartRef.current)
      setCategoryDataEchart(myChart)
    } else {
      myChart = categoryDataEchart
    }

    const option = {
      xAxis: {
        type: 'category',
        data: Object.keys(news),
        axisLabel: {
          interval: 0,
          rotate: 30
        }
      },
      yAxis: {
        type: 'value',
        minInterval: 1
      },
      color: '#adc6ff',
      grid: {
        // 距离左侧距离
        left: '3%',
        // 距离右侧距离
        right: '4%',
        // 距离底部距离
        bottom: '3%',
        // 是否显示刻度标签 如果是true 就显示 否则反之
        containLabel: true
      },
      series: [
        {
          data: Object.values(news).map((item) => item.length),
          type: 'bar',
          barWidth: '35%'
        }
      ]
    }
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)
    window.onresize = () => {
      myChart.resize()
    }
  }

  // 渲染用户分类数据图
  const initUserDataEchart = () => {
    // 获取当前用户新闻信息
    const currentList = allNews.filter((item) => item.author === username)
    const groupObj = _.groupBy(currentList, (item) => item.category.title)

    let list = []
    for (let i in groupObj) {
      list.push({
        name: i,
        value: groupObj[i].length
      })
    }

    // 初始化echarts实例
    let myChart

    // 判断是否已经创建实例,避免重复创建
    if (!userDataEchart) {
      myChart = echarts.init(userDataEchartRef.current)
      setUserDataEchart(myChart)
    } else {
      myChart = userDataEchart
    }

    const option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '5%',
        left: 'center'
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '40',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: list
        }
      ]
    }
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)
    window.onresize = () => {
      myChart.resize()
    }
  }

  // 展开用户分类数据抽屉
  const showUserDataDrawer = () => {
    setTimeout(() => {
      // 显示抽屉
      setIsShowDrawer(true)

      // 渲染图表
      initUserDataEchart()
    }, 0)
  }

  return (
    <div className="home-warp">
      <Row gutter={16}>
        <Col span={17}>
          <div className="hello-warp">
            <div>
              <b>Hello {username}，</b>祝你开心每一天！
            </div>
            <div className="logo">
              <img src={require('../../../assets/jike-logo.png')} alt="" />
            </div>
          </div>
          <Row gutter={16}>
            <Col span={12}>
              {/* 用户浏览榜 */}
              <Card className="card-item" title="用户浏览榜">
                <List
                  size="small"
                  dataSource={topSearchByView}
                  renderItem={(item, index) => (
                    <List.Item>
                      <a href={`#/news-manage/preview/${item.id}`}>
                        <span className="topsearch-num">{index + 1}</span>
                        {item.title}
                      </a>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
            <Col span={12}>
              {/* 用户点赞榜 */}
              <Card className="card-item" title="用户点赞榜">
                <List
                  size="small"
                  dataSource={topSearchByStar}
                  renderItem={(item, index) => (
                    <List.Item>
                      <a href={`#/news-manage/preview/${item.id}`}>
                        <span className="topsearch-num">{index + 1}</span>
                        {item.title}
                      </a>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>

          {/* echart */}
          <div className="echart-warp">
            <div className="category-hart-title">新闻分类数据</div>
            <div ref={categoryDataEchartRef} id="main"></div>
          </div>
        </Col>

        <Col span={7}>
          {/* 登录用户卡片 */}
          <Card
            className="card-item"
            cover={<img alt="" src="https://joeschmoe.io//api/v1/james" />}
            actions={[
              <PieChartOutlined
                onClick={() => {
                  showUserDataDrawer()
                }}
              />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />
            ]}
          >
            <Meta
              avatar={<Avatar className="user-avator"> {username.charAt(0).toUpperCase()}</Avatar>}
              title={username}
              description={
                <div>
                  {roleName} - {region ? region : '全球'}
                </div>
              }
            />
          </Card>
        </Col>
      </Row>

      {/* echart抽屉 */}
      <Drawer
        title="个人新闻分类数据"
        placement="right"
        closable
        size="large"
        onClose={() => {
          setIsShowDrawer(false)
        }}
        visible={isShowDrawer}
      >
        {/* 个人分类数据图 */}
        <div ref={userDataEchartRef} style={{ width: '100%', height: 500 }}></div>
      </Drawer>
    </div>
  )
}
