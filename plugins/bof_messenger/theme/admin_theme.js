"use strict";

window.bof_messenger_admin_js = {

  set: function(){

    $(document).on("click","body.page_messenger #_mf #_mgs .content_table_wrapper table tbody tr",function(e){

      if( $(this).hasClass("active") )
      return;

      $(document).find("body.page_messenger #_mf #_mgs .content_table_wrapper table tbody tr.active").removeClass("active");
      $(this).addClass("active");
      window.ui.lock.on("ms_message");
      window.ui.body.addClass("loading");

      var gID = $(this).data("id");
      window.becli.exe({
        ID: "_mms",
        endpoint: "bofAdmin/list/ms_message/?col_group=" + gID,
        callBack: function( sta, data ){
          window.ui.theme.load( $_bof_config.web_address.replace( "admin/", "" ) + "plugins/bof_messenger/theme/admin_message", { use_base: false } ).done(function( theme ){
            window.render.mix( theme, { content: data } ).done(function(html){
              $(document).find("#_mms .messages_wrapper").html( html );
              window.ui.lock.off("ms_message");
              window.ui.body.removeClass("loading");

            });
          });
        }
      });

    });

    $(document).find("body.page_messenger #_mf #_mgs .content_table_wrapper table tbody tr:first-child").click();

  },

  unset: function(){

    $(document).off("click","body.page_messenger #_mf #_mgs .content_table_wrapper table tbody tr");
    window.ui.lock.off("ms_message");

  }

}
