"use strict";

window.bof_modal = {

  cache: {
    inputs: [],
    groups: [],
    group: null,
    btn_text: null,
  },
  create: function( $args ){

    if ( !$args )
    return;

    var Promise = $.Deferred();
    var $class    = $args.class   ? $args.class   : false;
    var $title    = $args.title   ? $args.title   : false;
    var $tip      = $args.tip     ? $args.tip     : false;
    var $content  = $args.content ? $args.content : false;
    var $inputs   = $args.inputs  ? $args.inputs  : false;
    var $groups   = $args.groups  ? $args.groups  : false;
    var $buttons  = $args.buttons ? $args.buttons : false;
    var $layer    = $args.layer   ? $args.layer   : 1;

    $("body").addClass("active_modal");

    var $html = "";
    $html = $html + "<div class='modal_hover close_modal_handle layer_"+$layer+" "+$class+"'></div>";
    $html = $html + "<div class='modal_wrapper'><div class='modal layer_"+$layer+" "+$class+"'><form>";

    if ( $title )
    $html = $html + "<div class='title'>"+$title+"<span class='material-icons-outlined close_modal_handle'>close</span></div>";

    if ( $tip )
    $html = $html + "<div class='tip'>"+$tip+"</div>";

    if ( $groups ){
      var $groups_html = "<div class='groups'>";
      for ( var i=0; i<Object.keys( $groups ).length; i++ ){
        var $group_k = Object.keys( $groups )[i];
        var $group = $groups[ $group_k ];
        $groups_html += "<div class='group group_"+$group[0]+"' data-id='"+$group[0]+"'>"+$group[1]+"</div>";
      }
      $groups_html += "</div>";
      $html += $groups_html;
    }

    if ( $content )
    $html = $html + "<div class='content after'>"+$content+"</div>";

    window.bof_modal.render_inputs( $inputs ).done(function( inputs_renderred ){

      if ( inputs_renderred )
      $html = $html + "<div class='inputs'>"+ inputs_renderred +"</div>";

      $html = $html + "<div class='response'></div>";

      if ( $buttons ){

        $html = $html + "<div class='buttons'>";
        for( var i=0; i<$buttons.length; i++ ){
          $html = $html + "<div class='button'><a class='btn "+$buttons[i][0]+"' onClick='"+$buttons[i][2]+"'>"+$buttons[i][1]+"</a></div>";
        }
        $html = $html + "<div class='button'><a class='btn btn-secondary close_modal_handle'>Cancel</a></div>";
        $html = $html + "</div>";

      }

      $html = $html + "</form></div></div>";

      $("body").append( $html );

      if ( $layer == 1 ){

        $(document).find(".modal .inputs .input").addClass("hideByGroup")
        $(document).find(".modal .inputs .input.group_a").removeClass("hideByGroup")
        $(document).find(".modal .groups .group.group_a").addClass("active")
        window.bof_modal.cache.group = "a";
        $(document).on( "click", ".modal.layer_1 .groups .group", function(e){

          var selectedGroup = $(e.target).data("id");
          window.bof_modal.cache.group = selectedGroup;

          $(document).find(".modal .inputs .input").addClass("hideByGroup");
          $(document).find(".modal .inputs .input.group_"+selectedGroup).removeClass("hideByGroup")

          $(document).find(".modal .groups .group.active").removeClass("active");
          $(document).find(".modal .groups .group.group_"+selectedGroup).addClass("active");

          window.bof_input.exe_display_rules( $inputs );
          $(document).find(".modal .inputs .input:not(.group_"+selectedGroup+")").addClass("hideByGroup")

        } );
        $(document).on( "click", ".close_modal_handle", function(){

          window.bof_modal.close();

        } );

        window.bof_input.exe_display_rules( $inputs );
        $(document).find(".modal .inputs .input:not(.group_"+window.bof_modal.cache.group+")").addClass("hideByGroup");

        $(document).on( "change", ".modal.layer_1 .bof_input", function(e){
          window.bof_input.exe_display_rules( $inputs );
          $(document).find(".modal .inputs .input:not(.group_"+window.bof_modal.cache.group+")").addClass("hideByGroup");
        });

      }

      $(document).trigger( "modal_created", $args );
      window.bof_input.hook();
      Promise.resolve();

    });

    return Promise;

  },
  render_inputs: function( $inputs ){

    var promiseToRenderAll = $.Deferred();
    var promises = [];

    if ( !$inputs ){
      promiseToRenderAll.resolve();
      return promiseToRenderAll;
    }

    for ( var i=0; i<Object.keys( $inputs ).length; i++ ){
      var $input_k = Object.keys( $inputs )[i];
      var $input_v = $inputs[ $input_k ];
      var $input_promise = window.bof_modal.render_input( $input_k, $input_v );
      promises.push( $input_promise );
    }

    $.when.apply( $, promises ).done(function(){
      var inputs = Array.prototype.slice.call( arguments, 0 );
      promiseToRenderAll.resolve( inputs.join( "\n" ) );
    });

    return promiseToRenderAll;

  },
  render_input: function( $name, $data ){

    var promiseToRender = $.Deferred();

    window.ui.theme.part( "parts/o_input", { target: false } ).done(function( html ){
      window.render.mix( html, $data["input"] ).done(function( renderred ){

        var html = "<div id='item_"+$data["input"]["name"]+"' class='setting_wrapper input group_"+$data["group"]+" "+($data.class?$data.class:"")+"' >";

        if ( $data.title )
        html += "<div class='label'>"+ $data.title.replace( "<br>", "" ) +"</div>";

        else if ( $data.label )
        html += "<div class='label'>"+ $data.label.replace( "<br>", "" ) +"</div>";


        html += "<div class='input_wrapper'>" + renderred + "</div>";

        if ( $data.tip )
        html += "<div class='tip'>"+ $data.tip +"</div>";

        if ( $data.content )
        html += $data.content;

        html += "</div>";

        promiseToRender.resolve( html );

      })
    });

    return promiseToRender;

  },
  close: function(){

    var l2 = $(document).find(".modal_hover.layer_2").length ? true : false;

    if ( l2 ){
      $(document).find(".modal_hover.layer_2").remove();
      $(document).find(".modal.layer_2").remove();
    }
    else {
      $(document).find(".modal_hover").remove();
      $(document).find(".modal_wrapper").remove();
      $(document).off( "click", ".modal .groups .group" );
      $(document).off( "click", ".close_modal_handle" );
      $("body").removeClass("active_modal")
    }

    $(document).trigger("model_destroyed");

  },
  get: function( $turnObject, $class ){

    $class = $class ? $class : ".modal";
    var formData = $(document).find( $class ).find("form").serializeArray();

    if ( !$turnObject )
    return formData;

    var formObject = {};
    for ( var i=0; i<formData.length; i++ )
    formObject[ formData[i]["name"] ] = formData[i]["value"];

    return formObject;

  }

}
