"use strict";

window.bof_input = {

  cache: {
    dropzones: []
  },
  hook: function(){
  },
  load_daterangepicker: function(){

    var assets = {
      moment_js: {
        type: "js",
        name: "moment_js",
        path: "third/daterangepicker/moment.min.js",
        skipNameCheck: true,
        base: "bof_assets",
        version: false
      },
      daterangepicker: [
        {
          type: "js",
          name: "moment_js",
          path: "third/daterangepicker/moment.min.js",
          skipNameCheck: true,
          base: "bof_assets",
          version: false
        },
        {
          type: "js",
          name: "daterangepicker_js",
          path: "third/daterangepicker/daterangepicker.js",
          skipNameCheck: true,
          base: "bof_assets",
          version: false
        },
        {
          type: "css",
          name: "daterangepicker_css",
          path: "js/third/daterangepicker/daterangepicker.css",
          dir: false,
          base: "bof_assets",
          version: false
        },
        {
          type: "css",
          name: "daterangepicker_custom_css",
          path: "js/third/daterangepicker/_custom.css",
          dir: false,
          base: "bof_assets",
          version: false
        }
      ],
    };

    var promiseToLoadAll = $.Deferred();
    window.bof._loadExtension( assets.moment_js ).done(function(){

      var _ps = [];
      for ( var i=0; i<assets.daterangepicker.length; i++ ){

        var di = assets.daterangepicker[i];

        if ( di.type == "js" )
        _ps.push( window.bof._loadExtension( di ) );

        else
        _ps.push( window.bof._loadCSS( di ) );

      }

      $.when.apply( $, _ps ).done(function(){
        promiseToLoadAll.resolve();
      })

    })
    return promiseToLoadAll;

  },
  hook_daterangepicker: function(){

    if ( $('.bof_time_range').length ){

      var t = $('.bof_time_range').daterangepicker({
        "showDropdowns": true,
        "timePicker": true,
        "timePicker24Hour": true,
        "startDate": moment().subtract(7, 'days'),
        "endDate": moment(),
        "opens": "center",
        "drops": "auto",
        autoUpdateInput: false,
        locale: {
          format: 'YY-MM-DD hh:mm'
        }
      });

      $('.bof_time_range').on('apply.daterangepicker', function(ev, picker) {
        $(this).val(picker.startDate.format('YYYY-MM-DD hh:mm') + ' - ' + picker.endDate.format('YYYY-MM-DD hh:mm'));
      });

    }
    if ( $('.bof_input[type=datetime]:not(.ymd)').length ){

      $('.bof_input[type=datetime]:not(.ymd)').daterangepicker({
        "singleDatePicker": true,
        "showDropdowns": true,
        "timePicker": true,
        "timePicker24Hour": true,
        "opens": "center",
        "drops": "auto",
        autoUpdateInput: false,
        locale: {
          format: 'YY-MM-DD hh:mm:ss'
        }
      });

      $('.bof_input[type=datetime]:not(.ymd)').on('apply.daterangepicker', function(ev, picker) {
        $(this).val(picker.startDate.format('YYYY-MM-DD hh:mm:ss'));
      });

    }
    if ( $('.bof_input.ymd[type=datetime]').length ){
      
      $('.bof_input.ymd[type=datetime]').daterangepicker({
        "singleDatePicker": true,
        "showDropdowns": true,
        "timePicker": false,
        "timePicker24Hour": false,
        "opens": "center",
        "drops": "auto",
        autoUpdateInput: false,
        locale: {
          format: 'YY-MM-DD'
        }
      });

      $('.bof_input.ymd[type=datetime]').on('apply.daterangepicker', function(ev, picker) {
        $(this).val(picker.startDate.format('YYYY-MM-DD'));
      });

    }

  },
  unhook: function(){

    $(document).find("form.dropzone_form").remove();
    $(document).find(".dz-hidden-input").remove();
    $(document).find(".daterangepicker.openscenter").remove();

    if ( window.bof_input.cache.dropzones ? window.bof_input.cache.dropzones.length : false ){
      for ( var i=0; i<window.bof_input.cache.dropzones.length; i++ ){
        var dropZone = window.bof_input.cache.dropzones[i];
        try {
          dropZone.destroy();
        } catch( $err ){}
        window.bof_input.cache.dropzones = [];
      }
    }

  },

  listen: function(){

    $(document).on( "click", ".file_input_wrapper .mask", window.bof_input.callByClick )
    $(document).on( "click", ".file_input_wrapper .preview_buttons .delete", function(){

      var p = $(this).parents(".file_input_wrapper");
      p.removeClass("has_preview");
      p.find("input.ci").val("");
      p.find("input.cp").val("");
      p.removeClass("_started").removeClass("_done").removeClass("_doing").removeClass("_failed").find(".mask_text").text("Upload");

    } )
    $(document).on( "click", ".file_input_wrapper .preview_buttons .open", function(){

      var p = $(this).parents(".file_input_wrapper");
      var img = p.find(".preview").css("background-image").substr( 5, p.find(".preview").css("background-image").length-7 );
      var winOpen = window.open( img, '_blank');

      if (winOpen)
      winOpen.focus();
      else
      alert('Please allow popups for this website');

    } )
    $(document).on( "click", ".object_input_wrapper .objects_wrapper .object_wrapper ._close", function(){

      var ow = $(this).parents(".object_wrapper");
      var input = $(this).parents(".object_input_wrapper").find("._ids");
      var ID = ow.data("id").toString();
      var IDS = input.val() ? input.val().split(",") : [];
      if ( IDS.includes( ID ) )
      IDS = window._g.removeValFromArray( IDS, ID );

      input.val( IDS.join(",") );
      $(document).trigger( "bofInput_change", [ input ] );
      var ows = $(this).parents(".objects_wrapper");
      if ( IDS.length ) ows.addClass("has_items");
      else ows.removeClass("has_items");

      ow.remove();

    } );
    $(document).on( "click", ".bof_dropdown.object_dropdown .search_input_wrapper .btn-primary", function(){

      var dd = $( $(this).parents(".bof_dropdown")[0] );
      var object_type = dd.find(".search_input_wrapper input.bofInput_object_type").val();
      var object_sub_type = dd.find(".search_input_wrapper input.bofInput_object_sub_type").val();
      var extra_query = dd.find(".search_input_wrapper input.bofInput_extra_query").val();
      var query = dd.find(".search_input_wrapper input.bofInput_bof_query").val();
      var _add = dd.parents(".object_input_wrapper").find(".dropdown_button._add");

      dd.find(".search_results_wrapper").html( "<span class='loading'>Loading ...</span>" )

      window.becli.exe({
        ID: "o_search",
        pageAttachment: true,
        endpoint: "bofInput/object/",
        post: {
          bofInput_bof_query: query,
          bofInput_object_type: object_type,
          bofInput_object_sub_type: object_sub_type,
          bofInput_extra_query: extra_query
        },
        callBack: function( sta, data ){

          window.ui.theme.part( "theme/parts/object_search_result", { target: false, base: $_bof_config.assets_address } ).done(function(htmlData){
            window.render.mix( htmlData, data.objects ).done(function(renderedData){
              dd.find(".search_results_wrapper").html( renderedData );
              setTimeout(function(){
                window.bof_dropdown._exe( _add, dd );
              },50);
            })
          })

        }
      });

    });
    $(document).on( "click", ".bof_dropdown.object_dropdown .search_input_wrapper .btn-secondary", function(){

      $( $(this).parents(".bof_dropdown")[0] ).removeClass("active");

    });
    $(document).on( "click", ".object_input_wrapper .objects_wrapper .object_wrapper.new ._add", function(){

      if ( !$(this).hasClass("inied") )
      $(this).addClass("inied").parents(".object_input_wrapper").find(".search_input_wrapper .btn-primary").click();

    })
    $(document).on( "click", ".bof_dropdown.object_dropdown .search_results_wrapper .search_object_wrapper ._select", function(){

      var _ID = $(this).data("id").toString();
      var ows = $(this).parents(".object_input_wrapper").find(".objects_wrapper");
      var _title = $(this).data("title");
      var _image = $(this).data("image");

      var ids = $(this).parents(".object_input_wrapper").find("._ids").val() ? $(this).parents(".object_input_wrapper").find("._ids").val().split(",") : [];
      var _string = "";

      $(this).parents(".search_object_wrapper").addClass("added");

      if ( ids.includes( _ID ) ){
        ids = window._g.removeValFromArray( ids, _ID );
        ids.push( _ID );
        return;
      }

      if ( ows.hasClass("single") && ids.length ){
        ids = [];
        $(this).parents(".object_input_wrapper").find(".objects_wrapper .object_wrapper:not(.new)").remove();
      }

      if ( _image ){
        _string = '<div class="object_wrapper has_image" data-id="'+_ID+'">\
            <div class="_image_wrapper">\
              <div class="_image" style="background-image:url(\''+_image+'\')"></div>\
            </div>\
          <div class="_title">'+_title+'</div>\
          <div class="mdi mdi-close _close"></div>\
        </div>';
      } else {
        _string = '<div class="object_wrapper" data-id="'+_ID+'">\
          <div class="_title">'+_title+'</div>\
          <div class="mdi mdi-close _close"></div>\
        </div>';
      }

      $(this).parents(".object_input_wrapper").find(".objects_wrapper .new").before( _string );
      ids.push( _ID );
      $(this).parents(".object_input_wrapper").find("._ids").val( ids.join(",") )
      $(document).trigger( "bofInput_change", [ $(this).parents(".object_input_wrapper").find("._ids").val ] );

      if ( ids.length ) ows.addClass("has_items");
      else ows.removeClass("has_items");

    })

  },
  callByClick: function(){

    var ID = "form" + window._g.uniqid( 5 );
    var clicked_item = $(this);
    var handler = clicked_item.parents(".file_input_wrapper");
    handler.addClass( ID );

    var setting = {};
    setting["type"] = handler.data( "type" );
    setting["object_type"] = handler.data( "object-type" );
    setting["accept"] = handler.data( "accept" );
    setting["chunk"] = handler.data( "chunk" ) == "yes";
    setting["chunk_size"] = handler.data( "chunk-size" );
    setting["max_files"] = handler.data( "max_files" ) ? handler.data( "max_files" ) : 1;

    $("body").append("<form style='display:none' class='dropzone_form' ID='"+ID+"' data-endpoint='bofInput/file/' data-hasFile='yes' data-type='file' data-callback='window.bof_input.callback' data-callback_param='"+ID+"'>\
    <input type='file' name='the_file' accept="+(setting["accept"]?setting["accept"]:"*")+">\
    </form>");

    $(document).on("change","form#"+ID+" input",function(){
      $(document).find("form#"+ID).submit();
    })

    window.bof_input.callbefore( ID );
    window.bof_input.dropzone_start( ID, setting );

  },
  dropzone_start: function( ID, setting, args ){

    args = args ? args : {};

    window.bof._loadExtension({
      type: "js",
      name: "dropzone_js",
      path: "third/dropzone-5.7.0/dist/dropzone.js",
      base: "bof_assets",
      skipNameCheck: true,
      version: false,
      ini: function(){
        Dropzone.autoDiscover = false;
      }
    })
    .done(function(){

      var def_args = {
        url: window.config.endpoint_address+"bofInput/file/?type=" + setting["type"] + "&object_type=" + setting["object_type"],
        paramName: "$file",
        acceptedFiles: setting["accept"],
        retryChunksLimit: 1,
        parallelUploads: 1,
        createImageThumbnails: false,
        maxFilesize: 2000,
        init: function(){
          window.bof_input.dropzone_init( this, setting, ID );
        },
      }

      args = $.extend( def_args, args );

      if ( setting["chunk"] ? setting["chunk"] != "no" : false ){
        args['chunking'] = true;
        args['retryChunks'] = true;
        args['chunkSize'] = setting["chunk_size"] * 1000 * 1000
      }

      args.maxFiles = setting["max_files"];

      var myDropzone = new Dropzone(
        "#" + ID,
        args
      );

      window.bof_input.cache.dropzones.push( myDropzone );

    })

  },
  dropzone_init: function( myDropzone, setting, ID ){

    myDropzone.clickableElements[0].click()

    myDropzone.on("canceled", function(file) {
      console.log( "canceled" );
    });

    myDropzone.on("error", function(file) {
      console.log( "error" );
    });

    myDropzone.on("sending", function(file,xhr) {
      window.becli.sign( xhr );
    });

    myDropzone.on("addedfile", function(file) {
      window.bof_input.dropzone_progress( "addedfile", this, ID );
      $(document).find(".file_input_wrapper."+ID).addClass("_doing").find(".mask_text").text("0%")
    });

    myDropzone.on("uploadprogress", function(file){
      window.bof_input.dropzone_progress( "uploadprogress", this, ID );
    });

    myDropzone.on("complete", function(){
      window.bof_input.dropzone_progress( "complete", this, ID );
    });

  },
  dropzone_report: function( myDropzone, ID ){

    var _report = {

      total_files: 0,
      total_done: 0,
      total_fail: 0,
      total_active: 0,
      total_queued: 0,

      total_size: 0,
      total_size_uped: 0,

      _allDone: false

    };

    if ( !myDropzone.files ? true : !myDropzone.files.length )
    return _report;

    _report.total_files = myDropzone.files.length;

    for ( var i=0; i<myDropzone.files.length; i++ ){

      var __file = myDropzone.files[i];

      _report.total_size += __file.size;

      var total_uped = __file.upload.bytesSent;
      if ( total_uped > __file.size ) total_uped = __file.size;

      if ( __file.status == "error" ){
        _report.total_fail += 1;
        _report.total_size -= __file.size;
      }
      else if ( __file.status == "queued" ){
        _report.total_queued += 1;
      }
      else if ( __file.status == "success" ){
        _report.total_done += 1;
        _report.total_size_uped += __file.size;
      }
      else if ( __file.status == "uploading" ){
        _report.total_active += 1;
        _report.total_size_uped += total_uped;
      }

    }

    _report["progress"] = Math.round( _report.total_size_uped / _report.total_size * 100);
    _report["progress"] = _report["progress"] > 100 ? 100 : _report["progress"];

    _report["_allDone"] = _report.total_fail + _report.total_done == _report.total_files && _report.total_files >= 1 && _report.total_active == 0;

    return _report;

  },
  dropzone_progress: function( event, myDropzone, ID ){

    var _report = window.bof_input.dropzone_report( myDropzone, ID );

    $(document).find(".file_input_wrapper."+ID).addClass("_doing").find(".mask_text").text(_report.progress+"%")
    $(document).find(".file_input_wrapper."+ID+" .mask .progress").css( "width", _report.progress+"%" );

    if ( _report._allDone ){

      var __done = true;
      var __response = null;
      try {
        __response = JSON.parse( myDropzone.files[0].xhr.responseText );
      } catch(e) {
        __done = false;
      }

      window.bof_input.callback( __done, __response, ID );

    }

  },
  callbefore: function( ID ){

    $(document).find(".file_input_wrapper."+ID).addClass("bof_upload").addClass("_started").removeClass("_done").removeClass("_doing").removeClass("_failed").find(".mask_text").text("Wait ...");

  },
  callback: function( sta, data, ID ){

    $(document).find("#"+ID).remove();
    $(document).find(".file_input_wrapper."+ID).removeClass("_doing");
    $(document).find(".file_input_wrapper."+ID+" .mask .progress").css( "width", "0" );

    if ( sta ? ( data.messages[0] == "done" || data.messages[0] === window.lang.cache.done ) : false ){

      $(document).find(".file_input_wrapper."+ID).addClass("_done").find(".mask_text").text(window.lang.cache.done);
      $(document).find(".file_input_wrapper."+ID + " .ci").val( data.file_id );
      $(document).find(".file_input_wrapper."+ID + " .cp").val( data.file_pass );
      if ( data.file_preview ){
        $(document).find(".file_input_wrapper."+ID).addClass("has_preview");
        $(document).find(".file_input_wrapper."+ID + " .preview").css( "background-image", "url('"+data.file_preview+"')" );
      }

      setTimeout( function(){
        if ( $(document).find(".file_input_wrapper."+ID).hasClass("_done") ){
          $(document).find(".file_input_wrapper."+ID).removeClass("_done").find(".mask_text").text("upload");
        }
      }, 2500 );

    }
    else {
      $(document).find(".file_input_wrapper."+ID).addClass("_failed").find(".mask_text").text(data.messages[0]);
    }

  },
  exe_display_rules: function( $inputs ){
    for ( var i=0; i<Object.keys($inputs).length; i++ ){

      var __input_key = Object.keys($inputs)[ i ];
      var __input = $inputs[ __input_key ];
      if ( __input.display_on ){

        $(document).find( "#item_" + __input_key ).addClass( "hideByRules" );

        var __rules = __input.display_on;
        var __cond = __input.display_on_cond ? __input.display_on_cond : "and";
        var ___met = null;
        var ___met_all = true;
        var ___met_one = false;

        for ( var z=0; z<Object.keys(__rules).length; z++ ){

          var __rule_key = Object.keys(__rules)[ z ];
          var __target_input = $inputs[ __rule_key ].input;

          var __target_value = window.bof_input.get_input( __target_input  )

          var __rule = __rules[ __rule_key ];
          var __rule_cond = __rule[0];
          var __rule_args = __rule[1];

          if ( __rule_cond == "equal" ){
            if ( __target_value == __rule_args )
            ___met_one = true;
            else
            ___met_all = false;
          }
          else if ( __rule_cond == "in_array" ){
            if ( __rule_args.indexOf( __target_value ) > -1 )
            ___met_one = true;
            else
            ___met_all = false;
          }
          else {
            bof.log( "app.ui.content_single.exe_display_rules => failed to run condition " + __rule_cond );
          }

        }

        if ( __cond == "and" && ___met_all )
        ___met = true;
        else if ( __cond == "or" && ___met_one )
        ___met = true;
        else
        ___met = false;

        if ( ___met ){
          $(document).find( "#item_" + __input_key ).removeClass("hideByRules");
        }

      }
    }

  },
  get_input: function( __target_input ){

    var __target_dom = $(document).find("[name="+__target_input.name+"]");
    var __target_value = null;

    if ( __target_input.type == "text" || __target_input.type == "textarea" || __target_input.type == "hidden" )
    __target_value = __target_dom.val();
    else if ( __target_input.type == "select" )
    __target_value = __target_dom.find("option:selected").val();
    else if ( __target_input.type == "select_i" )
    __target_value = $(document).find("[name="+__target_input.name+"]:checked").val();
    else if ( __target_input.type == "checkbox" )
    __target_value = $(document).find("[name="+__target_input.name+"]").is(":checked");
    else
    bof.log( "app.ui.content_single.exe_display_rules => failed to get __target_value for type:" + __target_input.type );

    return __target_value;

  },

}
