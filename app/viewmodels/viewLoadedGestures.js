define(['durandal/app', 'knockout', 'onedollar'], function (app, ko, onedol) {
	return {
	    //
		// Startup
		//

		gestures: ko.observableArray([]),
		activate: function ()
		{   
			// Create a canvas obect for each gestures original points and processed points and
			//  add them to an array for future display.
			var _r = new onedol();
			
			for (var i = 0; i < _r.Unistrokes.length; i++){
				var gestureTile = document.createElement('canvas');
				gestureTile.className = "col-xs-6";
				gestureCtx = gestureTile.getContext('2d');
				gestureCtx.fillStyle = "blue";
				this.drawGesture(gestureCtx, _r.Unistrokes[i].originalPoints);
				this.gestures.push(gestureTile);
				//tiles.appendChild(gestureTile);

				var gestureTile = document.createElement('canvas');
				gestureTile.className = "col-xs-6";
				gestureCtx = gestureTile.getContext('2d');
				gestureCtx.translate(50,50);
				gestureCtx.fillStyle = "red";
				this.drawGesture(gestureCtx,_r.Unistrokes[i].Points);
				this.gestures.push(gestureTile);
				//tiles.appendChild(gestureTile);
			}
		},
		attached: function(view)
		{
			var tiles = document.getElementById('gestureTiles');
			for(var x = 0; x < this.gestures().length; x++){
				tiles.appendChild(this.gestures()[x]);
			}
		},
		drawGesture: function (ctx, Points)
		{			
			//Original Points
			for (var x = 0; x < Points.length; x++){
				ctx.fillRect(Points[x].X/4 , Points[x].Y/4 ,1 ,1);
			}	
		},

		//
		// Unistroke Adding and Clearing Button Events
		//
		btnDelete: function onClickDelete()
		{
			var num = _r.DeleteUserGestures(); // deletes any user-defined unistrokes
			alert("All user-defined gestures have been deleted. Only the 1 predefined gesture remains for each of the " + num + " types.");
		},
		btnOutput: function onClickOutput()
		{
			alert(_r.Unistrokes.length);
			alert(_r.Unistrokes[0].Points.length);
			alert(JSON.stringify(_r.Unistrokes[0].Points));
			alert(_r.Unistrokes[0].originalPoints.length);
			alert(JSON.stringify(_r.Unistrokes[0].originalPoints));
		}
	};

});
