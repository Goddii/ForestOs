import { Component } from 'react'

/**
 * Keeps a failure in a 3D surface (the Cesium globe, the R3F video terrain)
 * from taking down the rest of the page.
 */
export default class ErrorBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    console.error('[ErrorBoundary]', error)
  }

  render() {
    if (this.state.failed) return this.props.fallback ?? null
    return this.props.children
  }
}
