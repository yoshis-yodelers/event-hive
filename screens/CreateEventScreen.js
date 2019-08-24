import React from 'react';
import { Alert, Modal, Platform, KeyboardAvoidingView, Picker, ScrollView, StyleSheet, Text, TextInput, View, Button } from 'react-native';
import { Calendar} from 'react-native-calendars'
import { FirebaseWrapper } from '../firebase/firebase';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { EventBrite } from '../firebase/eventBriteData';

export default class CreateEventScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sampm: 'AM',
      eampm: 'AM',
      category: '',
      description: '',
      ehour: '',
      eminute: '',
      end: '',
      endshow: false,
      name: '',
      startshow: false,
      start: '',
      shour: '',
      sminute: '',
      venue: '',
    };
  }

  async createEvent() {
    try {
      const boop = this.state.shour
      const beep = this.state.ehour
        Alert.alert("Event Created!")
      // await FirebaseWrapper.GetInstance().CreateNewDocument('Event', {
        console.log({
        name: this.state.name,
        description: this.state.description,
        createdBy: firebase.auth().currentUser.uid,
        start:this.state.sampm === "AM" ? this.state.start+"T"+boop+":"+this.state.sminute: this.state.start+"T"+(boop+12)+":"+this.state.sminute,
        end:this.state.eampm === "AM" ? this.state.end+"T"+beep+":"+this.state.eminute: this.state.end+"T"+(beep+12)+":"+this.state.eminute
        })
      // });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    // const boop = this.state.shour
    // this.state.ampm === "AM" ? console.log(this.state.start+"T"+this.state.shour+":"+this.state.sminute):
    // console.log(this.state.start+"T"+(boop+12)+":"+this.state.sminute)
    // const leep = this.state.start
    return (
      <View>
      <View>
        <Text style = {{fontWeight: "bold", fontSize: 20}}>Create New Event</Text>
      </View>
      <KeyboardAvoidingView>
      <ScrollView>
      <View style={styles.view}>
        <Text>Event Name:</Text>
        <TextInput
          style={styles.input}
          onChangeText={name => this.setState({ name })}
          value={this.state.name}
        />
        <Text>Event Description:</Text>
        <TextInput
          style={styles.input}
          onChangeText={description => this.setState({ description })}
          value={this.state.description}
        />
        <Text>Start Date/Time:</Text>
        <TextInput style = {styles.input} value = {this.state.start+' '+ this.state.shour+ ":" + this.state.sminute + this.state.sampm} onFocus = {() => this.setState({startshow: true})}/>
        <Modal visible = {this.state.startshow}>
          <Calendar current = {new Date().toISOString()} minDate = {new Date().toISOString()} maxDate = {this.state.end} markedDates={{[this.state.start]: { selected: true, marked: true, selectedColor: 'blue'}}} onDayPress={(day) => {this.setState({start: day.dateString})}}
          />
          <Text>Start Time: </Text>
         <View style = {{flexDirection: "row"}}>
        <Picker style = {{width: 100}} selectedValue={this.state.shour}
          onValueChange={(itemValue) =>
            this.setState({shour: itemValue})}>
          <Picker.Item label="1" value={1} />
          <Picker.Item label="2" value={2} />
          <Picker.Item label="3" value={3} />
          <Picker.Item label="4" value={4} />
          <Picker.Item label="5" value={5} />
          <Picker.Item label="6" value={6} />
          <Picker.Item label="7" value={7} />
          <Picker.Item label="8" value={8} />
          <Picker.Item label="9" value={9} />
          <Picker.Item label="10" value={10} />
          <Picker.Item label="11" value={11} />
          <Picker.Item label="12" value={12} />
        </Picker>
        <Picker style = {{width: 50}}>
          <Picker.Item label=":" value= ":"/>
        </Picker>
        <Picker style = {{width: 100}} style = {{width: 100}} selectedValue={this.state.sminute}
          onValueChange={(itemValue) =>
            this.setState({sminute: itemValue})}>
          <Picker.Item label="00" value ="00" />
          <Picker.Item label="15" value = "15"/>
          <Picker.Item label="30" value = "30"/>
          <Picker.Item label="45" value = "45"/>
        </Picker>
        <Picker style = {{width: 100}} style = {{width: 100}} selectedValue={this.state.sampm}
          onValueChange={(itemValue) =>
            this.setState({sampm: itemValue})}>
          <Picker.Item label="AM" value ="AM" />
          <Picker.Item label="PM" value = "PM"/>
        </Picker>
      </View>
      <Button title= "Done" onPress = {() => {this.setState({startshow: false})}}/>
        </Modal>
        <Text>End Date/Time:</Text>
        <TextInput style = {styles.input} value = {this.state.end + ' ' + this.state.ehour + ":" + this.state.eminute + this.state.eampm} onFocus = {() => this.setState({endshow:true})}/>
        <Modal style= {{top: 100}} visible ={this.state.endshow}>
        <Text>End Date: </Text>
        <Calendar markedDates={{[this.state.end]: { selected: true, marked: true, selectedColor: 'blue'}}} current = {this.state.start} minDate = {this.state.start} onDayPress={(day) => {this.setState({end: day.dateString})}}
         />
         <Text>End Time: </Text>
         <View style = {{flexDirection: "row"}}>
        <Picker style = {{width: 100}} selectedValue={this.state.ehour}
          onValueChange={(itemValue) =>
            this.setState({ehour: itemValue})}>
          <Picker.Item label="1" value={1} />
          <Picker.Item label="2" value={2} />
          <Picker.Item label="3" value={3} />
          <Picker.Item label="4" value={4} />
          <Picker.Item label="5" value={5} />
          <Picker.Item label="6" value={6} />
          <Picker.Item label="7" value={7} />
          <Picker.Item label="8" value={8} />
          <Picker.Item label="9" value={9} />
          <Picker.Item label="10" value={10} />
          <Picker.Item label="11" value={11} />
          <Picker.Item label="12" value={12} />
        </Picker>
        <Picker style = {{width: 50}}>
          <Picker.Item label=":" value= ":"/>
        </Picker>
        <Picker style = {{width: 100}} style = {{width: 100}} selectedValue={this.state.eminute}
          onValueChange={(itemValue) =>
            this.setState({eminute: itemValue})}>
          <Picker.Item label="00" value ="00" />
          <Picker.Item label="15" value = "15"/>
          <Picker.Item label="30" value = "30"/>
          <Picker.Item label="45" value = "45"/>
        </Picker>
        <Picker style = {{width: 100}} style = {{width: 100}} selectedValue={this.state.eampm}
          onValueChange={(itemValue) =>
            this.setState({eampm: itemValue})}>
          <Picker.Item label="AM" value ="AM" />
          <Picker.Item label="PM" value = "PM"/>
        </Picker>
      </View>
      <Button title= "Done" onPress = {() => {this.setState({endshow: false})}}/>
      </Modal>
        </View>
        <Button title="Create Event" onPress={() => this.createEvent()} />
        </ScrollView>
        </KeyboardAvoidingView>
        {/* <Text>Start Time:</Text>
        <Text style = {styles.input} value = {this.state.shour+ ":" + this.state.sminute + " " + this.state.ampm}/>
        <Modal visible= {false}> */}
        {/* <View style = {{flexDirection: "row"}}>
        <Picker style = {{width: 100}} selectedValue={this.state.shour}
          onValueChange={(itemValue) =>
            this.setState({shour: itemValue})}>
          <Picker.Item label="1" value={1} />
          <Picker.Item label="2" value={2} />
          <Picker.Item label="3" value={3} />
          <Picker.Item label="4" value={4} />
          <Picker.Item label="5" value={5} />
          <Picker.Item label="6" value={6} />
          <Picker.Item label="7" value={7} />
          <Picker.Item label="8" value={8} />
          <Picker.Item label="9" value={9} />
          <Picker.Item label="10" value={10} />
          <Picker.Item label="11" value={11} />
          <Picker.Item label="12" value={12} />
        </Picker>
        <Picker style = {{width: 50}}>
          <Picker.Item label=":" value= ":"/>
        </Picker>
        <Picker style = {{width: 100}} style = {{width: 100}} selectedValue={this.state.sminute}
          onValueChange={(itemValue) =>
            this.setState({sminute: itemValue})}>
          <Picker.Item label="00" value ="00" />
          <Picker.Item label="15" value = "15"/>
          <Picker.Item label="30" value = "30"/>
          <Picker.Item label="45" value = "45"/>
        </Picker>
        <Picker style = {{width: 100}} style = {{width: 100}} selectedValue={this.state.ampm}
          onValueChange={(itemValue) =>
            this.setState({ampm: itemValue})}>
          <Picker.Item label="AM" value ="AM" />
          <Picker.Item label="PM" value = "PM"/>
        </Picker>
      </View> */}
      {/* </Modal> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: { marginTop: 15 },
  input: { height: 30, borderColor: 'gray', borderWidth: 1},
});

CreateEventScreen.navigationOptions = {
  header: null,
};
