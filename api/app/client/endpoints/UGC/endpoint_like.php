<?php

if ( !defined( "bof_root" ) ) die;

function endpoint_like( $loader, $excuter, $args ){

  $object_name = $loader->nest->user_input( "post", "object_type", "bofClient_object", [ "has_button" => "like" ] );
  $object_hash = $loader->nest->user_input( "post", "object", "md5" );
  $yt_id = $loader->nest->user_input( "post", "yt_id", "string" );
  $yt_key = $loader->nest->user_input( "post", "yt_key", "string" );

  if ( $object_name && $object_hash ){

    $object_item = $loader->object->__get( $object_name )->select( array(
      "hash" => $object_hash
    ) );

    if ( $object_item ){

      $array = array(
        "user_id" => $loader->user->get()->ID,
        "type" => "like",
        "object_name" => $object_name,
        "object_id" => $object_item["ID"]
      );

      if ( !$loader->object->ugc_property->select( $array ) ){

        $loader->object->ugc_property->insert( $array );

        if ( $loader->object->db_setting->get("sl_gg_extra") && $loader->object->db_setting->get("sl_gg_id") && $loader->object->db_setting->get("sl_gg_secret") && $yt_id && $yt_key ){
          $userLiveData = $loader->object->user->select(["ID"=>$loader->user->get()->ID]);
          if ( !empty( $userLiveData["extraData_decoded"]["google_token"] ) ){
              $google_tokens_coded = $userLiveData["extraData_decoded"]["google_token"];
              try {
                  $google_tokens = $loader->crypto->unlock( $google_tokens_coded["sign"], $google_tokens_coded["nonce"], $yt_key );
                  $google_tokens = json_decode( $google_tokens, 1 );
                  $loader->google_api_helper->setTokens( $google_tokens )->setKey( $yt_key )->likeVideo( $yt_id );
              } catch( Exception $err ){
                  $loader->api->set_error( "yt_like_failed", [ "reason" => $err->getMessage() ] );
              }
          }

        }

      }

    }

  }

  $loader->api->set_message( "liked" );

}

?>
