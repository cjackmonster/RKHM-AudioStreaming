"use strict";

window.bof_ai_translator = {

  exeOnReload: false,
  state_data: function( $val ){
    if ( $val == 1 ) return {
      title: "Queued",
      detail: "Witing for cronjob-runner to pick this job up! Then AI Translator will start the translation. You can leave the page. You can't change AI Translator's setting right now. We are not checking for state-change in background, do manual refresh",
      can_cancel: true,
      can_save: false,
      can_exe: false,
      val: 1
    };
    if ( $val == 2 ) return {
      title: "In-Progress",
      detail: "AI Translator has been executed by cronjob and it is translating! You can cancel this process. You can leave the page. You can't change AI Translator's setting right now. We are not checking for state-change in background, do manual refresh",
      can_cancel: true,
      can_save: false,
      can_exe: false,
      val: 2
    };
    if ( $val == 3 ) return {
      title: "Executing",
      detail: "Please wait while AI Translator execute this command",
      can_cancel: false,
      can_save: false,
      can_exe: false,
      val: 3
    };
    return {
      title: "Offline",
      detail: "AI Translator is not doing anything",
      can_cancel: false,
      can_save: true,
      can_exe: true,
      val: 0
    };
  },
  set: function(){

    $(document).on("click","body.page_ai_translator #cancel_button",function(e){
      window.becli.exe({
        endpoint: "ai_translator_cancel",
        post: {
          state: 3
        },
        callBack: function( sta, data ){
          if ( !sta )
          alert( "failed: " + data.messages[0] );
          window.ui.page.reload()
        }
      });
    });

    var state = window.ui.page.data.becli.setting.state;
    var state_data = window.bof_ai_translator.state_data( state );

    $("#main .content").prepend( "<div class='state state_i"+state_data.val+"'><div class='sT'>"+state_data.title+"</div><div class='sD'>"+state_data.detail+"</div><div class='btn btn-primary' id='cancel_button'>Cancel</div></div>" )

    if ( !state_data.can_save )
    $(document).find("body.page_ai_translator .settings_wrapper #save_button").remove();

    if ( !state_data.can_exe )
    $(document).find("body.page_ai_translator .settings_wrapper #exe_button").remove();

    if ( !state_data.can_cancel )
    $(document).find("body.page_ai_translator #cancel_button").remove();

    var logs = window.ui.page.data.becli.setting.logs;
    $(document).find("#setting_form .row .col:nth-child(3) .setting_group").append( "<div class='logs'>"+(logs?"":"Nothing to translate!")+"</div>" );

    if( logs ? logs.length : false ){
      for ( var i=0; i<logs.length; i++ ){
        $(document).find("#setting_form .logs").append( "<div class='log'>"+ logs[i] +"</div>" );
      }
    }

  },
  unset: function(){
    $(document).off("click","body.page_ai_translator #cancel_button");
  }

}
