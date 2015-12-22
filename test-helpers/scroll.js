

(function(document){

  function findParentScroller(element) {
    while (element && !element.scrollable) {
      element = element.parentNode;
    }
    return element && element.scrollable;
  }

  /*
    Passing numbers to targetX or targetY will enforce element scroll to this positions.
    Passing any other value, will make the function ignore this axis.
  */
  function scrollElementIntoPosition(selector, targetX, targetY, callback) {
    var errorPrefix = "Impossible to scrollElementIntoPosition: ";

    var targetElement = document.querySelector(selector);

    if (!targetElement) {
      return callback(new Error(errorPrefix+'Element `'+selector+'` not found'));
    }

    var scroller = findParentScroller(targetElement);
    if (!scroller || !scroller.scrollTo) {
      return callback(new Error(errorPrefix+'Element `'+selector+'` not inside a Scrollable <Scroller>'));
    }
    var scrollTo = scroller.scrollTo;

    var elementAtPosition = false;
    var elementAtPositionY = false;
    var elementAtPositionX = false;
    var reachedBoundary = false;

    var currentY = 0;
    var currentX = 0;
    var incrementY = 0;
    var incrementX = 0;

    function goToElement(callback) {
      var goingX = currentX + incrementX;
      var goingY = currentY + incrementY;
      scrollTo(goingX, goingY);
      currentY = scroller.scrollTop;
      currentX = scroller.scrollLeft;
      if (currentY !== goingY || currentX !== goingX) {
        reachedBoundary = true;
      }

      var pos = targetElement.getBoundingClientRect();
      var posY = pos.top;
      var posX = pos.left;
      if (typeof targetY !== 'number') {
        incrementY = 0;
        elementAtPositionY = true;
      } else if(posY === targetY) {
        elementAtPositionY = true;
      } else if(posY > targetY) {
        incrementY = 50;
      } else if(posY < targetY) {
        incrementY = -1;
      }
      if (typeof targetX !== 'number') {
        incrementX = 0;
        elementAtPositionX = true;
      } else if(posX === targetX) {
        elementAtPositionX = true;
      } else if(posX > targetX) {
        incrementX = 50;
      } else if(posX < targetX) {
        incrementX = -1;
      }

      elementAtPosition = elementAtPositionY && elementAtPositionX;

      if (!reachedBoundary && !elementAtPosition) {
        requestAnimationFrame(function() {
          goToElement(callback);
        });
      } else {
        if (callback) {
          if (elementAtPosition) {
            callback(null);
          }
          if (reachedBoundary) {
            callback(new Error(errorPrefix+'Reached scroll boundary and element was never at positions '+targetX+','+targetY));
          }
        }
      }
    }

    goToElement(callback);
  }

  if (typeof module !== 'undefined') {
    module.exports = {
      scrollElementIntoPosition: scrollElementIntoPosition,
    };
  }
  if (typeof window !== 'undefined') {
    window.ScrollTestHelper = {
      scrollElementIntoPosition: scrollElementIntoPosition,
    };
  }

})(document);


