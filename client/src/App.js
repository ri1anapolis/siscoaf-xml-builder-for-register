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
    this.axios = require('axios')
    this.log = (type) => console.log.bind(console, type)
  }

  getEventDataFromServer = async (originEventNumber) => {
      const response = await fetch(`/api/${originEventNumber}`)
      if (response.status !== 200) {
        throw Error(response.statusText)
      }
      return response.json()
  }

  getXmlFromServer = async () => {
    console.log({data: this.state.data})
    try {
      const xmlData = await this.axios.post('/api/getXML', { data: this.state.data })
      console.log( `The result is: ${xmlData}`)
    } catch (error) {
      console.error( `Error getting a XML file from server: ${error}`)
    }
  }

  onChange = debounce( ({formData}) => {
    const {originEventNumber} = formData
    if ( (originEventNumber && originEventNumber.length > 3)
    && (originEventNumber !== this.state.data.originEventNumber)
    ) {
      this.getEventDataFromServer(originEventNumber)
      .then(res => this.setState({ data: res }))
      .catch(err => console.error(err))
    } else {
      this.setState({ data: formData })
    }
    console.log(formData)
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
              onSubmit={this.getXmlFromServer}
              onError={this.log("errors")}
            />
          </main>
        </div>
      </div>
    );
  }
}

export default App;
