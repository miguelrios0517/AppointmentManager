import React, { Component } from 'react';
import AnchorLink from 'react-anchor-link-smooth-scroll'
import resumeData from '../resumeData';

export default class Footer extends Component {
  render() {
    return (
      <footer>
      <div className="row">
        <div className="twelve columns">
          <ul className="social-links">
            {
              resumeData.socialLinks && resumeData.socialLinks.map((item,i)=>{
                return(
                  <li key={i}>
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                    <i className={item.className} />
                    </a>
                  </li>
                )
              })
            }
          </ul>
        </div>
        <div id="go-top"><AnchorLink title="Back to Top" href="#home"><i className="icon-up-open" /></AnchorLink></div>
      </div>
    </footer>
    );
  }
}
