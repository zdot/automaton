// ---------------------------------------------- //
//  OBJECT INSTANTIATION
// ---------------------------------------------- //


define(['pattern'], function(Pattern) {
    
    var run = function() {
        
        
        // ['00', '01', '02', '10', '11', '12', '20', '21']
        
        QUnit.module('OBJECT');
        
        
        QUnit.test( '0 0', function( assert ) {
            
            var p = new Pattern(0, 0, 30);
            
            assert.deepEqual(p.colors, 0);
            assert.deepEqual(p.neighborhood, 0);
            assert.deepEqual(p.universe.int, [0]);
            assert.deepEqual(p.rule, '');
            assert.deepEqual(p.rules, []);
            assert.deepEqual(p.ruleID.int, [0]);
            assert.deepEqual(p.ruleKey, {});
            
        });
        
        
        QUnit.test( '0 1', function( assert ) {
            
            var p = new Pattern(0, 1, 30);
            
            assert.deepEqual(p.colors, 0);
            assert.deepEqual(p.neighborhood, 1);
            assert.deepEqual(p.universe.int, [0]);
            assert.deepEqual(p.rule, '');
            assert.deepEqual(p.rules, []);
            assert.deepEqual(p.ruleID.int, [0]);
            assert.deepEqual(p.ruleKey, {});
            
        });
        
        
        QUnit.test( '0 2', function( assert ) {
            
            var p = new Pattern(0, 2, 30);
            
            assert.deepEqual(p.colors, 0);
            assert.deepEqual(p.neighborhood, 2);
            assert.deepEqual(p.universe.int, [0]);
            assert.deepEqual(p.rule, '');
            assert.deepEqual(p.rules, []);
            assert.deepEqual(p.ruleID.int, [0]);
            assert.deepEqual(p.ruleKey, {});
            
        });
        
        
        QUnit.test( '1 0', function( assert ) {
            
            var p = new Pattern(1, 0, 30);
            
            assert.deepEqual(p.colors, 1);
            assert.deepEqual(p.neighborhood, 0);
            assert.deepEqual(p.universe.int, [1]);
            assert.deepEqual(p.rule, '0');
            assert.deepEqual(p.rules, []);
            assert.deepEqual(p.ruleID.int, [0]);
            assert.deepEqual(p.ruleKey, {});
            
        });
        
        
        QUnit.test( '1 1', function( assert ) {
            
            var p = new Pattern(1, 1, 30);
            
            assert.deepEqual(p.colors, 1);
            assert.deepEqual(p.neighborhood, 1);
            assert.deepEqual(p.universe.int, [1]);
            assert.deepEqual(p.rule, '0');
            assert.deepEqual(p.rules, ['0']);
            assert.deepEqual(p.ruleID.int, [0]);
            assert.deepEqual(p.ruleKey, {'0': '0'});
            
        });
        
        
        QUnit.test( '1 2', function( assert ) {
            
            var p = new Pattern(1, 2, 30);
            
            assert.deepEqual(p.colors, 1);
            assert.deepEqual(p.neighborhood, 2);
            assert.deepEqual(p.universe.int, [1]);
            assert.deepEqual(p.rule, '0');
            assert.deepEqual(p.rules, ['00']);
            assert.deepEqual(p.ruleID.int, [0]);
            assert.deepEqual(p.ruleKey, {'00': '0'});
            
        });
        
        
        QUnit.test( '2 0', function( assert ) {
            
            var p = new Pattern(2, 0, 30);
            
            assert.deepEqual(p.colors, 2);
            assert.deepEqual(p.neighborhood, 0);
            assert.deepEqual(p.universe.int, [2]);
            assert.deepEqual(p.rule, '1');
            assert.deepEqual(p.rules, []);
            assert.deepEqual(p.ruleID.int, [1]);
            assert.deepEqual(p.ruleKey, {});
            
        });
        
        
        QUnit.test( '2 1', function( assert ) {
            
            var p = new Pattern(2, 1, 30);
            
            assert.deepEqual(p.colors, 2);
            assert.deepEqual(p.neighborhood, 1);
            assert.deepEqual(p.universe.int, [4]);
            assert.deepEqual(p.rule, '11');
            assert.deepEqual(p.rules, ['1', '0']);
            assert.deepEqual(p.ruleID.int, [3]);
            assert.deepEqual(p.ruleKey, {'0': '1', '1': '1'});
            
        });
        
    };
    
    
    return {'run': run};
});