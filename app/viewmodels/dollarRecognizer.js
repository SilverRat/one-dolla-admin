define(['jquery','plugins/http', 'durandal/app', 'onedollar'], function ($, http, app, onedol) {
	
	return{

		//
		// Startup
		//
		_isDown: "",
		_points: "",
		_r: "",
		_g: "",
		rc: "",
		gestureCtx: "",
		gestureName: "Type name here...",
		message: "Draw a gesture",
		scrollY: 0,

		attached: function ()
		{
			//alert("Initializing");
			this._points = new Array();
			this._r = new onedol();

			var canvas = document.getElementById('myCanvas');
			this._g = canvas.getContext('2d');
			this._g.fillStyle = "rgb(0,0,225)";
			this._g.strokeStyle = "rgb(0,0,225)";
			this._g.lineWidth = 1;
			//this._g.font = "16px Gentilis";
			this._rc = this.getCanvasRect(canvas); // canvas rect on page
			//this._g.fillStyle = "rgb(255,255,136)";
			//this._g.fillRect(0, 0, this._rc.width, 20);

			this._isDown = false;

		},

		getCanvasRect: function(canvas)
		{
			var w = canvas.width;
			var h = canvas.height;

			var cx = canvas.offsetLeft;
			var cy = canvas.offsetTop;
			while (canvas.offsetParent != null)
			{
				canvas = canvas.offsetParent;
				cx += canvas.offsetLeft;
				cy += canvas.offsetTop;
			}
			return {x: cx, y: cy, width: w, height: h};
		},


		//
		// Mouse Events
		//

		/*
		getScrollY: function()  // Technically, this works but mixes the view in the view model.
		{
			var scrollY = $(".page-host").scrollTop();
			return scrollY;
		},
		*/

		mouseDownEvent: function (data, event)
		{
			//alert("in mouseDownEvent");
			
			var x = event.clientX;
			var y = event.clientY;

			document.onselectstart = function() { return false; } // disable drag-select
			document.onmousedown = function() { return false; } // disable drag-select

			this._isDown = true;
			x -= this._rc.x;
			y -= this._rc.y - this.scrollY;
			this.message = "scroll Y is now " + this.scrollY;
			if (this._points.length > 0)
				this._g.clearRect(0, 0, this._rc.width, this._rc.height);
			this._points.length = 1; // clear
			this._points[0] = new Point(x, y); // Don't know why Point works!!
			//this.message = "Recording unistroke...";
			// drawText("Recording unistroke...");  This aint workin.  Maybe just bind to a text box and quit workin with Canvas?
			this._g.fillRect(x - 4, y - 3, 9, 9);
		},

		mouseMoveEvent: function (data, event)
		{
			//alert("in mouseMoveEvent");

			var x = event.clientX;
			var y = event.clientY;
			
			if (this._isDown)
			{
				x -= this._rc.x;
				y -= this._rc.y - this.scrollY;
				this.message = "scroll Y is now " + this.scrollY;
				this._points[this._points.length] = new Point(x, y); // append
				this.drawConnectedPoint(this._points.length - 2, this._points.length - 1);
			}
		},

		mouseUpEvent: function (data, event)
		{
			//alert("in mouseUpEvent");

			var x = event.clientX;
			var y = event.clientY;

			document.onselectstart = function() { return true; } // enable drag-select
			document.onmousedown = function() { return true; } // enable drag-select

			if (this._isDown)
			{
				this._isDown = false;
				if (this._points.length >= 10)
				{
					var result = this._r.Recognize(this._points); //, document.getElementById('useProtractor').checked);
					this.message = "Result: " + result.Name + " (" + this.round(result.Score,2) + ").";
					//this.drawText("Result: " + result.Name + " (" + this.round(result.Score,2) + ").");
				}
				else // fewer than 10 points were inputted
				{
					this.message = "Too few points made. Please try again.";
					//this.drawText("Too few points made. Please try again.");
				}
			}
		},

		drawGesture: function (ctx, Points)
		{			
			//Original Points
			for (var x = 0; x < Points.length; x++){
				ctx.fillRect(Points[x].X/4 , Points[x].Y/4 ,1 ,1);
			}	
		},

		/*
		drawText: function (str)
		{
			this._g.fillStyle = "rgb(255,255,136)";
			this._g.fillRect(0, 0, _rc.width, 20);
			this._g.fillStyle = "rgb(0,0,255)";
			this._g.fillText(str, 1, 14);
		},
		*/


		drawConnectedPoint: function (from, to)
		{
			this._g.beginPath();
			this._g.moveTo(this._points[from].X, this._points[from].Y);
			this._g.lineTo(this._points[to].X, this._points[to].Y);
			this._g.closePath();
			this._g.stroke();
		},

		round: function (n, d) // round 'n' to 'd' decimals
		{
			d = Math.pow(10, d);
			return Math.round(n * d) / d
		},

		//
		// Unistroke Adding and Clearing Button Events
		//
		/*
		this.onClickAddExisting = function ()
		{
			alert("in Add Existing Event");
			if (_points.length >= 10)
			{
				var unistrokes = document.getElementById('unistrokes');
				var name = unistrokes[unistrokes.selectedIndex].value;
				var num = _r.AddGesture(name, _points);
				drawText("\"" + name + "\" added. Number of \"" + name + "\"s defined: " + num + ".");
			}
		};
		*/

		onClickAddCustom: function ()
		{
			//alert("in onClickAddCustom");
			var name = this.gestureName; //document.getElementById('custom').value; //Get name via knockout binding.
			//alert("New Gesture Name is: " + name);
			if (this._points.length >= 10 && name.length > 0)
			{
				var num = this._r.AddGesture(name, _points);
				this.message = name + " added. Number of " + name + "'s defined: " + num + ".";
				//drawText("\"" + name + "\" added. Number of \"" + name + "\"s defined: " + num + ".");
				this.message = name + " added. " + this._r.Unistrokes.length;
			}
		},

		onClickCustom: function ()
		{
			//alert("in Click Custom Event");
			document.getElementById('custom').select();
		},

		onClickDelete: function ()
		{
			//alert("in Delete Event");
			var num = this._r.DeleteUserGestures(); // deletes any user-defined unistrokes
			//alert("All user-defined gestures have been deleted.");
		},

		onClickOutput: function ()
		{
			alert(this._r.Unistrokes.length);
			alert(this._r.Unistrokes[0].Points.length);
			alert(JSON.stringify(this._r.Unistrokes[0].Points));
			alert(this._r.Unistrokes[0].originalPoints.length);
			alert(JSON.stringify(this._r.Unistrokes[0].originalPoints));
		},

	}; // End Return

}); // Close Define Function