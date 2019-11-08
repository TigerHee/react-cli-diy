import React, { Component } from 'react'
import { render } from 'react-dom'
import './index.less'
console.log('ENV === ', ENV)
class App extends Component {
  render() {
    return (
      <div className='app'>
        <div className='app-desc'>使用webpack构建React脚手架</div>
        <div className='app-instruction'>当前使用启动命令：{ENV === 'DEV' ? `npm run dev` : `npm run build`}</div>
      </div>
    )
  }
}

render(<App />, document.getElementById('root'))