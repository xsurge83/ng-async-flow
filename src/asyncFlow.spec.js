describe('test', function () {
    var $q, $rootScope, asyncFlow;

    beforeEach(function () {
        module('ngAsyncFlow');
        inject(function ($injector) {
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
            asyncFlow = $injector.get('asyncFlow');
        });
    });

    function fakeApiRequest(index) {
        return $q.when('request number:' + index);
    }

    function requestHandler() {

    }

    it('do something', function () {
        var parallelFlow = new asyncFlow.Parallel();
        loadData();
        $rootScope.$digest();

        function loadData() {
            parallelFlow.cancel();
            parallelFlow
                .get(fakeApiRequest()).then(requestHandler)
                .get(fakeApiRequest()).then(requestHandler)
                .finally(function () {

                });
        }

    });
});