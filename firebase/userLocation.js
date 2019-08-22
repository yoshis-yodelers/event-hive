import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';

export class UserLocation {
  _getLocationAsync = async () => {
    try {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        return 'Permission to access location was denied';
      } else {
        let location = await Location.getCurrentPositionAsync({});
        return [location.coords.latitude, location.coords.longitude];
      }
    } catch (error) {
      console.log(error);
    }
  };
}
