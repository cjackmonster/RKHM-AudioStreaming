"use strict"

window.bof = {

  isReady: false,
  serviceWorker: false,
  required_extensions: [
    {
      name: "app",
      path: "app/minified/app.js"
    },
    {
      name: "ui",
      path: "bof/minified/ui.js",
      base: "bof_assets"
    },
    {
      name: "becli",
      path: "bof/minified/becli.js",
      base: "bof_assets"
    },
    {
      name: "render",
      path: "bof/minified/render.js",
      base: "bof_assets"
    },
    {
      name: "cache",
      path: "bof/helper/minified/cache.js",
      base: "bof_assets"
    },
    {
      name: "user",
      path: "bof/helper/minified/user.js",
      base: "bof_assets"
    },
    {
      name: "chapar",
      path: "bof/helper/minified/chapar.js",
      base: "bof_assets"
    },
    {
      path: "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js",
      name: "cryptojs",
      dir: false,
      skipNameCheck: true,
      version: false
    }

  ],
  loaded_extensions: [],
  loaded_csses: [],

  log: function( $text, $level, $args ){

    var args = $.extend({
      css: null
    }, $args );

    $level = $level === undefined ? 1 : $level;

    var timeRelativeToStart = ( new Date().getTime() - window.bof.startTime ) / 1000;

    var logArgs = [];
    logArgs.push( "%c" + ( Math.round( timeRelativeToStart * 100 ) / 100 ) + "  " );
    logArgs.push( "color: #aaa" );
    logArgs[0] = logArgs[0] + "%c" + $text;
    logArgs.push( args.css ? args.css : "" );
    // logArgs.push( $text );
    // if ( $_bof_config ? $_bof_config.production === false : false )
    console.log.apply( $, logArgs );

  },
  load: function(){

    if ( window.bof_disable_autoload === true )
    return;

    var st = new Date().getTime();
    window.bof.startTime = st;
    window.bof.waitForJquery().done(function( doneTime ){

      window.bof.log("Awaiting jquery -> Done in " + ( doneTime ) + " ms" );

      window.bof.waitForServiceWorkers().always(function( doneTime ){

        window.bof.log("Awaiting service workers -> Done in " + ( doneTime ) + " ms" );

        window.bof.waitForConfig().done(function( doneTime ){

          window.bof.log("Awaiting config -> Done in " + ( doneTime ) + " ms" );

          $.when( window.bof.waitForDevice(), window.bof.waitForBrowser() ).done(function( doneTime ){

            window.bof.log("Awaiting device/browser -> Done in " + ( doneTime ) + " ms" );

            window.bof.loadExtensions().done(function( doneTime ){

              window.bof.log("Loading Extensions -> Done in " + ( doneTime ) + " ms" );
              window.bof.ready( window._g._pt( st ) );

            }).fail(function(){
              window.bof.log("Loading Extensions -> Failed" );
            });

          }).fail(function(){
            window.bof.log("Awaiting device/browser -> Failed" );
          });

        }).fail(function(){
          window.bof.log("Awaiting config -> Failed" );
        });

      })

    }).fail(function(){
      window.bof.log("Awaiting jquery -> Failed" );
    })

  },

  waitForJquery: function( $reCheck, $promise, $st, $tryCount ){

    $reCheck = $reCheck === true;
    $tryCount = !$reCheck ? 0 : $tryCount;

    if ( !$reCheck ){
      var st = new Date().getTime();
      var promise = $.Deferred();
    }
    else {
      var st = $st;
      var promise = $promise;
    }

    if ( window.jQuery ){
      promise.resolve( new Date().getTime() - st );
    } else if ( $tryCount > 100 ){
      promise.reject();
    } else {
      setTimeout( function(){
        window.bof.waitForJquery( true, promise, st, $tryCount+1 );
      }, 100 );
    }

    return promise;

  },
  waitForConfig: function(){

    var st = new Date().getTime();
    var promise = $.Deferred();

    $.when(
      window.bof._loadExtension({
        name: "config",
        path: "app/config.js",
        version: false,
        cache: false
      }),
    ).done(function(){

      window.bof._loadExtension({
        name: "general",
        path: "bof/helper/general.js",
        base: "bof_assets"
      }).done(function(){
        promise.resolve( new Date().getTime() - st );
      }).fail(function(){
        promise.reject();
      });

    }).fail(function(){
      promise.reject();
    });

    return promise;

  },
  waitForDevice: function(){

    var st = new Date().getTime();
    var promise = $.Deferred();

    if ( config.platform == "web" ){
      promise.resolve( new Date().getTime() - st );
    }
    else {

      document.addEventListener( "deviceready", function(){

        StatusBar.overlaysWebView( true );
        promise.resolve( new Date().getTime() - st );

      } );
    }

    return promise;

  },
  waitForBrowser: function(){

    var st = new Date().getTime();
    var promise = $.Deferred();

    $(document).ready( function () {
      promise.resolve( new Date().getTime() - st );
    });

    return promise;

  },
  waitForServiceWorkers: function(){

    var promise = $.Deferred();
    window.bof.serviceWorker = promise;

    if ('serviceWorker' in navigator) {

      navigator
      .serviceWorker
      .register(
        $_bof_config.web_address + "serviceworker.js"
      )
      // the registration is async and it returns a promise
      .then(
        reg => {
          window.bof.log('SW: Registration Successful');
          promise.resolve();
        },
        reason => {
          window.bof.log('SW: Registration Successful:' + reason );
          promise.reject();
        }
      )

    } else {
      window.bof.log('SW: Registration Failed: Ancient Browser || HTTP Connection');
      promise.reject();
    }

    return promise;

  },

  loadExtensions: function(){

    var st = new Date().getTime()
    var extensions_promises = [];
    for( const required_extension of bof.required_extensions ){
      if ( !$_bof_config.production ? ( required_extension ? required_extension.path.includes( "minified/" ) : false ) : false )
      required_extension.path = required_extension.path.replace( "minified/", "" )
      extensions_promises.push( bof._loadExtension( required_extension ) );
    }

    var promise = $.Deferred();

    $.when.apply( $, extensions_promises )
    .done(function(){
      promise.resolve( new Date().getTime() - st )
    })
    .fail(function(){
      promise.reject()
    });

    return promise;

  },
  _loadExtension: function( $args ){

    if ( !$args.name || !$args.path )
    return false;

    if ( $_bof_config.production && ( window[ $args.name ] ) ){
      var p = $.Deferred();
      p.resolve();
      return p;
    }

    $args.dir = $args.dir === undefined ? "js" : $args.js;
    $args.base = $args.base ? $args.base : "";
    if ( !$args.base && $args.path.substr( 0, 4 ) != "http" )
    $args.base = $_bof_config.assets_address;
    if ( $args.base == "bof_assets" )
    $args.base = $_bof_config.bof_assets_address;

    var $version = null;
    if ( Object.keys( $args ).includes( "version" ) ) $version = $args.version;
    else if ( window.config ? window.config.version : false ) $version = window.config.version;
    if ( $args.cache === false ) $version = "dont_cache";
    if ( window.config ? ( !window.config.production && $version ) : false ) $version = "dont_cache";

    var promise = $.Deferred();

    if ( window.bof.loaded_extensions.includes( $args.name ) ){
      promise.resolve();
      return promise;
    }

    var st = new Date().getTime()
    var address = $args.base + ( $args.dir ? $args.dir + "/" : "" ) + $args.path;

    let scriptUrl = address;

    if ($version) {
      scriptUrl += "?bof_version=" + $version;
      if ($version === "dont_cache" && !address.includes("assets/js/app/config.js")) {
        scriptUrl += "&bof_dont_cache=" + st;
      }
    }

    /*$.getScript(scriptUrl)
    .done(function () {
      bof.log("Loading Extension `" + $args.name + "` done in " + (new Date().getTime() - st) + " ms");

      if (typeof (window[$args.name]) === "object" || $args.skipNameCheck === true) {
        bof.loaded_extensions.push($args.name);
        promise.resolve();

        if ($args.ini) {
          $args.ini();
        }
      } else {
        bof.log("Failed to set extension: " + $args.name);
        promise.reject();
      }
    })
    .fail(function (jqxhr, settings, exception) {
      bof.log("Failed to load extension: " + $args.name + " Error: " + exception);
      promise.reject();
    });*/

    $.ajax({
      url: scriptUrl,
      dataType: "script",
      cache: $version !== "dont_cache"
    })
      .done(function () {
        bof.log("Loading Extension `" + $args.name + "` done in " + (new Date().getTime() - st) + " ms");

        if (typeof (window[$args.name]) === "object" || $args.skipNameCheck === true) {
          bof.loaded_extensions.push($args.name);
          promise.resolve();

          if ($args.ini) {
            $args.ini();
          }
        } else {
          bof.log("Failed to set extension: " + $args.name);
          promise.reject();
        }
      })
      .fail(function (jqxhr, settings, exception) {
        bof.log("Failed to load extension: " + $args.name + " Error: " + exception);
        promise.reject();
      });
      

    return promise;

  },
  _loadCSS: function( $args ){

    if ( !$args.name || !$args.path )
    return false;

    $args.dir = $args.dir === undefined ? "css" : $args.js;
    $args.base = $args.base ? $args.base : "";
    if ( !$args.base && $args.path.substr( 0, 4 ) != "http" )
    $args.base = $_bof_config.assets_address;
    if ( $args.base == "bof_assets" ) $args.base = $_bof_config.bof_assets_address;

    var $version = null;
    if ( Object.keys( $args ).includes( "version" ) ) $version = $args.version;
    else if ( window.config ? window.config.version : false ) $version = window.config.version;
    if ( $args.cache === false ) $version = "dont_cache";
    if ( window.config ? ( !window.config.production && $version ) : false ) $version = "dont_cache";

    var promise = $.Deferred();

    if ( window.bof.loaded_csses.includes( $args.name ) ){
      promise.resolve();
      return promise;
    }

    var st = new Date().getTime()
    var address = $args.base + ( $args.dir ? $args.dir + "/" : "" ) + $args.path;

    var css_link = document.createElement('link');
    css_link.rel = "stylesheet";
    css_link.type = "text/css";
    css_link.href = address + ( $version ? "?bof_version=" + $version + ( $version == "dont_cache" ? "&bof_dont_cache=" + st : "" ) : "" );
    document.head.appendChild(css_link);

    /*
    $.ajax({
      url: address,
      dataType: 'text'
    })
    .done(function( data ){
      $('<style type="text/css">\n' + data + '</style>').appendTo("head");
      bof.log( "Loading CSS `" + $args.name + "` done in " + ( new Date().getTime() - st ) + " ms" );
      bof.loaded_csses.push( $args.name );
      promise.resolve();
    })
    .fail(function( jqxhr, settings, exception ) {
      // TODO :: FALL
      bof.log( "Failed to load CSS: " + $args.name + " Error: " + exception );
      promise.reject();
    });
    */

    promise.resolve();
    return promise;

  },

  _isExtensionLoaded: function( $name ){

    return window.bof.loaded_extensions.includes( $name );

  },

  ready: function( doneTime ){

    window.bof.isReady = true;
    bof.log("----> Ready in " + doneTime );
    window.app.events.bof_ready();

  },

}

bof.load();
