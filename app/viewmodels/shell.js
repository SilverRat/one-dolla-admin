define(["plugins/router", "durandal/app"], function(router, app) {
    return {
        router: router,
        activate: function() {
            router.map([
                {route: "", title: "Dollar Recognizer", moduleId: "viewmodels/dollarRecognizer", nav: true},
                {route: "Log Analyzer", moduleId: "viewmodels/logAnalyzer", nav: true}
            ]).buildNavigationModel();

            return router.activate();
        }
    };
});
