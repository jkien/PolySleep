import React, { Component } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  Slider,
} from 'react-native';

export default class Alarm extends Component {
  static defaultProps = {
    startCore: 0,
    endCore: 5,
    core: 5,
    wake1: 9,
    wake2: 8.5,
    minPerHour: 60,
    nap: 1.5,
    startNap: 18,
    endNap: 19.5,
    totalSleep: 6.5,
    totalWake: 17.5,
    increments: .25,
  };

  state = {
    startCore: this.props.startCore,
    endCore: this.props.endCore,
    startNap: this.props.startNap,
    endNap: this.props.endNap,
  };

  updateSchedule(value) {

    let tempEndCore = value+this.props.core;
    let tempStartNap = value+this.props.core+this.props.wake1;
    let tempEndNap = value + this.props.core + this.props.wake1 + this.props.nap;

    this.setState({
      startCore: value,
      endCore: (tempEndCore > 24 ? tempEndCore%24 : tempEndCore),
      startNap: (tempStartNap > 24 ? tempStartNap%24 : tempStartNap),
      endNap: (tempEndNap > 24 ? tempEndNap%24 : tempEndNap),
    });
  }

  render() {
    return (
      <View>
        <Text style={styles.text} >
          {`SIESTA SCHEDULE\n\nCore Begin Time: `}
          {this.state.startCore && +this.state.startCore.toFixed(3)}
          {"\nCore End Time:"}
          {this.state.endCore &&
            this.state.endCore
          }
          {"\nNap Start Time:"}
          {this.state.startNap &&
            this.state.startNap
          }
          {"\nNap End Time:"}
          {this.state.endNap &&
            this.state.endNap
          }
          {"\nTotal Sleep Time:"}
          {this.props.totalSleep}
          {"\nTotal Wake Time:"}
          {this.props.totalWake}
        </Text>
        <Slider
          {...this.props}
          minimumValue={0}
          maximumValue={24}
          step={this.props.increments}
          onValueChange={(value) => this.updateSchedule(value)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  counter: {
    padding: 30,
    alignSelf: 'center',
    fontSize: 26,
    fontWeight: 'bold',
  },
});