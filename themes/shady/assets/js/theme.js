"use strict";

window.theme = {

  run: function(){

    $(document).on( "ui_page_event", function( event, $args ){

      var _event = $args.event;
      var _page = $args.page;

      if ( _event == "ready" ){

        if ( window.app.config ? window.app.config.mobile : false ){
          if ( $(document).find(".d_head.t2 .detail .is").length ? $(document).find(".d_head.t2 .detail .is").offset() : false ){
            $("body #main .content .page_bg:not(.dropColor)").css( "height", Math.ceil( $(document).find(".d_head.t2 .detail .is").offset().top + $(document).find(".d_head.t2 .detail .is").outerHeight()  ) )
          } else if ( $(document).find("body.mobile .d_head .detail .buttons").length ? $(document).find("body.mobile .d_head .detail .buttons").offset() : false ) {
            $("body #main .content .page_bg:not(.dropColor)").css( "height", Math.ceil( $(document).find("body.mobile .d_head .detail .buttons").offset().top + 5 ) )
          }
        }

        if ( _page ? ( _page.theme_file ? ( _page.theme_file == "pages/_series" || _page.theme_file == "pages/_single" || _page.theme_file == "pages/_creator" ) : false ) : false ){

          if ( !window.ui.page.curr().data.becli.single.data.background_color
          && window.ui.page.curr().data.becli.single.data.cover
          && !window.ui.page.curr().data.becli.single.data.background ){

            window.bof._loadExtension({
              name: "Vibrant",
              path: "vibrant.min.js",
              base: "https://cdn.jsdelivr.net/npm/node-vibrant@3.1.5/dist/",
              dir: "",
              skipNameCheck: true,
            }).done(function(){

              var path = window.ui.page.curr().data.becli.single.data.cover.split("src=\"")[1].split("\"")[0];
              var __mp = 0;
              var color = null;
              Vibrant
              .from( path + ( path.includes("?bof=") ? "" : ( ( path.includes("?") ? "&" : "?" ) + "bof=dont_cache" ) ) )
              .quality( 5 )
              .getPalette( function(err, palette) {
                if ( !err && palette ){
                  for( var i=0; i<Object.keys(palette).length; i++ ){

                    var palette_i_key = Object.keys(palette)[i];
                    var pallete_i = palette[ palette_i_key ];

                    if ( pallete_i.population > __mp ){
                      __mp = pallete_i.population;
                      color = pallete_i.rgb.join( ", " )
                    }

                  }
                  $(document).find(".page_bg.colorOnly").css("background-color","rgb("+color+")")
                }
                else {
                  console.log( err );
                }
              });

            });

          }

          $("body #main .content .page_bg.colorOnly.dropColor").css( "top", $("body #main .content .page_bg.colorOnly:not(.dropColor)").height() + parseInt( $("body #main .content .page_bg.colorOnly:not(.dropColor)").css("top") ) + "px" )

        }
        if ( _page ? ( _page.object ? _page.object == "page" : false ) : false ){

          try {
            if ( window.ui.page.curr().data.becli.single.page.classes.includes( "_cd_bigslider" ) ){
              window.theme.pre_designs.hook("bigslider");
            }
            if ( window.ui.page.curr().data.becli.single.page.classes.includes( "_cd_vs" ) ){
              window.theme.pre_designs.hook("vertical_slider");
            }
          } catch( $err ){
          }

        }

        if ( $(document).find(".widget.desc").length ){
          if ( $(document).find(".widget.desc .html_wrapper .editorjs_html_wrapper").height() > 140 )
          $(document).find(".widget.desc").addClass("shorten").find(".html_wrapper").append("<div class='shorten_more'>"+window.lang.return( "more", { ucfirst: true } )+"</div>");
        }

      }
      else if ( _event == "unloading" ){
        window.theme.pre_designs.unhook();
      }

    } );
    $(document).on( "click", ".widget.desc .widget_content .shorten_more", function(){
      if ( $(document).find(".widget.desc").hasClass("shorten_opened") ){
        $(document).find(".widget.desc").removeClass("shorten_opened").find(".shorten_more").text( window.lang.return( "more", { ucfirst: true } ) );
      } else {
        $(document).find(".widget.desc").addClass("shorten_opened").find(".shorten_more").text( window.lang.return( "less", { ucfirst: true } ) );
      }
    } )


  },
  pre_designs: {

    active: null,
    hook: function( $name ){
      window.theme.pre_designs.active = $name;
      window.theme.pre_designs[ $name ].hook();
    },
    unhook: function(){
      if ( window.theme.pre_designs.active ){
        window.theme.pre_designs[ window.theme.pre_designs.active ].unhook();
        window.theme.pre_designs.active = null;
      }
    },
    bigslider: {
      timer: null,
      timer2: null,
      i: null,
      total: 3,
      hook: function(){
        this.total = $(document).find("body._cd_bigslider.object_n_page .grid.i0 .cols_4_4_4 .col .widget").length;
        this.startSliding(true);
        $(window).on( 'blur', function() {
          clearTimeout(window.theme.pre_designs.bigslider.timer);
          clearTimeout(window.theme.pre_designs.bigslider.timer2);
          this.timer = null;
          this.timer2 = null;
        } );
        $(window).on( 'focus', function() {
          window.theme.pre_designs.bigslider.startSliding();
        } );
      },
      startSliding: function($ini){

        if ( $ini ){
          this.i = this.total;
        }

        var newId = ( this.i % this.total ) + 1 ;

        if ( !$ini )
        this.slideOut( $(document).find("body._cd_bigslider.object_n_page .grid.i0 .cols_4_4_4 .col.active") );

        if ( !window.app.config.mobile )
        $(document).find("body._cd_bigslider.object_n_page .content > .widget:last-child .widget_content .arrows .arrow.next").click();

        if ( this.timer2 )
        clearTimeout(window.theme.pre_designs.bigslider.timer2);

        this.timer2 = setTimeout( function(){
          window.theme.pre_designs.bigslider.slideIn( $(document).find("body._cd_bigslider.object_n_page .grid.i0 .cols_4_4_4 .col:nth-child("+newId+")") );
        }, 230 );

        if ( this.timer )
        clearTimeout(window.theme.pre_designs.bigslider.timer);

        this.timer = setTimeout( function(){
          window.theme.pre_designs.bigslider.startSliding();
        }, 6000  );

        this.i = this.i+1;

      },
      slideIn: function( $dom ){
        $dom.addClass("active");
        if ( !$dom.hasClass("ted") ){
          $(document).find("body._cd_bigslider.object_n_page .grid.i0 .cols_4_4_4 .col.active .html_wrapper .title")
          var _ted = $dom.find(".html_wrapper .title").text().split( " " );
          $dom.find(".html_wrapper .title").html( "<b>" + _ted[0] + "</b> " + ( _ted.length > 1 ? _ted.slice(1).join(" ") : "" ) );
          $dom.addClass("ted");
        }
        $dom.fadeIn(200);
      },
      slideOut: async function( $dom ){
        await $dom.fadeOut(200).promise();
        $dom.removeClass("active");
      },
      unhook: function(){
        try {
          clearTimeout( window.theme.pre_designs.bigslider.timer );
          clearTimeout( window.theme.pre_designs.bigslider.timer2 );
          this.timer = null;
          this.timer2 = null;
          $(window).off( 'blur', function() {
            clearTimeout(window.theme.pre_designs.bigslider.timer);
            clearTimeout(window.theme.pre_designs.bigslider.timer2);
          } );
          $(window).off( 'focus', function() {
            window.theme.pre_designs.bigslider.startSliding();
          } );
        } catch( $err ){}
      }
    },
    vertical_slider: {

      active: null,
      total: null,
      moving: false,
      touchY: false,
      touchF: false,
      timer: false,

      hook: function(){

        this.active = 0;
        this.total = $(document).find("#main .content .widget").length;

        $(document).find(".widget.i0").addClass("vs_active");
        this._createBullets();
        $(document).find("body._cd_vs .vs_bullets_wrapper .vs_bullet_wrapper.i0").addClass("vs_bullet_active");
        window.theme.pre_designs.vertical_slider._resetTimer();

        $("#main").bind('mousewheel DOMMouseScroll', function(e) {

          var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
          var direction = (e.originalEvent.deltaY>0) ? "up" : "down";

          window.theme.pre_designs.vertical_slider._direct(direction);
          return false;

        });
        $("#main").bind('touchmove', function(e) {

          if ( window.theme.pre_designs.vertical_slider.touchY ){
            if ( !window.theme.pre_designs.vertical_slider.touchF ){
              window.theme.pre_designs.vertical_slider.touchF = true;
              var direction = window.theme.pre_designs.vertical_slider.touchY - e.originalEvent.touches[0].screenY > 0 ? "up" : "down";
              window.theme.pre_designs.vertical_slider._direct( direction );
            }
          } else {
            window.theme.pre_designs.vertical_slider.touchY = e.originalEvent.touches[0].screenY;
          }

        });
        $("#main").bind('touchend', function(e) {
          window.theme.pre_designs.vertical_slider.touchY = null;
          window.theme.pre_designs.vertical_slider.touchF = false;
        });
        $(document).on("click","body._cd_vs .vs_bullets_wrapper .vs_bullet_wrapper", function(){
          var target = $(this).data("i")
          if ( target == window.theme.pre_designs.vertical_slider.active ) return;
          window.theme.pre_designs.vertical_slider._position( target, target > window.theme.pre_designs.vertical_slider.active ? "bottom" : "top" )
          window.theme.pre_designs.vertical_slider._enter( target, target > window.theme.pre_designs.vertical_slider.active ? "bottom" : "top" )
        });

      },
      unhook: function(){
        $("#main").unbind('mousewheel DOMMouseScroll');
        $("#main").unbind('touchmove');
        $("#main").unbind('touchend');
        $(document).off("click","body._cd_vs .vs_bullets_wrapper .vs_bullet_wrapper");
        try {
          clearTimeout( this.timer )
        } catch( $err ){}
      },
      _direct: function(_dir){
        if ( _dir == "up" )
        this._next();
        else
        this._prev();
      },
      _prev: function(){
        if ( this.moving || this.active==0 )
        return;
        this._position( this.active-1, "top" )
        this._enter( this.active-1, "top" )
      },
      _next: function(){
        var target = this.active+1;
        if ( this.moving )
        return;
        if ( target >= this.total )
        target = 0;
        this._position( target, "bottom" )
        this._enter( target, "bottom" )
      },
      _position: function( $targetI, $position ){
        var $targetDom = $(document).find(".widget.i"+$targetI);
        $targetDom.removeClass("vs_onTop").removeClass("vs_onBottom").addClass($position=="top"?"vs_onTop":"vs_onBottom")
      },
      _enter: function( $targetI, $from ){

        var $targetDom = $(document).find(".widget.i"+$targetI);
        this.moving = true;
        $(document).find(".widget.vs_active").removeClass("vs_active").addClass("vs_pre_active")
        $targetDom.removeClass("vs_still").addClass("vs_moving");

        $(document).find(".vs_pre_active .widget_content").fadeOut({queue: false, duration: 300 });

        setTimeout( function(){

          if ( $from == "bottom" ) $targetDom.animate({top:0},window.app.config.mobile?600:750);
          else $targetDom.animate({top:0},window.app.config.mobile?600:750);

          window.theme.pre_designs.vertical_slider._updateBullets($targetI);
          setTimeout( function(){
            $targetDom.find(".widget_content").fadeIn({queue: false, duration: 300});
            $targetDom.find(".widget_content .html_wrapper").css("top","-40px");
            $targetDom.find(".widget_content .html_wrapper").animate({ top: "0" }, 300);
            setTimeout( function(){
              window.theme.pre_designs.vertical_slider.moving = false;
              window.theme.pre_designs.vertical_slider.active = $targetI;
              $targetDom.removeClass("vs_moving").removeClass("vs_onBottom").removeClass("vs_onTop").addClass("vs_active");
              $(document).find(".vs_pre_active .widget_content").css("display","");
              $(document).find(".vs_pre_active").removeClass("vs_pre_active").css("top","").css("bottom","").addClass("vs_onTop")
              window.theme.pre_designs.vertical_slider._resetTimer();
            }, 300 );
          }, 500 );

        }, 250 );

      },
      _createBullets: function(){
        if ( !this.total ) return;
        var bulletsHTML = "<div class='vs_bullets_wrapper'>";
        for ( var i=0; i<this.total; i++ )
        bulletsHTML += "<div class='vs_bullet_wrapper i"+i+"' data-i='"+i+"'></div>";
        bulletsHTML += "</div>";
        $(document).find("#main .content").append( bulletsHTML );
      },
      _updateBullets: function(i){
        $(document).find("body._cd_vs .vs_bullets_wrapper .vs_bullet_wrapper.vs_bullet_active").removeClass("vs_bullet_active");
        $(document).find("body._cd_vs .vs_bullets_wrapper .vs_bullet_wrapper.i"+i).addClass("vs_bullet_active")
      },
      _resetTimer: function(){

        try {
          clearTimeout( this.timer )
        } catch( $err ){}

        this.timer = setTimeout( function(){
          window.theme.pre_designs.vertical_slider._next();
        }, 7*1000 );

      }

    }
  }

}

window.theme.run();