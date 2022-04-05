import React from 'react'
import './MainHeader.scss'

// 导航栏
export default function MainHeader() {
  return (
    <div>
      {/* 顶部导航栏 */}
      <div className="top-nav-warp">
        <div className="logo">
          <img src={require('../../assets/jike-logo.png')} alt="" />
        </div>
      </div>
    </div>
  )
}
