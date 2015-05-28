define(['automaton'], function (Automaton) {
    
    
    var urlParse = function(url) {
        
        var params = {};
        var separator = /=/;
        var tokens = url.split(/(\?|&)/g);
        
        for (var i = 0; i < tokens.length; i++) {
            
            if (separator.test(tokens[i])) {
                
                var param = tokens[i].split(separator);
                params[param[0]] = param[1];
            }
        }
        return params;
    };
    
    
    var validateColors = function(colors) {
        
        var regex = /[1-5]/;
        
        if (regex.test(colors)) {
            
            return parseInt(colors, 10);
        }
        return false;
    };
    
    
    var validateNeighborhood = function(neighborhood) {
        
        var regex = /[1-5]/;
        
        if (regex.test(neighborhood)) {
            
            return parseInt(neighborhood, 10);
        }
        return false;
    };
    
    
    var validateRuleID = function(ruleID) {
        
        var regex = /\d+/;
        
        if (regex.test(ruleID)) {
            
            return ruleID;
        }
        return false;
    };
    
    
    var validateSize = function(size) {
        
        var regex = /([0-9]|10)/;
        
        if (regex.test(size)) {
            
            return parseInt(size, 10);
        }
        return false;
    };
    
    
    var validateDensity = function(density) {
        
        var regex = /\d{1,5}/;
        
        if (regex.test(density)) {
            
            return parseInt(density, 10);
        }
        return false;
    };
    
    
    var cleanParams = function(params) {
        
        return {
            'colors': validateColors(params.colors) || 2,
            'neighborhood': validateNeighborhood(params.neighborhood) || 3,
            'ruleID': validateRuleID(params.ruleID) || '30',
            'density': validateDensity(params.density) || 1,
            'size': validateSize(params.size) || 2
        };
    };
    
    
    var params = cleanParams(urlParse(window.location.search));
    
    
    var automaton = new Automaton(
        params.colors, 
        params.neighborhood, 
        params.ruleID, 
        params.density, 
        params.size
    );
    
    
    automaton.drawloop();
});