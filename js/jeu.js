var Rectangle = function(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.isDragging = false;

  this.render = function(ctx) {
    ctx.save();

    ctx.beginPath();
    ctx.rect(this.x - this.width * 0.5, this.y - this.height * 0.5, this.width, this.height);
    ctx.fillStyle = '#2793ef';
    ctx.fill();

    ctx.restore();
  }
}



var RectanglePoubelle = function(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.isDragging = false;

  this.render = function(ctx) {
    ctx.save();

    ctx.beginPath();
    ctx.rect(this.x - this.width * 0.5, this.y - this.height * 0.5, this.width, this.height);
    ctx.fillStyle = 'red';
    ctx.fill();

    ctx.restore();
  }
}

var Arc = function(x, y, radius, radians) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.radians = radians;
  this.isDragging = false;

  this.render = function(ctx) {
    ctx.save();

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, this.radians, false);
    ctx.fillStyle = '#2793ef';
    ctx.fill();

    ctx.restore();
  }
}


var ArcPoubelle = function(x, y, radius, radians) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.radians = radians;
  this.isDragging = false;

  this.render = function(ctx) {
    ctx.save();

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, this.radians, false);
    ctx.fillStyle = 'green';
    ctx.fill();

    ctx.restore();
  }
}

var MouseTouchTracker = function(canvas, callback){

  function processEvent(evt) {
    var rect = canvas.getBoundingClientRect();
    var offsetTop = rect.top;
    var offsetLeft = rect.left;

    if (evt.touches) {
      return {
        x: evt.touches[0].clientX - offsetLeft,
        y: evt.touches[0].clientY - offsetTop
      }
    } else {
      return {
        x: evt.clientX - offsetLeft,
        y: evt.clientY - offsetTop
      }
    }
  }

  function onDown(evt) {
    evt.preventDefault();
    var coords = processEvent(evt);
    callback('down', coords.x, coords.y);
  }

  function onUp(evt) {
    evt.preventDefault();
    callback('up');
  }

  function onMove(evt) {
    evt.preventDefault();
    var coords = processEvent(evt);
    callback('move', coords.x, coords.y);
  }

  canvas.ontouchmove = onMove;
  canvas.onmousemove = onMove;

  canvas.ontouchstart = onDown;
  canvas.onmousedown = onDown;
  canvas.ontouchend = onUp;
  canvas.onmouseup = onUp;
}

function isHit(shape, x, y) {
  if (shape.constructor.name === 'Arc') {
    var dx = shape.x - x;
    var dy = shape.y - y;
    if (dx * dx + dy * dy < shape.radius * shape.radius) {
      return true
    }
  } else {
    if (x > shape.x - shape.width * 0.5 && y > shape.y - shape.height * 0.5 && x < shape.x + shape.width - shape.width * 0.5 && y < shape.y + shape.height - shape.height * 0.5) {
      return true;
    }
  }

  return false;
}

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth-1;
canvas.height = window.innerHeight-1;
var startX = 0;
var startY = 0;

var rectangle = new Rectangle(50, 50, 100, 100);
rectangle.render(ctx);

var circle = new Arc(200, 140, 50, Math.PI * 2);
circle.render(ctx);

var recPoubelle = new RectanglePoubelle(400, 400, 130, 130);
recPoubelle.render(ctx);

var cerclePoubelle = new ArcPoubelle(window.innerWidth-450, window.innerHeight-450, 59, Math.PI * 2);
cerclePoubelle.render(ctx);

var mtt = new MouseTouchTracker(canvas,
  function(evtType, x, y) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    switch(evtType) {

      case 'down':
        startX = x;
        startY = y;
        if (isHit(rectangle, x, y)) {
          rectangle.isDragging = true;
        }
        if (isHit(circle, x, y)) {
          circle.isDragging = true;
        }
        break;

      case 'up':
        rectangle.isDragging = false;
        circle.isDragging = false;
        break;

      case 'move':
        var dx = x - startX;
        var dy = y - startY;
        startX = x;
        startY = y;

        if (rectangle.isDragging) {
          rectangle.x += dx;
          rectangle.y += dy;
        }

        if (circle.isDragging) {
          circle.x += dx;
          circle.y += dy;
        }
        break;
    }

    if(circle.x + circle.radius <= cerclePoubelle.x && circle.x  <= cerclePoubelle.x + cerclePoubelle.radius  ){
      if(circle.y + circle.radius <= cerclePoubelle.y && circle.y  <= cerclePoubelle.y + cerclePoubelle.radius ){
        circle.render(ctx);
      }
    }
    else{
      circle = new Arc(200, 140, 50, Math.PI * 2);

      circle.render(ctx);
      rectangle.render(ctx);

      var score = parseInt(document.getElementById("score")["value"]);
      document.getElementById("score").value = score + 1;

    }


    if (!(rectangle.x < recPoubelle.x + recPoubelle.width &&
   rectangle.x + rectangle.width > recPoubelle.x &&
   rectangle.y < recPoubelle.y + recPoubelle.height &&
   rectangle.height + rectangle.y > recPoubelle.y)) {
    rectangle.render(ctx);
    circle.render(ctx);

  }
  else if((rectangle.x < recPoubelle.x + recPoubelle.width &&
        rectangle.x + rectangle.width > recPoubelle.x &&
        rectangle.y < recPoubelle.y + recPoubelle.height &&
        rectangle.height + rectangle.y > recPoubelle.y)){
    rectangle.x = 0;
    rectangle.y = 0;
    var score = parseInt(document.getElementById("score")["value"]);
    document.getElementById("score").value = score + 1;


    rectangle = new Rectangle(50, 50, 100, 100);
    rectangle.render(ctx);
  }

    if (!(circle.x < recPoubelle.x + recPoubelle.width &&
        circle.x + circle.width > recPoubelle.x &&
        circle.y < recPoubelle.y + recPoubelle.height &&
        circle.height + circle.y > recPoubelle.y)) {
      rectangle.render(ctx);
      circle.render(ctx);

    }
    else if((circle.x < recPoubelle.x + recPoubelle.width &&
        circle.x + circle.width > recPoubelle.x &&
        circle.y < recPoubelle.y + recPoubelle.height &&
        circle.height + circle.y > recPoubelle.y)){

      var score = parseInt(document.getElementById("score")["value"]);
      document.getElementById("score").value = score + 1;


      circle = new Arc(200, 140, 50, Math.PI * 2);

      circle.render(ctx);
      rectangle.render(ctx);
    }



    recPoubelle.render(ctx);
    cerclePoubelle.render(ctx);
  }
);
