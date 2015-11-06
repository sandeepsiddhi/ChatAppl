// Extend an existing object with a method from another
function augment( receivingClass, givingClass ) {
    // only provide certain methods
    if ( arguments[2] ) {
        for ( var i = 2, len = arguments.length; i < len; i++ ) {
            receivingClass.prototype[arguments[i]] = givingClass.prototype[arguments[i]];
        }
    }
    // provide all methods
    else {
        for ( var methodName in givingClass.prototype ) {
            // check to make sure the receiving class doesn't
            // have a method of the same name as the one currently
            // being processed
            if ( !Object.hasOwnProperty.call(receivingClass.prototype, methodName) ) {
                receivingClass.prototype[methodName] = givingClass.prototype[methodName];
            }
            
            // Alternatively (check prototype chain as well):
            // if ( !receivingClass.prototype[methodName] ) {
            //      receivingClass.prototype[methodName] = givingClass.prototype[methodName];
            // }
        }
    }
}
 
var Mixin  = function() {}
Mixin.prototype = {
  moveUp: function(){
    console.log( "move up" );
  },
  moveDown: function(){
    console.log( "move down" );
  },
  stop: function(){
    console.log( "stop! right now!" );
  }
};

// A skeleton carAnimator constructor
function CarAnimator() {
  this.moveLeft = function(){
    console.log( "move left" );
  };
}
 
// A skeleton personAnimator constructor
function PersonAnimator(){
  this.moveRandomly = function(){
    console.log("This is random")
  };
}

augment(CarAnimator, Mixin);
augment(PersonAnimator, Mixin);

// Create a new instance of carAnimator
var myAnimator = new CarAnimator();
myAnimator.moveLeft();
myAnimator.moveDown();
myAnimator.stop();

var pAnimation = new PersonAnimator();
pAnimation.moveDown();
pAnimation.moveRandomly();