# servo-tuner

A simple command line utility to help find the ideal pwm range for a servo using nodejs and an Arduino. The ideal PWM range for a servo varies by manufacturer and the default PWM range varies by library and micro controller. This tool will help you which PWM range is best for your servo.

Calibrating your servo and fine tuning the PWM range is critical for projects that use inverse kinematics or require exact positioning.

## Installation

You will need [nodejs](https://nodejs.org). 

Download and extract the zip file or clone this repo:
````bash
git clone https://github.com/dtex/servo-tuner
````

Install dependencies
````bash
npm install
````

Make sure you are running a firmata variant on your Arduino:
1. In the Arduino IDE under "File" select Examples>Firmata>StandardFirmata (any variation of Firmata should work)
2. Make sure the right port is selected under "Tools"
3. Make sure the right board is selected under "Tools"
4. Click "Upload"

## Usage

Wire up your arduino, power supply and servo.

![Attached servo](/assets/servo_bb.png?raw=true "Optional Title")

For a standard 180° servo on pin 5 just run

````
node index
````

If you need to use a different pin on the Arduino you can pass that as a parameter:

````bash
// 180 degree servo on pin 9
node index 9
````

If you have a non-180 degree servo you can pass the servo's range as a second parameter:

````bash
// 90° servo on pine 5
node index 5 90

// 8 turn winch servo on pin 11
node index 11 2880
````

### Find the Lower Limit of the PWM Range
The servo will start at the midpoint. Move it to the minimum value by pressing ```opt + left```. 

Press ```shift + z``` to reduce the lower limit of the PWM range in increments of 10. Do this until the servo stops responding or the servo begins to behave in an unexpected manner (i.e. it moves further than it should, or starts slowly panning). Move it back the other way by pressing ```shift + c``` until it begins to behave as it should.

Now do the same using just ```z``` and ```c``` to adjust the low end of the PWM range in increments of 1 find the exact limit.

### Find the Upper Limit of the PWM Range
Move the servo to its maximum value by pressint ```opt + right```.

Repeat the incrmental trial and error process using ```shift + e```, ```shift + q```, ```e```, and ```q```.

### Test It
Use ```opt + left```, ```up```, and ```opt.right``` to test the range of the servo. This is ideally done with a servo protractor. If you are getting more than the expected range on your servo you can fine tune the PWM range. If on the other hand you are still getting less than the expected range you probably just have a crappy servo.

### Using What You've Learned

In firmata.js:

````js
board.on("ready", function() {
    // Don't use board.pinMode(5, board.MODES.SERVO);
    board.servoConfig(5, <PWM Lower Limit>, <PWM Upper Limit>);
});
````

In Johnny-Five:
````js
new five.Servo({
    pin: 5,
    pwmRange: [<PWM Lower Limit>, <PWM Upper Limit>]
});
````





