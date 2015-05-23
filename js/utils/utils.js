define(function () {
    
    
    'use strict';
    
    
    var _ = {};
    
    
    _.stateToRGB = function (colors, state) {
        
        var result = [];
        
        for (var i=0; i < state.length; i++) {
            
            var index = parseInt(state[i], 10);
            result.push(colors[index]);
        }
        return result;
    };
    
    
    _.stateFromRGB = function (colors, rgb) {
        
        var state = '';
        
        for (var i=0; i < rgb.length; i++) {
            
            var c1 = JSON.stringify(rgb[i]);
            
            for (var j=0; j < colors.length; j++) {
                
                var c2 = JSON.stringify(colors[j]);
                
                if (c1 === c2) {
                    state = state.concat(j.toString(10));
                }
            }
        }
        return state;
    };
    
    
    _.RGBToData = function (data, rgb, size, w, h, gap) {
        
        var row = 0;
        var total = w * h;
        
        for (var x=0; x < total; x++) {
            
            row = Math.floor(x / w);
            if (rgb[x] === undefined) continue;
            _.setPixel(data, rgb[x], size, x, w, row, gap);
        }
    };
    
    
    _.RGBFromData = function (data, size, w, h) {
        
        var result = [];
        
        for (var i=0; i < w * h; i++) {
            
            for (var j=0; j < w; j++) {
                
                var index = (i * w * Math.pow(size, 2) * 4) + (j * size * 4);
                
                var r = data.data[index];
                var g = data.data[index + 1];
                var b = data.data[index + 2];
                
                result.push([r, g, b]);
            }
        }
        return result;
    };
    
    
    _.setPixel = function (data, rgb, size, x, w, row, gap) {
        
        gap = gap || 0;
        
        // (size - 1) is neccessary to close an
        // initial 1 pixel gap
        
        var rowOffset = row * w * (size - 1) * size * 4;
        var yOffset = x * size * 4;
        
        for (var i=0; i < size - gap; i++) {
            
            var xOffset = size * w * i * 4;
            
            for (var j=0; j < size - gap; j++) {
                
                var index = xOffset + yOffset + rowOffset + j * 4;
                
                data.data[index] = rgb[0];
                data.data[index + 1] = rgb[1];
                data.data[index + 2] = rgb[2];
                data.data[index + 3] = 255;
            }
        }
    };
    
    
    _.randInt = function (min, max) {
        
        // return an integer between min inclusive and max inclusive
        
        return Math.floor( Math.random() * (max - min + 1) ) + min;
    };
    
    
    // return a substring by index, wrapping around
    // at beginning and end
    
    // look('ABCD', 3, 0) --> 'DAB'
    
    _.look = function (str, width, j) {
    
        var strLen = str.length;
        var half = Math.floor(width / 2);
        var middle = (width - half * 2);
        
        var R = Math.min(0, j - half);
        var L = Math.max(0, j + half - strLen + middle);
        
        return str.substr(strLen + R, half) + 
               str.substr(j - half - R, width + R) + 
               str.substr(0, L);
    };
    
    
    // return an array or string filled with the
    // given character
    
    // fill('A', 3, '') --> 'AAA'
    // fill('A', 3, []) --> ['A', 'A', 'A']
    
    _.fill = function (char, size, type) {
        
        while (size--) { 
            
            type = type.concat(char);
        }
        return type;
    };
    
    
    _.pad = function (arg, char, size) {
        
        while (arg.length < size) { 
            
            arg = char.concat(arg);
        }
        return arg;
    };
    
    
    // replaceAt('AB', 0, 'C') --> 'AC'
    
    _.replaceAt = function (str, index, char) {
        
        return str.substr(0, index) + char + str.substr(index + char.length);
    };
    
    
    // i'th permutation of n**k elements
    
    _.product = function (n, k, i) {
        
        var p = (i).toString(n);
        return _.fill('0', k - p.length, '') + p;
    };
    
    
    // all permutations of n**k elements as list
    
    _.products = function (n, k) {
        
        var result = [];
        
        if (! k) return result;
        
        for (var i = 0; i < Math.pow(n, k); i++) {
            
            var p = (n > 1) ? (i).toString(n) : '0';
            result.push(_.fill('0', k - p.length, '') + p);
        }
        return result;
    };
    
    
    // template interpolation with dot notation
    // {object.thing.thing} will be replaced with object[thing][thing]
    
    var walk = function (object, pathString) {
        
        var prop, names = pathString.split('.');
        while (object && (prop=names.shift())) object = object[prop];
        return object;
    };
    
    
    _.format = function (str, data) {
        
        return str.replace(/{([^{}]*)}/g,
            function (a, b) {
                var r = walk(data, b);
                return typeof r === 'string' || typeof r === 'number' ? r : a;
            }
        );
    };
    
    
    // get click coordinates
    
    _.getCoords = function (canvas) {
        
        var element = canvas;
        var offset_x = 0;
        var offset_y = 0;
        
        if (element.offsetParent !== undefined) {
            
          do {
                offset_x += element.offsetLeft;
                offset_y += element.offsetTop;
            } while (( element = element.offsetParent ));
        }
        
        var mx = event.pageX - offset_x;
        var my = event.pageY - offset_y;
        
        return {'mx': mx, 'my': my};
    };
    
    
    // convert a permutation to an rgb value
    // `001` --> [0, 0, 255]
    
    _.permToRGB = function (perm) {
        
        var color = [];
        var value;
        
      for (var i = 0; i < 3; i++) {
            value = parseInt(perm[i], 36);
            value = (value !== 0) ? Math.floor(255 / value) : 0;
            color.push(value);
        }
        return color;
    };
    
    
    // convert an RGB value to a permutation
    // [0, 255, 255] --> `011`
    
    _.RGBToPerm = function (rgb) {
        
        var perm = '';
        var value;
        
      for (var i = 0; i < 3; i++) {
            
            value = rgb[i];
            value = (value !== 0) ? Math.floor(255 / value) : 0;
            perm += value.toString(36);
        }
        return perm;
    };
    
    
    // this function returns indices jumping between
    // first and last, then second and second-to-last, etc.
    // it's just a way for us to mix up our colors a bit
    
    _.twist = function (i, len) {
        
        if ( i < Math.floor(len / 2) ) {
            
          return i * 2;
        }
        return 2 * (len - i) - 1;
    };
    
    
    _.createColors = function (rules) {
        
        var result = [];
        
      for (var i=0; i < rules.length; i++) {
            
        var color = _.permToRGB(rules[i]);
            result[ _.twist(i, rules.length) ] = color;
        }
        return result;
    };
    
    
    _.HTMLNodeFromString = function (str) {
        
        var div = document.createElement('div');
        div.innerHTML = str;
        return div.firstChild;
    };
    
    
    _.createCanvas = function (width, height, klass) {
        
        var canvas = document.createElement('canvas');
        document.body.appendChild(canvas);
        canvas.width = width;
        canvas.height = height;
        canvas.className = klass || '';
        return canvas.getContext('2d');
    };
    
    
    return _;
});