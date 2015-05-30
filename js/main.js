requirejs.config({
    paths: {
        app: 'app/app',
        automaton: 'automaton/automaton',
        bigint: 'bigint/bigint',
        canvas: 'canvas/canvas',
        hash: 'hash/hash',
        panel: 'panel/panel',
        pattern: 'pattern/pattern',
        utils: 'utils/utils'
    }
})

require(['app']);
