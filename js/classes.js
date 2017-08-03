function ParticleObject(geometry, color, size){
  
  //PUSH VERTICES OF GEOMETRY TO A BUFFER GEOMETRY, AS NEEDED TO DEFINE CUSTOM ATTRIBUTES

  var gunVertexCount = geometry.vertices.length;
  var sphereVertexCount = SPHERE_VERTICES.length;
  var geom = new THREE.BufferGeometry();
  geom.fromGeometry(geometry); //defines the position attribute for us, along with others
  var vertices = [];

  //DEFINE ANGLE ATTRIBUTE

  var angles = new Float32Array(vertices.length);
  for (var i=0; i<vertices.length; i++){
    var angle = Math.random() * 2 * Math.PI;
    angles[i] = angle;
  }

  geom.addAttribute('angle', new THREE.BufferAttribute(angles, 1));

  //CREATE TYPED ARRAYS TO MAKE THEM ATTRIBUTES. EACH ARRAY CONTAINS SAME # OF VERTICES

  var targetVertices = new Float32Array(gunVertexCount * 3);

  //DEFINE TARGET POSITION ATTRIBUTE

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
    magnitude : { type : 'f', value : 0.}
  };

  var particleMat = new THREE.ShaderMaterial({
    wireframe: true,
    transparent: true,
    uniforms : uniforms,
    vertexShader : document.getElementById('vertexShader').textContent,
    fragmentShader : document.getElementById('fragmentShader').textContent
  });

  //CREATE MESH

  var particleGlobe = new THREE.Mesh(geom, particleMat);

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
    var targetVertices = geometry.vertices;
    var geom = this.mesh.geometry;
    for (var i=0; i<targetVertices.length; i++){
      var target = targetVertices[i];
      var index = i*3;

      //UPDATE TARGET VERTICES
      geom.attributes['targetPosition'].array[index] = target.x;
      geom.attributes['targetPosition'].array[index+1] = target.y;
      geom.attributes['targetPosition'].array[index+2] = target.z;

      geom.attributes['targetPosition'].needsUpdate = true;
    }

    this.mesh.material.uniforms['amplitude'].value = 0.0;

    var _this = this;
    var cur = {amplitude : 0.};
    var target = {amplitude : 1.0 };
    var tween = new TWEEN.Tween(cur).to(target, 1500);
    tween.easing(TWEEN.Easing.Elastic.Out);

    tween.onComplete(function(){
       //UPDATE "CURRENT" POSITION BUFFER, SO THE STARTING POINT ISN'T SAME AS BEFORE. MUST BE CALLED AFTER TWEEN IS DONE
       for (var i=0; i<targetVertices.length; i++){
        var target = targetVertices[i];
        var index = i*3;

        //UPDATE TARGET VERTICES
        geom.attributes['position'].array[index] = target.x;
        geom.attributes['position'].array[index+1] = target.y;
        geom.attributes['position'].array[index+2] = target.z;

        geom.attributes['position'].needsUpdate = true;
      }
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





