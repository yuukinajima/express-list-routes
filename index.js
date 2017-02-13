const _     = require('lodash'),
    colors  = require('colors'),
    options = {
        prefix: '',
        spacer: 7
    };

function spacer(x) {
    const res = '';
    while(x--) res += ' ';
    return res;
}

function colorMethod(method) {
    switch(method){
        case('POST'):   return method.yellow; break;
        case('GET'):    return method.green; break;
        case('PUT'):    return method.blue; break;
        case('DELETE'): return method.red; break;
        case('PATCH'):  return method.grey; break;
        default:        return method;
    }
}

module.exports = () => {
    _.each(arguments, (arg) => {
        if (_.isString(arg)) {
            console.info(arg.magenta);
            return;
        }
        if (!_.isObject(arg)) {
          return;
        }
        
        if(!arg.stack) {
            _.assign(options, arg);
            return
        }

        _.each(arg.stack, (stack) => {
            if (stack.route) {
                const route = stack.route,
                      methodsDone = {};
                _.each(route.stack, (r) => {
                  const method = r.method ? r.method.toUpperCase() : null;
                  if(!methodsDone[method] && method){
                        console.info(colorMethod(method), spacer(options.spacer - method.length), options.prefix + route.path);
                        methodsDone[method] = true;
                    }
                });
            }
        });
    });
};
