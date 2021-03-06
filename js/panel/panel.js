define([
    'bigint',
    'utils',
    'hash',
    'text!templates/settings.html'], function (
        B, 
        _,
        hash,
        optionsHTML ) {
    
    
    'use strict';
    
    
    // ------------------------------------- //
    // helper functions                      //
    // ------------------------------------- //
    
    var createOptionsNode = function (options) {
        
        return _.HTMLNodeFromString(
            _.format( 
                optionsHTML, 
                options));
    };
    
    
    // ------------------------------------- //
    // RESIZABLE                             //
    // ------------------------------------- //
    
    var addClass = function(el, class_) {
        
        var regex = new RegExp('\\s?' + class_ + '\\s?');
        
        if (! regex.test(el.className)) {
            
            el.className += ' ' + class_;
        }
    };
    
    
    var removeClass = function(el, class_) {
        
        var regex = new RegExp('\\s?' + class_ + '\\s?');
        el.className = el.className.replace(regex, ' ');
    };
    
    
    function Resizable(el, barHeight, barColor) {
        
        this.resizable = el;
        this.bar = this.resizable.querySelector('.js-resizable-bar');
        this.wrapper = this.resizable.querySelector('.js-resizable-wrapper');
        this.close = this.resizable.querySelector('.js-resizable-close');
        this.barHeight = barHeight || 10;
        this.barColor = barColor || '#FFC800';
        this.animationClass = 'js-resizable-animate';
        this._oldY = 0;
        this._close = false;
        this._moving = false;
        
        this.init();
        
        return this;
    }
    
    
    Resizable.prototype.closeclick = function () {
        
        this._close = (! this._close);
        
        addClass(this.resizable, this.animationClass);
        
        if (this._close) {
            
            this.closePanel();
        
        } else {
            
            this.openPanel();
        }
    };
    
    
    Resizable.prototype.closePanel = function () {
        
        this.setPosition(this.barHeight);
        addClass(this.resizable, 'js-resizable--closed');
        removeClass(this.resizable, 'js-resizable--open');
    };
    
    
    Resizable.prototype.openPanel = function () {
        
        this.setPosition(300);
        addClass(this.resizable, 'js-resizable--open');
        removeClass(this.resizable, 'js-resizable--closed');
    };
    
    
    Resizable.prototype.setPosition = function (y) {
        
        this.resizable.style.height = y + 'px';
        this.wrapper.style.height = parseInt(this.resizable.style.height) - this.barHeight + 'px';
        this._oldY = 0;
    };
    
    
    Resizable.prototype.mousedown = function () {
        
        this.move = this.move.bind(this);
        this._moving = true;
        window.addEventListener('mousemove', this.move);
    };
    
    
    Resizable.prototype.mouseup = function (e) {
        
        // we set this flag to prevent mouseup event from firing
        // after an ordinary click. the mouseup event is registered
        // on the window, and not the bar, because sometimes fast motion
        // causes the mouseup event to fire off of the bar
        
        if (! this._moving) {
            
            return;
        
        } else {
            
            this._moving = false;
        }
        
        // if the panel is mostly closed after resize,
        // close it the rest of the way
        
        if (e.clientY > window.innerHeight - this.barHeight * 2) {
            
            this.closePanel();
        
        } else {
            
            addClass(this.resizable, 'js-resizable--open');
            removeClass(this.resizable, 'js-resizable--closed');
        }
        
        this._oldY = 0;
        document.body.style.cursor = '';
        this.bar.style.background = '';
        removeEventListener('mousemove', this.move);
    };
    
    
    Resizable.prototype.movePosition = function (e) {
        
        var direction;
        
        this._oldY = (! this._oldY) ? e.clientY : this._oldY;
        
        if (e.clientY < this._oldY) {
            
            direction = 1 * Math.abs(this._oldY - e.clientY);
        
        } else if (e.clientY > this._oldY) {
            
            direction = -1 * Math.abs(this._oldY - e.clientY);
        }
        
        if ( this.resizable.offsetHeight + direction <= this.barHeight ) return;
        
        this._close = false;
        this.resizable.style.height = this.resizable.offsetHeight + direction + 'px';
        this.wrapper.style.height = parseInt(this.resizable.style.height) - this.barHeight + 'px';
        this._oldY = e.clientY;
    };
    
    
    Resizable.prototype.move = function (e) {
        
        e.preventDefault();
        
        if (e.clientY <= this.barHeight) {
            this.setPosition(window.innerHeight);
            return;
        }
        
        // remove the the animation class
        
        removeClass(this.resizable, this.animationClass);
        
        document.body.style.cursor = 'ns-resize';
        this.bar.style.background = this.barColor;
        
        this.movePosition(e);
    };
    
    
    Resizable.prototype.init = function () {
        
        addClass(this.resizable, 'js-resizable--open');
        
        this.mouseup = this.mouseup.bind(this);
        this.mousedown = this.mousedown.bind(this);
        this.closeclick = this.closeclick.bind(this);
        
        this.bar.addEventListener('mousedown', this.mousedown);
        window.addEventListener('mouseup', this.mouseup);
        this.close.addEventListener('click', this.closeclick);
    };
    
    
    // ------------------------------------- //
    // PANEL                                 //
    // ------------------------------------- //
    
    
    function Panel (options) {
        
        this.options = createOptionsNode(options);
        this.form = this.options.querySelector('form');
        this.init(options);
        this.initEvents();
    }
    
    
    Panel.prototype.serializeOptions = function () {
        
        return {
            'colors': parseInt(this.form.colors.value),
            'neighborhood': parseInt(this.form.neighborhood.value),
            'ruleID': this.form.ruleID.value,
            'density': parseInt(this.form.density.value),
            'size': parseInt(this.form.size.value)
        };
    };
    
    
    Panel.prototype.optionsForUpdate = function (colors, neighborhood, ruleID, density, size) {
        
        colors = colors || this.form.colors.value;
        neighborhood = neighborhood || this.form.neighborhood.value;
        ruleID = ruleID || this.form.ruleID.value;
        density = density || this.form.density.value;
        size = size || this.form.size.value;
        
        var options = {
            'pattern': {
                'colors': parseInt( colors ),
                'neighborhood': parseInt( neighborhood ),
                'ruleID': ruleID
            },
            'density': parseInt( density ),
            'canvas': {
                'size': parseInt( size )
            },
        };
        return options;
    };
    
    
    Panel.prototype.init = function (options) {
        
        document.body.appendChild(this.options);
        
        this.drawRules(
            options.pattern.rules, 
            options.pattern.rule,
            options.canvas.colors
        );
        
        this.rulesClickEvent(
            options.pattern.colors
        );
    };
    
    
    Panel.prototype.drawRules = function(rules, rule, colors) {
        
        if (! rules) return;
        
        var ruleLen = rules[0].length;
        var size = 12;
        var pad = _.fill(' ', Math.floor(ruleLen / 2), '');
        var el = this.form.querySelector('.rules');
        
        el.innerHTML = '';
        
        for (var i = 0; i < rules.length; i++) {
            
            var ctx = _.createCanvas(ruleLen * size, size * 2, 'rule');
            ctx.canvas.dataset.value = rule[i];
            var state = rules[i] + pad + rule[i];
            
            var data = ctx.createImageData(ruleLen * size, 2 * size);
            var rgb = _.stateToRGB(colors, state);
            
            _.RGBToData(data, rgb, size, ruleLen, 2, 1);
            
            ctx.putImageData(data, 0, 0);
            
            el.appendChild(ctx.canvas);
        }
    };
    
    
    Panel.prototype.updateRuleID = function(automaton) {
        
        this.form.ruleID.value = automaton.pattern.ruleID.int.join('');
    };
    
    
    Panel.prototype.updateDensity = function(automaton) {
        
        this.form.density.value = automaton.density;
    };
    
    
    Panel.prototype.rulesClickEvent = function(colors) {
        
        var this_ = this;
        var rules = this_.form.querySelectorAll('.rule');
        
        for (var i = 0; i < rules.length; i++) {
            
            rules[i].addEventListener('click', function(e) {
                
                e.target.dataset.value = (parseInt(e.target.dataset.value) + 1) % colors;
                
                var rule = '';
                
            for (var i = 0; i < rules.length; i++) {
                
                rule = rule.concat( rules[i].dataset.value );
            }
            
                this_.form.ruleID.value = B.fromBase(B(rule).int, colors).join('');
                hash.update(this_.serializeOptions());
            });
        }
    };
    
    
    Panel.prototype.inputChangeEvent = function () {
        
        var this_ = this;
        var els = this.form.querySelectorAll('.js-change');
        
        for (var i = 0; i < els.length; i++) {
            els[i].addEventListener(
                'change', 
                function() {
                    
                    hash.update(this_.serializeOptions());
            });
        }
    };
    
    
    Panel.prototype.ruleIDKeydownEvent = function () {
        
        var this_ = this;
        
        this.form.ruleID.addEventListener(
            'keydown',
            function(e) {
              
                var ruleID;
                
                if (e.keyCode === 40) { // down
                    
                    e.preventDefault();
                    
                    ruleID = B.sub( 
                        B(e.target.value), 
                        (e.shiftKey) ? B(10) : B(1));
                    
                    e.target.value = ruleID.int.join('');
                    hash.update(this_.serializeOptions());
                }
                
                if (e.keyCode === 38) { // up
                    
                    e.preventDefault();
                    
                    ruleID = B.add( 
                        B(e.target.value), 
                        (e.shiftKey) ? B(10) : B(1));
                    
                    e.target.value = ruleID.int.join('');
                    hash.update(this_.serializeOptions());
                }
                
                if (e.keyCode === 13) { // enter
                    
                    e.preventDefault();
                    hash.update(this_.serializeOptions());
                }
        });
    };
    
    
    Panel.prototype.densityKeydownEvent = function () {
        
        var this_ = this;
        
        this.form.density.addEventListener(
            'keydown',
            function(e) {
                
                var value;
                
                if (e.keyCode === 40) { // down
                    
                    e.preventDefault();
                    
                    value = parseInt(e.target.value) - 1;
                    value = (value < 1) ? 1 : value;
                    e.target.value = value;
                    
                    hash.update(this_.serializeOptions());
                }
                
                if (e.keyCode === 38) { // up
                    
                    e.preventDefault();
                    
                    value = parseInt(e.target.value) + 1;
                    e.target.value = value;
                    
                    hash.update(this_.serializeOptions());
                }
                
                if (e.keyCode === 13) { // enter
                    
                    e.preventDefault();
                    hash.update(this_.serializeOptions());
                }
        });
    };
    
    
    Panel.prototype.panelUpdateEventListener = function () {
        
        var this_ = this;
        
        this.form.addEventListener(
            'panelUpdate',
            function(e) {
                
                if (e.detail.object.panel === this_) {
                    
                    var automaton = e.detail.object;
                    
                    // update ruleID
                    this_.updateRuleID(automaton);
                    this_.updateDensity(automaton);
                    
                    // update rules
                    this_.drawRules(
                        automaton.pattern.rules,
                        automaton.pattern.rule,
                        automaton.canvas.colors
                    );
                    
                    // update rules events
                    this_.rulesClickEvent(
                        automaton.pattern.colors
                    );
                }
            });
    };
    
    
    Panel.prototype.initEvents = function () {
        
        // validate numeric input fields
        
        var validateNumericKeydown = function (e) {
            
            if (e.which === 8  ||   // delete
                e.which === 9  ||   // tab
                e.which === 16 ||   // shift
                e.which === 37 ||   // left
                e.which === 38 ||   // up
                e.which === 39 ||   // right
                e.which === 40 ) {  // down
                
                // do nothing
                
            } else if (e.which < 48 || e.which > 57) {
                
                // disallow non-numeric chars
                
                e.preventDefault();
            }
        };
        
        // validate random density
        
        this.form.density.addEventListener('keydown', validateNumericKeydown);
        
        // validate ruleID
        
        this.form.ruleID.addEventListener('keydown', validateNumericKeydown);
        
        // resize
        
        this.resizable = new Resizable(this.options, 20, '#FFC800');
        
        // bind events
        
        this.inputChangeEvent();
        this.ruleIDKeydownEvent();
        this.densityKeydownEvent();
        
        // event listeners
        
        this.panelUpdateEventListener();
    };
    
    
    return Panel;
});