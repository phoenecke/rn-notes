import React from 'react'
import Amplify, { Auth } from 'aws-amplify'
import { withAuthenticator } from 'aws-amplify-react-native'
import { createStackNavigator } from 'react-navigation'
import AWSAppSyncClient, { createAppSyncLink } from 'aws-appsync'
import { onError } from 'apollo-link-error'
import { ApolloLink } from 'apollo-link'
import { ApolloProvider } from 'react-apollo'
import { Rehydrated } from 'aws-appsync-react'
import { AUTH_TYPE } from 'aws-appsync/lib/link/auth-link'

import HomeScreen from './ListEvents'
import AddScreen from './AddEvent'
import aws_exports from '../aws-exports'
import appSyncConfig from '../AppSync'

// REMOVE (HOPEFULLY) WHEN RN 0.56 is out.
import { YellowBox } from 'react-native'
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated'])
YellowBox.ignoreWarnings(['Module RCTImageLoader requires'])
// REMOVE (HOPEFULLY) WHEN RN 0.56 is out.
YellowBox.ignoreWarnings(['Remote debugger is in a background tab'])

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

const onErrorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    )
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError}`)
  }
})

const appSyncLink = createAppSyncLink({
  auth: {
    type: AUTH_TYPE.AWS_IAM,
    // IAM key/secret for logged in user.
    credentials: () => Auth.currentCredentials(),
  },
  region: appSyncConfig.region,
  url: appSyncConfig.graphqlEndpoint,
})

const link = ApolloLink.from([onErrorLink, appSyncLink])

const client = new AWSAppSyncClient({}, { link })

const WithProvider = () => (
  <ApolloProvider client={client}>
    <Rehydrated>
      <RootStack />
    </Rehydrated>
  </ApolloProvider>
)

export default withAuthenticator(WithProvider)
