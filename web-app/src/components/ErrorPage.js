import React from 'react';

const ErrorPage = ({error}) => {
  return (
    <div><h1>Error</h1><p>{error.message}</p></div>
  );
}

export default ErrorPage;
