import React, { Component } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Slider,
} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import PushNotification from 'react-native-push-notification';

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
    startCoreText: '',
    endCore: this.props.endCore,
    endCoreText: '',
    startNap: this.props.startNap,
    startNapText: '',
    endNap: this.props.endNap,
    endNapText: '',
    isDateTimePickerVisible: false,
  };

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });
  
  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = (date) => {
    console.log('A date has been picked: ', date);
    this.setState({ 
      startCoreText : this.convertDateToTimeText(date),
    });
    this._hideDateTimePicker();
    this.updateSchedule(this.convertDateToNumber(date));
  };

  convertDateToNumber(date) {
    let timeAsNumber = date.getHours();
    timeAsNumber = timeAsNumber + date.getMinutes()/60;
    console.log(timeAsNumber);
    return timeAsNumber;
  }

  convertNumberToTimeText(number) {
    console.log('convert number to time text');
    console.log(number);
    let numberSplit = number.toString().split('.');
    let timeText = numberSplit[0];
    console.log(numberSplit);
    if(numberSplit.length > 1)
    {
      let minutes = parseFloat('.' + numberSplit[1]);
      minutes = minutes * 60;
      timeText = timeText + ':' + minutes.toString().substring(0,2);
    }
    else{
      timeText = timeText + ':00';
    }
    return timeText;
  }

  convertDateToTimeText(date) {
    return date.getHours() + ':' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
  }

  scheduleNotfication() { 
    console.log('note sched2');
    PushNotification.localNotificationSchedule({
      message: "My Notification Message", // (required)
      date: new Date(Date.now() + (60 * 1000)) // in 60 secs
    });
   }  

  updateSchedule(value) {

    let tempEndCore = value+this.props.core;
    tempEndCore = tempEndCore > 24 ? tempEndCore%24 : tempEndCore;
    let tempStartNap = value+this.props.core+this.props.wake1;
    tempStartNap = tempStartNap > 24 ? tempStartNap%24 : tempStartNap;
    let tempEndNap = value + this.props.core + this.props.wake1 + this.props.nap;
    tempEndNap = tempEndNap > 24 ? tempEndNap%24 : tempEndNap;

    this.setState({
      startCore: value,
      endCore: (tempEndCore),
      endCoreText: this.convertNumberToTimeText(tempEndCore),
      startNap: (tempStartNap),
      startNapText: this.convertNumberToTimeText(tempStartNap),
      endNap: (tempEndNap),
      endNapText: this.convertNumberToTimeText(tempEndNap),
    });
    console.log(this.state);
    //this.scheduleNotfication();
  }

  render() {
    return (
      <View>
        <Text style={styles.text} >
          {`SIESTA SCHEDULE\n\nCore Begin Time: `}
          {this.state.startCoreText } {/*&&/*+this.state.startCore.toFixed(3)}*/}
          {"\nCore End Time:"}
          {this.state.endCoreText &&
            this.state.endCoreText
          }
          {"\nNap Start Time:"}
          {this.state.startNapText &&
            this.state.startNapText
          }
          {"\nNap End Time:"}
          {this.state.endNapText &&
            this.state.endNapText
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
          <TouchableOpacity onPress={this._showDateTimePicker}>
            <Text>Set Begin Time</Text>
          </TouchableOpacity>
          <DateTimePicker
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this._handleDatePicked}
            onCancel={this._hideDateTimePicker}
            mode={'time'}
            //date={new Date(this.state.startCoreText)}
            minuteInterval={15}
          />
          <Button title="title of button" onPress={ this.scheduleNotfication.bind(this) } > 
            <Text>show</Text> 
          </Button>
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
