<?php

if ( !defined( "bof_root" ) ) die;

function endpoint_messenger_group_members_remove( $loader, $excuter, $args ){

  $group_hash = $loader->nest->user_input( "post", "group_hash", "md5" );
  $user_hash = $loader->nest->user_input( "post", "user_hash", "md5" );
  $requester_ID = $loader->user->get()->ID;

  if ( $group_hash && $user_hash ){

    $user = $loader->object->user->select(["hash"=>$user_hash]);
    $group = $loader->object->ms_group->select(
      array(
        "users_ids" => $requester_ID,
        "hash" => $group_hash
      )
    );

    // Is the user requesting a valid group and is a member of requeted group
    if ( $group && $user ){

      if ( $user["ID"] == $requester_ID ){
        $check_membership = true;
      }
      else {
        $check_membership = $loader->object->ms_group->select(
          array(
            "hash" => $group_hash,
            "users_ids" => $user["ID"]
          )
        );
      }

      if ( $check_membership ){

        // Removing self from a group
        if ( $user["ID"] == $requester_ID && ( $group["type"] == "group" ? $group["admin_id"] != $requester_ID : false ) ){
          $loader->object->ms_group->_remove_member( $group["ID"], $user["ID"] );
          $loader->api->set_message( "left_group" );
          return;
        }
        // Removing group
        elseif ( $user["ID"] == $requester_ID && ( $group["type"] == "1on1" || $group["type"] == "self" || ( $group["type"] == "group" ? $group["admin_id"] == $requester_ID : false ) ) ){
          $loader->object->ms_group->delete(["ID"=>$group["ID"]]);
          $loader->api->set_message( $group["type"] == "1on1" ? "left_group" : "removed" );
          return;
        }
        // Removing else one from a group
        elseif ( $user["ID"] != $requester_ID && ( $group["type"] == "group" ? $group["admin_id"] == $requester_ID : false ) ){
          $loader->object->ms_group->_remove_member( $group["ID"], $user["ID"] );
          $loader->api->set_message( "removed" );
          return;
        }

      }

    }

  }

  $loader->api->set_message( "failed" );

}

?>
