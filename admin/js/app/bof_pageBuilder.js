"use strict";

window.bof_pageBuilder = {

  current_page: null,
  pre_design: {},
  widgets_structures: {},
  widgets_groups_structures: {},
  widgets_native: {},
  widgets_data: {},
  widgets_order: [],
  widgets_grid_order: {},

  waitForHighlights: function( zePromise ){

    var promise = zePromise ? zePromise : $.Deferred();

    if ( $( "#highlights #page_builder ._widgets ._widget" ).length && window.app.cache ? ( window.app.cache.sb_data ? window.app.cache.sb_data.json : false ) : false )
    promise.resolve();

    else{
      setTimeout(function(){
        window.bof_pageBuilder.waitForHighlights( promise )
      },100);
    }

    return promise;

  },
  displaying: function(){

    var p = $.Deferred();
    window.app._extension( "jquery_ui_custom" ).done( function(){
      p.resolve();
    } );
    return $.when( p, window.bof_content_single.displaying() );

  },
  ready: function(){

    window.bof_pageBuilder.waitForHighlights().done(function(){

      window.bof_pageBuilder.widgets_structures = window.app.cache.sb_data.json.items;
      window.bof_pageBuilder.widgets_groups_structures = window.app.cache.sb_data.json.groups;

      var $__req = window.ui.page.curr().data.becli.entity.request;
      try {
        var $preDesign = $__req.content[ $__req.IDS[0] ]._pre_design;
        if ( $preDesign ){
          window.bof_pageBuilder.pre_design = $preDesign;
          window.bof_pageBuilder.widgets_native = $preDesign.widgets;
          if ( $preDesign.supported_widgets ){
            var wS = $(document).find("#highlights #page_builder ._widgets ._widget");
            for ( var z=0; z<wS.length; z++ ){
              var aW = $( wS[z] );
              if ( !$preDesign.supported_widgets.includes( aW.data("name") ) )
              aW.remove();
            }
            var gS = $(document).find("#highlights #page_builder ._group");
            for ( var z=0; z<gS.length; z++ ){
              var aG = $( gS[z] );
              if ( !aG.find("._widget").length )
              aG.remove();
            }
          }
        }
      } catch( $err ){}
      var $pageWidgets = null;
      try { $pageWidgets = $__req.content[ $__req.IDS[0] ].widgets } catch( e ){}
      if ( $pageWidgets ){

        window.bof_pageBuilder.current_page = $__req.content[ $__req.IDS[0] ];
        for( var i=0; i<$pageWidgets.length; i++ ){
          var $pageWidget = $pageWidgets[i];
          window.bof_pageBuilder.widgets_data[ $pageWidget.unique_id ] = $pageWidget;
        }
        for( var i=0; i<$pageWidgets.length; i++ ){
          var $pageWidget = $pageWidgets[i];
          if ( $pageWidget.i ? window._g.isNumeric( $pageWidget.i ) : true )
          window.bof_pageBuilder.widgets_order.push( $pageWidget.unique_id )
          else {
            var _iE = $pageWidget.i.split( "_" );
            var $gID = _iE[0];
            var $gI = _iE[1];
            if ( !Object.keys(window.bof_pageBuilder.widgets_data).includes( $gID ) ){
              window.bof_pageBuilder.widgets_order.push( $pageWidget.unique_id )
            } else {
              if ( !window.bof_pageBuilder.widgets_grid_order[ $gID ] )
              window.bof_pageBuilder.widgets_grid_order[ $gID ] = {};
              window.bof_pageBuilder.widgets_grid_order[ $gID ][ $gI ] = $pageWidget.unique_id
            }
          }
        }

      }

      $( "#highlights #page_builder ._widgets ._widget" ).draggable({
        revert: true,
        scroll: false,
        zIndex: 190,
        appendTo: "body",
        helper: "clone",
      });

      window.bof_pageBuilder.build();

    });

    $( document ).on( "click", "#build_site ._widget ._button.edit", function(e){
      var wid = $(e.target).parents( "._widget" ).data( "id" );
      window.bof_pageBuilder.edit_widget_start( "edit", wid );
    } );
    $( document ).on( "click", "#build_site ._widget ._button.remove", function(e){
      var wid = $(e.target).parents( "._widget" ).data( "id" );
      window.bof_pageBuilder.remove_widget( wid );
    } );
    $( document ).on( "click", "body.page_page .pageBuilder_head ._h", function(e){

      if ( $(this).hasClass("view") ){
        try {
          window.open( $_bof_config.web_address.replace("/admin/","") + window.bof_pageBuilder.current_page.url, "_blank" )
        } catch( e ){}
        return;
      }

      $(document).find("body.page_page .pageBuilder_head ._h").removeClass("active");
      $(this).addClass("active");

      if ( $(this).text() != "Widgets" ){
        $(document).find("body.page_page .settings").show();
        $(document).find("body.page_page .content .widgets").hide();
      } else {
        $(document).find("body.page_page .settings").hide();
        $(document).find("body.page_page .content .widgets").show();
      }

    } );

    var pageID = window.ui.page.curr().args.urlData.url.match[0];
    if ( isNaN( pageID ) ){
      $(document).find("body.page_page .pageBuilder_head ._h._setting").click();
    }

  },
  unloading: function(){

    window.bof_pageBuilder.widgets_structures = {};
    window.bof_pageBuilder.widgets_groups_structures = {};
    window.bof_pageBuilder.widgets_data = {};
    window.bof_pageBuilder.widgets_order = [];
    $( "#highlights #page_builder ._widgets ._widget" ).draggable( "destroy" );
    $( "#build_site ._widget.movable" ).draggable( "destroy" );
    $( "#build_site ._widget_drop_site" ).droppable( "destroy" );
    $( document ).off( "click", "#build_site ._widget ._button.edit" );
    $( document ).off( "click", "#build_site ._widget ._button.remove" );
    $( document ).off( "click", "body.page_page .pageBuilder_head ._h" );

  },
  get: function( name ){
    var reference = window.bof_pageBuilder[ name ];
    var value = $.extend( true, name == "widgets_order" ? [] : {}, reference );
    return value;
  },
  add_widget: function( id, data, $target_id ){

    window.bof_pageBuilder.widgets_data[ id ].args_decoded = data;

    if ( !window.bof_pageBuilder.widgets_order.includes( id ) && $target_id.substr( 0, 'widget_grid_'.length ) != 'widget_grid_' ){
      window.bof_pageBuilder.widgets_order.push( id )
    }

  },
  edit_widget_start: function( $action, id, name, target_id, target_pos ){

    var promise = $.Deferred();
    var data = null;

    if ( $action == "edit" ){

      data = window.bof_pageBuilder.widgets_data[ id ].args_decoded;
      name = data.wid_name;

      window.app.ui.becli.exe(
        "alert",
        {
        },
        {
          endpoint: "pageBuilder_widget_edit",
          post: {
            wid_id: id
          },
          c_callback: function( sta, data, args ){
            if ( sta )
            promise.resolve( data.inputs )
          },
          reload_after: false
        }
      )

    }

    var $__groups = {};
    var structure = window.bof_pageBuilder.get( "widgets_structures" )[ name ];
    var group = window.bof_pageBuilder.get( "widgets_groups_structures" )[ structure.group ];
    group = group ? group : {};
    group.groups = group.groups ? group.groups : {};
    group.groups["z"] = "Rules";

    if ( $action == "new" ){
      var $__inputs = {};
      if ( group.inputs ){
        for( var i=0; i<Object.keys(group.inputs).length; i++ ){
          var $__g_input_k = Object.keys(group.inputs)[i];
          var $__g_input = group.inputs[ $__g_input_k ];
          $__inputs[ $__g_input_k ] = $__g_input;
        }
      }
      if ( structure.inputs ){
        for( var i=0; i<Object.keys(structure.inputs).length; i++ ){
          var $__g_input_k = Object.keys(structure.inputs)[i];
          var $__g_input = structure.inputs[ $__g_input_k ];
          $__inputs[ $__g_input_k ] = $__g_input;
        }
      }
      promise.resolve( $__inputs );
    }

    promise.done(function($__inputs){

      if ( group.groups ){
        for ( var i=0; i<Object.keys(group.groups).length; i++ ){
          var $_g_k = Object.keys(group.groups)[i];
          var $_g_n = group.groups[ $_g_k ];
          $__groups[ $_g_k ] = [ $_g_k, $_g_n ];
        }
      }
      if ( structure.groups ){
        for ( var i=0; i<Object.keys(structure.groups).length; i++ ){
          var $_g_k = Object.keys(structure.groups)[i];
          var $_g_n = structure.groups[ $_g_k ];
          $__groups[ $_g_k ] = [ $_g_k, $_g_n ];
        }
      }
      $__inputs["wid_name"] = {
        input: {
          type: "hidden",
          name: "wid_name",
          value: name
        }
      };
      if ( $action == "edit" ){
        $__inputs["wid_id"] = {
          input: {
            type: "hidden",
            name: "wid_id",
            value: id
          }
        }
      }

      window.bof_modal.create({
        class: id ? "edit__widget" : "new__widget",
        title: id ? "Editing " + data.wid_title : "Adding " + structure["label"].replace( "<br>", "" ),
        groups: $__groups,
        inputs: $__inputs,
        buttons: [
          [ "btn-primary", id ? "Save" : "Add", "window.bof_pageBuilder.edit_widget_end( \""+$action+"\", \""+target_id+"\", \""+target_pos+"\" )" ]
        ],
      }).done(function(){

        if ( !$(document).find(".editor_js_child").length )
        return;

        window.bof_pageBuilder.cache_admin_pb_editor_js = new EditorJS({
          holder: $(document).find(".editor_js_child")[0],
          tools: {

            header: {
              class: Header,
              inlineToolbar: true,
              config: {
                placeholder: 'Header'
              },
              shortcut: 'CMD+SHIFT+H'
            },
            list: {
              class: List,
              inlineToolbar: true,
              shortcut: 'CMD+SHIFT+L'
            },
            embed: {
              class: Embed,
              config: {
                services: {
                  youtube: true,
                  coub: true
                }
              }
            },
            image: {
              class: ImageTool,
              inlineToolbar: true,
              config: {
                endpoints: {
                  byFile: window.config.endpoint_address + "bofInput/file/?type=image&object_type=editorjs_img",
                  byUrl: window.config.endpoint_address + "bofInput/file/?type=image&object_type=editorjs_img",
                },
                uploader: {
                  uploadByFile(file){

                    var t = new FormData();
                    t.append( "$file", file )

                    var promiseToUpload = $.Deferred();
                    window.becli.exe({
                      endpoint: "bofInput/file/?type=image&object_type=editorjs_img",
                      post: t,
                      type: "file",
                      callBack: function( sta, data ){
                        if ( sta ){
                          promiseToUpload.resolve({
                            success: 1,
                            file: {
                              url: data["file_preview"],
                              id: data["file_id"],
                              key: data["file_pass"]
                            }
                          });
                        } else {
                          promiseToUpload.reject({
                            success: 0
                          });
                        }
                      }
                    });
                    return promiseToUpload;

                  }
                }
              }
            },
            checklist: {
              class: Checklist,
              inlineToolbar: true,
            },
            quote: {
              class: Quote,
              inlineToolbar: true,
              config: {
                quotePlaceholder: 'Enter a quote',
                captionPlaceholder: 'Quote\'s author',
              },
              shortcut: 'CMD+SHIFT+O'
            },
            warning: Warning,
            code: {
              class:  CodeTool,
              shortcut: 'CMD+SHIFT+C'
            },
            delimiter: Delimiter,
            table: {
              class: Table,
              inlineToolbar: true,
              shortcut: 'CMD+ALT+T'
            },
            AnyButton: {
              class: AnyButton,
              inlineToolbar: false,
              config:{
                css:{
                  "btnColor": "btn--gray",
                }
              }
            },
            video: {
              class: VideoTool,
              config: {
                endpoints: {
                  byFile: window.config.endpoint_address + "bofInput/file/?type=video&object_type=editorjs_vid",
                  byUrl: window.config.endpoint_address + "bofInput/file/?type=video&object_type=editorjs_vid",
                },
                uploader: {
                  uploadByFile(file){

                    var t = new FormData();
                    t.append( "$file", file )

                    var promiseToUpload = $.Deferred();
                    window.becli.exe({
                      endpoint: "bofInput/file/?type=video&object_type=editorjs_vid",
                      post: t,
                      type: "file",
                      callBack: function( sta, data ){
                        if ( sta ){
                          promiseToUpload.resolve({
                            success: 1,
                            file: {
                              url: data["file_preview"],
                              id: data["file_id"],
                              key: data["file_pass"]
                            }
                          });
                        } else {
                          promiseToUpload.reject({
                            success: 0
                          });
                        }
                      }
                    });
                    return promiseToUpload;

                  }
                }
              }
            },
            underline: Underline,
            style: EditorJSStyle.StyleInlineTool,
            fontSize: FontSizeTool,
            paragraph: {
              class: Paragraph,
              inlineToolbar: true,
            },
            Color: {
              class: window.ColorPlugin,
              config: {
                colorCollections: ['#EC7878','#9C27B0','#673AB7','#3F51B5','#0070FF','#03A9F4','#00BCD4','#4CAF50','#8BC34A','#CDDC39', '#FFF'],
                defaultColor: '#FF1300',
                type: 'text',
                customPicker: true
              },
              inlineToolbar: true,
            },
            Marker: {
              class:  Marker,
              shortcut: 'CMD+SHIFT+M'
            },

          },
          data: $__inputs.editor_js.input.value ? JSON.parse( $__inputs.editor_js.input.value ) : {}
        });

      })

    });

  },
  edit_widget_end: function( $action, $target_id, $target_pos ){

    var promiseToEncodeForm = $.Deferred();
    var pageID = window.ui.page.curr().args.urlData.url.match[0];
    var modalData = window.bof_modal.get();
    modalData.push({ name: "page_id", value: pageID });

    if ( window.bof_pageBuilder.cache_admin_pb_editor_js ){

      window.bof_pageBuilder.cache_admin_pb_editor_js.save().then( (editor_js_output) => {

        modalData.push({
          name: 'editor_js',
          value: JSON.stringify( editor_js_output )
        });
        promiseToEncodeForm.resolve();

      }).catch( (editor_js_fail) => {

        console.log( editor_js_fail );
        promiseToEncodeForm.reject( editor_js_fail );

      });

    }
    else {
      promiseToEncodeForm.resolve();
    }

    promiseToEncodeForm.done(function(){

      window.app.ui.becli.exe(
        "button",
        {
          dom: $(document).find( ".modal .buttons .btn-primary" ),
        },
        {
          endpoint: "pageBuilder_widget_verify",
          reload_after: false,
          post: modalData,
          c_callback: function( sta, data, $args ){

            if ( sta ){

              var $_data = data["data"];
              var $_id = $_data.wid_id;

              if ( !window.bof_pageBuilder.widgets_data[ $_id ] )
              window.bof_pageBuilder.widgets_data[ $_id ] = {};

              window.bof_pageBuilder.widgets_data[ $_id ].args_decoded = $_data;

              if ( $action == "new" ){

                window.bof_pageBuilder.add_widget( $_id, $_data, $target_id );

                var $orders = window.bof_pageBuilder.get( "widgets_order" );
                var $new_orders = [];
                for( var i=0; i<$orders.length; i++ ){
                  var $order = $orders[i];
                  if ( $order == $_id ) continue;
                  if ( $order == $target_id && $target_pos == "before" )
                  $new_orders.push( $_id );
                  $new_orders.push( $order );
                  if ( $order == $target_id && $target_pos == "after" )
                  $new_orders.push( $_id );
                }
                if ( $target_id == "bottom" )
                $new_orders.push( $_id );

                if ( $target_id.substr( 0, "widget_grid_".length ) == "widget_grid_" ){
                  var wg_id_pos = $target_id.substr( "widget_grid_".length );
                  var wg_id = wg_id_pos.substr( 0, wg_id_pos.length-2 );
                  var wg_pos = wg_id_pos.substr( wg_id_pos.length-1 );
                  if ( !window.bof_pageBuilder.widgets_grid_order[ wg_id ] )
                  window.bof_pageBuilder.widgets_grid_order[ wg_id ] = {};
                  window.bof_pageBuilder.widgets_grid_order[ wg_id ][ wg_pos ] = $_id;
                }

                window.bof_pageBuilder.widgets_order = $new_orders;
                window.bof_pageBuilder.save_orders();

              }

              window.bof_modal.close();
              window.bof_pageBuilder.build();
            }

          }
        }
      );

    });

  },
  remove_widget: function( id ){

    if ( window.bof_pageBuilder.widgets_grid_order ){
      for ( var b=0; b<Object.keys(window.bof_pageBuilder.widgets_grid_order).length; b++ ){
        var _gwID = Object.keys(window.bof_pageBuilder.widgets_grid_order)[b];
        var _gwWS = window.bof_pageBuilder.widgets_grid_order[ _gwID ];
        if ( _gwWS ){
          for ( var z=0; z<Object.keys(_gwWS).length; z++ ){
            var __gwI = Object.keys(_gwWS)[z];
            var __gwID = _gwWS[__gwI];
            if ( __gwID == id ){
              delete window.bof_pageBuilder.widgets_grid_order[ _gwID ][ __gwI ];
            }
          }
        }
      }
    }

    window.app.ui.becli.exe(
      "alert",
      {
      },
      {
        endpoint: "pageBuilder_widget_delete",
        post: {
          wid_id: id
        },
        c_callback: function( sta, data, args ){
          delete window.bof_pageBuilder.widgets_data[ id ];
          window.bof_pageBuilder.build();
        },
        reload_after: false
      }
    );

  },
  build: function(){

    $(document).find("#build_site").html("");
    for ( var i=0; i<window.bof_pageBuilder.widgets_order.length; i++ ){
      var _w_k = window.bof_pageBuilder.widgets_order[i];
      var _w_d_html = this.buildWidget( _w_k, i );
      if ( _w_d_html )
      $(document).find("#build_site").append( _w_d_html )
    }

    if ( !window.bof_pageBuilder.widgets_order.length ){
      $(document).find("#build_site").append("<div class=\"_guide\">Drag a widget from `Available widgets`<br>& drop it here to start!</div>");
    }

    if ( this.pre_design ? this.pre_design.append !== false : true )
    $(document).find("#build_site").append("<div class='_widget_drop_site' data-id='bottom'>Drop here!</div>");

    $( "#build_site ._widget.movable" ).draggable({
      revert: true,
      scroll: false,
      zIndex: 190,
    });
    $( "#build_site ._widget_drop_site" ).droppable({
      drop: function( event, ui  ){

        var pageID = window.ui.page.curr().args.urlData.url.match[0];
        if ( isNaN( pageID ) ){
          $(document).find("body.page_page .pageBuilder_head ._h._setting").click();
          alert("Change to `Setting` tab and create the page first");
          return;
        }

        var $target = $(event.target);
        var $target_id = $target.data("id");
        var $target_pos = $target.hasClass("_before") ? "before" : "after";
        var $widget = ui.draggable;
        var $widget_id = $widget.data("id");

        if ( $widget_id == $target_id )
        return;

        if ( $widget_id ){

          if ( window.bof_pageBuilder.widgets_grid_order ){
            for ( var b=0; b<Object.keys(window.bof_pageBuilder.widgets_grid_order).length; b++ ){
              var _gwID = Object.keys(window.bof_pageBuilder.widgets_grid_order)[b];
              var _gwWS = window.bof_pageBuilder.widgets_grid_order[ _gwID ];
              if ( _gwWS ){
                for ( var z=0; z<Object.keys(_gwWS).length; z++ ){
                  var __gwI = Object.keys(_gwWS)[z];
                  var __gwID = _gwWS[__gwI];
                  if ( __gwID == $widget_id ){
                    delete window.bof_pageBuilder.widgets_grid_order[ _gwID ][ __gwI ];
                  }
                }
              }
            }
          }

          var $orders = window.bof_pageBuilder.get( "widgets_order" );
          var $new_orders = [];
          for( var i=0; i<$orders.length; i++ ){
            var $order = $orders[i];
            if ( $order == $widget.data("id") ) continue;
            if ( $order == $target_id && $target_pos == "before" )
            $new_orders.push( $widget.data("id") );
            $new_orders.push( $order );
            if ( $order == $target_id && $target_pos == "after" )
            $new_orders.push( $widget.data("id") );
          }
          if ( $target_id == "bottom" )
          $new_orders.push( $widget.data("id") );

          if ( $target_id.substr( 0, "widget_grid_".length ) == "widget_grid_" ){
            var wg_id_pos = $target_id.substr( "widget_grid_".length );
            var wg_id = wg_id_pos.substr( 0, wg_id_pos.length-2 );
            var wg_pos = wg_id_pos.substr( wg_id_pos.length-1 );
            if ( !window.bof_pageBuilder.widgets_grid_order[ wg_id ] )
            window.bof_pageBuilder.widgets_grid_order[ wg_id ] = {};
            window.bof_pageBuilder.widgets_grid_order[ wg_id ][ wg_pos ] = $widget_id;
          }

          window.bof_pageBuilder.widgets_order = $new_orders;
          window.bof_pageBuilder.save_orders();
          window.bof_pageBuilder.build();

        }
        else {
          window.bof_pageBuilder.edit_widget_start( "new", false, $widget.data("name"), $target_id, $target_pos );
        }

      }
    });

  },
  buildWidget: function( _w_k, child ){

    child = child === true;
    var _wF = window.bof_pageBuilder.widgets_data[ _w_k ];

    if ( !_wF ? true : !_wF.args_decoded ){
      return
    }
    var _w = _wF.args_decoded;

    var _w_s = window.bof_pageBuilder.get( "widgets_structures" )[ _w.wid_name ];
    if ( !_w_s ) return;

    var _w_n = null;
    if ( this.widgets_native && _wF.native ? Object.keys( this.widgets_native ).includes( _wF.native ) : false ){
      _w_n = this.widgets_native[ _wF.native ];
    }

    var _w_d_html = "";
    var btn_delete = false;
    var btn_edit = false;
    var btn_move = false;

    var _w_d_buttons_html = "";

    if ( _w_n ? ( _w_n.manage.delete !== false ) : true ){
      btn_delete = true;
      _w_d_buttons_html += "<div class='_button remove'><span class='material-icons-outlined remove'>delete</span></div>";
    }

    if ( _w_n ? ( _w_n.manage.edit !== false ) : true ){
      btn_edit = true;
      _w_d_buttons_html += "<div class='_button edit'><span class='material-icons-outlined edit'>edit</span></div>";
    }

    if ( _w_n ? ( _w_n.manage.move !== false ) : true ){
      btn_move = true;
      _w_d_buttons_html += "<div class='_button _move_handler'><span class='material-icons-outlined edit'>unfold_more</span></div>";
    }

    if ( child ? false : ( _w_n ? ( _w_n.manage.drops !== false ) : true ) )
    _w_d_html += "<div class='_widget_drop_site _before' data-id='"+_w_k+"'>Drop here!</div>";

    _w_d_html += "<div class='_widget "+( _w_n ? "native" : "generic" )+" "+( btn_move ? "movable" : "static" )+"' data-id="+_w_k+">\
      <div class='_head clearafter'>\
        <div class='_icon'><span class='material-icons-outlined'>"+_w_s.icon+"</span></div>\
        "+( _w_n ? "<div class='_native'>Custom<br>Widget</div>" : "" )+"\
        <div class='_name'>"+(_w.wid_name == "grid"?"Grid<br>Widget":_w_s.label)+"</div>\
        <div class='_title'>"+(_w.wid_name == "grid"?"":_w.wid_title)+"</div>\
        <div class='_buttons clearafter'>"+_w_d_buttons_html+"</div>\
      </div>";

    if ( ( _w.wid_name == "grid" || _w.gridType === true ) && !child ){
      _w_d_html += "<div class='widget_grid_list "+_w.columns+"'>";
      for ( var z=0; z<=_w.columns.match(/_/g).length; z++ ){

        _w_d_html += "<div class='widget_grid_part'>";
        if( window.bof_pageBuilder.widgets_grid_order[ _w_k ] ? window.bof_pageBuilder.widgets_grid_order[ _w_k ][z] : false ){

          var __w_k = window.bof_pageBuilder.widgets_grid_order[ _w_k ][z];
          var __w_d_html = this.buildWidget( __w_k, true );
          if ( __w_d_html )
          _w_d_html += __w_d_html;

        } else {
          _w_d_html += "<div class='_widget_drop_site _before' data-id='widget_grid_"+_w_k+"_"+z+"'>Drop here!</div>";
        }
        _w_d_html += "</div>";

      }
      _w_d_html += "</div>";
    }
    _w_d_html += "</div>";

    return _w_d_html;

  },
  save_orders: function(){

    var pageID = window.ui.page.curr().args.urlData.url.match[0];

    window.app.ui.becli.exe(
      "alert",
      {},
      {
        endpoint: "pageBuilder_widget_order",
        post: {
          page_id: pageID,
          order: window.bof_pageBuilder.widgets_order.join("||"),
          grid_order: JSON.stringify( window.bof_pageBuilder.widgets_grid_order )
        },
        reload_after: false
      }
    );

  }

};