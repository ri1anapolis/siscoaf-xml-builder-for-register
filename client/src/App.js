import React, { Component } from 'react';
import './App.css'
import Form from "react-jsonschema-form"
import {debounce} from 'lodash'

class App extends Component {
  
  constructor(props) {
    super(props)
    this.state = { data: {} }
    this.formSchema = require('./utils/formSchema.json')
    this.uiSchema = require('./utils/uiSchema.json')
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
    try {
      await this.axios.post('/api/getXML', { data: this.state.data })
    } catch (error) {
      console.error( `Error sending the XML file to server: ${error}`)
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
    console.log(JSON.stringify( this.state.data ))
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
              uiSchema={this.uiSchema}
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
