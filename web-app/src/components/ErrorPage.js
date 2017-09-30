import React from 'react';

const ErrorPage = ({error}) => {
  return (
    <div>
      <h1>Oops... something went wrong</h1>
      {(process.NODE_ENV !== 'production'
        && error.message && <source>error.message</source>)
        || <p>Sorry about that! We will try to fix it as soon as possible. Please try again later.</p>
      }
      <br/>
      {error.code &&
        <p>Error code: {error.code}</p>
      }
    </div>
  );
}

export default ErrorPage;
