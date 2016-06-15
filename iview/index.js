$(function () {
	
	var allPropsLoaded = 0;
	var moleculeLoaded = 0;
	var matLoaded = 0;
 	var reloadCount = 0;
	
	var targetProps;
	var prevProps = "";
	var changeProps = false;
	var xhrProps = new XMLHttpRequest(); 
	
	var targetMol;
	var prevMol = "";
	var changeMol = false;
	var xhrMol = new XMLHttpRequest(); 
	
	var targetMat;
	var prevMat;
	var changeMat = false;
	var xhrMat = new XMLHttpRequest();
	
	
	xhrProps.open('GET', 'curprop.txt', true);
   	xhrProps.send();
   	xhrMol.open('GET', 'curmol.txt', true);
   	xhrMol.send();
   
	var iv = new iview('view', true);
	var code = location.search.substr(1);
	if (!code.length) code = '3KFN';
	var loadPDB = function (code) {
		$.get('http://www.rcsb.org/pdb/files/' + code + '.pdb', function (src) {
			iv.loadPDB(src);
		});
	};
	
	console.log(targetMat);
	console.log(prevMat);


	setInterval(function(){
	allPropsLoaded = 0;
	xhrProps.open('GET', 'curprop.txt', true);
   	xhrProps.send();
   	}, 1000);
   	setInterval(function(){
   	xhrMol.open('GET', 'curmol.txt', true);
   	xhrMol.send();
   	}, 1100);
   	setInterval(function(){
	xhrMat.open('GET', 'curmat.txt', true);
   	xhrMat.send();
   	}, 1200);
   	

	$('#loadPDB').change(function () {
		if(changeMol && moleculeLoaded == 0)
		loadPDB($(this).val());
		moleculeLoaded = 1;
	});
	$('#OK').click(function () {
		loadPDB($('#loadPDB').val());
	});
	$('input[type="file"]').change(function() {
		var file = this.files[0];
		if (file === undefined) return;
		var reader = new FileReader();
		reader.onload = function () {
			iv.loadPDB(reader.result);
		};
		reader.readAsText(file);
	});

	$('#exportCanvas').click(function (e) {
		e.preventDefault();
		iv.exportCanvas();
	});
	
	xhrProps.onreadystatechange = function()
    {
 		if (xhrProps.readyState == 4)
   		{
 			
   			targetProps = JSON.parse(xhrProps.responseText);
    		
    		//console.log(targetProps);
    		// Now check all the props for changes
   			if(targetProps.camera !== prevProps.camera)
   				changeProps = true;
   				
   			else if(targetProps.background !== prevProps.background)
   				changeProps = true;
   				
   			else if(targetProps.colorBy !== prevProps.colorBy)
   				changeProps = true;
   		
   			else if(targetProps.primaryStructure !== prevProps.primaryStructure)
   				changeProps = true;
    		
    		else if(targetProps.secondaryStructure !== prevProps.secondaryStructure)
   				changeProps = true;
   			
   			else if(targetProps.surface !== prevProps.surface)
   				changeProps = true;
   			
   			else if(targetProps.opacity !== prevProps.opacity)
   				changeProps = true;
   			
   			else if(targetProps.wireframe !== prevProps.wireframe)
   				changeProps = true;
   			
   			else if(targetProps.ligands !== prevProps.ligands)
   				changeProps = true;
   			
   			else if(targetProps.ions !== prevProps.ions)
   				changeProps = true;
   			
   			else if(targetProps.waters !== prevProps.waters)
   				changeProps = true;
   			
   			else if(targetProps.labels !== prevProps.labels)
   				changeProps = true;
   				
   			else if(targetProps.lock !== prevProps.lock)
   				changeProps = true;
   				
   			else if(targetProps.mode !== prevProps.mode)
   				changeProps = true;
   			
    		else
    			changeProps = false;
    		
    		//End prop checking
			xhrProps.open('GET', 'curprop.txt', true);
			
			requestAnimationFrame(reloadProps);
			allPropsLoaded = 0;
		}

	}
	
	xhrMol.onreadystatechange = function()
    {
    	if(xhrMol.readyState == 4)
    	{
    	
    		targetMol = xhrMol.responseText;
    		if(targetMol !== prevMol)
    		{
    			changeMol = true;
    			iconShow();
    		}

    		else
    		{
    			changeMol = false;
			}
			xhrMol.open('GET', 'curmol.txt', true);
			requestAnimationFrame(reloadMol);
			moleculeLoaded = 0;
    	}
	}
	
	xhrMat.onreadystatechange = function()
	{
		if(xhrMat.readyState == 4 && xhrMat.status == 200)
		{
			targetMat = xhrMat.responseText;
			
			if(targetMat != prevMat)
			{
				console.log(targetMat);
				console.log(prevMat);
				changeMat = true;
			}
			
			else
				changeMat = false;
				
			xhrMat.open('GET', 'curmat.txt', true);
			requestAnimationFrame(reloadMat);
			matLoaded = 0;
		}
	}
	function reloadProps()
	{
		if(changeProps && allPropsLoaded == 0)
		{
				allPropsLoaded = 1;
				/*if(xhrProps.readyState != 1)
				{
					xhrProps.open();
				}*/
	   			xhrProps.send();
				iv.rebuildScene(targetProps);
				iv.render();
				prevProps = targetProps;
				changeProps = false;
		}
	}
	
	function reloadMol()
	{
		if(changeMol && moleculeLoaded == 0)
		{
				moleculeLoaded = 1;
	   			xhrMol.send();
				loadPDB(targetMol);
	   			prevMol = targetMol;
				changeMol = false;
				allItemsLoaded();
		}
	}
	
	function reloadMat()
	{
		if(changeMat && matLoaded == 0)
		{
				matLoaded = 1;
				if(xhrMat.readyState != 1)
				{
					xhrMat.open();
				}
				xhrMat.send();
				
				
				if(reloadCount > 0)
				{
					console.log("Rebuild Scene");
					iv.rebuildScene();
					iv.render();
				}
				reloadCount++;
				prevMat = targetMat;
				changeMat = false;
		}
	}

});

function iconShow() {
        if ($('.loading-container').length) {

            //to show loading animation
            $imgloader = $('.loading-container');
            $loadingimg = $('<div id="canvasloader-container" class="onepix-imgloader"></div>');

//          $loadingimg.attr("src","images/flexslider/loading.gif");
            $imgloader.prepend($loadingimg);

//          canvasloader code
var cl = new CanvasLoader('canvasloader-container');
cl.setColor('#73b2ff'); // default is '#000000'
cl.setDiameter(93); // default is 40
cl.setDensity(14); // default is 40
cl.setRange(1.4); // default is 1.3
cl.setSpeed(3); // default is 2
cl.setFPS(24); // default is 24
cl.show(); // Hidden by default

        }

    }
    //to display loading animation before it's ready
    $(document).ready(iconShow());
    
function allItemsLoaded() {
    $('.onepix-imgloader').fadeOut();
    // fade in content (using opacity instead of fadein() so it retains its height.
    $('.loading-container > *:not(.onepix-imgloader)').fadeTo(8000, 100);
}














