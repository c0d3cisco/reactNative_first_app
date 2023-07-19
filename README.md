# Accelerometer-able Game

## User Stories

As a developer, this was my first exposure to React Native. This project was designed to interact with elements of React Native and Expo Go to create a mobile application with any purpose. I was able to create a game application that uses the phone's accelerometer to move an object around the phone. Limited authenticate functionalities were added. \

## Concept

The game is fairly simple - tilt the phone to move the ball from the top to the bottom of the screen while avoiding the spinning ball in the middle. Start by increasing the speed using the slider bar at the bottom. Touch alternating sides to get points. Logic was added to bound the ball within the phone's screens boundaries and detect collision between the moving elements. The game is over when the you hit the moving circle.\

There is limited functionality added for an authentication mechanism on the application. This feature was added as a test feature for a future project. Firebase was used as the authentication service. \

## Screenshots

Slider adjusts the speed of the circle moved by tilting the phone.\
![Screenshot 1](./assets/phoneAppAccelerometer1.GIF)

Scoring will increase the speed of the moving circle that you have to avoid.\
![Screenshot 2](./assets/phoneAppAccelerometer2.GIF)

Game over when you hit the moving circle.\
![Screenshot 3](./assets/phoneAppAccelerometer3.GIF)
