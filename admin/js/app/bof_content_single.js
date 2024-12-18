"use strict";

window.bof_content_single = {

  displaying: function(){

    var daterangepicker_promise = window.app._extension( "daterangepicker", true );
    var editorjs_promise = window.app._extension( "editorjs" );
    return $.when( editorjs_promise, daterangepicker_promise );

  },
  ready: function(){

    if ( window.ui.page.curr().data.becli.entity ){

      var _title = window.ui.page.curr().args.title;

      if ( window.ui.page.curr().data.becli.entity.type == "single" )
      window.app.ui.head.set( "Edit " + _title );

      else if ( window.ui.page.curr().data.becli.entity.type == "multi" )
      window.app.ui.head.set( "Edit " + _title + "s" + " <span class='count'>"+ window.ui.page.curr().data.becli.entity.request.IDS.length +"</span>" );

      else {
        window.app.ui.head.set( "New " + _title );
        $(document).find(".settings_wrapper #save_button").text("Create");
      }

    }

    var editor_jsS = {};
    if ( $(document).find(".editor_js_child").length ){
      for ( var z=0; z<$(document).find(".editor_js_child").length; z++ ){

        var editor_js_holder = $(document).find(".editor_js_child")[z];
        var editor_js_name = $(editor_js_holder).data("name");
        var editor_js_value = {};

        try {
          editor_js_value = JSON.parse( window.ui.page.curr().data.becli.entity.display[ editor_js_name ].input.value );
        } catch( e ){}

        var editor_js = new EditorJS({
          holder: editor_js_holder,
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
          data: editor_js_value
        });

        editor_jsS[ editor_js_name ] = editor_js;

      }
    }

    $(document).find( ".setting_group.type_multi .input_wrapper .bof_input" ).attr( "disabled", true );
    $(document).on( "click", ".setting_group.type_multi .lock_wrapper input", function(e){
      var target_name = $(e.target).attr("name").substr( 0, $(e.target).attr("name").length - 5 );
      var target_lock = !$(e.target).is(":checked");
      $(document).find("#item_"+target_name).addClass( target_lock ? "locked" : "unlocked" ).removeClass( target_lock ? "unlocked" : "locked" );
      $(document).find("#item_"+target_name+" .input_wrapper .bof_input").attr( "disabled", target_lock );
    } )
    $(document).on( "change", ".setting_group .bof_input", function(e){
      window.bof_content_single.exe_display_rules();
    });
    $(document).on( "click", ".settings_wrapper #save_button", function(e){

      var saveBtn = $(this);
      if ( saveBtn.attr("disabled") )
      return;

      var postData = $("#single_form").serializeArray();
      if ( typeof( window.ui.page.curr().args._single_before_submit ) == "function" )
      postData = window.ui.page.curr().args._single_before_submit();

      $(this).removeClass("bof_done").removeClass("bof_fail").addClass("bof_processing");
      var promiseToEncodeForm = $.Deferred();

      function __editorJS_save( editor_js_key, editor_js, editor_js_promise ){
        editor_js.save().then( (editor_js_output) => {
          editor_js_promise.resolve({name:editor_js_key,data:JSON.stringify(editor_js_output)});
        }).catch( (editor_js_fail) => {
          editor_js_promise.reject( editor_js_fail );
        });
      }

      if ( Object.keys(editor_jsS).length ){

        var editor_jsS_promises = [];
        for ( var z=0; z<Object.keys(editor_jsS).length; z++ ){

          var editor_js_promise = $.Deferred();
          editor_jsS_promises.push( editor_js_promise );

          var editor_js_key = Object.keys(editor_jsS)[z];
          var editor_js = editor_jsS[editor_js_key];

          __editorJS_save( editor_js_key, editor_js, editor_js_promise );

        }

        $.when.apply( $, editor_jsS_promises ).done(function(){
          var editor_jsS_results = Array.prototype.slice.call( arguments, 0 );
          for( var z=0; z<editor_jsS_results.length; z++ ){
            var editor_jsS_result = editor_jsS_results[z];
            postData.push({
              name: editor_jsS_result.name,
              value: editor_jsS_result.data
            });
          }
          promiseToEncodeForm.resolve(postData);
        });

      } else {
        promiseToEncodeForm.resolve(postData);
      }

      promiseToEncodeForm.done(function(_data){

        saveBtn.removeClass("bof_processing");
        window.app.ui.becli.exe(
          "button",
          {
            dom: $(document).find( ".settings_wrapper #save_button" ),
            redirect: window.ui.page.curr().data.becli.entity.redirect
          },
          {
            endpoint: window.ui.page.curr().data.becli.entity.endpoint + "?bof=submitting&IDs=" + window.ui.page.curr().args.urlData.url.match[0] + "&" + window.ui.page.curr().args.urlData.url.query_s,
            post: _data,
          },
        );

      }).fail(function(_error){
        console.log("Serializing form failed");
        alert( _error );
      });

    } );
    $(document).on( "click", ".settings_wrapper ._groups ._group", function(e){
      $(document).find(".settings_wrapper ._groups ._group.active").removeClass("active");
      $(this).addClass("active");
      var name = $(this).data("id");
      $(document).find(".setting_group .setting_wrapper").addClass("hideByGroup");
      $(document).find(".setting_group .setting_wrapper.group_" + name ).removeClass("hideByGroup");
    } );
    $(document).on( "change", ".settings_wrapper .setting_group .setting_wrapper .input_wrapper .bof_input.seo_slug", function(e){
      if ( window.ui.page.curr().data.becli.entity.type == "new" ){
        if ( !window.ui.history.get()["seo_slug_touched"] ){
          $(document).find(".settings_wrapper .setting_group .setting_wrapper .input_wrapper .bof_input[name='seo_url']").val(
            $(this).val()
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '')
          );
        }
      }
    } );
    $(document).on( "change", ".settings_wrapper .setting_group .setting_wrapper .input_wrapper .bof_input[name='seo_url']", function(e){
      window.ui.history.record( "seo_slug_touched", true );
    } );

    $(document).find(".setting_group .setting_wrapper").addClass("hideByGroup");
    $(document).find(".setting_group .setting_wrapper.group_detail").removeClass("hideByGroup");
    window.bof_content_single.exe_display_rules();

  },
  unloading: function(){

    $(document).off( "click", ".setting_group.type_multi .lock_wrapper input" );
    $(document).off( "change", ".setting_group .bof_input" );
    $(document).off( "click", ".settings_wrapper #save_button" );
    $(document).off( "click", ".settings_wrapper ._groups ._group" );
    $(document).off( "change", ".settings_wrapper .setting_group .setting_wrapper .input_wrapper .bof_input.seo_slug" );
    $(document).off( "change", ".settings_wrapper .setting_group .setting_wrapper .input_wrapper .bof_input[name='seo_url']" );
    $(document).find("body > div.ct").remove();

  },
  exe_display_rules: function(){
    if ( window.ui.page.curr().data.becli.entity ? window.ui.page.curr().data.becli.entity.display : false ){
      var __inputs = window.ui.page.curr().data.becli.entity.display;
      window.bof_input.exe_display_rules( __inputs );
    }
  }

}
