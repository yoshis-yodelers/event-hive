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
    try {
      const events = await axios({
        method: 'get',
        url: `https://www.eventbriteapi.com/v3/events/search/?token=${eventBriteToken}&location.latitude=${latitude}&location.longitude=${longitude}&location.within=10mi`,
      });
      return events;
    } catch (error) {
      console.log(error);
    }
  }

  async SetEventBriteData(latitude, longitude) {
    try {
      const foundEvents = await this.EventBriteData(latitude, longitude);
      foundEvents.data.events.map(async events => {
        await FirebaseWrapper.GetInstance().CreateNewEventBriteDocument(
          'Event',
          events
        );
      });
    } catch (error) {
      console.log(error);
    }
  }

  async GetLocationData(venue) {
    try {
      if (venue) {
        const location = await axios({
          method: 'get',
          url: `https://www.eventbriteapi.com/v3/venues/${venue}/?token=${eventBriteToken}`,
        });
        return location.data;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async SetLocationData() {
    try {
      const venues = await FirebaseWrapper.GetInstance().GetVenueFromFirestore();

      venues.map(async venue => {
        const locations = await this.GetLocationData(venue);

        await FirebaseWrapper.GetInstance().GetVenues('Venue', locations);
      });
    } catch (error) {
      console.log(error);
    }
  }
}
