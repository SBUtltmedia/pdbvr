var option = {};
var loadPDB2;
var iv;
//TODO: Fix synchronization for heartcode loaders. For the heavier properties, 
//		the heartcode loader pops up after the property has loaded...
$(document).ready(function()
{
	option = {"camera": "perspective", "background": "black", "colorBy": "spectrum",
	 		  "primaryStructure": "nothing", "secondaryStructure":"ribbon", "surface":"nothing",
	 		  "opacity":"1.0", "wireframe":"no", "ligands":"stick", "effect":"none", "mode":"rotate",
	 		  "lock":"unlocked"};

	$('.btn-primary').removeClass('active');
	
	iv = new iview('teachView', false)
	var def = "4XFU";
	loadPDB2 = function (code) {
		$.get('http://www.rcsb.org/pdb/files/' + code + '.pdb', function (src) {
			iv.loadPDB(src);
		});
	};
	switchProps(option);
	
	loadPDB(def);
	loadPDB2(def);
	
	iv.rebuildScene(option);
});

function propClick(e)
{
			if($(e.target).text().trim() != "OK")
			{
				var groupKey = $(e.target).closest('div').attr("id");
				var optValue = $(e.target).text().trim();
		
				option = jsonConcat(option, JSON.parse('{"'+groupKey+'":"'+optValue+'"}'));		

				switchProps(option);
				iv.rebuildScene(option);
			};
}
$(function()
{
	sendRot();
	$('.btn-primary').click(function(e)
		{
			iconShow();
			propClick(e)
			console.log(e);

		});
	
	//Defaults!
	$('.btn-warning').click(function(e)
	{
		option = {"camera": "perspective", "background": "black", "colorBy": "spectrum",
				  "primaryStructure": "nothing", "secondaryStructure":"ribbon", "surface":"nothing",
				  "opacity":"1.0", "wireframe":"no", "ligands":"stick", "effect":"none", "mode":"rotate",
				  "lock":"unlocked"};
		$('.btn-primary').removeClass('active');
		switchProps(option);
		
		$('#lockInfo').hide();
		iv.globalLock = false;
	});
	
	$('#lkbt').click(function(e)
	{
		$('#lockInfo').show();
	});
	
	$('#unlkbt').click(function(e)
	{
		$('#lockInfo').hide();
	});
	
	//Rotation View sending!
	$('#sendRotBtn').click(function(e)
	{
		sendRot();
	});
	

	$('#OK').click(function () {

		loadPDB($('#loadPDB').val());
		loadPDB2($('#loadPDB').val());
	});
	
	$('input[type="file"]').change(function() {
	var file = this.files[0];
	if (file === undefined) return;
	var reader = new FileReader();
	reader.onload = function () {
		iv.loadPDB(reader.result);
		loadPDB(reader.result);
	};
	reader.readAsText(file);
	});
});

//Helper function to concatenate JSON arrays.
function jsonConcat(o1, o2) {
 for (var key in o2) {
  o1[key] = o2[key];
 }
 return o1;
}

function switchProps(props)
{	
	$.ajax({
		method: "POST",
		url: "propqueue.php",
		data: {props: props},
		cache: false
		})
		.done(function(msg){
		console.log(msg);
		allItemsLoaded();
		iv.rebuildScene(option)
		});
 
};

function loadPDB(mol)
{
	$.ajax({
		method: "POST",
		url: "molequeue2.php",
		data: {mol: mol},
		cache: false
		})
		.done(function(msg){
		console.log(msg);
		allItemsLoaded();
		});
}

function sendRot() {
			var matrix = {x: iv.rot.quaternion.x, y: iv.rot.quaternion.y, z: iv.rot.quaternion.z};
			$.ajax({
			method: "POST",
			url: "matqueue.php",
			data: {matrix: matrix},
			cache: false,
			async: true
			}).done(function()
			{
				console.log("Sent rotation");
				globalThis.rebuildScene();
			});
	}

function iconShow() {
        if ($('.loading-container').length) {

            //to show loading animation
            $imgloader = $('.loading-container');
            $loadingimg = $('<div id="canvasloader-container" class="onepix-imgloader"></div>');

//          $loadingimg.attr("src","images/flexslider/loading.gif");
            $imgloader.prepend($loadingimg);

//          canvasloader code
$('#bgFader').fadeIn(200);
$('#loadingText').fadeIn(200);
var cl = new CanvasLoader('canvasloader-container');
cl.setColor('#ffffff'); // default is '#000000'
cl.setDiameter(93); // default is 40
cl.setDensity(40); // default is 40
cl.setRange(1.2); // default is 1.3
cl.setSpeed(3); // default is 2
cl.setFPS(60); // default is 24
cl.show(); // Hidden by default
	}
}

function allItemsLoaded() {
    $('.onepix-imgloader').fadeOut();
    $('#bgFader').fadeOut();
    $('#loadingText').fadeOut();
    // fade in content (using opacity instead of fadein() so it retains its height.
    $('.loading-container > *:not(.onepix-imgloader)').fadeTo(8000, 100);
}