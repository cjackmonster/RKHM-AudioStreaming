"use strict";

window.muse = {

  _config: {
    _debug: true,
  },

  focus: {

    _object_type: null,
    _object_hash: null,
    _status: null,
    ui: function( reset ){

      if ( reset === true ){
        $(document).find("._play.muse_loading, ._play.muse_playing, ._play.muse_paused").find(".mdi").removeClass("mdi-refresh mdi-pause mdi-play").addClass("mdi-play");
        $(document).find(".muse_loading, .muse_playing, .muse_paused, .muse_focused").removeClass("muse_loading muse_playing muse_paused muse_focused");
      }

      var focusedItem = window.muse.focus.get();
      var hook = focusedItem.object_type + "_" + focusedItem.object_hash;

      $(document).find( ".item.bof_" + hook ).removeClass("muse_loading muse_playing muse_paused").addClass( "muse_" + focusedItem.status + " muse_focused" );

      $(document).find( "._play.bof_" + hook )
      .removeClass("muse_loading muse_playing muse_paused muse_focused").addClass( "muse_" + focusedItem.status + " muse_focused" )
      .find(".mdi").removeClass( "mdi-play mdi-pause mdi-refresh" ).addClass( focusedItem.status == "loading" ? "mdi-refresh" : ( focusedItem.status != "playing" ? "mdi-play" : "mdi-pause" ) )
      .parents("._play").find("._t").text( focusedItem.status == "loading" ? "loading" : ( focusedItem.status != "playing" ? "play" : "pause" ) );

      $(document).find( ".item.bof_" + hook + " ._play" )
      .removeClass("muse_loading muse_playing muse_paused muse_focused").addClass( "muse_" + focusedItem.status + " muse_focused" )
      .find(".mdi").removeClass( "mdi-play mdi-pause mdi-refresh" ).addClass( focusedItem.status == "loading" ? "mdi-refresh" : ( focusedItem.status != "playing" ? "mdi-play" : "mdi-pause" ) )
      .parents("._play").find("._t").text( focusedItem.status == "loading" ? "loading" : ( focusedItem.status != "playing" ? "play" : "pause" ) );

      if ( window.muse.queue._open )
      window.muse.queue.active.ui();

    },
    set: function( type, hash, status, killXhrs ){
      window.muse.log( "Focus.Ui.Set -> " + type + " " + hash + " " + status );
      window.muse.focus._object_type = type;
      window.muse.focus._object_hash = hash;
      window.muse.focus._status = status;
      window.muse.focus.ui( true );
      if ( killXhrs )
      window.muse.queue.active.killXhrs();
    },
    set_status: function( string ){
      window.muse.focus._status = string;
      window.muse.focus.ui()
    },
    get: function(){
      return {
        object_type: window.muse.focus._object_type,
        object_hash: window.muse.focus._object_hash,
        status: window.muse.focus._status
      };
    },
    get_status: function(){
      return window.muse.focus._status
    },
    null: function(){
      window.muse.focus._object_type = null;
      window.muse.focus._object_hash = null;
      window.muse.focus._status = null;
      window.muse.focus.ui( true );
    }

  },
  queue: {

    _items: {},
    _open: false,

    active: {
      _id: null,
      _xhrs: [],
      reset: function(){
        window.muse.queue.active.set( Object.keys( window.muse.queue._items )[0] );
      },
      set: function( id ){

        window.muse.queue.active._id = id;
        var Data = window.muse.queue.active.get().data;
        window.muse.focus.set( Data.ot, Data.hash, "loading", true );
        window.muse.queue.save();

      },
      get: function(){

        if ( window.muse.ads.cache ){
          return {
            ID: null,
            data: {
              ads: true,
              title: "Ads",
              sub_title: "Advertisement",
              cover: window.muse.ads.cache.banner,
              back: window.muse.ads.cache.banner,
              link: window.muse.ads.cache.url,
              preview: {
                type: "thingie",
                banner: window.muse.ads.cache.banner,
                link: window.muse.ads.cache.url
              }
            },
            source: {
              type: [
                "audio",
                {
                  address: window.muse.ads.cache.audio,
                  free: true,
                  thingie: {}
                }
              ]
            }
          };
        }

        return $.extend( window.muse.queue._items[ window.muse.queue.active._id ], { ID: window.muse.queue.active._id } );

      },
      setAsFocus: function(){

        var active = window.muse.queue.active.get();

        if ( active ? active.data : false )
        window.muse.focus.set( active.data.ot, active.data.hash, "loading", false )
        else
        window.muse.focus.null();

      },
      ui: function(){
        var activeQueID = window.muse.queue.active.get().ID
        $(document).find(".queue .data_wrapper .list ._items .item.active_que").removeClass("active_que");
        $(document).find(".queue .data_wrapper .list ._items .item#bof_queue_"+activeQueID).addClass("active_que");
      },
      addXhr: function( xhrClient ){
        this._xhrs.push( xhrClient );
      },
      killXhrs: function(){

        window.muse.log( "Killing Xhrs" );

        var xhrs = $.extend( [], this._xhrs );

        if ( !xhrs ? true : !xhrs.length )
          return;

        xhrs.forEach( ( xhr ) => {
          if ( xhr.state() == "pending" ){
            xhr.abort();
          }
        } )

        this._xhrs = [];

      }
    },

    ini: function(){

      var que = "";
      que += "<div class='queue'>";
      que += "<div class='touch'></div>";
      que += '<div id="players">';
      que += '<div class="a_player" id="youtube"></div>';
      que += '<div class="a_player" id="soundcloud"></div>';
      que += '<div class="a_player" id="videojs"></div>';
      que += "<div class='player_movers'>";
      que += "<div class='player_mover fullscreen'>"+window.lang.return( "fullscreen", { ucfirst: true } )+"</div>";
      que += "<div class='player_mover move'>"+window.lang.return( "move", { ucfirst: true } )+"</div>";
      que += "<div class='player_mover hide'>"+window.lang.return( "hide", { ucfirst: true } )+"</div>";
      que += "</div>";
      que += "</div>";
      que += "<div id='preview'></div>";
      que += "<div class='data_wrapper'>";
      que += "<div class='tabs clearafter'>";
      que += "<div class='tab _queue active'>"+window.lang.return( "queue", { ucfirst: true } )+"</div>";
      que += "<div class='tab _lyrics'>"+window.lang.return( "lyrics", { ucfirst: true } )+"</div>";
      que += "</div>";
      que += "<div class='tBody'>";
      que += "<div class='list'>";
      que += "<div class='_items items clearafter'></div>";
      que += "<div class='infinite button infinite_control'>\
      <div class='_t'>"+window.lang.return( "infinite_play", { ucfirst: true } )+"</div>\
      <div class='_s'>"+window.lang.return( "infinite_play_tip", { ucfirst: true } )+"</div>\
      <div class='_mask'></div>\
      </div>";
      que += "<div class='_items next_items clearafter'></div>";
      que += "</div>";
      que += "<div class='lyrics clearafter'></div>";
      que += "</div>";
      que += "</div>";
      que += "</div>";

      $("body").append( que );

      setTimeout(function(){

      },100);

    },
    toggle: function(){

      if ( window.muse.queue._open !== false )
      window.muse.queue.destroy();

      else
      window.muse.queue.build();

    },
    set: function( $sources, $reset ){

      window.muse.queue._items = $sources;
      if ( $reset === true )
      window.muse.queue.active.reset();
      window.muse.queue.save();

    },
    extend: function( $sources, $action ){

      if ( !window.muse.queue._items.length ){
        window.muse.queue.set( $sources, true );
        window.muse.player.setup.exe();
        window.muse.queue.build();
      }
      else if ( $action == "last") {
        window.muse.queue._items = $.merge( window.muse.queue._items, $sources );
      }
      else {
        var newQue = [];
        for ( var i=0; i<Object.keys(window.muse.queue._items).length; i++ ){

          var _itemK = Object.keys(window.muse.queue._items)[i];
          var _item = window.muse.queue._items[ _itemK ];

          newQue.push( _item );

          if ( _itemK == window.muse.queue.active._id ){
            for ( var z=0; z<Object.keys($sources).length; z++ ){
              var __itemK = Object.keys($sources)[z];
              var __item = $sources[ __itemK ];
              newQue.push( __item );
            }
          }

        }
        window.muse.queue._items = Object.values( newQue );
      }

    },
    build: function( offset ){

      if ( window.muse._config.embed )
      return;

      if ( $("body").hasClass("queue_hide") )
      return;

      window.pageBuilder.widget.item.closeMenu();

      var source = window.muse.queue.active.get();
      var items = window.muse.queue._items;

      var que = "";
      if ( items ){
        for ( var i=0; i<Object.keys(items).length; i++ ){
          var item_key = Object.keys(items)[i];
          var item = items[ item_key ];
          que += "<div class='item bof_"+item.data.ot+"_"+item.data.hash+" no_action clearafter' id='bof_queue_"+item_key+"'>";
          que += "<div class='cover_holder'><div class='cover' style='background-image:url(\"" + item.data.cover + "\")'></div></div>";
          que += "<div class='detail'>";
          que += "<div class='title'>"+ item.data.title +"</div>";
          que += "<div class='sub_title'>"+ item.data.sub_title +"</div>";
          que += "</div>";
          que += "<div class='duration'>" + window._g.duration_hr( item.data.duration ) + "</div>";
          que += "</div>";
        }
      }

      if ( offset ) $(document).find(".queue").css("top",offset+"px");
      $(document).find(".queue .list .items").html( que );
      $(document).find( ".queue #preview" ).html( "" );
      setTimeout(function(){

        $(document).find(".queue").animate({top:0},350);
        window.ui.body.addClass( "que_active", true );

        window.muse.queue.popOut();
        window.muse.queue._open =
        setTimeout(function(){
          window.muse.queue.preview();
          window.ui.body.addClass( "que_active_open", true );
          window.muse.infinite.build();
        },600);
        window.muse.focus.ui();
        window.pageBuilder.widget.item.listen();

      },100);

    },
    popOut: function(){

      if ( window.muse._config.embed )
      return;

      var active = window.muse.queue.active.get();
      var active_que_id = window.muse.queue.active._id;
      window.muse.player.setup.move_frame( "hide" );

    },
    destroy: function(){

      window.ui.body.removeClass( "que_active", true );
      window.ui.body.removeClass( "que_active_open", true );
      window.muse.player.setup.move_frame( "normal" );
      $(document).find(".queue").animate({top:"150vh"},350);
      clearTimeout( window.muse.queue._open );
      window.muse.queue._open = false;
      window.muse.player.setup.touch();

    },
    remove: function( $id ){

      var newItems = {};

      for ( var i=0; i<Object.keys(window.muse.queue._items).length; i++ ){
        var itemKey = Object.keys(window.muse.queue._items)[i];
        if ( itemKey != $id )
        newItems[ itemKey ] = window.muse.queue._items[ itemKey ];
      }

      window.muse.queue._items = newItems;

      if ( window.muse.queue._open !== false )
      window.muse.queue.build();

      window.muse.queue.save();

    },
    next: function(){

      if ( window.muse._config.embed || window.muse.ads.playing )
      return;

      var active_id = window.muse.queue.active._id;
      var ids = Object.keys( window.muse.queue._items );
      var total = ids.length;

      if ( total < 1 ){
        window.muse.queue.destroy();
        window.muse.player.destroy();
      }

      var new_index = ids.indexOf( active_id ) + 1;
      if( new_index > total - 1 )
      new_index = 0;

      window.muse.queue.active.set( ids[ new_index ] );
      window.muse.player.setup.exe();
      window.muse.queue.preview();

    },
    hasNext: function(){

      var active_id = window.muse.queue.active._id;
      var ids = Object.keys( window.muse.queue._items );
      var total = ids.length;

      if ( total < 2 ) return false;

      var activePos = ids.indexOf( active_id ) + 1;
      if ( activePos < total ) return true;

      return false;

    },
    prev: function(){

      var active_id = window.muse.queue.active._id;
      var ids = Object.keys( window.muse.queue._items );
      var total = ids.length;

      if ( total < 2 || window.muse.ads.playing )
      return;

      var new_index = ids.indexOf( active_id ) - 1;
      if( new_index < 0 )
      new_index = total - 1;

      window.muse.queue.active.set( ids[ new_index ] );
      window.muse.player.setup.exe();
      window.muse.queue.preview();

    },
    shuffle: function(){

      var items = Object.keys( window.muse.queue._items );

      var shuffled_items = window._g.array_shuffle( items );
      var newQue = {};
      var newActiveID = false;

      for ( var i=0; i<shuffled_items.length; i++ ){
        var item = shuffled_items[i];
        newQue[ i ] = window.muse.queue._items[ item ];
        if ( item == window.muse.queue.active._id )
        newActiveID = i;
      }

      window.muse.queue.set( newQue );
      if ( newActiveID )
      window.muse.queue.active.set( newActiveID )
      window.muse.queue.build();

    },
    save: function(){

      if ( window.muse._config.embed )
      return;

      window.cache.set( "muse_que", JSON.stringify( window.muse.queue._items ) );
      window.cache.set( "muse_que_i", window.muse.queue.active._id );
    },
    load: function(){

      if ( window.muse._config.embed )
      return;

      window.muse.queue.active._id = window.cache.get( "muse_que_i" )
      window.muse.queue._items = JSON.parse( window.cache.get( "muse_que" ) )
    },
    preview: function(){

      if ( window.muse._config.embed )
      return;

      if ( window.muse.queue._open === false )
      return;

      if ( window.muse.player.setup.audio.cache.streamMetaDataTimer ){
        window.muse.player.setup.audio.streamMetaData()
      }

      var active = window.muse.queue.active.get();
      var active_que_id = window.muse.queue.active._id;
      var preview = null;
      var types = "<div class='types clearafter'>";
      if ( active.types ){
        for( var i=0; i<Object.keys(active.types.sources).length; i++ ){
          var _k = Object.keys(active.types.sources)[i];
          var type_sources = active.types.sources[ _k ];
          types += "<div data-type='"+_k+"' class='type type_"+_k+" count_"+type_sources.count+" "+(type_sources.count==1?"single":"parent")+" "+(type_sources.locked?"locked":"")+" "+(type_sources.active?"active":"")+"'>";
          types += "<div class='type_title'>"+_k+"</div>";
          types += "</div>";
        }
      }
      types += "</div>";

      if ( active.data ? active.data.preview : false )
      preview = active.data.preview;

      var preview_html =
      "<div class='preview_wrapper source_count_"+(active.types?active.types.count:"0")+"'>\
      <div class='item no_action text_wrapper bof_"+active.data.ot+"_"+active.data.hash+"' id='bof_queue_"+ active_que_id +"'>\
      <a href='"+active.data.link+"' class='title'>"+active.data.title+"</a>\
      <a href='"+active.data.sub_link+"' class='sub_title'>"+active.data.sub_title+"</a>\
      <div class='button_wrapper more'><div><span class='mdi mdi-dots-vertical'></span></div></div>\
      </div>\
      <div class='graph_wrapper type_"+active.source.type[0]+" p_type_"+(preview?preview.type:"un")+"'>"

      if ( preview ? preview.type == "image" && preview.image : false ){
        preview_html += "<div class='image_wrapper'>\
        "+preview.image+"\
        </div>"
      }
      else if ( preview ? preview.type == "thingie" : false ){
        preview_html += "<div class='thingie_wrapper'>\
        <a class='banner_wrapper' style='background-image:url(\""+preview.banner+"\")' href='"+preview.link+"'></a>\
        </div>";
      }

      preview_html += "</div>"+types+"</div>"
      $(document).find( ".queue #preview" ).html( preview_html ).attr("class","").addClass(window.muse.queue.active.get().data.ot);
      $(document).find( ".queue.second_tab" ).removeClass("second_tab");
      $(document).find( ".queue .tab.active").removeClass("active");
      $(document).find( ".queue .tab._queue").addClass("active");
      $(document).find( ".queue .tab._lyrics" ).removeClass( "has_not" ).removeClass( "has" ).addClass( active.data.lyrics ? "has" : "has_not" )

      setTimeout(function(){
        window.muse.player.setup.move_frame( "queue", true );
        window.pageBuilder.widget.item.listen();
      },100)

    }

  },
  ads: {
    check: function(){

      var promise = $.Deferred();

      if ( window.muse._config.embed ){
        promise.reject();
        return promise;
      }

      if ( window.muse.ads.cache ){
        promise.resolve();
        return promise;
      }

      var _mIni = null;
      var _mCheck = window.muse.player.setting.get("check");
      var _mThingie = window.muse.player.setting.get("thingie");
      var _mThingie_interval = window.muse.player.setting.get("thingie_interval");

      if ( window.muse.player.setting.get("ini") )
      _mIni = window.muse.player.setting.get("ini");

      else {
        _mIni = window._g._mt();
        window.muse.player.setting.set( "ini", _mIni );
      }

      var _m = _mIni;
      if ( _mThingie )
      _m = _mThingie;

      window.muse.log( "thingie.ini: " + _mIni + " - " + ( ( window._g._mt() - _mIni ) / 1000 ) );
      window.muse.log( "thingie.last: " + _mThingie + " - " + ( ( window._g._mt() - _mThingie ) / 1000 ) );
      window.muse.log( "thingie.check: " + _mCheck + " - " + ( ( window._g._mt() - _mCheck ) / 1000 ) );
      window.muse.log( "thingie.interval: " + _mThingie_interval );

      if ( _mThingie_interval === -1 ? window._g._mt() - _mCheck < (1*60*1000) : false ){
        window.muse.log( "thingie.interval: disabled. return" );
        promise.reject();
        return promise;
      }

      if ( window._g._mt() - _mIni < 5*60*1000 ){
        window.muse.log( "thingie.ini: fresh. return" );
        promise.reject();
        return promise;
      }

      if ( _mThingie && _mThingie_interval ? window._g._mt() - _mThingie < _mThingie_interval*60*1000 : false ){
        window.muse.log( "thingie.last: fresh. return" );
        promise.reject();
        return promise;
      }

      window.becli.exe({
        liquid: true,
        endpoint: "get_the_thingie",
        post: {
          placement: "bof_AUDI0"
        },
        callBack: function( sta, data ){
          window.muse.player.setting.set( "check", window._g._mt() );
          if ( !sta ){
            _mThingie_interval = -1;
            window.muse.log( "thingie.get: none. return" );
            window.muse.player.setting.set( "thingie_interval", _mThingie_interval );
            promise.reject();
          } else {
            window.muse.player.setting.set( "thingie_interval", data.thingie_interval );
            window.muse.ads.cache = data.thingie;
            window.muse.log( "thingie.get: gotOne!" );
            promise.resolve()
            window.muse.ads.playing = true; 
            window.muse.player.setup.exe({
              skipAdCheck: true
            });
          }
        }
      });

      return promise;

    }
  },
  source: {
    solve: function (action, ot, hash, sources, Data) {

      var promise = $.Deferred();
      var checkOffline = $.Deferred();

      if (window.muse._config.embed) {
        checkOffline.reject();
      }
      else {
        window.bof_offline.db.get_objects(ot, hash)
          .done(function (dled_item) {
            checkOffline.resolve(dled_item);
          })
          .fail(function () {
            checkOffline.reject();
          })
      }

      checkOffline
        .done(function (dled_item) {
          promise.resolve([dled_item.data.muse]);
        })
        .fail(function (err) {

          if (sources) {
            promise.resolve(sources);
          }
          else {

            var _mIni = window.muse.player.setting.get("ini");
            var _mThingie = window.muse.player.setting.get("thingie");

            window.muse.queue.active.addXhr( window.becli.exe({

              ID: "muse_request_source",
              liquid: true,
              endpoint: "muse_request_source",

              post: {
                action: action,
                object_type: ot,
                object_hash: hash,
                type: window.muse.player.setting.get("type"),
                ID: Data ? (Data.reqed_id ? Data.reqed_id : null) : null,
                ini: _mIni,
                thingie: _mThingie
              },

              callBack: function (sta, data, args) {
                var postData = args.callBack_param
                if (sta ? data.sources : false) {
                  promise.resolve(data.sources);
                } else {
                  promise.reject(data);
                }
              },

              callBack_param: {
                action: action,
                object_type: ot,
                object_hash: hash,
              },

            }).client );

          }

        })

      return {
        promise: promise,
        checkOffline: checkOffline
      }

    },
    raaz: {
      xhr: null,
      parse: function ( sourceData ) {

        var promise = $.Deferred();
        var source = sourceData.source;

        if ( source?.type[1]?.raaz ? source.type[1].raaz === true : false ){

          window.muse.log( "Raaz.Parse: " + JSON.stringify(source.type[1]) );
  
          var raaz = source.type[1];

          window.muse.player.change_sta("loading","Raaz.Parse");
          setTimeout( function(){
            window.muse.player.change_sta("loading","Raaz.Parse");
          },15);
          
          this.request( raaz )
          .done( function( solvedRaaz ){
            promise.resolve( solvedRaaz );
          } )
          .fail(function( failedRaaz ){
            promise.reject( failedRaaz );
          });
  
        } else {
          promise.resolve( source );
        }

        return promise;
  
      },
      request: function ( raazData ) {

        var promise = $.Deferred();

        var data = window.muse.queue.active.get().data;
        var simplified_data = {
          object_type: data.ot,
          object_hash: data.hash,
          title: data.title,
          sub_title: data.sub_title,
          duration: data.duration
        };

        window.muse.player.change_sta("loading","Raaz.Request");
        window.muse.log( "Raaz.Request.Start" )

        window.muse.queue.active.addXhr( this.xhr = window.becli.exe({
          // ID: "muse_solve_raaz",
          liquid: true,
          endpoint: "muse_solve_raaz",
          post: $.extend( 
            simplified_data, 
            raazData,
            {
              youtube_piped_instances: this.instances?.length > 0
            }
          ),
          callBack: function (sta, data, args) {
            window.muse.player.change_sta("loading","Raaz.Request");
            window.muse.log( "Raaz.Request.Done: " + (sta?"OK":"Failed") )
            if ( sta ){
              if ( data.youtube_piped_browser ? data.youtube_piped_browser == true : false ){
                window.muse.source.raaz.youtube_piped.run( raazData, data.youtube_id, data ).done(function(ytpipedData){
                  promise.resolve(ytpipedData);
                }).fail(function(ytDataFail){
                  promise.resolve({
                    type: [
                      "youtube",{
                        youtube_id: data.youtube_id
                      }
                    ]
                  });
                });
              } else {
                promise.resolve( data );
              }
            } else {
              promise.reject( data );
            }
          }
        }).client );

        return promise;

      },
      youtube_piped: {
        promise: null,
        id: null,
        instances: null,
        type: null,
        failed: 0,
        run: function( raazData, youtube_id, response ){

          var promise = $.Deferred();
  
          if ( response.youtube_piped_urls ? Object.values( response.youtube_piped_urls ).length > 0 : false ){
            this.instances = Object.values( response.youtube_piped_urls );
            this.type = response.youtube_piped_type;
          }

          this.id = youtube_id;
          this.failed = 0;
  
          if ( !this.instances ){
            promise.resolve({
              type:[
                "youtube",
                {
                  youtube_id: youtube_id
                }
              ]
            });
          } 
          else {
            for ( var i=0; i<this.instances.length; i++ ){
              var youtube_piped_instance = this.instances[i];
              this.run_instance( youtube_piped_instance, youtube_id );
            }
          }

          this.promise = promise;
          return promise;
  
        },
        run_instance: function( youtube_piped_instance, youtube_id ){

          $.ajax({
            url: youtube_piped_instance + ( youtube_piped_instance.endsWith( "/" ) ? "" : "/" ) + "streams/" + youtube_id,
            timeout: 4500,
            success: function( data, status, responseData ){
              if ( status == "success" ){

                var _ss = null;
                if ( window.muse.source.raaz.youtube_piped.type[0] == "audio" && data.audioStreams ? data.audioStreams.length > 0 : false ){
                  _ss = data.audioStreams;
                }
                else if ( window.muse.source.raaz.youtube_piped.type[0] == "video" && data.videoStreams ? data.videoStreams.length > 0 : false ){
                  _ss = data.videoStreams;
                }
                if ( _ss ? _ss.length > 0 : false ){

                  var chosenURL = null;
                  var chosenMIME = null;
                  var chosenURLScore = 0;

                  $.each(_ss, function (index, source) {

                    if (source["videoOnly"])
                      return true;  // Continue to next iteration

                    var choose = false;
                    var score = (window.muse.source.raaz.youtube_piped.type[0] === "audio") ? parseInt(source["quality"]) : source["width"];

                    if (chosenURL === null) {
                      choose = true;
                    } else if (window.muse.source.raaz.youtube_piped.type[1] === "hq" && score > chosenURLScore) {
                      choose = true;
                    } else if (window.muse.source.raaz.youtube_piped.type[1] === "lq" && score < chosenURLScore) {
                      choose = true;
                    }

                    if (choose) {
                      chosenURL = source["url"];
                      chosenMIME = source["mimeType"];
                      chosenURLScore = score;
                    }

                  });

                  if ( chosenURL ){
                    if ( window.muse.source.raaz.youtube_piped.id == youtube_id && window.muse.source.raaz.youtube_piped.promise.state() !== "resolved" ){
                      window.muse.source.raaz.youtube_piped.promise.resolve( {
                        type: [
                          window.muse.source.raaz.youtube_piped.type[0],
                          {
                            address: chosenURL + "&bof_sw_ignore_me=sure",
                            type: 'free',
                            format: chosenMIME
                          }
                        ]
                      } )
                    }
                  } else {
                    window.muse.source.raaz.youtube_piped.run_instance_failed( youtube_id )
                  }

                } else {
                  window.muse.source.raaz.youtube_piped.run_instance_failed( youtube_id )
                }
                
              }
            },
            error: function( responseData, status, err ){
              window.muse.source.raaz.youtube_piped.run_instance_failed( youtube_id )
            },
          })

        },
        run_instance_failed: function( youtube_id ){
          if ( window.muse.source.raaz.youtube_piped.id == youtube_id ){
            window.muse.source.raaz.youtube_piped.failed = window.muse.source.raaz.youtube_piped.failed + 1;
          }
          if ( window.muse.source.raaz.youtube_piped.failed == window.muse.source.raaz.youtube_piped.instances.length ){
            window.muse.source.raaz.youtube_piped.promise.reject("all failed")
          }
        }
      },
    }
  },
  
  player: {

    _type: null,
    _args: null,
    _status: null,
    _seeking: false,
    _cron: null,

    setting: {
      _i: {
        muted: false,
        volume: 100,
        repeat: false,
        infinite: true,
        type: "audio",
        ini: null,
        thingie: null,
      },
      _ipi: false,
      _ipf: false,
      get: function( key ){
        return window.muse.player.setting._i[ key ];
      },
      set: function( key, value ){
        window.muse.player.setting._i[ key ] = value;
        window.muse.player.setting.save();
      },
      load: function(){
        var savedSetting = window.cache.get( "muse_setting", false );
        if ( savedSetting ){
          savedSetting = JSON.parse( savedSetting );
          window.muse.player.setting._i = savedSetting;
        }
      },
      save: function(){
        window.cache.set( "muse_setting", JSON.stringify( window.muse.player.setting._i ) );
      },
    },
    types: {
      listen: function(){

        $(document).on("click",".queue #preview .types .type",function(e){

          var sources = window.muse.queue.active.get().types.sources;

          var type = $(this).data("type");
          var reqed_sources = sources[ type ];

          if ( !reqed_sources ) return;

          if ( reqed_sources.count > 1 ){

            var list_html = "<div class='quality_list select_list'>";
            for ( var z=0; z<reqed_sources.sources.length; z++ ){
              list_html += "<div class='quality_item select_item"+(reqed_sources.sources[z].locked?" locked":"")+(reqed_sources.sources[z].active?" selected":"")+"' data-type='"+type+"' data-hook='"+reqed_sources.sources[z].hook+"' data-id='"+reqed_sources.sources[z].hash+"'>";
              list_html += reqed_sources.sources[z].title;
              list_html += "</div>";
            }
            list_html += "</div>";

            window.bof_modal.create({
              class: "select muse_quality",
              title: window.lang.return( "select_an_item", { ucfirst: true } ),
              content: list_html,
              buttons: []
            });

            return;

          }

          var switch_type_name = type;
          if ( type == "audio" || type == "video" ){
            switch_type_name = reqed_sources.sources[0].hook
          }

          if ( reqed_sources.locked ){
            window.app.actions.get_unlock_solution(
              window.muse.queue.active.get().data.ot,
              window.muse.queue.active.get().data.hash,
              type, hook, ID
            )
            return;
          }

          window.muse.player.types.switch( switch_type_name );

        });
        $(document).on("click",".modal_wrapper.select .content .quality_list .quality_item",function(e){

          var type = $(this).data("type");
          var hook = $(this).data("hook");
          var ID = $(this).data("id");

          if ( $(this).hasClass("locked") ){
            window.app.actions.get_unlock_solution(
              window.muse.queue.active.get().data.ot,
              window.muse.queue.active.get().data.hash,
              type, hook, ID
            )
            return;
          }

          window.muse.player.types.switch( hook, ID );
          window.bof_modal.close();

        });

      },
      get_unlock_solution: function( type, hook, ID, ot, hash ){

        window.bof_modal.close();
        window.bof_modal.set_loading( "initial" );
        window.becli.exe({
          endpoint: "muse_unlock_solution",
          post: {
            hook: hook,
            type: type,
            ID: ID,
            ot: ot ? ot :window.muse.queue.active.get().data.ot,
            hash: hash ? hash : window.muse.queue.active.get().data.hash
          },
          callBack: function( sta, data, args ){
            if ( !sta ){
              window.bof_modal.close();
              if ( !window.muse._config.embed )
              window.app.becli.alert( false, "Can't be played" );
            }
            else {
              window.bof_modal.close();
              window.bof_modal.create({
                title: window.lang.return( "unlock_solution", { ucfirst: true } ),
                tip: data.messages[0],
                buttons: [
                ]
              });
            }
          }
        });

      },
      switch: function( type, ID ){

        window.muse.player.setting.set( "type", type );
        var source_data = window.muse.queue.active.get();

        window.muse.request( "type_switch", source_data.data.ot, source_data.data.hash, false, { reqed_id: ID } ).done(function( sources ){
          if ( sources ){
            window.muse.queue._items[ source_data.ID ] = sources[0];
            window.muse.queue._items[ source_data.ID ][ "ID" ] = source_data.ID;
            window.muse.player.destroy();
            window.muse.player.setup.exe();
            window.muse.queue.preview();
          }
        });

      }
    },
    control: {

      ui: function(){

        $(document).find("#player .controls_wrapper .control.play .mdi")
        .removeClass("mdi-refresh mdi-play mdi-pause")
        .addClass( window.muse.player._status == "loading" ? "mdi-refresh" : ( window.muse.player._status != "playing" ? "mdi-play" : "mdi-pause" ) );

        $(document).find("#player").removeClass( "paused playing loading" ).addClass( window.muse.player._status );

      },
      graph: function(){

        if ( window.muse.player._seeking ){
          window.muse.player._cron = setTimeout( window.muse.player.control.graph, 100 );
          return;
        }

        var get_duration = window.muse.player.control.duration();
        var get_offset = window.muse.player.control.seek();
        var get_buffered_ratio =  window.muse.player.control.buffered();

        $.when( get_duration, get_offset, get_buffered_ratio ).done( function( duration, offset, buffered_ratio ){

          var offset_ratio = Math.round( duration ? offset / duration * 100 : 0 );

          $(document).find("#player .progress_bar .progress .progress_e").css( "width", offset_ratio + "%" )
          $(document).find("#player .progress_bar .progress .progress_b").css( "width", buffered_ratio + "%" )

          var time_cur = window._g.duration_hr( offset );
          if ( $(document).find("#player .progress_bar .progress .time.cur").text() != time_cur )
          $(document).find("#player .progress_bar .progress .time.cur").text( time_cur );

          var time_tot = window._g.duration_hr( duration );
          if ( $(document).find("#player .progress_bar .progress .time.tot").text() != time_tot )
          $(document).find("#player .progress_bar .progress .time.tot").text( time_tot )

          window.muse.player._cron = setTimeout( window.muse.player.control.graph, 100 );

        } );

      },

      playToggle: function(){

        window.muse.log( "Player.Control.playToggle: " + window.muse.player._status );

        if ( window.muse.player._status == "playing" )
        return window.muse.player.control.pause();

        else if ( window.muse.player._status == "paused" )
        return window.muse.player.control.play();

        return null;

      },
      play: function(){

        window.muse.log( "Player.Control.Play: " + window.muse.player._type );

        if ( window.muse.player._type == "audio" ){
          try {
            window.muse.player.setup.audio.Amplitude.play();
          } catch(err) {}
        }

        else if ( window.muse.player._type == "youtube" ){
          try {
            window.muse.player.setup.youtube.iframe.playVideo();
          } catch(err) {}
        }

        else if ( window.muse.player._type == "soundcloud" ){
          try {
            window.muse.player.setup.soundcloud.iframe.play();
          } catch(err) {}
        }

        else if ( window.muse.player._type == "video" ){
          try {
            window.muse.player.setup.video.videojs.play();
          } catch(err) {}
        }

      },
      pause: function(){

        window.muse.log( "Player.Control.Pause: " + window.muse.player._type );

        if ( window.muse.ads.playing ){
          window.muse.log( "Blocked - Ads" );
          if ( window.muse.focus.get_status() != "playing" ){
            window.muse.player.control.play();
          }
          return;
        }

        if ( window.muse.player._type == "audio" ){
          try {
            window.muse.player.setup.audio.Amplitude.pause();
          } catch(err) {}
        }

        else if ( window.muse.player._type == "youtube" ){
          try {
            window.muse.player.setup.youtube.iframe.pauseVideo();
          } catch(err) {}
        }

        else if ( window.muse.player._type == "soundcloud" ){
          try {
            window.muse.player.setup.soundcloud.iframe.pause();
          } catch(err) {}
        }

        else if ( window.muse.player._type == "video" ){
          try {
            window.muse.player.setup.video.videojs.pause();
          } catch(err) {}
        }

      },
      next: function( $type ){

        var repeat = window.muse.player.setting.get( "repeat" );
        var infinite = window.muse.player.setting.get( "infinite" );
        var infinite_has = window.muse.infinite.hasItems();
        var hasNext = window.muse.queue.hasNext();

        window.muse.log( "Player.Control.Next: repeat:" + repeat + " , infinite:" + infinite + "," + infinite_has + " ,hasNext:" + hasNext  );

        if ( window.muse.ads.playing ){
          window.muse.log( "Blocked - Ads" );
          if ( window.muse.focus.get_status() != "playing" ){
            window.muse.player.control.play();
          }
          return;
        }

        if ( hasNext ){
          window.muse.queue.next();
        }
        else if ( repeat ){
          window.muse.queue.next();
        }
        else if ( infinite && infinite_has ){
          window.muse.infinite.load();
        }
        else if ( $type !== "soft" ){
          window.muse.queue.next();
        }

      },
      prev: function(){

        window.muse.log( "Player.Control.Previous" );

        if ( window.muse.ads.playing ){
          window.muse.log( "Blocked - Ads" );
          if ( window.muse.focus.get_status() != "playing" ){
            window.muse.player.control.play();
          }
          return;
        }
        
        window.muse.queue.prev();

      },
      muteToggle: function(){

        window.muse.log( "Player.Control.MuteToggle: " + window.muse.player.setting.get( "muted" ) );

        if ( window.muse.player.setting.get( "muted" ) )
        window.muse.player.control.unmute();
        else
        window.muse.player.control.mute();

      },
      mute: function(){

        window.muse.log( "Player.Control.Mute: " + window.muse.player._type );

        $(document).find("#player").removeClass("unmuted").addClass("muted");
        window.muse.player.setting.set( "muted", true );

        if ( window.muse.player._type == "audio" )
        window.muse.player.setup.audio.Amplitude.setVolume( 0 );

        else if ( window.muse.player._type == "youtube" ){
          try { window.muse.player.setup.youtube.iframe.setVolume( 0 ); }
          catch(err){}
        }

        else if ( window.muse.player._type == "soundcloud" )
        window.muse.player.setup.soundcloud.iframe.setVolume( 0 );

        else if ( window.muse.player._type == "video" )
        window.muse.player.setup.video.videojs.volume( 0 );

      },
      unmute: function(){

        window.muse.log( "Player.Control.Mute: " + window.muse.player._type );
        window.muse.player.setting.set( "volume", 100 );

        $(document).find("#player").removeClass("muted").addClass("unmuted");
        window.muse.player.setting.set( "muted", false );

        if ( window.muse.player._type == "audio" )
        window.muse.player.setup.audio.Amplitude.setVolume( window.muse.player.setting.get( "volume" ) );

        else if ( window.muse.player._type == "youtube" ){
          try { window.muse.player.setup.youtube.iframe.setVolume( window.muse.player.setting.get( "volume" ) ); }
          catch(err){}
        }

        else if ( window.muse.player._type == "soundcloud" )
        window.muse.player.setup.soundcloud.iframe.setVolume( window.muse.player.setting.get( "volume" ) );

        else if ( window.muse.player._type == "video" )
        window.muse.player.setup.video.videojs.volume( window.muse.player.setting.get( "volume" ) / 100 );

      },
      infiniteToggle: function(){

        window.muse.log( "Player.Control.InfiniteToggle: " + window.muse.player.setting.get( "infinite" ) );

        if ( window.muse.player.setting.get( "infinite" ) )
        window.muse.player.control.infiniteOff();
        else
        window.muse.player.control.infiniteOn();

      },
      infiniteOn: function(){

        window.muse.log( "Player.Control.infiniteOn" );
        window.ui.body.addClass( "muse_infinite", true );
        window.muse.player.setting.set( "infinite", true );
        window.muse.player.control.repeatOff();

      },
      infiniteOff: function(){

        window.muse.log( "Player.Control.InfiniteOff" );
        window.ui.body.removeClass( "muse_infinite", true );
        window.muse.player.setting.set( "infinite", false );

      },
      repeatToggle: function(){

        if ( window.muse.player.setting.get( "repeat" ) ){
          window.muse.player.control.repeatOff();
        }
        else {
          window.muse.player.control.repeatOn();
        }

      },
      repeatOn: function(){

        window.muse.player.control.infiniteOff();
        window.muse.player.setting.set( "repeat", true );
        $(document).find("#player").addClass("repeat_on").removeClass("repeat_off");

      },
      repeatOff: function(){

        window.muse.player.setting.set( "repeat", false );
        $(document).find("#player").addClass("repeat_off").removeClass("repeat_on");

      },
      setUVolume: function( int ){

        window.muse.player.setting.set( "volume", int );
        window.muse.player.control.setVolume( int );
        if ( int == 0 ){
          window.muse.player.control.mute();
        } else if ( window.muse.player.setting.get("muted") ){
          window.muse.player.control.unmute();
        }

      },
      setVolume: function( newVolume ){

        window.muse.log( "Player.Control.Mute: " + newVolume + ", " + window.muse.player._type );

        if ( newVolume )
        window.muse.player.setting.set( "volume", newVolume );
        else {
          newVolume = window.muse.player.setting.get( "volume" );
          if ( window.muse.player.setting.get( "muted" ) )
          newVolume = 0;
        }

        if ( window.muse.player._type == "audio" )
        window.muse.player.setup.audio.Amplitude.setVolume( newVolume );

        else if ( window.muse.player._type == "youtube" ){
          try { window.muse.player.setup.youtube.iframe.setVolume( newVolume ) }
          catch(err){}
        }

        else if ( window.muse.player._type == "soundcloud" )
        window.muse.player.setup.soundcloud.iframe.setVolume( newVolume );

        else if ( window.muse.player._type == "video" )
        window.muse.player.setup.video.videojs.volume( newVolume / 100 );

      },
      seek: function( newPointer ){

        if ( newPointer === undefined ){

          var promise = $.Deferred();

          if ( window.muse.player._type == "audio" ? window.muse.player.setup.audio.Amplitude : false )
          promise.resolve( Math.round( window.muse.player.setup.audio.Amplitude.getSongPlayedSeconds() ) );

          if ( window.muse.player._type == "youtube" ? window.muse.player.setup.youtube.iframe : false )
          promise.resolve( Math.round( window.muse.player.setup.youtube.iframe.getCurrentTime() ) );

          if ( window.muse.player._type == "soundcloud" ? window.muse.player.setup.soundcloud.iframe : false )
          window.muse.player.setup.soundcloud.iframe.getPosition(function(abs){
            promise.resolve( Math.round( abs / 1000  ) );
          })

          if ( window.muse.player._type == "video" ? window.muse.player.setup.video.videojs : false )
          promise.resolve( Math.round( window.muse.player.setup.video.videojs.currentTime() ) );

          return promise;

        }

        window.muse.player.control.duration().done(function(_dur){

          if ( _dur == "Infinity" || window.muse.ads.playing ){
            window.muse.player._seeking = false;
            $(document).find("#player").removeClass("seeking");
            if ( window.muse.ads.playing && window.muse.focus.get_status() != "playing" ){
              window.muse.player.control.play();
            }
            return;
          }

          if ( window.muse.player._type == "audio" ){
            window.muse.player.setup.audio.Amplitude.pause();
            window.muse.player.setup.audio.Amplitude.setSongPlayedPercentage( newPointer ? parseFloat( newPointer ) : 0 );
            if ( parseFloat( newPointer ) <= 2 ){
              window.muse.player.setup.audio.Amplitude.skipTo( 0, window.muse.player.setup.audio.Amplitude.getActiveIndex() );
            }
          }
          else if ( window.muse.player._type == "youtube" ){
            window.muse.player.setup.youtube.iframe.seekTo( _dur *  ( newPointer / 100 ) );
          }
          else if ( window.muse.player._type == "soundcloud" ){
            window.muse.player.setup.soundcloud.iframe.seekTo( _dur *  ( newPointer / 100 ) * 1000 );
          }
          else if ( window.muse.player._type == "video" ){
            window.muse.player.setup.video.videojs.currentTime( _dur *  ( newPointer / 100 ) );
          }

          window.muse.player._seeking = false;
          $(document).find("#player").removeClass("seeking");

        });

      },
      buffered: function(){

        if ( window.muse.player._type == "audio" ){
          if ( window.muse.player.setup.audio.Amplitude )
          return window.muse.player.setup.audio.Amplitude.getBuffered();
          return 0;
        }

        return 0;

      },
      duration: function(){

        var promise = $.Deferred();

        if ( window.muse.player._type == "audio" ){
          var abs_duration = window.muse.player.setup.audio.Amplitude.getSongDuration();
          if ( abs_duration ) promise.resolve( Math.round( abs_duration ) );
        }
        else if ( window.muse.player._type == "youtube" ){
          var abs_duration = window.muse.player.setup.youtube.iframe.getDuration();
          if ( abs_duration ) promise.resolve( Math.round( abs_duration ) );
        }
        else if ( window.muse.player._type == "soundcloud" ){
          window.muse.player.setup.soundcloud.iframe.getDuration(function(abs_duration){
            if ( abs_duration ) promise.resolve( Math.round( abs_duration / 1000 ) );
          });
        }
        else if ( window.muse.player._type == "video" ){
          var abs_duration = window.muse.player.setup.video.videojs.duration();
          if ( abs_duration ) promise.resolve( Math.round( abs_duration ) );
        }
        else {
          promise.resolve(  window.muse.queue.active.get().data.duration );
        }

        return promise;

      },
      stop: function(){

        window.muse.log( "Player.Control.Stop: " + window.muse.player._type );

        var prePlayer_type = window.muse.player._type;
        var prePlayer_args = window.muse.player._args;
        if ( prePlayer_type ){
          window.muse.player.setup[ prePlayer_type ].halt( prePlayer_args );
        }

      }

    },
    setup: {

      iframe_pos: "normal",
      active: null,
      error_handler: function( phase, err ){

        if ( !window.muse._config.embed )
        window.app.becli.alert( false, err );

        if ( phase == "resReq" ){
          window.muse.queue.active.setAsFocus();
        } else {

          var badSeedID = window.muse.queue.active.get().ID;

          if ( Object.keys( window.muse.queue._items ).length > 1 ){
            window.muse.queue.next();
          } else {
            window.muse.queue.destroy();
            window.muse.player.destroy();
          }

          setTimeout( function(){
            window.muse.queue.remove( badSeedID );
          }, 250 );

        }

      },
      touch: function(){

        if ( window.muse._config.embed )
        return;

        if ( !window.app.config.mobile )
        return;

        if ( !document.querySelector("#player .touch_sensitive") ? true : document.querySelector("#player .touch_sensitive").length == 0 )
        return;

        var mc = new Hammer(document.querySelector("#player .touch_sensitive"));

        mc.add( new Hammer.Pan( {
          direction: Hammer.DIRECTION_ALL,
          threshold: 0
        } ) );

        var Direction = null;
        var Do = false;

        mc.on( 'pan', function(e){

          if ( !Direction ){
            if ( e.deltaY < -5 ){
              Direction = "top";
              $(document).find("#player").addClass("pulling");
            } else if ( e.deltaX < -10 ){
              Direction = "left"
            } else if ( e.deltaX > 10 ){
              Direction = "right"
            }
          }
          if ( Direction ){
            if ( Direction == "top" ){
              if ( $(document).find("#player").height() + $(document).find("._bof_sidebar").height() < $(window).height() ){
                var _d = (e.deltaY*-1)+75;
                $(document).find("#player").css("height", (_d>75?_d:75)+"px" );
              }
            }
            else {
              if ( Math.abs(e.deltaX) < 100 ){
                $(document).find("#player").css("transform", "translateX("+e.deltaX+"px)" )
              } else {
                // next // pre
                if ( Direction == "left" )
                Do = "next";
                else
                Do = "prev";
              }
            }
          }
          if ( e.isFinal === true ){

            if ( Do == "next" )
            window.muse.queue.next();
            else if ( Do == "prev" )
            window.muse.queue.prev();
            else if ( Direction == "top" && Math.abs(e.deltaY)>100 )
            window.muse.queue.build( $("#player").offset().top );

            $(document).find("#player").css("height", "75px" ).css("transform", "none" ).removeClass("pulling");

            Direction = null;
            Do = null;

          }

        } );

      },
      exe: function (exeArgs) {

        exeArgs = exeArgs ? exeArgs : {};

        var adsPromise = $.Deferred();

        if (!exeArgs.skipAdCheck){
          window.muse.ads.check().then(function(){
            adsPromise.resolve();
          }).fail(function(){
            adsPromise.reject();
          })
        } else {
          adsPromise.reject();
        } 

        adsPromise.fail(function () {

          window.muse.log( "Ads: Setup.Exe: No ads " );

          window.muse.recorder.reset();

          window.muse.player.setup.audio.cache.ended = false;
          var prePlayer_type = window.muse.player._type;
          var prePlayer_args = window.muse.player._args;
          if (prePlayer_type) {
            window.muse.log( "Player.Setup.Exe: Halting " + prePlayer_type );
            window.ui.body.removeClass("muse_" + prePlayer_type + "_active", true);
            window.ui.body.removeClass("muse_player_active", true);
            window.muse.player.setup[prePlayer_type].halt(prePlayer_args);
          }

          $(document).find("#player").remove();
          window.muse.log("Player.Setup.Exe");
          var source = window.muse.queue.active.get();
          window.muse.player.setup.active = source;

          if (window.muse.player.setting.get("infinite"))
            window.ui.body.addClass("muse_infinite", true);
          else
            window.ui.body.removeClass("muse_infinite", true);

          var player = "";
          player += "<div id='player' class='clearafter" + (window.muse.player.setting.get("repeat") ? " repeat_on" : " repeat_off") + (window.muse.player.setting.get("muted") ? " muted" : " unmuted") + "'>";

          player += "<div class='data_wrapper touch_sensitive item no_action' id='bof_muse_active'>";
          player += "<div class='source_data'>";
          player += "<div class='cover_holder'><div style='background-image:url(\"" + source.data.cover + "\")'></div></div>";
          player += "<div class='data'>";
          player += "<a href='" + source.data.link + "' class='_title'>" + source.data.title + "</a>";
          if (source.data.sub_title)
            player += "<a " + (source.data.sub_link ? " href='" + source.data.sub_link + "' " : "") + " class='_sub_title'>" + source.data.sub_title + "</a>";
          player += "</div>";
          player += "<div class='button_wrapper more'><div><span class='mdi mdi-dots-vertical'></span></div></div>";
          player += "</div>";
          player += "</div>";

          player += "<div class='controls_wrapper clearafter'>";
          player += "<div class='control prev' data-action='prev'><span class='mdi mdi-skip-previous'></span></div>";
          player += "<div class='control play' data-action='play'><span class='mdi mdi-refresh'></span></div>";
          player += "<div class='control next' data-action='next'><span class='mdi mdi-skip-next'></span></div>";
          player += "</div>";

          player += "<div class='progress_bar'>";
          player += "<div class='progress'>\
          <input type='range' id='progress_range' min='0' max='100'>\
          <div class='progress_e'></div>\
          <div class='progress_b'></div>\
          <div class='time cur'>00:00</div>\
          <div class='time tot'>"+ window.general.duration_hr(source.data.duration) + "</div>\
          </div>";
          player += "</div>";

          player += "<div class='buttons_wrapper touch_sensitive clearafter'>";
          player += "<div class='button volume_control'><span class='mdi mdi-volume-high'></span><span class='mdi mdi-volume-off'></span></div>";
          player += "<div class='button que_repeat'><span class='mdi mdi-repeat'></span><span class='mdi mdi-repeat-off'></span></div>";
          player += "<div class='button que_shuffle'><span class='mdi mdi-shuffle'></span></div>";
          player += "<div class='button que_toggle'><span class='mdi mdi-chevron-up'></span></div>";
          player += "</div>";

          player += "</div>";

          window.ui.body.addClass("muse_active", true);
          $("body").append(player);

          window.muse.player.setup.touch();
          window.muse.player.change_sta("loading","Setup.Exe");
          window.muse.source.raaz.parse(source).then(function(parsedSource) {

            if ( source != window.muse.player.setup.active ){
              window.muse.log("Player.Setup.Exe -> *new* active source changed");
              return;
            }

            var sourceType = parsedSource.type[0];
            var sourceArgs = parsedSource.type[1];
            window.muse.player._type = sourceType;
            window.muse.player._args = sourceArgs;

            window.ui.body.addClass("muse_" + sourceType + "_active", true);
            window.ui.body.addClass("muse_player_active", true);
            window.muse.player.setup.set_mediasession();

            $(document).find("#players").removeClass(["video", "audio", "soundcloud", "youtube", "vimeo"]).addClass(sourceType);
            var preExe = $.Deferred();
            if (window.muse.player.setup[sourceType].pre) {
              window.muse.player.setup[sourceType].pre(exeArgs, sourceArgs).done(function () {
                preExe.resolve();
              }).fail(function (error) {
                if (window.muse.queue._items.length < 2) {
                  window.muse.player.setup.destroy();
                }
                window.muse.log("Player.Setup.Exe -> preExe failed");
                preExe.reject(error);
              });
            } else {
              preExe.resolve();
            }

            preExe.done(function () {

              var exe = $.Deferred();

              if ((sourceType == "audio" || sourceType == "video") ? sourceArgs.address : false) {
                sourceArgs.address = sourceArgs.address + ((sourceArgs.address.includes("?") ? "&" : "?") + "bof_offline=" + source.data.ID + "-" + source.data.ot + "-" + source.data.hash)
              }

              window.muse.player.setup[sourceType].exe(exeArgs, sourceArgs).done(function () {

                exe.resolve();
                window.muse.log("Player.Setup.Exe -> Done");

                window.muse.player.control.setVolume();
                setTimeout(function () {
                  if (window.muse.queue._open)
                    window.muse.player.setup.move_frame("queue", true);
                }, 200);

                if (window.muse.player.setup[sourceType].ext) {
                  window.muse.player.setup[sourceType].ext(exeArgs, sourceArgs);
                }


              }).fail(function (error) {
                window.muse.player.report_source()
                exe.reject(error);
                window.muse.player.setup.error_handler("exe", error);
                window.muse.log("Player.Setup." + sourceType + ".Exe -> FAILURE -> " + error, 9, { css: 'color:red' });
                if (window.muse.queue._items.length < 2) {
                  window.muse.player.setup.destroy();
                }
              });

            }).fail(function (error) {
              window.muse.player.setup.error_handler("preExe", error);
              window.muse.log("Player.Setup." + sourceType + ".Pre -> FAILURE -> " + error, 9, { css: 'color:red' });
            });

          }).fail(function(data){

            if ( data?.aborted ? data.aborted == true : false ){
              window.muse.log( "Player.Setup.Exe.Raaz -> FAILURE -> Aborted Source!", 6, { css: 'color:yellow' } );
              return;
            }
            
            if ( source != window.muse.player.setup.active ){
              window.muse.log("Player.Setup.Exe -> *new* active source changed");
              return;
            }

            if ( !window.muse._config.embed )
            window.app.becli.alert( false, data.messages[0] );
            // window.muse.player.control.next();

          });


        }).done(function(){
          window.muse.log( "Ads: Setup.Exe: Played the ad" );
        });

      },
      set_mediasession: function(){

        var active = window.muse.queue.active.get().data;
        var _title = window._g.decode_htmlspecialchars( active.title );
        var _stitle = window._g.decode_htmlspecialchars( active.sub_title );

        if ( 'mediaSession' in navigator ){

          navigator.mediaSession.metadata = new MediaMetadata({
            title:  _title,
            artist: _stitle,
            artwork: [
              { src: active.cover, sizes: '96x96',   type: 'image/jpg' },
              { src: active.cover, sizes: '128x128', type: 'image/jpg' },
              { src: active.cover, sizes: '192x192', type: 'image/jpg' },
              { src: active.cover, sizes: '256x256', type: 'image/jpg' },
              { src: active.cover, sizes: '384x384', type: 'image/jpg' },
              { src: active.cover, sizes: '512x512', type: 'image/jpg' },
            ]
          });

        }

        window.muse.player.setup.native_key_listen( window.muse.queue.active.get().source.type[0] );

      },
      native_key_listen: function( mediaType ){

        function nativeKeyListener(e){
          if ( e.key == "MediaTrackNext" ){
            window.muse.player.control.next();
            e.preventDefault();
          }
          if ( e.key == "MediaTrackPrevious" ){
            window.muse.player.control.prev();
            e.preventDefault();
          }
        }

        // Clean
        $(document).off("keydown",nativeKeyListener);

        if ( 'mediaSession' in navigator ){
          navigator.mediaSession.setActionHandler('previoustrack', null);
          navigator.mediaSession.setActionHandler('nexttrack', null);
          navigator.mediaSession.setActionHandler('play', null);
          navigator.mediaSession.setActionHandler('pause', null);
        }

        // Set
        if ( mediaType != "youtube" && ( 'mediaSession' in navigator ) ){

          navigator.mediaSession.setActionHandler('previoustrack', function() {
            window.muse.player.control.prev()
          });
          navigator.mediaSession.setActionHandler('nexttrack', function() {
            window.muse.player.control.next();
          });
          navigator.mediaSession.setActionHandler('play', function() {
            window.muse.player.control.play()
          });
          navigator.mediaSession.setActionHandler('pause', function() {
            window.muse.player.control.pause()
          });

        }
        else {

          $(document).on("keydown",nativeKeyListener);

        }

      },
      reset: function(){

      },
      destroy: function($redo){
        window.muse.queue.destroy();
        window.ui.body.removeClass("muse_active",true);
        window.ui.body.removeClass("muse_player_active",true);
        window.ui.body.removeClass("muse_youtube_active",true);
        window.ui.body.removeClass("muse_audio_active",true);
        window.ui.body.removeClass("muse_video_active",true);
        window.ui.body.removeClass("muse_soundcloud_active",true);
        window.muse.player.control.pause();
        if ( !$redo ){
          setTimeout( function(){
            window.muse.player.setup.destroy(true);
          },100);
        }
      },
      move_frame: function( $place, $force ){

        if ( $place == window.muse.player.setup.iframe_pos && $force !== true )
        return;

        window.muse.player.setup.iframe_pos = $place;

        if ( $place == "queue" ){

          $(document).find(".queue")[0].scrollTop = 0
          var graphPos = $(document).find(".queue .graph_wrapper").offset();

          if ( graphPos ){
            $(document)
            .find( "#players" )
            .css( "top", graphPos.top + "px" )
            .css( "left", graphPos.left + "px" )
            .css( "width", $(document).find(".queue .graph_wrapper").outerWidth() + "px" )
            .css( "height", $(document).find(".queue .graph_wrapper").outerHeight() + "px" )
          }

        }
        else if ( $place == "normal" ){

          $(document)
          .find( "#players" )
          .css( "top", "" )
          .css( "left", "" )
          .css( "width", "" )
          .css( "height", "" )

        }
        else if ( $place == "hide" ){

          $(document)
          .find( "#players" )
          .css( "left", "200vh" )

        }

      },

      audio: { 
        cache: {
          ended: false,
          streamMetaDataTimer: null,
          streamMetaDataID: null,
        },
        Amplitude: null,
        AmplitudeExePromise: null,
        streamMetaData: function( source ){

          if ( window.muse.player.setup.audio.cache.streamMetaDataTimer ){
            clearTimeout( window.muse.player.setup.audio.cache.streamMetaDataTimer );
          }
          window.muse.player.setup.audio.cache.streamMetaDataID = window.muse.queue.active.get().data.ID;
          window.muse.queue.active.addXhr( window.becli.exe({
            endpoint: "muse_stream_heads",
            post: {
              object: window.muse.queue.active.get().data.ot,
              hash: window.muse.queue.active.get().data.hash,
              ID: window.muse.queue.active.get().data.ID,
              url: source ? source.address : null
            },
            callBack: function( sta, data ){
              if ( sta ? window.muse.player.setup.audio.cache.streamMetaDataID == window.muse.queue.active.get().data.ID : false ){
                $(document).find("#player .data_wrapper .source_data ._title").text( data.desc )
                $(document).find("#player .data_wrapper .source_data ._sub_title").html( "<span style='color:rgba(var(--c_orange))'>"+data.name+"</span>" )
                $(document).find(".queue #preview .text_wrapper>a.title").text( data.desc )
                $(document).find(".queue #preview .text_wrapper>a.sub_title").html( "<span style='color:rgba(var(--c_orange))'>"+data.name+"</span>" )
              }
            }
          }) );

          window.muse.player.setup.audio.cache.streamMetaDataTimer = setTimeout( function(){
            if ( window.muse.player.setup.audio.cache.streamMetaDataID == window.muse.queue.active.get().data.ID )
            window.muse.player.setup.audio.streamMetaData()
          }, 15000 );

        },
        pre: function( exeArgs, sourceArgs ){

          if ( !window.muse.player.setting._ipi && navigator ? (
            navigator.userAgent ? (
              navigator.userAgent.includes("Safari") && navigator.platform == "iPhone" && sourceArgs.address
            ) : false
          ) : false ){
            window.muse.player.setting._ipi = true;
            // window.muse.player.setting.set( "muted", true );
            var _preLoad = new Audio( sourceArgs.address );
            _preLoad.load();
          }

          var promise = $.Deferred();
          window.bof._loadExtension({
            name: "amplitudejs",
            path: "amplitude.js",
            base: "https://cdn.jsdelivr.net/npm/amplitudejs@5.3.2/dist/",
            dir: "",
            skipNameCheck: true,
            version: false
          }).done(function(){
            promise.resolve();
          }).fail(function(){
            promise.reject("Loading amplitude.js failed");
          });
          return promise;

        },
        exe: function( exeArgs, sourceArgs ){

          var promise = $.Deferred();
          window.muse.player.setup.audio.AmplitudeExePromise = promise;
          window.muse.player.setup.audio.cache.ended = false;

          if ( window.muse.player.setup.audio.Amplitude ){

            var newSong = window.muse.player.setup.audio.Amplitude.addSong({
              name:window.muse.queue.active.get().data.title,
              artist: window.muse.queue.active.get().data.sub_title,
              url: sourceArgs.address,
              cover_art_url:window.muse.queue.active.get().data.cover
            });
            window.muse.player.setup.audio.Amplitude.skipTo( 0, newSong );

          }
          else {

            window.muse.player.setup.audio.Amplitude = Amplitude;
            window.muse.player.setup.audio.Amplitude.init({

              preload: "auto",
              continue_next: false,
              delay: 1000,
              songs: [{
                name: window.muse.queue.active.get().data.title,
                artist: window.muse.queue.active.get().data.sub_title,
                url: sourceArgs.address,
                cover_art_url: window.muse.queue.active.get().data.cover
              }],
              callbacks: {
                initialized: function () {
                  window.muse.log("Player.Setup.Audio.Amplitude -> Initialized");
                  if (window.muse.player.setting._ipi !== true)
                    window.muse.player.control.pause();
                },
                stop: function(){
                  window.muse.player.change_sta("stopped","Amplitude.stop");
                },
                loadstart: function(){
                  window.muse.player.change_sta("loading","Amplitude.loadstart");
                  if ( window.muse.player.setting._ipi === true && window.muse.player.setting._ipf === false ){
                    window.muse.player.setting._ipf = true;
                    setTimeout(function(){
                      window.muse.player.control.mute();
                      window.muse.player.control.pause();
                      window.muse.player.control.play();
                      window.muse.player.control.mute();
                      setTimeout(function(){
                          window.muse.player.control.unmute();
                      },1000);
                    },400);
                  }
                },
                loadeddata: function(){

                  window.muse.player.change_sta("loaded","Amplitude.loadeddata");

                  if ( window.muse.player.setup.audio.Amplitude.getSongDuration() === Infinity ){
                    $(document).find("#player").addClass("infinite_source");
                    window.muse.player.setup.audio.streamMetaData( sourceArgs );
                  }

                  if ( window.muse.queue.active.get()?.source?.type[1]?.preview ){
                    $(document).find("#player").addClass("preview_source");
                    $(document).find("#player .data_wrapper .source_data ._sub_title")
                    .addClass("_preview_wrapper")
                    .html("<span class='preview'>"+window.lang.return( "preview", { ucfirst: true } )+"</span>")
                  }

                  if ( window.muse.ads.playing )
                  $(document).find("#player").addClass("thingie_attached");

                },
                pause: function(){
                  window.muse.player.change_sta("paused","Amplitude.pause");
                  if ( window.muse._config.embed && !window.muse._config.embed_inied )
                  window.muse._config.embed_inied = true;
                },
                play: function(){
                  window.muse.player.change_sta("played","Amplitude.play");
                },
                playing: function(){
                  window.muse.player.change_sta("playing","Amplitude.playing");
                },
                seeked: function(){
                  window.muse.player.change_sta("seeked","Amplitude.seeked");
                  if ( window.muse.player.setting._ipi === true ){
                    window.muse.player.control.play();
                  }
                },
                canplay: function(){

                  window.muse.player.change_sta("canplay","Amplitude.canplay");

                  if ( window.muse._config.embed ? window.muse._config.embed_inied : ( window.muse.player.setup.audio.cache.ended === false ? ( exeArgs ? exeArgs.just_load !== true || exeArgs.just_loaded === true : true ) : false ) ){
                    window.muse.log( "Audio.CanPlay -> Already-loaded OR autoplay-on -> PLAY" );
                    window.muse.player.control.play();
                  }

                  else {
                    window.muse.log( "Audio.CanPlay -> just_load:" + exeArgs.just_load + ", just_loaded:" + exeArgs.just_loaded  + ", ended:" + window.muse.player.setup.audio.cache.ended );
                    window.muse.player.control.pause();
                    window.muse.player.change_sta( "paused", "Amplitude.canplay" );
                    exeArgs.just_loaded = true;
                  }

                  if ( window.muse.player.setup.audio.AmplitudeExePromise.state() == "pending" )
                  window.muse.player.setup.audio.AmplitudeExePromise.resolve();

                },
                ended: function(){
                  window.muse.player.setup.audio.cache.ended = true;
                  window.muse.player.change_sta( "ended", "Amplitude.ended" );
                },
                error: function( err ){
                  window.muse.log( "Player.Setup.Audio.Amplitude -> Error", 9, { css: 'color:red' } );
                  window.muse.player.setup.audio.AmplitudeExePromise.reject( "Loading file failed" );
                },
                abort: function( err ){
                  window.muse.log( "Player.Setup.Audio.Amplitude -> Abort", 9, { css: 'color:red' } );
                  try {
                    window.muse.player.setup.audio.Amplitude.pause();
                  } catch( err ){}
                }
              }

            });

          }

          window.muse.player.setup.audio.Amplitude.setVolume( window.muse.player.setting.get( "volume" ) );
          if ( window.muse.player.setting.get( "muted" ) ) window.muse.player.setup.audio.Amplitude.setVolume( 0 );

          return promise;

        },
        ext: function(){},
        halt: function(){

          if ( window.muse.player.setup.audio.cache.streamMetaDataTimer ){
            clearTimeout( window.muse.player.setup.audio.cache.streamMetaDataTimer );
          }

          try {
            window.muse.log( "Player.Setup.Audio.Halting" );
            window.muse.player.setup.audio.Amplitude.removeSong(0);
            window.muse.player.setup.audio.Amplitude.pause();
          } catch( $err ){}

          $(document).find("#player.infinite_source").removeClass("infinite_source");
          $(document).find("#player.preview_source").removeClass("preview_source");
          $(document).find("#player.thingie_attached").removeClass("thingie_attached");
          $(document).find("#player .data_wrapper .source_data ._sub_title._preview_wrapper").removeClass("_preview_wrapper")

        }
      },
      video: {
        cache: {},
        videojs: null,
        pre: function( exeArgs, sourceArgs ){

          var promise = $.Deferred();
          var promiseJS = $.Deferred();
          var promiseHLS = $.Deferred();
          var promiseCSS = $.Deferred();

          if ( $(document).find("#players").hasClass("hls_audio") ){
            $(document).find("#players").removeClass("hls_audio");
          }

          window.bof._loadExtension({
            name: "video__js",
            path: "video.min.js",
            base: "https://vjs.zencdn.net/8.16.1/",
            dir: "",
            verion: false,
            skipNameCheck: true
          }).done(function(){
            promiseJS.resolve();
            if ( sourceArgs.hls ){

              /*window.bof._loadExtension({
                name: "videojs-http-streaming.min.js",
                path: "videojs-http-streaming.min.js",
                base: "https://cdn.jsdelivr.net/npm/@videojs/http-streaming@3.3.0/dist/",
                dir: "",
                version: false,
                skipNameCheck: true
              }).done(function(){
                promiseHLS.resolve();
              }).fail(function(){
                promiseHLS.reject("Loading videojs-http-streaming.min.js failed");
              });*/

              if ( sourceArgs.type ? sourceArgs.type == "audio" : false ){
                $(document).find("#players").addClass("hls_audio")
                if ( window.muse._config.embed ){
                  window.ui.body.addClass("muse_audio_active",true);
                  window.ui.body.removeClass("muse_video_active",true);
                }
              }
              promiseHLS.resolve();

            }
            else {
              promiseHLS.resolve();
            }

          }).fail(function(){
            promiseJS.reject("Loading videojs.js failed");
          });

          promiseCSS.resolve();

          $.when( promiseJS, promiseCSS, promiseHLS ).done(function(){
            promise.resolve();
          }).fail(function(err){
            promise.reject(err);
          });

          return promise;

        },
        exe: function( exeArgs, sourceArgs ){

          var promise = $.Deferred();

          $(document).find("#videojs").html("<video playsinline crossorigin='anonymous'></video>");

          var player = $(document).find("#videojs video")[0];
          var videojs = null;
          var videojs_config = {
            debug: true,
            autoplay: false,
            aspectRatio: '16:9',
            loop: false,
            repeat: false,
          };

          if ( sourceArgs.hls ){

            window.muse.log( "Player.Setup.Video.HLS -> Start" );
            videojs_config["html5"] = {
              vhs: {},
            };
            videojs = window.videojs( player, videojs_config );
            videojs.src({
              src: sourceArgs.address,
              type: 'application/x-mpegURL',
              // withCredentials: true
            });
            window.muse.player.change_sta("loaded","video.exe.hls");

          }
          else {

            window.muse.log( "Player.Setup.Video -> NoHLS Start" );
            let newSource = document.createElement('source');
            newSource.src = sourceArgs.address;
            if ( sourceArgs.format ) newSource.type = sourceArgs.format;
            player.appendChild(newSource);
            videojs = window.videojs( player, videojs_config );
            window.muse.player.change_sta("loaded","video.exe.nohls");

          }

          if ( !videojs ){
            if ( !window.muse._config.embed )
            window.app.becli.alert( false, window.lang.return("failed") );
            window.muse.log( "Player.Setup.Video -> Player ini failed" );
          }
          else {

            videojs.on('ready', function( event ) {});
            videojs.on('play', function() {
              window.muse.player.change_sta("playing","VideoJS.play");
            });
            videojs.on('playing', function() {
              window.muse.player.change_sta("playing","VideoJS.playing");
            });
            videojs.on('pause', function() {
              window.muse.player.change_sta("paused","VideoJS.pause");
            });
            videojs.on('seeking', function() {
              window.muse.player.change_sta("seeked","VideoJS.seeking");
            });
            videojs.on('seeked', function() {
              window.muse.player.change_sta("playing","VideoJS.seeked");
            });
            videojs.on('ended', function() {
              window.muse.player.change_sta("ended","VideoJS.ended");
            });
            videojs.on('waiting', function() {
              window.muse.player.change_sta("loading","VideoJS.waiting");
            });
            videojs.on('canplay', function() {

              window.muse.player.change_sta("canplay","VideoJS.canplay");

              window.muse.log( "Video: Ready" );
              window.muse.player.change_sta("loadeddata","VideoJS.canplay");

              if ( window.muse._config.embed ? false : ( exeArgs ? exeArgs.just_load !== true || exeArgs.just_loaded === true : true ) )
              window.muse.player.control.play();

              else {
                window.muse.player.change_sta( "paused" ,"VideoJS.canplay");
                exeArgs.just_loaded = true;
              }

              window.muse.player.control.setVolume();

            });
            videojs.on('canplaythrough', function() {
            });
            videojs.on('error', function( $err ) {
              window.muse.log( "VI: Event ERROR" );
              console.log( $err );
              window.muse.player.change_sta("error","VideoJS.error");
            });

            window.muse.player.setup.video.videojs = videojs;

            promise.resolve();

          }

          return promise;

        },
        ext: function(){},
        halt: function(){
          var promise = $.Deferred();
          try {
            window.muse.player.setup.video.videojs.dispose();
          } catch( $err ){}
          promise.resolve();
          return promise;
        }
      },
      youtube: {
        wakeLock: null,
        iframe: null,
        iframe_ready: $.Deferred(),   
        pre: function( exeArgs, sourceArgs ){

          var promise = $.Deferred();
          var assetPromise = $.Deferred();       

          window.bof._loadExtension({
            name: "iframe_api",
            path: "iframe_api",
            base: "https://www.youtube.com/",
            dir: "",
            skipNameCheck: true,
            cache: false,
            version: false
          }).done(function(){
            assetPromise.resolve();
          }).fail(function(){
            assetPromise.reject("Loading Youtube iFrame JS failed");
          });

          $.when( assetPromise, window.muse.player.setup.youtube.iframe_ready )
          .done(function(){
            promise.resolve();
          })
          .fail(function(err){
            promise.reject(err);
          })

          if ("wakeLock" in navigator) {
            try {
              window.muse.player.setup.youtube.wakeLock = navigator.wakeLock.request("screen");
            } catch ( $err ){}
          }

          return promise;

        },
        exe: function( exeArgs, sourceArgs ){

          var promise = $.Deferred();

          if ( window.muse.player.setup.youtube.iframe ){
            window.muse.player.setup.youtube.iframe.loadVideoById( sourceArgs.youtube_id );
            window.muse.player.setup.youtube.iframe.playVideo();
          }
          else {
            window.muse.player.setup.youtube.iframe =
            new YT.Player( 'youtube', {
              width: "100%",
              height: "100%",
              videoId: sourceArgs.youtube_id,
              events: {

                onReady: function( event ){

                  window.muse.log( "YT: Ready" );
                  window.muse.player.change_sta( "loadeddata", "YouTube.onReady" );

                  if ( window.muse._config.embed ? false : ( exeArgs ? exeArgs.just_load !== true || exeArgs.just_loaded === true : true ) )
                  window.muse.player.control.play();

                  else {
                    window.muse.player.change_sta( "paused", "YouTube.onReady" );
                    exeArgs.just_loaded = true;
                  }

                  window.muse.player.control.setVolume();

                },
                onStateChange: function( event ){

                  window.muse.log( "YT: onStateChange data=" + event.data );
                  if ( event.data == 1 ) window.muse.player.change_sta("playing","YouTube.OnStateChange: 1");
                  else if ( event.data == 2 ) window.muse.player.change_sta("paused","YouTube.OnStateChange: 2");
                  else if ( event.data == 3 ) window.muse.player.change_sta("loading","YouTube.OnStateChange: 3");
                  else if ( event.data == 0 ) window.muse.player.change_sta("ended","YouTube.OnStateChange: 0");

                },
                onError: function( event ){
                  if ( event.data == 101 || event.data == 150 ){
                    window.muse.player.report_source()
                  }
                  window.muse.log( "YT: onError" + JSON.stringify( event ), 9, { css: "color:red" } );
                },
                onApiChange: function( event ){
                  window.muse.log( "YT: onApiChange" + JSON.stringify( event ), 9, { css: "color:red" } );
                },
              },
              playerVars: {
                autoplay: 0,
                rel: 0,
                showinfo: 0,
                disablekb: 1,
                controls: 0,
                modestbranding: 1,
                iv_load_policy: 3,
                playsinline: 1,
                host: window.location.protocol + '//www.youtube.com'
              },
            });
          }

          promise.resolve();
          return promise;

        },
        ext: function(){},
        halt: function(){
          if ( window.muse.player.setup.youtube.wakeLock ){
            try {
              window.muse.player.setup.youtube.wakeLock.release();
            } catch( $err ){}
            window.muse.player.setup.youtube.wakeLock = null;
          }
          try {
            window.muse.player.setup.youtube.iframe.stopVideo();
          } catch( $err ){}
        }
      },
      soundcloud: {
        ID: null,
        getID: function(){
          return window.muse.player.setup.soundcloud.ID;
        },
        setID: function( $val ){
          window.muse.player.setup.soundcloud.ID = $val;
        },
        iframe: null,
        pre: function( exeArgs, sourceArgs ){

          var assetPromise = $.Deferred();
          window.bof._loadExtension({
            name: "soundclud_widget_api",
            path: "api.js",
            base: "https://w.soundcloud.com/player/",
            dir: "",
            skipNameCheck: true,
            cache: false,
            version: false
          }).done(function(){
            assetPromise.resolve();
          }).fail(function(){
            assetPromise.reject("Loading Soundclud Widget Api failed");
          });
          return assetPromise;

        },
        exe: function( exeArgs, sourceArgs ){

          var _sID = window.muse.queue.active.get();

          var promise = $.Deferred();
          var ID = window._g.uniqid()
          window.muse.player.setup.soundcloud.setID( ID );

          if ( window.muse.player.setup.soundcloud.iframe ){

            window.muse.player.setup.soundcloud.iframe.load(
              "https://api.soundcloud.com/tracks/" + ( sourceArgs.ID ? sourceArgs.ID : sourceArgs.soundcloud_id ),
              {
                autoplay: true,
                show_comments: true,
                show_user: true,
                visual: true,
                callback: function(){

                  var nID = window.muse.player.setup.soundcloud.getID();
                  if ( nID === null || nID !== ID ){
                    window.muse.log( "SC: IDs don't match" );
                    promise.resolve();
                    return;
                  }

                  var sID = window.muse.queue.active.get();
                  if ( sID !== _sID ){
                    window.muse.log( "SR: IDs don't match" );
                    window.muse.player.change_sta("loaded","soundcloud.loaded");
                    promise.resolve();
                    return;
                  }

                  setTimeout(function(){
                    window.muse.player.change_sta("loaded","soundcloud.loaded");
                    window.muse.player.change_sta("canplay","soundcloud.canplay");
                    window.muse.player.control.play();
                  },100);

                  promise.resolve();
                }
              }
            );

          }
          else {

            $(document).find("#players #soundcloud").html("<iframe id='soundcloud_iframe' allow=autoplay scrolling='no' frameborder='no' src='https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/"+ sourceArgs.ID +"&amp;auto_play=true&amp;show_comments=false&amp;show_user=true&amp;visual=true'></iframe>");

            var sc_player = SC.Widget("soundcloud_iframe");

            sc_player.bind( SC.Widget.Events.READY, function(){

              window.muse.log( "SC: Event READY" );

              var nID = window.muse.player.setup.soundcloud.getID();

              if ( nID === null || nID !== ID ){
                window.muse.log( "SC: IDs don't match" );
                sc_player.pause();
                promise.resolve();
                return;
              }

              var sID = window.muse.queue.active.get();
              if ( sID !== _sID ){
                window.muse.log( "SR: IDs don't match" );
                window.muse.player.change_sta("loaded","soundcloud.exe");
                sc_player.pause();
                promise.resolve();
                return;
              }

              window.muse.player.change_sta("loaded","soundcloud.exe");
              window.muse.player.change_sta("canplay","soundcloud.exe");

              sc_player.bind( SC.Widget.Events.LOAD_PROGRESS, function(){
                window.muse.log( "SC: Event LOAD_PROGRESS" );
                window.muse.player.change_sta("loading","SoundCloud.LOAD_PROGRESS");
              } );
              sc_player.bind( SC.Widget.Events.PLAY_PROGRESS, function(){
              } );
              sc_player.bind( SC.Widget.Events.PLAY, function(){
                window.muse.log( "SC: Event PLAY" );
                window.muse.player.change_sta("playing","SoundCloud.PLAY");
              } );
              sc_player.bind( SC.Widget.Events.PAUSE, function(){
                window.muse.log( "SC: Event PAUSE" );
                window.muse.player.change_sta("paused","SoundCloud.PAUSE");
              } );
              sc_player.bind( SC.Widget.Events.FINISH, function(){
                window.muse.log( "SC: Event FINISH" );
                window.muse.player.change_sta("ended","SoundCloud.FINISH");
              } );
              sc_player.bind( SC.Widget.Events.SEEK, function(){
                window.muse.log( "SC: Event SEEK" );
                window.muse.player.setup.soundcloud.iframe.isPaused(function(_p){
                  if ( !_p ) window.muse.player.change_sta("seeked","SoundCloud.SEEK");
                });
              } );
              sc_player.bind( SC.Widget.Events.ERROR, function(){
                window.muse.log( "SC: Event ERROR" );
                window.muse.player.change_sta("error","SoundCloud.ERROR");
              } );

              window.muse.player.setup.soundcloud.iframe = sc_player;

              promise.resolve();

            } );

          }

          promise.done(function(){
            window.muse.player.control.setVolume();
          });

          return promise;

        },
        ext: function(){
        },
        halt: function(){
          try {
            window.muse.player.setup.soundcloud.iframe.pause();
            $(document).find(".soundcloud_iframe_wrapper").remove();
            window.muse.player.setup.soundcloud.setID( null );
          } catch( $err ){
            console.log( $err );
          }
        }
      },

    },
    report_source: function( type, args ){

      // if ( !window.muse._config.embed )
      // window.app.becli.alert( false, window.lang.return( "reporting", { ucfirst: true } ) );

      window.muse.queue.active.addXhr( window.becli.exe({
        liquid: true,
        ID: "muse_report",
        endpoint: "muse_report",
        post: {
          data: JSON.stringify(window.muse.queue.active.get().data),
          source: JSON.stringify(window.muse.queue.active.get().source),
        },
        callBack: function( sta, data ){
          if ( sta ? data?.rep?.new_youtube_id : false){
            window.muse.player.setup.youtube.iframe.loadVideoById( data.rep.new_youtube_id );
            window.muse.player.setup.youtube.iframe.playVideo();
          }
        }
      }) );

    },
    destroy: function(){

      $(document).find("#player").remove();
      window.ui.body.removeClass( "muse_active", true );

    },
    change_sta: function( sta, $from ){

      var mainSta = null;
      window.muse.log( "Player.Change_sta -> " + sta + " from:" + $from, 9, { css: 'color:green' } );

      if ( sta == "playing" || sta == "seeked" )
      mainSta = "playing";
      else if ( sta == "paused" || sta == "loaded" )
      mainSta = "paused";
      else
      mainSta = "loading";

      if ( mainSta == "playing" ){
        window.muse.player.control.graph();
      } else {
        clearTimeout( window.muse.player._cron )
      }

      window.muse.player._status = mainSta;
      window.muse.focus.set_status( mainSta );
      window.muse.player.control.ui();
      window.muse.recorder.exe( mainSta );

      if ( sta == "ended" ){

        if ( $(document).find("#player").hasClass("preview_source") ){
          window.app.actions.get_unlock_solution(
            window.muse.queue.active.get().data.ot,
            window.muse.queue.active.get().data.hash
          )
        }

        if (window.muse.ads.playing) {

          window.muse.log( "Ads: Player.Sta.Ended: Done. played in full" );

          window.muse.ads.playing = null;
          window.muse.ads.cache = null;
          window.muse.player.setting.set("thingie", window._g._mt());
          window.muse.player.control.stop();

          this.full_stop();

          if (window.muse.queue._open) {
            window.muse.queue.preview();
          }

          setTimeout(function () {
            window.muse.log( "Ads: Player.Sta.Ended: Resuming the track now" );
            window.muse.player.setup.exe({
              skipAdCheck: true
            });
          }, 1000)

        }
        else {
          this.full_stop();
          window.muse.player.control.stop();
          window.muse.player.control.next( "soft" );
        }

      }
      if ( sta == "error" ){
        window.muse.player.control.next();
      }

    },
    full_stop: function(){

      window.muse.log( "Player.FULL_STOP" );

      try {
        window.muse.player.setup.audio.Amplitude.pause();
        window.muse.player.setup.audio.Amplitude.stop();
        window.muse.player.setup.audio.Amplitude.removeSong(0);
      } catch( err ){
      }

      try {
        window.muse.player.setup.video.videojs.dispose();
      } catch( $err ){}

      try {
        window.muse.player.setup.youtube.iframe.stopVideo();
      } catch( $err ){}

      try {
        window.muse.player.setup.soundcloud.iframe.pause();
        $(document).find(".soundcloud_iframe_wrapper").remove();
        window.muse.player.setup.soundcloud.setID( null );
      } catch( $err ){
      }

    }

  },
  recorder: {

    cache: {
      timer: null,
      played: 0,
      sent: false
    },
    exe: function( newSta ){

      if ( newSta == "playing" )
      window.muse.recorder.setTimer();

      else
      window.muse.recorder.clearTimer();

    },
    setTimer: function(){

      window.muse.recorder.cache.timer = setTimeout(function(){

        if ( window.muse.player._status )
        window.muse.recorder.cache.played += 1;

        if ( window.muse.recorder.cache.played >= 5 && !window.muse.recorder.cache.sent && !window.muse._config.embed ){
          window.muse.recorder.cache.sent = true;
          window.becli.exe({
            endpoint: "muse_record",
            liquid: true,
            post: {
              object_type: window.muse.focus.get().object_type,
              object_hash: window.muse.focus.get().object_hash
            }
          });
        }

        window.muse.recorder.setTimer();

      },1000);

    },
    clearTimer: function(){

      if ( window.muse.recorder.cache.timer ){
        clearTimeout( window.muse.recorder.cache.timer );
        window.muse.recorder.cache.timer = null;
      }

    },
    reset: function(){

      window.muse.recorder.clearTimer();
      window.muse.recorder.cache.played = 0;
      window.muse.recorder.cache.sent = false;

    }

  },
  lyrics: {

    cache: {
      ready: false
    },
    get: function(){

      var promise = $.Deferred();
      var active = window.muse.queue.active.get();

      if ( !active.data.lyrics ){
        promise.reject("No lyrics available");
        return promise;
      }

      window.becli.exe({
        endpoint: "muse_fetch_lyrics",
        post: active.data,
        liquid: true,
        ID: "fetch_lyrics",
        callBack: function( sta, data ){
          if ( sta )
          promise.resolve( data );
          else
          promise.reject( data );
        }
      });

      return promise;

    },
    display: function(){

      var active = window.muse.queue.active.get();

      if ( window.muse.lyrics.cache.ready && window.muse.lyrics.cache.ID === active.ID ){
        window.muse.lyrics.set( "lyrics", window.muse.lyrics.cache.ready );
      }
      else {

        window.muse.lyrics.set( "loading" );
        window.muse.lyrics.get().done(function( result ){
          window.muse.lyrics.set( "lyrics", result );
          window.muse.lyrics.cache.ready = result;
          window.muse.lyrics.cache.ID = active.ID
        }).fail(function(error){
          window.muse.lyrics.set( "failed", error.messages[0] );
        });

      }

    },
    set: function( sta, data ){

      if ( sta == "loading" ){
        $(document).find(".queue .data_wrapper .tBody .lyrics").html("<div class='loader'><span class='mdi mdi-refresh spin'></span></div>");
      }
      else if ( sta == "failed" ){
        $(document).find(".queue .data_wrapper .tBody .lyrics").html(
          "<div class='error'><span class='mdi mdi-emoticon-sad-outline'></span>"+ data +"</div>"
        );
      }
      else {
        if ( data.type == "musixmatch" ){
          $(document).find(".queue .data_wrapper .tBody .lyrics").html(
            "<div class='text'>"+ data.lyrics.lyrics_body.replace(/\n/g, "<br />") +"</div>" +
            "<div class='copyright'>"+ data.lyrics.lyrics_copyright.replace(/\n/g, "<br />") +"</div>" +
            ( "<img src='"+data.lyrics.pixel_tracking_url+"' alt='tracking' class='tracking_img'>" )
          );
        }
        else if ( data.type == "local" ){
          $(document).find(".queue .data_wrapper .tBody .lyrics").html(
            "<div class='text'>"+ data.lyrics +"</div>"
          );
        }
      }

    }

  },
  infinite: {

    cache: {
      has_more: true
    },
    getItems: function(){

      if ( $("body").hasClass("queue_hide_infinite") )
      return;

      return window.muse.infinite.cache.items;

    },
    simplify_queue: function(){

      var _items = window.muse.queue._items;
      var _items_s = {};
      if ( _items ){
        for ( var i=0; i<Object.keys(_items).length; i++ ){
          var _item_k = Object.keys(_items)[i];
          var _item = _items[ _item_k ];
          if ( _item.data ? _item.data.hash : false ){
            _items_s[ i ] = {
              object_type: _item.data.ot,
              object_hash: _item.data.hash,
              title: _item.data.title
            };
          }
        }
      }

      return _items_s;

    },
    simplify_infinite: function(){

      var _items = window.muse.infinite.getItems();
      var _items_s = {};
      if ( _items ){
        for ( var i=0; i<Object.keys(_items).length; i++ ){
          var _item_k = Object.keys(_items)[i];
          var _item = _items[ _item_k ];
          _items_s[ i ] = {
            object_type: _item.ot,
            object_hash: _item.hash,
            title: _item.title
          };
        }
      }

      return _items_s;

    },
    start: function( object_type, object_hash, widget ){

      if ( $("body").hasClass("queue_hide_infinite") )
      return;

      var widgetID = null;
      if ( widget ){
        if ( widget === "offline" )
        widgetID = "offline";
        else if ( typeof( widget ) == "string" )
        widgetID = widget;
        else
        widgetID = widget.ID
      }

      var _items_s = window.muse.infinite.simplify_queue();

      var page_name = null;
      if ( window.ui.page.curr().name )
      page_name = window.ui.page.curr().name;
      window.muse.infinite.cache.page_name = page_name;

      var page_url = null;
      if ( window.ui.page.curr().u_args ? ( window.ui.page.curr().u_args.urlData ? window.ui.page.curr().u_args.urlData.url.full : false ) : false )
      page_url = window.ui.page.curr().u_args.urlData.url.full;
      window.muse.infinite.cache.page_url = page_url;

      var page_ot = null;
      if ( window.ui.page.curr().data.becli ? ( window.ui.page.curr().data.becli.single ? window.ui.page.curr().data.becli.single.data : false ) : false )
      page_ot = window.ui.page.curr().data.becli.single.data.ot;
      window.muse.infinite.cache.page_ot = page_ot;

      var page_hash = null;
      if ( window.ui.page.curr().data.becli ? ( window.ui.page.curr().data.becli.single ? window.ui.page.curr().data.becli.single.data : false ) : false )
      page_hash =  window.ui.page.curr().data.becli.single.data.hash;
      window.muse.infinite.cache.page_hash = page_hash;

      window.muse.infinite.cache.object_type = object_type;
      window.muse.infinite.cache.object_hash = object_hash;
      window.muse.infinite.cache.widgetID = widgetID;
      window.muse.infinite.cache.items = {};
      window.muse.infinite.cache.page = 1;
      window.muse.infinite.cache.queue = _items_s;
      $(document).find(".queue .list .next_items").html( "" );

      if ( widgetID === "offline" ){

        var offlineInfinite = [];
        window.bof_offline.db.list().done(function(items){
          if ( items ){
            for ( var z=0; z<Object.keys(items).length; z++ ){
              var itemKey = Object.keys(items)[z];
              var item = items[ itemKey ];
              offlineInfinite.push( item["data"]["muse"]["data"] );
            }
          }
        });

        window.muse.infinite.cache.items = offlineInfinite;
        window.muse.infinite.build();

        window.muse.infinite.cache.has_more = false;
        window.muse.infinite._set();

      }
      else {

        window.becli.exe({
          endpoint: "muse_infinite" + window.location.search,
          liquid: true,
          post: {
            object_type: object_type,
            object_hash: object_hash,
            widget_id: widgetID,
            page_name: page_name,
            page_url: page_url,
            page_ot: page_ot,
            page_hash: page_hash,
            queue: JSON.stringify( _items_s ),
            seed: JSON.stringify( _items_s )
          },
          callBack: function( sta, data, args ){
            if ( sta ){

              window.muse.infinite.cache.items = data.items;
              window.muse.infinite.build();

              window.muse.infinite.cache.has_more = data.has_more
              window.muse.infinite._set();

            }
          }
        });

      }

    },
    more: function(){

      if ( $("body").hasClass("queue_hide_infinite") )
      return;

      if ( !window.muse.infinite.cache.has_more )
      return;

      if ( $("body").hasClass("queue_hide_infinite") )
      return;

      var _items_s = window.muse.infinite.simplify_queue();
      var curPage = window.muse.infinite.cache.page;
      var nextPage = curPage + 1;
      window.muse.infinite.cache.page = nextPage;

      window.becli.exe({
        endpoint: "muse_infinite" + window.location.search,
        liquid: true,
        post: {
          object_type: window.muse.infinite.cache.object_type,
          object_hash: window.muse.infinite.cache.object_hash,
          widget_id: window.muse.infinite.cache.widgetID,
          widget_page: nextPage,
          page_name: window.muse.infinite.cache.page_name,
          page_url: window.muse.infinite.cache.page_url,
          page_ot: window.muse.infinite.cache.page_ot,
          page_hash: window.muse.infinite.cache.page_hash,
          queue: JSON.stringify( _items_s ),
          seed: JSON.stringify( window.muse.infinite.cache.queue ),
          infinite: JSON.stringify( window.muse.infinite.simplify_infinite() )
        },
        callBack: function( sta, data, args ){
          if ( sta ){

            var combine = {};
            if ( data.items ){
              var oldies = window.muse.infinite.cache.items ? window.muse.infinite.cache.items : [];
              for ( var i=0; i<oldies.length; i++ ){
                var oldie = oldies[i];
                combine[ oldie.ot + oldie.hash ] = oldie;
              }
              for ( var i=0; i<data.items.length; i++ ){
                var newbee = data.items[i];
                combine[ newbee.ot + newbee.hash ] = newbee;
              }
            }

            window.muse.infinite.cache.items = Object.values( combine );
            window.muse.infinite.build();

            window.muse.infinite.cache.has_more = data.has_more
            window.muse.infinite._set();

          }
        }
      });

    },
    build: function(){

      if ( window.muse.queue._open === false ) return;

      var items = window.muse.infinite.getItems();
      if ( !items ) return;

      var que = "";
      for ( var i=0; i<Object.keys(items).length; i++ ){
        var item_k = Object.keys(items)[i];
        var item = items[item_k];
        que += "<div class='item bof_"+item.ot+"_"+item.hash+" no_action clearafter' id='bof_queue_"+item_k+"'>";
        que += "<div class='cover_holder'><div class='cover' style='background-image:url(\"" + item.cover + "\")'></div></div>";
        que += "<div class='detail'>";
        que += "<div class='title'>"+ item.title +"</div>";
        if ( item.sub_data )
        que += "<div class='sub_title'>"+ item.sub_data +"</div>";
        que += "</div>";
        que += "</div>";
      }

      $(document).find(".queue .list .next_items").html( que );

    },
    hasItems: function(){

      if ( !window.muse.infinite.getItems() ) return false;
      return Object.keys( window.muse.infinite.getItems() ).length ? true : false

    },
    load: function(){

      window.muse.player.control.pause();
      window.muse.player.change_sta( "loading", "Infinite.Load" );
      setTimeout( function(){
        window.muse.player.change_sta( "loading", "Infinite.Load" );
      },10);

      if ( !window.muse.infinite.hasItems() )
      return false;

      var firstItem = window.muse.infinite.getItems().splice( 0, 1 )[0];
      window.muse.request( "last", firstItem.ot, firstItem.hash ).done(function( sources ){
        if ( !$("body").hasClass("queue_disable_auto") )
        window.muse.queue.build();
        window.muse.infinite.build();
        window.muse.player.control.next();
      });

      if ( Object.keys( window.muse.infinite.getItems() ).length < 5 && window.muse.infinite.cache.has_more ){
        window.muse.infinite.more();
      }

    },

    _set: function(){
      window.cache.set( "muse_infinite", JSON.stringify( window.muse.infinite.cache ) )
    },
    _get: function(){
      var _cache = window.cache.get( "muse_infinite" )
      if ( _cache ){
        var _cache_d = JSON.parse( _cache );
        window.muse.infinite.cache = _cache_d;
      }
    }

  },

  load: function(){

    window.muse.queue.load();
    if ( !window.muse._config.embed ){
      window.muse.player.setting.load();
      window.muse.infinite._get();
    }
    if ( window.muse.queue.active.get() ? window.muse.queue.active.get().data : false ){
      window.muse.focus._object_type = window.muse.queue.active.get().data.ot;
      window.muse.focus._object_hash = window.muse.queue.active.get().data.hash;
      window.muse.focus._status = "loading";
      window.muse.focus.ui();
      window.muse.player.setup.exe({just_load: true});
    }

  },
  removeVolBar: function(e){

    if ( $(e.target).hasClass("volume_control") || $(e.target).parents(".volume_control").length )
    return;

    $(document).find("#player .buttons_wrapper .button.volume_control .vol_bar").remove();
    $(document).off("click",window.muse.removeVolBar);

  },
  listen: function(){

    window.muse.queue.ini();
    $(document).on("click",".que_toggle",function(){
      window.muse.queue.toggle();
    });
    $(document).on("click",".que_close",function(){
      window.muse.queue.destroy();
    });
    $(document).on("click",".que_open",function(){
      window.muse.queue.build();
    });
    $(document).on("click",".que_shuffle",function(){
      window.muse.queue.shuffle();
    });
    $(document).on("click",".que_repeat",function(){
      window.muse.player.control.repeatToggle();
    });
    $(document).on("click",".control.play",function(){
      window.muse.player.control.playToggle();
    });
    $(document).on("click",".control.next",function(){
      window.muse.player.control.next();
    });
    $(document).on("click",".control.prev",function(){
      window.muse.player.control.prev();
    });
    $(document).on("click",".button.volume_control",function(){
      if ( window.app.config.mobile ){
        window.muse.player.control.muteToggle();
      } else {
        if ( $(document).find("#player .buttons_wrapper .button.volume_control .vol_bar").length === 0 ){
          var _vh = window.muse.player.setting.get("volume");
          if ( window.muse.player.setting.get("muted") )
          _vh = 0;

          $(document).find("#player .buttons_wrapper .button.volume_control").append("<div class='vol_bar'><input type='range' id='volume_c' min='0' max='100'><div class='masks'><span class='maskB' style='width: "+_vh+"%'></span><span class='mask'></span></div></div>");
          $(document).on("click",window.muse.removeVolBar);
        }
      }
    });
    $(document).on("click",".infinite_control",function(){
      window.muse.player.control.infiniteToggle();
    });
    $(document).on("mousedown","#progress_range",function(){
      window.muse.player._seeking = true;
      $(document).find("#player").addClass("seeking");
    });
    $(document).on("input","#progress_range",function(){
      var req = $(document).find("#progress_range").val();
      $(document).find("#player .progress_e").css("width",Math.round(req)+"%")
    });
    $(document).on("change","#progress_range",function(){
      var req = $(document).find("#progress_range").val();
      window.muse.player.control.seek( req );
    });
    $(document).on("input","#volume_c",function(){
      var req = $(document).find("#volume_c").val();
      $(document).find("#player .buttons_wrapper .button.volume_control .vol_bar .maskB").css("width",req+"%")
      window.muse.player.control.setUVolume(req)
    });
    $(document).on("change","#volume_c",function(){
      var req = $(document).find("#volume_c").val();
      $(document).find("#player .buttons_wrapper .button.volume_control .vol_bar .maskB").css("width",req+"%")
      window.muse.player.control.setUVolume(req)
    });
    $(document).on("click",".queue .item",function(){

      var queID = $(this).attr("id").substr( "bof_queue_".length );

      if ( queID !== window.muse.queue.active._id ){
        window.muse.queue.active.set( queID );
        window.muse.player.setup.exe();
        window.muse.queue.preview();
      }

    });
    $(document).on("click","#players .player_movers div",function(){

      if ( $(this).hasClass("move") ){
        if ( $("body").hasClass("muse_player_reverse") )
        window.ui.body.removeClass( "muse_player_reverse", true );
        else
        window.ui.body.addClass( "muse_player_reverse", true );
      }
      else if ( $(this).hasClass("hide") ){
        window.ui.body.addClass( "muse_player_hide", true );
      }
      else if ( $(this).hasClass("fullscreen") ){
        window.muse.player.setup.youtube.iframe.getIframe().requestFullscreen()
      }

    });
    $(document).on("click","body.muse_player_active.muse_player_hide #players",function(){

      window.ui.body.removeClass( "muse_player_hide", true );

    });
    $(document).on("click",".queue .data_wrapper .tabs .tab",function(e){
      if ( $(this).hasClass("_lyrics") ? $(this).hasClass("has") : false ){
        $(document).find(".queue").addClass("second_tab")
        $(document).find(".queue .data_wrapper .tabs .tab.active").removeClass("active");
        $(document).find(".queue .data_wrapper .tabs .tab._lyrics").addClass("active");
        window.muse.lyrics.display();
      }
      else {
        $(document).find(".queue").removeClass("second_tab")
        $(document).find(".queue .data_wrapper .tabs .tab.active").removeClass("active");
        $(document).find(".queue .data_wrapper .tabs .tab._queue").addClass("active");
      }
    });
    window.muse.player.types.listen();

    if ( window.muse._config.embed ? false : window.app.config.mobile ){

      var mc = new Hammer(document.querySelector(".queue .touch"));

      mc.add( new Hammer.Pan( {
        direction: Hammer.DIRECTION_ALL,
        threshold: 0
      } ) );

      mc.on( 'pan', function(e){

        $(document).find(".queue").css( "top", e.deltaY );
        if ( e.isFinal ){
          if ( $(document).find(".queue").offset().top > $(window).height() / 4 ){
            window.muse.queue.destroy();
          } else {
            $(document).find(".queue").css( "top", "0px"  );
          }
        }

      } );

    }

  },
  log: function( $txt, $level, $args ){
    if ( !window.muse._config._debug ) return;
    return window.bof.log( "Muse -> " + $txt, $level, $args );
  },
  request: function( action, ot, hash, sources, Data ){

    window.muse.log( "Request -> " + action + " -> " + ot + "_" + hash + " -> " + ( sources ? "Has source" : "No source" ) );

    var _activeRN = window.muse.queue.active.get();

    if ( _activeRN.data && action == "focus" ? ( _activeRN.data.ot == ot && _activeRN.data.hash == hash ) : false ){
      if ( window.muse.player._status === 'playing' ){
        window.muse.player.control.pause();
        return;
      }
      else if ( window.muse.player._status === 'paused' ){
        window.muse.player.control.play();
        return;
      }
    }

    if ( action == "focus" )
    window.muse.focus.set( ot, hash, "loading", true );

    var provideSourceIni = window._g._mt();
    var provideSource = window.muse.source.solve( action, ot, hash, sources, Data );

    provideSource.promise
    .fail(function( data ){
      var err = data.messages[0];
      if ( data?.aborted ? data.aborted == true : false ){
        window.muse.log( "Requesting source -> FAILURE -> Aborted Source!", 6, { css: 'color:yellow' } );
        return;
      }
      window.muse.log( "Requesting source -> FAILURE -> " + err, 9, { css: 'color:red' } );
      window.muse.player.setup.error_handler( "resReq", err );
      if ( !data.pending && !data.dont_seek_resolution )
      window.app.actions.get_unlock_solution( ot, hash )
    })
    .done(function( resources ){

      window.muse.log( "Requesting source -> Done in " + window._g._pt( provideSourceIni ) );

      if ( action == "focus" ){
        window.muse.queue.set( resources, true );
        window.muse.player.setup.exe();
        if ( !$("body").hasClass("queue_disable_auto") )
        window.muse.queue.build();
        setTimeout( function(){
          if ( !window.muse._config.embed && ( ( Data ? Data.widget : false ) || provideSource.checkOffline.state() == 'resolved' ) )
          window.muse.infinite.start( ot, hash, provideSource.checkOffline.state() == 'resolved' ? "offline" : Data.widget );
        }, 200 );
      }
      else if ( action !== "type_switch" ) {
        window.muse.queue.extend( resources, action );
      }

    });

    return provideSource.promise;

  },
  

};

function onYouTubeIframeAPIReady() {
  window.muse.player.setup.youtube.iframe_ready.resolve();
}