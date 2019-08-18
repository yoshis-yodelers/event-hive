import axios from 'axios';

//import * as firebase from 'firebase';

const eventBriteData = async () => {
  const events = await axios({
    method: 'get',
    url: `https://www.eventbriteapi.com/v3/events/search/?token=4R4UTIKUMCKNEBVXVVMR&location.latitude=40.611050&location.longitude=-73.960321&location.within=10mi`,
  });

  return events;
};

export default eventBriteData;
