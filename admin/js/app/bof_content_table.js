"use strict";

window.bof_content_table = {

  selectedIDS: {},

  displaying: function(){
    return window.app._extension( "daterangepicker", true );
  },
  ready: function( $args ){

    $(document).on( "click", "td._s .cb_wrapper input", function(e){

      var __p = $(e.target).parents(".bof_content_table_item");

      if ( __p.length ){
        $(__p[0]).toggleClass("active");
        var __ID = $(__p[0]).data("id");
        if ( window.bof_content_table.selectedIDS[ __ID ] ){
          delete window.bof_content_table.selectedIDS[ __ID ];
        } else {
          window.bof_content_table.selectedIDS[ __ID ] = true;
        }
      }
      else {

        window.bof_content_table.selectedIDS = {};
        var __allValue = $(e.target).prop("checked");
        $(document).find(".content_table_wrapper table tbody tr td._s input").prop( "checked", __allValue );
        if ( __allValue ){
          var is = $(document).find(".content_table_wrapper table tbody tr.bof_content_table_item td._s .cb_wrapper");
          for ( var i=0; i<is.length; i++ ){
            window.bof_content_table.selectedIDS[ $( is[i] ).parents("tr.bof_content_table_item").data("id") ] = true;
            $( is[i] ).parents("tr.bof_content_table_item").addClass( "active" );
          }
        } else {
          $(document).find(".content_table_wrapper table tbody tr.bof_content_table_item.active").removeClass("active");
        }

      }

      if ( Object.keys( window.bof_content_table.selectedIDS ).length ){
        $(document).find(".table_buttons .group_buttons").addClass("show");
        $(document).find(".table_buttons .new_button").removeClass("show");
      }
      else {
        $(document).find(".table_buttons .group_buttons").removeClass("show");
        $(document).find(".table_buttons .new_button").addClass("show");
      }

      window.ui.history.record( "content_table_selected_ids", window.bof_content_table.selectedIDS );

    } );
    $(document).on( "click", "#apply_filter", function(e){

      window.ui.link.navigate( window.ui.page.curr().args.link + "?" + $(document).find(".filters_wrapper form").serialize(), {
        filters_form_data: $(document).find(".filters_wrapper form").serialize()
      } )

    } );
    $(document).on( "click", ".content_table_wrapper .pages_buttons .page_button", function(e){

      var __val = $(e.target).text();
      var __cur = parseInt( $(document).find( ".content_table_wrapper .pages_buttons .page_button.active" ).text() );

      if ( __val == "Next" )
      __val = __cur + 1;
      else if ( __val == "Previous" )
      __val = __cur - 1;
      else
      __val = parseInt( __val );

      if ( __val == __cur )
      return;

      window.ui.link.navigate( window.ui.page.curr().args.link + "?" + $(document).find(".filters_wrapper form").serialize() + "&page=" + __val )

    } );
    $(document).on( "click", ".filters .clear", function(){

      window.ui.link.navigate( window.ui.page.curr().args.link );

    } );
    $(document).on( "click", ".filters .close", function(){
      $(this).removeClass("active");
      $(document).find("#table_filters").removeClass("active");
      $(document).find(".content_table_wrapper").show();
    });
    $(document).on( "click", "#start_bulk_action", function(){

      var IDS = Object.keys( window.bof_content_table.selectedIDS );
      var option = $(document).find("#group_buttons option:selected");
      window.bof_content_table.exe_button( "multi", IDS, option );

    });
    $(document).on( "click", ".content_table_wrapper table tbody tr td._m .bof_dropdown a", function(e){

      var tr = $(this).parents(".bof_content_table_item");
      var ID = tr.data("id");
      var option = $(this);

      window.bof_content_table.exe_button( "single", ID, option );

    });
    $(document).on( "submit", "#table_search_form", function(e){

      var query = $(this).find("input").val();
      $(document).find( ".filters_wrapper .filters .filter_wrapper.i_n_query input" ).val( query );
      $(document).find( "#apply_filter" ).click();

      e.preventDefault();
      return false;

    })
    $(document).on( "click", "#table_search_btn", function(e){
      $(document).find("#table_search_form").submit();
    })
    $(document).on( "click", ".filter_head .filter_handler_wrapper .filter_handler", function(){
      var sta = $(document).find("#table_filters").hasClass("active");
      if ( sta ){
        $(this).removeClass("active");
        $(document).find("#table_filters").removeClass("active");
        $(document).find(".content_table_wrapper").show();

      } else {
        $(this).addClass("active");
        $(document).find("#table_filters").addClass("active");
        $(document).find(".content_table_wrapper").hide();
      }
    } )
    $(document).on( "click", ".content_table_wrapper .boolean_toggle_handler", function(e){

      var sta = !$(this).is(":checked");
      var ID = $(this).parents(".bof_content_table_item").data("id");
      var payload = $(this).data( ( sta ? "negative" : "positive" ) + "-payload")

      window.app.ui.becli.exe( "alert", {}, {
        endpoint: window.ui.page.curr().data.becli.content.object_endpoint + "?bof=submitting&IDs=" + ID,
        post: {
          __action: payload
        }
      } );

    } );

    var history = window.ui.history.get().content_table_selected_ids;
    if ( history ){
      for ( var i=0; i<Object.keys(history).length; i++ ){
        var __i = Object.keys(history)[i];
        $(document).find(".bof_content_table_item.ID_"+__i+" td._s input").click();
      }
    }

  },
  unloading: function(){

    window.bof_content_table.selectedIDS = {};
    $(document).off( "click", "td._s .cb_wrapper input" );
    $(document).off( "click", "#apply_filter" );
    $(document).off( "click", ".content_table_wrapper .pages_buttons .page_button" );
    $(document).off( "click", ".filters .clear" );
    $(document).off( "click", ".filters .close" );
    $(document).off( "click", "#start_bulk_action" );
    $(document).off( "click", ".content_table_wrapper table tbody tr td._m .bof_dropdown a" );
    $(document).off( "click", ".filter_head .filter_handler_wrapper .filter_handler" );
    $(document).off( "submit", "#table_search_form" );
    $(document).off( "click", "#table_search_btn" );
    $(document).off( "click", ".content_table_wrapper .boolean_toggle_handler" );

  },
  exe_button: function( $type, $id, $option ){

    var payload = null;
    if ( $option.text() == "Edit" ){
      window.ui.link.navigate( window.ui.page.curr().data.becli.content.config.edit_page_url + "/" + $id );
      return;
    }
    else if ( $option.text() == "Delete" ){
      payload = {
        post: {
          __action: "delete"
        }
      }
    }
    else if ( $option.text() == "Delete & Blacklist" ){
      payload = {
        post: {
          __action: "delete",
          blacklist: true
        }
      }
    }
    else if ( $option.text() == "Visit" ){
      payload = {
        post: {
          __action: "visit",
        },
        c_callback: function( sta, data ){
          if ( sta && data ? data.url : false ){
            var _ba = $_bof_config.web_address.replace("admin/","");
            if ( _ba + "/" == data.url.substr( 0, _ba.length + 1 ) ){
              data.url = data.url.replace( _ba + "/", _ba );
            }

            window.open(data.url); 
          }
        }
      }
    }
    else {
      payload = $option.data("payload")
    }

    if ( payload){

      var $_payload = $.extend( {
        endpoint: window.ui.page.curr().data.becli.content.object_endpoint + "?bof=submitting&IDs=" + $id
      }, payload );

      window.app.ui.becli.exe( "alert", {}, $_payload );

    }


  }

}