import React, { Component } from 'react'
import Form from 'react-jsonschema-form'
import axios from 'axios'
import debounce from 'lodash/debounce'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { data: {} }
    this.formSchema = require('./utils/formSchema.json')
    this.uiSchema = require('./utils/uiSchema.json')
    this.transformErrors = require('./utils/formSchemaTransforms')
    this.log = (type) => console.log.bind(console, type)
  }

  isHandlingLocalDataOnly = (formData) => {
    const { originEventNumber, eventCity, eventState, notifierId } = formData
    const { originEventNumber: stateOriginNumber } = this.state.data

    const sanitizedOriginNumber = originEventNumber?.match(/\w/g)?.join('')
    const sanitizedStateNumber = stateOriginNumber?.match(/\w/g)?.join('')
    const numberIsSearchable =
      !originEventNumber?.match(/\D/) && originEventNumber?.length > 3

    if (
      originEventNumber === stateOriginNumber ||
      (!numberIsSearchable && sanitizedOriginNumber === sanitizedStateNumber)
    ) {
      this.setState({ data: formData })
      return true
    }

    if (!numberIsSearchable) {
      this.setState({
        data: {
          eventCity,
          eventState,
          notifierId,
          originEventNumber,
        },
      })
      return true
    }

    return false
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
      const {
        data: { status, url, fileName },
      } = await axios.post('/api/getXML', { data: this.state.data })

      if (status) {
        const response = await axios({
          url,
          method: 'GET',
          responseType: 'blob',
        })

        const downloadUrl = window.URL.createObjectURL(
          new Blob([response.data])
        )
        const link = document.createElement('a')
        link.href = downloadUrl
        link.setAttribute('download', fileName)
        link.click()
        window.URL.revokeObjectURL(downloadUrl)
      }
    } catch (error) {
      console.error(`Something went wrong: ${error}`)
    }
  }

  onChange = debounce(({ formData }) => {
    const workingLocallyOnly = this.isHandlingLocalDataOnly(formData)

    if (!workingLocallyOnly) {
      this.getEventDataFromServer(formData.originEventNumber)
        .then((res) => this.setState({ data: res }))
        .catch((err) => console.error(err))
    }
  }, 500)

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">SISCOAF XML BUILDER for REGISTER</h1>
        </header>
        <nav className="App-nav"></nav>
        <div className="App-content">
          <main className="App-main">
            <Form
              schema={this.formSchema}
              uiSchema={this.uiSchema}
              formData={this.state.data}
              onChange={this.onChange}
              onSubmit={this.getXmlFromServer}
              onError={this.log('Erro na validação do do formulário.')}
              transformErrors={this.transformErrors}
            />
          </main>
        </div>
      </div>
    )
  }
}

export default App
