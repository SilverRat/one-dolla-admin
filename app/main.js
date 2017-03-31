requirejs.config({
    paths: {
        'text': '../lib/require/text',
        'durandal':'../lib/durandal/js',
        'plugins' : '../lib/durandal/js/plugins',
        'transitions' : '../lib/durandal/js/transitions',
        'knockout': '../lib/knockout/knockout-3.4.0',
        'bootstrap': '../lib/bootstrap/js/bootstrap',
        'jquery': '../lib/jquery/jquery-1.9.1',
        'onedollar': '../node_modules/one-dolla/index'
        //'onedollar': '../lib/onedollar/dollar'
        //'onedollar': '../node_modules/shape-detector/index'
    },
    shim: {
        'bootstrap': {
            deps: ['jquery'],
            exports: 'jQuery'
       }
    }
});

define(['durandal/system', 'durandal/app', 'durandal/viewLocator', 'knockout', 'bootstrap'],  function (system, app, viewLocator, ko) {
    //>>excludeStart("build", true);
    system.debug(true);
    //>>excludeEnd("build");

    app.title = 'One Dollar Admin';

    app.configurePlugins({
        router:true,
        dialog: true,
        observable: true
    });

    // ToDo: This is firing on scroll, but we're not getting our update in the viewModel.
    ko.bindingHandlers.scrollY = {
        init: function(element, valueAccessor) {
            $(".page-host").scroll(function(data) {
                var value = valueAccessor();
                value(data.target.scrollTop);
            });
        },
        update: function(element, valueAccessor) {
            var value = valueAccessor();
            if (ko.unwrap(value))
                element.scroll();
            }
    };

    app.start().then(function() {
        //Replace 'viewmodels' in the moduleId with 'views' to locate the view.
        //Look for partial views in a 'views' folder in the root.
        viewLocator.useConvention();

        //Show the app by setting the root view model for our application with a transition.
        app.setRoot('viewmodels/shell', 'entrance');
    });
});