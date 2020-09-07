import React from 'react'
import Dashboard from '../components/Dashboard'

export default function LabelImgApp() {
  return (
    <ErrorBoundary>
      <Dashboard />
    </ErrorBoundary>
  )
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.log({ error, errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ textAlign: 'center' }}>
          <h2>Something went wrong.</h2>
        </div>
      )
    }

    return this.props.children
  }
}
