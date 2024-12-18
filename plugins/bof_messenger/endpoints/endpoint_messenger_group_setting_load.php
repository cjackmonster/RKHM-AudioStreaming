<?php

if ( !defined( "bof_root" ) ) die;

function endpoint_messenger_group_setting_load( $loader, $excuter, $args ){

  $user = $loader->user->get();
  $hash = $loader->nest->user_input( "post", "hash", "md5" );

  if ( $user->ID && $hash ){

    $group = $loader->object->ms_group->select(
      array(
        "hash" => $hash,
        "admin_id" => $user->ID,
        "type" => "group"
      ),
      array(
        "cleaner" => function( $item ){
          unset( $item["raw"] );
          return $item;
        }
      )
    );


    if ( $group ){

      $inputs = array(
        "name" => array(
          "label" => "Name",
          "tip" => "Choose a name",
          "input" => array(
            "type" => "text",
            "name" => "name",
            "value" => $group["name"],
          )
        ),
        "cover_id" => array(
          "label" => "Cover",
          "input" => array(
            "name" => "cover_id",
            "value" => $group["cover_id"]
          ),
          "bofInput" => array(
            "file",
            array(
              "type" => "image",
              "object_type" => "ms_group_c"
            )
          )
        ),
      );

      $inputs["cover_id"] = $loader->bofInput->parse( $inputs["cover_id"] )["data"];

      $group = $loader->object->ms_group->publicize( $group );

      $loader->api->set_message( "ok", [ "group" => $group, "inputs" => $inputs ] );
      return;

    }

  }

  $loader->api->set_error( "failed" );

}

?>
