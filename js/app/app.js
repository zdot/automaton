define(['automaton', 'hash'], function (Automaton, hash) {
    
    
    'use strict';
    
    
    // load default automaton
    
    if (! window.location.hash) {
        
        window.location.hash = hash.encode({
            'colors': 2,
            'neighborhood': 3,
            'ruleID': '30',
            'density': 1,
            'size': 2
        });
    }
    
    
    // or parse existing hash
    
    var params = hash.cleanParams(hash.parse(window.location.hash));
    
    
    var automaton = new Automaton(
        params.colors, 
        params.neighborhood, 
        params.ruleID, 
        params.density, 
        params.size
    );
    
    
    automaton.drawloop();
});