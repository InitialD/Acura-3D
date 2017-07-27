    // I am the easing iteration funciton. This is built on top
    // of the core animate function so that it can leverage the
    // built-in timer optimization.
jQuery.ease = function( start, end, duration, easing, callback ){
    // Create a jQuery collection containing the one element
    // that we will be animating internally.
    var easer = $( "<div>" );

    // Keep track of the iterations.
    var stepIndex = 0;

    // Get the estimated number of steps - this is based on
    // the fact that jQuery appears to use a 13ms timer step.
    //
    // NOTE: Since this is based on a timer, the number of
    // steps is estimated and will vary depending on the
    // processing power of the browser.
    var estimatedSteps = Math.ceil( duration / 13 );

    // Set the start index of the easer.
    easer.css( "easingIndex", start );

    // Animate the easing index to the final value. For each
    // step of the animation, we are going to pass the
    // current step value off to the callback.
    easer.animate(
        {
            easingIndex: end
        },
        {
            easing: easing,
            duration: duration,
            step: function( index ){
                // Invoke the callback for each step.
                callback(
                    index,
                    stepIndex++,
                    estimatedSteps,
                    start,
                    end
                );
            }
        }
    );
};


// -------------------------------------------------- //
// -------------------------------------------------- //


// Example usage: ease from start (1) to finish (100).
/*
$.ease(
    1,
    100,
    1000,
    "swing",
    function(){
        console.log( arguments );
    }
);
*/
