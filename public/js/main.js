$(function () {
    'use strict';

    var s,
    app = {
        settings: {
        },

        init : function(){
            s = this.settings;

            this.initializers();
            this.bindUiActions();
            console.log('test');
        },

        initializers : function(){

                $('.markdown-textarea').popover({
                    trigger : 'manual',
                    placement : 'bottom',
                    html : true
                });
        },

        bindUiActions : function () {
            var self = this;

            $('.markdown-textarea').on('click, focusin', function() {
                console.log('focus');

                $(this).popover('show');

                setTimeout( function(){
                    $('.markdown-textarea').popover('hide');
                }, 3000);
            });
        }
    };

    app.init();
});
