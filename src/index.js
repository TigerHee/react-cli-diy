import React, { Component } from 'react'
import { render } from 'react-dom'
import './index.less'

class App extends Component {
  render() {
    return (
      <div className='app'>
        <div className='app-desc'>构建自己的React脚手架</div>
      </div>
    )
  }
}

render(<App />, document.getElementById('root'))