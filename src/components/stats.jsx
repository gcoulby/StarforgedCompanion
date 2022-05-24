import React, { Component } from "react";
import DiceRoller from "./dice_roller";
import ExperienceTrack from "./experienceTrack";
import ProgressTrack from "./progressTrack";
import RollButton from "./rollButton";
import StatTrack from "./statTrack";
import TitleBlock from "./titleBlock";
import UnselectedPlayer from "./unselected_player";
class Stats extends Component {
  state = { health: 5, spirit: 5, momentum: -2 };

  constructor() {
    super();
    this.diceRoller = new DiceRoller();
  }

  valueToStat(val, steps) {
    let n = 100 / (steps - 1);
    return val == 0 ? 0 : Math.round(val / n);
  }

  handleStatTrackChange = (evt, name, steps, offset) => {
    let val = evt.target.value;
    let stat = this.valueToStat(val, steps) + offset;
    const players = this.props.players.map((p) => {
      if (p.selected) {
        const stats = p.stats.map((s) => {
          if (s.stat == name) {
            s.value = stat;
          }
          return s;
        });
      }
      return p;
    });

    this.setState({ players });
    if (name == "Momentum") this.checkMomentum();
    this.props.updatePlayerSelect(this.props.selectedPlayer.name);
  };

  handleDebilityChange = (evt, name) => {
    let checked = evt.target.checked;
    let count = 0;
    const players = this.props.players.map((p) => {
      if (p.selected) {
        const debilities = p.debilities.map((d) => {
          if (d.name == name) {
            d.active = checked;
            this.props.addLog("event", `${p.name} is ${checked ? "" : "no longer"} ${d.name}`);
          }
          return d;
        });
        count = debilities.filter((d) => d.active).length;
        p.maxMomentum = 10 - count;
        switch (count) {
          case 0:
            p.resetMomentum = 2;
            break;
          case 1:
            p.resetMomentum = 1;
            break;
          default:
            p.resetMomentum = 0;
            break;
        }
      }
      return p;
    });
    this.setState({ players });
    this.checkMomentum();
    this.props.updatePlayerSelect(this.props.selectedPlayer.name);
  };

  checkMomentum() {
    const players = this.props.players.map((p) => {
      if (p.selected) {
        const stats = p.stats.map((s) => {
          if (s.stat == "Momentum" && s.value > p.maxMomentum) {
            s.value = p.maxMomentum;
          }
          return s;
        });
      }
      return p;
    });

    this.setState({ players });
  }

  handleOnExperienceChange = (type) => {
    const players = this.props.players.map((p) => {
      if (p.selected) {
        switch (type) {
          case "INC":
            p.totalExperience = p.totalExperience + 1 >= 30 ? 30 : p.totalExperience + 1;
            this.props.addLog("event", `${p.name}'s experience grows`);
            break;
          case "DEC":
            p.totalExperience = p.totalExperience - 1 <= 0 ? 0 : p.totalExperience - 1;

            p.spentExperience = p.totalExperience < p.spentExperience ? p.totalExperience : p.spentExperience;
            this.props.addLog("event", `${p.name}'s experience deminishes`);
            break;
          case "REG":
            p.spentExperience = p.spentExperience - 1 <= 0 ? 0 : p.spentExperience - 1;
            break;
          case "ADV":
            p.spentExperience = p.spentExperience + 1 >= 30 ? 30 : p.spentExperience + 1;

            p.totalExperience = p.spentExperience > p.totalExperience ? p.spentExperience : p.totalExperience;
            break;
        }
      }
      return p;
    });
    this.props.updatePlayerSelect(this.props.selectedPlayer.name);
    this.setState({ players });
  };

  handleOnPlayerProgressionChanged = (playerName, field, increment) => {
    let val = 0;
    val = increment ? 1 : -1;

    // switch (field) {
    //   case "bonds":
    //     break;
    //   case "failure":
    //     val = increment ? 1 : -1;
    //     break;
    // }
    const players = this.props.players.map((p) => {
      if (p.name == playerName) {
        p[field] += val;
        p[field] = p[field] > 40 ? 40 : p[field];
        p[field] = p[field] < 0 ? 0 : p[field];
      }
      return p;
    });
    this.setState({ players });
    this.props.updatePlayerSelect(this.props.selectedPlayer.name);
  };

  handleOnPlayerStatChanged = (stat, increment) => {
    const players = this.props.players.map((p) => {
      if (p.selected === true) {
        let val = increment ? 1 : -1;
        p.stats.map((s) => {
          if (s.stat !== stat) return s;
          s.value = parseInt(s.value) + val;
          if (s.type == "core") {
            s.value = s.value > 4 ? 4 : s.value;
            s.value = s.value < 0 ? 0 : s.value;
          } else if (s.stat == "Momentum") {
            s.value = s.value > 10 ? 10 : s.value;
            s.value = s.value < -6 ? -6 : s.value;
          } else {
            s.value = s.value > 5 ? 5 : s.value;
            s.value = s.value < 0 ? 0 : s.value;
          }
          return s;
        });
      }
      return p;
    });
    this.setState({ players });
    this.props.updatePlayerSelect(this.props.selectedPlayer.name);
  };

  handleMomentumReset = () => {
    const players = this.props.players.map((p) => {
      if (p.selected === true) {
        p.stats.map((s) => {
          if (s.stat !== "Momentum") return s;
          s.value = this.props.selectedPlayer.resetMomentum;
          return s;
        });
      }
      return p;
    });
    this.setState({ players });
    this.props.updatePlayerSelect(this.props.selectedPlayer.name);
  };

  handleOnProgressRollClicked = () => {
    const players = this.props.players.map((p) => {
      if (p.selected) {
        p.failureRoll = this.diceRoller.progressionRoll(Math.floor(p.failure / 4));
      }
      return p;
    });
    this.setState({ players });
    this.props.updatePlayerSelect(this.props.selectedPlayer.name);
  };

  componentDidUpdate(prevProps, prevState) {
    this.props.onComponentUpdate(prevProps, prevState);
  }

  render() {
    if (this.props.selectedPlayer == null) return <UnselectedPlayer />;
    return (
      <React.Fragment>
        <h1 className="">{this.props.selectedPlayer.name}</h1>
        <TitleBlock title="EXPERIENCE" />
        <ExperienceTrack
          selectedPlayer={this.props.selectedPlayer}
          key={this.props.selectedPlayer}
          progress={this.props.selectedPlayer.bonds}
          onExperienceChange={this.handleOnExperienceChange}
        />
        <TitleBlock title="STATS" />
        <div className="container">
          <div className="row row-cols-5 text-center">
            {this.props.selectedPlayer.stats
              .filter((s) => s.type == "core")
              .map((s) => (
                <div className="col-12 col-lg stat-col">
                  <div key={s.stat} className="card stat-card">
                    <div className="container">
                      <div className="row">
                        <div className="col-4">
                          <button
                            className="btn btn-outline-dark progressTrackBtn"
                            onClick={() => this.handleOnPlayerStatChanged(s.stat, false)}
                          >
                            <i className="fa fa-minus" aria-hidden="true"></i>
                          </button>
                        </div>
                        <div className="col-4">
                          <h2>{s.value}</h2>
                        </div>
                        <div className="col-4">
                          <button
                            className="btn btn-outline-dark progressTrackBtn"
                            onClick={() => this.handleOnPlayerStatChanged(s.stat, true)}
                          >
                            <i className="fa fa-plus" aria-hidden="true"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    <h5 className="">{s.stat}</h5>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="stat-tracks">
          <TitleBlock title="BONDS" />

          <ProgressTrack
            key={this.props.selectedPlayer}
            progress={this.props.selectedPlayer.bonds}
            onProgressionChange={(increment) =>
              this.handleOnPlayerProgressionChanged(this.props.selectedPlayer.name, "bonds", increment)
            }
            // hideButtons={true}
          />
          <TitleBlock title="FAILURE" />

          <ProgressTrack
            key={this.props.selectedPlayer}
            progress={this.props.selectedPlayer.failure}
            onProgressionChange={(increment) =>
              this.handleOnPlayerProgressionChanged(this.props.selectedPlayer.name, "failure", increment)
            }
            // hideButtons={true}
          />
          <div className="row">
            <div className="col-4 d-sm-none d-lg-block"></div>
            <div className="col-lg-4 col-sm-12">
              <RollButton
                buttonText="Learn from your Failures"
                roll={this.props.selectedPlayer.failureRoll}
                onRoll={() => this.handleOnProgressRollClicked()}
              />
            </div>
            <div className="col-4 d-sm-none d-lg-block"></div>
          </div>
          <TitleBlock title="TRACKS" />
          <div className="d-none d-md-block">
            <StatTrack
              min={0}
              max={5}
              onChange={this.handleStatTrackChange}
              stat={this.props.selectedPlayer.stats.find((s) => s.stat == "Health")}
              value={this.props.selectedPlayer.stats.find((s) => s.stat == "Health").value}
            />
            <StatTrack
              min={0}
              max={5}
              value={this.props.selectedPlayer.stats.find((s) => s.stat == "Spirit").value}
              onChange={this.handleStatTrackChange}
              stat={this.props.selectedPlayer.stats.find((s) => s.stat == "Spirit")}
            />
            <StatTrack
              min={0}
              max={5}
              value={this.props.selectedPlayer.stats.find((s) => s.stat == "Supply").value}
              onChange={this.handleStatTrackChange}
              stat={this.props.selectedPlayer.stats.find((s) => s.stat == "Supply")}
            />
            <StatTrack
              min={-6}
              max={10}
              // onChange={this.handleMomentumTrackChange}
              onChange={this.handleStatTrackChange}
              value={this.props.selectedPlayer.stats.find((s) => s.stat == "Momentum").value}
              stat={this.props.selectedPlayer.stats.find((s) => s.stat == "Momentum")}
            />
          </div>
          <div className="d-block d-md-none text-center">
            {this.props.selectedPlayer.stats
              .filter((s) => s.type == "status")
              .map((s) => (
                <div className="col-12 col-lg stat-col">
                  <div key={s.stat} className="card stat-card">
                    <div className="container">
                      <div className="row">
                        <div className="col-4">
                          <button
                            className="btn btn-outline-dark progressTrackBtn"
                            onClick={() => this.handleOnPlayerStatChanged(s.stat, false)}
                          >
                            <i className="fa fa-minus" aria-hidden="true"></i>
                          </button>
                        </div>
                        <div className="col-4">
                          <h2>{s.value}</h2>
                        </div>
                        <div className="col-4">
                          <button
                            className="btn btn-outline-dark progressTrackBtn"
                            onClick={() => this.handleOnPlayerStatChanged(s.stat, true)}
                          >
                            <i className="fa fa-plus" aria-hidden="true"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="orbitron">{s.stat}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="row text-center">
          <div className="col mt-4">
            <div className="btn btn-outline-dark momentum-stat mr-1">
              <h5>{this.props.selectedPlayer.maxMomentum}</h5>
              <h6>MAX</h6>
            </div>
            <button className="btn btn-outline-dark momentum-stat" onClick={() => this.handleMomentumReset()}>
              <h5>{this.props.selectedPlayer.resetMomentum}</h5>
              <h6>RESET</h6>
            </button>
          </div>
        </div>

        <div className="debilities text-center">
          <TitleBlock title="IMPACTS" />
          <div className="row orbitron">
            <div className="col-12 col-lg-3 mt-4">
              <h5 className="mb-4 title-tag">misfortunes</h5>
              {this.props.selectedPlayer.debilities
                .filter((d) => d.type == "misfortunes")
                .map((d) => (
                  <div key={d.name} className="deb-cb">
                    <input
                      type="checkbox"
                      //   name="cb"
                      id={`cb_${d.name}`}
                      checked={d.active}
                      onChange={(e) => this.handleDebilityChange(e, d.name)}
                    />
                    <label htmlFor={`cb_${d.name}`}>{d.name}</label>
                  </div>
                ))}
            </div>
            <div className="col-12 col-lg-3 mt-4">
              <h5 className="mb-4 title-tag">lasting effects</h5>
              {this.props.selectedPlayer.debilities
                .filter((d) => d.type == "lasting_effects")
                .map((d) => (
                  <div className="deb-cb">
                    <input
                      type="checkbox"
                      //   name="cb"
                      id={`cb_${d.name}`}
                      checked={d.active}
                      onChange={(e) => this.handleDebilityChange(e, d.name)}
                    />
                    <label htmlFor={`cb_${d.name}`}>{d.name}</label>
                  </div>
                ))}
            </div>
            <div className="col-12 col-lg-3 mt-4">
              <h5 className="mb-4 title-tag">BURDENS</h5>
              {this.props.selectedPlayer.debilities
                .filter((d) => d.type == "burdens")
                .map((d) => (
                  <div className="deb-cb">
                    <input
                      type="checkbox"
                      //   name="cb"
                      id={`cb_${d.name}`}
                      checked={d.active}
                      onChange={(e) => this.handleDebilityChange(e, d.name)}
                    />
                    <label htmlFor={`cb_${d.name}`}>{d.name}</label>
                  </div>
                ))}
            </div>
            <div className="col-12 col-lg-3 mt-4">
              <h5 className="mb-4 title-tag">current vehicle</h5>
              {this.props.selectedPlayer.debilities
                .filter((d) => d.type == "current_vehicle")
                .map((d) => (
                  <div className="deb-cb">
                    <input
                      type="checkbox"
                      //   name="cb"
                      id={`cb_${d.name}`}
                      checked={d.active}
                      onChange={(e) => this.handleDebilityChange(e, d.name)}
                    />
                    <label htmlFor={`cb_${d.name}`}>{d.name}</label>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Stats;
