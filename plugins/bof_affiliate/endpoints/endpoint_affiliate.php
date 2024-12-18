<?php

if ( !defined( "bof_root" ) ) die;

function endpoint_affiliate( $loader, $excuter, $args ){

  $userData = $loader->object->user->select(["ID"=>$loader->user->get()->ID]);

  if ( $userData["s_affiliate"] ){

    $loader->api->set_message( "ok", array(
      "sta" => "ok",
      "html" => "<div class='form_text success'><div class='title'>".bof()->object->language->turn( "af_ok", [], [ "uc_first" => true, "lang" => "users" ] )."</div><div class='text'>" .
      bof()->object->language->turn( "af_ok_text1", array(
        "user_hash" => $userData["hash"],
        "web_address" => web_address,
        "icon" => "<span class='mdi mdi-open-in-new'></span>"
      ), [ "uc_first" => true, "lang" => "users" ] ) . "<br><br>" . bof()->object->language->turn( "af_ok_text2", array(
        "user_hash" => $userData["hash"],
        "web_address" => web_address,
        "icon" => "<span class='mdi mdi-open-in-new'></span>"
      ), [ "uc_first" => true, "lang" => "users" ] ) . "<br><br>" . bof()->object->language->turn( "af_ok_text3", array(
        "user_hash" => $userData["hash"],
        "web_address" => web_address,
        "icon" => "<span class='mdi mdi-open-in-new'></span>"
      ), [ "uc_first" => true, "lang" => "users" ] ) . "</div></div>",
    ) );
    return;

  }
  else {

    $requested = $loader->object->user_request->select(
      array(
        "type" => "affiliate",
        "user_id" => $loader->user->get()->ID
      )
    );

    if ( $requested ){

      if ( $requested["sta"] != 0 ){

        $loader->api->set_message( "ok", array(
          "sta" => "rejected",
          "html" => "<div class='form_text error'><div class='title'>".bof()->object->language->turn( "af_no", [], [ "uc_first" => true, "lang" => "users" ] )."</div>
          <div class='text'>".bof()->object->language->turn( "af_no_text", [], [ "uc_first" => true, "lang" => "users" ] )."</div></div>"
        ) );
        return;

      }
      else {

        $loader->api->set_message( "ok", array(
          "sta" => "pending",
          "html" => "<div class='form_text warning'><div class='title'>".bof()->object->language->turn( "af_pe", [], [ "uc_first" => true, "lang" => "users" ] )."</div>
          <div class='text'>".bof()->object->language->turn( "af_pe_text", [], [ "uc_first" => true, "lang" => "users" ] )."</div></div>"
        ) );
        return;

      }

    }
    else {

      $bofForm = array(
        "becli" => array(
          "endpoint" => "affiliate?action=submit"
        ),
        "inputs" => array(
          "real_name" => array(
            "required" => true,
            "hook" => "af_real_name",
            "input" => array(
              "type" => "text"
            ),
            "validator" => array(
              "string",
              array(
                "strip_emoji" => false,
              ),
            ),
          ),
          "reach" => array(
            "required" => true,
            "hook" => "af_reach",
            "tip_hook" => "af_reach_tip",
            "input" => array(
              "type" => "digit"
            ),
            "validator" => array(
              "int",
            ),
          ),
          "ad" => array(
            "required" => true,
            "hook" => "af_add_data",
            "input" => array(
              "type" => "textarea"
            ),
            "validator" => array(
              "string",
              array(
                "strip_emoji" => false,
              ),
            ),
          ),
        ),
      );
      if ( $loader->nest->user_input( "get", "action", "equal", [ "value" => "submit" ] ) ){

        try {
          $validate = $loader->bofForm->validate( $bofForm, true );
        } catch( Exception $err ){
          $loader->api->set_error( bof()->object->language->turn( "failed", [], [ "uc_first" => true, "lang" => "users" ] ) . ": " . $err->getMessage(), [ "output_args" => [ "turn" => false ] ] );
          return;
        }

        $urid = $loader->object->user_request->insert(array(
          "type" => "affiliate",
          "user_id" => $loader->user->get()->ID,
          "real_name" => $validate["real_name"],
          "extra_data" => json_encode( array(
            "reach" => array(
              "type" => "int",
              "data" => $validate["reach"]
            ),
          ) ),
          "additional_data" => $validate["ad"],
        ));

        if ( !empty( bof()->user->get()->extra["roles"]["verify_a_aa"] ) ){
          bof()->object->user_request->_approve( $urid );
        }

        $loader->api->set_message( "request_submited" );

      }
      else {

        try {
          $inputs_parsed = $loader->bofForm->parse( $bofForm );
        } catch( Exception $err ){
          $loader->api->set_error( bof()->object->language->turn( "failed", [], [ "uc_first" => true, "lang" => "users" ] ) . ": " . $err->getMessage(), [ "output_args" => [ "turn" => false ] ] );
          return;
        }

        $loader->api->set_message( "ok", array(
          "bofForm" => $inputs_parsed,
        ) );

      }

    }

  }


}

?>
