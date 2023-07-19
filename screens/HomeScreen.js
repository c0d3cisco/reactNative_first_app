import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, useWindowDimensions, Image, Alert, Modal, Pressable, TouchableOpacity } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from './LoginScreen';
import { Accelerometer } from 'expo-sensors';
import * as Haptics from 'expo-haptics';
import Slider from '@react-native-community/slider';
// import picture from '../assets/coolRed.jpeg'

const logout = async () => {
  await signOut(auth)
}

export default function Game() {
  const [modalVisible, setModalVisible] = useState(false);
  const { width, height } = useWindowDimensions();
  const [sliderValue, setSliderValue] = useState(0);
  const [otherElementCirclePosition, setOtherElementCirclePosition] = useState({
    x: width / 2,
    y: height / 2,
  });

  const [score, setScore] = useState(0);
  const [sideTicker, setSideTicker] = useState(0);
  const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [subscription, setSubscription] = useState(null);
  const [dx, setDx] = useState(0);
  const [dy, setDy] = useState(0);

  const _sliderSpeed = (value) => {
    Accelerometer.setUpdateInterval(16);
    setSliderValue(value);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
    if (!modalVisible) {
      if (dy - y * sliderValue > -40 && dy - y * sliderValue < 784) {
        if (dy > 740 && sideTicker === 0) {
          setScore(score + 1);
          setSideTicker(1);
        }
        if (dy < 0 && sideTicker === 1) {
          setScore(score + 1);
          setSideTicker(0);
        }
        setDy(dy - y * sliderValue);
      }
      if (dx + x * sliderValue > -21 && dx + x * sliderValue < 310) {
        setDx(dx + x * sliderValue);
      }

      const imageCircle = {
        x: dx + 50, // Assuming image center x-coordinate
        y: dy + 50, // Assuming image center y-coordinate
        radius: 50, // Assuming image radius
      };

      const otherElementCircle = {
        x: otherElementCirclePosition.x + 25, // Assuming other element center x-coordinate
        y: otherElementCirclePosition.y + 25, // Assuming other element center y-coordinate
        radius: 25, // Assuming other element radius
      };

      const isCollision = checkCircleCollision(imageCircle, otherElementCircle);

      if (isCollision) {
        console.log('Collision detected!', dx);
        setScore(0);
        setDx(0);
        setDy(0);
        setModalVisible(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      }
    }
  }, [x, y, otherElementCirclePosition]);

  

  useEffect(() => {
    // Function to move the otherElementCircle in a figure-eight pattern
    const moveInFigureEight = () => {
      const amplitudeX = width * 0.3; // Adjust the amplitude for the figure-eight pattern in the x-axis
      const amplitudeY = height * 0.3; // Adjust the amplitude for the figure-eight pattern in the y-axis
      const speed = 0.0002 * score; // Adjust the speed of movement

      const newPositionX =
        width / 2 + Math.sin(speed * Date.now()) * amplitudeX - 60; // Calculate the new x-coordinate based on time and amplitude
      const newPositionY =
        height / 2 + Math.sin(2 * speed * Date.now()) * amplitudeY - 60; // Calculate the new y-coordinate based on time and amplitude

      setOtherElementCirclePosition({ x: newPositionX, y: newPositionY });
    };

    const animationInterval = setInterval(moveInFigureEight, 16); // Adjust the interval duration as needed

    return () => {
      clearInterval(animationInterval);
    };
  }, [score]);

  function checkCircleCollision(circleA, circleB) {
    const dx = circleA.x - circleB.x;
    const dy = circleA.y - circleB.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const sumOfRadii = circleA.radius + circleB.radius;

    return distance < sumOfRadii;
  }

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>YOU LOST!</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Try Again</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Text style={{ margin: '10%', textAlign: 'center', fontSize: 30, fontWeight: 'bold', zIndex: 2, position: 'absolute' }}>
        Score: {score}
      </Text>
      <TouchableOpacity
						onPress={logout}
						style={styles.button1}
					>
						<Text style={styles.buttonText}>Logout</Text>
					</TouchableOpacity>
      <Slider
        onValueChange={(value) => {
          _sliderSpeed(value);
          console.log(value);
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
        <View //this is the main circle
          style={[
            styles.imageContainer,
            { top: dy, left: dx, borderColor: 'red' },
          ]}
        >
          <Image
            style={styles.image}
            source={require('../assets/coolRed.jpeg')}
          />
        </View>
        <View
          style={[
            styles.imageContainerB,
            { top: otherElementCirclePosition.y, left: otherElementCirclePosition.x, borderColor: 'blue' },
          ]}
        >
          <Image
            style={styles.imageB}
            source={require('../assets/coolRed.jpeg')}
          />
        </View>
      </View>
    </View>
  );
}

const pageViewPositionSlider = {
  trackColor: '#ABABAB',
  thumbColor: '#1411AB',
  style: {
    alignItems: 'center',
    width: '90%',
    bottom: '-90%',
    left: '5%',
    zIndex: 100,
  },
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    paddingHorizontal: 20,
  },
  imageContainer: {
    position: 'absolute',
    borderRadius: 50,
    height: 100,
    width: 100,
    borderWidth: 2,
    zIndex: 1,
  },
  image: {
    borderRadius: 50,
    height: 100,
    width: 100,
    backgroundColor: 'black',
  },
  button1: {
    backgroundColor: '#0782F9',
    width: '25%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    position: 'absolute',
    top: '5%',
    right: '5%',
    // justifyContent: 'center',
  },
  imageContainerB: {
    position: 'absolute',
    borderRadius: 25,
    height: 50,
    width: 50,
    borderWidth: 2,
    zIndex: 1,
  },
  imageB: {
    borderRadius: 25,
    height: 50,
    width: 50,
    backgroundColor: 'black',
  },
  modalView: {
    top: '200%',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
