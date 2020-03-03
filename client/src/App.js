import React, { Component } from 'react';
import './App.css'
import Form from "react-jsonschema-form"
import {debounce} from 'lodash'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = { data: {} }
    this.formSchema = require('./formSchema.json')
    this.uiSchema = require('./uiSchema.json')
    this.log = (type) => console.log.bind(console, type)
  }

  callBackendAPI = async (originEventNumber) => {
      const response = await fetch(`/api/${originEventNumber}`)
      if (response.status !== 200) {
        throw Error(response.statusText)
      }
      return response.json()
  }

  onChange = debounce( ({formData: {originEventNumber}}) => {
    if ( (originEventNumber && originEventNumber.length > 3)
      && (originEventNumber !== this.state.data.originEventNumber)
    ) {
      this.callBackendAPI(originEventNumber)
        .then(res => this.setState({ data: res }))
        .catch(err => console.error(err))
    }
  }, 350)

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">SISCOAF XML BUILDER for REGISTER</h1>
        </header>
        <nav className="App-nav"></nav>
        <div className="App-content">
          <main className="App-main">
            <Form schema={this.formSchema}
              formData={this.state.data}
              onChange={this.onChange}
              onSubmit={this.log("submit")}
              onError={this.log("errors")}
            />
          </main>
        </div>
      </div>
    );
  }
}

export default App;
