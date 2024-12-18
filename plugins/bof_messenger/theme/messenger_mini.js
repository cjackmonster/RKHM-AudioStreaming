"use strict";

window.bof_messenger_mini_js = {
  cache: {
    ids: []
  },
  listen: function(){
    $(document).on("input",".modal_wrapper .modal.messenger_modal #messenger .ms_search_wrapper .bof_input", function(){
      window.bof_messenger_mini_js.loadItems( $(this).val() );
    });
    $(document).on("click",".modal_wrapper .modal.messenger_modal #messenger .groups .group", function(){

      var _id = $(this).data("hash");
      if ( $(this).hasClass("selected") ){
        window.bof_messenger_mini_js.cache.ids = jQuery.grep(window.bof_messenger_mini_js.cache.ids, function(value) {
          return value != _id;
        })
      } else {
        window.bof_messenger_mini_js.cache.ids.push( _id );
      }
      $(this).toggleClass("selected");

    });
    $(document).on("click",".modal_wrapper .modal.messenger_modal .buttons .button .btn-primary", function(){

      if ( !window.bof_messenger_mini_js.cache.ids.length )
      return;

      window.app.becli.exe( "button", {
        dom: $(this),
      }, {
        endpoint: "messenger_share",
        post: {
          ot: window.bof_messenger_mini_js.cache.ot,
          hash: window.bof_messenger_mini_js.cache.hash,
          ids: window.bof_messenger_mini_js.cache.ids.join(";")
        },
        c_callback: function( sta, data ){
          if ( sta ){
            window.bof_modal.close();
            window.app.becli.alert( true, window.lang.return( "sent", { ucfirst: true } ) );
          }
        },
        reload_after: false
      })

    });
  },
  loadItems: function( query ){

    $(document).find(".messenger_modal .groups").addClass("loading").html("Loading");

    window.becli.exe({
      ID: "messenger_group_list",
      endpoint: "messenger_group_list",
      post: {
        query: query
      },
      callBack: function( sta, data ){

        var groupsHtml = "";

        if ( sta ){

          if ( data.groups ? data.groups.length : false ){
            for ( var i=0; i<data.groups.length; i++ ){
              var group = data.groups[i];
              var selected = window.bof_messenger_mini_js.cache.ids.includes( group.hash ) ? " selected" : "";
              groupsHtml += "<div class='ms_g group"+selected+"' data-hash='"+group.hash+"'>\
                <div class='covers'>"+group.cover+"</div>\
                <div class='name'>"+group.name+"</div>\
                <div class='check_mask'></div>\
              </div>";
            }
            $(document).find(".messenger_modal .groups").removeClass("loading").addClass(sta?"ok":"failed").html( groupsHtml );
          }
          else {
            $(document).find(".messenger_modal .groups").removeClass("loading").addClass("failed").html( "<div class='nada'>Nada</div>" );
          }

        }

      }
    })

  },
  send: function( ot, hash ){

    window.bof_messenger_mini_js.cache.ids = [];
    window.bof_messenger_mini_js.cache.ot = ot;
    window.bof_messenger_mini_js.cache.hash = hash;
    window.bof_modal.create({
      title: "Send",
      class: "messenger_modal",
      content: "<div class='ms_gs_wrapper' id='messenger'>\
        <div class='ms_search_wrapper'><input class='bof_input' placeholder='Search ...'></div>\
        <div class='groups loading'>Loading</div>\
      </div>",
      buttons: [
        [ "btn-primary", "Send", "window.bof_messenger_js.group.create()"  ]
      ]
    });
    window.bof_messenger_mini_js.loadItems();

  }
}

window.bof_messenger_mini_js.listen();
