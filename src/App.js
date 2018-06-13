import React from 'react'
import Amplify from 'aws-amplify'
import { withAuthenticator } from 'aws-amplify-react-native'
import { createStackNavigator } from 'react-navigation'
import AWSAppSyncClient, { createAppSyncLink } from 'aws-appsync'
import { onError } from 'apollo-link-error'
import { ApolloLink } from 'apollo-link'
import { ApolloProvider } from 'react-apollo'
import { Rehydrated } from 'aws-appsync-react'

import HomeScreen from './ListEvents'
import AddScreen from './AddEvent'
import aws_exports from '../aws-exports'
import appSyncConfig from '../AppSync'

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
    apiKey: appSyncConfig.apiKey,
    type: appSyncConfig.authenticationType,
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
