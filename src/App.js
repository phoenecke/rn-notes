import React from 'react'
import Amplify from 'aws-amplify'
import { withAuthenticator } from 'aws-amplify-react-native'
import { createStackNavigator } from 'react-navigation'

import HomeScreen from './ListEvents'
import AddScreen from './AddEvent'
import aws_exports from '../aws-exports'

Amplify.configure(aws_exports)

const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    Add: AddScreen,
  },
  {
    initialRouteName: 'Home',
  }
)

class App extends React.Component {
  render() {
    return <RootStack />
  }
}

export default withAuthenticator(App)
