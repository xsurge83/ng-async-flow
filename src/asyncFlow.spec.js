describe('asyncFlow', function () {
    var $q, $rootScope, asyncFlow;
    var finalResults = null, intermediateResults = [], numOfRequestHandled = 0;

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
            finalResults = null;
            intermediateResults = [];
            numOfRequestHandled= 0;
        });

        function setupRequestHandler(requestIndex) {
            return function (result) {
                numOfRequestHandled++;
                intermediateResults[requestIndex] = result;
            }
        }

        function setupFinalResult(result) {
            finalResults = result;
        }

        function fakeApiRequest(index) {
            return $q.when('request number:' + index);
        }

        it('should make get two requests with promises', function () {

            var parallelFlow = new asyncFlow.Parallel();
            parallelFlow.cancel();
            parallelFlow
                .get(fakeApiRequest(1)).then(setupRequestHandler(0))
                .get(fakeApiRequest(2)).then(setupRequestHandler(1));

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
                .finally(setupFinalResult);

            $rootScope.$digest();

            expect(finalResults[0]).toBe('request number:1');
            expect(finalResults[1]).toBe('request number:2');
        });

        it('should cancel ongoing calls', function () {
            var parallelFlow = new asyncFlow.Parallel();
            parallelFlow.cancel();
            parallelFlow
                .get(fakeApiRequest(1)).then(setupRequestHandler(0))
                .get(fakeApiRequest(2)).then(setupRequestHandler(1))
                .finally(setupFinalResult);

            parallelFlow.cancel();

            $rootScope.$digest();

            expect(intermediateResults[0]).toBeUndefined();
            expect(intermediateResults[1]).toBeUndefined();
        });

        it('should make new calls after cancelling', function () {

            console.log('new');
            var parallelFlow = new asyncFlow.Parallel();
            parallelFlow.cancel();
            parallelFlow
                .get(fakeApiRequest(1)).then(setupRequestHandler(0))
                .get(fakeApiRequest(2)).then(setupRequestHandler(1))
                .finally(setupFinalResult);

            parallelFlow.cancel();

            parallelFlow
                .get(fakeApiRequest(3)).then(setupRequestHandler(0))
                .get(fakeApiRequest(4)).then(setupRequestHandler(1))
                .finally(setupFinalResult);

            $rootScope.$digest();
            expect(intermediateResults[0]).toBe('request number:3');
            expect(intermediateResults[1]).toBe('request number:4');

            expect(numOfRequestHandled).toBe(2);

        });

        it('should clear handlers after promise', function () {

        });
    });
});