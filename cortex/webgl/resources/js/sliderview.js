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
	
	    this.mir_values = new Array(21); //Array.apply(null, Array(21)).map(Number.prototype.valueOf,0);

		 for (var i = 0; i < this.mir_values.length; i++) { 
		 	this.mir_values[i] = 0;
		 }

        this.mir_feature_names = ['ZCR', 'CENTROID', 'BRIGHTNESS', 'SPREAD', 'ROLLOFF', 'ENTROPY', 'FLATNESS', 'ROUGHNESS', 'RMS', 'SUB_BAND_FLUX_01', 'SUB_BAND_FLUX_02', 'SUB_BAND_FLUX_03', 'SUB_BAND_FLUX_04', 'SUB_BAND_FLUX_05', 'SUB_BAND_FLUX_06', 'SUB_BAND_FLUX_07', 'SUB_BAND_FLUX_08', 'SUB_BAND_FLUX_09', 'SUB_BAND_FLUX_10', 'PULSE_CLARITY', 'KEY_CLARITY'];
	
        //this.controls.addEventListener("change", this.schedule.bind(this));
        
        //this._bindUI();
        
        $(this.object).find("#mir_features").tabs();
                
                 
        for (var i = 0; i < this.mir_feature_names.length; i++) {
    		console.log(this.mir_feature_names[i]);
    		
    		$(this.object).find("#mir_"+this.mir_feature_names[i]).slider({ min:-1, max:1, step:.01, disabled: false, value:this.mir_values[i], slide: function(event, ui) {			         	
            	this.mir_values[i] = ui.value;
            	//this.update_spec();
            	this.schedule();
 	      	}.bind(this)}).slider("pips").slider("float");
        
    		//Do something
		}
		
    }
    module.Viewer.prototype = Object.create(jsplot.Axes.prototype);
    module.Viewer.prototype.constructor = module.Viewer;
    
    // SView
    module.SView = function(parent, nrows, ncols) {
	    jsplot.GridFigure.call(this, parent, nrows, ncols);

		viewer = this.add(sliderview.Viewer, 0);

    }
    module.SView.prototype = Object.create(jsplot.GridFigure.prototype);
    module.SView.prototype.constructor = module.SView;
    
    
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
        }
        var w = width === undefined ? $(this.object).width()  : width;
        var h = height === undefined ? $(this.object).height()  : height;
        var aspect = w / h;

        this.dispatchEvent({ type:"resize", width:w, height:h});
    };

    return module;
}(sliderview || {}));
