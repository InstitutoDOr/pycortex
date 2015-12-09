// make sure canvas size is set properly for high DPI displays
// From: http://www.khronos.org/webgl/wiki/HandlingHighDPI
var dpi_ratio = window.devicePixelRatio || 1;


var sliderview = (function(module) {
    
    module.flatscale = .35;

    module.Viewer = function(figure) { 
        //Allow objects to listen for mix updates
        //THREE.EventTarget.call( this );
        jsplot.Axes.call(this, figure);

        //Initialize all the html
        $(this.object).html($("#sliderview_html").html())

        //this.controls.addEventListener("change", this.schedule.bind(this));
        
        //this._bindUI();

    }
    module.Viewer.prototype = Object.create(jsplot.Axes.prototype);
    module.Viewer.prototype.constructor = module.Viewer;
    
    // SView
    module.SView = function(parent, nrows, ncols) {
        jsplot.GridFigure.call(this, parent, nrows, ncols);

    }
    module.SView.prototype = Object.create(jsplot.GridFigure.prototype);
    module.SView.prototype.constructor = module.Viewer;
    
    
    module.Viewer.prototype.schedule = function() {
        if (!this._scheduled) {
            this._scheduled = true;
           
         }
    };
    module.Viewer.prototype.draw = function () {
        
        this.dispatchEvent({type:"draw"});
    };
    module.Viewer.prototype.load = function(ctminfo, callback) {
            
    };
    module.Viewer.prototype.resize = function(width, height) {
        if (width !== undefined) {
            if (width.width !== undefined) {
                height = width.height;
                width = width.width;
            }
            $(this.object).find("#mir_panel").css("width", width);
            this.canvas[0].width = width;
            //width = $(this.object).width();
        }
        var w = width === undefined ? $(this.object).width()  : width;
        var h = height === undefined ? $(this.object).height()  : height;
        var aspect = w / h;

        this.dispatchEvent({ type:"resize", width:w, height:h});
    };

    return module;
}(sliderview || {}));
