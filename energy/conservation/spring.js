var spring = function () {
  var pause = true;

  var physics = {
    gravX: 0,
    gravY: 0,
    restitution: 0,
    airFriction: 1,
    equalibrium: 385,
    width: 590,
    height: 120,
    k: 0.8,
    turns: 3 + 6 * Math.sqrt(0.8)
  };

  function mass(x, y, Vx, Vy, r, fillColor) {
    //constructor function that determines how masses work
    this.x = x;
    this.y = y;
    this.Vx = Vx;
    this.Vy = Vy;
    this.r = r;
    this.mass = Math.PI * this.r * this.r * 0.01; //pi r squared * density
    this.energy = 0;
    this.ke = 0;
    this.pe = 0;
    this.u = 0;
    this.fillColor = fillColor;
    this.draw = function () {
      //SVG draw
      document.getElementById("spring-ball").setAttribute("r", this.r);
      document.getElementById("spring-ball").setAttribute("cx", this.x + this.r);
      document.getElementById("spring-ball").setAttribute("cy", this.y);
    };
    this.drawSpring = function () {
      let d = `M ${box.x} ${physics.height/2}`;
      for (var i = 1; i < physics.turns + 1; i++) {
        d += `L ${(box.x) * (1 - i / physics.turns)} ${ box.y + (i % 2 === 0 ? 10 : -10)}`;
      }
      document.getElementById("spring-wire").setAttribute("d", d);
      document.getElementById("spring-wire").setAttribute("stroke-width", 1 + physics.k * 0.5);
      // document.getElementById("spring-wire-2").setAttribute("stroke-width", 0.7 + physics.k * 0.04);
    };
    this.move = function () {
      this.x += this.Vx;
      this.y += this.Vy;
      this.Vx *= physics.airFriction;
      this.Vy *= physics.airFriction;
    };
    this.edges = function () {
      if (this.x < this.r) {
        this.Vx *= -physics.restitution;
        this.x = this.r;
      }
    };
    this.gravity = function () {
      this.Vx += physics.gravX;
      this.Vy += physics.gravY;
    };
    this.spring = function () {
      this.Vx += (physics.k * (physics.equalibrium - this.x)) / 60 / this.mass;
    };
    this.springInfo = function () {
      var speed2 = this.Vx * this.Vx + this.Vy * this.Vy;
      this.ke = 0.5 * this.mass * speed2;
      // var F = -physics.k * (this.x - physics.equalibrium);
      this.u = 0.5 * physics.k * (this.x - physics.equalibrium) * (this.x - physics.equalibrium);
      this.ke = 0.5 * this.mass * this.Vx * this.Vx * 60;
      var E = this.ke + this.u;
      //draw energy bars
      document.getElementById("spring-KE-bar").style.width = 100 * (this.ke / E) + "%"
      document.getElementById("spring-Us-bar").style.width = 100 * (this.u / E) + "%"
      document.getElementById("spring-KE").innerHTML = "K&nbsp;&nbsp; = ½mv² = " + (this.ke / 1000).toFixed(1) + " kJ"
      document.getElementById("spring-Us").innerHTML = "Us = ½kx² &nbsp;= " + (this.u / 1000).toFixed(1) + " kJ"
      document.getElementById("spring-x").innerHTML = "x = " + (this.x - physics.equalibrium).toFixed(0) + " m"
    };
  }

  var box = new mass(230, physics.height / 2, 0, 0, 45, "#bbb");
  document.getElementById("spring-m-slider").value = document.getElementById("spring-m").value = Math.round(box.mass);
  document.getElementById("spring-k-slider").value = document.getElementById("spring-k").value = physics.k;

  const pauseID = document.getElementById("pause1")
  pauseID.addEventListener("click", () => {
    if (pause) {
      pause = false;
      pauseID.innerText = "pause"
      render();
    } else {
      pause = true;
      pauseID.innerText = "play"
    }
  });

  //on click move to mouse
  const SVGID = document.getElementById("spring-SVG");
  SVGID.addEventListener("mousedown", (event) => {
    //gets mouse position, even when scaled by CSS
    const cWidth = SVGID.clientWidth || SVGID.parentNode.clientWidth
    box.x = event.offsetX * physics.width / cWidth;
    box.Vx = 0;
    cycle();
  });


  //get values for spring constant
  document.getElementById("spring-k").addEventListener("input", () => {
    physics.k = document.getElementById("spring-k").value;
    document.getElementById("spring-k-slider").value = physics.k
    // box.Vx = 0;
    // physics.turns = 3 + 6 * Math.sqrt(physics.k);
    box.springInfo();
    box.drawSpring();
    box.draw();
  });
  document.getElementById("spring-k-slider").addEventListener("input", () => {
    physics.k = document.getElementById("spring-k-slider").value;
    document.getElementById("spring-k").value = physics.k
    // box.Vx = 0;
    // physics.turns = 3 + 6 * Math.sqrt(physics.k);
    box.springInfo();
    box.drawSpring();
    box.draw();
  });


  //gets values for mass
  document.getElementById("spring-m").addEventListener("input", () => {
    box.mass = document.getElementById("spring-m").value;
    document.getElementById("spring-m-slider").value = box.mass
    box.r = Math.sqrt(box.mass / Math.PI / 0.01);
    box.springInfo();
    box.drawSpring();
    box.draw();
  });
  document.getElementById("spring-m-slider").addEventListener("input", () => {
    box.mass = document.getElementById("spring-m-slider").value;
    document.getElementById("spring-m").value = box.mass
    box.r = Math.sqrt(box.mass / Math.PI / 0.01);
    box.springInfo();
    box.drawSpring();
    box.draw();
  });

  function cycle() {
    box.edges();
    box.spring();
    box.move();
    box.springInfo();
    box.drawSpring();
    box.draw();
  }
  cycle()
  window.requestAnimationFrame(render);

  function render() {
    //repeating animation function
    if (!pause) {
      window.requestAnimationFrame(render);
      cycle();
    }
  }
};
spring()