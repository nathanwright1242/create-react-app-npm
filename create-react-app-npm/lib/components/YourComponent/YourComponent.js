import React from 'react';
import s from './YourComponent.css';

class YourComponent extends React.Component {
  render() {
    return React.createElement("div", {
      className: s.root
    }, this.props.children);
  }

}

export default YourComponent;