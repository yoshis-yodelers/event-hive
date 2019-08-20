import axios from 'axios';
import * as firebase from 'firebase';
import 'firebase/functions';
import eventBriteToken from '../secrets';
import { FirebaseWrapper } from './firebase';

export class EventBrite {
  constructor() {
    this.longitude = null;
    this.latitude = null;
  }

  async EventBriteData(latitude, longitude) {
    const events = await axios({
      method: 'get',
      url: `https://www.eventbriteapi.com/v3/events/search/?token=${eventBriteToken}&location.latitude=${latitude}&location.longitude=${longitude}&location.within=10mi`,
    });

    return events;
  }

  async SetEventBriteData(latitude, longitude) {
    const events = await this.EventBriteData(latitude, longitude);

    events.data.events.map(async events => {
      await FirebaseWrapper.GetInstance().CreateNewEventBriteDocument(
        'Event',
        events
      );
    });
  }
}
