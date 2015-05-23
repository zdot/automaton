define(['bigint', 'utils'], function(B, _) {
    
    
    'use strict';
    
    
    function Pattern (colors, neighborhood, ruleID) {
        
        this._colors = colors;
        this._neighborhood = neighborhood;
        this._ruleID = B( ruleID );
        this._update();
    }
    
    
    Pattern.prototype = {
        
        set colors(colors) {
            this._colors = colors;
            this._update();
        },
        
        get colors() {
            return this._colors;
        },
        
        set neighborhood(neighborhood) {
            this._neighborhood = neighborhood;
            this._update();
        },
        
        get neighborhood() {
            return this._neighborhood;
        },
        
        set ruleID(id) {
            
            this._ruleID = this.getRuleID( B(id) );
            
            // these properties need to be recalculated
            // when ruleID is set
            
            this._rule = this.getRule();
            this._ruleKey = this.getRuleKey();
        },
        
        get ruleID() {
            return this._ruleID;
        },
        
        get universe() {
            return this._universe;
        },
        
        get rules() {
            return this._rules;
        },
        
        get rule() {
            return this._rule;
        },
        
        get ruleKey() {
            return this._ruleKey;
        }
    };
    
    
    Pattern.prototype.getUniverse = function () {
        
        // no colors, no patterns, despite n**0 = 1
        
        if (this.colors === 0) return B(0);
        
        return B.pow(
            B(this.colors), 
            B.pow( 
                B(this.colors), 
                B(this.neighborhood)));
    };
    
    
    Pattern.prototype.getRuleKey = function () {
        
        var key = {};
        
        for (var i = 0; i < this.rules.length; i++) {
            
            key[ this.rules[i] ] = this.rule[i];
        }
        return key;
    };
    
    
    Pattern.prototype.getRules = function () {
        
        return _.products(this.colors, this.neighborhood).reverse();
    };
    
    
    Pattern.prototype.getRule = function() {
        
        if (this.colors === 0) return '';
        if (this.colors === 1) return '0';
        
        var ruleCount = Math.pow(this.colors, this.neighborhood);
        var baseStr = B.toString(this.ruleID, this.colors);
        return _.pad( baseStr, '0', ruleCount );
    };
    
    
    Pattern.prototype.getRuleID = function(id) {
        
        if ( B.eq(this.universe, B(0))) return B(0);
        if ( B.gt( id, this.universe )) return B.sub(this.universe, B(1));
        return id;
    };
    
    Pattern.prototype._update = function() {
        
        // these properties need to be recalculated
        // when `colors` or `neighborhood` are set
        
        this._universe = this.getUniverse();
        this._ruleID = this.getRuleID( this._ruleID );
        this._rules = this.getRules();
        this._rule = this.getRule();
        this._ruleKey = this.getRuleKey();
        
    };
    
    
    return Pattern;
    
});
