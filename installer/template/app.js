"use strict"

window.installer = {
  urlAppend: function(){
    return "&" + Math.random().toString(16).slice(2) + "=" + Math.random().toString(16).slice(2);
  },
  ini: function(){

    window.installer.step = $(document).find("body").data("step");
    $(document).find(".side .steps .step"+window.installer.step).addClass("active");

    var step = window.installer.step;
    if ( step == 2 ){
      if ( $(document).find("#main #step .extensions").data("all-ok") != "ok" ){
        $(document).find("#main #step .button_wrapper").addClass("failed")
      }
    }
    else if ( step == 5 ){
      if ( $(document).find("#main #step .checks .check.sta_failed").length > 0 ){
        $(document).find("#main #step .button_wrapper").addClass("nok").find(".btn .text").text("Check again")
      }
    }
    else if ( step == 7 ){
      $(document).find("#main #step .button_wrapper").addClass("failed")
    }

    $(document).find("#main #step .button_wrapper").removeClass("loading");

    $(document).on( "click", "#main #step .button_wrapper .btn", function(e){

      var step = window.installer.step;
      if( $(document).find("#main #step .button_wrapper").hasClass("loading") || $(document).find("#main #step .button_wrapper").hasClass("failed") )
      return;

      $(document).find("#main #step .button_wrapper").addClass("loading");
      $(document).find("#main #step .message_holder").removeClass("ok nok").html("");
      $(document).find("#main #step .button_wrapper .btn").removeClass("retry").find(".text").html("Continue");

      if ( step == 1 ){
        window.location.href = window.location.href + "?agree_with_terms=ok"
      }
      else if ( step == 2 ){
        window.location.href = window.location.href + "&confirmed_extensions=ok"
      }
      else if ( step == 3 ){

        if ( $(document).find("input[name=domain]").length ){

          window.installer.ajax( "submit_purchase_code", {
            post: $(document).find("form").serialize()
          })
          .done(function(data){
            setTimeout( function(){
              window.location.href = window.location.href + ( window.location.href.includes("?") ? "&" : "?" ) + "purchase_code_validated=ok" + window.installer.urlAppend()
            }, 1000 );
          })
          .fail(function(data){
            $(document).find("#main #step .message_holder").removeClass("ok nok").addClass("nok").html(data.messages[0]);
            $(document).find("#main #step .button_wrapper").removeClass("loading");
            $(document).find("#main #step .button_wrapper .btn").addClass("retry").find(".text").html("Retry");
          })

        }
        else {

          window.installer.ajax( "check_purchase_code", {
            post: {
              code: $(document).find("#main #step form .input_wrapper .bof_input").val()
            }
          })
          .done(function(data){

            var licenseHTML = '<div class="input_wrapper">\
              <label>Purchase code</label>\
              <input name="code" type="text" class="bof_input" value="'+data.license.code+'" readonly>\
              <tip>'+(
                data.license.type=="used"?
                "This purchase code <b>has been used</b>. Visit <a href='https://support.busyowl.co/' target='_blank'>Busyowl's support panel</a> to assign new ip-address or domain-name" :
                (
                  data.license.type=="renew"?
                  "This purchase code has been used & reset. You can use it to install the script anywhere you like":
                  "This purchase code has not been used before. You can use it to install the script anywhere you like"
                )
              )+'</tip>\
            </div>\
            <div class="input_wrapper">\
              <label>Web Address</label>\
              <input name="domain" type="text" class="bof_input" value="'+(data.server_name)+'" >\
              <tip>Enter your website\'s full address'+(data.license.type=="used"?". This license is issued for "+( "<b>"+data.license.domain+"</b>" ):"")+'<br><i>Example: https://subdomain.busyowl.co/subfolder/</i></tip>\
            </div>\
            <div class="input_wrapper">\
              <label>IP Address</label>\
              <input name="ip" type="text" class="bof_input" value="'+(data.server_ip)+'" readonly>\
              <tip>This server\'s public ipv4 address'+(data.license.type=="used"?". This license is issued for "+( "<b>"+data.license.ip+"</b>" ):"")+'</tip>\
            </div>\
            <div class="input_wrapper">\
              <label>Owner Email</label>\
              <input name="email" type="text" class="bof_input" value="'+(data.license.type=="new"?"":data.license.owner)+'" placeholder="you@gmail.com" '+(data.license.type=="new"?"":"readonly")+' >\
              <tip>Enter your email address'+(data.license.type=="new"?"":". This license is issued for "+( "<b>"+data.license.owner+"</b>" ))+'</tip>\
            </div>';

            $(document).find("#main #step form").html( licenseHTML );
            $(document).find("#main #step .button_wrapper").removeClass("loading");

          })
          .fail(function(data){
            $(document).find("#main #step .message_holder").removeClass("ok nok").addClass("nok").html(data.messages[0]);
            $(document).find("#main #step .button_wrapper").removeClass("loading");
            $(document).find("#main #step .button_wrapper .btn").addClass("retry").find(".text").html("Retry");
          })

        }

      }
      else if ( step == 4 ){

        if ( $(document).find("input[name=a_pass]").val() !== $(document).find("input[name=a_pass2]").val() ){
          $(document).find("#main #step .message_holder").removeClass("ok nok").addClass("nok").html("Passwords don't match");
          $(document).find("#main #step .button_wrapper").removeClass("loading");
          $(document).find("#main #step .button_wrapper .btn").addClass("retry").find(".text").html("Retry");
          return;
        }

        window.installer.ajax( "submit_db_cred", {
          post: $(document).find("form").serialize()
        })
        .done(function(data){
          window.location.href = window.location.href + ( window.location.href.includes("?") ? "&" : "?" ) + "database_imported=ok" + window.installer.urlAppend()
        })
        .fail(function(data){
          $(document).find("#main #step .message_holder").removeClass("ok nok").addClass("nok").html(data.messages[0]);
          $(document).find("#main #step .button_wrapper").removeClass("loading");
          $(document).find("#main #step .button_wrapper .btn").addClass("retry").find(".text").html("Retry");
        })

      }
      else if ( step == 5 ){

        if ( $(document).find("#main #step .checks .check.sta_failed").length > 0 ){
          window.location.href = window.location.href + ( window.location.href.includes("?") ? "&" : "?" ) + "server_status=meh" + window.installer.urlAppend()
        }
        else {
          window.installer.ajax( "server_check", {
            post: {
              timezone: $(document).find("#main #step .checks .check .c_description select option:selected").val()
            }
          })
          .done(function(data){
            window.location.href = window.location.href + ( window.location.href.includes("?") ? "&" : "?" ) + "server=ok" + window.installer.urlAppend()
          })
          .fail(function(data){
            $(document).find("#main #step .message_holder").removeClass("ok nok").addClass("nok").html(data.messages[0]);
            $(document).find("#main #step .button_wrapper").removeClass("loading");
            $(document).find("#main #step .button_wrapper .btn").addClass("retry").find(".text").html("Retry");
          })
        }

      }
      else if ( step == 6 ){
        window.installer.ajax( "set_diagnostics", {
          post: {
            level: $(document).find("input[name=type]:checked").val()
          }
        })
        .done(function(data){
          setTimeout( function(){
            window.location.href = window.location.href + ( window.location.href.includes("?") ? "&" : "?" ) + "all_done=yes" + window.installer.urlAppend()
          }, 1000 );
        })
        .fail(function(data){
          $(document).find("#main #step .message_holder").removeClass("ok nok").addClass("nok").html(data.messages[0]);
          $(document).find("#main #step .button_wrapper").removeClass("loading");
          $(document).find("#main #step .button_wrapper .btn").addClass("retry").find(".text").html("Retry");
        })
      }

    } )

  },
  ajax: function( $endpoint, $args ){

    var promise = $.Deferred();

		$.ajax( {
			url: window.location.href + ( window.location.href.includes("?") ? "&" : "?" ) + "endpoint=" + $endpoint ,
			type: "POST",
			data: $args.post,
			timeout: 60000*10,
      dataType: "json",
      success: function( data, sta, response ){
        if ( response.status == 201 )
        promise.resolve( data );
        else
        promise.reject( data );
      },
      error: function( a1, a2, a3 ){
        promise.reject({
          message: "XHR Error: " + a2
        });
      }
		} );

    return promise;

	},
}

$(document).ready(function(){
  window.installer.ini();
})
