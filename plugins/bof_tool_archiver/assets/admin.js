"use strict";

window.bof_archiver = {

  exeOnReload: false,
  state_data: function( $val ){
    if ( $val == 1 ) return {
      title: "Queued",
      detail: "Witing for cronjob-runner to pick this job up! Then Archiver will create the backup for you. Might take up to 5 minutes. You can leave the page. You can't change Archiver's setting right now. We are not checking for state-change in background, do manual refresh",
      can_cancel: false,
      can_save: false,
      can_exe: false,
      val: 1
    };
    if ( $val == 2 ) return {
      title: "In-Progress",
      detail: "Archiver has been executed by cronjob and it is making a back-up for you! You can't cancel this process. You can leave the page. You can't change Archiver's setting right now",
      can_cancel: false,
      can_save: false,
      can_exe: false,
      val: 2
    };
    if ( $val == 3 ) return {
      title: "Executing",
      detail: "Please wait while Archiver execute this command",
      can_cancel: false,
      can_save: false,
      can_exe: false,
      val: 3
    };
    return {
      title: "Offline",
      detail: "Archiver is not doing anything",
      can_cancel: false,
      can_save: true,
      can_exe: true,
      val: 0
    };
  },
  set: function(){
    $(document).find(".settings_wrapper #save_button.t2").text("Save Setting").after('<div class="btn btn-primary t2" id="exe_button">Make a Backup</div>');
    $(document).on("click",".settings_wrapper .setting_group .setting_wrapper .detail #mysqldump_test",function(e){

      window.bof_modal.create({
        class: "no_groups",
        title: "Testing mysqldump version",
        content: "<div id='mysqldump_test_result'><p>Starting the test ....</p></div>"
      });

      window.becli.exe({
        endpoint: "archiver_mysqldump_path_test",
        post: {
          path: $(document).find("input[name='arch_db_path']").val(),
          job: "get_version"
        },
        callBack: function( sta, data ){
          for ( var i=0; i<data.messages.length; i++ ){
            $(document).find("#mysqldump_test_result").append("<p>"+data.messages[i]+"</p>");
          }
        }
      })

    });
    $(document).on("click","body.page_archiver .settings_wrapper #exe_button",function(e){
      window.bof_archiver.exeOnReload = true;
      $(document).find("body.page_archiver .settings_wrapper #exe_button").text("Wait, Saving first .....");
      $(document).find("body.page_archiver .settings_wrapper #save_button").click();
    });
    $(document).on("click","body.page_archiver #cancel_button",function(e){
      window.becli.exe({
        endpoint: "archiver_cancel",
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
    var state_data = window.bof_archiver.state_data( state );

    if ( window.bof_archiver.exeOnReload === true && state_data.can_exe === true ){

      state = 3;
      state_data = window.bof_archiver.state_data( state );
      window.bof_archiver.exeOnReload = false;

      window.becli.exe({
        endpoint: "archiver_execute",
        post: {
          state: 3
        },
        callBack: function( sta, data ){
          if ( !sta )
          alert( "failed: " + data.messages[0] );
          window.ui.page.reload()
        }
      });

    }

    $("#main .content").prepend( "<div class='state state_i"+state_data.val+"'><div class='sT'>"+state_data.title+"</div><div class='sD'>"+state_data.detail+"</div><div class='btn btn-primary' id='cancel_button'>Cancel</div></div>" )

    if ( !state_data.can_save )
    $(document).find("body.page_archiver .settings_wrapper #save_button").remove();

    if ( !state_data.can_exe )
    $(document).find("body.page_archiver .settings_wrapper #exe_button").remove();

    if ( !state_data.can_cancel )
    $(document).find("body.page_archiver #cancel_button").remove();

  },
  unset: function(){
    $(document).off("click",".settings_wrapper .setting_group .setting_wrapper .detail #mysqldump_test");
    $(document).off("click","body.page_archiver .settings_wrapper #exe_button");
    $(document).off("click","body.page_archiver #cancel_button");
  }

}
