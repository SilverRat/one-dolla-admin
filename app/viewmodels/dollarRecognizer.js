define(["jquery", "plugins/http", "durandal/app", "onedollar", "clipboard"], function($, http, app, Onedol, Clipboard) {
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
        outputGestures: "",
        initGestures: "",
        scrollY: 0,
        useProtractor: false,
        clipboard: "",
        showClipboard: false,

        getCanvasRect: function(canvas) {
            const w = canvas.width;
            const h = canvas.height;

            let cx = canvas.offsetLeft;
            let cy = canvas.offsetTop;
            while (canvas.offsetParent != null) {
                canvas = canvas.offsetParent;
                cx += canvas.offsetLeft;
                cy += canvas.offsetTop;
            }
            return {x: cx, y: cy, width: w, height: h};
        },

        attached: function() {
            this.clipboard = new Clipboard(".clipboard");
            
            this._points = [];  // new Array();
            this._r = new Onedol();

            let canvas = document.getElementById("myCanvas");
            this._g = canvas.getContext("2d");
            this._g.fillStyle = "rgb(0,0,225)";
            this._g.strokeStyle = "rgb(0,0,225)";
            this._g.lineWidth = 1;
            this._rc = this.getCanvasRect(canvas); // canvas rect on page - TODO: Recall when resizing screen.
            this._isDown = false;

            this.libraryTiles = document.getElementById("right-column");  // UI Element :(
            this.drawGesturesOnCanvas(this._r, this.libraryTiles);
        },

        drawGesturesOnCanvas: function(oneDollar, uiElement) {
            for (let i = 0; i < oneDollar.Unistrokes.length; i++) {
                this.drawGestureOnCanvas(oneDollar.Unistrokes[i], uiElement);
            }
        },

        drawGestureOnCanvas: function(unistroke, uiElement) {
            // Original Points
            let gestureTile = document.createElement("canvas");
            gestureTile.className = "col-xs-4";
            let gestureCtx = gestureTile.getContext("2d");
            gestureCtx.fillStyle = "black";
            gestureCtx.strokeStyle = "black";
            this.drawGesture(gestureCtx, unistroke.originalPoints);
            uiElement.appendChild(gestureTile);   // UI Element :(
        },

        drawGesture: function(ctx, Points) {
            // Original Points
            for (let x = 0; x < Points.length; x++) {
                ctx.fillRect(Points[x].X/2, Points[x].Y/2, 4, 4);  // UI Element :(
            }
        },

        //
        // Mouse Events
        //
        mouseDownEvent: function(data, event) {
            // alert("in mouseDownEvent");

            let x = event.clientX;
            let y = event.clientY;

            document.onselectstart = function() {
                return false;
            }; // disable drag-select
            document.onmousedown = function() {
                return false;
            }; // disable drag-select

            this._isDown = true;
            x -= this._rc.x;
            y -= this._rc.y - this.scrollY;
            this.message = "scroll Y is now " + this.scrollY;
            if (this._points.length > 0)
                this._g.clearRect(0, 0, this._rc.width, this._rc.height);
            this._points.length = 1; // clear
            this._points[0] = new Point(x, y); // Don"t know why Point works!!
            // this.message = "Recording unistroke...";
            this._g.fillRect(x - 4, y - 3, 9, 9);
        },

        mouseMoveEvent: function(data, event) {
            // alert("in mouseMoveEvent");

            let x = event.clientX;
            let y = event.clientY;

            if (this._isDown) {
                x -= this._rc.x;
                y -= this._rc.y - this.scrollY;
                this.message = "scroll Y is now " + this.scrollY;
                this._points[this._points.length] = new Point(x, y); // append
                this.drawConnectedPoint(this._points.length - 2, this._points.length - 1);
            }
        },

        mouseUpEvent: function(data, event) {
            // alert("in mouseUpEvent");

            document.onselectstart = function() {
                return true;
            }; // enable drag-select
            document.onmousedown = function() {
                return true;
            }; // enable drag-select

            if (this._isDown) {
                this._isDown = false;
                if (this._points.length >= 10) {
                    const result = this._r.Recognize(this._points, this.useProtractor); // document.getElementById("useProtractor").checked);
                    this.message = "Result: " + result.Name + " (" + this.round(result.Score, 2) + "). Use Protractor is: " + this.useProtractor;
                } else { // fewer than 10 points were inputted
                    this.message = "Too few points made. Please try again.";
                }
            }
        },

        drawConnectedPoint: function(from, to) {
            this._g.beginPath();
            this._g.moveTo(this._points[from].X, this._points[from].Y);
            this._g.lineTo(this._points[to].X, this._points[to].Y);
            this._g.closePath();
            this._g.stroke();
        },

        round: function(n, d) { // round "n" to "d" decimals
            d = Math.pow(10, d);
            return Math.round(n * d) / d;
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
                var unistrokes = document.getElementById("unistrokes");
                var name = unistrokes[unistrokes.selectedIndex].value;
                var num = _r.AddGesture(name, _points);
                drawText("\"" + name + "\" added. Number of \"" + name + "\"s defined: " + num + ".");
            }
        };
        */

        onClickAddCustom: function() {
            const name = this.gestureName;
            if (this._points.length >= 10 && name.length > 0) {
                const num = this._r.AddGesture(name, this._points);
                this.message = name + " added. Number of " + name + "'s defined: " + num + ".";
                this.message = name + " added. " + this._r.Unistrokes.length;
            }
        },

        onClickLoadCustom: function() {
            this._r = new Onedol(JSON.parse(this.initGestures));
            this.message = "Loaded " + this._r.Unistrokes.length + " gestures";
            this.drawGesturesOnCanvas(this._r, this.libraryTiles);
        },

        onClickDelete: function() {
            this._r.DeleteUserGestures(); 
            this.message = this._r.Unistrokes.length + " gestures defined";
            this.clearUI(this.libraryTiles);
        },

        onClickOutput: function() {
            let gestures = [];

            for (let x = 0; x < this._r.Unistrokes.length; x++) {
                gestures.push({"name": this._r.Unistrokes[x].Name, "points": this._r.Unistrokes[x].originalPoints});
            }
            this.outputGestures = JSON.stringify(gestures);
            this.showClipboard = true;
        },

        // I defined these 2 "wrong" but it works.  Did I make a private method? Is this best practice?
        clearUI(tiles) {
            while (tiles.firstChild) {
                tiles.removeChild(tiles.firstChild);
            }
        },

    }; // End Return
}); // Close Define Function
