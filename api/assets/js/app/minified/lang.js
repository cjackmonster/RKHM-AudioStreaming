"use strict";window.lang={cache:{},code:null,get:function(){var promise=$.Deferred();window.becli.exe({endpoint:"client_translations",liquid:!0,callBack:function(sta,data){if(sta){window.lang.cache=data.translations
window.lang.code=data.code
window.ui.body.removeClass("dir_rtl",!0).removeClass("dir_ltr",!0).addClass("dir_"+data.direction,!0);promise.resolve(data.translations)}else{promise.reject()}}});return promise},return:function($hook,$args){var cache=window.lang?(window.lang.cache?window.lang.cache:{}):{};var output=$hook+"?";if(cache[$hook]){output=cache[$hook];$args=$args?$args:{};if($args.ucfirst)
output=output.charAt(0).toUpperCase()+output.slice(1);}
return output}}