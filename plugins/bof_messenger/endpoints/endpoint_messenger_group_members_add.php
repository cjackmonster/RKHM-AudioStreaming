<?php

if ( !defined( "bof_root" ) ) die;

function endpoint_messenger_group_members_add( $loader, $excuter, $args ){

  $user = $loader->user->get();
  $hash = $loader->nest->user_input( "post", "hash", "md5" );

  if ( $user->ID && $hash ){

    $group = $loader->object->ms_group->select(
      array(
        "hash" => $hash,
        "users_ids" => $user->ID
      ),
      array(
        "_eq" => array(
          "users" => array(
            "_eq" => array(
              "avatar" => array(
                "select" => "image_strings_1_image"
              )
            ),
          )
        ),
        "cleaner" => function( $item ){
          unset( $item["raw"] );
          return $item;
        }
      )
    );


    if ( $group ){

      $group = $loader->object->ms_group->publicize( $group );
      $loader->api->set_message( "ok", [ "group" => $group ] );
      return;

    }

  }

  $loader->api->set_error( "failed" );

}

?>
