"use strict";

window.app = {

  cache: {
    sb_family: false,
    sb_family_loaded: false,
    sb_family_highlight_xhr_client: null,
    sb_data: null,
    dark: false,
    last_unload_time: null,
    version_check_timer: null,
    extensions: []
  },

  _pre_defined_extensions: {

    bof_input: {
      type: "js",
      name: "bof_input",
      path: "app/bof_input.js"
    },
    bof_modal: {
      type: "js",
      name: "bof_modal",
      path: "app/bof_modal.js"
    },
    bof_graph: {
      type: "js",
      name: "bof_graph",
      path: "app/bof_graph.js"
    },
    bof_pageBuilder: {
      type: "js",
      name: "bof_pageBuilder",
      path: "app/bof_pageBuilder.js"
    },
    bof_menuBuilder: [
      {
        type: "js",
        name: "bof_menuBuilder",
        path: "app/bof_menuBuilder.js"
      },
      {
        type: "css",
        name: "mdi",
        path: "https://cdn.jsdelivr.net/npm/@mdi/font@6.5.95/css/materialdesignicons.min.css",
        dir: false,
        use_base: false
      }
    ],
    bof_dropdown: {
      type: "js",
      name: "bof_dropdown",
      path: "app/bof_dropdown.js"
    },
    bof_content_table: {
      type: "js",
      name: "bof_content_table",
      path: "app/bof_content_table.js"
    },
    bof_content_single: {
      type: "js",
      name: "bof_content_single",
      path: "app/bof_content_single.js"
    },
    bof_content_setting: {
      type: "js",
      name: "bof_content_setting",
      path: "app/bof_content_setting.js"
    },
    bof_content_stats: {
      type: "js",
      name: "bof_content_stats",
      path: "app/bof_content_stats.js"
    },
    jquery_ui_custom: {
      type: "js",
      name: "jquery_ui_custom",
      path: "third/jquery-ui-1.13.0.custom/jquery-ui.min.js",
      skipNameCheck: true,
      base: "bof_assets"
    },
    moment_js: {
      type: "js",
      name: "moment_js",
      path: "third/daterangepicker/moment.min.js",
      skipNameCheck: true,
      base: "bof_assets"
    },
    daterangepicker: [
      {
        type: "js",
        name: "moment_js",
        path: "third/daterangepicker/moment.min.js",
        skipNameCheck: true,
        base: "bof_assets"
      },
      {
        type: "js",
        name: "daterangepicker_js",
        path: "third/daterangepicker/daterangepicker.js",
        skipNameCheck: true,
        base: "bof_assets"
      },
      {
        type: "css",
        name: "daterangepicker_css",
        path: "js/third/daterangepicker/daterangepicker.css",
        dir: false,
        base: "bof_assets"
      },
      {
        type: "css",
        name: "daterangepicker_custom_css",
        path: "js/third/daterangepicker/_custom.css",
        dir: false,
        base: "bof_assets"
      }
    ],
    editorjs: [
      {
        type: "js",
        path: "https://cdn.jsdelivr.net/npm/@editorjs/editorjs@2.28.2",
        name: "editorjs",
        dir: false,
        skipNameCheck: true
      },
      {
        type: "js",
        path: "https://cdn.jsdelivr.net/npm/@editorjs/header@latest",
        name: "editorjs_header",
        dir: false,
        skipNameCheck: true
      },
      {
        type: "js",
        path: "https://cdn.jsdelivr.net/npm/@editorjs/delimiter@latest",
        name: "editorjs_delimiter",
        dir: false,
        skipNameCheck: true
      },
      {
        type: "js",
        path: "https://cdn.jsdelivr.net/npm/@editorjs/list@1.9.0",
        name: "editorjs_list",
        dir: false,
        skipNameCheck: true
      },
      {
        type: "js",
        path: "https://cdn.jsdelivr.net/npm/@editorjs/checklist@latest",
        name: "editorjs_checklist",
        dir: false,
        skipNameCheck: true
      },
      {
        type: "js",
        path: "https://cdn.jsdelivr.net/npm/@editorjs/quote@latest",
        name: "editorjs_quote",
        dir: false,
        skipNameCheck: true
      },
      {
        type: "js",
        path: "https://cdn.jsdelivr.net/npm/@editorjs/code@latest",
        name: "editorjs_code",
        dir: false,
        skipNameCheck: true
      },
      {
        type: "js",
        path: "https://cdn.jsdelivr.net/npm/@editorjs/table@latest",
        name: "editorjs_table",
        dir: false,
        skipNameCheck: true
      },
      {
        type: "js",
        path: "https://cdn.jsdelivr.net/npm/@editorjs/link@latest",
        name: "editorjs_link",
        dir: false,
        skipNameCheck: true
      },
      {
        type: "js",
        path: "https://cdn.jsdelivr.net/npm/@editorjs/warning@latest",
        name: "editorjs_warning",
        dir: false,
        skipNameCheck: true
      },
      {
        type: "js",
        path: "https://cdn.jsdelivr.net/npm/editorjs-button@latest",
        name: "editorjs_button",
        dir: false,
        skipNameCheck: true
      },
      {
        type: "js",
        path: "https://cdn.jsdelivr.net/npm/@editorjs/image@latest",
        name: "editorjs_image",
        dir: false,
        skipNameCheck: true
      },
      {
        type: "js",
        path: "https://cdn.jsdelivr.net/npm/@editorjs/embed@latest",
        name: "editorjs_embed",
        dir: false,
        skipNameCheck: true
      },
      {
        type: "js",
        path: "https://cdn.jsdelivr.net/npm/editorjs-paragraph-with-alignment@3.0.0/dist/bundle.min.js",
        name: "editorjs-paragraph-with-alignment",
        dir: false,
        skipNameCheck: true
      },
      {
        type: "js",
        path: "https://cdn.jsdelivr.net/npm/editorjs-text-color-plugin@2.0.4/dist/bundle.min.js",
        name: "editorjs-text-color-plugin",
        dir: false,
        skipNameCheck: true
      },
      {
        type: "js",
        path: "https://cdn.jsdelivr.net/npm/editorjs-inline-font-size-tool@1.0.1/dist/bundle.min.js",
        name: "editorjs-inline-font-size-tool",
        dir: false,
        skipNameCheck: true
      },
      {
        type: "css",
        name: "editorjs-inline-font-size-tool_css",
        path: "https://cdn.jsdelivr.net/npm/editorjs-inline-font-size-tool@1.0.1/src/index.min.css",
        dir: false,
      },
      {
        type: "js",
        name: "editorjs_video_bundle",
        path: "js/third/editorjs_video_bundle.js",
        dir: false,
        base: "bof_assets",
        skipNameCheck: true
      },
      {
        type: "js",
        path: "https://cdn.jsdelivr.net/npm/@editorjs/marker@latest",
        name: "editorjs_marker",
        dir: false,
        skipNameCheck: true
      },
      {
        type: "js",
        path: "https://cdn.jsdelivr.net/npm/@editorjs/underline@latest",
        name: "editorjs_underline",
        dir: false,
        skipNameCheck: true
      },
      {
        type: "js",
        path: "https://cdn.jsdelivr.net/npm/editorjs-style@latest",
        name: "editorjs_style",
        dir: false,
        skipNameCheck: true
      },
    ],
    am4chart_core: {
      type: "js",
      name: "amchart_core",
      path: "https://cdn.amcharts.com/lib/4/core.js",
      dir: false,
      skipNameCheck: true
    },
    am4chart: [
      {
        type: "js",
        name: "amchart_core",
        path: "https://cdn.amcharts.com/lib/4/core.js",
        dir: false,
        skipNameCheck: true
      },
      {
        type: "js",
        name: "amchart_charts",
        path: "https://cdn.amcharts.com/lib/4/charts.js",
        dir: false,
        skipNameCheck: true
      },
      {
        type: "js",
        name: "amchart_animated",
        path: "https://cdn.amcharts.com/lib/4/themes/animated.js",
        dir: false,
        skipNameCheck: true
      },
      {
        type: "js",
        name: "amchart_maps",
        path: "https://cdn.amcharts.com/lib/4/maps.js",
        dir: false,
        skipNameCheck: true
      },
      {
        type: "js",
        name: "amchart_worldLow",
        path: "https://cdn.amcharts.com/lib/4/geodata/worldLow.js",
        dir: false,
        skipNameCheck: true
      },
    ],
    am5chart_core: {
      type: "js",
      name: "am5chart_core",
      path: "https://cdn.amcharts.com/lib/5/index.js",
      dir: false,
      skipNameCheck: true
    },
    am5chart: [
      {
        type: "js",
        name: "am5chart_core",
        path: "https://cdn.amcharts.com/lib/5/index.js",
        dir: false,
        skipNameCheck: true
      },
      {
        type: "js",
        name: "am5chart_xy",
        path: "https://cdn.amcharts.com/lib/5/xy.js",
        dir: false,
        skipNameCheck: true
      },
      {
        type: "js",
        name: "am5chart_percent",
        path: "https://cdn.amcharts.com/lib/5/percent.js",
        dir: false,
        skipNameCheck: true
      },
      {
        type: "js",
        name: "am5chart_map",
        path: "https://cdn.amcharts.com/lib/5/map.js",
        dir: false,
        skipNameCheck: true
      },
      {
        type: "js",
        name: "am5chart_worldLow",
        path: "https://cdn.amcharts.com/lib/5/geodata/worldLow.js",
        dir: false,
        skipNameCheck: true
      },
      {
        type: "js",
        name: "am5chart_theme",
        path: "https://cdn.amcharts.com/lib/5/themes/Dark.js",
        dir: false,
        skipNameCheck: true
      },
    ],

    masonry: {
      type: "js",
      name: "masonryJS",
      path: "third/masonry.pkgd.min.js",
      skipNameCheck: true,
      base: "bof_assets"
    },
    coloris: [
      {
        type: "js",
        name: "coloris_js",
        path: "https://cdn.jsdelivr.net/gh/mdbassit/Coloris@latest/dist/coloris.min.js",
        dir: false,
        skipNameCheck: true
      },
      {
        type: "css",
        name: "coloris_css",
        path: "https://cdn.jsdelivr.net/gh/mdbassit/Coloris@latest/dist/coloris.min.css",
        dir: false,
      },
    ],

  },

  events: {

    bof_ready: function(){

      window.app.ui.light_mode( window.cache.get( "light_mode", false ), false );

      $.when(
        window.app._extension( "bof_input" ),
        window.app._extension( "bof_dropdown" ),
        window.app._extension( "bof_modal" ),
        window.app._extension( "bof_graph" ),
        window.ui.theme.part( "parts/highlights", {} ),
        window.ui.theme.part( "parts/sidebar", {} ),
        window.ui.theme.part( "parts/header", { target: "body #main" } ),
        window.app.getConfig()
      ).done(function(){

        // window.bof_graph.load_am4chart().done(function(){

          var action;

          if ( !window.user.logged() )
          action = window.ui.page.load( "login" );

          else if ( $_bof_config.requested_url )
          action = window.ui.link.navigate( $_bof_config.requested_url );

          if ( !action )
          action = window.ui.link.navigate( "index" );

          action.done(function(){

            window.ui.link.listen();
            window.ui.history.listen();
            window.app.ui.head.listen();
            window.bof_dropdown.listen();
            window.bof_input.listen();

            window.app.events.version_check(true);

            $(document).on( "click", "#highlights .section_links div.link_group", function(){

              var opened = false;
              if( $(this).hasClass("opened") )
              opened = true;

              $("#highlights .section_links div.link_group.opened").removeClass("opened");

              if ( !opened )
              $(this).addClass("opened");

            } );
            $(document).on( "click", "#sidebar .links ul li a", function(e){
              window.app.ui.side.set( $(this).data("sb-name") );
            } );
            $(document).on( "click", "#main #header .menu .item.nots", function(e){
              window.app.events.version_check();
              window.app.events.nots();
            } );
            $(document).on( "click", "#sidebar #logo img", function(e){
              window.open($_bof_config.web_address.substr(0,$_bof_config.web_address.length-6));
            } );
            window.ui.body.removeSplashClasses();

          });

        // });

      });

      $("#main").scroll( function(){
        window.ui.history.record( "scrollTop", $("#main").scrollTop() );
      } );

    },
    lock: {

      first_on: function( $name ){},
      on: function( $name ){},
      off: function( $name ){},
      all_off: function( $name ){}

    },
    version_check: function( $initial ){

      if ( window.user.logged() ){
        window.becli.exe({
          endpoint: "check_version",
          callBack: function( sta, data ){
            if ( sta ){
              window.app.check_cache = data;
              window.app.events.nots();
              if ( data.has_update ){
                $(document).find("#main #header .menu .item.nots").addClass("has_update");
              } else {
                $(document).find("#main #header .menu .item.nots").removeClass("has_update");
              }
            }
          }
        })
      }

      if ( window.app.cache.version_check_timer )
      clearTimeout( window.app.cache.version_check_timer );

      window.app.cache.version_check_timer = setTimeout( function(){
        window.app.events.version_check();
      }, 10*60*1000 );

    },
    nots: function(){
      var _html = "<div class='nots_wrapper'><div class='nada'>Nothing to show</div></div>";
      if ( window.app.check_cache ? ( window.app.check_cache.nots ? window.app.check_cache.nots.length : false ) : false ){
        _html = "<div class='nots_wrapper'>";
        for ( var i=0; i<window.app.check_cache.nots.length; i++ ){
          var not = window.app.check_cache.nots[i];
          _html += "<div class='not_wrapper'>";
            _html += "<div class='icon_wrapper'><span class='material-icons-outlined'>"+not.icon+"</span></div>";
            _html += "<div class='text_wrapper'><span class='title'>"+not.title+"</span>"+not.text+"</div>";
            if ( not.buttons ? not.buttons.length : false ){
              _html += "<div class='buttons_wrapper'>";
              for ( var z=0; z<not.buttons.length; z++ ){
                _html += "<a class='btn btn-"+not.buttons[z][0]+"' href='"+not.buttons[z][2]+"'>"+not.buttons[z][1]+"</a>";
              }
              _html += "</div>";
            }
          _html += "</div>";
        }
        _html += "</div>";
      }
      $(document).find(".bof_dropdown#anots").html( _html );
    },
    page_unloading: function( $args ){

      $("#main .content").stop(true).fadeOut( 200 );
      window.app.cache.last_unload_time = Date.now();

      window.bof_input.unhook();

      if ( !window.ui.page.curr().o_args )
      return;

      if ( window.ui.page.curr().args ? window.ui.page.curr().args.theme_file == "parts/content_table" || window.ui.page.curr().args.theme_file_executer == "content_table" : false )
      window.bof_content_table.unloading();

      if ( window.ui.page.curr().args ? window.ui.page.curr().args.theme_file == "parts/content_single" : false )
      window.bof_content_single.unloading();

      if ( window.ui.page.curr().args ? window.ui.page.curr().args.theme_file == "parts/content_setting" : false )
      window.bof_content_setting.unloading();

      if ( window.ui.page.curr().args ? window.ui.page.curr().args.theme_file == "parts/content_stats" : false )
      window.bof_content_stats.unloading();

      var curPage_sb_family = window.app.cache.sb_family;
      if ( curPage_sb_family ? $args.urlData : false ){
        var reqPage_sb_family = window.app.pages[ $args.urlData.page ].__sb_family
        if ( reqPage_sb_family != curPage_sb_family ){
          window.app.ui.side.unload();
        }
      }

    },
    page_displaying: function( $args ){

      if ( $args.urlData ? !window.app.pages[ $args.urlData.page ] : true )
      return;

      var _p = $.Deferred();
      if ( window.app.pages[ $args.urlData.page ].theme_file == "parts/content_setting" ){
        window.app._extension( "bof_content_setting" ).done(function(){
          window.bof_content_setting.displaying().done(function(){
            _p.resolve();
          });
        });
      }
      else if ( window.app.pages[ $args.urlData.page ].theme_file == "parts/content_table" || window.app.pages[ $args.urlData.page ].theme_file_executer == "content_table" ){
        window.app._extension( "bof_content_table" ).done(function(){
          window.bof_content_table.displaying().done(function(){
            _p.resolve();
          });
        });
      }
      else if ( window.app.pages[ $args.urlData.page ].theme_file == "parts/content_single" ){
        window.app._extension( "bof_content_single" ).done(function(){
          window.bof_content_single.displaying().done(function(){

            if ( $args.name == "up_badge" )
            window.app._extension( "coloris" )

            _p.resolve();

          });
        });
      }
      else if ( window.app.pages[ $args.urlData.page ].theme_file == "parts/content_stats" ){
        window.app._extension( "bof_content_stats" ).done(function(){
          window.bof_content_stats.displaying().done(function(){
            _p.resolve();
          });
        });
      }
      else {
        _p.resolve();
      }
      return _p;

    },
    page_ready: function( $args ){

      if ( window.user.logged ){

        if ( !$(document).find("#side"+"bar #l"+"ogo").length )
        $(document).find("#side"+"bar").prepend("<div id='lo"+"go'><img sr"+"c='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+nhxg7wAAIABJREFUeJztnXmYFNXV/7/nVnVPz8q+MyurqLgEFVFjEvcYo4nRN26/mERjVBgQQQF3jYKyyDJub9SXYEzimxjUJK68BuMCLiCCbCLMyg4Ds093Vd3z+6O6Z3qG6dm6qqurpz/P0w90LbfOdN9v3+2cc4EkSZIkSZIkSZIkSZIkSZIkSVxAbR1sfDon1nYkIiqAnOBrGIAhAAYDGAigP4DeALIApAPwAfAG7yEADEAHEADQCKAOQA2AowAOAdgffO0FsBtAWfClxeQvS2B8t5W1eK86ZEeikQPgOADjAYwFMArASJiiiBX7AOwEsAPAVgAbg/+WxtCGhCMpkO5xKoDTAZwR/Pc4RGiNY8jg4OusVse3AvgcwKfB13qYLVSSTpAUSOfIBfA9ABcCmAQgz0ljushxwdf/C74vBbAGwLsAVgModsYsd5AUSGSOB3A5gIsAfNdhW6wkN/j6efD9xwDeBvAGzG5ZkjCSAmnJSAA/AfBTABMdtiVWnBV8PQKzK/b34OsbJ42KF5ICATwArgRwLYDLHLbFaU4LvuYCeBPAnwD8DYDfSaOcRDhtgIMUAHgYwC4Af0ZSHK35IYA/wvx8HoM5M9fj6IkCOQPmF78TwH0AhjtrTtwzFMBsmF2uv+DYWbKEpicJ5HwA/wKwFsB1DtviVv4LwEcA3gFwscO2xISeIJDzYM7SvAez25Akei4E8BaAVcH/JyyJLJDvAFgJ80u8yGFbEpXzYLYm/0CCzvolokCGAngWwBcArnDYlp7Cj2AuPr6ABBvTJZpA7oQ5mLzFaUN6KL+C6Qs2y2lDrCJRBHIugHUAFsD0jk3iHD6Y6yhfweyCuRq3C8QLYClMn6JTnTUlSSvGwxz/PQMg1WFbuo2bBXIBgC0ApjhtSJJ2+S2AbXDpDKJbBfIETG/UEU4bkqRT5MBcg3rSaUO6itsEMhqmQ91Mpw1J0i2mAdgA01PaFbhJINcD2AxggtOGJImKkwBsgjnjFfe4RSCLAbyEpPdxokAw10yedtqQjoh3gWTCnAmZ6rQhSWzhVgD/AdDXaUMiEc8COR7A10iAufQk7XIOzO/5ZKcNaYt4FciFMAdzyfxDPYMhAL5EHMbkxKNAboDpAJccb/Q83gDwa6eNCCfeBDINwAqnjUjiKM8DuNtpI0LEk0DugwsXkpLYwjwAv3PaCCB+BPIIzPjwJElC3ANgvtNGxINAHgFwr9NGJIlLZsBhkTgtkPuQFEeS9pkB4FGnHu6kQKYi2a1K0jnmwKGBu1NTqdfCdB+JKeSynM2mtU7nxI4b5sHc+uGFWD7UCYGcB+DlWD1MkAFBBpgJDELz9hvxDAXFzCAwiEx7GQRmAYaA5NDf0qN4HuaeKG/G6oGxFshImL5VNkMgMkBsIGD4djfoaf9sNFI/DRgpeySTHs8tCQMgAgnIVEFIV4TeRxHGAJW04SrpBaqi5SqkFXhIE0JIAIBkBZIVZw2PHf8CcAJMz27biaVAfDCTjtmOIB1Skl4V6Dd79Q5RdPXTGxtj8dwYQACw8ZGzs7NStBN9nsYzvKLxDK8SmOgV/iwhJCQLSE54J4QPYWaor7H7QbHcgu1DAGfbUXA4BAldqhWHa7Muypm1cYvdz4sHPr1/Yt8hmfpZaZ76y3xq48Ve0ZgthITBKpidnqi0jS9gJtq2lNZbsMVKIEsRo9hxhqw6VENjs+8u3xeL58Ub864a7bn+jMwfpnnqrvWp9Vd5lQAlcBfseQA3W1mgEwK5GsArVhYYCWag1o/zBkwvez8Wz4tzaNtjpxf0Tav7Zbpad7NX8Q80B/cJJ5QbAfzBqsJiLZDhAMqtKqx9DAR076qswuILEf/TVDHlo1knZY4drN2eqtZP8yr+QQwFMrG6XiNhZuuPmtYCsftTetfm8ptgEBoN73wkxXEMZ8/7qqb/tC3zvtrTe/RRf+/HDEmGQhoS6KOyrZ7ZKZAFMDePtB0iA4ah1n5arH4Yi+e5lUmPbageMG3rPburB4yt0zJWEsw1ogSgADbFt9slkDNh5smNCQoMBNj77WVLN/fYrcK6wsjZ67/tXbjjyiON/a7RpFqpCN1pk6zgVgDft7pQuwSy0qZy24SJAEZtLJ+ZAPDg6Zv+UlrZZ1xDIO0NQTqIpNM2RcurACydhbBDIM8AGGRDuRGRrEClQGYsn5kojLtvw/6swm+vqGrMmgNmkLu7XH1gsa+W1QI5BWYu1pjCIChCjvy/O3JTYv3sBIEH3LFt7tGG3pdIKRpcLpJfAJhkVWFWC+RvFpfXOZhAxOmn5CrnOPL8BGHQnZvfPlSXdbIu1TKXi8SydTcrBTIV5myCIxAIKaoxEz3QxdVKsu/a/E3pId8puqFudPEM13CYMSRRY5VAMuBwwgUiQBCff+jJbMtnMnoa4x7YXrmxwntag5b6hYsH7o/CgoyNVgmkCHHwy00EpHnp7xVPDB/stC1u58x5OwKbKhonGVJ87bQtUfBstAVYIZCRMAdGcYEg9OqbLj7bv6AgJouUiczZT1Rouw4ZZxlMFU7b0k2ughk70m2sEEjUKrUaQZydlap/dXRxwR3v3ZHv2u2/4oETHthdXd0gzzKY3LoI+1w0N0frrHgagM+iMcA+zJBVQyp7dMO7UjeUzzRD2Q1QwK4nEhh1MpP9nAIF3eu7EzExsyGZausDdGj73voD1zy7zoDDjlNHluSc41PxH3K8I90tvgszHqlDrPbmXYM430CeiEGQzTHcDNtGS2bRbEFyCIJkgoTQJKsHdKmWGVLd3Gj41tYHPGtHz167BQ4I5uiS3DtSVF7kQpFsgLlG1yFWCuR0AJ925sL4wf46RU3PibIWETeJjcAASbAU0KEiYKR85ddT36rxp74yYtZnXyF2YqGaZbmvexSOuyzsneBcmHuRtIuVAolJCG0iQyQhIIMCaNnyMCgYMqsgvP4TJAQZIJLQDA8ajbRV9VraM8Pu3LASMRDKa7cNSrngeN9+hWSvOJi47Arr0Int+6wSyHEwt2BO0gUIDEE6AAlmBQar0Nmz12B1ryHFEWZRwyCNwGmCZFaKWn+ORxgRg5sIEgoZkExo0NPW1AUy5g6dseGfsFkoh57MvSjdy2+7sKv1HQDr27vAKoG8CuCnXTCsR0MkoZAOTaoIGL4NjUbqBwHd93FtwLvx/a3Vxbe/tElHG5W6eN7x44dlHXlPQhnQ0a+1QlpQKOmvHq5LvXPE7I2ldv09AKhmWd5fPYpxpctakbfQwX7tVghkAIADXTSsRxKaINANdW+dnvFSdWPmKyNmrf0Snf+FpwNPHr+ob+rhabr0dnxxsIXSpdpQ48+6deD0zZbFardmw305maMH46ggFi4TSTaAiOs6VoTcFnbjnh4Gg0hCN0RZY8A7ZW2xd+SAaZvvHjFr7Xp0rftDqWrD6Z1NtGCOWzxQBKf28h1dXrVk9HOwqfae/EhZTaOmzmL3Re1O78rF3WlBKmH63SdpAyKGIQHdUB/6cIecd+my0khJ62jt/RN9/dLEcV5F5hHJgULITAKrhhT1AGl9Ug5dlqo2XKyxt8tTx2bKUgONmm918SHvJSc9vM2O5HmirihvnyKMDruAcUQdgN4A2gyjbN2CdDUF3xVIiiMyxNB1sabWr94yaMbOTW1dsf2xiWOzfI2XpiiNP/Aq+7+jkjbQnJVqnsXipsliBTp7urWuYubxVeHz+L9XMIA+3/XomDML7tluddSlDBjGbB/heRcN2NNhpqL6U2cu7moLsgrJbZnbhJlhSHVZxpTiqTi2G0WVi0ddrgr5W4+iXaSKAIjMSEgzGbW9tYuIoUuxtfigfsoJD+622mVE1Bbl7fYIfTA7vt1Mp/kEwFltnYhmDDIESXG0CTOgGWJKW+I4tGjUeTXL8j9K8zas9HkaLzJTgnqhS68pkBh0TZgJCsnj8vqrq2F9X0hqhvqEi1oQwIw4zO3MhV0RyPXdsyWxYWYEdLouq7C0CGHi+HxOjrdmaf7v032Nq7yqNgnBrIbMAorQ4BWNwSQJsapZBFXwxNqi3JesfujGCvmcJpVG6qb/mUN0ygM9KZAoYAZ0iRt7TS1t0Z89sDD/5HFD6WuvR7uJgnt6AKGECBLVjX1e2VufvcCQym5BGmI5wFWIrzuyOPcmK8s8d/6uBr/mfdllwVXXdeaizgokH8D47tuSeJjdKn4wc0p5i7WGo0vyLsnwGesVIUeFMqsTSTATApqvqKrOO7bftC3XDJu+7q7iw+knG1LZT4hdaCsRw+vBf+95IifbwmK5QfM+47J0pqMBjOvoos7+RddEZ0viYTDeyiosb7HHYtXS7B+lqPJNQaBQq0DE0HT1/eoG7/jMwp2Fg2bu2o6gL/7x92+prNfTNomYJm4jKCSRmUavwMKma9jMzV8GdO8ul8Wx/7yjCzorkMujNCShkIya1zfUX4GwMceRJdkTvQr9I3ywyszwa8oDGVNKzh8049tNaDWAL3ni1BMz1NrTDemJlelBCCrxmUeX5P/YwkJlo5Hitm7WFR1d0BmBDITp2p4EwXGHwTdc9/yhpsCrnY8N65ui0qqW4gACunJNVmHJw2gljP3zR514ZMmYpwemV64jgSwnNhsWJOFR+BlY+HC/7nlDly29j+OcE2FmQIlIZz6ci6yxJTGQjI+yCsvfCDtEg7OUNwQhPXQgOD65otfUkr+E37v1ofw+NUsLnstM82/M8FbfqgpdMbdLi32FMpPt6UP2LRhnWfc5e+bG9Zrh3S/c1Yq067zYGYFcapEhrkcyUB/AbxBWo48uyb5ZUPOikzmzxbdmFZa/Hn5v5aKC7+f0k5u9nsBvFGIY7Am6sTv1a0sgYmT4Gh6CdWMR1qX673jeJLUNohbI96yxw+0wmGnVgOll20JHPpgxONWrUlF410qX/ErmlPIWiQKql+b8PDVFf18RckgsVs47C7MCVWgj9i4YZ1XYNPt1779d5sB4Ltr5gehIICcgxomo4xVmoK5RzEXYT/7J2Sn3CeKmEbZk1Nz4P4evC7+mamn2xR4FfzZFFB/CCEeQhFfVb4JFxlX7Uz4z4GTL2GV6o51Iw44EkgypBQAwJETZwBnFq0NH/n3nsFSPijubotAZCGg0+dX19U3znHvmDx/mUeiteHbDYBZIUQNXzrx4iCXbBmysCGwzpKfGZeOQNv2ygI4FEtcZS2IGAZouXgGafSlOGu69RiAUxcRgoLT3tNI/ht+VlSpWijBxmB67hgVZT6yDQVCF3mvyDwZYkhH9qqc3+TXDs8llbidnRjrRkUAiKqsnwQz4NfFm2CHyKPgFCW46H9DpSYQJqGpJ7k8VCt/HW6Ix4Cuqbuh9o2aIf8bPeoG5cOjz6JY5omrSs40ofn4EOkHEH4f24kEGw0wr2rMhhpSi/otSfW3o0DePjOinKNp3mQlm60H6vqNiRfhdiqDHw50RJfNLvabuCO0Vv6Luqdx1qpCnmGU4DcOj6N+BaWy0NZsD7LVkx9kYMhymd+8xcfzttSBJ3yuYkXnSEJ9fuqy0KY6iT7r4riAz9xUBkFKsHvtA8dHQ+f0L8icJYYwIE0fg82L9lvByNU35tnVdpGCobqwHuAyCh4wTYNFAXZX+vS7cj/3ktg62J5CTbDLEdehSfBX+XhE8oakLQQxNKqsRVqtTPHStIkJvGbqh/P7cBfsbQuf3Lxyen+LRL+Uw5z4iCYMJuqH4JZvjlVjBEBCk52585HRLZiwVMg64KHgqRJv1vb2/okNPxx4BM3SpFqNZAKQSRjWfJhiG8kXYHUIIeWbY7WjU1HCPX0pPEU8TcVrzNYxGzfvY4drM4yoqs3JrGtLP0XT1HzFMmAghDKSoIs+K0gypBFtTV41DxrZ1sL0xSHL8gVBsd8s0R0RyCIWSYzOhUVOb+q6fzxmVrlBgbGil2mBxdNF7VV+GzpfPGzFMkH5RqPIwMzTDuLlXYfnzYY/YD+Dj+qeGvS5IsT/NJ5tJ6FSS/a0oTjLVMBPInN1zC6PaOhipBREw/eV7PMwEj9Cqwg6RELIfBz3aGaQ3BKhp/DEkK2W4IA5uucCQhrJl3tsHm9ZGUlT1bNMlnABiGFL9LKtwz4ttPXp/lecmyW1n37ASBqCAoapkyU7BugGzOxkP8w+dZzSAYzaBjSSQHJhevEkAMFNDqyNeZgIzQEB9nb+uLnRGEZxhXoLgL6ioQnhVIRouguMLAQm/rq4C2l40yJ9Tckiysj0WU8LmVvPCkoFDvLjSdJEsmIGBLYj0gRxzYU8l2EVo/TmF1VhWUjzNUzYepVE37zPzshNk625so+RQ2QSPkAPRzm8tgXvH4qfYYv8pF/WsWtBpgQyz2RDXYP6ycquuB9WH1dm0Xj4lK/QmoMvDoexWDAKR3iK0lVnfFApNZRZQVe3Kp67t0+ZYsGbp8MsEyWGxWCsJ7m1iSUogQV3OtxYvDG19IJJAkptghkHE4cnymBkHg2cAgLye5u7oU6ur9kim/eaVBCEwZtMD2f1C51dtrVoDUE3ovSDu88uz0t9ZMyu/KZ4EAA4uLDjVq/JyauGqYm59YPUPNAGQENB0rurw4k6gCpkOsBvbkWPqfVIgHSAIUAS3+GWRzGWhekvEUIRs2jD00bcqDWZsCL0ngIb1EeeH3l/3wsGAZvDDzV0agiD6/vjhcvuRxaPmH35y7MzqJSNXZPj0dQzRO3QVM6MxkPp0dUPmdMm0xdJxCTEkC/gN2mtJcQJZRK6awQrR6RYk6eIeBhGPQfNAgKWkzaFxBJkCOiP8vCHxbqhbRASkqFwYdh69CssXMppFZOasksPSU+pnZPpqnkjxNtzQ0j2eYUg5t9fUHbf3n77tyTU7McGQYp9VP9EEhmS1fu9Rvdia8uSA0P9cxjH1PpJABthsiGtgBoTAaQj7tv06f9TUAjBBVXBR+PmqBvnH8KorCBMPLhoe7vjJR+rkdyVjfWizUQZBshJMLhca87MZvqvTMxlTdt8Tuvm8RWV+w1CLrVxtlyy2nT//i7qOr+wYRciBrpOGSb/WByIJpHeE4z0QgiAes/vx3CGhI0vfr1oHiMrma3jk/gU5TZtE5s4qP2hI/t+mEghITxF/RtjnPeyuipq028sm6IYyT7KoYmbTHT7oi8XMkEzb/LpyQ2Zh2e0Iay4qF+dMUBX9NLYoDxWDwJK/tqQwAELIbBd2rwBzqrcFkT7hDJsNcRUERloKmsYRj7551DAMfjX0XhCQlsJTEdYnqvXzTBlWSwRheF1Rzkq07HdwxpSS2dX1oiCgq1cHNPWBgOZ5PKCrMxoC6vlpt5eN6z21+I8IE0fF/GGDU738Flk4U2TG0Ys1sKbPRoqQbl1kTm99IFJ292IAeXZb4yZ0SW9kTC5tyoW1b0H2hKxU+jwUECUZ2F9tDMifvftQ6J7aopx7VIHfhZdjSPpb+uTSq9GNynhwYc7YdB/eFQQrsyJCMlBZ680ffve3JRYUJ+qK8rarij7SqhYuhpT7bitrsbVBpL8gNQbGuApBfOk3jwxv6noOnlG+TjI2N58H+meIpxD2o5MxuewxQ2J1eDmK4J/VP5Wz4ciTeed24fFUszT3lgwfvrJaHOYEgNg0/O5vyzq+tmN2PTpqIJEcGR9xLl2m064mHW+I18MQBGVwL/GbsEPs13l6+Aq0KujqI0uyw6PT+LUN9edLDp+xAgTxeJ9Xrq5dlvvXo4vzf7RuTk4Gjm3Naffj+dnVS/J+U7cs93NVkc8SWf+9MAOGgRWI4O7SVdJ9fHIoVsaFHJPiMlIXqwptDFh6OpJxIO32siForkxUV5TziSKaY/clo3Lll/VDwjMvvnzTAO8VJ6e9rQj5/VZDEDADDHFIStoKpgqA/CDuRSRziXg8gVU7M6JIBg5U88C82eUHrSjvyOIRD6el+O9zYfcKAKp9t5X1Cj8Q6a9wpfzthoCBVUuzbws7xLV+eW2rwXjfK05OW4Wwz/C65w8G0ieXnhfQxGNmi9MUWgIigiDZX1WNczwe/RqPR7tRVfWfKEKeKggqEcHOr4OZ/po3u/xQx1d2ClIUw82bLB3zQUcSiEtn6eyFCPAo9PjLN/Vv6uoMurOiWDNadrUUgXPqinL+jlbNRdbU0nvq/eJ03RD/aBZKsDvCBA6+wCFRMEDBdRIbsrFJBur98j5Y9H1vfrCglyrk6S4dfwBtfA6RBOKqHPaxRBDSfnxS6u/RcmV8sWT8Lfw6ReCKuqLcd759NLvFhEe/6SWfZ0wp/XGdXzlV05VHdUN8Lhl+ZtOdpPkFSKZKXVfe8WvqrY0B74WGpOVW/nYx4/UBd5Z/Y1V5g3rhQkFSdXEH5Jh6H2kMsg9Jd5OIMAMBgy/uVVj+TthhqivK+VARLVMlScZOv0a/6jOt9EO0XbtF2dz8Qek+kSOAvgBUZjTozAf3VxnFJz5cWhN2H9UV5a5RFD4jWp1IBo7UyaHD7qqwxP8KANUsy/tfr2L8zKXxIABwwHdbWYt6H0kgJejkJoc9FcnwH6wxsnNn7Q4f3FJdUe6HiuAWIjF3wBVLKmsxN2d26f4oHku1y/L+qarGDxFFN4YZMBj3ZEwueywKW1qwdlZO+vhsHDFTsbpWIJ1eB7HEJyeREYSUAZnKv9FqnJE+ufQcQ9Lfw4cMRARVkVP7Z/GOmmW58w4syD8eXatFBICql+X8QhHGxdGIAwAY+CpjctncqAppxehBylUCrhYHANS3PhCpBVkL4AzbzUkADIl/p08uOw8tu09UtST3Xo/KDx+7JsCQTJCSPmSm9zRDrGnU8O2hWrl3/MMlTVPDZXMLMlI8yE7x8HGqwLmC5IVEPCbaPL+SgaP1MnvozIqK6EpqAdUV5X6mCDnB5QJZ77ut7DvhByIJ5G0kN87pNIbEqvTJZRei1RijcnHemSkKLxJCTjx2LYPDwlyJmekAA0cA0gH2EdCfiHsDDGpKlh5ly2GOnS7tVVj+ZsdXd55Di/LGp6XIr4SrtQEA+MB3W9n3wg9E6mJZNS/eI1AEzq8ryv204vHsFoFmfaeVrEmfUjpJM5RfSxZfm1O1zVO7RKEXSAg5SFHkWEUxTlCEHCmE7E1kds+ap327T3Bjn6lWiwMA+bzy/gQQBwAcbn0gkkCiGUj2SBTBp/XNwMbKxQUXtjrFWYUlL6bdXjo+oKs/0w3lVcmiGpAgGBBkgEiCCKYQmsRgXY0LDsofyJxSvtSyQoPsfjx7iCBcaXW5DrGv9YFIAjnmwiQdIwgDUj3aO9VL8xe+OSXH1+o095pa/GrGlJKrquuV/Dp/2k/rA2nzGwO+NzXDu1mXZkyI1ZjioNkZk8se7vjqLkNZabQwQVoPADhmyjvSGOQGACvaOpekY4gkDKmUBDT1wd7Tdq5A+6t7BAAlj43L6p9ZN8OjGvda48fEYCZohrgxq7DkDx1f33X2Lxyen+kTuxJIIDf7bisLz3AZsQXZHQNjEhZmAUXIPJ/Xv7yuKO/LI4tH/Wbt7JGRgtAYAOfN2VKVMaX0Ad1Qd0SbkMEUqNhV5/dMskscMHMMv5hA4gDaqPeRBGJJ8H5PxvRHElAV/aRUb8NzJw7TdlYvGfncwYVjflwyd1xvRBpoEKd315cpFK4b0DwvVFSKE/pP37kmmr+hPaqWZl+gUMJt8HrM/iCRulgC5kDdkmTGSRDcfk1CMsFgpcow1C8k0yZDKts1w7MTYCPLVzNLUeQFXe1iEUlzrCHV9Y0B9d5+0799G/Y6nIr6p3L2C0qo+lEDYKDvtrLG8IOR4polgG+QFIhlMBMYZrYSVcheqmg8j4DzZKsp3M6Lw0zywAzohrpF05Ulvaft/D1i4Ildsyz76QQTBwDsANDY+mB7gf870M7ebUm6j9mFUsJqcnN8SDt3BTfV4aBbvICme94OGOoL/e745lXEQBgAcHRJ9vmqoFs6vtJ1tOnV3J5AttpkSBKYmVJMPXDz+wjIYJyIlOpBXSprdEN5tz4g3hl+97adiJEwAGDzQ0OzvCq9Fs/bWkfB9rYOtieQr9o5l6QLhGalqCnElmCwAEuqB+gws6iSTHUANJgV3g+mOgZVSqbdksWOgI6tuw4aW856Ykc9nAloo7x+6juCjk2NkyBsaOtgewLZaJMhCY/ZOkgzfzMLGFI9pEuxmVnZpEuxVZdKsW5QRVW93PuHNZWVj7+zv60KH09RnVRXlPN0eOx9AtJmg9CeQPYA2AWgwBZzEg4OziYRDBa6rqf8R7JY7dc8/9l1SF935rwddU0Xuozaopw7BOG3TtthI3sQYWmjo+x8nyApkHYhkiAwdKnA0FPe0wz1leoG8W7enG0VcKEYWlOzLPsGhbAwQccdIT6JdKIjgawBcL21tiQGobUH3VAqNEN9sc7v+fOwu7ZtRwKIIkT10uyrVUErElwcgFnP26QjgXxksSGup1kY6qaArhZt38/LJ87dGej4TndRtST3Wo/CL/cAcQDAx5FOdCSQjQAOILmhJ0LrELpUdgUC3sf63LHjRSRQaxFO9dLc33oUfqaHiKMKwOeRTnZm2fYD62xxJ0QSkslfH/Deu3obxvS5Y8cLSExxUNWS3Ec9iuwp4gCAD9FO2tXOpNB/E8BVlpnjKkwNaLq6srreM2Po3Tt2OWyQbXw4M8dzSo54WVWNq6JNCuEy2o2w7IxA3rbIEFdBxDAk1WuaOrnXtF3LkZgtBgDgyOK8y3wefpHI6N/DxAEA/2rvZGe6WPsArLPGFndAYOiG+PBonef4XtN2/Q8SWBwAIAiZAPfvQd2qEFsAtLvtQ2ddR1+L3hZ3wMwIGGJJ+uTSc4fetbPEaXtiQa+pJX86VKNm64b4BBbue+gCOqzXnRXIX6I0xAWYOXH9mnJr5pTSaUjwVqM12bN2VaRPLj07oIk/2BEbH6d0WK87K5BvgebdlBIRZoJfV37Ye1rJs07b4iCcVVj6S12KuT1AJDsBbOrooq6Erv2x+7bEMwzJ8Ddo4swwrFD0AAAL50lEQVTeU0vectqaOIAzp5TO0aWYmeAaebkzF3VFIC9105C4RjIFGgN0Zt9pJWudtiWeyJxSukA3MC2BRdKpZBZdEchuoOWGlG6HGWjU+Oy+d5R+6bQt8UhmYdkSgzE7AUXyKUxP9Q7pagKmp7puS3wSzFN7Yd9p5RHdDJIAGZPL5hmMRU7bYTGdrsddFcirAKq7eE/cEcxTe3OvwvL3nLbFDWRMLpthSLzhtB0W0YguzMp2ZiU9HAbwNIBZXbwvrpCMoswp5S84aIKoeHzcKK/KYxQhc4XgIcToR8RpzSZSDTMOSBZ7dIOK6xqxreDerXvgzPQzp08uu6L+qZwdgjDCgedbye9hhjZ3ikh5sdq7ZzDayGHqFnSJ9RmTyyYgthWNyuaOycnw8fmqYlyoCGMCkSwQwWCr9lawQzHskhVNsthsGOonAUO8vWOf/v6kJ3bGdKOjfQuH52b5RInLsynmoY0EcSF8t7VcWO+OQADgdQA/7ppdziMZxqEaY2jOrN0HYvRIOvzk6Ks9in69R9EvIZKKIAaHdrXtQgb3UMofCm7AY0jlgGF4XmvQleWD7ty+FjESfPXS7Os9Cr3kUreUVQAuaO8CqwRyIlyW1IEZaNT52j5Ty/8cg8fRkcUjbvOqxmRF6GOJGGDRJUF0+ABiABIsBTSpvhfQ1EX9pu+IhWMp1RblrFQFLo/Bs6zmdLQT+wEcK5DuphHfBMBV6wYG07t9ppbb7TJDlYtHXl1XlLclLcVfpCr6WECAWbFUHEAwUyMrABG8qnZBuq/xrZql+f/Yv2DkSZY+qI1Hb92rXSf52CyEcc4GdCCOtogmz/6dUdwbUyQDB6r1a2FjN+TAwpFDapblvZrm9b+iKvpYZtGFNKLRYT6H4PVoP8pM9W+oWpr/IGzcLPC0R/fWBXT8xmXrIzO6c1M03+AnAL6I4v6YwAxIpjkFc3Yfs72WVRxdUnBFhi+wxavqPwEoZsJoDbOAIMDn0R6oXZb70Z4nCvLselbvqWV/NNg13eyvAfxfd26M9pssjPJ+25GMgxmTSx+3qXiqXpp3f4qqrRTEvZ0SRktMgaqKnNQnXd90ZHF+u4PSKOCAjhulO1qRqd29MdpvdA2A/0RZhm0wAwFNTEc7McdRQNVLc//boxgPHbuDbTxAIOKMFI/xbvWSvBvseELfaWUbJNO7dpRtIZ8BeL+7N1vxkxenmb4Zkqmszx0lf7KhcKpdlrfCq8qbiKzdcNNaCIIAjypX1CzL+ZUND+Cqep4W561IVPXTCoFsA2BHJYwKc0MZegjWtx5UV5Tze1Uxro9fYbSECFAFXqhemv0zq8sedlfZNpa0Kk7jy15DhKTUncWqTvOtFpVjEQwGHckqLFluccFUvTT7fkXg124RRwgiwKPQXysXZ59mcdFc68eDcTqjdXO0BVglkGoAd1lUliVoungWFrceVUuzL/Io9KCVZcYSIsDnoVXr7xsSaUPRbjFoRuknBoutcdaKPATgULSFWDntMh8dZIiIFZIJdQF6zsoytz8ytLdHoddd6mLRhCBkjR7kWQlrm0DWdPFMHLUi+wE8aEVBVs9LxkGCOYYh6eOhM4utFCsN76P+RRC8FpbpGArh/KNLsn9pZZkHa/hlq70FouC/rCrIaoF8BuBFi8vsGgwEdLECFrb3lYtzfigIF1lVntMQAV6Vnl1/31DLulqj7ys5Ykh6m2yZUe8Sf4GF6XLtWNm6GYBtq9YdIUGoaiAr83iRz0PPu71r1RpB8IwZ5FkE67paHNCVVxzuZtUA+IWVBdohEAngShvK7RACw5DKRwVzdh20qsyji3N+ReDBVpUXTxDxzRXzciz726rq6S0JAQcH61cBsHQrCrt8Iz4AUGRT2ZEx8+m+B+u+IeH10O8SrfUIIYiRlUYPWFVewT07DxhSfEnOZGd8EcA7Vhdqp/PQFJgJ52KGwQR/QKy2qryji/MvIciEbD1CqArf9MWcbKvGIqxLxYk4/3IAv7ajYLu96y60ufwmiBjMomFPFUW1chpepKLIqYnaepgQBFjJH6Bea1WJAU184sA4xLZ6ZrdAigH8P5ufEYTBLMpO+d2OWitK2/FIQT9FsF2esPGDYHgU/gUsGqwb0lNhbqEQM5XcAtPdyRZi4Z/9EoD/jsFzAEC3qqB+6XwFgeE2l5IuwwRV4Umlcwus6UoyxXKe1/a6FasAhlvQjXDHrkLgYctvzOlqKqM2i5LCc64qDAuKincICunwerzft6I0VTH6mlso2P7DshEx6J3EMsLnBwAq7SqcWYDI6H3JCd7jLChOCOJJceZbZBuCDJBQTocFtdqjapNiMG6rAWCJoDsilgKpBXCOnQ8IhptG7dJ9YH72SalqQ4HOCeFZ0iEGe5HprfkZohcIpXj0a9n+bdzOhY0/tuHEOkZ0C4Af2lc8waNy4ZWnpinRFJKRit8REaiHtCAAIIiH1S4bfn00ZVQtzT6fIMfa3L36KYCYJRt3Ioj6Ldg0Zw2Y3qrLf9lvObr5LVUuzr6ciC5J+MF5K4gIQohl6+8b3N01EeFRaAXZ27+6HcBKOx/QGqeyDLwIG/P7qoKury3KmYEu1vLDT+ZOSPVgZWKvfURGELLGDPL+G12vF1RXlP2uINi5qPogzLzQMcXJNByPA3jUjoKJAIX4iZpleQvQOZHQkSUFP0/z8qc2/wLGPYrAhPqnctftnz9yXGeu3/34iLzaZbn/UQTOs9GshTADoGJOd1OPWsl8dDOpV0cQSeiGujmge57cV0WvHffAN60HdnRw0ZgLfJ7ArarQL+/p4ghBxJASCBiehQ1+z4rBM7d/jVZTerufGDsmI0W73qNqdyqCfTYOzJchhumlrMrNazU2ioQhmcGsVOuG+oVkUU4gCcj+qqKfKISRJ0w3FTse72LMZNmSCVKqXxpS3cFMtUScJsgYqSj6BEESZhVKDHEAxwrEikU1K5gJ0015jtUFMxMIBEEyS/U0/qDFuWCStRhMS7oQs+ILYiiqdooXgVNCZ8zPjWBzD30hbPrR7ArxIhAAuAfmAtBcOwo3v9RoZn97KqYYYjzh/QCAh2P7yLaJt37FPFiQqiWJq5mMOBEHEH8CAYDnAVfuPZEkeq5GnG0UG48CAYA3AJwKYJ/ThiSJCYcBTATwV6cNaU28CgQw3QlOBPCx04YksZXPAJwAc+/yuCOeBQKYmfHOBmBpErgkccOLAM5AHPcU4l0gIX6L5OA90bgdNvrkWYVbBAKYg/fxMPdHTOJetgH4Dhzwq+oObhIIYIpjPMwV1iTu4zkAxwNY77QhncVtAglRCHOf9gqnDUnSKfbBTCb4W9iz25dtuFUgAPAPAGMRu4QQSbrHcpjf098dtqNbuFkgAFAHMyHERTCjFZPED9sB/AjALwFUOWxLt3G7QEK8C7Nvey8AzWFbejoSZuzGWAD/ctiWqEkUgYR4FMBoAH9w2pAeyp9gfv4POmyHZSSaQACgBMCNMBcY33bUkp7DKgDfA3AdgJ3OmmItiSiQEB8DuATApbBwQ5UkLfgYpmPpBUjQzziRBRLiTZi/bpchig3lk7TgAwA/gdlKv+GwLbbSEwQS4p8AzoMplledNcW1vIbmz9DKXbzilniKKIwVHwRfx8GcgvwFgIGOWhTfHAawAqZj4dcO2xJzelIL0pqtMPd2L4ApFCc2foln/g/ATQDyAUxHDxQH0DNbkNbUwVztXQ5zLeWnMPvXp0S+JWHZCDNz4atIOoUCSAqkNZuDr0dgepxeDnOV/nQnjbKZL2Du7fc6YrBFhdtICiQy64Kv+2Eufn0f5lZfEwEMddCuaNkHYC3MLuX7sHF3pkQgKZDO8U3w9RwAD4AJMCPhJgI4DeY4Jl4phtlKrIUZ1voFAL+jFrmIpEC6jgZgTfAVYhSAcTBjVcYG348A0DeGdh2BuYq9A6aj4FcwHTi/iaENCUdSINawI/h6PexYOoAcALkAhgEYAmAwgEEA+gHIApABIBVACsyWSYWZ0pABGDDF2AigAeYGRDUw4/QPANgbfO0BUAbTxabOtr8wSZIkSZIkSZIkSZIkSZLYzv8HsBnU9ggaogEAAAAASUVORK5CYII='></div>");

      }

      $("#main .content").stop(true).fadeIn( 1200 );
      window.app.ui.head.set();
      window.app.ui.side.set();
      window.bof_input.hook();
      window.app.ui.icon_auto_bg_color();
      window.app.ui.becli._alert_reset();

      var stateData = window.ui.page.curr().stateData;
      $("#main").scrollTop( stateData.scrollTop > 0 ? stateData.scrollTop : 0 );

      window.ui.body.removeClass( "p_content_setting", true );
      window.ui.body.removeClass( "p_content_table", true );
      window.ui.body.removeClass( "p_content_single", true );
      window.ui.body.removeClass( "p_content_stats", true );

      if ( window.ui.page.curr().args ? window.ui.page.curr().args.theme_file == "parts/content_setting" : false ){
        window.bof_content_setting.ready();
        window.ui.body.addClass( "p_content_setting", true );
      }

      if ( window.ui.page.curr().args ? window.ui.page.curr().args.theme_file == "parts/content_table" || window.ui.page.curr().args.theme_file_executer == "content_table" : false ){
        window.bof_content_table.ready();
        window.ui.body.addClass( "p_content_table", true );
      }

      if ( window.ui.page.curr().args ? window.ui.page.curr().args.theme_file == "parts/content_single" : false ){
        window.bof_content_single.ready();
        window.ui.body.addClass( "p_content_single", true );
      }

      if ( window.ui.page.curr().args ? window.ui.page.curr().args.theme_file == "parts/content_stats" : false ){
        window.bof_content_stats.ready();
        window.ui.body.addClass( "p_content_stats", true );
      }

    },

  },
  _pages_g: {

    _extensions: {
      ready: function(){
        $(document).on("click",".action_submit_ppc",function(){
          window.bof_modal.create({
            class: "ppc no_groups",
            title: "Enter purchase code",
            inputs: {
              ppc: {
                title: "The code",
                tip: "Enter the purchase code you received from Envato",
                input: {
                  type: "text",
                  name: "ppc",
                },
                group: "a"
              }
            },
            buttons: [
              [ "btn-primary", "Submit", "window.app._pages_g._extensions.submit_ppc()" ]
            ],
          })
        });
      },
      unloading: function(){
        $(document).off("click",".action_submit_ppc");
      },
      submit_ppc: function(){

        var modalData = window.bof_modal.get();
        var ppc = modalData[0].value;

        window.app.ui.becli.exe(
          "button",
          {
            dom: $(document).find( ".modal .buttons .button .btn-primary" ),
          },
          {
            endpoint: "extension_submit_ppc",
            post: {
              ppc: ppc
            },
          }
        );

      }
    },

  },
  pages: {

    login: {

      title: "Login",
      url: "^login$",
      link: "login",
      theme_file: "pages/login",
      theme_args: {},
      body_class: [ "noParts", "noPaddings" ],
      becli: [],
      events: {},
      functions:{
        beforeSubmit: function(){

          $(document).find("#login_btn").attr("disabled",true).addClass("loading").val( "Wait please" );

        },
        checkResult: function( sta, data, args ){

          $(document).find("#login_btn").removeClass("loading");

          if ( sta ? data.sess_id && data.sess_key : false ){

            $(document).find("#login_btn").addClass("success").val( "Welcome, Wait please" );

            cache.set( "sess_id", data.sess_id );
            cache.set( "sess_key", data.sess_key );

            setTimeout(function(){
              window.ui.link.navigate(
                data.redirect
              );
            },500);

          }
          else {

            $(document).find("#login_btn").attr("disabled",false).addClass("failure").val( "Try again" );

          }

        }
      },

    },

    // Dashboard
    index: {

      title: "Dashboard",
      url: "^index$",
      link: "index",
      theme_file: "parts/content_stats",
      theme_args: {},
      becli: [
        {
          endpoint: "bofAdmin/stats/dashboard/?\$bof ? urlData^url^query_s\$",
          key: "stats"
        }
      ],
      events: {},
      __sb_family: "dashboard",

    },
    stat: {
      title: "Statistics",
      url: "^stat\/(.*?)$",
      link: "stat_visits",
      theme_file: "parts/content_stats",
      theme_args: {},
      becli: [
        {
          endpoint: "bofAdmin/stats/\$bof ? urlData^url^match^0\$/?\$bof ? urlData^url^query_s\$",
          key: "stats"
        }
      ],
      events: {},
      __sb_family: "dashboard",
    },

    // Content
    blog_posts: {

      title: "Blog Posts",
      url: "^blog_posts$",
      link: "blog_posts",
      theme_file: "parts/content_table",
      theme_args: {},
      becli: [
        {
          key: "content",
          endpoint: "bofAdmin/list/b_post/?\$bof ? urlData^url^query_s\$"
        }
      ],
      events: {},
      __sb_family: "content",

    },
    blog_post: {

      title: "Blog Post",
      url: "^blog_post\/(.*?)$",
      link: "blog_post",
      link_par: "blog_posts",
      theme_file: "parts/content_single",
      theme_args: {},
      becli: [
        {
          key: "entity",
          endpoint: "bofAdmin/object/b_post/?IDs=\$bof ? urlData^url^match^0\$&\$bof ? urlData^url^query_s\$"
        }
      ],
      events: {},
      __sb_family: "content",

    },
    blog_categories: {

      title: "Blog Categories",
      url: "^blog_categories$",
      link: "blog_categories",
      theme_file: "parts/content_table",
      theme_args: {},
      becli: [
        {
          key: "content",
          endpoint: "bofAdmin/list/b_category/?\$bof ? urlData^url^query_s\$"
        }
      ],
      events: {},
      __sb_family: "content",

    },
    blog_category: {

      title: "Blog Category",
      url: "^blog_category\/(.*?)$",
      link: "blog_category",
      link_par: "blog_categories",
      theme_file: "parts/content_single",
      theme_args: {},
      becli: [
        {
          key: "entity",
          endpoint: "bofAdmin/object/b_category/?IDs=\$bof ? urlData^url^match^0\$&\$bof ? urlData^url^query_s\$"
        }
      ],
      events: {},
      __sb_family: "content",

    },
    blog_tags: {

      title: "Blog Tags",
      url: "^blog_tags$",
      link: "blog_tags",
      theme_file: "parts/content_table",
      theme_args: {},
      becli: [
        {
          key: "content",
          endpoint: "bofAdmin/list/b_tag/?\$bof ? urlData^url^query_s\$"
        }
      ],
      events: {},
      __sb_family: "content",

    },
    blog_tag: {

      title: "Blog Tag",
      url: "^blog_tag\/(.*?)$",
      link: "blog_tag",
      link_par: "blog_tags",
      theme_file: "parts/content_single",
      theme_args: {},
      becli: [
        {
          key: "entity",
          endpoint: "bofAdmin/object/b_tag/?IDs=\$bof ? urlData^url^match^0\$&\$bof ? urlData^url^query_s\$"
        }
      ],
      events: {},
      __sb_family: "content",

    },

    // Users
    users: {

      title: "Users",
      url: "^user_list$",
      link: "user_list",
      theme_file: "parts/content_table",
      theme_args: {},
      becli: [
        {
          key: "content",
          endpoint: "bofAdmin/list/user/?\$bof ? urlData^url^query_s\$"
        }
      ],
      events: {},
      __sb_family: "users",

    },
    user: {

      title: "User",
      url: "^user\/(.*?)$",
      link: "user",
      link_par: "user_list",
      theme_file: "parts/content_single",
      theme_args: {},
      becli: [
        {
          key: "entity",
          endpoint: "bofAdmin/object/user/?IDs=\$bof ? urlData^url^match^0\$&\$bof ? urlData^url^query_s\$"
        }
      ],
      events: {},
      __sb_family: "users",

    },
    user_roles: {

      title: "Roles & Access",
      url: "^user_roles$",
      link: "user_roles",
      theme_file: "parts/content_table",
      theme_args: {},
      becli: [
        {
          key: "content",
          endpoint: "bofAdmin/list/user_role/?\$bof ? urlData^url^query_s\$"
        }
      ],
      events: {},
      __sb_family: "users",

    },
    user_role: {

      title: "Role",
      url: "^user_role\/(.*?)$",
      link: "user_role",
      link_par: "user_roles",
      theme_file: "parts/content_single",
      theme_args: {},
      becli: [
        {
          key: "entity",
          endpoint: "bofAdmin/object/user_role/?IDs=\$bof ? urlData^url^match^0\$&\$bof ? urlData^url^query_s\$"
        }
      ],
      events: {
        ready: function(){

          window.app.pages.user_role._data = {
            bofAdmin_access_decoded: {
              objects: [],
              objects_args: {}
            }
          };

          try {
            window.app.pages.user_role._data = window.ui.page.curr().data.becli.entity.request.content[ window.ui.page.curr().data.becli.entity.request.IDS[0] ];
            window.app.pages.user_role._data.bofAdmin_access_decoded.objects = window.app.pages.user_role._data.bofAdmin_access_decoded.objects ? window.app.pages.user_role._data.bofAdmin_access_decoded.objects : [];
            window.app.pages.user_role._data.bofAdmin_access_decoded.objects_args = window.app.pages.user_role._data.bofAdmin_access_decoded.objects_args ? window.app.pages.user_role._data.bofAdmin_access_decoded.objects_args : {};
          } catch( e ){
            window.app.pages.user_role._data = {
              bofAdmin_access_decoded: {
                objects: [],
                objects_args: {}
              }
            };
          }


          $(document).on("click","span._setting",function(e){

            var _object_name = $(this).data("object");
            var _object_groups = window.ui.page.curr().data.becli.entity._u_groups;
            var _object_group = _object_groups[ _object_name ];

            window.bof_modal.create({
              inputs: _object_group,
              title: "Configure " + _object_name,
              groups: {
                a: [ "a", "CRUD access" ],
                b: [ "b", "Limits" ]
              },
              buttons: [
                [ "btn-primary", "Save", "window.app.pages.user_role._handle_change(\""+_object_name+"\")"  ]
              ]
            });

          });

        },
        unloading: function(){
          $(document).off("click","span._setting");
        }
      },
      __sb_family: "users",

      _data: { bofAdmin_access_decoded: {} },
      _handle_change: function( objectName ){

        var objectGroup = window.ui.page.curr().data.becli.entity._u_groups[ objectName ];
        for ( var i=0; i<Object.keys( objectGroup ).length; i++ ){
          var objectGroupInputKey = Object.keys( objectGroup )[ i ];
          var objectGroupInput = objectGroup[ objectGroupInputKey ];
          delete objectGroupInput["input"]["value"];
        }

        var modalData = window.bof_modal.get();
        var modalDataSimplified = {};
        for ( var i=0; i<modalData.length; i++ ){
          var _m = modalData[i];
          if ( _m.value == "__all__" || _m.value === "" ) continue;
          modalDataSimplified[ _m.name ] = _m.value
          objectGroup[ _m.name ][ "input" ][ "value" ] = _m.value;
        }

        window.app.pages.user_role._data.bofAdmin_access_decoded[ "objects_args" ][ objectName ] = modalDataSimplified;
        window.bof_modal.close();
        $(document).find( ".settings_wrapper #save_button" ).click();

      },
      _single_before_submit: function(){

        var _inputs = $("#single_form").serializeArray();
        var _datas = [];
        var _objects = [];

        for ( var i=0; i<_inputs.length; i++ ){
          var _input = _inputs[i];
          if ( _input.name.substr( 0, "_u_r_m_a_".length ) == "_u_r_m_a_" ){
            _objects.push( _input.name.substr( "_u_r_m_a_".length ) );
          }
          else {
            _datas.push( _input );
          }
        }

        _datas.push({
          name: "bofAdmin_access_objects_args",
          value: JSON.stringify( window.app.pages.user_role._data.bofAdmin_access_decoded.objects_args )
        });

        _datas.push({
          name: "bofAdmin_access_objects",
          value: JSON.stringify( _objects )
        });

        return _datas;

      }

    },
    user_playlists: {

      title: "User-Generated Playlists",
      url: "^user_playlists$",
      link: "user_playlists",
      theme_file: "parts/content_table",
      theme_args: {},
      becli: [
        {
          key: "content",
          endpoint: "bofAdmin/list/ugc_playlist/?\$bof ? urlData^url^query_s\$"
        }
      ],
      events: {},
      __sb_family: "users",

    },
    user_playlist: {

      title: "User-Generated Playlist",
      url: "^user_playlist\/(.*?)$",
      link: "user_playlist",
      link_par: "user_playlists",
      theme_file: "parts/content_single",
      theme_args: {},
      becli: [
        {
          key: "entity",
          endpoint: "bofAdmin/object/ugc_playlist/?IDs=\$bof ? urlData^url^match^0\$&\$bof ? urlData^url^query_s\$"
        }
      ],
      events: {
      },
      __sb_family: "users",

    },
    user_preoperties: {

      title: "User Properties",
      url: "^user_properties$",
      link: "user_properties",
      theme_file: "parts/content_table",
      theme_args: {},
      becli: [
        {
          key: "content",
          endpoint: "bofAdmin/list/ugc_property/?\$bof ? urlData^url^query_s\$"
        }
      ],
      events: {},
      __sb_family: "users",

    },
    user_preoperty: {

      title: "User Property",
      url: "^user_property\/(.*?)$",
      link: "user_property",
      link_par: "user_properties",
      theme_file: "parts/content_single",
      theme_args: {},
      becli: [
        {
          key: "entity",
          endpoint: "bofAdmin/object/ugc_property/?IDs=\$bof ? urlData^url^match^0\$&\$bof ? urlData^url^query_s\$"
        }
      ],
      events: {
      },
      __sb_family: "users",

    },
    user_requests: {

      title: "User requests",
      url: "^user_requests$",
      link: "user_requests",
      theme_file: "parts/content_table",
      theme_args: {},
      becli: [
        {
          key: "content",
          endpoint: "bofAdmin/list/user_request/?\$bof ? urlData^url^query_s\$"
        }
      ],
      events: {},
      __sb_family: "users",

    },
    user_withdraws: {

      title: "User Withdrawals",
      url: "^user_withdraws$",
      link: "user_withdraws",
      theme_file: "parts/content_table",
      theme_args: {},
      becli: [
        {
          key: "content",
          endpoint: "bofAdmin/list/user_withdraw/?\$bof ? urlData^url^query_s\$"
        }
      ],
      events: {},
      __sb_family: "users",

    },

    // Business
    gateway_offline: {

      title: "Offline Payment Gateway",
      url: "^gateway_offline$",
      link: "gateway_offline",
      theme_file: "parts/content_setting",
      theme_args: {},
      becli: [
        {
          key: "setting",
          endpoint: "bofAdmin/setting/gateway_offline/"
        }
      ],
      events: {},
      __sb_family: "business",

    },
    gateway_paypal: {

      title: "Paypal Payment Gateway",
      url: "^gateway_paypal$",
      link: "gateway_paypal",
      theme_file: "parts/content_setting",
      theme_args: {},
      becli: [
        {
          key: "setting",
          endpoint: "bofAdmin/setting/gateway_paypal/"
        }
      ],
      events: {},
      __sb_family: "business",

    },
    gateway_stripe: {

      title: "Stripe Payment Gateway",
      url: "^gateway_stripe$",
      link: "gateway_stripe",
      theme_file: "parts/content_setting",
      theme_args: {},
      becli: [
        {
          key: "setting",
          endpoint: "bofAdmin/setting/gateway_stripe/"
        }
      ],
      events: {},
      __sb_family: "business",

    },
    subs_plans:{

      title: "Subscription Plans",
      url: "^user_subs_plans$",
      link: "user_subs_plans",
      theme_file: "parts/content_table",
      theme_args: {},
      becli: [
        {
          key: "content",
          endpoint: "bofAdmin/list/user_subs_plan/?\$bof ? urlData^url^query_s\$"
        }
      ],
      events: {},
      __sb_family: "business",

    },
    subs_plan: {

      title: "Subscription Plan",
      url: "^user_subs_plan\/(.*?)$",
      link: "user_subs_plan",
      link_par: "user_subs_plans",
      theme_file: "parts/content_single",
      theme_args: {},
      becli: [
        {
          key: "entity",
          endpoint: "bofAdmin/object/user_subs_plan/?IDs=\$bof ? urlData^url^match^0\$&\$bof ? urlData^url^query_s\$"
        }
      ],
      events: {},
      __sb_family: "business",

    },
    subs:{

      title: "Subscriptions",
      url: "^user_subs$",
      link: "user_subs",
      theme_file: "parts/content_table",
      theme_args: {},
      becli: [
        {
          key: "content",
          endpoint: "bofAdmin/list/user_subs/?\$bof ? urlData^url^query_s\$"
        }
      ],
      events: {},
      __sb_family: "business",

    },
    sub_plan: {

      title: "Subscription Plan",
      url: "^user_sub\/(.*?)$",
      link: "user_sub",
      link_par: "user_subs",
      theme_file: "parts/content_single",
      theme_args: {},
      becli: [
        {
          key: "entity",
          endpoint: "bofAdmin/object/user_subs/?IDs=\$bof ? urlData^url^match^0\$&\$bof ? urlData^url^query_s\$"
        }
      ],
      events: {},
      __sb_family: "business",

    },
    payments:{

      title: "Payments",
      url: "^payments$",
      link: "payments",
      theme_file: "parts/content_table",
      theme_args: {},
      becli: [
        {
          key: "content",
          endpoint: "bofAdmin/list/payment/?\$bof ? urlData^url^query_s\$"
        }
      ],
      events: {},
      __sb_family: "business",

    },
    transactions:{

      title: "Transactions",
      url: "^transactions$",
      link: "transactions",
      theme_file: "parts/content_table",
      theme_args: {},
      becli: [
        {
          key: "content",
          endpoint: "bofAdmin/list/transaction/?\$bof ? urlData^url^query_s\$"
        }
      ],
      events: {},
      __sb_family: "business",

    },
    currencies:{

      title: "Currencies",
      url: "^currencies$",
      link: "currencies",
      theme_file: "parts/content_table",
      theme_args: {},
      becli: [
        {
          key: "content",
          endpoint: "bofAdmin/list/currency/?\$bof ? urlData^url^query_s\$"
        }
      ],
      events: {},
      __sb_family: "business",

    },
    currency: {

      title: "Currency",
      url: "^currency\/(.*?)$",
      link: "currency",
      link_par: "currencies",
      theme_file: "parts/content_single",
      theme_args: {},
      becli: [
        {
          key: "entity",
          endpoint: "bofAdmin/object/currency/?IDs=\$bof ? urlData^url^match^0\$&\$bof ? urlData^url^query_s\$"
        }
      ],
      events: {},
      __sb_family: "business",

    },
    ads_setting: {

      title: "Advertisement Setting",
      url: "^ads_setting$",
      link: "ads_setting",
      theme_file: "parts/content_setting",
      theme_args: {},
      becli: [
        {
          key: "setting",
          endpoint: "bofAdmin/setting/ads/"
        }
      ],
      events: {},
      __sb_family: "business",

    },
    ads_list:{

      title: "Advertisement List",
      url: "^ads_list$",
      link: "ads_list",
      theme_file: "parts/content_table",
      theme_args: {},
      becli: [
        {
          key: "content",
          endpoint: "bofAdmin/list/ads/?\$bof ? urlData^url^query_s\$"
        }
      ],
      events: {},
      __sb_family: "business",

    },
    ads: {

      title: "Advertisement",
      url: "^ads\/(.*?)$",
      link: "ads",
      link_par: "ads_list",
      theme_file: "parts/content_single",
      theme_args: {},
      becli: [
        {
          key: "entity",
          endpoint: "bofAdmin/object/ads/?IDs=\$bof ? urlData^url^match^0\$&\$bof ? urlData^url^query_s\$"
        }
      ],
      events: {},
      __sb_family: "business",

    },

    // Setting ( custom )
    plugins: {

      title: "Plugins",
      url: "^plugins$",
      link: "plugins",
      theme_file: "pages/plugins",
      theme_args: {},
      becli: [
        {
          key: "plugins",
          endpoint: "plugin_list?type=plugin",
        }
      ],
      events: {
        ready: function(){
          window.app._pages_g._extensions.ready();
        },
        unloading: function(){
          window.app._pages_g._extensions.unloading();
        }
      },
      __sb_family: "setting",

    },
    tools: {

      title: "Tools",
      url: "^tools$",
      link: "tools",
      theme_file: "pages/plugins",
      theme_args: {},
      becli: [
        {
          key: "plugins",
          endpoint: "plugin_list?type=tool",
        }
      ],
      events: {
        ready: function(){
          window.app._pages_g._extensions.ready();
        },
        unloading: function(){
          window.app._pages_g._extensions.unloading();
        }
      },
      __sb_family: "setting",

    },
    extension: {

      title: "Extension",
      url: "^extension\/(.*?)$",
      link: "extension",
      theme_file: "pages/extension",
      theme_args: {},
      becli: [],
      events: {

        ready: function(){
          window.becli.exe({
            endpoint: "extension?name=" + window.ui.page.curr().args.urlData.url.match[0],
            callBack: function( sta, data ){
              window.app.pages.extension.functions.set_message( "txt", data.messages[0] );
              if ( sta ){
                window.app.pages.extension.functions.set_message( "txt", "Executing the process", true );
                window.app.pages.extension.functions.ID = data.process;
                window.app.pages.extension.functions.check_logs()
                window.becli.exe({
                  timeout: 1000000,
                  endpoint: "extension_process_exe",
                  post:{
                    ID: data.process
                  }
                })
              }
            }
          })
        },
        unloading: function(){
          try {
            window.app.pages.extension.functions.xhr.abort();
            clearTimeout( window.app.pages.extension.functions.timer );
          } catch( $err ){}
        },

      },
      functions: {
        xhr: null,
        timer: null,
        ID: null,
        logID: null,
        set_message: function( $type, $txt, $append ){
          $(document).find("#process_placeholder").html( ( $append === true ? $(document).find("#process_placeholder").html() : "" ) + "<div class='log t_"+$type+"'>"+$txt+"</div>" );
        },
        check_logs: function(){
          var process_ID = window.app.pages.extension.functions.ID;
          window.app.pages.extension.functions.xhr = window.becli.exe({
            endpoint: "extension_process_logs",
            post:{
              ID: process_ID,
              logID: window.app.pages.extension.functions.logID
            },
            callBack: function( sta, data ){
              if ( sta ){

                if ( data.logs ? data.logs.length : false ){
                  window.app.pages.extension.functions.logID = data.logID;
                  for ( var i=0; i<data.logs.length; i++ ){
                    var _log = data.logs[i];
                    window.app.pages.extension.functions.set_message( _log.type, _log.text, true );
                  }
                }
                else if ( data.finished ){
                  $(document).find("#process_placeholder").removeClass("active").addClass( data.p_success ? "ok" : "failed" );
                  return;
                }

              }
              window.app.pages.extension.functions.timer = setTimeout( function(){
                window.app.pages.extension.functions.check_logs()
              }, 200 );
            }
          }).client;
        }
      },
      __sb_family: "setting",

    },
    themes: {

      title: "Themes",
      url: "^themes$",
      link: "themes",
      theme_file: "pages/themes",
      theme_args: {},
      becli: [
        {
          key: "themes",
          endpoint: "theme_list"
        },
      ],
      events: {
        ready: function(){
          $(document).on( "click", ".theme .activate", function(){

            var themeID = $(this).attr("data-theme-id");
            window.app.ui.becli.exe( "alert", {
            }, {
              reload_after: true,
              endpoint: "theme_activate",
              post: {
                ID: themeID,
              }
            } );

          } );
          window.app._pages_g._extensions.ready();
        },
        unloading: function(){
          $(document).off( "click", ".theme .activate" );
          window.app._pages_g._extensions.unloading();
        }
      },
      __sb_family: "setting",

    },
    theme: {

      title: "Theme Setting",
      url: "^theme_setting$",
      link: "theme_setting",
      theme_file: "parts/content_setting",
      theme_args: {},
      becli: [
        {
          key: "setting",
          endpoint: "bofAdmin/setting/theme/"
        }
      ],
      events: {
        displaying: function(){

          return window.app._extension( "coloris" )

        },
      },
      __sb_family: "setting",

    },
    cronjobs:{

      title: "Cronjob runs",
      url: "^cronjobs$",
      link: "cronjobs",
      theme_file: "parts/content_table",
      theme_args: {},
      becli: [
        {
          key: "content",
          endpoint: "bofAdmin/list/cronjob/?\$bof ? urlData^url^query_s\$"
        }
      ],
      events: {
        ready: function(){
          $(document).on( "click", ".content_table_wrapper table tbody tr td.type_simple.a_btn .btn", function(e){

            var gid = $(this).attr("data-gid");
            window.app.ui.becli.exe( "alert", {
            }, {
              reload_after: false,
              endpoint: "bofAdmin/object/cronjob/?bof=submitting&IDs=" + gid,
              post: {
                __action: "logs",
              },
              c_callback: function( sta, data ){
                if ( sta ){

                  var logs_raw = data.logs;
                  var logs = [];
                  if ( !logs_raw ){
                    logs.push( "Nothing to see" );
                  } else {
                    for ( var i=0; i<logs_raw.length; i++ ){
                      var log_raw = logs_raw[i];
                      logs.push( "<time>"+ log_raw.time_add +"</time>"+ log_raw.text  );
                    }
                  }

                  for ( var i=0; i<logs.length; i++ ){
                    logs[i] = "<div class='log_i'>"+ logs[i] +"</div>";
                  }

                  window.bof_modal.create({
                    title: "Logs",
                    class: "logs",
                    content: logs.join("")
                  });

                }
              }
            } );

          } );
        },
        unloading: function(){
          $(document).off( "click", ".content_table_wrapper table tbody tr td.type_simple.a_btn .btn" );
        }
      },
      __sb_family: "setting",

    },
    error_logs:{

      title: "Error Logs",
      url: "^error_logs$",
      link: "error_logs",
      theme_file: "parts/content_table",
      theme_args: {},
      events: {},
      becli: [
        {
          key: "content",
          endpoint: "bofAdmin/list/error_log/?\$bof ? urlData^url^query_s\$"
        }
      ],
      __sb_family: "dashboard",

    },

    // Setting ( file )
    storage_setting: {

      title: "Storage Setting",
      url: "^storage_setting$",
      link: "storage_setting",
      theme_file: "parts/content_setting",
      theme_args: {},
      becli: [
        {
          key: "setting",
          endpoint: "bofAdmin/setting/storage/"
        }
      ],
      events: {},
      __sb_family: "setting",

    },
    upload_setting: {

      title: "Upload Setting",
      url: "^upload_setting$",
      link: "upload_setting",
      theme_file: "parts/content_setting",
      theme_args: {},
      becli: [
        {
          key: "setting",
          endpoint: "bofAdmin/setting/upload/"
        }
      ],
      events: {
        ready: function(){
          $(document).on( "click", "body.page_upload_setting .settings_wrapper .setting_group .group_title", function(e){
            var group = $(this).parents(".setting_group").toggleClass("active");
            window.bof_content_setting.masonry();
          });
        },
        unloading: function(){
          $(document).off( "click", "body.page_upload_setting .settings_wrapper .setting_group .group_title");
        }
      },
      __sb_family: "setting",

    },

    // Setting ( setting )
    brand_setting: {

      title: "Brand Setting",
      url: "^brand_setting$",
      link: "brand_setting",
      theme_file: "parts/content_setting",
      theme_args: {},
      becli: [
        {
          key: "setting",
          endpoint: "bofAdmin/setting/brand/"
        }
      ],
      events: {},
      __sb_family: "setting",

    },
    seo_setting: {

      title: "SEO Setting",
      url: "^seo_setting$",
      link: "seo_setting",
      theme_file: "parts/content_setting",
      theme_args: {},
      becli: [
        {
          key: "setting",
          endpoint: "bofAdmin/setting/seo/"
        }
      ],
      events: {},
      __sb_family: "setting",

    },
    session_setting: {

      title: "Session Setting",
      url: "^session_setting$",
      link: "session_setting",
      theme_file: "parts/content_setting",
      theme_args: {},
      becli: [
        {
          key: "setting",
          endpoint: "bofAdmin/setting/session/"
        }
      ],
      events: {},
      __sb_family: "setting",

    },
    email_setting: {

      title: "Email Setting",
      url: "^email_setting$",
      link: "email_setting",
      theme_file: "parts/content_setting",
      theme_args: {},
      becli: [
        {
          key: "setting",
          endpoint: "bofAdmin/setting/email/"
        }
      ],
      f: {
        send: function(){
          if ( $(document).find(".modal .buttons .button .btn.btn-primary").hasClass("wait") ) return;
          $(document).find(".modal #res").remove();
          $(document).find(".modal .buttons .button .btn.btn-primary").text("Wait ...").addClass("wait");
          window.becli.exe({
            endpoint: "email_test",
            post: window.bof_modal.get(true),
            callBack: function( sta, data ){
              $(document).find(".modal .buttons .button .btn.btn-primary").removeClass("wait").text("retry");
              if ( !sta ){
                $(document).find(".modal .buttons").append("<div id='res' style='margin-top:10px; '>"+data.messages[0]+"</div>")
              } else {
                $(document).find(".modal .buttons").append("<div id='res' style='margin-top:10px; '>Sent. Check your email</div>")
              }
            }
          })
        }
      },
      events: {
        ready: function(){
          $(document).find(".settings_wrapper #save_button.t2").text("Save Setting").after('<div class="btn btn-primary t2" id="exe_button">Send test email</div>');
          $(document).on("click","#exe_button",function(){

            window.bof_modal.create({
              title: "Send test email",
              inputs: {
                receiver: {
                  title: "Receiver email",
                  input: {
                    type: "text",
                    name: "receiver",
                    placeholder: "you@gmail.com"
                  },
                  group: "a"
                },
                text: {
                  title: "Text",
                  tip: "Save setting before testing",
                  input: {
                    type: "textarea",
                    name: "text",
                    value: "Hello. Testing 1, 2, 3"
                  },
                  group: "a"
                }
              },
              buttons: [
                [ "btn-primary", "Send", "window.app.pages.email_setting.f.send()" ]
              ],
            });

          });
        },
        unloading: function(){
          $(document).off("click","#exe_button");
        }
      },
      __sb_family: "setting",

    },
    browse_setting: {

      title: "Browse-pages Setting",
      url: "^browse_setting$",
      link: "browse_setting",
      theme_file: "parts/content_setting",
      theme_args: {},
      becli: [
        {
          key: "setting",
          endpoint: "bofAdmin/setting/browse/"
        }
      ],
      events: {},
      __sb_family: "setting",

    },
    touch_setting: {

      title: "Touch & Mouse Setting",
      url: "^touch_setting$",
      link: "touch_setting",
      theme_file: "parts/content_setting",
      theme_args: {},
      becli: [
        {
          key: "setting",
          endpoint: "bofAdmin/setting/touch/"
        }
      ],
      events: {},
      __sb_family: "setting",

    },
    search_setting: {

      title: "Search Setting",
      url: "^search_setting$",
      link: "search_setting",
      theme_file: "parts/content_setting",
      theme_args: {},
      becli: [
        {
          key: "setting",
          endpoint: "bofAdmin/setting/search/"
        }
      ],
      events: {},
      __sb_family: "setting",

    },
    user_pps_setting: {

      title: "User Profile/Setting Pages",
      url: "^user_pps_setting$",
      link: "user_pps_setting",
      theme_file: "parts/content_setting",
      theme_args: {},
      becli: [
        {
          key: "setting",
          endpoint: "bofAdmin/setting/user_pps/"
        }
      ],
      events: {},
      __sb_family: "setting",

    },
    youtube_piped_setting: {

      title: "YouTube Piped",
      url: "^youtube_piped_setting$",
      link: "youtube_piped_setting",
      theme_file: "parts/content_setting",
      theme_args: {},
      becli: [
        {
          key: "setting",
          endpoint: "bofAdmin/setting/youtube_piped/"
        }
      ],
      events: {
        ready: function(){
          $(document).on("click","#test_instance",function(){
            var uri = $(this).parents("tr").find("td._uri").text();
            var trid = $(this).parents("tr").attr("class");
            $(this).parents("tr").find("td.result").removeClass("ok failed").text("Wait ...");
            window.becli.exe({
              endpoint: "youtube_piped_test_instance",
              post: {
                url: uri,
                ID: trid
              },
              callBack: function( sta, data ){
                if ( sta ){
                  $(document).find("tr."+data.trid+" td.result").addClass("ok").text( "ok " + data.time + " s");
                } else {
                  $(document).find("tr."+data.trid+" td.result").addClass("failed").text(data.messages[0]);
                }
              }
            })
          });
          $(document).on("click","#select_instance",function(){
            var uri = $(this).parents("tr").find("td._uri").text();
            $(document).find("textarea[name=youtube_piped_iu]").val( $(document).find("textarea[name=youtube_piped_iu]").val() + "\n" + uri );
            $(document).find("#save_button").click();
          });
        },
        unloading: function(){
          $(document).off("click","#test_instance");
          $(document).off("click","#select_instance");
        }
      },
      __sb_family: "setting",

    },

    notifications: {

      title: "Notification Setting",
      url: "^notifications",
      link: "notifications",
      theme_file: "parts/content_table",
      theme_args: {},
      becli: [
        {
          key: "content",
          endpoint: "bofAdmin/list/notification/?\$bof ? urlData^url^query_s\$"
        }
      ],
      events: {},
      __sb_family: "setting",

    },
    notification: {

      title: "Notification",
      url: "^notification\/(.*?)$",
      link: "notification",
      link_par: "notifications",
      theme_file: "parts/content_single",
      theme_args: {},
      becli: [
        {
          key: "entity",
          endpoint: "bofAdmin/object/notification/?IDs=\$bof ? urlData^url^match^0\$&\$bof ? urlData^url^query_s\$"
        }
      ],
      events: {},
      __sb_family: "setting",

    },
    social_login_setting: {

      title: "Social Login Setting",
      url: "^social_login_setting$",
      link: "social_login_setting",
      theme_file: "parts/content_setting",
      theme_args: {},
      becli: [
        {
          key: "setting",
          endpoint: "bofAdmin/setting/social_login/"
        }
      ],
      events: {},
      __sb_family: "setting",

    },
    download_setting: {

      title: "Download Setting",
      url: "^download_setting$",
      link: "download_setting",
      theme_file: "parts/content_setting",
      theme_args: {},
      becli: [
        {
          key: "setting",
          endpoint: "bofAdmin/setting/download/"
        }
      ],
      events: {},
      __sb_family: "setting",

    },
    cli_setting: {

      title: "CLI Apps Setting",
      url: "^cli_setting$",
      link: "cli_setting",
      theme_file: "parts/content_setting",
      theme_args: {},
      becli: [
        {
          key: "setting",
          endpoint: "bofAdmin/setting/cli/"
        }
      ],
      events: {
        ready: function(){
          $(document).on("click",".settings_wrapper .setting_group .setting_wrapper .detail #ffmpeg_test",function(e){

            window.bof_modal.create({
              class: "no_groups",
              title: "Testing ffmpeg",
              content: "<div id='ffmpeg_test_result'><p>Starting the test ....</p></div>"
            });

            window.becli.exe({
              endpoint: "ffmpeg_test",
              post: {
                path: $(document).find("input[name='ffmpeg_path']").val(),
                job: "get_version"
              },
              callBack: function( sta, data ){
                for ( var i=0; i<data.messages.length; i++ ){
                  $(document).find("#ffmpeg_test_result").append("<p>"+data.messages[i]+"</p>");
                }
              }
            })

          });
          $(document).on("click",".settings_wrapper .setting_group .setting_wrapper .detail #ffmpeg_static_test",function(e){

            window.bof_modal.create({
              class: "no_groups",
              title: "Testing ffmpeg",
              content: "<div id='ffmpeg_test_result'><p>Starting the test ....</p></div>"
            });

            window.becli.exe({
              endpoint: "ffmpeg_test",
              post: {
                path: $(document).find("input[name='ffmpeg_path']").val(),
                job: "get_version",
                type: "static"
              },
              callBack: function( sta, data ){
                for ( var i=0; i<data.messages.length; i++ ){
                  $(document).find("#ffmpeg_test_result").append("<p>"+data.messages[i]+"</p>");
                }
              }
            })

          });
          $(document).on("click",".settings_wrapper .setting_group .setting_wrapper .detail #yt_test",function(e){

            window.bof_modal.create({
              class: "no_groups",
              title: "Testing Youtube-dl",
              content: "<div id='yt_test_result'><p>Starting the test ....</p></div>"
            });

            window.becli.exe({
              endpoint: "youtube_test",
              post: {
                path: $(document).find("input[name='ut_youtubedl_path']").val(),
                job: "get_version"
              },
              callBack: function( sta, data ){
                for ( var i=0; i<data.messages.length; i++ ){
                  $(document).find("#yt_test_result").append("<p>"+data.messages[i]+"</p>");
                }
                if ( sta ){
                  window.becli.exe({
                    endpoint: "youtube_test",
                    post: {
                      path: $(document).find("input[name='ut_youtubedl_path']").val(),
                      job: "download_video"
                    },
                    callBack: function( sta, data, $args ){
                      if ( !sta ){
                        var exeTime = window._g._mt() - $args.st;
                        if ( exeTime > 30000 ){
                          $(document).find("#yt_test_result").append("<p><b style='color:red'>Timed out. Failed to download a very short YouTube video. Either the intalled version or your server is too slow</b></p>");
                          $(document).find("#yt_test_result").append("<p>Try yt-dlp. Try updating yt-dlp/youtube-dl. If nothing worked, contact your server provider and ask for better service. This is a server-related issue</p>");
                        } else {
                          for ( var i=0; i<data.messages.length; i++ )
                          $(document).find("#yt_test_result").append("<p>"+data.messages[i]+"</p>");
                        }
                      } else {
                        for ( var i=0; i<data.messages.length; i++ )
                        $(document).find("#yt_test_result").append("<p>"+data.messages[i]+"</p>");
                      }
                    }
                  });
                }
              }
            })

          });
          $(document).on("click",".settings_wrapper .setting_group .setting_wrapper .detail #nodejs_test",function(e){

            window.bof_modal.create({
              class: "no_groups",
              title: "Testing Node.js",
              content: "<div id='yt_test_result'><p>Starting the test ....</p></div>"
            });

            window.becli.exe({
              endpoint: "nodejs_test",
              post: {
                path: $(document).find("input[name='nodejs_path']").val(),
              },
              callBack: function( sta, data ){
                for ( var i=0; i<data.messages.length; i++ ){
                  $(document).find("#yt_test_result").append("<p>"+data.messages[i]+"</p>");
                }
              }
            })

          });
        },
        unloading: function(){
          $(document).off("click",".settings_wrapper .setting_group .setting_wrapper .detail #ffmpeg_test");
          $(document).off("click",".settings_wrapper .setting_group .setting_wrapper .detail #ffmpeg_static_test");
          $(document).off("click",".settings_wrapper .setting_group .setting_wrapper .detail #yt_test");
          $(document).off("click",".settings_wrapper .setting_group .setting_wrapper .detail #nodejs_test");
        }
      },
      __sb_family: "setting",

    },
    player_setting: {

      title: "Player Setting",
      url: "^player_setting$",
      link: "player_setting",
      theme_file: "parts/content_setting",
      theme_args: {},
      becli: [
        {
          key: "setting",
          endpoint: "bofAdmin/setting/player/"
        }
      ],
      events: {},
      __sb_family: "setting",

    },
    general_setting: {

      title: "General Setting",
      url: "^general_setting$",
      link: "general_setting",
      theme_file: "parts/content_setting",
      theme_args: {},
      becli: [
        {
          key: "setting",
          endpoint: "bofAdmin/setting/general/"
        }
      ],
      events: {},
      __sb_family: "setting",

    },
    cronjob_setting: {

      title: "Cronjob Setting",
      url: "^cronjob_setting$",
      link: "cronjob_setting",
      theme_file: "parts/content_setting",
      theme_args: {},
      becli: [
        {
          key: "setting",
          endpoint: "bofAdmin/setting/cronjob/"
        }
      ],
      events: {},
      __sb_family: "setting",

    },

    // Setting ( content )
    blacklists: {

      title: "Blacklists",
      url: "^blacklists$",
      link: "blacklists",
      theme_file: "parts/content_table",
      theme_args: {},
      becli: [
        {
          key: "content",
          endpoint: "bofAdmin/list/blacklist/?\$bof ? urlData^url^query_s\$"
        }
      ],
      events: {},
      __sb_family: "setting",

    },

    storages: {

      title: "Storage Servers",
      url: "^storages$",
      link: "storages",
      theme_file: "parts/content_table",
      theme_args: {},
      becli: [
        {
          key: "content",
          endpoint: "bofAdmin/list/storage/?\$bof ? urlData^url^query_s\$"
        }
      ],
      events: {
        ready: function(){
          $(document).on( "click", "#test_storage", function(e){
            var id = $(this).data("id");
            window.bof_modal.create({
              title: "Testing storage",
              content: "<br>Starting ... <br><br>Uploading an image to this storage for testing. Don't do anything and just wait please ...",
            });
            window.becli.exe({
              endpoint: "storage_test",
              post: {
                ID: id
              },
              callBack: function( sta, data ){
                if ( sta ){
                  $(document).find(".modal .content").append("<div class='ok' style='margin-top:10px;'>Upload went okay! Check this url, if you can see the robot then storage is all set, otherwise you need to configure web-address: <br><br><a style='margin-top:20px;color:rgb(var(--c_green))' href='"+data.messages[0]+"' target='_blank'>"+data.messages[0]+"</a></div>");
                } else {
                  $(document).find(".modal .content").append("<div class='err' style='margin-top:10px;color:rgb(var(--c_red));font-weight:bold'>"+data.messages[0]+"</div>");
                }
              }
            })
          });
        },
        unloading: function(){
          $(document).off( "click", "#test_storage" );
        }
      },
      __sb_family: "setting",

    },
    storage: {

      title: "Storage Server",
      url: "^storage\/(.*?)$",
      link: "storage",
      link_par: "storages",
      theme_file: "parts/content_single",
      theme_args: {},
      becli: [
        {
          key: "entity",
          endpoint: "bofAdmin/object/storage/?IDs=\$bof ? urlData^url^match^0\$&\$bof ? urlData^url^query_s\$"
        }
      ],
      events: {},
      __sb_family: "setting",

    },
    files:{

      title: "File list",
      url: "^files$",
      link: "files",
      theme_file: "parts/content_table",
      theme_args: {},
      becli: [
        {
          key: "content",
          endpoint: "bofAdmin/list/file/?\$bof ? urlData^url^query_s\$"
        }
      ],
      events: {},
      __sb_family: "setting",

    },
    file: {

      title: "File",
      url: "^file\/(.*?)$",
      link: "file",
      link_par: "files",
      theme_file: "parts/content_single",
      theme_args: {},
      becli: [
        {
          key: "entity",
          endpoint: "bofAdmin/object/file/?IDs=\$bof ? urlData^url^match^0\$&\$bof ? urlData^url^query_s\$"
        }
      ],
      events: {},
      __sb_family: "setting",

    },
    page: {

      title: "Page Builder",
      url: "^page\/(.*?)$",
      link: "page",
      link_par: "pages",
      theme_file: "pages/page_builder",
      theme_args: {},
      becli: [
        {
          key: "entity",
          endpoint: "bofAdmin/object/page/?IDs=\$bof ? urlData^url^match^0\$&\$bof ? urlData^url^query_s\$"
        }
      ],
      events: {
        displaying: function(){

          if ( window.ui.page.curr().data.becli.entity.theme_extra ){
            if ( window.ui.page.curr().data.becli.entity.theme_extra.js ){
              for ( var i=0; i<window.ui.page.curr().data.becli.entity.theme_extra.js.length; i++ ){
                var _js = window.ui.page.curr().data.becli.entity.theme_extra.js[i];
                window.app._extension_new( _js.name, _js, true ).done(function(){
                  window[ _js.name ].displaying();
                });
              }
            }
            if ( window.ui.page.curr().data.becli.entity.theme_extra.css ){
              for ( var i=0; i<window.ui.page.curr().data.becli.entity.theme_extra.css.length; i++ ){
                var _css = window.ui.page.curr().data.becli.entity.theme_extra.css[i];
                window.app._extension_new( _css.name, _css, true )
              }
            }
          }

          $(document).on( "click", "#item_features .btn-primary", function(){
            window.app.pages.page.funcs.feature.edit_start("new");
          } )

          $(document).on( "modal_created", function( e,t ){
            if ( t.inputs ? Object.keys( t.inputs ).indexOf( "features" ) > -1 : false ){
              window.app.pages.page.funcs.feature.build();
            }
          } )

          $(document).on( "click", "#item_features .fts .ft .ft_buttons .btn.edit", function(){

            var ft_id = $(this).parents(".ft").data("ft-id");
            window.app.pages.page.funcs.feature.edit_start( ft_id );

          } )

          $(document).on( "click", "#item_features .fts .ft .ft_buttons .btn.delete", function(){

            var ft_id = $(this).parents(".ft").data("ft-id");

            var ftData = $(document).find("#item_features input[name=features]").val();
            if ( !ftData ) ftData = {};
            else ftData = JSON.parse( decodeURIComponent( ftData ) );

            delete ftData[ ft_id ];

            $(document).find("#item_features input[name=features]").val( encodeURIComponent( JSON.stringify( ftData ) ) );

            window.app.pages.page.funcs.feature.build();

          } )

          var _p = $.Deferred();
          $.when(
            window.app._extension( "bof_content_single" ),
            window.app._extension( "bof_pageBuilder" ),
            window.app._extension( "editorjs" )
          ).done(function(){
            window.bof_pageBuilder.displaying().done(function(){
              _p.resolve();
            });
          });
          return _p;

        },
        ready: function(){

          window.bof_content_single.ready();
          window.bof_pageBuilder.ready();

          if ( window.ui.page.curr().data.becli.entity.theme_extra ){
            if ( window.ui.page.curr().data.becli.entity.theme_extra.js ){
              for ( var i=0; i<window.ui.page.curr().data.becli.entity.theme_extra.js.length; i++ ){
                var _js = window.ui.page.curr().data.becli.entity.theme_extra.js[i];
                window.app._extension_new( _js.name, _js, true ).done(function(){
                  if ( window[ _js.name ]["ready"] )
                  window[ _js.name ].ready();
                });
              }
            }
          }

        },
        unloading: function(){

          $(document).off( "click", "#item_features .btn-primary" )
          $(document).off( "modal_created", function( e,t ){
            if ( t.inputs ? Object.keys( t.inputs ).indexOf( "features" ) > -1 : false ){
              window.app.pages.page.funcs.feature.build();
            }
          } )
          $(document).off( "click", "#item_features .fts .ft .ft_buttons .btn.edit" )
          $(document).off( "click", "#item_features .fts .ft .ft_buttons .btn.delete" )

          window.bof_content_single.unloading();
          window.bof_pageBuilder.unloading();
          if ( window.ui.page.curr().data.becli.entity.theme_extra ){
            if ( window.ui.page.curr().data.becli.entity.theme_extra.js ){
              for ( var i=0; i<window.ui.page.curr().data.becli.entity.theme_extra.js.length; i++ ){
                var _js = window.ui.page.curr().data.becli.entity.theme_extra.js[i];
                window.app._extension_new( _js.name, _js, true ).done(function(){
                  window[ _js.name ].unloading();
                });
              }
            }
          }
        }
      },
      funcs:{
        feature: {
          build: function(){

            var ftData = $(document).find("#item_features input[name=features]").val();
            if ( !ftData ) ftData = {};
            else ftData = JSON.parse( decodeURIComponent( ftData ) );

            if ( ftData ){
              var html = "<div class='fts'>";
              for ( var i=0; i<Object.keys(ftData).length; i++ ){
                var ft_k = Object.keys(ftData)[i];
                var ft = ftData[ ft_k ];
                html += "<div class='ft' data-ft-id='"+ft_k+"'>\
                  <div class='ft_title'>"+ft.title+"</div>\
                  <div class='ft_desc'>"+ft.text+"</div>\
                  <div class='ft_buttons'>\
                    <div class='btn btn-secondary edit'>Edit</div>\
                    <div class='btn btn-secondary delete'>Delete</div>\
                  </div>\
                </div>";
              }
              html += "</div>";
              $(document).find("#ft_list").html( html );
            }

          },
          edit_start: function( $ID ){

            var ftData = $(document).find("#item_features input[name=features]").val();
            if ( !ftData ) ftData = {};
            else ftData = JSON.parse( decodeURIComponent( ftData ) );

            var _data = {};
            if ( ftData ? ftData[ $ID ] : false )
            _data = ftData[ $ID ];

            var $inputs = {
              icon: {
                label: "Icon",
                tip: "Visit <a href='https://materialdesignicons.com/' target='_blank'>materialdesignicons.com</a>, copy name of chosen icon and paste it here. Example: star",
                input: {
                  type: "text",
                  name: "icon",
                  value: _data.icon ? _data.icon : ""
                }
              },
              title: {
                label: "Title",
                input: {
                  type: "text",
                  name: "title",
                  value: _data.title ? _data.title : ""
                }
              },
              text: {
                label: "Description",
                input: {
                  type: "textarea",
                  name: "text",
                  value: _data.text ? _data.text : ""
                }
              }
            };

            var Langs = window.ui.page.curr().data.becli.entity.indexed_non_default_langs;

            if ( Langs && Langs.length ){
              for ( var i=0; i<Langs.length; i++ ){
                var Lang = Langs[i];
                $inputs["title_"+Lang.code2] = {
                  label: "Title - " + Lang.name,
                  input: {
                    type: "text",
                    name: "title_"+Lang.code2,
                    value: _data["title_"+Lang.code2] ? _data["title_"+Lang.code2] : ""
                  }
                }
                $inputs["text_"+Lang.code2] = {
                  label: "Description - " + Lang.name,
                  input: {
                    type: "textarea",
                    name: "text_"+Lang.code2,
                    value: _data["text_"+Lang.code2] ? _data["text_"+Lang.code2] : ""
                  }
                }
              }
            }

            window.bof_modal.create({
              layer: 2,
              title: "test",
              inputs: $inputs,
              buttons: [
                [ "btn-primary", $ID == "new" ? "Add" : "Edit", "window.app.pages.page.funcs.feature.edit_finalize(\""+ $ID +"\")" ]
              ]
            })

          },
          edit_finalize: function( $ID ){

            var ftData = $(document).find("#item_features input[name=features]").val();
            if ( !ftData ) ftData = {};
            else ftData = JSON.parse( decodeURIComponent( ftData ) );

            var modalData = window.bof_modal.get(true,".modal.layer_2");

            if ( $ID == "new" ){
              ftData[ window._g.uniqid(8) ] = modalData;
            }
            else{
              ftData[ $ID ] = modalData;
            }

            $(document).find("#item_features input[name=features]").val( encodeURIComponent( JSON.stringify( ftData ) ) );
            window.app.pages.page.funcs.feature.build();

            window.bof_modal.close();

          }
        }
      },
      __sb_family: "page_builder",

    },
    pages: {

      title: "Pages",
      url: "^pages$",
      link: "pages",
      theme_file: "parts/content_table",
      theme_args: {},
      becli: [
        {
          key: "content",
          endpoint: "bofAdmin/list/page/?\$bof ? urlData^url^query_s\$"
        }
      ],
      events: {
        ready: function(){

          $( document ).on( "click", ".bof_dropdown ul li a#export", function(e){
            window.becli.exe({
              endpoint: "bofAdmin/object/page/?bof=submitting&IDs=" + $(this).data("id"),
              post: {
                __action: "export"
              },
              callBack: function( sta, data ){
                if ( sta && data.json ){
                  window.bof_modal.create({
                    title: "Exporting PageBuilder",
                    content: "<br>Copy this code & paste it in destination PageBuilder<br><br><textarea style='width: calc( 100% - 20px );background: rgba(var(--theme_color),0.07);border: none;min-height: 100px;color: rgb(var(--theme_color));padding: 10px;border-radius: 5px; font-size:8pt; line-height: 1'>_BOF_PAGEBUILDER_"+ data.json +"</textarea>",
                  });
                }
              }
            });
          } );
          $( document ).on( "click", ".content_table_wrapper .table_buttons #import_btn", function(e){

            window.bof_modal.create({
              class: "mut import",
              title: "Import",
              inputs: {
                ppc: {
                  title: "The code",
                  input: {
                    type: "textarea",
                    name: "ppc",
                    placeholder: "_BOF_PAGEBUILDER_"
                  },
                  group: "a"
                }
              },
              buttons: [
                [ "btn-primary", "Import", "window.app.pages.pages.import()" ]
              ],
            });

          } );
          $( document ).on( "click", ".content_table_wrapper .table_buttons #predesigned_btn", function(e){

            var pre_designs = window.ui.page.curr().data.becli.content._pre_designs;
            var pre_designs_html = "";

            if ( Object.keys( pre_designs ).length ){
              pre_designs_html += "<div class='_pds'>";
              for ( var i=0; i<Object.keys( pre_designs ).length; i++ ){
                var pre_design_code = Object.keys( pre_designs )[i];
                var pre_design_data = pre_designs[ pre_design_code ];
                pre_designs_html += "<div class='_pd'>";
                  pre_designs_html += "<div class='_pd_ch' style='background-image:url(\""+ pre_design_data.image +"\")'></div>";
                  pre_designs_html += "<div class='_pd_n'>"+pre_design_data.name+"</div>";
                  pre_designs_html += "<div class='_pd_btns'>\
                    <a class='btn btn-primary' onClick='window.app.pages.pages.import_pd(\""+pre_design_code+"\",this)'>Install</a>\
                    <a class='btn btn-secondary' href='"+pre_design_data.demo+"'>Demo</a>\
                  </div>";
                pre_designs_html += "</div>";
              }
              pre_designs_html += "</div>";
            } else {
              pre_designs_html = "<div class='nada'>No custom-designed pages found! Use another theme?</div>";
            }

            window.bof_modal.create({
              class: "mut import",
              title: "Custom-designed Pages",
              content: pre_designs_html,
            });

          } );

          $( document ).find( ".content_table_wrapper .table_buttons .btn-primary.show" ).text( "+ Design new page" );
          $( document ).find( ".content_table_wrapper .table_buttons .group_buttons" ).after( '<a class="btn btn-secondary show" id="import_btn" style="margin-left:0">+ Import pre-designed page</a>' );
          $( document ).find( ".content_table_wrapper .table_buttons .group_buttons" ).after( '<div style="height:5px"></div>' );
          $( document ).find( ".content_table_wrapper .table_buttons .group_buttons" ).after( '<a class="btn btn-secondary show" id="predesigned_btn" style="margin-left:0">+ Install custom-designed page</a>' );
          $( document ).find( ".content_table_wrapper .table_buttons .group_buttons" ).after( '<div style="height:5px"></div>' );

        },
        unloading: function(){

          $( document ).off( "click", ".bof_dropdown ul li a#export" );
          $( document ).off( "click", ".content_table_wrapper .table_buttons #import_btn" );
          $( document ).off( "click", ".content_table_wrapper .table_buttons #predesigned_btn" );

        },
      },
      import_pd: function( $code, $btnDom ){

        window.app.ui.becli.exe(
          "button",
          {
            dom: $($btnDom),
          },
          {
            endpoint: "pageBuilder_pre_design",
            reload_after: false,
            post: {
              code: $code
            },
            c_callback: function( sta, data, $args ){

              if ( sta ){
                window.bof_modal.close();
                window.ui.link.navigate("page/"+data.pageID);
              } else {
                window.bof_modal.close();
                window.app.ui.becli.alert(false,data.messages[0]);
              }
            }
          }
        );

      },
      import: function(){

        var json = $(document).find(".modal.import textarea").val();
        if ( !json ? true : json.substr( 0, "_BOF_PAGEBUILDER_".length ) !== "_BOF_PAGEBUILDER_" ){
          alert("invalid code");
          return;
        }

        json = json.substr( "_BOF_PAGEBUILDER_".length );

        try {
          JSON.parse( json );
        } catch (e) {
          alert("invalid code");
          return false;
        }

        window.app.ui.becli.exe(
          "button",
          {
            dom: $(document).find( ".modal .buttons .btn-primary" ),
          },
          {
            endpoint: "pageBuilder_import",
            reload_after: false,
            post: {
              json: json
            },
            c_callback: function( sta, data, $args ){

            }
          }
        );

      },
      __sb_family: "setting",

    },
    menu: {

      title: "Menu Builder",
      url: "^menu\/(.*?)$",
      link: "menu",
      link_par: "menus",
      theme_file: "pages/menu_builder",
      theme_args: {},
      becli: [
        {
          key: "entity",
          endpoint: "bofAdmin/object/menu/?IDs=\$bof ? urlData^url^match^0\$&\$bof ? urlData^url^query_s\$"
        }
      ],
      events: {
        displaying: function(){

          var _p = $.Deferred();
          $.when(
            window.app._extension( "bof_content_single" ),
            window.app._extension( "bof_menuBuilder" )
          ).done(function(){
            window.bof_menuBuilder.displaying().done(function(){
              _p.resolve();
            });
          });
          return _p;

        },
        ready: function(){
          window.bof_content_single.ready();
          window.bof_menuBuilder.ready();
        },
        unloading: function(){
          window.bof_content_single.unloading();
          window.bof_menuBuilder.unloading();
        }
      },

      __sb_family: "setting",

    },
    menus: {

      title: "Menus",
      url: "^menus$",
      link: "menus",
      theme_file: "parts/content_table",
      theme_args: {},
      becli: [
        {
          key: "content",
          endpoint: "bofAdmin/list/menu/?\$bof ? urlData^url^query_s\$"
        }
      ],
      events: {},
      __sb_family: "setting",

    },
    languages: {

      title: "Languages",
      url: "^languages$",
      link: "languages",
      theme_file: "parts/content_table",
      theme_args: {},
      becli: [
        {
          key: "content",
          endpoint: "bofAdmin/list/language/?\$bof ? urlData^url^query_s\$"
        }
      ],
      events: {},
      __sb_family: "setting",

    },
    language: {

      title: "Language",
      url: "^language\/(.*?)$",
      link: "language",
      link_par: "languages",
      theme_file: "pages/language_editor",
      theme_args: {},
      becli: [
        {
          key: "entity",
          endpoint: "bofAdmin/object/language/?IDs=\$bof ? urlData^url^match^0\$&\$bof ? urlData^url^query_s\$"
        }
      ],
      events: {
        displaying: function(){
          return window.app._extension( "bof_content_single" )
        },
        ready: function(){

          if ( window.ui.page.curr().data.becli.entity.request.type == "new" ){
            window.bof_content_single.ready();
          }
          else {

            $(document).on("change",".lang_table_wrapper input",function(e){

              var key = $(this).attr("name");
              var val = $(this).val();

              window.app.ui.becli.exe( "alert", {
              }, {
                reload_after: false,
                endpoint: "bofAdmin/object/language/?bof=submitting&IDs=" + window.ui.page.curr().data.becli.entity.request.IDS[0],
                post: {
                  __action: "translate",
                  key: key,
                  val: val
                }
              } );

            });

          }

        },
        unloading: function(){

          if ( window.ui.page.curr().data.becli.entity.request.type == "new" ){
            window.bof_content_single.unloading();
          }
          else {
            $(document).off("change",".lang_table_wrapper input");
          }

        }
      },
      __sb_family: "setting",

    },

  },
  ui: {

    head: {
      set: function( $title ){
        $(document).find("#header .page_title").html( $title ? $title : window.ui.page.curr().args.title )
      },
      listen: function(){
        $(document).on( "click", "#header .menu .item", function(){
          if($(this).hasClass("logout")){
            window.user.loggedOut();
            setTimeout( function(){
              window.location.reload();
            }, 200 );
          } else {
          }
        } )
      },
    },
    side: {
      set: function( sb_family ){

        var curPage_sb_family = window.ui.page.curr().o_args.__sb_family;
        sb_family = sb_family ? sb_family : curPage_sb_family;

        if ( !sb_family ) return;
        if ( sb_family == window.app.cache.sb_family ){
          window.app.ui.side.highlight_current_page();
          return;
        }

        $(document).find("#sidebar .links ul li.active").removeClass("active");
        $(document).find("#sidebar .links ul li.sb_"+sb_family).addClass("active");
        window.app.cache.sb_family = sb_family;
        window.app.cache.sb_family_loaded = false;
        window.app.ui.side.load();

      },
      load: function( $hardReload ){

        if ( window.app.cache.sb_family_loaded && $hardReload !== true )
        return;

        window.app.cache.sb_family_highlight_xhr_client = window.becli.exe({
          endpoint: "highlights",
          ID: "highlights",
          liquid: true,
          post: {
            sb_family: window.app.cache.sb_family
          },
          callBack: function( sta, data, args ){
            if ( sta ){

              $(document).find("#highlights").addClass("replacing").html( data.html );
              $(document).find("#highlights > div").css("opacity","0").css("left","-150px");
              $(document).find("#highlights").removeClass("replacing");
              var highlight_elems = $(document).find("#highlights > div");

              for ( var i=0; i<highlight_elems.length; i++ ){
                var highlight_elem = highlight_elems[i];
                $(highlight_elem).delay(i*150).animate({opacity: '1', left: '0'}, 1000 );
              }

              if ( data.json ){
                for( var $i=0; $i<data.json.length; $i++ ){
                  window.app.ui.side.runJson( data.json[ $i ] );
                }
              }

              if ( data.sbs ){
                var _ls = $(document).find(".links ul li");
                if ( _ls.length ){
                  for ( var i=0; i<_ls.length; i++ ){
                    var _l = _ls[i];
                    if ( !data.sbs.includes( $(_l).attr("class").substr( 3 ).replace( "active", "" ).trim() )  ){
                      $(_l).remove();
                      console.log(data.sbs,_l);
                    }
                  }
                }
                
              }

              window.app.cache.sb_data = data;
              window.app.ui.side.highlight_current_page();

            }
          }
        }).client;

        window.app.cache.sb_family_loaded = true;

      },
      runJson: function( $data ){

        if ( $data.action == "graph" ){

          window.app._extension("bof_graph").done(function(){
            window.bof_graph.load_am5chart().done(function(){
              window.bof_graph[ $data.graph_type ]( $data.id, $data.graph_data );
            });
          });

        }

      },
      highlight_current_page: function(){

        $(".section_links a.link_group.active").removeClass("active");
        $(".section_links div.link_group.opened").removeClass("opened");
        $(".section_links div.link_group a.active").removeClass("active");

        var pageLink = window.ui.page.curr().args.link;

        if ( window.ui.page.curr().args.urlData )
        pageLink = window.ui.page.curr().args.urlData.url.full;

        if ( window.ui.page.curr().args.link_par )
        pageLink = window.ui.page.curr().args.link_par

        if ( !pageLink ) return;

        var parentLinks = $(".section_links a.link_group");
        for( var i=0; i<parentLinks.length; i++ ){
          var parentLink = $( parentLinks[ i ] );
          if ( parentLink.attr( "href" ) == pageLink ){
            parentLink.addClass("active");
            return;
          }
        }

        var parentsWithLinks = $(".section_links div.link_group");
        for( var i=0; i<parentsWithLinks.length; i++ ){
          var parentWithLinks = $( parentsWithLinks[i] );
          var parentWithLinksLinks = parentWithLinks.find("a");
          for( var z=0; z<parentWithLinksLinks.length; z++ ){
            var link = $( parentWithLinksLinks[z] );
            if ( link.attr( "href" ) == pageLink ){
              parentWithLinks.addClass("opened");
              link.addClass("active");
              return;
            }
          }
        }

        for( var i=0; i<parentsWithLinks.length; i++ ){
          var parentWithLinks = $( parentsWithLinks[i] );
          var parentWithLinksLinks = parentWithLinks.find("a");
          for( var z=0; z<parentWithLinksLinks.length; z++ ){
            var link = $( parentWithLinksLinks[z] );
            if ( link.attr( "href" ).split( "?" )[ 0 ] == pageLink.split( "?" )[ 0 ] ){
              parentWithLinks.addClass("opened");
              link.addClass("active");
              return;
            }
          }
        }

      },
      unload: function(){

        if( window.app.cache.sb_family_highlight_xhr_client )
        window.app.cache.sb_family_highlight_xhr_client.abort();

        var highlight_elems = $(document).find("#highlights > div");
        for ( var i=0; i<highlight_elems.length; i++ ){
          var highlight_elem = highlight_elems[i];
          $(highlight_elem).delay(i*150).animate({opacity: '0', left: '150'}, 1000 );
        }

      }
    },
    css: {
      get_var: function( $name ){
        let style = getComputedStyle(document.body);
        return style.getPropertyValue('--'+$name).trim();
      },
      get_color: function( $name, $opacity ){
        $opacity = $opacity === undefined || $opacity === null ? 1 : $opacity;
        return "rgba( "+ window.app.ui.css.get_var( $name ) +", "+ $opacity +" )"
      }
    },
    becli: {
      __cache: { alert: {} },
      exe: function( $type, $typeArgs, $args ){

        var ID = window._g.uniqid();

        return window.becli.exe(
          $.extend(
            $args,
            {
              ID: "ui_action",
              callBefore: window.app.ui.becli._before,
              callBefore_param: {
                ID: ID,
                type: $type,
                typeArgs: $typeArgs
              },
              callBack: window.app.ui.becli._after,
              callBack_param: {
                ID: ID,
                type: $type,
                typeArgs: $typeArgs
              }
            }
          )
        );

      },
      alert: function( $sta, $text ){

        var ID = window._g.uniqid();
        window.app.ui.becli._before({
          args: {
            callBefore_param: {
              type: "alert",
              ID: ID,
            }
          }
        });

        window.app.ui.becli._after( $sta, {
          messages: [ $text ]
        }, {
          callBack_param: {
            type: "alert",
            ID: ID
          },
          args: {
            reload_after: false
          }
        } );

      },
      _before: function( $args ){

        var display_args = $args.args.callBefore_param;
        if ( display_args.type == "button" ){
          if ( display_args.typeArgs.dom.hasClass("bof_processing") ) return "BOF_HALT"
          display_args.typeArgs.dom.removeClass("bof_done").removeClass("bof_fail").addClass("bof_processing").attr("disabled","disabled")
        }
        else if ( display_args.type == "alert" ){
          $(document).find("body").append("<div class='bof_alert sta_loading unshown ID_"+$args.args.callBefore_param.ID+"'>\
            <span class='material-symbols-outlined _icon'></span>\
            <span class='text'>Processing ...</span>\
          </div>");
          window.app.ui.becli.__cache.alert[ $args.args.callBefore_param.ID ] = "loading";
          window.app.ui.becli._alert_sort();
        }

        $(document).find(".bof_input.failed").removeClass("failed");
        $(document).find(".setting_wrapper.failed").removeClass("failed");
        $(document).find(".setting_wrapper .error").remove();

      },
      _after: function( sta, data, $args ){

        var display_args = $args.callBack_param;


        if ( $args["args"]["c_callback"] ){
          var $cb_exe = $args["args"]["c_callback"]( sta, data, $args );
          console.log( $cb_exe );
          if ( $cb_exe === "HALT" )
          return;
        }

        if ( display_args.type == "button" ){

          display_args.typeArgs.dom.removeClass("bof_processing").addClass( sta ? "bof_done" : "bof_fail" ).attr("disabled",false).text( data.messages[0] );

          if ( !sta ? data.bad_inputs : false ){

            for ( var i=0; i<data.bad_inputs.length; i++ ){
              $(document).find(".bof_input[name="+data.bad_inputs[i]+"]").addClass("failed");
              $(document).find(".setting_wrapper#item_"+data.bad_inputs[i]).addClass("failed");
              if( data.inputs.report.fail[data.bad_inputs[i]] ){
                $(document).find(".setting_wrapper#item_"+data.bad_inputs[i]).append("<div class='error'>"+ data.inputs.report.fail[data.bad_inputs[i]]+"</div>")
              }
            }

            var theBadInput = data.bad_inputs[0];
            var theBadInputClasses = $(document).find(".setting_wrapper#item_"+theBadInput).attr("class").split(" ");
            for ( var z=0; z<theBadInputClasses.length; z++ ){
              var theBadInputClass = theBadInputClasses[z];
              if ( theBadInputClass.substr( 0, 6 ) == "group_" ){
                var theBadInputGroup = theBadInputClass.substr( 6 );
              }
            }

            if ( theBadInputGroup ){
              $(document).find(".settings_wrapper ._groups ._group[data-id='"+theBadInputGroup+"']").click();
            }

            document.getElementById("item_"+theBadInput).scrollIntoView();

          }
          else if ( sta ) {

            if ( data.redirect )
            window.ui.link.navigate( data.redirect );

            else if ( $args.args.reload_after !== false )
            window.ui.page.reload();

          }

        }
        else if ( display_args.type == "alert" ){

          var requestID = $args.callBack_param.ID;
          $(document).find(".bof_alert.ID_"+requestID).removeClass("sta_loading").addClass( sta ? "sta_done" : "sta_failed" ).find( ".text" ).text( data["messages"][0] )
          window.app.ui.becli.__cache.alert[ requestID ] = sta ? "done" : "failed";
          window.app.ui.becli._alert_sort();

          if ( sta && $args.args.reload_after !== false ){
            window.ui.page.reload();
          } else {
            setTimeout( function(){
              $(document).find(".bof_alert.ID_"+requestID).remove();
              delete window.app.ui.becli.__cache.alert[ requestID ];
              window.app.ui.becli._alert_sort();
            }, 10000 );
          }

        }

      },
      _alert_sort: function(){

        var alerts = window.app.ui.becli.__cache.alert;
        var alerts_heights = 0;
        for ( var i=Object.keys( alerts ).length; i>=0; i=i-1 ){
          var alert_id = Object.keys( alerts )[i-1];
          var alert_dom = $(document).find(".bof_alert.ID_"+alert_id);
          alert_dom.css( "bottom", alerts_heights + 20 + "px" );
          alerts_heights += alert_dom.outerHeight() + 10;
        }

      },
      _alert_reset: function(){
        window.app.ui.becli.__cache.alert = {};
         $(document).find(".bof_alert").remove();
      }
    },
    light_mode: function( value, $reload ){

      value = value !== undefined && value !== null ? value : !window.app.cache.light_mode;
      window.app.cache.light_mode = value;
      window.cache.set( "light_mode", value )

      if ( !value )
      window.ui.body.addClass( "dark", true );

      else
      window.ui.body.removeClass( "dark", true );

      if ( $reload !== false ){
        window.ui.page.reload();
        window.app.ui.side.unload();
        window.app.ui.side.load( true );
      }

    },
    icon_auto_bg_color: function(){

      var autoIcons = $(".icon.bg_auto");
      var colors = [ "orange", "purple", "blue", "red", "green", "yellow" ];
      for( var i=0; i<autoIcons.length; i++ ){
        var autoIcon = autoIcons[i];
        $(autoIcon).removeClass("bg_auto").addClass("bg_"+colors[i%colors.length])
      }

    },

  },

  _extension_new: function( $name, $args, $loadAfter ){

    if ( !Object.keys( window.app._pre_defined_extensions ).includes( $name ) )
    window.app._pre_defined_extensions[ $name ] = $args;

    if ( $loadAfter )
    return window.app._extension( $name );

  },
  _extension: function( $name, $async ){

    var _extension_links = window.app._pre_defined_extensions[ $name ];
    if ( !_extension_links ){
      window.bof.log( "Extension " + $name + " is not introduced", 99 );
      return;
    }

    var promiseToLoadExtension = $.Deferred();

    if ( window.app.cache.extensions.includes( $name ) ){
      promiseToLoadExtension.resolve();
      return promiseToLoadExtension;
    }

    if ( Array.isArray( _extension_links ) ){

      if ( $async === true ){
        window.app._extensions_async( _extension_links ).done(function(){
          promiseToLoadExtension.resolve();
          window.app.cache.extensions.push( $name );
        }).fail(function(){
          promiseToLoadExtension.reject();
        })
      }
      else {
        var _array_promises = [];
        for ( var i=0; i<_extension_links.length; i++ ){
          var _extension_link = _extension_links[i];
          var _extension_link_exe = _extension_link.type == "js" ? window.bof._loadExtension( _extension_link ) : window.bof._loadCSS( _extension_link );
          _array_promises.push( _extension_link_exe );
        }
        $.when.apply( $, _array_promises ).done(function(){
          promiseToLoadExtension.resolve();
          window.app.cache.extensions.push( $name );
        }).fail(function(){
          promiseToLoadExtension.reject();
        })
      }

    }
    else {

      var _exe = _extension_links.type != "css" ? window.bof._loadExtension( _extension_links ) : window.bof._loadCSS( _extension_links );

      _exe.done(function(){
        promiseToLoadExtension.resolve();
        window.app.cache.extensions.push( $name );
      }).fail(function(){
        promiseToLoadExtension.reject();
      })

    }

    return promiseToLoadExtension;

  },
  _extensions_async: function( $array, $promise ){

    $promise = $promise ? $promise : $.Deferred();
    var $item = $array.shift();
    var $item_exe = $item.type == "js" ? window.bof._loadExtension( $item ) : window.bof._loadCSS( $item );
    $item_exe.done(function(){
      if ( $array.length ) window.app._extensions_async( $array, $promise );
      else $promise.resolve();
    }).fail(function(){
      $promise.reject();
    });
    return $promise;

  },
  getConfig: function(){

    var promise = $.Deferred();
    window.becli.exe({
      endpoint: "client_config",
      liquid: true,
      callBack: function( sta, data ){

        if ( sta ){

          if ( data["pages"] ){
            for( var i=0; i<Object.keys(data["pages"]).length; i++ ){

              var pageName = Object.keys(data["pages"])[i];
              var pageArgs = data["pages"][ pageName ];

              pageArgs.events = pageArgs.events ? pageArgs.events : {};

              if ( !Object.keys( window.app.pages ).includes( pageName ) )
              window.app.pages[ pageName ] = pageArgs;

            }
          }

          if ( data["setting"] )
          window.app.config = data.setting;

          if ( data["_ic"] && window.user.logged() )
          setTimeout( function(){
            window.bof_modal.create({
              title: "Invalid Certificate",
              content: "<br><br>Hi there,<br><br>Seems like you are using RKHM with invalid certificate.<br><br>We'll allow you to close this modal & continue using the script normally<br><br>About 5 years of my youth has gone into this project, please consider doing the right thing & support the project by purchasing the script.<br><br>In return you'll get free updates, dedicated support and a ton of automation features<br><br>",
              class: "opm",
              buttons: [
                [ "btn-primary", "Purchase on Envato", "window.open(\"https://codecanyon.net/item/digimuse-music-streaming-platform/29217970\", \"_blank\").focus()" ]
              ]
            });
          }, 10*1000 );

          var hasAppends = [];
          if ( data["setting"]["append"] ? data["setting"]["append"]["js"] : false ){
            for ( var ii=0; ii<data["setting"]["append"]["js"].length; ii++ ){
              hasAppends.push( window.bof._loadExtension( data["setting"]["append"]["js"][ii] ) )
            }
          }
          if ( data["setting"]["append"] ? data["setting"]["append"]["css"] : false ){
            for ( var ii=0; ii<data["setting"]["append"]["css"].length; ii++ ){
              hasAppends.push( window.bof._loadCSS( data["setting"]["append"]["css"][ii] ) )
            }
          }

          if ( !hasAppends.length ){
            promise.resolve();
          } else {
            $.when.apply( $, hasAppends ).done(function(){
              promise.resolve();
            });
          }
        }
        else {
          promise.reject();
        }


      }
    })
    return promise;

  },

};
