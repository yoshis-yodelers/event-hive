import axios from 'axios';
import * as firebase from 'firebase';
import 'firebase/functions';
import eventBriteToken from '../../secrets';
import { FirebaseWrapper } from '../../firebase/firebase';

//import * as firebase from 'firebase';

const eventBriteData = async () => {
  const events = await axios({
    method: 'get',
    url: `https://www.eventbriteapi.com/v3/events/search/?token=${eventBriteToken}&location.latitude=40.611050&location.longitude=-73.960321&location.within=10mi`,
  });

  return events;
};

const setEventBriteData = async () => {
  const events = await eventBriteData();

  events.data.events.map(async events => {
    await FirebaseWrapper.GetInstance().CreateNewEventBriteDocument(
      'Event',
      events
    );
  });
};

export default setEventBriteData;
