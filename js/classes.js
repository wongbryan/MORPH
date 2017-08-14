function ParticleObject(geometry, color, size){

  var geom = new THREE.BufferGeometry();
  geom.fromGeometry(geometry); //defines the position attribute for us, along with others

  var vertexCount = geom.attributes['position'].count;

  //DEFINE POSITION ATTRIBUTE (Done for us)

  geom.attributes['position'].dynamic = true;

  //DEFINE ANGLE ATTRIBUTE

  var angles = new Float32Array(MAX_VERTICES);

  for (var i=0; i<vertexCount; i++){
    var angle = Math.random() * 2 * Math.PI;
    angles[i] = angle;
  }

  geom.addAttribute('angle', new THREE.BufferAttribute(angles, 1));

  //DEFINE TARGET POSITION ATTRIBUTE

  geom.addAttribute('targetPosition', TARGET_BUFFERS.Array[1]); //transform
  geom.attributes['targetPosition'].dynamic = true;

  //DEFINE UNIFORMS AND SHADER MATERIAL

  var texture = new THREE.TextureLoader().load('assets/rgb texture.png');
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  var uniforms = {
    time : { type : 'f', value : 0.0 },
    amplitude : { type : 'f', value : 0.05 }, //how far along the morph it is
    color : { type : 'v3', value : COLORS.Red},
    magnitude : { type : 'f', value : 1.},
    opacity : { type : 'f', value : 1.}
  };

  var particleMat = new THREE.ShaderMaterial({
    wireframe: true,
    transparent: true,
    uniforms : uniforms,
    vertexShader : document.getElementById('vertexShader').textContent,
    fragmentShader : document.getElementById('fragmentShader').textContent
  });

  //CREATE MESH

  var particleGlobe = new THREE.Points(geom, particleMat);

  this.mesh = particleGlobe;

  this.speed = 1;

  this.hoverPoints = function(){
      if(!this.autoHover)
        return;

      var vertices = this.mesh.geometry.vertices;
      var p, angle, tick = this.tick;
      for (var i=0; i<vertices.length; i++){
        this.angles[i]+= this.speed*2*tick;
        p = vertices[i];
        p.x += this.speed*.0025*Math.cos(this.angles[i]);
        p.y += this.speed*.0025*Math.sin(this.angles[i]);
        p.z += this.speed*.0025*Math.sin(this.angles[i]);
        this.mesh.geometry.verticesNeedUpdate = true;
      }
  }

  this.highlight = function(color){
    var curColor = this.mesh.material.uniforms['color'].value;
    var targetColor = color;

    var _this = this;

    var tween = new TWEEN.Tween(curColor).to(targetColor, 150);

    tween.start();
  }

  this.morph = function(targetBufferAttribute){ //pass in a geometry
    //GET TARGET
    var targetVertices = geometry.vertices;

    //GET CURRENT GEOMETRY, CREATE A NEW ARRAY TO HOLD TARGETS
    //Create a new array in case the next geometry has a different # of vertices
    var geom = this.mesh.geometry;
    var currentVertexCount = geom.attributes['position'].count;
  
    geom.attributes['targetPosition'] = targetBufferAttribute;
    geom.attributes['targetPosition'].needsUpdate = true;

    this.mesh.material.uniforms['amplitude'].value = 0.0;

    var _this = this;
    var cur = {amplitude : 0.};
    var target = {amplitude : 1.0 };
    var tween = new TWEEN.Tween(cur).to(target, 1500);
    tween.easing(TWEEN.Easing.Elastic.Out);

    tween.onComplete(function(){
      geom.attributes['position'] = targetBufferAttribute;
      geom.attributes['position'].needsUpdate = true;
    });

    tween.onUpdate(function(){
      _this.mesh.material.uniforms['amplitude'].value = cur.amplitude;
    });
    tween.start();

  }

  this.update = function(){
    if (this.mesh.material.uniforms['amplitude'].value > 1.00 || this.mesh.material.uniforms['amplitude'].value < 0.00)
      MORPH_SPEED = -MORPH_SPEED;
    this.mesh.material.uniforms['amplitude'].value += MORPH_SPEED;
    // this.mesh.rotation.y += .0025*this.speed*this.speed*this.speed;
    // this.mesh.rotation.x += .0025*this.speed*this.speed*this.speed;
  }
}

function ForceField(rockGeometry, radius, tubeWidth){
  var torusGeom = new THREE.TorusGeometry(radius, tubeWidth, 64, 64);
  var sphereGeom = new THREE.SphereGeometry(5, 64, 64);
  var geom = new THREE.BufferGeometry();
  geom.fromGeometry(torusGeom);

  var texture = new THREE.TextureLoader().load('assets/rgb texture.png');
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  var mat = new THREE.ShaderMaterial({
    // wireframe: true,
    transparent: true,
    uniforms : {
      time : { type : 'f', value : 0.0 },
      opacity : { type : 'f', value : .2},
      amplitude : { type : 'f', value : 5.},
      speed : { type : 'f', value : 1000. },
      pointSize : { type : 'f', value : 2.0},
      color : { type : 'v3', value : new THREE.Color(0xffffff)}
    },
    vertexShader : document.getElementById('forceVertex').textContent,
    fragmentShader : document.getElementById('forceFragment').textContent
  });

  var cubeGeom = new THREE.BoxGeometry(1, 1, 1);
  var rockMat = new THREE.MeshPhongMaterial({
    color : 0xffffff,
    specular : COLORS.DarkRed,
    transparent: true,
    opacity: .95
  });
  var s = 4;
  var cube = new THREE.Mesh(cubeGeom, rockMat);
  cube.scale.set(s, s, s);

  var rock = new THREE.Mesh(rockGeometry, rockMat);
  rock.scale.set(s, s, s);

  var mesh = new THREE.Mesh(geom, mat);

  var group = new THREE.Group();
  group.add(mesh);
  group.add(rock);

  this.mesh = group;
  this.mesh.nodeObject = this;
  this.angle = Math.random() * 2 * Math.PI;
  this.hoverSpeed = 1.5 + Math.random() * 2.5;
  this.amp = .1 + Math.random() * .1;

  this.horAmp = this.amp;
  this.horSpeed = this.hoverSpeed*20;
  this.horAngle = this.angle;

  this.animate = function(){
    console.log('click');
  }

  this.update = function(){
    this.mesh.children[0].material.uniforms.time.value += .0005;

    this.angle += this.hoverSpeed*.005;
    this.mesh.position.y += this.amp*Math.sin(this.angle);

    this.horAngle += this.horSpeed*.005;
    this.horAmp = this.amp*(Math.sin(this.angle)+1)/2;
    this.mesh.position.x += this.horAmp*Math.cos(this.horAngle);
  }
}




