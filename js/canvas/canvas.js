define(['utils'], function (_) {
    
    
    'use strict';
    
    
    var getDimensions = function (size) {
        
        return {
            w: Math.ceil(window.innerWidth / size),
            h: Math.floor(window.innerHeight / size)
        };
    };
    
    
    // ---------------------------------------------- //
    //  CANVAS OBJECT
    // ---------------------------------------------- //
    
    
    function Canvas (size, colors) {
        
        var dimensions = getDimensions(size);
        var css_class = 'automaton';
        var rules = _.products(2, 3).reverse()
        
        this.aw = dimensions.w;
        this.ah = dimensions.h;
        this.size = size;
        this.colors = _.createColors(rules);
        this.ctx = _.createCanvas(
            this.cw, 
            this.ch, 
            css_class);
        
        this.initEvents();
    }
    
    
    Canvas.prototype = {
        
        set aw(w) {
            
            this._aw = w;
            this._cw = w * this.size;
            
            // update
            if (this.ctx) this.ctx.canvas.width = this._cw;
        },
        
        
        get aw() {
            
            return this._aw;
        },
        
        
        set ah(h) {
            
            this._ah = h;
            this._ch = h * this.size;
            
            // update
            if (this.ctx) this.ctx.canvas.height = this._ch;
        },
        
        
        get ah() {
            
            return this._ah;
        },
        
        
        set size(s) {
            
            this._size = s;
            
            // update
            
            var dimensions = getDimensions(s);
        
            this.aw = dimensions.w;
            this.ah = dimensions.h;
        },
        
        
        get size() {
            
            return this._size;
        },
        
        
        get cw() {
            
            return this._cw;
        },
        
        
        get ch() {
            
            return this._ch;
        }
    };
    
    
    Canvas.prototype.initEvents = function () {
        
        var this_ = this;
        
        
        this.updateAutomaton = new CustomEvent(
            'canvas.updateAutomaton', {
                detail: {
                    object: this_
                }
            });
        
        
        var done = function() {
            
            var dimensions = getDimensions(this_.size);
            
            this_.aw = dimensions.w;
            this_.ah = dimensions.h;
            
            this_.ctx.canvas.dispatchEvent(this_.updateAutomaton);
        };
        
        
        var timer;
        var interval = 300;
        
        window.addEventListener('resize', function() {
            
            clearTimeout(timer);
            timer = setTimeout(done, interval);
        });
    };
    
    
    return Canvas;
});