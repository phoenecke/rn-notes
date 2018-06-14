import React from 'react'
import PropTypes from 'prop-types'
import uuid from 'uuid/v4'
import { StyleSheet, View, TextInput, Button } from 'react-native'
import { compose, graphql } from 'react-apollo'
import { Auth } from 'aws-amplify'

import CreateEvent from './GraphQL/CreateEvent'
import ListEvents from './GraphQL/ListEvents'

class AddScreen extends React.Component {
  static navigationOptions = ({
    navigation: {
      state: { params },
    },
  }) => {
    return {
      title: 'New Event',
      headerRight: (
        <Button
          disabled={!(params && params.canSave)}
          onPress={() => params.handleSave()}
          title="Save"
        />
      ),
    }
  }

  state = {
    name: '',
  }

  componentDidMount() {
    this.props.navigation.setParams({
      handleSave: this.saveEvent,
      canSave: false,
    })
  }

  saveEvent = async () => {
    await this.props.onAdd(this.state)
    this.props.navigation.goBack()
  }

  inputChange = change => {
    this.setState(change, () => {
      // This is an annoying piece of react-navigation... is there a better way?
      // I want the header to render like a child like any other component and pass in props...
      const { name, description, when, where } = this.state
      this.props.navigation.setParams({
        canSave:
          name !== '' && description !== '' && when !== '' && where !== '',
      })
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          value={this.state.name}
          onChangeText={name => this.inputChange({ name })}
          style={styles.input}
          placeholder="Name"
          autoFocus
        />
        <TextInput
          value={this.state.description}
          onChangeText={description => this.inputChange({ description })}
          style={styles.input}
          placeholder="Description"
        />
        <TextInput
          value={this.state.when}
          onChangeText={when => this.inputChange({ when })}
          style={styles.input}
          placeholder="When"
        />
        <TextInput
          value={this.state.where}
          onChangeText={where => this.inputChange({ where })}
          style={styles.input}
          placeholder="Where"
        />
      </View>
    )
  }
}

AddScreen.propTypes = {
  navigation: PropTypes.shape({
    setParams: PropTypes.func,
    goBack: PropTypes.func,
  }),
  onAdd: PropTypes.func.isRequired,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 8,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 8,
    padding: 8,
  },
})

export default compose(
  graphql(CreateEvent, {
    options: {
      refetchQueries: [{ query: ListEvents }],
      update: (proxy, { data: { createEvent } }) => {
        const query = ListEvents
        const data = proxy.readQuery({ query })

        data.listEvents.items = [
          ...data.listEvents.items.filter(event => event.id !== createEvent.id),
          createEvent,
        ]

        proxy.writeQuery({ query, data })
      },
    },
    props: ({ mutate }) => ({
      onAdd: async event => {
        const { id } = await Auth.currentUserInfo()
        return mutate({
          optimisticResponse: {
            __typename: 'Mutation',
            createEvent: {
              __typename: 'Event',
              ...event,
              id: uuid(),
              identityId: id,
              comments: [],
            },
          },
          variables: event,
        })
      },
    }),
  })
)(AddScreen)
