import React from 'react';
import {
  Alert,
  Modal,
  Platform,
  KeyboardAvoidingView,
  Picker,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
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
      categoryshow: false,
      category: '',
      description: '',
      ehour: 1,
      eminute: '00',
      end: '',
      endshow: false,
      name: '',
      startshow: false,
      start: '',
      shour: 1,
      sminute: '00',
      venue: '',
    };
  }

  async createEvent() {
    try {
      const boop = this.state.shour;
      const beep = this.state.ehour;
      Alert.alert('Event Created!');
      await FirebaseWrapper.GetInstance().CreateNewDocument('Event', {
        category: this.state.category,
        name: this.state.name,
        description: this.state.description,
        createdBy: firebase.auth().currentUser.uid,
        start:
          this.state.sampm === 'AM'
            ? this.state.start + 'T' + boop + ':' + this.state.sminute + "00"
            : this.state.start + 'T' + (boop + 12) + ':' + this.state.sminute + "00",
        end:
          this.state.eampm === 'AM'
            ? this.state.end + 'T' + beep + ':' + this.state.eminute + "00"
            : this.state.end + 'T' + (beep + 12) + ':' + this.state.eminute + "00",
      });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <View>
        <View>
          <Text style={styles.text}>Create New Event</Text>
        </View>
        <KeyboardAvoidingView>
          <ScrollView>
            <View style={styles.view}>
              <Text style={styles.text}>Category:</Text>
              <TextInput
                style={styles.input}
                onFocus={() => this.setState({ categoryshow: true })}
                value={this.state.category}
              />
              <Modal visible={this.state.categoryshow}>
              <View style = {{paddingTop: 20}}>
              <View
                    style={{
                      justifyContent: 'space-between',
                      paddingHorizontal: 10,
                      flexDirection: 'row',
                    }}
                  >
                    <Button
                      title="Back"
                      onPress={() => {
                        this.setState({ categoryshow: false });
                      }}
                    />
                    <Button
                      title="Done"
                      onPress={() => {
                        this.setState({ categoryshow: false });
                      }}
                    />
                  </View>
                <Picker
                  selectedValue={this.state.category}
                  onValueChange={itemValue =>
                    this.setState({ category: itemValue })
                  }
                >
                  <Picker.Item label="Business" value="101" />
                  <Picker.Item label="Science & Tech" value="102" />
                  <Picker.Item label="Music" value="103" />
                  <Picker.Item label="Film & Media" value="104" />
                  <Picker.Item label="Performing & Visual Arts" value="105" />
                  <Picker.Item label="Fashion" value="106" />
                  <Picker.Item label="Health" value="107" />
                  <Picker.Item label="Sports & Fitness" value="108" />
                  <Picker.Item label="Travel & Outdoor" value="109" />
                  <Picker.Item label="Food & Drink" value="110" />
                  <Picker.Item label="Charity & Causes" value="111" />
                  <Picker.Item label="Government" value="112" />
                  <Picker.Item label="Community" value="113" />
                  <Picker.Item label="Spirituality" value="114" />
                  <Picker.Item label="Family & Education" value="115" />
                  <Picker.Item label="Holiday" value="116" />
                  <Picker.Item label="Home & Lifestyle" value="117" />
                  <Picker.Item label="Auto, Boat & Air" value="118" />
                  <Picker.Item label="Hobbies" value="119" />
                  <Picker.Item label="School Activities" value="120" />
                  <Picker.Item label="Larping" value="121" />
                  <Picker.Item label="Other" value="199" />
                </Picker>
                </View>
              </Modal>
              <Text style={styles.text}>Event Name:</Text>
              <TextInput
                style={styles.input}
                onChangeText={name => this.setState({ name })}
                value={this.state.name}
              />
              <Text style={styles.text}>Event Description:</Text>
              <TextInput
                style={styles.input}
                onChangeText={description => this.setState({ description })}
                value={this.state.description}
              />
              <Text style={styles.text}>Start Date/Time:</Text>
              <TextInput
                style={styles.input}
                value={
                  this.state.start.length > 2
                    ? this.state.start +
                      ' ' +
                      this.state.shour +
                      ':' +
                      this.state.sminute +
                      this.state.sampm
                    : ''
                }
                onFocus={() => this.setState({ startshow: true })}
              />
              <Modal visible={this.state.startshow}>
                <View style={{ top: 20 }}>
                  <View
                    style={{
                      justifyContent: 'space-between',
                      paddingHorizontal: 10,
                      flexDirection: 'row',
                    }}
                  >
                    <Button
                      title="Back"
                      onPress={() => {
                        this.setState({ startshow: false });
                      }}
                    />
                    <Button
                      title="Done"
                      onPress={() => {
                        this.setState({ startshow: false });
                      }}
                    />
                  </View>
                  <Text style={styles.text}>Start Date:</Text>
                  <Calendar
                    current={new Date().toISOString()}
                    minDate={new Date().toISOString()}
                    maxDate={this.state.end}
                    markedDates={{
                      [this.state.start]: {
                        selected: true,
                        marked: true,
                        selectedColor: 'blue',
                      },
                    }}
                    onDayPress={day => {
                      this.setState({ start: day.dateString });
                    }}
                  />
                  <Text style={styles.text}>Start Time: </Text>
                  <View style={{ flexDirection: 'row' }}>
                    <Picker
                      style={{ width: 100 }}
                      selectedValue={this.state.shour}
                      onValueChange={itemValue =>
                        this.setState({ shour: itemValue })
                      }
                    >
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
                    <Picker style={{ width: 50 }}>
                      <Picker.Item label=":" value=":" />
                    </Picker>
                    <Picker
                      style={{ width: 100 }}
                      style={{ width: 100 }}
                      selectedValue={this.state.sminute}
                      onValueChange={itemValue =>
                        this.setState({ sminute: itemValue })
                      }
                    >
                      <Picker.Item label="00" value="00" />
                      <Picker.Item label="15" value="15" />
                      <Picker.Item label="30" value="30" />
                      <Picker.Item label="45" value="45" />
                    </Picker>
                    <Picker
                      style={{ width: 100 }}
                      style={{ width: 100 }}
                      selectedValue={
                        this.state.start.length > 2 ? this.state.sampm : ''
                      }
                      onValueChange={itemValue =>
                        this.setState({ sampm: itemValue })
                      }
                    >
                      <Picker.Item label="AM" value="AM" />
                      <Picker.Item label="PM" value="PM" />
                    </Picker>
                  </View>
                </View>
              </Modal>
              <Text style={styles.text}>End Date/Time:</Text>
              <TextInput
                style={styles.input}
                value={
                  this.state.end.length > 2
                    ? this.state.end +
                      ' ' +
                      this.state.ehour +
                      ':' +
                      this.state.eminute +
                      this.state.eampm
                    : ''
                }
                onFocus={() => this.setState({ endshow: true })}
              />
              <Modal visible={this.state.endshow}>
                <View style={{ top: 20 }}>
                  <View
                    style={{
                      justifyContent: 'space-between',
                      paddingHorizontal: 10,
                      paddingBottom: 10,
                      flexDirection: 'row',
                    }}
                  >
                    <Button
                      title="Back"
                      onPress={() => this.setState({ endshow: false })}
                    />
                    <Button
                      title="Done"
                      onPress={() => {
                        this.setState({ endshow: false });
                      }}
                    />
                  </View>
                  <Text style={{ fontSize: 17, fontWeight: 'bold' }}>
                    End Date:{' '}
                  </Text>
                  <Calendar
                    markedDates={{
                      [this.state.end]: {
                        selected: true,
                        marked: true,
                        selectedColor: 'blue',
                      },
                    }}
                    current={this.state.start}
                    minDate={this.state.start}
                    onDayPress={day => {
                      this.setState({ end: day.dateString });
                    }}
                  />
                  <Text style={styles.text}>End Time: </Text>
                  <View style={{ flexDirection: 'row' }}>
                    <Picker
                      style={{ width: 100 }}
                      selectedValue={this.state.ehour}
                      onValueChange={itemValue =>
                        this.setState({ ehour: itemValue })
                      }
                    >
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
                    <Picker style={{ width: 50 }}>
                      <Picker.Item label=":" value=":" />
                    </Picker>
                    <Picker
                      style={{ width: 100 }}
                      style={{ width: 100 }}
                      selectedValue={this.state.eminute}
                      onValueChange={itemValue =>
                        this.setState({ eminute: itemValue })
                      }
                    >
                      <Picker.Item label="00" value="00" />
                      <Picker.Item label="15" value="15" />
                      <Picker.Item label="30" value="30" />
                      <Picker.Item label="45" value="45" />
                    </Picker>
                    <Picker
                      style={{ width: 100 }}
                      style={{ width: 100 }}
                      selectedValue={
                        this.state.start.length > 2 ? this.state.eampm : ''
                      }
                      onValueChange={itemValue =>
                        this.setState({ eampm: itemValue })
                      }
                    >
                      <Picker.Item label="AM" value="AM" />
                      <Picker.Item label="PM" value="PM" />
                    </Picker>
                  </View>
                </View>
              </Modal>
            </View>
            <Button title="Create Event" onPress={() => this.createEvent()} />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: { marginTop: 15, paddingBottom: 20 },
  input: { height: 30, borderColor: 'gray', borderWidth: 1 },
  text: { fontSize: 17, fontWeight: 'bold', paddingTop: 15 },
});
