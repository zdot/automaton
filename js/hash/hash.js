define(function () {
    
    
    'use strict';
    
    
    var hash = {};
    
    
    hash.parse = function(url) {
        
        var params = {};
        var separator = /=/;
        var tokens = url.split(/(#|&)/g);
        
        for (var i = 0; i < tokens.length; i++) {
            
            if (separator.test(tokens[i])) {
                
                var param = tokens[i].split(separator);
                params[param[0]] = param[1];
            }
        }
        return params;
    };
    
    
    hash.encode = function(params) {
        
        var result = [];
        
        for (var key in params) {
            
            result.push(key + '=' + params[key]);
        }
        
        return '#' + result.join('&');
    };


    hash.validateColors = function(colors) {
        
        var regex = /^[1-5]$/;
        
        if (regex.test(colors)) {
            
            return parseInt(colors, 10);
        }
        return false;
    };


    hash.validateNeighborhood = function(neighborhood) {
        
        var regex = /^[1-5]$/;
        
        if (regex.test(neighborhood)) {
            
            return parseInt(neighborhood, 10);
        }
        return false;
    };


    hash.validateRuleID = function(ruleID) {
        
        var regex = /^\d+$/;
        
        if (regex.test(ruleID)) {
            
            return ruleID;
        }
        return false;
    };


    hash.validateSize = function(size) {
        
        var regex = /^([0-9]|10)$/;
        
        if (regex.test(size)) {
            
            return parseInt(size, 10);
        }
        return false;
    };


    hash.validateDensity = function(density) {
        
        var regex = /^[0-9]{1,4}$/;
        
        if (regex.test(density)) {
            
            return parseInt(density, 10);
        }
        return false;
    };


    hash.cleanParams = function(params) {
        
        return {
            'colors': hash.validateColors(params.colors) || 1,
            'neighborhood': hash.validateNeighborhood(params.neighborhood) || 1,
            'ruleID': hash.validateRuleID(params.ruleID) || '0',
            'density': hash.validateDensity(params.density) || 1,
            'size': hash.validateSize(params.size) || 2
        };
    };
    
    
    hash.update = function(params) {
        
        var options = hash.encode(params);
        window.location.hash = options;
    };
    
    
    return hash;
});