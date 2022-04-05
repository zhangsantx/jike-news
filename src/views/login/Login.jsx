import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import Particles from 'react-tsparticles'
import { userLogin } from '../../api/user'
import { setItem } from '../../utils/storage'
import './Login.scss'

// 登录页
export default function Login(props) {
  const navigate = useNavigate()

  useEffect(() => {
    document.title = '登录到即刻新闻'
  }, [])

  const handleFinish = async (values) => {
    try {
      const { data } = await userLogin(values.username, values.password)
      if (data.length === 0) {
        message.error('用户名或密码错误')
      } else {
        // 保存登录信息
        setItem('jikenews', data[0])
        // 跳转首页
        navigate('/')
      }
    } catch (error) {
      message.error('网络好像出错了，请稍后重试')
    }
  }

  return (
    <div className="login-warp">
      {/* 粒子效果 */}
      <Particles
        id="tsparticles"
        options={{
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: 'repulse'
              },
              onHover: {
                enable: true,
                mode: 'bubble'
              }
            },
            modes: {
              bubble: {
                distance: 250,
                duration: 2,
                opacity: 0,
                size: 0
              },
              grab: {
                distance: 400
              },
              repulse: {
                distance: 400
              }
            }
          },
          particles: {
            color: {
              value: '#fff'
            },
            links: {
              color: {
                value: '#ffffff'
              },
              distance: 150,
              opacity: 0.4
            },
            move: {
              attract: {
                rotate: {
                  x: 600,
                  y: 600
                }
              },
              enable: true,
              outModes: {
                bottom: 'out',
                left: 'out',
                right: 'out',
                top: 'out'
              },
              random: true,
              speed: 1
            },
            number: {
              density: {
                enable: true
              },
              value: 160
            },
            opacity: {
              random: {
                enable: true
              },
              value: {
                min: 0,
                max: 1
              },
              animation: {
                enable: true,
                speed: 1,
                minimumValue: 0
              }
            },
            size: {
              random: {
                enable: true
              },
              value: {
                min: 1,
                max: 3
              },
              animation: {
                speed: 4,
                minimumValue: 0.3
              }
            }
          }
        }}
      />
      <div className="logo-warp">
        <img src={require('./jike-logo.png')} alt="" />
      </div>
      <div className="login-bg">
        <img src={require('./login-bg.webp')} alt="" />
      </div>
      {/* 登录表单 */}
      <div className="login-form-warp">
        <Form size="large" name="normal_login" className="login-form" initialValues={{ remember: true }} onFinish={handleFinish}>
          <div className="login-title">
            登录到
            <br />
            即刻新闻 now news
          </div>
          <Form.Item shape="round" name="username" rules={[{ required: true, message: '用户名不能为空' }]}>
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '密码不能为空' }]}>
            <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登 录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
