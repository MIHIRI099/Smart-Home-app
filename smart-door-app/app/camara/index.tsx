import React from 'react';
import { View, StyleSheet, Image, Dimensions, TouchableOpacity, Text } from 'react-native';

const App = () => {
  const { height } = Dimensions.get('window');

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'http://lahiru174.ddns.net:8000/video/video_feed' }}
        style={[styles.image, { height: (height * 3) / 4 }]}
      />
      <TouchableOpacity style={styles.button} onPress={() => alert('Open the door')}>
        <Text style={styles.buttonText}>Open the door</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    resizeMode: 'contain', // Adjust based on how you want to fit the image
  },
  button: {
    width: '80%',
    padding: 15,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;
