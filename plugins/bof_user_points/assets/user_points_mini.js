"use strict";

window.bof_user_points_mini_js = {
  set: function(){
    $(document).on("click",".user_name_wrapper .badges .badge",function(){

      if ( $(this).parents(".modal.user_badges").length )
      return;

      window.bof_modal.set_loading( "initial" );

      window.becli.exe({
        endpoint: "user_points_list_badges",
        post: {
          hash: $(this).parents(".user_name_wrapper").data("user-id")
        },
        callBack: function( sta, data ){

          window.bof_modal.close();

          if ( sta ){
            var badges_html = "";
            if ( data.badges ){
              badges_html += "<div class='def_scroll'>";
              for ( var i=0; i<data.badges.length; i++ ){
                var badge = data.badges[i];
                badges_html += badge
              }
              badges_html += "</div>";
            } else {
              badges_html = "<div class='nada'>No badges found :(</div>";
            }
            window.bof_modal.create({
              title: "Badges",
              class: "user_badges",
              content: badges_html
            });
          } else {
            window.app.becli.alert( true, window.lang.return( "not_found", { ucfirst: true } ) );
          }

        }
      })


    });
  }
}

window.bof_user_points_mini_js.set();
