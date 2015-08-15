(function () {
    angular.module('ngAsyncFlow', [])
        .service('asyncFlow', asyncFlowService);

    function asyncFlowService($q) {

        function Parallel() {
            this.handlers = [];
            this.promises = [];
        }

        Parallel.prototype.get = function (promise) {
            var requestNum, _this = this;
            this.handlers.push({});

            requestNum = this.handlers.length - 1;
            this.promises.push(promise.then(function (data) {
                if (_this.handlers.length &&
                    _this.handlers[requestNum]) {
                    if (angular.isFunction(_this.handlers[requestNum].exec)) {
                        _this.handlers[requestNum].exec.apply(this, arguments);
                    }
                }
                return data;
            }));
            return this;
        };

        Parallel.prototype.then = function (handler) {
            var index = this.handlers.length - 1;
            this.handlers[index].exec = handler;
            return this;
        };

        Parallel.prototype.finally = function (handler) {
            var _this = this;
            return $q.all(this.promises).then(function () {
                if (_this.handlers.length) {
                    return handler.apply(null, arguments);
                }
                return null;
            });
        };

        Parallel.prototype.cancel = function () {
            this.handlers = [];
        };

        return {
            Parallel: Parallel
        };
    }
})(angular);