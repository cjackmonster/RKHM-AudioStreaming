<?php

if ( !defined( "bof_root" ) ) die;

class social_login {

  protected function getHybridauth(){
    require_once( social_login_plugin_root . "/third/hybridauth/vendor/autoload.php" );
  }
  public function ini( $target, $id, $sercret, $args=[] ){

    $scopes = [];
    extract( $args );
    $supported_social_login = bof()->object->core_setting->get( "supported_social_logins" );
    $target_hybird_name = $supported_social_login[ $target ][ "hybirdName" ];

    $config = array(
      "callback" => endpoint_address . "login_social_ini?target={$target}",
      "providers" => array(
        $target_hybird_name => array(
          "enabled" => true,
          "keys" => array(
            "key" => $id,
            "secret" => $sercret
          ),
        )
      )
    );

    if ( $target == "google" ? bof()->object->db_setting->get("sl_gg_extra") : false ){
      $config["providers"][ $target_hybird_name ]["scope"] = "email profile https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid https://www.googleapis.com/auth/youtube.force-ssl";
      $config["providers"][ $target_hybird_name ]["access_type"] = "offline";
      $config["providers"][ $target_hybird_name ]["approval_prompt"] = "force";
    }
    if ( $target == "facebook" ){
      $config["providers"][ $target_hybird_name ]["scope"] = "email,public_profile";
    }
    if ( $target == "twitter" ){
      $config["providers"][ $target_hybird_name ]["includeEmail"] = true;
      $config["providers"][ $target_hybird_name ]["include_email"] = true;
    }
    if ( $target == "instagram" ){
      $config["providers"][ $target_hybird_name ]["scope"] = "user_profile";
    }
    if ( $target == "linkedin" ){
      //$config["providers"][ $target_hybird_name ]["scope"] = "email profile openid";
    }

    try {
      $this->getHybridauth();
      $hybridauth = new Hybridauth\Hybridauth( $config );
      $authProvider = $hybridauth->authenticate( $target_hybird_name );
      $tokens = $authProvider->getAccessToken();
      $user_profile = $authProvider->getUserProfile();
    }
    catch( Exception $e ){
      die($e->getMessage());
    }

    $lock_tokens = bof()->crypto->lock( json_encode( $tokens ) );
    $extraData = json_encode( array(
      "{$target}_token" => array(
        "sign" => $lock_tokens["sign"],
        "nonce" => $lock_tokens["nonce"]
      ),
      "image" => !empty( $user_profile->photoURL ) ? $user_profile->photoURL : null
    ) );

    $email = !empty( $user_profile->email ) ? $user_profile->email : $user_profile->identifier . "@{$target}.com";
    if ( ( $requested_user = bof()->object->user->select(["email"=>$email],array(
      "_eq" => array(
        "roles" => array(
          "website" => null
        )
      ),
      "no_bof_time" => true
    ) ) ) ){

      if ( !empty( $tokens["refresh_token"] ) ){
        bof()->object->user->update(
          array(
            "ID" => $requested_user["ID"]
          ),
          array(
            "extraData" => $extraData
          )
        );
      }

      $social_login_enabled = bof()->object->user_setting->get( $requested_user["ID"], "social_login", 1 );
      if ( !$social_login_enabled )
      die( bof()->object->language->turn( "social_login_disabled", [], [ "lang" => "users", "uc_first" => true ]  ) );

    }
    else {

      $name = $user_profile->displayName;
      $username = bof()->object->user->make_username( $name );
      $userID = bof()->object->user->create(
        array(
          "email" => $email
        ),
        array(
          "email" => $email,
          "username" => $username,
          "password" => uniqid() . uniqid(),
          "name" => $name,
          "time_verify" => bof()->general->mysql_timestamp(),
          "extraData" => $extraData,
          "initial" => true
        )
      );

      $requested_user = bof()->object->user->select(["ID"=>$userID],array(
        "_eq" => array(
          "roles" => array(
            "website" => null
          )
        ),
        "no_bof_time" => true
      ));

    }

    $sess_data = bof()->user_auth->create( $requested_user["ID"], false );

    $sess_data_simplified = array(
      "sess_id" => $sess_data["id"],
      "sess_key" => $sess_data["key"],
      "{$target}_key" => $lock_tokens["key"]
    );

    echo "<script>
    window.opener.app.pages.user_auth.social_loginner_promise.resolve('".json_encode( $sess_data_simplified )."');
    </script>";

  }

}

?>
