"use strict";

window.pageBuilder = {

  widget: {
    item: {

      dynaButtonXHR: null,
      getExtenders: {},
      open: false,
      pos: {
        x: null,
        y: null,
      },
      get: function( $id ){

        var Extenders = window.pageBuilder.widget.item.getExtenders;
        if ( Object.keys( Extenders ).length ){
          for( var i=0; i<Object.keys( Extenders ).length; i++ ){
            var Extender = Object.values( Extenders )[i];
            if ( typeof Extender === "function" ){
              var runExtender = Extender( $id );
              if ( runExtender )
              return runExtender;
            }
          }
        }

        if ( $id == "main" ){
          var mainData = window.ui.page.curr().data.becli.single.data;
          mainData.widget = "page";
          return mainData;
        }

        if ( $id == "muse_active" )
        return window.m2_queue.active.get().data;

        if ( $id.substr( 0, 6 ) == "queue_" ){
          var _q = window.m2_queue.getItem( $id.substr( 6 ) );
          return _q?.data;
        }

        var widgets = window.ui.page.curr().data.becli.single.widgets;
        return window.pageBuilder.widget.item.getHelper( $id, widgets );

      },
      getHelper: function( $id, widgets ){

        for ( var i=0; i<widgets.length; i++ ){

          var items = {};
          var _w = widgets[ i ];

          if ( _w.items ){

            for( var z=0; z<Object.keys(_w.items).length; z++ ){
              var _ik = Object.keys(_w.items)[z];
              var _i = _w.items[ _ik ];
              if ( Array.isArray( _i ) ){
                for ( var y=0; y<Object.keys(_i).length; y++ ){
                  var __ik = Object.keys(_i)[y];
                  var __i = _i[ __ik ];
                  items[ __i.id ] = __i;
                }
              } else {
                items[ _i.id ] = _i;
              }
            }
            if ( _w.display && items ? _w.display.type == "table" : false ){
              for ( var z=0; z<Object.keys(items).length; z++ ){
                var __item_k = Object.keys(items)[z];
                var __item = items[ __item_k ];
                if ( __item["tds"] ){
                  var __itemTDs = __item["tds"];
                  for ( var y=0; y<__itemTDs.length; y++ ){
                    var __itemTD = __itemTDs[ y ];
                    if ( __itemTD.class && __itemTD.val ){
                      if ( __itemTD.class.includes("title") )
                      items[ __item_k ]["title"] = window._g.decode_htmlspecialchars( __itemTD.val );
                      if ( __itemTD.class.includes("cover") )
                      items[ __item_k ]["cover"] = __itemTD.val;
                    }
                  }
                }
              }
            }
            if ( _w.display ? _w.display.type == "grid" : false ){
              var chck_gWidgets = window.pageBuilder.widget.item.getHelper( $id, _w.display.widgets );
              if ( chck_gWidgets ) return chck_gWidgets;
            }

            if ( items[ $id ] ){

              var foundItem = items[ $id ];

              if ( !foundItem.buttons )
              foundItem.buttons = window.pageBuilder.widget.item.parseWidgetButtons( foundItem, _w.buttons );
              foundItem.widget = _w;
              return foundItem;

            }

          }

        }

        return false;

      },
      setButtons: function( $id, $buttons ){

        if ( $id == "main" ){
          window.ui.page.curr().data.becli.single.data.buttons.items = $buttons
          return;
        }

        if ( $id == "muse_active" ){
          //window.muse.queue.active.get().data.buttons.items = $buttons;
          return;
        }

        if ( $id ? $id.substr( 0, 6 ) == "queue_" : false ){
          //window.muse.queue._items[ $id.substr( 6 ) ].data.buttons.items = $buttons;
          return;
        }

        var widgets = window.ui.page.curr().data.becli.single.widgets;
        for ( var i=0; i<widgets.length; i++ ){

          var items = {};
          var _w = widgets[ i ];

          if ( _w.items ){

            for( var z=0; z<Object.keys(_w.items).length; z++ ){
              var _ik = Object.keys(_w.items)[z];
              var _i = _w.items[ _ik ];
              if ( Array.isArray( _i ) ){
                for ( var y=0; y<Object.keys(_i).length; y++ ){
                  var __ik = Object.keys(_i)[y];
                  var __i = _i[ __ik ];
                  items[ __i.id ] = __i;
                }
              } else {
                items[ _i.id ] = _i;
              }
            }

            if ( _w.display && items ? _w.display.type == "table" : false ){
              for ( var z=0; z<Object.keys(items).length; z++ ){
                var __item_k = Object.keys(items)[z];
                var __item = items[ __item_k ];
                if ( __item["tds"] ){
                  var __itemTDs = __item["tds"];
                  for ( var y=0; y<__itemTDs.length; y++ ){
                    var __itemTD = __itemTDs[ y ];
                    if ( __itemTD.class && __itemTD.val ){
                      if ( __itemTD.class.includes("title") )
                      items[ __item_k ]["title"] = window._g.decode_htmlspecialchars( __itemTD.val );
                      if ( __itemTD.class.includes("cover") )
                      items[ __item_k ]["cover"] = __itemTD.val;
                    }
                  }
                }
              }
            }

            if ( items[ $id ] ){

              items[ $id ].buttons.items = $buttons;
              return;

            }

          }

        }

        return null;

      },

      renderMenu: function( buttons, x, y, loading ){

        $(document).find(".widgetItemButtons_hover").remove();

        var promise = $.Deferred();

        window.ui.theme.load(
          "theme/parts/widget_item_buttons",
          {
            dir: false,
            base: $_bof_config.assets_address
          }
        ).done( function( buttons_template ){

          window.render.mix(
            buttons_template,
            {
              class: loading ? "loading" : "",
              buttons: buttons,
              x: x,
              y: y
            }
          ).done(function( buttons_html ){
            promise.resolve( buttons_html );
          });

        });

        return promise;

      },
      parseWidgetButtons: function( $item, $widgetButtons ){

        var buttons = {};

        for( var i=0; i<Object.keys( $widgetButtons ).length; i++ ){

          var _k = Object.keys( $widgetButtons )[i];
          var _t = $widgetButtons[ _k ];

          if ( _t == "organic" ){
            if ( _k == "play" && $item.ot && $item.hash ){
              buttons.play = {
                icon: "play",
                title: window.lang.return( "play", {ucfirst:true} ),
                action: "play",
                class: "_play bof_" + $item.ot + "_" + $item.hash,
                attr: "data-play='"+$item.hash+"'"
              };
              buttons.play_next = {
                icon: "playlist-music",
                title: window.lang.return( "play_next", {ucfirst:true} ),
                action: "play_next",
                attr: "data-play='"+$item.hash+"'"
              };
              buttons.play_last = {
                icon: "playlist-music-outline",
                title: window.lang.return( "add_to_queue", {ucfirst:true} ),
                action: "play_last",
                attr: "data-play='"+$item.hash+"'"
              };
            }
            if ( _k == "like" && $item.ot && $item.hash ){
              buttons.like = {
                icon: "heart",
                dynamic: true,
                title: "<i>"+ window.lang.return( "loading", {ucfirst:true} ) +"</i>",
                attr: "id='dyna_like'"
              };
            }
            if ( _k == "subscribe" && $item.ot && $item.hash ){
              buttons.subscribe = {
                icon: "heart",
                dynamic: true,
                title: "<i>"+ window.lang.return( "loading", {ucfirst:true} ) +"</i>",
                attr: "id='dyna_subscribe'"
              };
            }
            if ( _k == "playlist" && $item.ot && $item.hash ){
              buttons.playlist = {
                icon: "playlist-plus",
                title: window.lang.return( "add_to_playlist", {ucfirst:true} ),
                action: "playlist",
                class: "with_child",
              };
            }
            if ( _k == "share" && $widgetButtons.link == "organic" && $item.ot && $item.hash ){
              buttons.share = {
                icon: "share",
                title: window.lang.return( "share", {ucfirst:true} ),
                action: "share",
              };
            }
            if ( _k == "link" && $item.url ){
              buttons.link = {
                icon: "open-in-app",
                title: window.lang.return( "open", {ucfirst:true} ),
                action: $item.url,
              };
            }
          }
          else if ( _t == "dynamic" ){
            buttons[ _k ] = {
              dynamic: true,
              icon: "loading",
              title: "<i>"+ window.lang.return( "loading", {ucfirst:true} ) +"</i>",
              attr: "id='dyna_"+_k+"'"
            };
          }

        }

        return {
          data: {
            _title: $item.title ? $item.title : $item.name,
            _cover: $item.cover
          },
          items: buttons
        };

      },
      openMenu: function( $id, x, y ){

        var Data = window.pageBuilder.widget.item.get( $id );
        var buttons = Data.buttons.items;

        var position = window.pageBuilder.widget.item.positionMenu( buttons, x, y, true );
        var target_top = position.top;
        var target_left = position.left;

        window.pageBuilder.widget.item.closeMenu();
        window.ui.body.addClass("fullMenuOpened");
        var $hasDynamicButton = false;
        for ( var i=0; i<Object.keys(buttons).length; i++ ){
          var _key = Object.keys(buttons)[i];
          var _but = buttons[ _key ];
          if ( _but.dynamic ) $hasDynamicButton = true;
        }

        if ( $hasDynamicButton ){
          window.becli.exe({
            endpoint: "bofClient/buttons/" + Data.ot + "/",
            post: {
              hash: Data.hash,
              buttons: Object.keys(buttons).join(",")
            },
            callBack: function( sta, data, args ){

              if ( sta ? data.buttons.items : false ){
                if ( $id.substr( 0, "queue_".length ) == "queue_"  ){
                  data.buttons.items = $.extend( {
                    play: {
                      icon: "play",
                      title: window.lang.return( "play", {ucfirst:true} ),
                      action: "que_play",
                      class: "bof_"+Data.ot+"_"+Data.hash+" play _play",
                      attr: " data-que='"+ $id.substr( "queue_".length ) +"' "
                    },
                    remove_from_que: {
                      icon: "delete",
                      title: window.lang.return( "remove_from_que", {ucfirst:true} ),
                      action: "que_remove",
                      attr: " data-que='"+ $id.substr( "queue_".length ) +"' "
                    }
                  }, data.buttons.items );
                }
                window.pageBuilder.widget.item.replaceMenu( data.buttons.items, false, data );
              } else {
                for ( var i=0; i<Object.keys(buttons).length; i++ ){
                  var _key = Object.keys(buttons)[i];
                  var _but = buttons[ _key ];
                  if ( _but.dynamic ){
                    $(document).find(".widgetItemButtons .button#dyna_"+_key).remove();
                  }
                }
              }

            }
          })
        }

        if ( $id.substr( 0, "queue_".length ) == "queue_"  ){
          Data.buttons.items = $.extend( {
            play: {
              icon: "play",
              title: window.lang.return( "play", {ucfirst:true} ),
              action: "que_play",
              class: "bof_"+Data.ot+"_"+Data.hash+" play _play"
            }
          }, Data.buttons.items );
        }

        window.pageBuilder.widget.item.renderMenu( Data.buttons, target_left, target_top, $hasDynamicButton ).done(function( buttons_html ){

          $("body").append( buttons_html );

          window.m2_focus.ui.hook()
          window.pageBuilder.widget.item.open = $.extend( Data.buttons.data, { id: $id } );
          window.pageBuilder.widget.item.pos = {
            x: x,
            y: y
          }

          $(document).on( "click", window.pageBuilder.widget.item.menuCloserListener );
          $("#main").on( "scroll", window.pageBuilder.widget.item.closeMenu );
          $(document).on( "click", ".widgetItemButtons .button", function(e){

            var action = $(this).attr("data-action");
            if ( action == "playlist" ){

              var newButtons = [];

              newButtons.push({
                icon: "keyboard-backspace",
                title: window.lang.return( "back", {ucfirst:true} ),
                action: "menu",
                attr: " data-x='"+window.pageBuilder.widget.item.pos.x+"' data-y='"+window.pageBuilder.widget.item.pos.y+"' "
              });

              newButtons.push({
                title: null,
                class: "seperate"
              });

              newButtons.push({
                title: window.lang.return( "select", {ucfirst:true} ),
                class: "_title"
              });

              if ( window.app.config.user ? window.app.config.user.data.playlists : false ){
                for( var i=0; i<Object.keys( window.app.config.user.data.playlists ).length; i++ ){
                  var playlist = window.app.config.user.data.playlists[i];
                  newButtons.push({
                    icon: "playlist-music",
                    title: playlist.name,
                    action: "playlist_select",
                    attr: "data-playlist='"+playlist.hash+"'"
                  });
                }
              } else {
                newButtons.push({
                  icon: "emoticon-sad-outline",
                  title: window.lang.return( "nothing_found", {ucfirst:true} ),
                  class: "nada"
                });
              }

              newButtons.push({
                title: null,
                class: "seperate"
              });

              newButtons.push({
                icon: "plus-circle-outline",
                title: window.lang.return( "create_new", {ucfirst:true} ),
                action: "playlist_create_ini",
              });

              window.pageBuilder.widget.item.replaceMenu( newButtons );

            }
            else if ( action == "playlist_create_ini" ){

              var newButtons = [];

              newButtons.push({
                icon: "keyboard-backspace",
                title: window.lang.return( "back", {ucfirst:true} ),
                action: "playlist",
              });

              newButtons.push({
                title: null,
                class: "seperate"
              });

              newButtons.push({
                html: "<input type='text' class='bof_input' placeholder='"+window.lang.return("enter_a_name",{ucfirst:true})+"' id='new_playlist_name'><div class='button btn btn-primary' id='new_playlist_button' data-action='playlist_create'>"+window.lang.return("create",{ucfirst:true})+"</div>",
                class: "html"
              });

              window.pageBuilder.widget.item.replaceMenu( newButtons );

            }
            else if ( action == "playlist_select" ){

              window.app.becli.exe( "alert", {}, {
                endpoint: "playlist_extend",
                post: {
                  playlist: $(this).data("playlist"),
                  object_type: Data.ot,
                  object: Data.hash
                },
                c_callback: function( sta, data ){
                  window.pageBuilder.widget.item.closeMenu();
                  navigator.serviceWorker.controller.postMessage({
                    action: "clean",
                    url: window.config.endpoint_address + "bofClient/single/ugc_playlist/?bof_cache=120&slug=" + data.playlist.url
                  });
                }
              } );

            }
            else if ( action == "playlist_create" ){

              window.app.becli.exe( "alert", {}, {
                endpoint: "playlist_create",
                post: {
                  playlist: $(document).find("#new_playlist_name").val(),
                  object_type: Data.ot,
                  object: Data.hash
                },
                c_callback: function( sta, data, args ){
                  if ( sta ){
                    window.app.getConfig(true);
                    window.pageBuilder.widget.item.closeMenu();
                  }
                }
              } );

            }
            else if ( action == "playlist_edit" ){
              window.app.actions.user.playlist.edit_start( Data.hash, Data );
              window.pageBuilder.widget.item.closeMenu();
            }
            else if ( action == "playlist_delete_confirm" ){
              window.app.actions.user.playlist.delete_confirm( Data.hash, Data );
              window.pageBuilder.widget.item.closeMenu();
            }
            else if ( action == "playlist_keep" ){
              window.app.actions.user.playlist.keep( Data.hash, Data );
              window.pageBuilder.widget.item.closeMenu();
            }
            else if ( action == "playlist_lose" ){
              window.app.actions.user.playlist.lose( Data.hash, Data );
              window.pageBuilder.widget.item.closeMenu();
            }
            else if ( action == "playlist_shorten" ){
              window.app.actions.user.playlist.shorten( $(this).attr("data-play"), $(this).attr("data-item_ot"), $(this).attr("data-item"), Data["i"] );
              window.pageBuilder.widget.item.closeMenu();
            }
            else if ( action == "item_single_edit" ){
              window.app.actions.user.item_single_edit.edit_start( Data.ot, Data.hash, Data );
              window.pageBuilder.widget.item.closeMenu();
            }
            else if ( action == "item_single_edit_delete" ){
              window.app.actions.user.item_single_edit.delete_confirm( Data.ot, Data.hash, Data );
              window.pageBuilder.widget.item.closeMenu();
            }
            else if ( action == "share" ){
              window.app.actions.share.ini( Data );
            }
            else if ( action == "play" ){
              if ( Data.ot && Data.hash ){
                window.m2.user.request( "focus", Data.ot, Data.hash, Data.sources, Data );
              }
            }
            else if ( action == "que_play" ){
              var queID = $(this).data("que");
              if ( queID !== window.muse.queue.active._id ){
              }
            }
            else if ( action == "que_remove" ){

              var queID = $(this).data("que");
              window.m2_queue.removeItem( queID );

            }
            else if ( action == "play_next" ){
              if ( Data.ot && Data.hash ){
                window.m2.user.request( "next", Data.ot, Data.hash, Data.sources, Data );
              }
            }
            else if ( action == "play_last" ){
              if ( Data.ot && Data.hash ){
                window.m2.user.request( "last", Data.ot, Data.hash, Data.sources, Data );
              }
            }
            else if ( action == "download" ){

              var requed_type = $(this).attr("data-download-action");
              var download_sources = Data.buttons.items.download.sources;
              if ( !download_sources ? true : !download_sources.in && !download_sources.out )
              return false;

              var newButtons = [];

              download_sources.in = download_sources.in ? Object.values( download_sources.in ) : download_sources.in;
              download_sources.out = download_sources.out ? Object.values( download_sources.out ) : download_sources.out;

              if ( download_sources.in && download_sources.out && !requed_type ){

                newButtons.push({
                  icon: "keyboard-backspace",
                  title: window.lang.return( "back", {ucfirst:true} ),
                  action: "menu",
                  attr: " data-x='"+window.pageBuilder.widget.item.pos.x+"' data-y='"+window.pageBuilder.widget.item.pos.y+"' "
                });
                newButtons.push({
                  title: null,
                  class: "seperate"
                });
                newButtons.push({
                  icon: "playlist-music",
                  title: "To Device",
                  action: "download",
                  attr: "data-download-action='out'"
                });
                newButtons.push({
                  icon: "playlist-music",
                  title: "To App",
                  action: "download",
                  attr: "data-download-action='in'"
                });

              }
              else if ( download_sources.in && requed_type != "out" ) {

                newButtons.push({
                  icon: "keyboard-backspace",
                  title: window.lang.return( "back", {ucfirst:true} ),
                  action: download_sources.in && download_sources.out ? "download" : "menu",
                  attr: " data-x='"+window.pageBuilder.widget.item.pos.x+"' data-y='"+window.pageBuilder.widget.item.pos.y+"' "
                });
                newButtons.push({
                  title: null,
                  class: "seperate"
                });
                newButtons.push({
                  title: "Download to app",
                  class: "_title"
                });

                if ( download_sources.in.length == 1 ){
                  window.bof_offline.download( Data.ot, Data.hash, download_sources.in[0].hash, "in" );
                  window.pageBuilder.widget.item.closeMenu();
                } else {
                  for( var i=0; i<download_sources.in.length; i++ ){
                    var dl_src = download_sources.in[i];
                    newButtons.push({
                      icon: "playlist-music",
                      title: dl_src.title,
                      action: "download_in",
                      attr: "data-hash='"+dl_src.hash+"'"
                    });
                  }
                }

              }
              else if ( download_sources.out && requed_type != "in" ) {

                newButtons.push({
                  icon: "keyboard-backspace",
                  title: window.lang.return( "back", {ucfirst:true} ),
                  action: download_sources.in && download_sources.out ? "download" : "menu",
                  attr: " data-x='"+window.pageBuilder.widget.item.pos.x+"' data-y='"+window.pageBuilder.widget.item.pos.y+"' "
                });
                newButtons.push({
                  title: null,
                  class: "seperate"
                });
                newButtons.push({
                  title: "Download to device",
                  class: "_title"
                });

                for( var i=0; i<download_sources.out.length; i++ ){
                  var dl_src = download_sources.out[i];
                  newButtons.push({
                    icon: "playlist-music",
                    title: dl_src.title,
                    action: "download_out",
                    attr: "data-hash='"+dl_src.hash+"'"
                  });
                }

              }

              window.pageBuilder.widget.item.replaceMenu( newButtons );

            }
            else if ( action == "download_child" ){

              var requed_type = $(this).attr("data-download-action");
              var download_sources = Data.buttons.items.download_child.sources;
              if ( !download_sources ? true : !download_sources.in && !download_sources.out )
              return false;

              var newButtons = [];

              download_sources.in = download_sources.in ? Object.values( download_sources.in ) : download_sources.in;
              download_sources.out = download_sources.out ? Object.values( download_sources.out ) : download_sources.out;

              if ( download_sources.in && download_sources.out && !requed_type ){

                newButtons.push({
                  icon: "keyboard-backspace",
                  title: window.lang.return( "back", {ucfirst:true} ),
                  action: "menu",
                  attr: " data-x='"+window.pageBuilder.widget.item.pos.x+"' data-y='"+window.pageBuilder.widget.item.pos.y+"' "
                });
                newButtons.push({
                  title: null,
                  class: "seperate"
                });
                newButtons.push({
                  icon: "playlist-music",
                  title: "To Device",
                  action: "download_child",
                  attr: "data-download-action='out'"
                });
                newButtons.push({
                  icon: "playlist-music",
                  title: "To App",
                  action: "download_child",
                  attr: "data-download-action='in'"
                });

              }
              else if ( download_sources.in && requed_type != "out" ) {

                window.bof_offline.downloadGroup( download_sources.in, true );
                /*for( var i=0; i<download_sources.in.length; i++ ){
                  var dl_src = download_sources.in[i];
                  window.bof_offline.download( dl_src.real_ot, dl_src.real_oh, dl_src.hash, "in", i>0 );
                }*/
                window.pageBuilder.widget.item.closeMenu();

              }
              else if ( download_sources.out && requed_type != "in" ) {

                for( var i=0; i<download_sources.out.length; i++ ){
                  var dl_src = download_sources.out[i];
                  window.bof_offline.download( dl_src.real_ot, dl_src.real_oh, dl_src.hash, "out", i>0 );
                }
                window.pageBuilder.widget.item.closeMenu();

              }

              window.pageBuilder.widget.item.replaceMenu( newButtons );

            }
            else if ( action == "download_in" ){

              window.bof_offline.download( Data.ot, Data.hash, $(this).data("hash"), "in" );
              window.pageBuilder.widget.item.closeMenu();

            }
            else if ( action == "download_out" ){

              window.bof_offline.download( Data.ot, Data.hash, $(this).data("hash"), "out" );
              window.pageBuilder.widget.item.closeMenu();

            }
            else if ( action == "purchase" ){
              window.app.actions.get_unlock_solution( Data.ot, Data.hash );
              window.pageBuilder.widget.item.closeMenu();
            }
            else if ( action == "view_bio" ){
              window.app.actions.view_bio( Data.ot, Data.hash );
              window.pageBuilder.widget.item.closeMenu();
            }
            else if ( action == "menu" ){
              window.pageBuilder.widget.item.openMenu( $id, $(this).data("x") ? $(this).data("x") : x, $(this).data("y") ? $(this).data("y") : y );
            }
            else if ( action == "like" ){
              window.app.actions.user.like( true, Data.ot, Data.hash );
              window.pageBuilder.widget.item.closeMenu();
            }
            else if ( action == "unlike" ){
              window.app.actions.user.like( false, Data.ot, Data.hash );
              window.pageBuilder.widget.item.closeMenu();
            }
            else if ( action == "subscribe" ){
              window.app.actions.user.subscribe( true, Data.ot, Data.hash );
              window.pageBuilder.widget.item.closeMenu();
            }
            else if ( action == "unsubscribe" ){
              window.app.actions.user.subscribe( false, Data.ot, Data.hash );
              window.pageBuilder.widget.item.closeMenu();
            }
            else if ( $(this).find(".children").length ) {

              var children = $(this).find(".children .child");
              var newButtons = [];

              newButtons.push({
                icon: "keyboard-backspace",
                title: window.lang.return( "back", {ucfirst:true} ),
                action: "menu",
                attr: " data-x='"+window.pageBuilder.widget.item.pos.x+"' data-y='"+window.pageBuilder.widget.item.pos.y+"' "
              });

              newButtons.push({
                title: null,
                class: "seperate"
              });

              if ( $(this).data("menu-name") ){
                children = Data.buttons.items[ $(this).data("menu-name") ].childs;
                for ( var x=0; x<children.length; x++ ){
                  var child = children[x];
                  newButtons.push({
                    icon: child.icon,
                    title: child.title,
                    action: child.action,
                    attr: child.attr,
                    url: child.url,
                  });
                }
              }
              else {
                for ( var x=0; x<children.length; x++ ){

                  var child = children[x];
                  var childDatas = $(child).data();
                  var childDatasString = "";

                  for ( var i=0; i<Object.keys(childDatas).length; i++ ){
                    var childDataKey = Object.keys(childDatas)[i];
                    var childDataVal = childDatas[ childDataKey ];
                    if ( childDataKey != "action" )
                    childDatasString += " data-"+childDataKey+"=\""+childDataVal+"\" ";
                  }

                  newButtons.push({
                    icon: "open-in-app",
                    title: $(child).text().trim(),
                    action: $(child).data("action"),
                    attr: childDatasString ? childDatasString : false,
                    url: $(child).attr("href"),
                  });

                }
              }

              window.pageBuilder.widget.item.replaceMenu( newButtons );

            }

            window.m2_focus.ui.hook()

          } );
          window.pageBuilder.widget.item.menuMCRun();

        });

      },
      replaceMenu: function( newButtons, Data, menuData ){

        Data = Data ? Data : window.pageBuilder.widget.item.open;

        if ( menuData )
        window.pageBuilder.widget.item.setButtons( window.pageBuilder.widget.item.open.id, newButtons );

        window.pageBuilder.widget.item.renderMenu( { items: newButtons, data: Data }, window.pageBuilder.widget.item.pos.x, window.pageBuilder.widget.item.pos.y ).done(function( newButtonsHTML ){
          $(document).find(".widgetItemButtons").replaceWith( newButtonsHTML );
          window.pageBuilder.widget.item.positionMenu( newButtons, window.pageBuilder.widget.item.pos.x, window.pageBuilder.widget.item.pos.y )
        });

      },
      menuMC: null,
      menuMCRun: function(){

        if ( window.app.config.mobile ){

          var mc = new Hammer(document.querySelector(".widgetItemButtons .data"));
          window.pageBuilder.widget.item.menuMC = mc;

          mc.add( new Hammer.Pan( {
            direction: Hammer.DIRECTION_ALL,
            threshold: 0
          } ) );

          var WHeight = $(window).height();
          var SMaxHeight = 300;
          var SFullHeight = $(document).find(".widgetItemButtons .buttons")[0].scrollHeight;

          var Top = $(document).find(".widgetItemButtons").offset().top;
          var Height = $(document).find(".widgetItemButtons").height();
          var SHeight = $(document).find(".widgetItemButtons .buttons").outerHeight()
          var Bottom = WHeight - Height - Top;
          var LM = 0;

          mc.on( 'pan', function(e){

            var C_Top = $(document).find(".widgetItemButtons").offset().top;
            var C_Height = $(document).find(".widgetItemButtons").height();
            var C_SHeight = $(document).find(".widgetItemButtons .buttons").outerHeight()
            var C_Bottom = WHeight - C_Height - C_Top;

            if ( e.isFinal ){

              if ( C_Bottom < -50 ){
                window.pageBuilder.widget.item.closeMenu();
              } else {
                $(document).find(".widgetItemButtons").css( "bottom", "0px" )
              }

              Top = $(document).find(".widgetItemButtons").offset().top;
              Height = $(document).find(".widgetItemButtons").height();
              SHeight = $(document).find(".widgetItemButtons .buttons").outerHeight()
              Bottom = WHeight - Height - Top;
              LM = 0;

              return;

            }

            var M = LM - e.deltaY;
            LM = e.deltaY;

            if ( M < 0 ){
              $(document).find(".widgetItemButtons").css( "bottom", (C_Bottom+M)+"px" )
            }
            else {
              if ( C_Bottom < 0 ){
                $(document).find(".widgetItemButtons").css( "bottom", (C_Bottom+M)+"px" )
              } else if ( SFullHeight > C_SHeight-6 && e.direction == 8 ){
                $(document).find(".widgetItemButtons .buttons").css( "max-height", (C_SHeight+M)+"px" )
              }
            }

          } );

        }

      },
      positionMenu: function( buttons, x, y, returnOnly ){

        var window_width  = $(window).width();
        var window_height = $(window).height();

        var target_width = 240;
        var target_height = returnOnly ? ( buttons ? Object.keys( buttons ).length * 37 : 0 ) : $(document).find(".widgetItemButtons").height();
        var target_top = 0;
        var target_left = 0;

        var base_top    = y
        var base_left   = x;

        target_left = base_left;
        target_top  = base_top;

        if ( target_left + target_width > window_width - 30 )
        target_left = window_width - ( target_width + 30 );

        if ( target_top + target_height > window_height - 80 )
        target_top = base_top - target_height;

        if ( target_top < 30 )
        target_top = 30;

        if ( target_left < 30 )
        target_left = 30;

        if ( returnOnly ){
          return {
            top: target_top,
            left: target_left
          }
        }

        $(document).find(".widgetItemButtons").css("top",target_top+"px");
        $(document).find(".widgetItemButtons").css("left",target_left+"px");
        window.pageBuilder.widget.item.menuMCRun();

      },
      closeMenu: function(){

        if ( window.pageBuilder.widget.item.menuMC )
        window.pageBuilder.widget.item.menuMC.destroy();

        $(document).find(".widgetItemButtons").remove();
        $(document).find(".widgetItemButtons_hover").remove();
        $(document).off("click",window.pageBuilder.widget.item.menuCloserListener);
        $("#main").off("scroll",window.pageBuilder.widget.item.closeMenu);
        $(document).off("click",".widgetItemButtons .button");
        window.ui.body.removeClass("fullMenuOpened");
        window.pageBuilder.widget.item.open = false;

      },
      menuCloserListener: function(e){

        if ( $(e.target).parents(".button_wrapper").length )
        return;

        if ( $(e.target).parents(".widgetItemButtons").length )
        return;

        window.pageBuilder.widget.item.closeMenu();

      },

      listen: function(){

        if ( window.app.config.mobile ){
          if ( window.bof._isExtensionLoaded( "hammer_min_js" ) ){

            document.querySelectorAll(".item:not(.hammered)").forEach(function(item){

              item.classList.add('hammered');
              item.querySelectorAll("a").forEach(function(a){
                if ( !$(a).parents(".button_wrapper").length && !$(a).hasClass("button_wrapper") && !$(a).hasClass("more_a") && $(a).attr("target") != "_blank" )
                a.removeAttribute( "href" );
              });

              var manager = new Hammer(item);

              var Hold = new Hammer.Press({ event: 'hold', time: 550 });
              var DoubleTap = new Hammer.Tap({ event: 'doubletap', taps: 2, threshold: 20 });
              var SingleTap = new Hammer.Tap({ event: 'tap' });

              manager.add( [ DoubleTap, SingleTap, Hold ] );

              DoubleTap.recognizeWith(SingleTap);
              SingleTap.requireFailure(DoubleTap);

              manager.on( 'doubletap', window.pageBuilder.widget.item.react );
              manager.on( 'tap', window.pageBuilder.widget.item.react );
              manager.on( 'hold', window.pageBuilder.widget.item.react );

            })

          }
        }

      },
      react: function( e ){

        window.app.ui.clickReact( e, $(e.target), "mobile", e.type );

      }

    }
  },

};
