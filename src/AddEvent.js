import React from 'react'
import { StyleSheet, View, Text } from 'react-native'

class AddScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Add</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default AddScreen
