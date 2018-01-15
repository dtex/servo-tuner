const Firmata = require("firmata");
const Barcli = require("barcli");
const keypress = require("keypress");

var type = process.argv[3] || 180, 
    pin = process.argv[2] || 5,
    position = type / 2, 
    range = [750, 2250], 
    center = 1500, 
    updateFirmata,
    dutyCycle = (range[1] - range[0]) /2 + range[0];

let pwmUpper = new Barcli({ label: "PWM Upper Limit", range: [1500, 3000], value: 1000, color: "green" });
let pwmLower = new Barcli({ label: "PWM Lower Limit", range: [0, 1500], color: "red" });
let servoPosition = new Barcli({ label: "Servo Position", range: [0, type] });

updateGraph();
 
// listen for the "keypress" event 
process.stdin.on('keypress', function (ch, key) {
  if (key) {
    let multiplier = 1;
    
    if (key.shift && !key.meta) multiplier = 10;
    
    if (key.ctrl && key.name == 'c') process.exit();    
    
    if (key.name =='left') position -= multiplier;
    if (key.name =='right') position += multiplier;
    
    if (key.name =='b' && !key.shift && key.meta) position = 0;
    if (key.name =='f' && !key.shift && key.meta) position  = type;
    
    if (key.name =='up') position = type / 2;

    if (key.name =='q') range[1] -= multiplier;
    if (key.name =='e') range[1] += multiplier;
    
    if (key.name =='z') range[0] -= multiplier;
    if (key.name =='c') range[0] += multiplier;
    
    range[0] = Math.min(1500, Math.max(0, range[0]));
    range[1] = Math.min(3000, Math.max(1500, range[1]));
    position = Math.min(type, Math.max(0, position));
    dutyCycle = ((position - 0) * (range[1] - range[0]) / (type - 0) + range[0]);
    
    updateGraph();
    updateFirmata();
  }  
});

function updateGraph () {
  pwmUpper.update(range[1]);
  pwmLower.update(range[0]);
  servoPosition.update(position);
}

Firmata.requestPort(function(error, port) {
    
  if (error) {
    console.log(error);
    return;
  }

  var board = new Firmata(port.comName);

  board.on("ready", function() {
      
      updateFirmata = function() {
        board.servoConfig(pin, range[0], range[1]);
        board.servoWrite(pin, dutyCycle);
      };

      updateGraph(); 
      updateFirmata();
      instructions();
      keypress(process.stdin);
      process.stdin.setRawMode(true);
      process.stdin.resume();
  });

});

function instructions() { 
  console.log("\n\nREADY\n\n" + 
    "q / e : adjust pwmRange upper limit\n" +
    "z / c : adjust pwmRange lower limit\n" +
    "\n" +
    "left / right : adjust servo position\n" +
    "opt(alt) + left / right : servo min / max\n" +
    "up : center servo\n\n" +
    "shift + command : adjust by 10\n"
  );
}


  