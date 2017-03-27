define(['jquery','plugins/http', 'durandal/app', 'knockout', 'onedollar'], function ($, http, app, ko, onedol) {
	
	function myVM(){
		var self=this;

		//
		// Startup
		//
		self._isDown = ko.observable();
		self._points = ko.observable();
		self._r = ko.observable();
		self._g = ko.observable();
		self.rc = ko.observable();
		self.gestureCtx = ko.observable();
		self.gestureName = ko.observable("Type name here...");

		self.attached = function ()
		{
			alert("Initializing");
			self._points = new Array();
			self._r = new onedol();

			var canvas = document.getElementById('myCanvas');
			self._g = canvas.getContext('2d');
			self._g.fillStyle = "rgb(0,0,225)";
			self._g.strokeStyle = "rgb(0,0,225)";
			self._g.lineWidth = 3;
			self._g.font = "16px Gentilis";
			self._rc = self.getCanvasRect(canvas); // canvas rect on page
			self._g.fillStyle = "rgb(255,255,136)";
			self._g.fillRect(0, 0, self._rc.width, 20);

			self._isDown = false;

		};

		self.getCanvasRect = function(canvas)
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
		}

		self.getScrollY = function()
		{
			var scrollY = $(window).scrollTop();
			return scrollY;
		};

		//
		// Mouse Events
		//
		self.mouseDownEvent = function ()
		{
			//alert("in mouseDownEvent");
			
			var x = event.clientX;
			var y = event.clientY;

			document.onselectstart = function() { return false; } // disable drag-select
			document.onmousedown = function() { return false; } // disable drag-select
			self._isDown = true;
			x -= self._rc.x;
			y -= self._rc.y - self.getScrollY();
			if (self._points.length > 0)
				self._g.clearRect(0, 0, self._rc.width, self._rc.height);
			self._points.length = 1; // clear
			self._points[0] = new Point(x, y); // Don't know why Point works!!
			// drawText("Recording unistroke...");  This aint workin.  Maybe just bind to a text box and quit workin with Canvas?
			self._g.fillRect(x - 4, y - 3, 9, 9);
		};

		self.mouseMoveEvent = function ()
		{
			//alert("in mouseMoveEvent");

			var x = event.clientX;
			var y = event.clientY;
			
			if (self._isDown)
			{
				x -= self._rc.x;
				y -= self._rc.y - self.getScrollY();
				self._points[self._points.length] = new Point(x, y); // append
				self.drawConnectedPoint(self._points.length - 2, self._points.length - 1);
			}
		};

		self.mouseUpEvent = function ()
		{
			//alert("in mouseUpEvent");

			var x = event.clientX;
			var y = event.clientY;

			document.onselectstart = function() { return true; } // enable drag-select
			document.onmousedown = function() { return true; } // enable drag-select
			if (self._isDown)
			{
				_isDown = false;
				if (_points.length >= 10)
				{
					var result = _r.Recognize(_points, document.getElementById('useProtractor').checked);
					//self.drawText("Result: " + result.Name + " (" + self.round(result.Score,2) + ").");
				}
				else // fewer than 10 points were inputted
				{
					//self.drawText("Too few points made. Please try again.");
				}
			}
		};

		self.drawGesture = function (ctx, Points)
		{			
			//Original Points
			for (var x = 0; x < Points.length; x++){
				ctx.fillRect(Points[x].X/4 , Points[x].Y/4 ,1 ,1);
			}	
		};

		self.drawText = function (str)
		{
			self._g.fillStyle = "rgb(255,255,136)";
			self._g.fillRect(0, 0, _rc.width, 20);
			self._g.fillStyle = "rgb(0,0,255)";
			self._g.fillText(str, 1, 14);
		};

		self.drawConnectedPoint = function (from, to)
		{
			self._g.beginPath();
			self._g.moveTo(_points[from].X, _points[from].Y);
			self._g.lineTo(_points[to].X, _points[to].Y);
			self._g.closePath();
			self._g.stroke();
		}

		self.round = function (n, d) // round 'n' to 'd' decimals
		{
			d = Math.pow(10, d);
			return Math.round(n * d) / d
		};

		//
		// Unistroke Adding and Clearing Button Events
		//
		/*
		self.onClickAddExisting = function ()
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

		self.onClickAddCustom = function ()
		{
			//alert("in onClickAddCustom");
			var name = self.gestureName(); //document.getElementById('custom').value; //Get name via knockout binding.
			//alert("New Gesture Name is: " + name);
			if (self._points.length >= 10 && name.length > 0)
			{
				var num = self._r.AddGesture(name, _points);
				//drawText("\"" + name + "\" added. Number of \"" + name + "\"s defined: " + num + ".");
				//alert(name + " added. " + self._r.Unistrokes.length);
			}
		};

		self.onClickCustom = function ()
		{
			//alert("in Click Custom Event");
			document.getElementById('custom').select();
		};

		self.onClickDelete = function ()
		{
			//alert("in Delete Event");
			var num = self._r.DeleteUserGestures(); // deletes any user-defined unistrokes
			//alert("All user-defined gestures have been deleted.");
		};

		self.onClickOutput = function ()
		{
			alert(self._r.Unistrokes.length);
			alert(self._r.Unistrokes[0].Points.length);
			alert(JSON.stringify(self._r.Unistrokes[0].Points));
			alert(self._r.Unistrokes[0].originalPoints.length);
			alert(JSON.stringify(self._r.Unistrokes[0].originalPoints));
		};

	};

	return new myVM();
}); // Close Define Function