"use strict";

window.bof_affiliate_hook_js = {

  cache: {},

  set_code: function( $code ){
    window.bof_affiliate_hook_js.cache.code = $code;
  },

  store_code: function(){
    if ( window.bof_affiliate_hook_js.cache.code )
    window.cache.set( "ref_code", window.bof_affiliate_hook_js.cache.code )
  }

}

if ( window.location ? window.location.href : false ){
  var parseWindowHref = new URL( window.location.href );
  if ( parseWindowHref.searchParams.get("ref") ){
    window.bof_affiliate_hook_js.set_code( parseWindowHref.searchParams.get("ref") )
  }
}

$(document).on("app_ready",function(){
  window.bof_affiliate_hook_js.store_code();
});
