function ParticleObject(geometry, color, size){

  var geom = new THREE.BufferGeometry();
  geom.fromGeometry(geometry); //defines the position attribute for us, along with others

  var vertexCount = geom.attributes['position'].count;
  var initialTargetVertexCount = SPHERE_VERTICES.length;

  //DEFINE POSITION ATTRIBUTE (Done for us)

  geom.attributes['position'].dynamic = true;

  //DEFINE ANGLE ATTRIBUTE

  var angles = new Float32Array(vertexCount);
  for (var i=0; i<vertexCount; i++){
    var angle = Math.random() * 2 * Math.PI;
    angles[i] = angle;
  }

  geom.addAttribute('angle', new THREE.BufferAttribute(angles, 1));

  //DEFINE TARGET POSITION ATTRIBUTE

  var targetVertices = new Float32Array(vertexCount * 3);

  for (var i=0; i<SPHERE_VERTICES.length; i++){
    var target = SPHERE_VERTICES[i];
    var index = i*3; //for every vertex, move forward 3 spots in targetPositions array

    targetVertices[index] = target.x;
    targetVertices[index+1] = target.y;
    targetVertices[index+2] = target.z;
  }

  geom.addAttribute('targetPosition', new THREE.BufferAttribute(targetVertices, 3)); //sphere
  geom.attributes['targetPosition'].dynamic = true;

  //DEFINE UNIFORMS AND SHADER MATERIAL

  var texture = new THREE.TextureLoader().load('assets/rgb texture.png');
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  var uniforms = {
    time : { type : 'f', value : 0.0 },
    amplitude : { type : 'f', value : 0.0 }, //how far along the morph it is
    color : { type : 'v3', value : COLORS.Black},
    magnitude : { type : 'f', value : 5.},
    opacity : { type : 'f', value : .1}
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

  this.morph = function(geometry){ //pass in a geometry
    
    //GET CURRENT GEOMETRY, CREATE A NEW ARRAY TO HOLD TARGETS
    //Create a new array in case the next geometry has a different # of vertices

    var geom = this.mesh.geometry;
    var currentVertices = geom.attributes['position'].array;
    var currentVertexCount = geom.attributes['position'].count;

    //GET TARGET
    var targetVertices = geometry.vertices;
    var targetVertexCount = targetVertices.length;
    var newTargets = new Float32Array(targetVertexCount * 3);

    for (var i=0; i<targetVertices.length; i++){
      var target = targetVertices[i];
      var index = i*3;

      //UPDATE TARGET VERTICES
      newTargets[index] = target.x;
      newTargets[index+1] = target.y;
      newTargets[index+2] = target.z;
    }

    //IF TARGET.LENGTH, CHANGE POSITION

    var newPositionArray = new Float32Array(targetVertexCount * 3);
    var duplicatesIndex = 0;
    var index = 0;

    for (var i=0; i<targetVertexCount; i++){
      if (i >= currentVertexCount){ //ONCE PASS MAX # OF VERTICES, FILL WITH DUPLICATE POINTS
        if (duplicatesIndex >= currentVertexCount)
          duplicatesIndex = 0;
        newPositionArray[index] = currentVertices[duplicatesIndex];
        newPositionArray[index+1] = currentVertices[duplicatesIndex+1];
        newPositionArray[index+2] = currentVertices[duplicatesIndex+2];
        duplicatesIndex += 3;
      }

      newPositionArray[index] = currentVertices[index];
      newPositionArray[index+1] = currentVertices[index+1];
      newPositionArray[index+2] = currentVertices[index+2];

      index += 3;
    }

    console.log(newPositionArray);

    geom.attributes['position'] = new THREE.BufferAttribute(newPositionArray, 3);
    geom.attributes['position'].dynamic = true;
    geom.attributes['position'].needsUpdate = true;

    geom.attributes['targetPosition'] = new THREE.BufferAttribute(newTargets, 3);
    geom.attributes['targetPosition'].dynamic = true;
    geom.attributes['targetPosition'].needsUpdate = true;

    this.mesh.material.uniforms['amplitude'].value = 0.0;

    var _this = this;
    var cur = {amplitude : 0.};
    var target = {amplitude : 1.0 };
    var tween = new TWEEN.Tween(cur).to(target, 1500);
    tween.easing(TWEEN.Easing.Elastic.Out);

    tween.onComplete(function(){
      // console.log(geom.attributes['position'].count);
      // console.log(newTargets.length/3);
      // geom.attributes['position'].dynamic = true;
      // geom.attributes['position'] = new THREE.BufferAttribute(newTargets, 3);
      // geom.attributes['position'].count = newTargets.length/3;
      // geom.attributes['position'].needsUpdate = true;

      var angles = new Float32Array(targetVertexCount);
      for (var i=0; i<targetVertexCount; i++){
        var angle = Math.random() * 2 * Math.PI;
        angles[i] = angle;
      }

      geom.attributes['angle'] = new THREE.BufferAttribute(angles, 1);
      geom.attributes['angle'].dynamic = true;
      geom.attributes['angle'].needsUpdate = true;
    });

    tween.onUpdate(function(){
      _this.mesh.material.uniforms['amplitude'].value = cur.amplitude;
    });
    tween.start();

  }

  this.update = function(){
    this.mesh.material.uniforms['time'].value += .1;
    this.mesh.rotation.y += .0025*this.speed*this.speed*this.speed;
    this.mesh.rotation.x += .0025*this.speed*this.speed*this.speed;
  }
}





