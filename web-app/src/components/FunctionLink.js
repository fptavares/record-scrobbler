import React from 'react';
import './FunctionLink.css'

const FunctionLink = (props) => {
  return (
    <button className="link" onClick={props.onClick}>
      {props.children}
    </button>
  );
}

export default FunctionLink;
