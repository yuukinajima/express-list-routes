const _ = require('lodash');
const colors = require('colors');

function spacer(x) {
    let res = '';
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

module.exports = function printRoutes() {
    const options = {
        prefix: '',
        spacer: 7,
        routerSplit: true,
        recursion: true,
    };

    _.each(arguments, arg => {
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

        _.each(arg.stack.filter(r => r.route), stack => {
            const route = stack.route;
            const methodsDone = {};
            _.each(route.stack, r => {
                const method = r.method ? r.method.toUpperCase() : null;
                if(!methodsDone[method] && method) {
                    console.info(colorMethod(method), spacer(options.spacer - method.length), options.prefix + route.path);
                    methodsDone[method] = true;
                }
            });
        });

        if(!options.recursion) {
            return;
        }

        _.each(arg.stack.filter(r => r.name === 'router'), router => {
            const matcher = router.regexp.toString();
            const prefix = matcher.replace(new RegExp(/^\/\^\\/), '') // remove /^\/
                .replace(new RegExp(/\\\/\?\(\?=\\\/\|\$\)\/i$/), ''); // remvoe /?(?=\/|$)/i
            if(options.routerSplit) {
                const Spliter = 'Router';
                console.info('');
                console.info(Spliter, spacer(options.spacer - Spliter.length), prefix.substring(1));
            }
            printRoutes({prefix}, router.handle);
        });
    });
};
