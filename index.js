const _     = require('lodash'),
    colors  = require('colors');

function spacer(x) {
    var res = '';
    while(x--) res += ' ';
    return res;
}

function colorMethod(method) {
    switch(method) {
        case('POST'):   return method.yellow;
        case('GET'):    return method.green;
        case('PUT'):    return method.blue;
        case('DELETE'): return method.red;
        case('PATCH'):  return method.grey;
        default:        return method;
    }
}

module.exports = function prrintRoutes() {
    const options = {
        prefix: '',
        spacer: 7,
        routerSplit: true,
    };

    _.each(arguments, function(arg) {
        if(_.isString(arg)) {
            console.info(arg.magenta);
            return;
        }

        if(!_.isObject(arg)) {
            return;
        }

        if(!arg.stack) {
            _.assign(options, arg);
            return;
        }

        _.each(arg.stack, function(stack) {
            if(stack.route) {
                const route = stack.route,
                    methodsDone = {};
                _.each(route.stack, function(r) {
                    var method = r.method ? r.method.toUpperCase() : null;
                    if(!methodsDone[method] && method) {
                        console.info(colorMethod(method), spacer(options.spacer - method.length), options.prefix + route.path);
                        methodsDone[method] = true;
                    }
                });
            }
        });

        _.each(arg.stack.filter(r => r.name === 'router'), router => {
            const matcher = router.regexp.toString();
            const prefix = matcher.replace(new RegExp(/^\/\^\\/), '') // remove /^\/
                .replace(new RegExp(/\\\/\?\(\?=\\\/\|\$\)\/i$/), ''); // remvoe /?(?=\/|$)/i
            if(options.routerSplit) {
                const Spliter = 'Router';
                console.info('');
                console.info(Spliter, spacer(options.spacer - Spliter.length), prefix);
            }
            prrintRoutes({prefix}, router.handle);
        });

    });
};
