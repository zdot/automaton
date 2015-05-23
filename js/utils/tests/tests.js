// figured out how to make unit tests AMD compat here: 
// http://www.nathandavison.com/article/17/using-qunit-and-requirejs-to-build-modular-unit-tests


define(['../utils'], function(utils) {
    
    
    var run = function() {

        QUnit.module('UTILS')
        
        // beginning wraps
        
        QUnit.test( 'look', function( assert ) {
            
            var a = 'abcdef';
            var b = utils.look(a, 3, 0)
            
            assert.equal(b, 'fab');
            
        });
        
        // end wraps
        
        QUnit.test( 'look', function( assert ) {
            
            var a = 'abcdef';
            var b = utils.look(a, 3, 5)
            
            assert.equal(b, 'efa');
            
        });
        
        // odd numbers look back first
        
        QUnit.test( 'look', function( assert ) {
            
            var a = 'abcdef';
            var b = utils.look(a, 2, 0)
            
            assert.equal(b, 'fa');
            
        });
    };
    
    return {'run': run}
})
