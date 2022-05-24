import React, { Component } from "react";
import IronswornCheck from "./ironswornCheck";
class ProgressTrack extends Component {
  state = {
    trackLength: this.props.trackLength != undefined ? this.props.trackLength : 10,
  };
  getChecks() {
    let checks = [];
    for (let i = 0; i < this.state.trackLength; i++) {
      checks.push(0);
    }
    // let checks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < this.props.progress; i++) {
      let idx = i == 0 ? 0 : Math.floor(i / 4);
      checks[idx] = (i % 4) + 1;
    }
    return checks;
  }
  render() {
    return (
      <React.Fragment>
        <ul className="progressTrack mt-2 text-center">
          {this.props.title ? <span className="orbitron mt-3">{this.props.title}</span> : React.Fragment}
          {this.props.hideButtons || this.props.complete ? (
            <React.Fragment></React.Fragment>
          ) : (
            <React.Fragment>
              <li className="progressBtn">
                <button className="btn btn-dark progressTrackBtn" onClick={() => this.props.onProgressionChange(false)}>
                  <i className="fa fa-minus" aria-hidden="true"></i>
                </button>
              </li>
            </React.Fragment>
          )}
          {this.getChecks().map((c, i) => (
            <li key={`progress_track_checks_${i}`} className="progress-check-li">
              <IronswornCheck count={c} />
              {this.props.showThreats ? (
                <React.Fragment>
                  <div className={`threat-box${i + 1 <= this.props.threatVal ? " threat-box-filled" : ""}`}></div>
                </React.Fragment>
              ) : (
                React.Fragment
              )}
            </li>
          ))}
          {this.props.hideButtons || this.props.complete ? (
            <React.Fragment></React.Fragment>
          ) : (
            <React.Fragment>
              <li className="progressBtn">
                <button className="btn btn-dark progressTrackBtn" onClick={() => this.props.onProgressionChange(true)}>
                  <i className="fa fa-plus" aria-hidden="true"></i>
                </button>
              </li>
            </React.Fragment>
          )}
        </ul>
      </React.Fragment>
    );
  }
}

export default ProgressTrack;
