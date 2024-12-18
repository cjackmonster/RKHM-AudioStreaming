"use strict";

window.bof_messenger_js = {

  cache: {},
  displaying: function(){

  },
  ready: function( $args, $args2 ){

    window.bof_messenger_js.cache = {
      group_hash: null,
      groups_page: 1,
      messages_page: null
    }

    window.ui.page.add_data( "groups", [] );
    window.ui.page.add_data( "messages", [] );

    window.pageBuilder.widget.item.getExtenders.messenger = function( $id ){

      if ( $id.substr( 0, "messenger_group_".length ) == "messenger_group_" ){
        var groups = window.ui.page.get_data( "groups" );
        var group_id = $id.substr( "messenger_group_".length );
        for ( var i=0; i<groups.length; i++ ){
          var group = groups[i];
          if ( group.hash == group_id )
          return group;
        }
      }

    };

    $(document).on( "click", "#messenger .groups .group", function(e){

      var hash = $(this).data("hash");

      window.bof_messenger_js.cache.messages_page = 1;
      window.bof_messenger_js.cache.group_hash = hash;

      $(document).find("#messenger").addClass("groupOpened");
      $(document).find("#messenger .groups .group.active").removeClass("active");

      if ( window.app.config.mobile )
      window.ui.history.add( 'messenger' );

      $(this).addClass("active");
      window.bof_messenger_js.group.loadMessages( hash, true );

    } );
    $(document).on( "click", "#messenger .groups .load_more", function(e){

      if ( window.bof_messenger_js.cache.groups_page === null )
      return;

      if ( $(this).hasClass("loading") )
      return;

      window.bof_messenger_js.group.load();

    } );
    $(document).on( "click", "#messenger .messages .load_more", function(e){

      if ( window.bof_messenger_js.cache.messages_page === null )
      return;

      if ( $(this).hasClass("loading") )
      return;

      window.bof_messenger_js.group.loadMessages();

    } );
    $(document).on( "click", "#messenger .messages .group .group_data", function(e){
      var ID = $(this).attr("id").substr( 4 );
      window.pageBuilder.widget.item.openMenu( ID, e.clientX, e.clientY );
    } );
    $(document).on( "click", ".group_member_list_handle", function(e){

      var hash = $(this).data("group-hash");
      window.bof_messenger_js.group.loadMembers( hash );

    } );
    $(document).on( "click", ".remove_member_user_handle", function(e){

      if ( $(this).hasClass("loading") )
      return;

      var user_hash = $(this).parents("._user").data("hash");
      var group_hash = $(this).parents("._user").data("group");
      var button = $(this);

      button.removeClass("failure").addClass("loading");

      window.becli.exe({
        ID: "messenger_group_members_remove",
        endpoint: "messenger_group_members_remove",
        post: {
          user_hash: user_hash,
          group_hash: group_hash
        },
        callBack:function( sta, data ){
          if ( sta ){
            window.app.becli.alert( true, data.messages[0] );
            $(document).find(".modal.user_list .content ._user.hash_"+user_hash).remove();
          }
          else {
            button.removeClass("loading").addClass("failure");
          }
        }
      });

    } );
    $(document).on( "click", ".group_remove_handle", function(e){

      if ( $(this).hasClass("loading") )
      return;

      var button = $(this);

      if ( !$(this).hasClass("confirm") ){
        $(this).addClass("confirm").find("._t").text("Confirm");
        return;
      }

      var group_hash = $(this).data("group-hash");

      button.removeClass("failure").addClass("loading");

      window.becli.exe({
        ID: "messenger_group_members_remove",
        endpoint: "messenger_group_members_remove",
        post: {
          user_hash: window.app.config.user.data.hash,
          group_hash: group_hash
        },
        callBack:function( sta, data ){
          if ( sta ){
            window.app.becli.alert( true, data.messages[0] );
            $(document).find("#messenger .groups .group.hash_"+group_hash).remove();
            window.pageBuilder.widget.item.closeMenu();
          }
          else {
            button.removeClass("loading").addClass("failure");
          }
        }
      });

    } );
    $(document).on( "click", ".group_setting_handle", function(e){

      var hash = $(this).data("group-hash");
      window.bof_messenger_js.group.loadSetting( hash );

    } );
    $(document).on( "click", "#messenger .messages .group .group_new_message .btn", function(e){
      window.bof_messenger_js.group.addMessage();
    } );

    $(document).on( "click", "#messenger .new_wrapper .mdi", function(e){
      window.bof_messenger_js.group.createForm();
    } );
    $(document).on( "click", "#messenger .empty .btn-primary", function(e){
      window.bof_messenger_js.group.createForm();
    } );

    window.bof_messenger_js.group.load(
      window.ui.page.curr().args.urlData.url ? ( window.ui.page.curr().args.urlData.url.query ? window.ui.page.curr().args.urlData.url.query.group : false ) : false
    );

  },
  unloading: function(){

    $(document).off( "click", "#messenger .groups .group" );
    $(document).off( "click", "#messenger .groups .load_more" );
    $(document).off( "click", "#messenger .messages .load_more" );
    $(document).off( "click", "#messenger .messages .group .group_data" );
    $(document).off( "click", ".group_member_list_handle" );
    $(document).off( "click", ".remove_member_user_handle" );
    $(document).off( "click", ".group_remove_handle" );
    $(document).off( "click", ".group_setting_handle" );
    $(document).off( "click", "#messenger .new_wrapper .mdi" );
    $(document).off( "click", "#messenger .empty .btn-primary" );
    $(document).off( "click", "#messenger .messages .group .group_new_message .btn" );

    if ( window.bof_messenger_js.checkMessagesTimer ){
      clearTimeout( window.bof_messenger_js.checkMessagesTimer );
    }

    delete window.pageBuilder.widget.item.getExtenders.messenger;

  },

  group: {

    createForm: function( direct ){

      window.bof_modal.create({
        title: "New chat",
        class: "user_list",
        inputs: {
          "users": {
            "label": "Users",
            "tip": "Select 1 or multiple users and continue",
            "input": {
              "name": "users",
              "type": "bof_object",
              "value": "",
              "bof_object": "user",
              "bof_s_type": "multi",
            }
          }
        },
        buttons: [
          [ "btn-primary", "Continue", "window.bof_messenger_js.group.create()"  ]
        ]
      });

    },
    create: function(){

      var selectedUsers = window.bof_modal.get(true)["users"];
      window.becli.exe({
        ID: "messenger_group_new",
        endpoint: "messenger_group_new",
        post: {
          users: selectedUsers
        },
        callBack: function( sta, data, args ){
          if ( sta ){
            window.bof_modal.close();
            window.ui.link.navigate( "messenger?group=" + data.group_id );
          }
        }
      })

    },
    load: function( $requestedGroup ){

      $(document).find("#messenger .groups .load_more").addClass("loading");

      window.becli.exe({
        ID: "messenger",
        endpoint: "messenger" + ( window.ui.page.curr().o_args.urlData.url.query_s ? "?" + window.ui.page.curr().o_args.urlData.url.query_s : "" ),
        post: {
          page: window.bof_messenger_js.cache.groups_page,
          hash: $requestedGroup,
        },
        callBack: function( sta, data, $args ){

          var _groups = window.ui.page.get_data( "groups" );
          if ( sta ){

            if ( data["groups"] ){
              for ( var i=0; i<data["groups"].length; i++ ){
                _groups.push( data["groups"][i] );
              }
            }

            window.ui.page.add_data( "groups", _groups );

            if ( _groups.length ){

              window.ui.theme.load( $_bof_config.web_address.replace( "admin/", "" ) + "plugins/bof_messenger/theme/messenger_groups", { use_base: false } ).done(function( theme ){
                window.render.mix( theme, { content: data["groups"] } ).done(function(html){

                  $(document).find("#messenger .groups .load_more").remove();

                  $(document).find("#messenger .groups").append( html );

                  $(document).find("#messenger .groups .group").each(function(e,i){
                    var covers = $(i).find(".covers .user_avatar");
                    covers.each(function(ee,ii){
                      if ( $(ii).hasClass("user_"+window.app.config.user.data.hash ) )
                      $(ii).addClass("users");
                    });
                  });

                  window.bof_messenger_js.cache.groups_page = data.has_more ? window.bof_messenger_js.cache.groups_page + 1 : null;

                  if ( data.has_more ){
                    $(document).find("#messenger .groups").append( "<div class='load_more btn btn-secondary'>Load more</div>" );
                  }

                  setTimeout( function(){

                    if ( $(document).find("#messenger .groups .group").length && !$(document).find("#messenger .groups .group.active").length && !window.app.config.mobile ){

                      if ( !$args.args.post.hash && !data.reqed ){
                        $(document).find("#messenger .groups .group:first-child").click();
                      }
                      else if ( data.reqed )
                      $(document).find("#messenger .groups .group.hash_"+data.reqed).click();
                      else
                      $(document).find("#messenger .groups .group.hash_"+$args.args.post.hash).click();

                    }

                  },100);

                });
              });

            }
            else {
              $(document).find("#messenger").addClass("empty");
              $(document).find("#messenger .groups .load_more").remove();
            }

          }

        }
      });

    },
    checkMessages: function(){

      if ( window.bof_messenger_js.checkMessagesTimer )
      clearTimeout( window.bof_messenger_js.checkMessagesTimer );

      if ( !window.bof_messenger_js.cache.last_message ? true : !window.bof_messenger_js.cache.last_message.hash )
      return;

      window.becli.exe({
        endpoint: "messenger_group_messages",
        post: {
          hash: window.bof_messenger_js.cache.group_hash,
          last_hash: window.bof_messenger_js.cache.last_message.hash,
          last_time: window.bof_messenger_js.cache.last_message.time_add,
          check: true
        },
        callBefore: function(){},
        callBack: function( sta, data ){

          if ( sta ){
            if ( data.new_messages ){
              window.bof_messenger_js.group.loadMessages();
              window.bof_messenger_js.cache.messages_page = 1;
            }
          }

          window.bof_messenger_js.checkMessagesTimer = setTimeout( function(){
            window.bof_messenger_js.group.checkMessages();
          }, 10*1000 );

        }
      });

    },
    loadMessages: function( hash ){

      if ( !hash && window.bof_messenger_js.cache.group_hash )
      hash = window.bof_messenger_js.cache.group_hash;

      if ( hash != window.bof_messenger_js.cache.group_hash ){
        window.bof_messenger_js.cache.messages_page = 1;
        window.ui.page.add_data( "groups", [] );
      }

      if ( window.bof_messenger_js.cache.messages_page == 1 && window.ui.page.curr().args.urlData.url.full !== 'messenger?group=' + hash )
      window.ui.history.add( 'messenger?group=' + hash );

      var scrollHeight = 0;

      if ( $(document).find("#messenger .messages .group .group_messages").length ){
        scrollHeight = $(document).find("#messenger .messages .group .group_messages").prop("scrollHeight")
      }

      window.becli.exe({
        ID: "messenger_group_messages",
        endpoint: "messenger_group_messages",
        post: {
          hash: hash,
          page: window.bof_messenger_js.cache.messages_page
        },
        callBefore: function(){

          $(document).find("#messenger .messages").addClass("loading");

        },
        callBack: function( sta, data ){

          if ( sta ){

            var _messages = window.ui.page.get_data( "messages" );
            if ( sta ){
              if ( data["messages"] ){
                for ( var i=0; i<data["messages"].length; i++ ){
                  _messages.push( data["messages"][i] );
                }
              }
            }
            window.ui.page.add_data( "messages", _messages );

            window.bof_messenger_js.cache.group_hash = hash;
            var promiseRendering = $.Deferred();

            if ( window.bof_messenger_js.cache.messages_page == 1 ){

              if ( data.group_messages ? data.group_messages.length : false ){
                window.bof_messenger_js.cache.last_message = data.group_messages[0];
                if ( data.group_messages.length ? data.group_messages[0].hash : false )
                data.group_messages = data.group_messages.reverse();
              }

              window.ui.theme.load( $_bof_config.web_address.replace( "admin/", "" ) + "plugins/bof_messenger/theme/messenger_group", { use_base: false } ).done(function( theme ){
                window.render.mix( theme, { content: data } ).done(function(html){

                  $(document).find("#messenger .messages").html( html );
                  $(document).find("#messenger .messages .group_messages").scrollTop( $(document).find("#messenger .messages .group_messages").prop("scrollHeight") )
                  promiseRendering.resolve();

                });
              });

            }
            else {

              window.ui.theme.load( $_bof_config.web_address.replace( "admin/", "" ) + "plugins/bof_messenger/theme/messenger_message", { use_base: false } ).done(function( theme ){

                for( var i=0; i<data.group_messages.length; i++ ){
                  window.bof_messenger_js.cache.last_message = data.group_messages[0];
                  window.render.mix( theme, data.group_messages[i] ).done(function(html){

                    $(document).find("#messenger .messages .group_messages").prepend( html );

                    if ( i == data.group_messages.length-1 ){
                      promiseRendering.resolve();

                      var newTop = $(document).find("#messenger .messages .group .group_messages").prop("scrollHeight") - ( scrollHeight + $(document).find("#messenger .messages .group .group_messages").height()  );
                      $(document).find("#messenger .messages .group_messages").scrollTop( newTop + 140 )

                    }

                  });
                }

              });

            }

            window.bof_messenger_js.group.checkMessages();

            promiseRendering.done(function(){

              $(document).find("#messenger .messages .load_more").remove();

              $(document).find("#messenger .messages .message_wrapper").each(function(e,i){
                if ( $(i).hasClass("user_"+window.app.config.user.data.hash) )
                $(i).addClass("users");
              });

              window.bof_messenger_js.cache.messages_page = data.has_more ? window.bof_messenger_js.cache.messages_page + 1 : null;

              if ( data.has_more ){
                $(document).find("#messenger .messages .group_messages").prepend( "<div class='load_more btn btn-secondary'>Load more</div>" );
              }

              $(document).find("#messenger .messages").removeClass("loading");

            });

          }

        }
      });

    },
    addMessage: function(){

      window.app.becli.exe( "button", {
        dom: $(document).find("#messenger .messages .group .group_new_message .btn"),
      }, {
        endpoint: "messenger_group_message_new",
        post: {
          text: $(document).find("#messenger .messages .group .group_new_message .bof_input").val(),
          group: window.bof_messenger_js.cache.group_hash
        },
        c_callback: function( sta, data ){
          if ( sta ){
            window.bof_messenger_js.cache.messages_page = 1;
            window.bof_messenger_js.group.loadMessages();
            $(document).find("#messenger .messages .group .group_new_message .bof_input").val(" ");
          }
        },
        reload_after: false
      })

    },
    loadMembers: function( hash ){

      window.bof_modal.set_loading( "initial" );

        window.becli.exe({
          ID: "messenger_group_members_list",
          endpoint: "messenger_group_members_list",
          post: {
            hash: hash
          },
          callBack: function( sta, data, args ){
            if ( !sta ){
              window.bof_modal.close();
              window.app.becli.alert( true, "Not found" );
            }
            else {

              var users = data.group.bof_rel_users;
              window.bof_modal.close();

              window.app.ui.modal.user_list( users, {
                title: "Member list",
                tip: "Members of <b>"+data.group.name+"</b>"
              } );

            }
          }
        });

    },
    loadSetting: function( hash ){

      window.bof_modal.set_loading( "initial" );

        window.becli.exe({
          ID: "messenger_group_setting_load",
          endpoint: "messenger_group_setting_load",
          post: {
            hash: hash
          },
          callBack: function( sta, data, args ){
            if ( !sta ){
              window.bof_modal.close();
              window.app.becli.alert( true, "Not found" );
            }
            else {

              var group = data.group;

              window.bof_modal.close();
              window.bof_modal.create({
                title: "Group setting",
                tip: "Editing " + group.name,
                inputs: data.inputs,
                buttons: [
                  [ "btn-primary the_loading_button", "Confirm", "window.bof_messenger_js.group.saveSetting(\""+hash+"\")"  ]
                ]
              });

            }
          }
        });

    },
    saveSetting: function( hash ){

      var modalData = window.bof_modal.get( true );

      if ( !modalData.name ){
        window.bof_modal.set_error( "Enter a name" );
        return;
      }

      modalData.hash = hash;

      window.bof_modal.set_loading( "button" );

      window.becli.exe({
        ID: "messenger_group_setting_save",
        endpoint: "messenger_group_setting_save",
        post: modalData,
        callBack: function( sta, data, args ){

          if ( sta ){
            window.bof_modal.close();
            window.app.becli.alert( true, "Saved" );
          }
          else {
            window.bof_modal.finish_loading( "button" );
            window.bof_modal.set_error( data.messages[0] );
          }

        }
      });

    },
    edit: function( playlist_id ){

      var modalData = window.bof_modal.get( true );

      if ( !modalData.name ){
        window.bof_modal.set_error( "Enter a name" );
        return;
      }

      modalData.id = playlist_id;
      modalData.private = modalData.private === "1" ? 1 : 0;

      window.bof_modal.set_loading( "button" );

      window.becli.exe({
        endpoint: "playlist_edit",
        post: modalData,
        callBack: function( sta, data, args ){

          if ( sta ){
            window.bof_modal.close();
            window.app.becli.alert( true, "Edited" );
            window.app.getConfig(true);
          }
          else {
            window.bof_modal.finish_loading( "button" );
            window.bof_modal.set_error( data.messages[0] );
          }

        }
      });

    },

  }

}
