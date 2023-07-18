import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, useWindowDimensions, Image } from 'react-native';
import { Accelerometer } from 'expo-sensors';


export default function App() {
  const { width, height } = useWindowDimensions();
  const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [subscription, setSubscription] = useState(null);
  const [dx, setDx] = useState(width / 2);
  const [dy, setDy] = useState(height / 2);

  const _slow = () => Accelerometer.setUpdateInterval(1000);
  const _fast = () => Accelerometer.setUpdateInterval(100);

  const _subscribe = () => {
    setSubscription(Accelerometer.addListener(setData));
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  useEffect(() => {
    setDx(dx + x * 10);
    setDy(dy - y * 10);
    console.log('x-position:', dx, 'y-position:',  dy);
  }, [x, y]);

  return (
    <View style={styles.container}>
      <View>
        <Image style={{
          borderRadius: 50,
          height: 100,
          width: 100,
          top: dy,
          left: dx,
          backgroundColor: 'black',
          zIndex: 1,
          transform: [{ rotate: `${z * 180 / Math.PI}deg` }],
        }}
          source={require('./assets/coolRed.jpeg')}
        />
      </View>
      {/* <Text style={styles.text}>Accelerometer: (in gs where 1g = 9.81 m/s^2)</Text>
      <Text style={styles.text}>x: {x}</Text>
      <Text style={styles.text}>y: {y}</Text>
      <Text style={styles.text}>z: {z}</Text> */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={subscription ? _unsubscribe : _subscribe} style={styles.button}>
          <Text>{subscription ? 'On' : 'Off'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={_slow} style={[styles.button, styles.middleButton]}>
          <Text>Slow</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={_fast} style={styles.button}>
          <Text>Fast</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    // display: 'relative',
  },
  text: {
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 15,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
});
