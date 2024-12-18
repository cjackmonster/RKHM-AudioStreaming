"use strict";

window.bof_api_automation_filters = {

  check: true,
  checkAll: function(e){

    if ( !window.bof_api_automation_filters.check )
    return true;

    window.bof_api_automation_filters.check = false;

    if ( $(this).find(".bof_input").attr("name").endsWith("__all__") ){
      var gName = $(this).find(".bof_input").attr("name").replace( "___all__", "" );
      var is = $(document).find(".bof_input:checked");
      for ( var z=0; z<is.length; z++ ){
        if ( is[z].name.startsWith( gName ) && !is[z].name.endsWith("__all__") )
        is[z].click()
      }
    } else {
      $(document).find(".bof_input[name="+$(this).find(".bof_input").attr("name").split('_').slice(0, -1).join('_')+"___all__]:checked").click();
    }

    window.bof_api_automation_filters.check = true;
    window.bof_api_automation_filters.loadItems();

  },
  loadItems: function(){

    if ( !window.bof_api_automation_filters.check )
    return true;

    var is = $(document).find("#setting_form .bof_input:checked").map(function() {
      return this.name.substr( "busyowl_r_auto_".length );
    }).get();

    is = is ? ( is.length ? is.join(",") : null ) : null;

    $(document).find("#setting_form #automation_results").removeClass("failed").addClass("loading").html("Loading items for your filters ....");

    window.becli.exe({
      endpoint: "bof_api_filters_load",
      post: {
        page: window.ui.page.curr().name,
        inputs: is
      },
      callBack: function( sta, data ){
        if ( !sta ){
          $(document).find("#setting_form #automation_results").removeClass("loading").addClass("failed").html( data.messages[0] );
        } else {
          $(document).find("#setting_form #automation_results").removeClass("loading").html( data.messages[0] );
        }
      }
    })

  },

  ready: function(){
    $(document).find("#setting_form").append("<div class='row cols_padding cols_padding_2x'><div class='col col-lg-6 col-12'><div id='automation_results'></div></div></div>");
    $(document).on("click", "#setting_form .select_i_wrapper .select_i", window.bof_api_automation_filters.checkAll)
    window.bof_api_automation_filters.loadItems();
  },
  unloading: function(){
    $(document).off("click", "#setting_form .select_i_wrapper .select_i", window.bof_api_automation_filters.checkAll)
  },
  displaying: function(){
  }

}
