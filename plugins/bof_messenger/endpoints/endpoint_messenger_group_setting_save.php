<?php

if ( !defined( "bof_root" ) ) die;

function endpoint_messenger_group_setting_save( $loader, $excuter, $args ){

  $user = $loader->user->get();
  $hash = $loader->nest->user_input( "post", "hash", "md5" );
  $name = $loader->nest->user_input( "post", "name", "string", [ "strip_emoji" => false ]  );
  $validate_cover = $loader->bofInput->validate( $loader->object->ms_group->columns()["cover_id"] );

  if ( $hash && $name ){

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

      $cover_input = 0;

      if ( $validate_cover ){

        $finalize_upload = $loader->object->file->finalize_upload(
          $loader->object->ms_group->columns()["cover_id"]["bofInput"][1]["type"],
          $loader->object->ms_group->columns()["cover_id"]["bofInput"][1]["object_type"],
          $loader->object->ms_group->bof()["name"] . $group["ID"] ,
          $validate_cover,
          $group["cover_id"]
        );

        if ( $finalize_upload )
        $cover_input = $validate_cover ? $validate_cover : $cover_input;

      }

      $loader->object->ms_group->update(
        array(
          "ID" => $group["ID"]
        ),
        array(
          "name" => $name,
          "cover_id" => $cover_input
        )
      );

      $loader->api->set_message( "saved" );
      return;

    }

  }

  $loader->api->set_error( "failed" );

}

?>
