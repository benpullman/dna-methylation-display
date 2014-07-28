angular.module('markdown', [])
    .filter('markdown', function () {
        var converter = new Showdown.converter();
        return function (text,user) {
            var markdown = text || '';
            var html =  converter.makeHtml(markdown).replace('{{user}}',user.firstName);
            return html;
        };
    });

//https://github.com/vpegado/angular-markdown-filter/blob/master/markdown.js