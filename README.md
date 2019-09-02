![Picture1](https://user-images.githubusercontent.com/35347667/64083745-22d44780-ccf2-11e9-9f81-96c4d21fdfd5.png)

# EventHive

EventHive is an event-based social media app that aims to connect people that are interested in attending the same events.

## Installation

After forking/cloning the repo, to install dependencies run:

```bash
npm install
```

Then create your [Eventbrite API Token](https://www.eventbrite.com/platform), and in the root of the project create a secrets.js file, that should like like this:

```javascript
const eventBriteToken = YourEventBriteTokenHere;

export default eventBriteToken;
```

## Usage

```bash
npm start
```

This will open a browser window from Expo, that will allow you to open the app in either an Android or iOS simulator. To get the experience on your phone, download Expo Client from the App Store (available on both platforms) and scan the QR code.

For the best experience using this app, we recommend running this on iOS simulator, or your iPhone with Expo Client.

## Technologies

- [React Native](https://facebook.github.io/react-native/) with [Expo](https://expo.io/tools) - With React Native we were able to build an app that functions on both iOS and Android, and with Expo we were able to test and see our app function before deploying.
- [Firebase](https://firebase.google.com/) - Worked as our backend server, connecting our database to the front-end, as well as providing a simple OAuth solution for our login.
- [Cloud Firestore](https://firebase.google.com/docs/firestore) - A flexible NoSQL database that updates in real-time, allowing us to continuously add new features to our app without worrying about redesigning our database models.
- [Eventbrite API]() - Populated our database with local events so that users can see real events happening around them.


## Contributors

<table>
  <tr>
    <td align="center"><a href="https://github.com/djchinia"><img src="https://avatars1.githubusercontent.com/u/6266179?s=400&v=4" width="120px;" alt="Dan Chiniara"/><br /><sub><b>Dan Chiniara</b></sub><br /></a></td>
    <td align="center"><a href="https://github.com/StartsAtZero"><img src="https://media.licdn.com/dms/image/C4D03AQHTsZ5DwNrc9Q/profile-displayphoto-shrink_800_800/0?e=1573084800&v=beta&t=wjG8JrZvKVBWTu_jZ26e6_SzBRjYZWtdRWoNocXkaCU" width="120px;" alt="Ally Lobova"/><br /><sub><b>Ally (Lobova)Smirnov</b></sub></a></td>
    <td align="center"><a href="https://github.com/AnnaYWu"><img src="https://media.licdn.com/dms/image/C4D03AQFKDHxjqkdUyQ/profile-displayphoto-shrink_800_800/0?e=1573084800&v=beta&t=1DwcY6SN1RaS38gNsHunM9qSdAdLjujKvK72uINEMTM" width="120px;" alt="Anna Wu"/><br /><sub><b>Anna Wu</b></sub></a></td>
    <td align="center"><a href="https://github.com/jkirpalani"><img src="https://avatars3.githubusercontent.com/u/49246700?s=400&v=4" width="120px;" alt="Johnny Kirpalani"/><br /><sub><b>Johnny Kirpalani</b></sub></a></td>
  </tr>
</table>

## License

[MIT](https://choosealicense.com/licenses/mit/)
