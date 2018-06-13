import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, Text, FlatList } from 'react-native'
import { compose, graphql } from 'react-apollo'

import ListEvents from './GraphQL/ListEvents'

class EventItem extends React.Component {
  render() {
    const { name, where, when, description, identityId } = this.props.event
    return (
      <View>
        <Text>{name}</Text>
        <Text>{description}</Text>
        <Text>{where}</Text>
        <Text>{when}</Text>
        <Text>{identityId}</Text>
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
  }),
}

class ListScreen extends React.Component {
  render() {
    const { events } = this.props
    return (
      <View style={styles.container}>
        <FlatList
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
    alignItems: 'center',
    justifyContent: 'center',
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
