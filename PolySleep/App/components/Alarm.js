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
    nap: 1.5,
    startNap: 18,
    endNap: 19.5,
    totalSleep: 6.5,
    totalWake: 17.5,
    minPerHour: 60,
    increments: .25,
    totalInDay: 24,
    schedules : 
    {
      monophasic : {
        core: 8,
        wake: 16,
        //nap: 0,
        totalSleep: 8,
        totalWake: 16,
      },
      segmented : {
        core: 3.5,
        wake: 2,
        nap: 3.5,
        wake2: 15,
        totalSleep: 7,
        totalWake: 17,
      },
      siesta : {
        core: 5,
        wake: 7,
        nap: 1.5,
        wake2: 10.5,
        totalSleep: 6.5,
        totalWake: 17.5,
      },
    },
  };

  state = {
    startCore: this.props.startCore,
    startCoreDate: {},
    startCoreText: '',
    endCore: this.props.endCore,
    endCoreDate: {},
    endCoreText: '',
    startNap: this.props.startNap,
    startNapDate: {},
    startNapText: '',
    endNap: this.props.endNap,
    endNapDate: {},
    endNapText: '',
    isDateTimePickerVisible: false,
  };

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });
  
  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = (date) => {
    console.log('A date has been picked: ', date);
    //if the date chosen is in the past, add 1 day to set notification for next occurrence 
    if(date < Date.now())
    {
      // add a day
      date.setDate(date.getDate() + 1);
    }
    this._hideDateTimePicker();
    this.updateSchedule(date);
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
    console.log('note sched');
    PushNotification.localNotificationSchedule({
      message: "Time for Core Sleep", // (required)
      //date: new Date(Date.now() + (60 * 1000)) // in 60 secs
      date: this.state.startCoreDate,
      repeatType: 'day',
    });
    PushNotification.localNotificationSchedule({
      message: "Wake up from Core Sleep", // (required)
      date: this.state.endCoreDate,
      repeatType: 'day',
    });
    PushNotification.localNotificationSchedule({
      message: "Time for Nap", // (required)
      date: this.state.startNapDate,
      repeatType: 'day',
    });
    PushNotification.localNotificationSchedule({
      message: "Wake up from Nap", // (required)
      date: this.state.endNapDate,
      repeatType: 'day',
    });
   }  

  addTimeToDate(date, time)
  {
    let hours, mins;
    //time in format of 1.5
    if(time % 1 !== 0)
    {
      //there is a decimal, get that for the minutes
      let minsTime = time % 1;
      //convert to minutes
      mins = minsTime * 60;
      mins = Math.round(mins);
      hours = Math.floor(time);
    }
    else
    {
      hours = time; 
      mins = 0;
    }
    let newDate = new Date();
    newDate.setHours(date.getHours() + hours);
    newDate.setMinutes(date.getMinutes() + mins);
    return newDate;
  }

  updateSchedule(date) {
    let value = this.convertDateToNumber(date);

    let tempEndCore = value+this.props.core;
    tempEndCore = tempEndCore > 24 ? tempEndCore%24 : tempEndCore;
    let tempStartNap = value+this.props.core+this.props.wake1;
    tempStartNap = tempStartNap > 24 ? tempStartNap%24 : tempStartNap;
    let tempEndNap = value + this.props.core + this.props.wake1 + this.props.nap;
    tempEndNap = tempEndNap > 24 ? tempEndNap%24 : tempEndNap;

    this.setState({
      startCore: value,
      startCoreDate : date,
      startCoreText : this.convertDateToTimeText(date),
      endCore: (tempEndCore),
      endCoreDate: this.addTimeToDate(date, this.props.core),
      endCoreText: this.convertNumberToTimeText(tempEndCore),
      startNap: (tempStartNap),
      startNapDate: this.addTimeToDate(date, this.props.core + this.props.wake1),
      startNapText: this.convertNumberToTimeText(tempStartNap),
      endNap: (tempEndNap),
      endNapDate: this.addTimeToDate(date, this.props.core + this.props.wake1 + this.props.nap),
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
          {/*
          <Slider
          {...this.props}
          minimumValue={0}
          maximumValue={24}
          step={this.props.increments}
          onValueChange={(value) => this.updateSchedule(value)} />
          */}
          <Button title="Set Core Sleep Time" onPress={this._showDateTimePicker} style={styles.button}>
            <Text>Set Core Sleep Time Text</Text>
          </Button>
          <DateTimePicker
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this._handleDatePicked}
            onCancel={this._hideDateTimePicker}
            mode={'time'}
            //date={new Date(this.state.startCoreText)}
            minuteInterval={15}
          />
          <Button title="Update Schedule" onPress={ this.scheduleNotfication.bind(this) } style={styles.button}> 
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
  button: {
    margin: 10,
  },
});
