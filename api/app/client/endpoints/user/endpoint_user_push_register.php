<?php

if ( !defined( "bof_root" ) ) die;

function endpoint_user_push_register( $loader, $excuter, $args ){

  $push_subscription = $loader->nest->user_input( "post", "push_subscription", "json" );
  if ( $push_subscription ?
    !empty( $push_subscription["endpoint"] ) &&
    !empty( $push_subscription["keys"]["p256dh"] ) &&
    !empty( $push_subscription["keys"]["auth"] )
  : false ){

    $endpoint = $loader->nest->validate( $push_subscription["endpoint"], "url" );
    $pub_key  = $loader->nest->validate( $push_subscription["keys"]["p256dh"], "string", [ "stirct" => true, "min" => 88, "max" => 88 ] );
    $auth_key = $loader->nest->validate( $push_subscription["keys"]["auth"], "string", [ "stirct" => true, "min" => 24, "max" => 24 ] );

    if ( $endpoint && $pub_key && $auth_key ){

      if ( !$loader->db->_select(array(
        "table" => "_u_push_subs",
        "where" => array(
          [ "user_id", "=", $loader->user->check()->ID ],
          [ "data_hash", "=", md5( json_encode( $push_subscription ) ) ]
        )
      )) ){

        $loader->db->_insert(array(
          "table" => "_u_push_subs",
          "set" => array(
            [ "user_id", $loader->user->check()->ID ],
            [ "data", json_encode( $push_subscription ) ],
            [ "data_hash", md5( json_encode( $push_subscription ) ) ],
          )
        ));

      }

      $loader->api->set_message( "registered" );

    }

  }

}

?>
