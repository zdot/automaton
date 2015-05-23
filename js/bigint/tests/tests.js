// make unit tests AMD compat here: 
// http://www.nathandavison.com/article/17/using-qunit-and-requirejs-to-build-modular-unit-tests


// ---------------------------------------------- //
//  OBJECT INSTANTIATION
// ---------------------------------------------- //


define(['bigint'], function(BigInt) {
    
    var run = function() {
        
        
        QUnit.module('OBJECT');
        
        
        QUnit.test( 'list', function( assert ) {
            
            var a = BigInt([1,2,3]);
            
            assert.deepEqual(a.int, [1,2,3]);
            assert.equal(a.sign, 1);
            
        });
        
        
        QUnit.test( 'list, neg sign', function( assert ) {
            
            var a = BigInt([1,2,3], -1);
            
            assert.deepEqual(a.int, [1,2,3]);
            assert.equal(a.sign, -1);
            
        });
        
        
        QUnit.test( 'number', function( assert ) {
            
            var a = BigInt(123);
            
            assert.deepEqual(a.int, [1,2,3]);
            assert.equal(a.sign, 1);
            
        });
        
        
        QUnit.test( 'number, neg sign', function( assert ) {
            
            var a = BigInt(-123);
            
            assert.deepEqual(a.int, [1,2,3]);
            assert.equal(a.sign, -1);
            
        });
        
        
        QUnit.test( 'string', function( assert ) {
            
            var a = BigInt('123');
            
            assert.deepEqual(a.int, [1,2,3]);
            assert.equal(a.sign, 1);
            
        });
        
        
        QUnit.test( 'string, neg sign', function( assert ) {
            
            var a = BigInt('---123');
            
            assert.deepEqual(a.int, [1,2,3]);
            assert.equal(a.sign, -1);
            
        });
        
        
        // ---------------------------------------------- //
        //  ADDITION
        // ---------------------------------------------- //
        
        
        QUnit.module('ADD');
        
        
        QUnit.test( 'add: pos / pos (a.int < b.int)', function( assert ) {
        
            var a = BigInt(123);
            var b = BigInt(4567);
            var c = BigInt.add(a, b);
            
            assert.deepEqual(c.int, [4,6,9,0]);
            assert.equal(c.sign, 1);
            
        });
        
        
        QUnit.test( 'add: pos / pos (a.int > b.int)', function( assert ) {
        
            var a = BigInt(4567);
            var b = BigInt(123);
            var c = BigInt.add(a, b);
            
            assert.deepEqual(c.int, [4,6,9,0]);
            assert.equal(c.sign, 1);
            
        });
        
        
        QUnit.test( 'add: pos / neg (a.int < b.int)', function( assert ) {
        
            var a = BigInt(123);
            var b = BigInt(-4567);
            var c = BigInt.add(a, b);
            
            assert.deepEqual(c.int, [4,4,4,4]);
            assert.equal(c.sign, -1);
            
        });
        
        
        QUnit.test( 'add: pos / neg (a.int > b.int)', function( assert ) {
        
            var a = BigInt(4567);
            var b = BigInt(-123);
            var c = BigInt.add(a, b);
            
            assert.deepEqual(c.int, [4,4,4,4]);
            assert.equal(c.sign, 1);
            
        });
        
        
        QUnit.test( 'add: neg / pos (a.int > b.int)', function( assert ) {
        
            var a = BigInt(-4567);
            var b = BigInt(123);
            var c = BigInt.add(a, b);
            
            assert.deepEqual(c.int, [4,4,4,4]);
            assert.equal(c.sign, -1);
            
        });
        
        
        QUnit.test( 'add: neg / pos (a.int < b.int)', function( assert ) {
        
            var a = BigInt(-123);
            var b = BigInt(4567);
            var c = BigInt.add(a, b);
            
            assert.deepEqual(c.int, [4,4,4,4]);
            assert.equal(c.sign, 1);
            
        });
        
        
        QUnit.test( 'add: neg / neg (a.int > b.int)', function( assert ) {
        
            var a = BigInt(-4567);
            var b = BigInt(-123);
            var c = BigInt.add(a, b);
            
            assert.deepEqual(c.int, [4,6,9,0]);
            assert.equal(c.sign, -1);
            
        });
        
        
        QUnit.test( 'add: neg / neg (a.int < b.int)', function( assert ) {
        
            var a = BigInt(-123);
            var b = BigInt(-4567);
            var c = BigInt.add(a, b);
            
            assert.deepEqual(c.int, [4,6,9,0]);
            assert.equal(c.sign, -1);
            
        });
        
        
        QUnit.test( 'add: 0 / 0', function( assert ) {
        
            var a = BigInt(0);
            var b = BigInt(0);
            var c = BigInt.add(a, b);
            
            assert.deepEqual(c.int, [0]);
            assert.equal(c.sign, 1);
            
        });
        
        
        QUnit.test( 'add: base 3', function( assert ) {
        
            var a = BigInt(11120);
            var b = BigInt(121220);
            var c = BigInt.add(a, b, 3);
            
            assert.deepEqual(c.int, [2,1,0,1,1,0], c.int);
            
        });
        
        
        QUnit.test( 'add: base 16', function( assert ) {
        
            var a = BigInt([7,11]);
            var b = BigInt([7,11]);
            var c = BigInt.add(a, b, 16);
            
            assert.deepEqual(c.int, [15,6], c.int);
            
        });
        
        
        // ---------------------------------------------- //
        //  SUBTRACTION
        // ---------------------------------------------- //
        
        
        QUnit.module('SUB');
        
        
        QUnit.test( 'sub: a < b', function( assert ) {
        
            var a = BigInt(123);
            var b = BigInt(4567);
            var c = BigInt.sub(a, b);
            
            assert.deepEqual(c.int, [4,4,4,4]);
            assert.equal(c.sign, -1);
            
        });
        
        
        QUnit.test( 'sub: a > b', function( assert ) {
        
            var a = BigInt(4567);
            var b = BigInt(123);
            var c = BigInt.sub(a, b);
            
            assert.deepEqual(c.int, [4,4,4,4]);
            assert.equal(c.sign, 1);
            
        });
        
        
        QUnit.test( 'sub: pos / neg (a.int > b.int)', function( assert ) {
        
            var a = BigInt(5678);
            var b = BigInt(-123);
            var c = BigInt.sub(a, b);
            
            assert.deepEqual(c.int, [5,8,0,1]);
            assert.equal(c.sign, 1);
            
        });
        
        
        QUnit.test( 'sub: pos / neg (a.int < b.int)', function( assert ) {
            
            var a = BigInt(123);
            var b = BigInt(-5678);
            var c = BigInt.sub(a, b);
            
            assert.deepEqual(c.int, [5,8,0,1]);
            assert.equal(c.sign, 1);
            
        });
        
        
        QUnit.test( 'sub: neg / pos (a.int < b.int)', function( assert ) {
            
            var a = BigInt(-123);
            var b = BigInt(4567);
            var c = BigInt.sub(a, b);
            
            assert.deepEqual(c.int, [4,6,9,0]);
            assert.equal(c.sign, -1);
            
        });
        
        
        QUnit.test( 'sub: neg / pos (a.int > b.int)', function( assert ) {
        
            var a = BigInt(-4567);
            var b = BigInt(123);
            var c = BigInt.sub(a, b);
            
            assert.deepEqual(c.int, [4,6,9,0]);
            assert.equal(c.sign, -1);
            
        });
        
        
        QUnit.test( 'sub: neg / neg (a.int > b.int)', function( assert ) {
            
            var a = BigInt(-4567);
            var b = BigInt(-123);
            var c = BigInt.sub(a, b);
            
            assert.deepEqual(c.int, [4,4,4,4]);
            assert.equal(c.sign, -1);
            
        });
        
        
        QUnit.test( 'sub: neg / neg (a.int < b.int)', function( assert ) {
            
            var a = BigInt(-123);
            var b = BigInt(-4567);
            var c = BigInt.sub(a, b);
            
            assert.deepEqual(c.int, [4,4,4,4]);
            assert.equal(c.sign, 1);
            
        });
        
        
        QUnit.test( 'sub: 0 - 0', function( assert ) {
            
            var a = BigInt(0);
            var b = BigInt(0);
            var c = BigInt.sub(a, b);
            
            assert.deepEqual(c.int, [0]);
            
        });
        
        
        QUnit.test( 'sub: random', function( assert ) {
            
            var a = Math.floor(Math.random() * 1000);
            var b = Math.floor(Math.random() * 1000);
            
            var _a = BigInt(a);
            var _b = BigInt(b);
            
            var _c = BigInt.sub(_a, _b);
            _c = parseInt( _c.int.join('') ) * _c.sign;
            
            assert.equal(_c, a - b, a + ' - ' + b + ' = ' + (a - b) );
            
        });
        
        
        QUnit.test( 'sub: base 4', function( assert ) {
            
            var a = BigInt(2122110);
            var b = BigInt(103102);
            var c = BigInt.sub(a, b, 4);
            
            assert.deepEqual(c.int, [2,0,1,3,0,0,2], c.int);
            
        });
        
        
        QUnit.test( 'sub: base 16', function( assert ) {
            
            var a = BigInt([4,13,2]);
            var b = BigInt([7,11]);
            var c = BigInt.sub(a, b, 16);
            
            assert.deepEqual(c.int, [4,5,7], c.int);
            
        });
        
        
        // ---------------------------------------------- //
        //  MULTIPLICATION
        // ---------------------------------------------- //
        
        
        QUnit.module('MUL');
        
        
        QUnit.test( 'mul: a < b', function( assert ) {
        
            var a = BigInt(123);
            var b = BigInt(4567);
            var c = BigInt.mul(a, b);
            
            assert.deepEqual(c.int, [5,6,1,7,4,1]);
            assert.equal(c.sign, 1);
            
        });
        
        
        QUnit.test( 'mul: a > b', function( assert ) {
        
            var a = BigInt(4567);
            var b = BigInt(123);
            var c = BigInt.mul(a, b);
            
            assert.deepEqual(c.int, [5,6,1,7,4,1]);
            assert.equal(c.sign, 1);
            
        });
        
        
        QUnit.test( 'mul: a < b', function( assert ) {
            
            var a = BigInt(123);
            var b = BigInt(-4567);
            var c = BigInt.mul(a, b);
            
            assert.deepEqual(c.int, [5,6,1,7,4,1]);
            assert.equal(c.sign, -1);
            
        });
        
        
        QUnit.test( 'mul: a > b', function( assert ) {
            
            var a = BigInt(4567);
            var b = BigInt(-123);
            var c = BigInt.mul(a, b);
            
            assert.deepEqual(c.int, [5,6,1,7,4,1]);
            assert.equal(c.sign, -1);
            
        });
        
        
        QUnit.test( 'mul: a < b', function( assert ) {
            
            var a = BigInt(-123);
            var b = BigInt(4567);
            var c = BigInt.mul(a, b);
            
            assert.deepEqual(c.int, [5,6,1,7,4,1]);
            assert.equal(c.sign, -1);
            
        });
        
        
        QUnit.test( 'mul: a > b', function( assert ) {
            
            var a = BigInt(-4567);
            var b = BigInt(123);
            var c = BigInt.mul(a, b);
            
            assert.deepEqual(c.int, [5,6,1,7,4,1]);
            assert.equal(c.sign, -1);
            
        });
        
        
        QUnit.test( 'mul: a < b', function( assert ) {
            
            var a = BigInt(-123);
            var b = BigInt(-4567);
            var c = BigInt.mul(a, b);
            
            assert.deepEqual(c.int, [5,6,1,7,4,1]);
            assert.equal(c.sign, 1);
            
        });
        
        
        QUnit.test( 'mul: a > b', function( assert ) {
            
            var a = BigInt(-4567);
            var b = BigInt(-123);
            var c = BigInt.mul(a, b);
            
            assert.deepEqual(c.int, [5,6,1,7,4,1]);
            assert.equal(c.sign, 1);
            
        });
        
        
        QUnit.test( 'mul: 0 * 0', function( assert ) {
            
            var a = BigInt(0);
            var b = BigInt(0);
            var c = BigInt.mul(a, b);
            
            assert.deepEqual(c.int, [0]);
            assert.equal(c.sign, 1);
            
        });
        
        
        QUnit.test( 'mul: random', function( assert ) {
            
            var a = Math.floor(Math.random() * 1000);
            var b = Math.floor(Math.random() * 1000);
            
            var _a = BigInt(a);
            var _b = BigInt(b);
            
            var _c = BigInt.mul(_a, _b);
            _c = parseInt( _c.int.join('') ) * _c.sign;
            
            assert.equal(_c, a * b, a + ' * ' + b + ' = ' + (a * b) );
            
        });
        
        
        QUnit.test( 'mul: base 5', function( assert ) {
            
            var a = BigInt(14414);
            var b = BigInt(140203);
            var c = BigInt.mul(a, b, 5);
            
            assert.deepEqual(c.int, [3,2,4,3,2,0,3,1,0,2], c.int);
            
        });
        
        
        QUnit.test( 'mul: base 16', function( assert ) {
            
            var a = BigInt([4,13,2]);
            var b = BigInt([7,11]);
            var c = BigInt.mul(a, b, 16);
            
            assert.deepEqual(c.int, [2,5,0,14,6], c.int);
            
        });
        
        
        // ---------------------------------------------- //
        //  DIVISION
        // ---------------------------------------------- //
        
        
        QUnit.module('DIV');
        
        
        QUnit.test( 'div: a < b', function( assert ) {
        
            var a = BigInt(123);
            var b = BigInt(4567);
            var c = BigInt.div(a, b);
            
            assert.deepEqual(c.int, [0]);
            assert.equal(c.sign, 1);
            
        });
        
        
        QUnit.test( 'div: a > b', function( assert ) {
        
            var a = BigInt(4567);
            var b = BigInt(123);
            var c = BigInt.div(a, b);
            
            assert.deepEqual(c.int, [3,7]);
            assert.equal(c.sign, 1);
            
        });
        
        
        QUnit.test( 'div: a < b', function( assert ) {
        
            var a = BigInt(123);
            var b = BigInt(-4567);
            var c = BigInt.div(a, b);
            
            assert.deepEqual(c.int, [0]);
            assert.equal(c.sign, -1);
            
        });
        
        
        QUnit.test( 'div: a > b', function( assert ) {
            
            var a = BigInt(4567);
            var b = BigInt(-123);
            var c = BigInt.div(a, b);
            
            assert.deepEqual(c.int, [3,7]);
            assert.equal(c.sign, -1);
            
        });
        
        
        QUnit.test( 'div: a < b', function( assert ) {
            
            var a = BigInt(-123);
            var b = BigInt(4567);
            var c = BigInt.div(a, b);
            
            assert.deepEqual(c.int, [0]);
            assert.equal(c.sign, -1);
            
        });
        
        
        QUnit.test( 'div: a > b', function( assert ) {
        
            var a = BigInt(-4567);
            var b = BigInt(123);
            var c = BigInt.div(a, b);
            
            assert.deepEqual(c.int, [3,7]);
            assert.equal(c.sign, -1);
            
        });
        
        
        QUnit.test( 'div: a < b', function( assert ) {
            
            var a = BigInt(-123);
            var b = BigInt(-4567);
            var c = BigInt.div(a, b);
            
            assert.deepEqual(c.int, [0]);
            assert.equal(c.sign, 1);
            
        });
        
        
        QUnit.test( 'div: a > b', function( assert ) {
            
            var a = BigInt(-4567);
            var b = BigInt(-123);
            var c = BigInt.div(a, b);
            
            assert.deepEqual(c.int, [3,7]);
            assert.equal(c.sign, 1);
            
        });
        
        
        QUnit.test( 'div: 0 / 0', function( assert ) {
            
            // division by zero returns zero
            
            var a = BigInt(0);
            var b = BigInt(0);
            var c = BigInt.div(a, b);
            
            assert.deepEqual(c.int, [0]);
            assert.equal(c.sign, 1);
            
        });
        
        
        QUnit.test( 'div: random', function( assert ) {
            
            var a = Math.floor(Math.random() * 1000);
            var b = Math.floor(Math.random() * 1000);
            
            var _a = BigInt(a);
            var _b = BigInt(b);
            
            var _c = BigInt.div(_a, _b);
            _c = parseInt( _c.int.join('') ) * _c.sign;
            
            assert.equal(_c, Math.floor(a / b), a + ' / ' + b + ' = ' + Math.floor(a / b) );
            
        });
        
        
        QUnit.test( 'div: base 7', function( assert ) {
            
            var a = BigInt(40536);
            var b = BigInt(234);
            var c = BigInt.div(a, b, 7);
            
            assert.deepEqual(c.int, [1,4,3], c.int);
            
        });
        
        
        QUnit.test( 'div: base 16', function( assert ) {
            
            var a = BigInt([4,13,2]);
            var b = BigInt([7,11]);
            var c = BigInt.div(a, b, 16);
            
            assert.deepEqual(c.int, [10], c.int);
            
        });
        
        
        // ---------------------------------------------- //
        //  POW
        // ---------------------------------------------- //
        
        
        QUnit.module('POW');
        
        
        QUnit.test( 'pow: pos exponent', function( assert ) {
            
            var a = BigInt(3);
            var b = BigInt(12);
            var c = BigInt.pow(a, b);
            
            assert.deepEqual(c.int, [5,3,1,4,4,1]);
            
        });
        
        
        QUnit.test( 'pow: neg base, even exponent', function( assert ) {
            
            var a = BigInt(-32);
            var b = BigInt(6);
            var c = BigInt.pow(a, b);
            
            assert.deepEqual(c.int, [1,0,7,3,7,4,1,8,2,4]);
            assert.equal(c.sign, 1);
            
        });
        
        
        QUnit.test( 'pow: neg base, odd exponent', function( assert ) {
            
            var a = BigInt(-2);
            var b = BigInt(3);
            var c = BigInt.pow(a, b);
            
            assert.deepEqual(c.int, [8]);
            assert.equal(c.sign, -1);
            
        });
        
        
        QUnit.test( 'pow: 0 exponent', function( assert ) {
            
            var a = BigInt(2);
            var b = BigInt(0);
            var c = BigInt.pow(a, b);
            
            assert.deepEqual(c.int, [1]);
            assert.equal(c.sign, 1);
            
        });
        
        
        QUnit.test( 'pow: neg exponent', function( assert ) {
            
            // negative exponent returns zero
            
            var a = BigInt(2);
            var b = BigInt(-2);
            var c = BigInt.pow(a, b);
            
            assert.deepEqual(c.int, [0]);
            assert.equal(c.sign, 1);
            
        });
        
        
        QUnit.test( 'pow: base 9', function( assert ) {
            
            var a = BigInt(146);
            var b = BigInt(5);
            var c = BigInt.pow(a, b, 9);
            
            assert.deepEqual(c.int, [8,0,6,0,0,8,4,3,6,0,0], c.int);
            
        });
        
        
        // ---------------------------------------------- //
        //  MODULO
        // ---------------------------------------------- //
        
        
        QUnit.module('MODULO');
        
        
        QUnit.test( 'mod: even (a > b)', function( assert ) {
                
            var a = BigInt(1234);
            var b = BigInt(2);
            var c = BigInt.mod(a, b);
            
            assert.deepEqual(c.int, [0]);
            assert.equal(c.sign, 1);
            
        });
        
        
        QUnit.test( 'mod: odd (a > b)', function( assert ) {
                
            var a = BigInt(1234);
            var b = BigInt(17);
            var c = BigInt.mod(a, b);
            
            assert.deepEqual(c.int, [1,0]);
            assert.equal(c.sign, 1);
            
        });
        
        
        QUnit.test( 'mod: a < b', function( assert ) {
            
            // a < b returns a
            
            var a = BigInt(2);
            var b = BigInt(1234);
            var c = BigInt.mod(a, b);
            
            assert.deepEqual(c.int, [2]);
            assert.equal(c.sign, 1);
            
        });
        
        
        QUnit.test( 'mod: odd (a > b)', function( assert ) {
            
            var a = BigInt(-987);
            var b = BigInt(13);
            var c = BigInt.mod(a, b);
            
            assert.deepEqual(c.int, [1,2]);
            assert.equal(c.sign, 1);
            
        });
        
        
        QUnit.test( 'mod: odd (a > b)', function( assert ) {
            
            var a = BigInt(987);
            var b = BigInt(-13);
            var c = BigInt.mod(a, b);
            
            assert.deepEqual(c.int, [1,2]);
            assert.equal(c.sign, -1);
            
        });
        
        
        QUnit.test( 'mod: odd (a > b)', function( assert ) {
            
            var a = BigInt(-78910);
            var b = BigInt(-991);
            var c = BigInt.mod(a, b);
            
            assert.deepEqual(c.int, [6,2,1]);
            assert.equal(c.sign, -1);
            
        });
        
        
        QUnit.test( 'mod: base 8', function( assert ) {
            
            var a = BigInt(173);
            var b = BigInt(115);
            var c = BigInt.mod(a, b, 8);
            
            assert.deepEqual(c.int, [5,6], c.int);
            
        });
        
        
        QUnit.test( 'mod: base 16', function( assert ) {
            
            var a = BigInt([7,11]);
            var b = BigInt([10]);
            var c = BigInt.mod(a, b, 16);
            
            assert.deepEqual(c.int, [3], c.int);
            
        });
        
        
        // ---------------------------------------------- //
        //  SORT
        // ---------------------------------------------- //
        
        
        QUnit.module('SORT');
        
        
        QUnit.test( 'sort: a, b, c (same length)', function( assert ) {
            
            var a = BigInt(123);
            var b = BigInt(456);
            var c = BigInt(789);
            var args = [b, c, a];
            BigInt.sort(args);
            
            assert.deepEqual(args, [a,b,c]);
            
        });
        
        
        QUnit.test( 'sort: a, b, c (diff length)', function( assert ) {
            
            var a = BigInt(12);
            var b = BigInt(456);
            var c = BigInt(78910);
            var args = [b, c, a];
            BigInt.sort(args);
            
            assert.deepEqual(args, [a,b,c]);
            
        });
        
        
        QUnit.test( 'sort: a, b, c (same length & pos / neg)', function( assert ) {
            
            var a = BigInt(123);
            var b = BigInt(456);
            var c = BigInt(-789);
            var args = [b, c, a];
            BigInt.sort(args);
            
            assert.deepEqual(args, [c,a,b]);
            
        });
        
        
        QUnit.test( 'sort: a, b, c (diff length & pos / neg)', function( assert ) {
            
            var a = BigInt(123);
            var b = BigInt(-4);
            var c = BigInt(-78900);
            var args = [b, a, c];
            BigInt.sort(args);
            
            assert.deepEqual(args, [c,b,a]);
            
        });
        
        
        // ---------------------------------------------- //
        //  BASE CONVERSION
        // ---------------------------------------------- //
        
        
        QUnit.module('BASE CONVERSION');
        
        
        QUnit.test( 'toBase: 2 from base 10', function( assert ) {
            
            var a = BigInt(0);
            var b = BigInt.toBase(a.int, [2]);
            
            assert.deepEqual(b, [0], b);
            
        });
        
        
        QUnit.test( 'toBase: 2 from base 10', function( assert ) {
            
            var a = BigInt(123);
            var b = BigInt.toBase(a.int, [2]);
            
            assert.deepEqual(b, [1,1,1,1,0,1,1], b);
            
        });
        
        
        QUnit.test( 'toBase: 3 from base 4', function( assert ) {
            
            var a = BigInt(103102);
            var b = BigInt.toBase(a.int, [3], 4);
            
            assert.deepEqual(b, [1,2,0,0,2,0,1], b);
            
        });
        
        
        QUnit.test( 'toBase: 10 from base 2', function( assert ) {
            
            var a = BigInt(11110);
            var b = BigInt.fromBase(a.int, 2);
            
            assert.deepEqual(b, [3,0], b);
            
        });
        
        
        QUnit.test( 'toBase: 16 from base 10', function( assert ) {
            
            var a = BigInt(123);
            var b = BigInt.toBase(a.int, [1,6]);
            
            assert.deepEqual(b, [7,11], b);
            
        });
        
        
        QUnit.test( 'toBase: 10 from base 16', function( assert ) {
            
            var a = BigInt([7,11]);
            var c = BigInt.toBase(a.int, [2], 16);
            
            assert.deepEqual(c, [1,1,1,1,0,1,1], c);
            
        });
        
        
        QUnit.test( 'toBaseString: 16', function( assert ) {
            
            var n = 123456;
            var a = BigInt(n);
            a = BigInt.toBase(a.int, [1,6]);
            
            assert.equal(BigInt.toBaseString(a).join(''), (n).toString(16), (n).toString(16));
            
        });
        
        
        QUnit.test( 'toBaseString: 3', function( assert ) {
            
            var n = 123456;
            var a = BigInt(n);
            a = BigInt.toBase(a.int, [3]);
            
            assert.equal(BigInt.toBaseString(a).join(''), (n).toString(3), (n).toString(3));
            
        });
        
        
        QUnit.test( 'toBaseString: 36', function( assert ) {
            
            var n = 123456;
            var a = BigInt(n);
            a = BigInt.toBase(a.int, [3,6]);
            
            assert.equal(BigInt.toBaseString(a).join(''), (n).toString(36), (n).toString(36));
            
        });
        
        
        QUnit.test( 'fromBaseString: 36', function( assert ) {
            
            var n = (123456).toString(36);
            var a = BigInt( BigInt.fromBaseString(n) );
            a = BigInt.toBase(a.int, [10], 36);
            
            assert.deepEqual(a, [1,2,3,4,5,6]);
        });
    };
    
    
    return {'run': run};
});