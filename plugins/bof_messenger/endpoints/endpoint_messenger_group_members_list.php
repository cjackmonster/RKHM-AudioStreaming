<?php

if ( !defined( "bof_root" ) ) die;

function endpoint_messenger_group_members_list( $loader, $excuter, $args ){

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

      $admin = $loader->object->user->select(["ID"=>$group["admin_id"]]);

      if ( $group ? $group["bof_rel_users"] : false ){
        foreach( $group["bof_rel_users"] as &$_r_user ){
          if ( $_r_user["hash"] == $admin["hash"] )
          $_r_user["class"] = "admin";
          elseif ( $loader->user->get()->ID == $admin["ID"] ){
            $_r_user["buttons"] = "<div class='btn btn-secondary remove_member_user_handle' data-action='remove_member'>Remove<div class='loader'></div></div>";
            $_r_user["class"] = "has_buttons count_1";
            $_r_user["attr"] = " data-group='{$group["hash"]}' ";
          }
        }
      }

      $group = $loader->object->ms_group->publicize( $group );

      $loader->api->set_message( "ok", [ "group" => $group ] );
      return;

    }

  }

  $loader->api->set_error( "failed" );

}

?>
