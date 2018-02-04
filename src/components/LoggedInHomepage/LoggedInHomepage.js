import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class LoggedInHomepage extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  handleJarClick = jarName => () => {
    console.log('>>>>>>>>>>>>>>> LoggedInHomepage > handleJarClick > jarName: ', jarName);
  };

  render() {
    const styles = require('./LoggedInHomepage.scss');
    const voteImg = require('./vote.jpg');
    return (
      <section className={styles.loggedInSection}>
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <div className="overview widget">
                <div className="widget-title">
                  <span>ThisGreatApp!!</span>
                </div>
                <div className="widget-container">
                  <ul className="item-wrapper vertical-list">
                    <li className="item">
                      <span className="item-name">Team</span>
                      <span className="item-value">The team behind ThisGreatApp!</span>
                    </li>
                    <li className="item">
                      <span className="item-name">Customer Service</span>
                      <span className="item-value">We at ThisGreatApp are dedicated!</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-9">
              <div className="row">
                <div className="col-md-8">
                  <div className="chart widget">
                    <div className="widget-title">
                      <span>Chart</span>
                    </div>
                    <div className="widget-container">
                      <img src={voteImg} alt="chart" width="100%" />
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="inout widget">
                    <div className="widget-title">
                      <span>6 Jars</span>
                    </div>
                    <div className="widget-container">
                      <ul className="item-wrapper horizontal-list">
                        <li className="item">
                          <span className="item-name">Praesentium</span>
                          <span className="item-value">quidem</span>
                        </li>
                        <li className="item">
                          <span className="item-name">Temporibus</span>
                          <span className="item-value">voluptatum%</span>
                        </li>
                        <li className="item">
                          <span className="item-name">Itaque</span>
                          <span className="item-value">mollitia</span>
                        </li>
                        <li className="item">
                          <span className="item-name">Excepturi</span>
                          <span className="item-value">iusto</span>
                        </li>
                        <li className="item">
                          <span className="item-name">Provident</span>
                          <span className="item-value">blanditiis</span>
                        </li>
                        <li className="item">
                          <span className="item-name">Dignissimos</span>
                          <span className="item-value">accusamus</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="chart widget">
                    <div className="widget-title">
                      <span>Contact Us</span>
                    </div>
                    <div className="widget-container">
                      <ul className="item-wrapper horizontal-list">
                        <li className="item">
                          <span className="item-name">LoggedInSection</span>
                          <span className="item-value">Nam libero tempore.</span>
                        </li>
                        <li className="item">
                          <span className="item-name">LoggedInHomepage</span>
                          <span className="item-value">Temporibus autem quibusdam.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
