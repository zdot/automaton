requirejs.config({
    paths: {
        QUnit: 'http://code.jquery.com/qunit/qunit-1.15.0',
        bigint: '../../bigint/bigint',
        utils: '../../utils/utils',
        pattern: '../pattern',
        tests: 'tests'
    },
    shim: {
        QUnit: {
            exports: 'QUnit',
            init: function() {
                QUnit.config.autoLoad = false;
                QUnit.config.autostart = false;
            }
        }
    }
})

require(['QUnit', 'tests'], function(QUnit, tests) {
    
    tests.run()
    
    QUnit.load()
    QUnit.start()
})