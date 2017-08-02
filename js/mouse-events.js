function onMouseMove() {
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	raycaster.setFromCamera(mouse, camera);

	var intersects = raycaster.intersectObjects(hotspotMeshes, true);

	if (intersects.length > 0){
		if (appendedPlane || !teleportingPlane.loaded)
			return;
		for (var i=0; i<particleHotspots.length; i++){
			if (intersects[0].object == particleHotspots[i].mesh){
				particleHotspots[i].highlight(COLORS.LightBlue);
			}
		}
		var mousePos = intersects[0].point;
		var angle = Math.atan(mousePos.x/mousePos.z); //where is the sphere?
		var posX, posY, posZ; //final position of the appearing panel
		posX = Math.cos(angle + 2*Math.PI/12) * 500;
		posZ = Math.sin(angle + 2*Math.PI/12) * 500;
		posY = 100;
		teleportingPlane.mesh.position.set(mousePos.x, mousePos.y + 100, mousePos.z);
		teleportingPlane.mesh.rotation.y = angle;
		scene.add(teleportingPlane.mesh);

		var cur = {opacity: 0};
		var target = {opacity: 1};
		var tween = new TWEEN.Tween(cur).to(target, 150);
		tween.onUpdate(function(){
			teleportingPlane.mesh.material.opacity = cur.opacity;
		});
		tween.start();

		appendedPlane = true;
	}
}