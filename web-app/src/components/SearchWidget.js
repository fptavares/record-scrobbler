import React, { Component } from 'react'
import './SearchWidget.css';

export default class SearchWidget extends Component {
  constructor(props) {
    super(props)
    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.handleGoClick = this.handleGoClick.bind(this)
  }

  getInputValue() {
    return this.refs.input.value
  }

  handleKeyUp(e) {
    if (e.keyCode === 13) {
      this.handleGoClick()
    }
  }

  handleGoClick() {
    this.props.onChange(this.getInputValue())
  }

  render() {
    return (
      <div className="search">
        <input size="30"
               ref="input"
               defaultValue={this.props.value}
               placeholder="Enter search terms"
               onKeyUp={this.handleKeyUp} />
        <button onClick={this.handleGoClick}>
          Go!
        </button>
      </div>
    )
  }
}
