
// menentukan variabel objek
var renderer, scene, camera, pointLight, spotLight;

// menentukan field variabel
var fieldWidth = 400, fieldHeight = 200;

// menentukan variabel Balok
var BalokWidth, BalokHeight, BalokDepth, BalokQuality;
var Balok1DirY = 0, Balok2DirY = 0, BalokSpeed = 5;

// menentukan Bola variabel
var Bola, Balok1, Balok2;
var BolaDirX = 1, BolaDirY = 1, BolaSpeed = 4;

// menentukan awal score
var score1 = 0, score2 = 0;
//menentukan maksimal score
var maxScore = 10;

// mengatur tingkat kepekaan musuh (0 - easiest, 1 - hardest)
var difficulty = 1;


function setup()
{
	// memperbaharui skor sesuai dengan max score
	document.getElementById("winnerBoard").innerHTML = "First to " + maxScore + " wins!";

	// mengatur score awal user dan CPU
	score1 = 0;
	score2 = 0;

	//memanggil fungsi untuk membuat scene dan objek 3D
	createScene();

	//memanggil fungsi draw
	draw();
}

function createScene()
{
	// mengatur ukuran scene
	var WIDTH = 640,
	  HEIGHT = 360;

	// mengatur view camera
	var VIEW_ANGLE = 50,
	  ASPECT = WIDTH / HEIGHT,
	  NEAR = 0.1,
	  FAR = 10000;

	var c = document.getElementById("gameCanvas");

	// membuat WebGL renderer, camera dan scene
	renderer = new THREE.WebGLRenderer();
	camera =
	  new THREE.PerspectiveCamera(
		VIEW_ANGLE,
		ASPECT,
		NEAR,
		FAR);

	scene = new THREE.Scene();

	// menambahkan camera ke scene
	scene.add(camera);

	// mengatur posisi awal kamera
	camera.position.z = 320;

	// memulai merender
	renderer.setSize(WIDTH, HEIGHT);
	c.appendChild(renderer.domElement);

	// mengatur alas tempat bermain
	var planeWidth = fieldWidth,
		planeHeight = fieldHeight,
		planeQuality = 10;

	// membuat material balok1
	var Balok1Material =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0x1B32C0
		});
	// membuat material balok2
	var Balok2Material =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0xFF4045
		});
	// membuat material alas bermain
	var planeMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0x4BD121
		});
	// membuat material meja
	var MejaMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0x111111
		});
	// membuat material lantai
	var lantaiMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0x888888
		});


	// membuat objek alas bermain
	var plane = new THREE.Mesh(

	  new THREE.PlaneGeometry(
		planeWidth * 0.95,	//menentukan lebar alas 95% dari lebar meja agar terlihat batas pantulan
		planeHeight,
		planeQuality,
		planeQuality),

	  planeMaterial);

	scene.add(plane);
	plane.receiveShadow = true;

	// membuat objek meja
	var Meja = new THREE.Mesh(

	  new THREE.CubeGeometry(
		planeWidth * 1.05,
		planeHeight * 1.03,	100,
		planeQuality,
		planeQuality,
		1),

	  MejaMaterial);
	Meja.position.z = -51;
	scene.add(Meja);
	Meja.receiveShadow = true;

// menentukan ukuran bola
	var radius = 5,
		segments = 6,
		rings = 6;

	// membuat material bola
	var sphereMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0xD43001
		});

	// membuat bola
	Bola = new THREE.Mesh(

	  new THREE.SphereGeometry(
		radius,
		segments,
		rings),

	  sphereMaterial);

	// menambahkan bola ke scene
	scene.add(Bola);

	Bola.position.x = 0;
	Bola.position.y = 0;

	// mengatur posisi bola agar berada di atas meja
	Bola.position.z = radius;
	Bola.receiveShadow = true;
    Bola.castShadow = true;

	//menentukan ukuran balok
	BalokWidth = 10;
	BalokHeight = 15;
	BalokDepth = 10;
	BalokQuality = 1;

//membuat balok1
	Balok1 = new THREE.Mesh(

	  new THREE.CubeGeometry(
		BalokWidth,
		BalokHeight,
		BalokDepth,
		BalokQuality,
		BalokQuality,
		BalokQuality),

	  Balok1Material);

		// mengatur posisi balok agar berada di atas meja
	scene.add(Balok1);
	Balok1.receiveShadow = true;
    Balok1.castShadow = true;

//membuat balok2
	Balok2 = new THREE.Mesh(

	  new THREE.CubeGeometry(
		BalokWidth,
		BalokHeight,
		BalokDepth,
		BalokQuality,
		BalokQuality,
		BalokQuality),

	  Balok2Material);

	// menambahkan balok ke scene
	scene.add(Balok2);
	Balok2.receiveShadow = true;
    Balok2.castShadow = true;

	// pengatur batas pergerakan kiri kanan balok
	Balok1.position.x = -fieldWidth/2 + BalokWidth;
	Balok2.position.x = fieldWidth/2 - BalokWidth;

	// memperbesar balok jika sudah sampai batas pergerakan
	Balok1.position.z = BalokDepth;
	Balok2.position.z = BalokDepth;

//membuat lantai
	var lantai = new THREE.Mesh(

	  new THREE.CubeGeometry(
	  1000,
	  1000,
	  3,
	  1,
	  1,
	  1 ),

	  lantaiMaterial);
  // menentukan posisi lantai
	lantai.position.z = -132;
	lantai.receiveShadow = true;
	scene.add(lantai);

	// Membuat Penerangan
	pointLight =
	  new THREE.PointLight(0xF8D898);

	// set its position
	pointLight.position.x = -1000;
	pointLight.position.y = 0;
	pointLight.position.z = 1000;
	pointLight.intensity = 2.9;
	pointLight.distance = 10000;
	// menambahkan penerangan dalam permainan
	scene.add(pointLight);

	// menambahkan lampu mengikuti bola

    spotLight = new THREE.SpotLight(0xF8D898);
    spotLight.position.set(0, 0, 460);
    spotLight.intensity = 1.5;
    spotLight.castShadow = true;
    scene.add(spotLight);


	renderer.shadowMapEnabled = true;
}

function draw()
{
	// membuat fungsi render pada permainan
	renderer.render(scene, camera);

	requestAnimationFrame(draw);

	PergerakanBola();
	PergerakanBalok();
	PergerakanKamera();
	PergerakanBalokUser();
	PergerakanBalokCPU();
}

function PergerakanBola()
{// jika bola masuk ke sisi User
	if (Bola.position.x <= -fieldWidth/2)
	{
			// menambah nilai score CPU
		score2++;
		document.getElementById("scores").innerHTML = score1 + "-" + score2;
		// reset posisi bola
		resetBola(2);
		matchScoreCheck();
	}

	// Jika bola masuk ke sisi CPU
	if (Bola.position.x >= fieldWidth/2)
	{
		// Menambah nilai score User
		score1++;
		document.getElementById("scores").innerHTML = score1 + "-" + score2;
		// reset posisi bola
		resetBola(1);
		matchScoreCheck();
	}

	// memantulkan bola jika menyentuh sisi kiri
	if (Bola.position.y <= -fieldHeight/2)
	{
		BolaDirY = -BolaDirY;
	}
	//  memantulkan bola jika menyentuh sisi kiri
	if (Bola.position.y >= fieldHeight/2)
	{
		BolaDirY = -BolaDirY;
	}

	//memperbarui posisi bola
	Bola.position.x += BolaDirX * BolaSpeed;
	Bola.position.y += BolaDirY * BolaSpeed;

// menaikan kecepatan bola 2x jika bola memantul kiri kanan
	if (BolaDirY > BolaSpeed * 2)
	{
		BolaDirY = BolaSpeed * 2;
	}
	else if (BolaDirY < -BolaSpeed * 2)
	{
		BolaDirY = -BolaSpeed * 2;
	}
}

// membuat logika CPU dan pergerakanya
function PergerakanBalokCPU()
{
	// mengatur bola jika menyentuh balok
	Balok2DirY = (Bola.position.y - Balok2.position.y) * difficulty;
// logika pergerakan balok CPU
	if (Math.abs(Balok2DirY) <= BalokSpeed)
	{
		Balok2.position.y += Balok2DirY;
	}
	else
	{
		if (Balok2DirY > BalokSpeed)
		{
			Balok2.position.y += BalokSpeed;
		}
		else if (Balok2DirY < -BalokSpeed)
		{
			Balok2.position.y -= BalokSpeed;
		}
	}
	// membuat balok akan membesar jika sudah ada pada batas sisi
	Balok2.scale.y += (1 - Balok2.scale.y) * 0.2;
}


// membuat logika CPU dan pergerakanya
function PergerakanBalokUser()
{
	// bergerak ke kiri jika menekan tombol A
	if (Key.isDown(Key.A))
	{
	// jika balok tidak menyentuh sisi meja balok bergerak
		if (Balok1.position.y < fieldHeight * 0.45)
		{
			Balok1DirY = BalokSpeed * 0.5;
		}
// jika balok menyentuh sisi meja maka balok akan diam dan membesar
		else
		{
			Balok1DirY = 0;
			Balok1.scale.z += (10 - Balok1.scale.z) * 0.2;
		}
	}
	//bergerak ke kanan jika menekan tombol D
	else if (Key.isDown(Key.D))
	{
		// jika balok tidak menyentuh sisi meja balok bergerak
		if (Balok1.position.y > -fieldHeight * 0.45)
		{
			Balok1DirY = -BalokSpeed * 0.5;
		}
	// jika balok menyentuh sisi meja maka balok akan diam dan membesar
		else
		{
			Balok1DirY = 0;
			Balok1.scale.z += (10 - Balok1.scale.z) * 0.2;
		}
	}
	// jika tika menekan tombol balok tidak bergerak
	else
	{

		Balok1DirY = 0;
	}

	Balok1.scale.y += (1 - Balok1.scale.y) * 0.2;
	Balok1.scale.z += (1 - Balok1.scale.z) * 0.2;
	Balok1.position.y += Balok1DirY;
}

// pergerakan dan logika kamera
function PergerakanKamera()
{
	spotLight.position.x = Bola.position.x * 2;
	spotLight.position.y = Bola.position.y * 2;

	// mengatur kamera agar berpindah mengikuti belakang balok User
	camera.position.x = Balok1.position.x - 100;
	camera.position.y += (Balok1.position.y - camera.position.y) * 0.05;
	camera.position.z = Balok1.position.z + 100 + 0.04 * (-Bola.position.x + Balok1.position.x);

	// mengatur rotasi kamera agar menghadap ke balok CPU
	camera.rotation.x = -0.01 * (Bola.position.y) * Math.PI/180;
	camera.rotation.y = -60 * Math.PI/180;
	camera.rotation.z = -90 * Math.PI/180;
}

// logika jika bola menyentuh balok
function PergerakanBalok()
{
	// logika PLAYER Balok
	//jika menyentuh sisi kiri balok
	if (Bola.position.x <= Balok1.position.x + BalokWidth
	&&  Bola.position.x >= Balok1.position.x)
	{
		// jika menyentuh sisi kanan balok
		if (Bola.position.y <= Balok1.position.y + BalokHeight/2
		&&  Bola.position.y >= Balok1.position.y - BalokHeight/2)
		{
			// jika bola menyentuh tengah balok
			if (BolaDirX < 0)
			{
				// balok melebar jika menyentuh bola
				Balok1.scale.y = 15;
				// logika bola jika menyentuh
				// mengganti arah bola
				BolaDirX = -BolaDirX;
				BolaDirY -= Balok1DirY * 0.7;
			}
		}
	}

// logika CPU Balok
//jika menyentuh sisi kiri balok
	if (Bola.position.x <= Balok2.position.x + BalokWidth
	&&  Bola.position.x >= Balok2.position.x)
	{
	// jika menyentuh sisi kanan balok
		if (Bola.position.y <= Balok2.position.y + BalokHeight/2
		&&  Bola.position.y >= Balok2.position.y - BalokHeight/2)
		{
	// jika bola menyentuh tengah balok
			if (BolaDirX > 0)
			{
						// balok melebar jika menyentuh bola
				Balok2.scale.y = 15;
				// logika bola jika menyentuh
				// mengganti arah bola
				BolaDirX = -BolaDirX;
				BolaDirY -= Balok2DirY * 0.7;
			}
		}
	}
}

function resetBola(loser)
{
	// posisi awal berada di tengah
	Bola.position.x = 0;
	Bola.position.y = 0;

	// jika CPU mencetak skor, bola akan mengarah ke CPU
	if (loser == 1)
	{
		BolaDirX = -1;
	}
	// jika User mencetak skor, bola akan mengarah ke User
	else
	{
		BolaDirX = 1;
	}

	// mengatur bola agar awal mengarah ke sisi kiri
	BolaDirY = 1;
}

var bounceTime = 0;
// logika skor jika mencetak skor 10
function matchScoreCheck()
{
	// Jika User mencetak skor 10
	if (score1 >= maxScore)
	{
		// bola berhenti bergerak
		BolaSpeed = 0;
		// mengganti tulisan score dan syarat menang
		document.getElementById("scores").innerHTML = "Player wins!";
		document.getElementById("winnerBoard").innerHTML = "Refresh to play again";

		bounceTime++;
		Balok1.position.z = Math.sin(bounceTime * 0.1) * 10;
		// memperbesar balok jika menang
		Balok1.scale.z = 2 + Math.abs(Math.sin(bounceTime * 0.1)) * 10;
		Balok1.scale.y = 2 + Math.abs(Math.sin(bounceTime * 0.05)) * 10;
	}
	// Jika CPU mencetak skor 10
	else if (score2 >= maxScore)
	{
		// bola berhenti bergerak
		BolaSpeed = 0;
		// mengganti tulisan score dan syarat menang
		document.getElementById("scores").innerHTML = "CPU wins!";
		document.getElementById("winnerBoard").innerHTML = "Refresh to play again";

		bounceTime++;
		Balok2.position.z = Math.sin(bounceTime * 0.1) * 10;
		// memperbesar balok jika menang
		Balok2.scale.z = 2 + Math.abs(Math.sin(bounceTime * 0.1)) * 10;
		Balok2.scale.y = 2 + Math.abs(Math.sin(bounceTime * 0.05)) * 10;
	}
}
