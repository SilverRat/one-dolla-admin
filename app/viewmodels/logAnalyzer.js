define(["durandal/app", "knockout", "onedollar"], function(app, ko, Onedol) {
    return {
        //
        // Startup
        //

        oneDollarLibrary: "",
        oneDollarLog: "",
        libraryTiles: "",  // UI Element :(
        logTiles: "",  // UI Element :(
        libraryGestureNames: [],
        logGestureNames: [],
        initGestures: "",
        initLogGesture: "",
        selectedLibraryGesture: "",
        selectedLogGesture: "",
        message: "",

        attached: function(view) {
            this.oneDollarLibrary = new Onedol();
            this.oneDollarLog = new Onedol();

            this.libraryGestureNames = this.oneDollarLibrary.Unistrokes.map(function(obj) {
                return obj.Name;
            });

            this.oneDollarLog.DeleteUserGestures();
            this.libraryTiles = document.getElementById("libraryGestureTiles");  // UI Element :(
            this.logTiles = document.getElementById("logGestureTiles");  // UI Element :(

            this.drawGesturesOnCanvas(this.oneDollarLibrary, this.libraryTiles);
        },

        drawGesturesOnCanvas: function(oneDollar, uiElement) {
            for (let i = 0; i < oneDollar.Unistrokes.length; i++) {
                this.drawGestureOnCanvas(oneDollar.Unistrokes[i], uiElement);
            }
        },

        drawGestureOnCanvas: function(unistroke, uiElement) {
            // Original Points
            let gestureTile = document.createElement("canvas");
            gestureTile.className = "col-xs-6";
            let gestureCtx = gestureTile.getContext("2d");
            gestureCtx.fillStyle = "blue";
            this.drawGesture(gestureCtx, unistroke.originalPoints);
            uiElement.appendChild(gestureTile);   // UI Element :(

            // Processed Points
            gestureTile = document.createElement("canvas");
            gestureTile.className = "col-xs-6";
            gestureCtx = gestureTile.getContext("2d");
            gestureCtx.translate(50, 50);
            gestureCtx.fillStyle = "red";
            this.drawGesture(gestureCtx, unistroke.Points);
            uiElement.appendChild(gestureTile);  // UI Element :(
        },

        drawGesture: function(ctx, Points) {
            // Original Points
            for (let x = 0; x < Points.length; x++) {
                ctx.fillRect(Points[x].X/4, Points[x].Y/4, 1, 1);  // UI Element :(
            }
        },

        onClickLoadCustom: function() {
            this.oneDollarLibrary = new Onedol(JSON.parse(this.initGestures));
            this.message = "Loaded " + this.oneDollarLibrary.Unistrokes.length + " library gestures";
            this.drawGesturesOnCanvas(this.oneDollarLibrary, this.libraryTiles);
            this.libraryGestureNames = this.oneDollarLibrary.Unistrokes.map(function(obj) {
                return obj.Name;
            });
        },

        onClickLoadCustomLog: function() {
            this.oneDollarLog = new Onedol(JSON.parse(this.initLogGesture));
            this.message = "Loaded " + this.oneDollarLog.Unistrokes.length + " log gestures";
            this.drawGesturesOnCanvas(this.oneDollarLog, this.logTiles);
            this.logGestureNames = this.oneDollarLog.Unistrokes.map(function(obj) {
                return obj.Name;
            });
        },

        onClickDelete: function() {
            this.oneDollarLibrary.DeleteUserGestures();
            this.message = this.oneDollarLibrary.Unistrokes.length + " library gestures defined";
            this.clearUI(this.libraryTiles);
            this.libraryGestureNames = this.oneDollarLibrary.Unistrokes.map(function(obj) {
                return obj.Name;
            });
        },

        onClickDeleteLog: function() {
            this.oneDollarLog.DeleteUserGestures();
            this.message = this.oneDollarLog.Unistrokes.length + " log gestures defined";
            this.clearUI(this.logTiles);
            this.logGestureNames = this.oneDollarLog.Unistrokes.map(function(obj) {
                return obj.Name;
            });
        },

        onClickLibrarySelection: function() {  // TODO: NOT SURE WHAT EVENT TO ATTACH TO.  IT FIRES ON DROPDOWN, NOT SELECTION.
            this.clearUI(this.libraryTiles);
            // Is there a better way to figure out the unistoke index for selectedLibraryGesture?
            let x = this.findIndexByKeyValue(this.oneDollarLibrary.Unistrokes, "Name", this.selectedLibraryGesture);
            this.drawGestureOnCanvas(this.oneDollarLibrary.Unistrokes[x], this.libraryTiles);
        },

        onClickLogSelection: function() {
        },

        // I defined these 2 "wrong" but it works.  Did I make a private method? Is this best practice?
        clearUI(tiles) {
            while (tiles.firstChild) {
                tiles.removeChild(tiles.firstChild);
            }
        },

        findIndexByKeyValue(obj, key, value) {
            for (let i = 0; i < obj.length; i++) {
                if (obj[i][key] == value) {
                    return i;
                }
            }
            return null;
        }
    };
});
