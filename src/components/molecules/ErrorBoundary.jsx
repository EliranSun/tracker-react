import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      hasError: false,
      showError: false
    };
  }

  componentDidCatch(error, info) {
    this.setState({
      hasError: true,
      error
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
          {this.state.showError &&
            <div>
              {this.state.error?.message}, <br/>
              {this.state.error?.stack}
            </div>}
        </h1>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;