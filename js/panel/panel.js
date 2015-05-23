define([
    'bigint',
    'utils',
    'text!templates/settings.html'], function (
        B, 
        _,
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
    
    
    // ------------------------------------- //
    // RESIZABLE                             //
    // ------------------------------------- //
    
    function Resizable(el, barHeight, barColor) {
        
        this.resizable = el;
        this.bar = this.resizable.querySelector('.js-resizable-bar');
        this.wrapper = this.resizable.querySelector('.js-resizable-wrapper');
        this.close = this.resizable.querySelector('.js-resizable-close');
        this.barHeight = barHeight || 10;
        this.barColor = barColor || 'cyan';
        this.animationClass = 'js-resizable-animate';
        this._oldY = 0;
        this._close = false;
        
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
        window.addEventListener('mousemove', this.move);
    };
    
    
    Resizable.prototype.mouseup = function (e) {
        
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
    
    
    Panel.prototype.getOptions = function () {
        
        var options = {
            
            pattern: {
                colors: parseInt( this.form.colors.value ),
                neighborhood: parseInt( this.form.neighborhood.value ),
                ruleID: this.form.ruleID.value
            },
            canvas: {
                size: parseInt( this.form.size.value )
            },
            seed: {
                density: parseInt( this.form.density.value ) || 0
            }
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
                this_.form.dispatchEvent(this_.updateAutomaton);
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
                    this_.form.dispatchEvent(this_.updateAutomaton);
            });
        }
    };
    
    
    Panel.prototype.randomInputClickEvent = function () {
        
        var this_ = this;
        var el = this.form.querySelector('.js-button-random');
        
        el.addEventListener(
            'click',
            function(e) {
                e.preventDefault();
                this_.form.dispatchEvent(this_.randomInput);
            });
    };
    
    
    Panel.prototype.clearInputClickEvent = function () {
        
        var this_ = this;
        var el = this.form.querySelector('.js-button-clear');
        
        el.addEventListener(
            'click',
            function(e) {
                e.preventDefault();
                this_.form.dispatchEvent(this_.clearInput);
            });
    };
    
    
    Panel.prototype.ruleIDKeydownEvent = function () {
        
        var this_ = this;
        
        this.form.ruleID.addEventListener(
            'keydown',
            function(e) {
              
                var ruleID;
                
                if (e.keyCode === 40) { // up
                    
                    e.preventDefault();
                    
                    ruleID = B.sub( 
                        B(e.target.value), 
                        (e.shiftKey) ? B(10) : B(1));
                    
                    e.target.value = ruleID.int.join('');
                    this_.form.dispatchEvent(this_.updateAutomaton);
                }
                
                if (e.keyCode === 38) { // down
                    
                    e.preventDefault();
                    
                    ruleID = B.add( 
                        B(e.target.value), 
                        (e.shiftKey) ? B(10) : B(1));
                    
                    e.target.value = ruleID.int.join('');
                    this_.form.dispatchEvent(this_.updateAutomaton);
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
        
        var this_ = this;
        
        this.updateAutomaton = new CustomEvent(
            'panel.updateAutomaton', {
                detail: {
                    object: this_
                }
            });
        
        this.randomInput = new CustomEvent (
            'panel.randomInput', {
                detail: {
                    object: this_
                }
            });
        
        this.clearInput = new CustomEvent (
            'panel.clearInput', {
                detail: {
                    object: this_
                }
            });
        
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
        
        var validateNumericKeyup = function (e) {
            
            if (e.target.value.length < 1) {
                e.target.value = 0;
            }
        };
        
        // validate random density
        
        this.form.density.addEventListener('keydown', validateNumericKeydown);
        this.form.density.addEventListener('keyup', validateNumericKeyup);
        
        // validate ruleID
        
        this.form.ruleID.addEventListener('keydown', validateNumericKeydown);
        this.form.ruleID.addEventListener('keyup', validateNumericKeyup);
        
        // resize
        
        this.resizable = new Resizable(this.options, 20, 'cyan');
        
        // bind events
        
        this.inputChangeEvent();
        this.ruleIDKeydownEvent();
        this.randomInputClickEvent();
        this.clearInputClickEvent();
        
        // event listeners
        
        this.panelUpdateEventListener();
    };
    
    
    return Panel;
});
