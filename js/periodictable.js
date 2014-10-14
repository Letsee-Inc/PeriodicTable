var root;
var objects = [];
var targets = { table: [], sphere: [], helix: [], grid: [] };
var isFirst = true;

var touchX;
var touchY;

var timeoutId = null;

function initButton() {
	var button = document.getElementById('table');
	button.addEventListener('click', function(event) {
		transform("table", 2000);
	}, false);

	var button = document.getElementById('sphere');
	button.addEventListener('click', function(event) {
		transform("sphere", 2000);
	}, false);

	var button = document.getElementById('helix');
	button.addEventListener('click', function(event) {
		transform("helix", 2000);
	}, false);

	var button = document.getElementById('grid');
	button.addEventListener('click', function(event) {
		transform("grid", 2000);
	}, false);
}

function createPeriodic() {
	root = new THREE.Object3D();
	root.scale.set(0.2, 0.2, 0.2);
	Letsee.Renderer.addChildObject("targets/periodictable", root);

	for (var i = 0; i < table.length; i++) {
		var item = table[ i ];

		var element = document.createElement('div');
		element.className = 'element';
		element.style.backgroundColor = 'rgba(0,127,127,' + ( Math.random() * 0.5 + 0.25 ) + ')';

		var number = document.createElement('div');
		number.className = 'number';
		number.textContent = i + 1;
		element.appendChild(number);

		var symbol = document.createElement('div');
		symbol.className = 'symbol';
		symbol.textContent = item[ 0 ];
		element.appendChild(symbol);

		var details = document.createElement('div');
		details.className = 'details';
		details.innerHTML = item[ 1 ] + '<br>' + item[ 2 ];
		element.appendChild(details);

		var object = new THREE.CSS3DObject(element);
		object.position.x = Math.random() * 4000 - 2000;
		object.position.y = Math.random() * 4000 - 2000;
		object.position.z = Math.random() * 4000 - 2000;

		root.add(object);
		objects.push(object);
	}

	// table
	for (var i = 0; i < objects.length; i++) {
		var item = table[ i ];
		var object = new THREE.Object3D();
		object.position.x = ( item[ 3 ] * 160 ) - 1540;
		object.position.y = -( item[ 4 ] * 200 ) + 1100;

		targets.table.push(object);
	}

	// sphere
	var vector = new THREE.Vector3();
	for (var i = 0, l = objects.length; i < l; i++) {

		var phi = Math.acos(-1 + ( 2 * i ) / l);
		var theta = Math.sqrt(l * Math.PI) * phi;

		var object = new THREE.Object3D();

		object.position.x = 1000 * Math.cos(theta) * Math.sin(phi);
		object.position.y = 1000 * Math.sin(theta) * Math.sin(phi);
		object.position.z = 1000 * Math.cos(phi);

		vector.copy(object.position).multiplyScalar(2);
		object.lookAt(vector);
		targets.sphere.push(object);
	}

	// helix
	var vector = new THREE.Vector3();
	for (var i = 0, l = objects.length; i < l; i++) {
		var phi = i * 0.175 + Math.PI;
		var object = new THREE.Object3D();
		object.position.x = 1100 * Math.sin(phi);
		object.position.y = -( i * 8 ) + 450;
		object.position.z = 1100 * Math.cos(phi);

		vector.copy(object.position);
		vector.x *= 2;
		vector.z *= 2;

		object.lookAt(vector);
		targets.helix.push(object);
	}

	// grid
	for (var i = 0; i < objects.length; i++) {
		var object = new THREE.Object3D();
		object.position.x = ( ( i % 5 ) * 400 ) - 800;
		object.position.y = ( -( Math.floor(i / 5) % 5 ) * 400 ) + 800;
		object.position.z = ( Math.floor(i / 25) ) * 1000 - 2000;

		targets.grid.push(object);
	}

	transform("table", 100);
}

function transform(type, duration) {
	TWEEN.removeAll();

	var temp_targets;
	if (type === "table") {
		temp_targets = targets.table;

	} else if (type === "sphere") {
		temp_targets = targets.sphere;

	} else if (type === "helix") {
		temp_targets = targets.helix;

	} else if (type === "grid") {
		temp_targets = targets.grid;

	}

	for (var i = 0, len = objects.length; i < len; i++) {
		var object = objects[ i ];
		var target = temp_targets[ i ];

		new TWEEN.Tween(object.position)
			.to({ x: target.position.x, y: target.position.y, z: target.position.z }, (0.5 - Math.random()) * (duration / 2) + duration)
			.easing(TWEEN.Easing.Exponential.InOut)
			.start();

		new TWEEN.Tween(object.rotation)
			.to({ x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, (0.5 - Math.random()) * (duration / 2) + duration)
			.easing(TWEEN.Easing.Exponential.InOut)
			.start();
	}

	//new TWEEN.Tween( this ).to( {}, duration * 2 ).start();
}

function onDocumentTouchStart(event) {
	event.preventDefault();
	if (event.touches.length === 1) {
		var touch = event.touches[ 0 ];
		touchX = touch.screenX;
		touchY = touch.screenY;
	}
}

function onDocumentTouchMove(event) {
	event.preventDefault();

	if (event.touches.length === 1) {
		var touch = event.touches[ 0 ];
		var x = touch.screenX - touchX;
		var y = touch.screenY - touchY;

		var mX = new THREE.Matrix4();
		mX.makeRotationX(y * 0.005);
		var mY = new THREE.Matrix4();
		mY.makeRotationY(x * 0.005);

		var m = new THREE.Matrix4();
		m.multiplyMatrices(mX, mY);

		var mQ = new THREE.Quaternion();
		mQ.setFromRotationMatrix(m);

		mQ.multiply(root.quaternion);
		root.quaternion.copy(mQ);

		touchX = touch.screenX;
		touchY = touch.screenY;
	}
}

function animate() {
	TWEEN.update();
	timeoutId = setTimeout(animate, 34);
}