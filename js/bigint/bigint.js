define(function () {
    
    
    'use strict';
    
    
    var getSign = function (str) {
        
        var count = (str.match(/-/g) || []).length;
        return (count % 2 === 0) ? 1 : -1;
    };
    
    
    var getInt = function (str) {
        
        var int = str.match(/\d+/)[0].split('');
        int = int.map(parseFloat);
        return int;
    };
    
    
    var fill = function (char, size) {
        
        var array = new Array(size);
        var i = 0;
        
        while ( i < size ) { 
            
            array[i] = char; 
            i++;
        }
        return array;
    };
    
    
    var toInt = function (n) {
        
        return parseInt(n.join(''));
    };
    
    
    var isZero = function (array) {
        
        return (array.length === 1 && array[0] === 0);
    };
    
    
    var stripZeroes = function (array) {
        
        while (array[0] === 0 && array.length > 1) {
            
            array.shift();
        }
        return array;
    };
    
    
    // ------------------------------------- //
    // private comparison operators          //
    // ------------------------------------- //
    
    
    var cmp = function (a, b) {
        
        a = stripZeroes(a);
        b = stripZeroes(b);
        
        if (a.length > b.length) {
            
            return 1;
        
        } else if (a.length < b.length) {
            
            return -1;
        
        } else {
            
            for (var i = 0; i < a.length; i++) {
                
                if (a[i] > b[i]) {
                    
                    return 1;
                }
                
                if (a[i] < b[i]) {
                    
                    return -1;
                }
            }
        }
        return 0;
    };
    
    
    var lt = function (a, b) {
        return (cmp(a, b) < 0) ? true : false;
    };
    
    
    var lteq = function (a, b) {
        return (cmp(a, b) <= 0) ? true : false;
    };
    
    
    var gt = function (a, b) {
        return (cmp(a, b) > 0) ? true : false;
    };
    
    
    var gteq = function (a, b) {
        return (cmp(a, b) >= 0) ? true : false;
    };
    
    
    var eq = function (a, b) {
        return (cmp(a, b) === 0) ? true : false;
    };
    
    
    var sort = function (array) {
        
        array.sort(cmp);
        return array;
    };
    
    
    var add = function (a, b, base) {
        
        base = base || 10;
        
        var aLen = a.length;
        var bLen = b.length;
        var max = Math.max(aLen, bLen);
        
        var result = new Array(max + 1);
        var sum = 0;
        var carry = 0;
        
        for (var i=0; i < max + 1; i++) {
            
            var a1 = (typeof a[aLen - i - 1] === 'undefined' ? 0 : a[aLen - i - 1]);
            var b1 = (typeof b[bLen - i - 1] === 'undefined' ? 0 : b[bLen - i - 1]);
            
            sum = a1 + b1 + carry;
            carry = 0;
            
            if (sum / base >= 1) {
                sum -= base;
                carry = 1;
            }
            result[max - i] = sum;
        }
        return stripZeroes(result);
    };
    
    
    var sub = function (a, b, base) {
        
        base = base || 10;
        
        var aLen = a.length;
        var bLen = b.length;
        
        var result = new Array(aLen);
        var sum = 0;
        var carry = 0;
        
        for (var i=0; i < aLen + 1; i++) {
            
            var a1 = (typeof a[aLen - i - 1] === 'undefined' ? 0 : a[aLen - i - 1]);
            var b1 = (typeof b[bLen - i - 1] === 'undefined' ? 0 : b[bLen - i - 1]);
            
            sum = a1 - b1 + carry;
            carry = 0;
            
            if (sum < 0) {
                sum += base;
                carry = -1;
            }
            result[aLen - i] = sum;
        }
        return stripZeroes(result);
    };
    
    
    var mul = function (a, b, base) {
        
        base = base || 10;
        
        var aLen = a.length;
        var bLen = b.length;
        
        var result = new Array(aLen + bLen);
        var carry = 0;
        
        for (var i=0; i < aLen; i++) {
            
            var a1 = a[aLen - i - 1];
            var row = fill(0, i + bLen + 1);
            
            for (var j=0; j < bLen + 1; j++) {
                
                var b1 = b[bLen - j - 1] || 0;
                var sum = (a1 * b1 + carry);
                carry = Math.floor(sum / base);
                
                row[row.length - i - j - 1] = sum - (carry * base);
            }
            result = add(row, result, base);
        }
        return result;
    };
    
    
    // ------------------------------------- //
    // KARATSUBA                             //
    // ------------------------------------- //
    
    // Karatsuba mul is still slower than the grade-school mul
    // probably because of all the array slicing required. Oh well.
    
    
    var shiftR = function(a, shift) {
        
        a = a.slice();
        
        while (shift--) {
            
            a.push(0);
        }
        return a;
    };
    
    
    var karatsuba = function (a, b, base) {
        
        var lenA = a.length;
        var lenB = b.length;
        
        if (lenA === 1 || lenB === 1) {
            
            return mul(a, b, base);
        }
        
        var halfA = lenA / 2;
        var halfB = lenB / 2;
        var min = Math.round(Math.min(halfA, halfB));
        
        var a1 = a.slice(0, lenA - min);
        var a2 = a.slice(lenA - min, lenA);
        var b1 = b.slice(0, lenB - min);
        var b2 = b.slice(lenB - min, lenB);
        
        var z0 = karatsuba(a1, b1);
        var z1 = karatsuba(add(a1, a2), add(b1, b2));
        var z2 = karatsuba(a2, b2);
        
        var A = shiftR(z0, min * 2);
        var B = shiftR(sub(z1, add(z0, z2)), min);
        var C = z2;
        
        return add(add(A,B),C);
    };
    
    
    var pow = function (a, n, base) {
        
        base = base || 10;
            
        if (isZero(n)) {
            
            return [1];
        }
        
        var result = a.slice();
        
        while (gt(n, [1])) {
            
            result = mul(a, result, base);
            n = sub(n, [1], base);
        }
        
        return result;
    };
    
    
    var div = function (a, b, base) {
        
        base = base || 10;
        var aLen = a.length;
        var bLen = b.length;
        
        if ( aLen < bLen || isZero(a) ) {
            
            return [0];
        }
        
        var segment = [];
        var result = [];
        
        for (var i=0; i < aLen; i++) {
            
            segment.push(a[i]);
            
            if ( lt(segment, b) ) {
                
                result[i] = 0;
                continue;
            }
            
            for (var j=0; j < base; j++) {
                
                if ( lt(sub(segment, mul([j], b, base), base), b) ) {
                    result[i] = j;
                    break;
                }
            }
            segment = sub(segment, mul([result[i]], b, base), base);
        }
        return stripZeroes(result);
    };
    
    
    var divmod = function (a, b, base) {
        
        base = base || 10;
        var aLen = a.length;
        var bLen = b.length;
        
        if ( aLen < bLen || isZero(a) ) {
            
            return {
                'q': [0],
                'r': a
            };
        }
        
        var segment = [];
        var result = [];
        
        for (var i=0; i < aLen; i++) {
            
            segment.push(a[i]);
            
            if ( lt(segment, b) ) {
                
              result[i] = 0;
                continue;
            }
            
            for (var j=0; j < base; j++) {
                
                if ( lt(sub(segment, mul([j], b, base), base), b) ) {
                    
                    result[i] = j;
                    break;
                }
            
            }
            segment = sub(segment, mul([result[i]], b, base), base);
        }
        return {
            'q': stripZeroes(result),
            'r': segment
        };
    };
    
    
    var mod = function (a, b, base) {
        
        base = base || 10;
        
        if ( isZero(b) ) {
            
            return [0];
        }
        return divmod(a, b, base).r;
    };
    
    
    // ---------------------------------------------- //
    //  dispatch and signing functions for ADD / SUB
    // ---------------------------------------------- //
    
    
    var dispatch = function (a, b, op, base) {
        
        // dispatch for ADD / SUB
        // ---------------------------------
        // | aob | a * o * b = op --> func |
        // ---------------------------------
        // | +++ | 1 * 1 * 1 = +1 --> add  |
        // | +-- | 1 *-1 *-1 = +1 --> add  |
        // | -+- |-1 *.1.*-1 = +1 --> add  |
        // | --+ |-1.*-1.*.1 = +1 --> add  |
        // ---------------------------------
        // | ++- | 1.*.1.*-1 = -1 --> sub  |
        // | +-+ | 1.*-1.*.1 = -1 --> sub  |
        // | -++ |-1.*.1.*.1 = -1 --> sub  |
        // | --- |-1.*-1.*-1 = -1 --> sub  |
        
        var a1 = a.int;
        var b1 = b.int;
        var args = [a1, b1];
        args = sort(args);
        a1 = args[1];
        b1 = args[0];
        
        var dispatch = a.sign * b.sign * op;
        return (dispatch === 1) ? add(a1, b1, base) : sub(a1, b1, base);
    };
    
    
    var getOpSign = function (a, b, op) {
        
        // signing for ADD    
        // --------------------
        // | aob |  o * b1 = b2 <-- that's our answer
        // --------------------
        // | +++ |  1 * 1  = +1
        // | +-- | -1 *-1  = +1
        // | -+- |  1.*-1. = -1
        // | --+ | -1.*.1  = -1
        
        // signing for SUB      | 
        // -------------------- | 
        // | aob |  o * b1 = b2 | a < b2 | a > b2
        // -------------------- | --------------------------------
        // | ++- |  1 *-1  = -1 | for a < b2, if a(unsigned)
        // | +-+ | -1 * 1  =  1 | is < b(unsigned) ex: -100 + 10,
        // | -++ |  1.*-1. =  1 | then our answer is negative.
        // | --- | -1.*-1  =  1 | opposite for a > b2
        
        var dispatch = a.sign * b.sign * op;
        var bs = op * b.sign;
        
        if (dispatch > 0) {
            
            return bs;
        }
        if (a.sign < bs) {
            
            return (lt(a.int, b.int)) ? 1 : -1;
        }
        return (gt(a.int, b.int)) ? 1 : -1;
    };
    
    
    // ---------------------------------------------- //
    //  BIGINT API
    // ---------------------------------------------- //
    
    
    var BigInt = function (value, sign) {
        
        var result = {};
        
        if (Array.isArray(value)) {
            
            result.sign = (sign === -1 || sign === 1) ? sign : 1;
            result.int = value;
        }
        
        if (typeof value === 'string') {
            
            result.sign = getSign(value);
            result.int = getInt(value);
        }
        
        if (typeof value === 'number') {
            
            value = Math.floor(value).toString(10);
            result.sign = getSign(value);
            result.int = getInt(value);
        }
        
        result.int = stripZeroes(result.int);
        return result;
    };
    
    
    // ---------------------------------------------- //
    //  base conversion
    // ---------------------------------------------- //
    
    
    BigInt.BASEINTS = {
        '0':  0, '1':  1, '2':  2, '3':  3, '4':  4, '5':  5, '6':  6, '7':  7,
        '8':  8, '9':  9, 'a': 10, 'b': 11, 'c': 12, 'd': 13, 'e': 14, 'f': 15,
        'g': 16, 'h': 17, 'i': 18, 'j': 19, 'k': 20, 'l': 21, 'm': 22, 'n': 23,
        'o': 24, 'p': 25, 'q': 26, 'r': 27, 's': 28, 't': 29, 'u': 30, 'v': 31,
        'w': 32, 'x': 33, 'y': 34, 'z': 35, 'A': 36, 'B': 37, 'C': 38, 'D': 39,
        'E': 40, 'F': 41, 'G': 42, 'H': 43, 'I': 44, 'J': 45, 'K': 46, 'L': 47,
        'M': 48, 'N': 49, 'O': 50, 'P': 51, 'Q': 52, 'R': 53, 'S': 54, 'T': 55,
        'U': 56, 'V': 57, 'W': 58, 'X': 59, 'Y': 60, 'Z': 61, '+': 62, '=': 63
    };
    
    
    BigInt.BASECHARS = [
        '0','1','2','3','4','5','6','7',
        '8','9','a','b','c','d','e','f',
        'g','h','i','j','k','l','m','n',
        'o','p','q','r','s','t','u','v',
        'w','x','y','z','A','B','C','D',
        'E','F','G','H','I','J','K','L',
        'M','N','O','P','Q','R','S','T',
        'U','V','W','X','Y','Z','+','='
    ];
    
    
    BigInt.toBase = function (a, toBase, fromBase) {
        
        if (isZero(a)) return [0];
        
        fromBase = fromBase || 10;
        
        var result = [];
        var a1 = a.slice();
        
        while ( gt(a1, [0]) ) {
        
            var a2 = divmod(a1, toBase, fromBase);
            a1 = a2.q;
            result.unshift(toInt(a2.r));
        }
        return result;
    };
    
    
    BigInt.fromBase = function (a, b) {
        
        if (isZero(a)) return [0];
        
        var result = [0];
        
        for (var i = 0; i < a.length; i++) {
            
            result = add( mul([b], result), [a[i]]);
        }
        return result;
    };
    
    
    BigInt.toBaseString = function (n) {
        
        var result = [];
        
        for (var i = 0; i < n.length; i++) {
            
            result[i] = this.BASECHARS[n[i]];
        }
        return result;
    };
    
    
    BigInt.fromBaseString = function (n) {
        
        var result = [];
        n = n.split('');
        
        for (var i = 0; i < n.length; i++) {
            
            result[i] = this.BASEINTS[n[i]];
        }
        return result;
    };
    
    
    BigInt.toString = function (a, base) {
        
        base = this(base) || this(10);
        var toBase = this.toBase(a.int, base.int);
        return this.toBaseString(toBase).join('');
    };
    
    
    // just give us the string, no matter what the base
    
    BigInt.toString_ = function (a) {
        
        return a.int.join('');
    };
    
    
    // ------------------------------------- //
    // comparison operators                  //
    // ------------------------------------- //
    
    
    BigInt.cmp = function (a, b) {
        
        if (a.sign !== b.sign) {
            
            return (a.sign > b.sign) ? 1 : -1;
            
        } else if (a.int.length > b.int.length) {
            
            return (a.sign > 0) ? 1 : -1;
            
        } else if (a.int.length < b.int.length) {
            
            return (a.sign > 0) ? -1 : 1;
            
        } else {
            
            for (var i = 0; i < a.int.length; i++) {
                
                if (a.int[i] > b.int[i]) {
                    
                    return (a.sign > 0) ? 1 : -1;
                }
                
                if (a.int[i] < b.int[i]) {
                    
                    return (a.sign > 0) ? -1 : 1;
                }
            }
        }
        return 0;
    };
    
    
    BigInt.lt = function (a, b) {
        
        return (this.cmp(a, b) < 0) ? true : false;
    };
    
    
    BigInt.lteq = function (a, b) {
        
        return (this.cmp(a, b) <= 0) ? true : false;
    };
    
    
    BigInt.gt = function (a, b) {
        
        return (this.cmp(a, b) > 0) ? true : false;
    };
    
    
    BigInt.gteq = function (a, b) {
        
        return (this.cmp(a, b) >= 0) ? true : false;
    };
    
    
    BigInt.eq = function (a, b) {
        
        return (this.cmp(a, b) === 0) ? true : false;
    };
    
    
    BigInt.sort = function (array) {
        
        array.sort(this.cmp);
        return array;
    };
    
    
    // ------------------------------------- //
    // arithmetic operators                  //
    // ------------------------------------- //
    
    
    BigInt.add = function (a, b, base) {
        
        var result = dispatch(a, b, 1, base);
        var sign = getOpSign(a, b, 1);
        return {int: result, sign: sign};
    };
    
    
    BigInt.sub = function (a, b, base) {
        
        var result = dispatch(a, b, -1, base);
        var sign = getOpSign(a, b, -1);
        return {int: result, sign: sign};
    };
    
    
    BigInt.mul = function (a, b, base) {
        
        var result = mul(a.int, b.int, base);
        var sign = a.sign * b.sign;
        return {int: result, sign: sign};
    };
    
    
    BigInt.pow = function (a, n, base) {
        
        // negative exponents return zero
        if ( n.sign < 0 ) {
            
            return {int: [0], sign: 1};
        }
        var result = pow(a.int, n.int, base);
        var sign = isZero(mod(n.int, [2])) ? 1 : a.sign;
        return {int: result, sign: sign};
    };
    
    
    BigInt.div = function (a, b, base) {
        
        var result = div(a.int, b.int, base);
        var sign = a.sign * b.sign;
        return {int: result, sign: sign};
    };
    
    
    BigInt.mod = function (a, b, base) {
        
        // the sign of the result is always equal 
        // to the sign of b
        var result = mod(a.int, b.int, base);
        var sign = b.sign;
        return {int: result, sign: sign};
    };
    
    
    return BigInt;
});
