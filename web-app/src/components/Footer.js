import React from 'react';
import githubLogo from './images/github.svg';
import './Footer.css'

const Footer = (props) => {
  return (
    <div className="footer">
      Created by Filipe Tavares,
      &nbsp;
      <img className="github" alt="GitHub project" src={githubLogo} />
      &nbsp;
      <a href="https://github.com/fptavares/record-scrobbler">
        this project is open-source
      </a>.
    </div>
  );
}

export default Footer;
