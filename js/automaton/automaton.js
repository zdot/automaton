define([
    'pattern',
    'canvas',
    'panel',
    'bigint', 
    'utils'], function (
        Pattern, 
        Canvas,
        Panel,
        B, 
        _ ) {
    
    
    'use strict';
    
    
    var nextRow = function (seed, pattern) {
        
        var next = '';
        var i = seed.length;
        var nextLen = i;
        
        while (i--) {
            
            var j = nextLen - i - 1;
            var value = pattern.ruleKey[ _.look(
                seed, pattern.neighborhood, j)];
                
                if (typeof value === 'undefined') return false; 
                
            next += value;
        }
        return next;
    };
    
    
    function Automaton (
            colors, 
            neighborhood, 
            ruleID, 
            input,
            size) {
        
        this.pattern = new Pattern (
            colors, 
            neighborhood, 
            ruleID );
        
        this.canvas = new Canvas (
            size, 
            this.pattern.rules );
        
        this.input = input || '1';
        
        this.panel = new Panel (this.serializeOptions());
        
        // draw settings
        this._count = 0;
        this._speed = 3;
        
        this.initEvents();
    }
    
    
    Automaton.prototype = {
        
        set input (input) {
            
            this._input = this.validateInput(input);
            this.output = this._input;
        },
        
        get input () {
            
            return this._input;
        },
    };
    
    
    Automaton.prototype.padInput = function (input) {
        
        var seed = _.fill('0', this.canvas.aw, '');
        var index = Math.floor((this.canvas.aw - input.length) / 2);
        return _.replaceAt(seed, index, input);
    };
    
    
    Automaton.prototype.trimInput = function (input) {
        
        var index = Math.floor( (input.length - this.canvas.aw) / 2);
        return input.substr(index, this.canvas.aw);
    };
    
    
    Automaton.prototype.validateInputBase = function (input) {
        
        // remove invalid base chars from input if
        // stepping down from a higher base
        
        var maxValue = (this.pattern.colors - 1).toString(10);
        var regex = new RegExp('[^0-' + maxValue + ']', 'g');
        return input.replace(regex, '0');
    };
    
    
    Automaton.prototype.validateInputLength = function (input) {
        
        // verify seed is the right width 
        
        if (this.canvas.aw > input.length) {
            
            return this.padInput(input);
        } 
        
        else if (this.canvas.aw < input.length) {
            
            return this.trimInput(input);
        }
        
        else {
            
            return input;
        }
    };
    
    
    Automaton.prototype.validateInput = function (input) {
        
        input = this.validateInputLength(input);
        input = this.validateInputBase(input);
        return input;
    };
    
    
    Automaton.prototype.serializeOptions = function () {
        
        return {
            'pattern': {
                'colors': this.pattern.colors,
                'neighborhood': this.pattern.neighborhood,
                'rule': this.pattern.rule,
                'rules': this.pattern.rules,
                'ruleID': B.toString_( this.pattern.ruleID ),
                'universe': B.toString_( this.pattern.universe )
            },
            'canvas': {
                'aw': this.canvas.aw,
                'ah': this.canvas.ah,
                'size': this.canvas.size,
                'colors': this.canvas.colors
            }
        };
    };
    
    
    Automaton.prototype.serializeAutomaton = function () {
        
        return JSON.stringify({
            'colors': this.pattern.colors,
            'neighborhood': this.pattern.neighborhood,
            'ruleID': B.toString_( this.pattern.ruleID ),
            'input': this.input,
            'size': this.canvas.size
        });
    };
    
    
    Automaton.prototype.updatePattern = function (options) {
        
        for (var key in options) {
            
            this.pattern[key] = options[key];
        }
    };
    
    
    Automaton.prototype.updateCanvas = function (options) {
        
        for (var key in options) {
            
            this.canvas[key] = options[key];
        }
    };
    
    
    Automaton.prototype.createRandomInput = function (density) {
        
        var seed = _.fill('0', this.canvas.aw, '');
        
        for (var i=0; i < this.pattern.colors * density; i++) {
            
            var color = _.randInt(0, this.pattern.colors - 1);
            var index = _.randInt(0, this.canvas.aw - 1);
            seed = _.replaceAt(seed, index, color.toString(10));
        }
        
        this.input = seed;
    };
    
    
    Automaton.prototype.clearInput = function () {
        
        this.input = '1';
    };
    
    
    Automaton.prototype.update = function () {
        
        var options = this.panel.getOptions();
        
        this.updatePattern(options.pattern);
        this.updateCanvas(options.canvas);
        this.input = this.input; // verify input length
        
        this.panel.form.dispatchEvent(this.panelUpdateEvent);
         
        this.resetDraw();
        this.drawloop();
    };
    
    
    Automaton.prototype.compute = function (rows) {
        
        if (! Object.keys(this.pattern.ruleKey).length ) return '';
        
        var state = this.output;
        
        while (rows--) {
            
            this.output = nextRow(this.output, this.pattern);
            state += this.output;
        }
        return state;
    };
    
    
    Automaton.prototype.validateRuleID = function (id) {
        
        return this.pattern.getRuleID(id);
    };
    
    
    Automaton.prototype.setState = function (target) {
        
        // get cell colors
        
        var coords = this.cellCoords(target);
        
        // increment state
        
        var state = (parseInt(this.getState(coords.x, 0, 1, 1), 10) + 1) % 
                    this.pattern.colors;
        
        this.input = _.replaceAt(this.input, coords.x, state.toString(10));
        
        // redraw canvas
        
        this._count = 0;
        this.drawloop();
    };
    
    
    Automaton.prototype.showPanel = function () {
        
        var els = document.querySelectorAll('.settings');
        
        for (var i=0; i < els.length; i++) {
            
            els[i].style.display = 'none';
        }
        
        this.panel.options.style.display = 'block';
    };
    
    
    Automaton.prototype.initEvents = function () {
        
        var this_ = this;
        
        this.panelUpdateEvent = new CustomEvent (
            'panelUpdate', {
                detail: {
                    object: this_
                }
            });
        
        
        this.panel.form.addEventListener (
            'panel.updateAutomaton', function(event) {
                
                if (event.detail.object === this_.panel) {
                    this_.update();
                }
            });
        
        
        this.panel.form.addEventListener (
            'panel.randomInput', function(event) {
                
                if (event.detail.object === this_.panel) {
                    
                    var options = this_.panel.getOptions();
                    this_.createRandomInput(options.seed.density);
                    this_.update();
                }
            });
        
        
        this.panel.form.addEventListener (
            'panel.clearInput', function(event) {
                
                if (event.detail.object === this_.panel) {
                
                    this_.clearInput();
                    this_.update();
                }
            });
        
        
        this.canvas.ctx.canvas.addEventListener (
            'canvas.updateAutomaton', 
            function(event) {
                
                if (event.detail.object === this_.canvas) {
                    this_.update();
                }
            });
        
        
        this.canvas.ctx.canvas.addEventListener (
            'click', function (event) {
                
                // otherwise firefox complains that
                // event is not defined
                
                window.event = event;
                
                this_.setState(event.target);
                this_.showPanel();
            });
    };
    
    
    Automaton.prototype.cellCoords = function (target) {
        
        var coords = _.getCoords(target);
        
        return {
            'x': Math.floor( coords.mx / this.canvas.size ),
            'y': Math.floor( coords.my / this.canvas.size )
        };
    };
    
    
    Automaton.prototype.getState = function (x, y, w, h) {
        
        // x, y, w, h --> cells, not pixels
        
        var size = this.canvas.size;
        var data = this.canvas.ctx.getImageData(
            x * size,
            y * size,
            w * size,
            h * size
        );
        
        return _.stateFromRGB(
            this.canvas.colors, 
            _.RGBFromData(data, size, w, h)
        );
    };
    
    
    Automaton.prototype.putState = function (state, x, y, w, h, gap) {
      
        gap = gap || 0
        
        // x, y, w, h --> cells, not pixels
        
        var size = this.canvas.size;
        var data = this.canvas.ctx.createImageData(w * size, h * size);
        var rgb = _.stateToRGB(this.canvas.colors, state);
        
        _.RGBToData(data, rgb, size, w, h, gap);
        
        this.canvas.ctx.putImageData(data, x * size, y * size);
    };
    
    
    Automaton.prototype.resetDraw = function () {
        
        cancelAnimationFrame(this.requestID);
        this._count = 0;
        this.input = this.input;
    };
    
    
    Automaton.prototype.drawloop = function () {
        
        // draw x rows at a time (self._speed)
        
        var state  = this.compute(this._speed);
        
        this.putState(
            state, 
            0, 
            this._count * this._speed, 
            this.canvas.aw, 
            this._speed,
            0);
        
        this._count++;
        
        // drawloop
        
        var this_ = this;
        
        this.requestID = requestAnimationFrame( function() {
            
            this_.drawloop();
        });
        
        // end condition
        
        if ( this._count * this._speed >= this.canvas.ah ) {
            
            this.resetDraw();
        }
    };
    
    
    return Automaton;
});


// 3-color: 255377928690176962081643936791146418995
// 3/3: 508373165630
