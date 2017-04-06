define(["durandal/app", "knockout", "onedollar"], function(app, ko, Onedol) {
    return {
        //
        // Startup
        //

        gestures: ko.observableArray([]),
        activate: function() {
            // Create a canvas obect for each gestures original points and processed points and
            //  add them to an array for future display.
            let _r = new Onedol();

            for (let i = 0; i < _r.Unistrokes.length; i++) {
                let gestureTile = document.createElement("canvas");
                gestureTile.className = "col-xs-6";
                let gestureCtx = gestureTile.getContext("2d");
                gestureCtx.fillStyle = "blue";
                this.drawGesture(gestureCtx, _r.Unistrokes[i].originalPoints);
                this.gestures.push(gestureTile);

                gestureTile = document.createElement("canvas");
                gestureTile.className = "col-xs-6";
                gestureCtx = gestureTile.getContext("2d");
                gestureCtx.translate(50, 50);
                gestureCtx.fillStyle = "red";
                this.drawGesture(gestureCtx, _r.Unistrokes[i].Points);
                this.gestures.push(gestureTile);
            }
        },
        attached: function(view) {
            let tiles = document.getElementById("gestureTiles");
            for(let x = 0; x < this.gestures().length; x++) {
                tiles.appendChild(this.gestures()[x]);
            }
        },
        drawGesture: function(ctx, Points) {
            // Original Points
            for (let x = 0; x < Points.length; x++) {
                ctx.fillRect(Points[x].X/4, Points[x].Y/4, 1, 1);
            }
        }
    };
});
