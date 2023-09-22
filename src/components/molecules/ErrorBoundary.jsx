import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: '',
      showError: false
    };
  }

  componentDidCatch(error, info) {
    this.setState({
      hasError: true,
      errorMessage: error.stack
    });
    // eslint-disable-next-line no-console
    console.log(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <h1 className="m-4 p-4 border border-red-100">
          Something went wrong rendering the {this.props.message || "component"}.
          Please try again later. <br/>
          <button
            className="text-blue-500 hover:text-blue-700"
            onClick={() => this.setState({
              showError: !this.state.showError
            })}>
            Click for technical info
          </button>
          <br/>
          {this.state.showError && this.state.errorMessage}
        </h1>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;