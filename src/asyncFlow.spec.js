describe('asyncFlow', function () {
    var $q, $rootScope, asyncFlow;
    var finalResults = null, intermediateResults = [];

    beforeEach(function () {
        module('ngAsyncFlow');
        inject(function ($injector) {
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
            asyncFlow = $injector.get('asyncFlow');
        });
    });

    describe('Parallel', function () {

        beforeEach(function () {
            finalResults = null; intermediateResults = [];
        });

        function fakeApiRequest(index) {
            return $q.when('request number:' + index);
        }

        it('should make get two requests with promises', function () {

            var parallelFlow = new asyncFlow.Parallel();
            parallelFlow.cancel();
            parallelFlow
                .get(fakeApiRequest(1)).then(function (result) {
                    intermediateResults[0] = result;
                })
                .get(fakeApiRequest(2)).then(function (result) {
                    intermediateResults[1] = result;
                });

            $rootScope.$digest();

            expect(intermediateResults[0]).toBe('request number:1');
            expect(intermediateResults[1]).toBe('request number:2');
        });

        it('should return final results', function () {
            var parallelFlow = new asyncFlow.Parallel();
            parallelFlow.cancel();
            parallelFlow
                .get(fakeApiRequest(1))
                .get(fakeApiRequest(2))
                .finally(function (results) {
                    finalResults = results;
                });

            $rootScope.$digest();
            expect(finalResults[0]).toBe('request number:1');
            expect(finalResults[1]).toBe('request number:2');
        });
    });
});