var flatscale = .3;

var vShadeHead = [
    THREE.ShaderChunk[ "map_pars_vertex" ], 
    THREE.ShaderChunk[ "lights_phong_pars_vertex" ],
    THREE.ShaderChunk[ "morphtarget_pars_vertex" ],

    "attribute vec2 datamap;",
    "attribute vec4 auxdat;",
    "uniform sampler2D data[4];",
    "uniform vec2 datasize;",

    "uniform sampler2D colormap;",
    "uniform float vmin[2];",
    "uniform float vmax[2];",

    "uniform float framemix;",

    "varying vec3 vViewPosition;",
    "varying vec3 vNormal;",
    "varying vec4 vColor;",
    "varying float vCurv;",
    "varying float vDrop;",
    "varying float vMedial;",

    "void main() {",

        "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",

        THREE.ShaderChunk[ "map_vertex" ],

        //"float mix = smoothstep(0.,1.,framemix);",
        
        "vec2 dcoord = (2.*datamap+1.) / (2.*datasize);",
        "vDrop = auxdat.x;",
        "vCurv = auxdat.y;",
        "vMedial = auxdat.z;",
        "",
].join("\n");

var vShadeTail = [ "",
        "vViewPosition = -mvPosition.xyz;",

        THREE.ShaderChunk[ "morphnormal_vertex" ],

        "vNormal = transformedNormal;",

        THREE.ShaderChunk[ "lights_phong_vertex" ],
        THREE.ShaderChunk[ "morphtarget_vertex" ],
        THREE.ShaderChunk[ "default_vertex" ],

    "}"

].join("\n");

var cmapShader = vShadeHead + ([
        "float vdata0 = texture2D(data[0], dcoord).r;",
        "float vdata1 = texture2D(data[1], dcoord).r;",
        "float vdata2 = texture2D(data[2], dcoord).r;",
        "float vdata3 = texture2D(data[3], dcoord).r;",

        "float vnorm0 = (vdata0 - vmin[0]) / (vmax[0] - vmin[0]);",
        "float vnorm1 = (vdata1 - vmin[1]) / (vmax[1] - vmin[1]);",
        "float vnorm2 = (vdata2 - vmin[0]) / (vmax[0] - vmin[0]);",
        "float vnorm3 = (vdata3 - vmin[1]) / (vmax[1] - vmin[1]);",

        "float fnorm0 = (1. - framemix) * vnorm0 + framemix * vnorm2;",
        "float fnorm1 = (1. - framemix) * vnorm1 + framemix * vnorm3;",

        "vec2 cuv = vec2(clamp(fnorm0, 0., .999), clamp(fnorm1, 0., .999) );",

        "vColor  = texture2D(colormap, cuv);",
].join("\n")) + vShadeTail;

var rawShader = vShadeHead + ([
        "vColor  = (1. - framemix) * texture2D(data[0], dcoord);",
        "vColor +=       framemix  * texture2D(data[2], dcoord);",
        "vColor.rgb *= vColor.a;",
].join("\n")) + vShadeTail;

var fragmentShader = [
    THREE.ShaderChunk[ "map_pars_fragment" ],
    THREE.ShaderChunk[ "lights_phong_pars_fragment" ],

    "uniform sampler2D hatch;",
    "uniform vec2 hatchrep;",

    "uniform float curvAlpha;",
    "uniform float curvScale;",
    "uniform float curvLim;",
    "uniform float dataAlpha;",
    "uniform float hatchAlpha;",
    "uniform vec3 hatchColor;",

    "uniform vec3 diffuse;",
    "uniform vec3 ambient;",
    "uniform vec3 emissive;",
    "uniform vec3 specular;",
    "uniform float shininess;",

    "varying vec4 vColor;",
    "varying float vCurv;",
    "varying float vDrop;",
    "varying float vMedial;",

    "void main() {",
        //Curvature Underlay
        "gl_FragColor = vec4(vec3(clamp(vCurv / curvScale  + .5, curvLim, 1.-curvLim)), curvAlpha);",
        //Data layer
        "if (vMedial > .5) {",
            "gl_FragColor.rgb = vColor.rgb * dataAlpha + gl_FragColor.rgb * (1. - vColor.a*dataAlpha);",
            "gl_FragColor.a   = vColor.a * dataAlpha + gl_FragColor.a * (1. - vColor.a * dataAlpha);",
            //Cross hatch / dropout layer
            "float dw = gl_FrontFacing ? hatchAlpha*vDrop : 1.;",
            "vec4 hcolor = dw * vec4(hatchColor, 1.) * texture2D(hatch, vUv*hatchrep);",
            "gl_FragColor = hcolor + gl_FragColor * (1. - hcolor.a);",
            //roi layer
            "vec4 roi = texture2D(map, vUv);",
            "gl_FragColor = roi + gl_FragColor * (1. - roi.a);",
        "}",
        THREE.ShaderChunk[ "lights_phong_fragment" ],
    "}"

].join("\n");

var flatVertShade = [
    "varying vec3 vColor;",
    "attribute float idx;",
    THREE.ShaderChunk[ "morphtarget_pars_vertex" ],
    "void main() {",
        "vColor.r = floor(idx / (256. * 256.)) / 255.;",
        "vColor.g = mod(idx / 256., 256.) / 255.;",
        "vColor.b = mod(idx, 256.) / 255.;",
        THREE.ShaderChunk[ "morphtarget_vertex" ],
        THREE.ShaderChunk[ "default_vertex" ],
    "}",
].join("\n");

var flatFragShade = [
    "varying vec3 vColor;",
    "void main() {",
        "gl_FragColor = vec4(vColor, 1.);",
    "}"
].join("\n");

function MRIview() { 
    // scene and camera
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera( 60, $("#brain").width() / $("#brain").height(), 0.1, 5000 );
    this.camera.position.set(200, 200, 200);
    this.camera.up.set(0,0,1);

    this.scene.add( this.camera );
    this.controls = new THREE.LandscapeControls( this.camera );
    
    this.light = new THREE.DirectionalLight( 0xffffff );
    this.light.position.set( -200, -200, 1000 ).normalize();
    this.camera.add( this.light );
    this.flatmix = 0;
    this.frame = 0;

    // renderer
    this.renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        preserveDrawingBuffer:true, 
        canvas:$("#brain")[0] 
    });
    this.renderer.setClearColorHex( 0xFFFFFF, 1 );
    this.renderer.setSize( $("#brain").width(), $("#brain").height() );
    this.state = "pause";

    var uniforms = THREE.UniformsUtils.merge( [
        THREE.UniformsLib[ "lights" ],
        {
            diffuse:    { type:'v3', value:new THREE.Vector3( 1,1,1 )},
            specular:   { type:'v3', value:new THREE.Vector3( 1,1,1 )},
            emissive:   { type:'v3', value:new THREE.Vector3( 0,0,0 )},
            shininess:  { type:'f',  value:200},

            framemix:   { type:'f',  value:0},
            datasize:   { type:'v2', value:new THREE.Vector2(256, 0)},
            offsetRepeat:{type:'v4', value:new THREE.Vector4( 0, 0, 1, 1 ) },
            hatchrep:   { type:'v2', value:new THREE.Vector2(108, 40) },

            map:        { type:'t',  value:0, texture: null },
            hatch:      { type:'t',  value:1, texture: makeHatch() },
            colormap:   { type:'t',  value:2, texture: null },
            dropout:    { type:'t',  value:3, texture: null },
            curvature:  { type:'t',  value:4, texture: null },
            data:       { type:'tv', value:5, texture: [null, null, null, null] },

            vmin:       { type:'fv1',value:[0,0]},
            vmax:       { type:'fv1',value:[1,1]},

            curvAlpha:  { type:'f', value:1.},
            curvScale:  { type:'f', value:.5},
            curvLim:    { type:'f', value:.2},
            dataAlpha:  { type:'f', value:.9},
            hatchAlpha: { type:'f', value:1.},
            hatchColor: { type:'v3', value:new THREE.Vector3( 0,0,0 )},
        }
    ])

    this.shader =  this.cmapshader = new THREE.ShaderMaterial( { 
        vertexShader:cmapShader,
        fragmentShader:fragmentShader,
        uniforms: uniforms,
        attributes: { datamap:true, auxdat:true },
        morphTargets:true, 
        morphNormals:true, 
        lights:true, 
        vertexColors:true,
        blending:THREE.CustomBlending,
        transparent:true,
    });
    this.shader.map = true;
    this.shader.metal = true;
    this.shader.needsUpdate = true;
    this.shader.uniforms.hatch.texture.needsUpdate = true;

    this.rawshader = new THREE.ShaderMaterial( {
        vertexShader:rawShader,
        fragmentShader:fragmentShader,
        uniforms: THREE.UniformsUtils.clone(uniforms),
        attributes: { datamap:true, auxdat:true },
        morphTargets:true,
        morphNormals:true,
        lights:true,
        vertexColors:true,
        blending:THREE.CustomBlending,
        transparent:true,
    });
    this.rawshader.map = true;
    this.rawshader.metal = true;
    this.rawshader.needsUpdate = true;
    this.rawshader.uniforms.hatch.texture.needsUpdate = true;

    this.projector = new THREE.Projector();
    this._startplay = null;

    this.datasets = {}
    
    this._bindUI();
}
MRIview.prototype = { 
    draw: function () {
        this.controls.update(this.flatmix);
        if (this.state == "play") {
            var sec = ((new Date()) - this._startplay) / 1000;
            if (sec > this.active[0].textures.length) {
                sec -= this.active[0].textures.length;
                if (this.active[0].stim) {
                    this.active[0].stim.currentTime = this.active[0].delay;
                    this.active[0].stim.play();
                }
            }
            this.setFrame(sec);
            requestAnimationFrame(this.draw.bind(this));
        }
        this.renderer.render(this.scene, this.camera);
        if (this.roipack)
            this.roipack.move(this);
        this._scheduled = false;
    },
    load: function(ctminfo) {
        var loader = new THREE.CTMLoader(false);
        loader.loadParts( ctminfo, function( geometries, materials, header, json ) {
            var rawdata = new Uint32Array(header.length / 4);
            var charview = new Uint8Array(rawdata.buffer);
            for (var i = 0, il = header.length; i < il; i++) {
                charview[i] = header.charCodeAt(i);
            }

            var polyfilt = {};
            polyfilt.left = rawdata.subarray(2, rawdata[0]+2);
            polyfilt.right = rawdata.subarray(rawdata[0]+2);

            geometries[0].computeBoundingBox();
            geometries[1].computeBoundingBox();

            this.meshes = {};
            this.pivot = {};
            this.datamap = {};
            this.polys = { norm:{}, flat:{}}
            this.flatlims = json.flatlims;
            this.flatoff = [
                Math.max(
                    Math.abs(geometries[0].boundingBox.min.x),
                    Math.abs(geometries[1].boundingBox.max.x)
                ) / 3, Math.min(
                    geometries[0].boundingBox.min.y, 
                    geometries[1].boundingBox.min.y
                )];
            var names = {left:0, right:1};

            $.get(loader.extractUrlBase(ctminfo)+json.rois, null, function(svgdoc) {
                this.roipack = new ROIpack(svgdoc, function(tex) {
                    this.shader.uniforms.map.texture = tex;
                    this.controls.dispatchEvent({type:"change"});
                }.bind(this), 2048);
                this.roipack.update(this.renderer);
            }.bind(this));

            for (var name in names) {
                var right = names[name];
                this.datamap[name] = geometries[right].attributes.datamap.array;
                this._makeFlat(geometries[right], polyfilt[name], right);
                var meshpiv = this._makeMesh(geometries[right], this.shader);
                this.meshes[name] = meshpiv.mesh;
                this.pivot[name] = meshpiv.pivots;
                this.scene.add(meshpiv.pivots.front);

                this.polys.norm[name] =  geometries[right].attributes.index;
                this.polys.flat[name] = geometries[right].attributes.flatindex;
            }

            this.controls.flatsize = flatscale * this.flatlims[1][0];
            this.controls.flatoff = this.flatoff[1];
            this.controls.picker = new FacePick(this);
            this.controls.addEventListener("change", function() {
                if (!this._scheduled && this.state == "pause") {
                    this._scheduled = true;
                    requestAnimationFrame( this.draw.bind(this) );
                }
            }.bind(this));
            this.draw();
            $("#brain").css("opacity", 1);
            $("#ctmload").hide();
        }.bind(this), true, true );
    },
    resize: function(width, height) {
        if (width !== undefined) {
            $("#brain, #roilabels").css("width", width);
            width = $("#brain").width();
        }
        var w = width === undefined ? $("#brain").width()  : width;
        var h = height === undefined ? $("#brain").height()  : height;
        this.renderer.setSize(w, h);
        this.camera.aspect = w / h;
        this.controls.resize(w, h);
        this.camera.updateProjectionMatrix();
        this.controls.dispatchEvent({type:"change"});
    },
    screenshot: function(width, height, pre, post) {
        $("#main").css("opacity", 0);
        setTimeout(function() {
            if (typeof(pre) == "function")
                pre();
            this.resize(width, height);
            this.draw();
            var png = $("#brain")[0].toDataURL();
            this.resize();
            
            if (typeof(post) == "function")
                post(png);
            else
                window.location.href = png.replace("image/png", "application/octet-stream");
            $("#main").css("opacity", 1);
        }.bind(this), 500);
    },
    reset_view: function(center, height) {
        var camasp = height !== undefined ? this.flatlims[1][0] / this.flatlims[1][1] : this.camera.aspect;
        var size = [flatscale*this.flatlims[1][0], flatscale*this.flatlims[1][1]];
        var min = [flatscale*this.flatlims[0][0], flatscale*this.flatlims[0][1]];
        var xoff = center ? 0 : size[0] / 2 - min[0];
        var zoff = center ? 0 : size[1] / 2 - min[1];
        var h = size[0] / 2 / camasp;
        h /= Math.tan(this.camera.fov / 2 * Math.PI / 180);
        this.controls.target.set(xoff, this.flatoff[1], zoff);
        this.controls.setCamera(180, 90, h);
        this.setMix(1);
        this.setShift(0);
    },
    saveflat: function(height, posturl) {
        var width = height * this.flatlims[1][0] / this.flatlims[1][1];;
        var roistate = $("#roishow").attr("checked");
        this.screenshot(width, height, function() { 
            this.reset_view(false, height); 
            $("#roishow").attr("checked", false);
            $("#roishow").change();
        }.bind(this), function(png) {
            $("#roishow").attr("checked", roistate);
            $("#roishow").change();
            this.controls.target.set(0,0,0);
            this.roipack.saveSVG(png, posturl);
        }.bind(this));
    }, 
    setMix: function(val) {
        var num = this.meshes.left.geometry.morphTargets.length;
        var flat = num - 1;
        var n1 = Math.floor(val * num)-1;
        var n2 = Math.ceil(val * num)-1;

        for (var h in this.meshes) {
            var hemi = this.meshes[h];
            
            for (var i=0; i < num; i++) {
                hemi.morphTargetInfluences[i] = 0;
            }

            if ((this.lastn2 == flat) ^ (n2 == flat)) {
                this.setPoly(n2 == flat ? "flat" : "norm");
            }

            hemi.morphTargetInfluences[n2] = (val * num)%1;
            if (n1 >= 0)
                hemi.morphTargetInfluences[n1] = 1 - (val * num)%1;
        }
        this.flatmix = n2 == flat ? (val*num-.000001)%1 : 0;
        this.setPivot(this.flatmix*180);
        this.shader.uniforms.specular.value.set(1-this.flatmix, 1-this.flatmix, 1-this.flatmix);
        this.lastn2 = n2;
        $("#mix").slider("value", val);
        this.controls.update(this.flatmix);
        this.controls.setCamera();
        this.controls.dispatchEvent({type:"change"});
    }, 
    setPivot: function (val) {
        $("#pivot").slider("option", "value", val);
        var names = {left:1, right:-1}
        if (val > 0) {
            for (var name in names) {
                this.pivot[name].front.rotation.z = 0;
                this.pivot[name].back.rotation.z = val*Math.PI/180 * names[name]/ 2;
            }
        } else {
            for (var name in names) {
                this.pivot[name].back.rotation.z = 0;
                this.pivot[name].front.rotation.z = val*Math.PI/180 * names[name] / 2;
            }
        }
        this.controls.dispatchEvent({type:"change"});
    },
    setShift: function(val) {
        this.pivot.left.front.position.x = -val;
        this.pivot.right.front.position.x = val;
        this.controls.dispatchEvent({type:"change"});
    },
    setPoly: function(polyvar) {
        for (var name in this.meshes) {
            this.meshes[name].geometry.attributes.index = this.polys[polyvar][name];
            this.meshes[name].geometry.offsets[0].count = this.polys[polyvar][name].numItems;
        }
        this.controls.dispatchEvent({type:"change"});
    },
    addData: function(data) {
        if (data instanceof NParray || data instanceof Dataset)
            data = {'data0':data};

        var name, names = [];
        if (data.__order__ !== undefined) {
            names = data.__order__;
            delete data.__order__;
        } else {
            for (name in data) {
                names.push(name);
            }
            names.sort();
        }

        var handle = "<div class='handle'><span class='ui-icon ui-icon-carat-2-n-s'></span></div>";
        for (var i = 0; i < names.length; i++) {
            name = names[i];
            if (data[name] instanceof Dataset) {
                this.datasets[name] = data[name];
            } else if (data[name] instanceof NParray) {
                this.datasets[name] = new Dataset(data[name]);
            }
            $("#datasets").append("<li class='ui-corner-all'>"+handle+name+"</li>");
        }
        var func = function() {
            this.setData(names.slice(0,this.colormap.image.height > 10 ? 2 : 1));
        }.bind(this);

        if (this.colormap.image.complete)
            func();
        else
            this.colormap.image.addEventListener("load", func);
    },
    setData: function(names) {
        if (names instanceof Array) {
            if (names.length > (this.colormap.image.height > 10 ? 2 : 1))
                return false;

            this.active = [this.datasets[names[0]]];
            this.datasets[names[0]].set(this, 0);
            $("#datasets li").each(function() {
                if ($(this).text() == names[0])
                    $(this).addClass("ui-selected");
            })
            if (names.length > 1) {
                this.active.push(this.datasets[names[1]]);
                this.datasets[names[1]].set(this, 1);
                $("#datasets li").each(function() {
                    if ($(this).text() == names[1])
                        $(this).addClass("ui-selected");
                })
            } else {
                this.shader.uniforms.data.texture[1] = this.blanktex;
                this.shader.uniforms.data.texture[3] = this.blanktex;
            }
        } else {
            return false;
        }
        
        this.controls.dispatchEvent({type:"change"});
        $("#datasets").val(names);
        $("#dataname").text(names.join(" / "));
        return true;
    },

    addPlugin: function(obj) {
        $("#bar").css('display', 'table');
        $("#sidepanel>div").html(obj);
        var _lastwidth = "60%";
        var resizepanel = function() {
            var width = $("#bar").position().left / $(window).width() * 100 + "%";
            this.resize(width);
            $("#sidepanel")
                .width(100-parseFloat(width)+"%")
                .css("left", width).css('display', 'table');
            $("#bar").css("left", width);
            _lastwidth = width;
        }.bind(this);

        $("#bar")
            .draggable({axis:'x', drag: resizepanel, stop: resizepanel})
            .click(function() {
                var width = document.getElementById("brain").style.width;
                if (width == "100%" || width == "") {
                    width = _lastwidth;
                    $("#sidepanel").css('display', 'table');
                } else {
                    width = "100%";
                    $("#sidepanel").hide();
                }
                this.resize(width);
                $("#bar").css("left", width);
                $("#sidepanel").width(100-parseFloat(width)+"%").css('left', width);
            }.bind(this));
        $("#bar").click();
    },
    rmPlugin: function() {
        $("#bar").hide();
        this.resize("100%");
        $("sidepanel").width("0%").hide();
    },

    setColormap: function(cmap) {
        if (cmap instanceof Image || cmap instanceof Element) {
            this.colormap = new THREE.Texture(cmap);
        } else if (cmap instanceof NParray) {
            var ncolors = cmap.shape[cmap.shape.length-1];
            if (ncolors != 3 && ncolors != 4)
                throw "Invalid colormap shape"
            var height = cmap.shape.length > 2 ? cmap.shape[1] : 1;
            var fmt = ncolors == 3 ? THREE.RGBFormat : THREE.RGBAFormat;
            this.colormap = new THREE.DataTexture(cmap.data, cmap.shape[0], height, fmt);
        }

        var func = function() {
            this.colormap.needsUpdate = true;
            this.colormap.premultiplyAlpha = true;
            this.colormap.flipY = true;
            this.colormap.minFilter = THREE.LinearFilter;
            this.colormap.magFilter = THREE.LinearFilter;
            this.shader.uniforms.colormap.texture = this.colormap;
            this.controls.dispatchEvent({type:"change"});
            
            if (this.colormap.image.height > 10) {
                $(".vcolorbar").show();
            } else {
                $(".vcolorbar").hide();
            }
        }.bind(this);

        if ((cmap instanceof Image || cmap instanceof Element) && !cmap.complete) {
            cmap.addEventListener("load", func);
        } else {
            func();
        }
    },

    setVminmax: function(vmin, vmax, dim) {
        if (dim === undefined)
            dim = 0;
        this.shader.uniforms.vmin.value[dim] = vmin;
        this.shader.uniforms.vmax.value[dim] = vmax;

        var range, min, max;
        if (dim == 0) {
            range = "#vrange"; min = "#vmin"; max = "#vmax";
        } else {
            range = "#vrange2"; min = "#vmin2"; max = "#vmax2";
        }

        if (vmax > $(range).slider("option", "max")) {
            $(range).slider("option", "max", vmax);
            this.active[dim].lmax = vmax;
        } else if (vmin < $(range).slider("option", "min")) {
            $(range).slider("option", "min", vmin);
            this.active[dim].lmin = vmin;
        }
        $(range).slider("values", [vmin, vmax]);
        $(min).val(vmin);
        $(max).val(vmax);
        this.active[dim].min = vmin;
        this.active[dim].max = vmax;

        this.controls.dispatchEvent({type:"change"});
    },
    _setShader: function(raw, datasize) {
        if (raw) {
            this.shader = this.rawshader;
            if (this.meshes && this.meshes.left) {
                this.meshes.left.material = this.rawshader;
                this.meshes.right.material = this.rawshader;
            }
        } else {
            this.shader = this.cmapshader;
            if (this.meshes && this.meshes.left) {
                this.meshes.left.material = this.cmapshader;
                this.meshes.right.material = this.cmapshader;
            }
        }
        this.shader.uniforms.datasize.value = datasize;
    }, 

    setFrame: function(frame) {
        this.frame = frame;
        var fframe = Math.floor(frame);
        if (this.active[0].array !== undefined) {
            this.shader.uniforms.data.texture[0] = this.active[0].textures[fframe];
            this.shader.uniforms.data.texture[2] = this.active[0].textures[fframe+1];
        }
        if (this.active.length > 1 && this.active[1].array !== undefined) {
            this.shader.uniforms.data.texture[1] = this.active[1].textures[fframe];
            this.shader.uniforms.data.texture[3] = this.active[1].textures[fframe+1];
        }
        this.shader.uniforms.framemix.value = frame - fframe;
        $("#movieprogress div").slider("value", frame);
        $("#movieframe").attr("value", frame);
        this.controls.dispatchEvent({type:"change"});
    },
    playpause: function() {
        var dataset = this.active[0];
        if (this.state == "pause") {
            //Start playing
            var func = function() {
                this._startplay = (new Date()) - this.frame * 1000;
                this.controls.dispatchEvent({type:"change"});
                this.state = "play";
                $("#moviecontrols img").attr("src", "resources/images/control-pause.png");
            }.bind(this);

            if (dataset.stim !== undefined) {
                dataset.stim.currentTime = this.frame+dataset.delay;
                $(dataset.stim).bind("playing", function() {
                    func();
                    $(dataset.stim).unbind("playing");
                });
                dataset.stim.play()
            } else {
                func();
            }
        } else {
            this.state = "pause";
            $("#moviecontrols img").attr("src", "resources/images/control-play.png");

            if (dataset.stim !== undefined) {
                dataset.stim.currentTime = this.frame+dataset.delay;
                dataset.stim.pause();
            }
        }
    },
    getPos: function(idx) {
        //Returns the 2D screen coordinate of the given point index

        //Which hemi is the point on?
        var leftlen = this.meshes.left.geometry.attributes.position.array.length / 3;
        var name = idx < leftlen ? "left" : "right";
        if (idx >= leftlen)
            idx -= leftlen;
        var hemi = this.meshes[name].geometry;
        var influ = this.meshes[name].morphTargetInfluences;

        var basepos = new THREE.Vector3(
            hemi.attributes.position.array[idx*3+0],
            hemi.attributes.position.array[idx*3+1],
            hemi.attributes.position.array[idx*3+2]
        );
        var basenorm = new THREE.Vector3(
            hemi.attributes.normal.array[idx*3+0],
            hemi.attributes.normal.array[idx*3+1],
            hemi.attributes.normal.array[idx*3+2]
        );

        var isum = 0;
        var mpos = new THREE.Vector3(0,0,0);
        var mnorm = new THREE.Vector3(0,0,0);
        for (var i = 0, il = hemi.morphTargets.length; i < il; i++) {
            isum += influ[i];
            var mt = hemi.morphTargets[i];
            var mn = hemi.morphNormals[i];
            var pos = new THREE.Vector3(
                mt.array[mt.stride*idx+0],
                mt.array[mt.stride*idx+1],
                mt.array[mt.stride*idx+2]
            );
            var norm = new THREE.Vector3(mn[3*idx], mn[3*idx+1], mn[3*idx+2]);
            pos.multiplyScalar(influ[i]);
            norm.multiplyScalar(influ[i]);
            mpos.addSelf(pos);
            mnorm.addSelf(norm);
        }
        
        var pos = basepos.multiplyScalar(1-isum).addSelf(mpos);
        var norm = basenorm.multiplyScalar(1-isum).addSelf(mnorm).addSelf(pos);

        pos = this.meshes[name].matrix.multiplyVector3(pos);
        pos = this.pivot[name].back.matrix.multiplyVector3(pos);
        pos = this.pivot[name].front.matrix.multiplyVector3(pos);
        norm = this.meshes[name].matrix.multiplyVector3(norm);
        norm = this.pivot[name].back.matrix.multiplyVector3(norm);
        norm = this.pivot[name].front.matrix.multiplyVector3(norm);

        var cpos = this.camera.position.clone().subSelf(pos).normalize();
        var dot = -norm.subSelf(pos).normalize().dot(cpos);

        var spos = this.projector.projectVector(pos, this.camera);
        var w = this.renderer.domElement.width;
        var h = this.renderer.domElement.height;
        var x = (spos.x + 1) / 2 * w;
        var y = h - (spos.y + 1) / 2 * h;

        return [[x, y], dot];
    },

    _bindUI: function() {
        $(window).resize(function() { this.resize(); }.bind(this));
        $("#brain").resize(function() { this.resize(); }.bind(this));
        window.addEventListener( 'keypress', function(e) {
            if (e.keyCode == 32 && this.active[0].textures.length > 1) {
                this.playpause();
                e.stopPropagation();
                e.preventDefault();
            }
        }.bind(this))
        var _this = this;
        $("#mix").slider({
            min:0, max:1, step:.001,
            slide: function(event, ui) { this.setMix(ui.value); }.bind(this)
        });
        $("#pivot").slider({
            min:-180, max:180, step:.01,
            slide: function(event, ui) { this.setPivot(ui.value); }.bind(this)
        });

        $("#shifthemis").slider({
            min:0, max:100, step:.01,
            slide: function(event, ui) { this.setShift(ui.value); }.bind(this)
        });

        if ($("#color_fieldset").length > 0) {
            $("#colormap").ddslick({ width:296, height:400, 
                onSelected: function() { 
                    this.setColormap($("#colormap .dd-selected-image")[0]);
                }.bind(this)
            });

            $("#vrange").slider({ 
                range:true, width:200, min:0, max:1, step:.001, values:[0,1],
                slide: function(event, ui) { this.setVminmax(ui.values[0], ui.values[1]); }.bind(this)
            });
            $("#vmin").change(function() { this.setVminmax(parseFloat($("#vmin").val()), parseFloat($("#vmax").val())); }.bind(this));
            $("#vmax").change(function() { this.setVminmax(parseFloat($("#vmin").val()), parseFloat($("#vmax").val())); }.bind(this));

            $("#vrange2").slider({ 
                range:true, width:200, min:0, max:1, step:.001, values:[0,1], orientation:"vertical",
                slide: function(event, ui) { this.setVminmax(ui.values[0], ui.values[1], 1); }.bind(this)
            });
            $("#vmin2").change(function() { this.setVminmax(parseFloat($("#vmin2").val()), parseFloat($("#vmax2").val()), 1); }.bind(this));
            $("#vmax2").change(function() { this.setVminmax(parseFloat($("#vmin2").val()), parseFloat($("#vmax2").val()), 1); }.bind(this));            
        }
        var updateROIs = function() {
            this.roipack.update(this.renderer);
        }.bind(this);
        $("#roi_linewidth").slider({
            min:.5, max:10, step:.1, value:3,
            change: updateROIs,
        });
        $("#roi_linealpha").slider({
            min:0, max:1, step:.001, value:1,
            change: updateROIs,
        });
        $("#roi_fillalpha").slider({
            min:0, max:1, step:.001, value:0,
            change: updateROIs,
        });
        $("#roi_shadowalpha").slider({
            min:0, max:20, step:1, value:4,
            change: updateROIs,
        });
        $("#roi_linecolor").miniColors({close: updateROIs});
        $("#roi_fillcolor").miniColors({close: updateROIs});
        $("#roi_shadowcolor").miniColors({close: updateROIs});

        var blanktex = new THREE.DataTexture(new Uint8Array(16*16*4), 16, 16);
        blanktex.needsUpdate = true;
        var _this = this;
        this.blanktex = blanktex;
        $("#roishow").change(function() {
            if (this.checked) 
                updateROIs();
            else {
                _this.shader.uniforms.map.texture = blanktex;
                _this.controls.dispatchEvent({type:"change"});
            }
        });

        $("#labelshow").change(function() {
            this.roipack.labels.toggle();
        }.bind(this));

        $("#layer_curvalpha").slider({ min:0, max:1, step:.001, value:1, slide:function(event, ui) {
            this.shader.uniforms.curvAlpha.value = ui.value;
            this.controls.dispatchEvent({type:"change"});
        }.bind(this)})
        $("#layer_curvmult").slider({ min:.001, max:2, step:.001, value:1, slide:function(event, ui) {
            this.shader.uniforms.curvScale.value = ui.value;
            this.controls.dispatchEvent({type:"change"});
        }.bind(this)})
        $("#layer_curvlim").slider({ min:0, max:.5, step:.001, value:.2, slide:function(event, ui) {
            this.shader.uniforms.curvLim.value = ui.value;
            this.controls.dispatchEvent({type:"change"});
        }.bind(this)})
        $("#layer_dataalpha").slider({ min:0, max:1, step:.001, value:.9, slide:function(event, ui) {
            this.shader.uniforms.dataAlpha.value = ui.value;
            this.controls.dispatchEvent({type:"change"});
        }.bind(this)})
        $("#layer_hatchalpha").slider({ min:0, max:1, step:.001, value:1, slide:function(event, ui) {
            this.shader.uniforms.hatchAlpha.value = ui.value;
            this.controls.dispatchEvent({type:"change"});
        }.bind(this)})
        $("#layer_hatchcolor").miniColors({close: function(hex, rgb) {
            this.shader.uniforms.hatchColor.value.set(rgb.r / 255, rgb.g / 255, rgb.b / 255);
            this.controls.dispatchEvent({type:"change"});
        }.bind(this)});

        $("#resetfid").click(function() {
            this.setMix(0);
            this.controls.target.set(0,0,0);
            this.controls.setCamera(45, 45, 200);
            this.controls.dispatchEvent({type:"change"});
        }.bind(this));
        $("#resetflat").click(function() {
            this.reset_view();
        }.bind(this));

        //Dataset box
        var setdat = function(event, ui) {
            var names = [];
            $("#datasets li.ui-selected").each(function() { names.push($(this).text()); });
            this.setData(names);
        }.bind(this)
        $("#datasets")
            .sortable({ 
                handle: ".handle",
                stop: setdat,
             })
            .selectable({
                selecting: function(event, ui) {
                    var max = this.colormap.image.height > 10 ? 2 : 1;
                    var selected = $("#datasets").find("li.ui-selected, li.ui-selecting");
                    if (selected.length > max) {
                        $(ui.selecting).removeClass("ui-selecting");
                    }
                }.bind(this),
                unselecting: function(event, ui) {
                    var selected = $("#datasets").find("li.ui-selected, li.ui-selecting");
                    if (selected.length < 1) {
                        $(ui.unselecting).addClass("ui-selecting");
                    }
                },
                stop: setdat,
            });


        $("#moviecontrol").click(this.playpause.bind(this));

        $("#movieprogress div").slider({min:0, max:1, step:.01,
            slide: function(event, ui) { 
                this.setFrame(ui.value); 
                var dataset = this.active[0];
                if (dataset.stim !== undefined) {
                    dataset.stim.currentTime = ui.value + dataset.delay;
                }
            }.bind(this)
        });

        $("#movieframe").change(function() { 
            _this.setFrame(this.value); 
            var dataset = _this.active[0];
            if (dataset.stim !== undefined) {
                dataset.stim.currentTime = this.value + dataset.delay;
            }
        });
    },

    _makeFlat: function(geom, polyfilt, right) {
        geom.computeBoundingSphere();
        geom.dynamic = true;
        
        var fmin = this.flatlims[0], fmax = this.flatlims[1];
        var uv = geom.attributes.uv.array;
        var aux = geom.attributes.auxdat.array;
        var flat = new Float32Array(uv.length / 2 * 3);
        var norms = new Float32Array(uv.length / 2 * 3);
        for (var i = 0, il = uv.length / 2; i < il; i++) {
            if (!right) {
                //flat[i*3] = -this.flatoff[0];
                flat[i*3+1] = flatscale * -uv[i*2] + this.flatoff[1];
                norms[i*3] = -1;
            } else {
                //flat[i*3] = this.flatoff[0];
                flat[i*3+1] = flatscale*uv[i*2] + this.flatoff[1];
                norms[i*3] = 1;
            }
            flat[i*3+2] = flatscale*uv[i*2+1];
            uv[i*2]   = (uv[i*2]   + fmin[0]) / fmax[0];
            uv[i*2+1] = (uv[i*2+1] + fmin[1]) / fmax[1];
        }
        geom.morphTargets.push({ array:flat, stride:3 })
        geom.morphNormals.push( norms );

        //Make the triangle indicies with cuts
        var polys = new Uint16Array(geom.attributes.index.array.length - polyfilt.length*3);
        var j = 0;
        for (var i = 0, il = geom.attributes.index.array.length / 3; i < il; i++) {
            if (i != polyfilt[i-j]) {
                polys[j*3]   = geom.attributes.index.array[i*3];
                polys[j*3+1] = geom.attributes.index.array[i*3+1];
                polys[j*3+2] = geom.attributes.index.array[i*3+2];
                aux[polys[j*3+0]*4+2] = 1;
                aux[polys[j*3+1]*4+2] = 1;
                aux[polys[j*3+2]*4+2] = 1;
                j++;
            }
        }

        geom.attributes.flatindex = {itemsize:1, array:polys, numItems:polys.length, stride:1};

        var voxidx = new Uint8Array(uv.length / 2 * 3);
        for (var i = 0, il = uv.length / 2; i < il; i ++) {
            voxidx[i*3+0] = Math.floor(i / (256*256));
            voxidx[i*3+1] = Math.floor(i / 256);
            voxidx[i*3+2] = i %256;
        }

        geom.attributes.voxidx = {itemsize:3, array:voxidx, stride:3};
    },
    _makeMesh: function(geom, shader) {
        var mesh = new THREE.Mesh(geom, shader);
        mesh.doubleSided = true;
        mesh.position.y = -this.flatoff[1];
        var pivots = {back:new THREE.Object3D(), front:new THREE.Object3D()};
        pivots.back.add(mesh);
        pivots.front.add(pivots.back);
        pivots.back.position.y = geom.boundingBox.min.y - geom.boundingBox.max.y;
        pivots.front.position.y = geom.boundingBox.max.y - geom.boundingBox.min.y + this.flatoff[1];
        return {mesh:mesh, pivots:pivots};
    }, 
}

function makeHatch(size, linewidth, spacing) {
    if (spacing === undefined)
        spacing = 32;
    if (size === undefined)
        size = 128;
    var canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    var ctx = canvas.getContext("2d");
    //ctx.fillStyle = "rgb(255, 255, 255);"
    //ctx.fillRect(0,0,size,size);
    ctx.lineWidth = linewidth ? linewidth: 8;
    ctx.strokeStyle = "white";
    for (var i = 0, il = size*2; i < il; i+=spacing) {
        ctx.beginPath();
        ctx.moveTo(i-size, 0);
        ctx.lineTo(i, size);
        ctx.stroke();
        ctx.moveTo(i, 0)
        ctx.lineTo(i-size, size);
        ctx.stroke();
    }

    var tex = new THREE.Texture(canvas);
    tex.needsUpdate = true;
    tex.premultiplyAlpha = true;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.magFilter = THREE.LinearFilter;
    tex.minFilter = THREE.LinearMipMapLinearFilter;
    return tex;
}

function classify(data) {
    if (data['__class__'] !== undefined) {
        data = window[data['__class__']].fromJSON(data);
    } else {
        for (var name in data) {
            if (data[name] instanceof Object){
                data[name] = classify(data[name])
            }
        }
    }
    return data
}

var dtypeNames = {
    "uint32":Uint32Array,
    "uint16":Uint16Array,
    "uint8":Uint8Array,
    "int32":Int32Array,
    "int16":Int16Array,
    "int8":Int8Array,
    "float32":Float32Array,
}
var dtypeMap = [Uint32Array, Uint16Array, Uint8Array, Int32Array, Int16Array, Int8Array, Float32Array]
var loadCount = 0;
function NParray(data, dtype, shape) {
    this.data = data;
    this.shape = shape;
    this.dtype = dtype;
    this.size = this.data.length;
}
NParray.fromJSON = function(json) {
    var size = json.shape.length ? json.shape[0] : 0;
    for (var i = 1, il = json.shape.length; i < il; i++) {
        size *= json.shape[i];
    }
    var pad = 0;
    if (json.pad) {
        size += json.pad;
        pad = json.pad;
    }

    var data = new (dtypeNames[json.dtype])(size);
    var charview = new Uint8Array(data.buffer);
    var bytes = charview.length / data.length;
    
    var str = atob(json.data.slice(0,-1));
    var start = pad*bytes, stop  = size*bytes - start;
    for ( var i = start, il = Math.min(stop, str.length); i < il; i++ ) {
        charview[i] = str.charCodeAt(i - start);
    }

    return new NParray(data, json.dtype, json.shape);
}
NParray.fromURL = function(url, callback) {
    loadCount++;
    $("#dataload").show();
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function(e) {
        if (this.readyState == 4 && this.status == 200) {
            loadCount--;
            var data = new Uint32Array(this.response, 0, 2);
            var dtype = dtypeMap[data[0]];
            var ndim = data[1];
            var shape = new Uint32Array(this.response, 8, ndim);
            var array = new dtype(this.response, (ndim+2)*4);
            callback(new NParray(array, dtype, shape));
            if (loadCount == 0)
                $("#dataload").hide();
        }
    };
    xhr.send()
}
NParray.prototype.view = function() {
    if (arguments.length == 1 && this.shape.length > 1) {
        var shape;
        var slice = arguments[0];
        if (this.shape.slice)
            shape = this.shape.slice(1);
        else
            shape = this.shape.subarray(1);
        var size = shape[0];
        for (var i = 1, il = shape.length; i < il; i++) {
            size *= shape[i];
        }
        return new NParray(this.data.subarray(slice*size, (slice+1)*size), this.dtype, shape);
    } else {
        throw "Can only slice in first dimension for now"
    }
}
NParray.prototype.minmax = function() {
    var min = Math.pow(2, 32);
    var max = -min;

    for (var i = 0, il = this.data.length; i < il; i++) {
        if (this.data[i] < min) {
            min = this.data[i];
        }
        if (this.data[i] > max) {
            max = this.data[i];
        }
    }

    return [min, max];
}

function Dataset(nparray) {
    if (nparray instanceof NParray) {
        this.init(nparray);
    }
}
Dataset.fromJSON = function(json) {
    var ds;
    if (json.data instanceof NParray) {
        ds = new Dataset(json.data);
    } else if (typeof(json.data) == "string") {
        ds = new Dataset(null);
        NParray.fromURL(json.data, function(array) {
            ds.init(array);
        });
    }
    if (json.stim !== undefined)
        ds.addStim(json.stim, json.delay);
    ds.min = json.min;
    ds.max = json.max;
    return ds;
}
Dataset.maketex = function(array, shape, raw, slice) {
    var tex, data, form;
    var arr = slice === undefined ? array : array.view(slice);
    var size = array.shape[array.shape.length-1];
    var len = shape[0] * shape[1] * (raw ? size : 1);
    
    data = new array.data.constructor(len);
    data.set(arr.data);
    if (raw) {
        form = size == 4 ? THREE.RGBAFormat : THREE.RGBFormat;
        tex = new THREE.DataTexture(data, shape[0], shape[1], form, THREE.UnsignedByteType);
    } else {
        tex = new THREE.DataTexture(data, shape[0], shape[1], THREE.LuminanceFormat, THREE.FloatType);
    }
    tex.needsUpdate = true;
    tex.flipY = false;
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    return tex;
}
Dataset.prototype = { 
    init: function(nparray) {
        this.array = nparray;
        this.raw = nparray.data instanceof Uint8Array && nparray.shape.length > 1;
        this.textures = [];

        if ((this.raw && nparray.shape.length > 2) || (!this.raw && nparray.shape.length > 1)) {
            //Movie
            this.datasize = new THREE.Vector2(256, Math.ceil(nparray.shape[1] / 256));
            for (var i = 0; i < nparray.shape[0]; i++) {
                this.textures.push(Dataset.maketex(nparray, [this.datasize.x, this.datasize.y], this.raw, i));
            }
        } else {
            //Single frame
            this.datasize = new THREE.Vector2(256, Math.ceil(nparray.shape[0] / 256));
            this.textures.push(Dataset.maketex(nparray, [this.datasize.x, this.datasize.y], this.raw));
        }
        var minmax = nparray.minmax();
        this.lmin = minmax[0];
        this.lmax = minmax[1];
        if (this.min === undefined)
            this.min = this.lmin;
        if (this.max === undefined)
            this.max = this.lmax;

        if (this._func !== undefined) {
            this._func();
            delete this._func;
        }
    },
    addStim: function(url, delay) {
        this.delay = delay;
        this.stim = document.createElement("video");
        this.stim.id = "stim_movie";
        this.stim.setAttribute("preload", "");
        this.stim.setAttribute("autobuffer", "");
        var src = document.createElement("source");
        src.setAttribute("type", 'video/ogg; codecs="theora, vorbis"');
        src.setAttribute("src", url);
        this.stim.appendChild(src);
    },
    set: function(viewer, dim) {
        if (dim === undefined)
            dim = 0;
        var func = function() {
            viewer._setShader(this.raw, this.datasize);
            if (this.textures.length > 1) {
                viewer.setFrame(0);
                $("#moviecontrols").show();
                $("#bottombar").addClass("bbar_controls");
                $("#movieprogress div").slider("option", {min:0, max:this.textures.length});
            } else {
                viewer.shader.uniforms.data.texture[dim] = this.textures[0];
                $("#moviecontrols").hide();
                $("#bottombar").removeClass("bbar_controls");
            }

            $(dim == 0 ? "#vrange" : "#vrange2").slider("option", {min: this.lmin, max:this.lmax});
            viewer.setVminmax(this.min, this.max, dim);

            if (dim > 0)
                return;

            if (this.stim === undefined) {
                viewer.rmPlugin();
            } else {
                viewer.addPlugin(this.stim);
                var delay = viewer.frame + this.delay;
                if (this.stim.readyState == 4) {
                    this.stim.currentTime = delay;
                } else {
                    $(this.stim).bind("loadeddata", function() {
                        this.currentTime = delay;
                        $(this).unbind("loadeddata");
                    });
                }
            }
        }.bind(this);
        if (this.array !== undefined)
            func();
        else
            this._func = func;
    },
}