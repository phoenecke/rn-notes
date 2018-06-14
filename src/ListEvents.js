import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, Text, FlatList, Button } from 'react-native'
import { compose, graphql } from 'react-apollo'
import { Auth } from 'aws-amplify'

import ListEvents from './GraphQL/ListEvents'

class EventItem extends React.Component {
  render() {
    const { name, where, when, description, identityId, id } = this.props.event
    return (
      <View style={styles.item}>
        <Text>
          Name: <Text>{name}</Text>
        </Text>
        <Text>
          Description: <Text>{description}</Text>
        </Text>
        <Text>
          Where: <Text>{where}</Text>
        </Text>
        <Text>
          When: <Text>{when}</Text>
        </Text>
        <Text>
          IdentityId: <Text>{identityId}</Text>
        </Text>
        <Text>
          Id: <Text>{id}</Text>
        </Text>
      </View>
    )
  }
}
EventItem.propTypes = {
  event: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    when: PropTypes.string.isRequired,
    where: PropTypes.string.isRequired,
    identityId: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }),
}

class ListScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Events',
      headerRight: <Button onPress={() => Auth.signOut()} title="Logout" />,
      headerLeft: (
        <Button onPress={() => navigation.navigate('Add')} title="Add" />
      ),
    }
  }

  render() {
    const { events } = this.props
    return (
      <View style={styles.container}>
        <FlatList
          style={styles.scroll}
          data={events}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <EventItem event={item} />}
        />
      </View>
    )
  }
}

ListScreen.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
    })
  ).isRequired,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  item: {
    margin: 8,
    padding: 8,
    borderBottomWidth: 1,
    borderColor: 'lightgray',
    flex: 1,
  },
  text: {
    color: 'black',
  },
})

const ListScreenWithData = compose(
  graphql(ListEvents, {
    options: {
      fetchPolicy: 'cache-and-network',
    },
    props: props => ({
      events: (props.data.listEvents && props.data.listEvents.items) || [],
    }),
  })
)(ListScreen)

export default ListScreenWithData
