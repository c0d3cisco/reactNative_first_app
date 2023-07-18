import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, useWindowDimensions, Image } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import * as Haptics from 'expo-haptics';
import Slider from '@react-native-community/slider';


export default function App() {
  const { width, height } = useWindowDimensions();
  const [sliderValue, setSliderValue] = useState(0);  
  const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [subscription, setSubscription] = useState(null);
  const [dx, setDx] = useState(width / 2);
  const [dy, setDy] = useState(height / 2);

  const _sliderSpeed = (value) => {
    Accelerometer.setUpdateInterval(16)
    setSliderValue(value)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  };

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
    setDx(dx + x * sliderValue);
    setDy(dy - y * sliderValue);
  }, [x, y]);

  useEffect(() => {
    console.log('dx', dx);
    console.log('dy', dy);
  }, [dx, dy]);


  return (
    <View style={styles.container}>
      <Slider
        onValueChange={(value) => {
        _sliderSpeed(value);
        console.log(value)

        }}
        step={1}
        maximumValue={15}
        minimumValue={0}
        style={pageViewPositionSlider.style}
        thumbTintColor={pageViewPositionSlider.thumbColor}
        maximumTrackTintColor={pageViewPositionSlider.trackColor}
        minimumTrackTintColor={pageViewPositionSlider.trackColor}
      />
      <View>
        <Image style={{
          borderRadius: 50,
          height: 100,
          width: 100,
          top: dy,
          left: dx,
          backgroundColor: 'black',
          zIndex: 1,
        }}
          source={require('./assets/coolRed.jpeg')}
        />
      </View>
    </View>
  );
}

const pageViewPositionSlider = {
  trackColor: '#ABABAB',
  thumbColor: '#1411AB',
  style: {
    width: '100%',
    bottom: '-90%',
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
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