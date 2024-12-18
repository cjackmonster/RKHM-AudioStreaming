<?php

if ( !defined( "bof_root" ) ) die;

function endpoint_messenger( $loader, $excuter, $args ){

  $user = $loader->user->get();
  $page = $loader->nest->user_input( "post", "page", "int", [], 1 );
  $direct = $loader->nest->user_input( "get", "direct", "md5" );
  $limit = 20;

  $type = "list";

  if ( $direct ){

    $target_user = $loader->object->user->select(["hash"=>$direct],["clean"=>false]);

    if ( $target_user ){
      $create = $loader->object->ms_group->_1on1_group( $target_user["ID"], $loader->user->get()->ID );
      if ( $create ){
        $target_group = $loader->object->ms_group->sid( $create );
        $_POST["hash"] = $target_group["hash"];
      }
    }

  }

  $groups = $loader->object->ms_group->select(
    array(
      "users_ids" => $user->ID
    ),
    array(
      "single" => false,
      "limit" => $limit,
      "page" => $page,
      "order_by" => "time_reply",
      "order" => "DESC",
      "_eq" => array(
        "users" => array(
          "_eq" => array(
            "avatar" => array(
              "select" => "image_strings_1_image"
            )
          )
        ),
        "cover" => array(
          "select" => "image_strings_1_image"
        ),
        "last_message" => true,
      ),
      "public" => true,
      "cleaner" => function( $item ){
        unset( $item["bof_rel_users"] );
        unset( $item["raw"] );
        return $item;
      }
    )
  );

  if ( ( $requested_hash = $loader->nest->user_input( "post", "hash", "md5" ) ) ){

    $extraGroups = $loader->object->ms_group->select(
      array(
        "users_ids" => $user->ID,
        "hash" => $requested_hash
      ),
      array(
        "single" => false,
        "limit" => $limit,
        "page" => $page,
        "order_by" => "time_reply",
        "order" => "DESC",
        "_eq" => array(
          "users" => array(
            "_eq" => array(
              "avatar" => array(
                "select" => "image_strings_1_image"
              )
            )
          ),
          "last_message" => true,
        ),
        "public" => true,
        "cleaner" => function( $item ){
          unset( $item["bof_rel_users"] );
          unset( $item["raw"] );
          return $item;
        }
      )
    );

    if ( $extraGroups && $page == 1 ){

      foreach( $groups as $_i ){
        if ( $_i["hash"] == $extraGroups[0]["hash"] )
        $extraGroups_exists = true;
      }

      if ( empty( $extraGroups_exists ) ){
        $groups = array_merge( $groups, $extraGroups );
      }

    }

  }

  $groups_more = $loader->object->ms_group->select(
    array(
      "users_ids" => $user->ID
    ),
    array(
      "single" => false,
      "limit" => $limit,
      "page" => ($page+1),
      "order_by" => "time_reply",
      "order" => "DESC",
      "clean" => false,
    )
  );

  $loader->api->set_message( "ok", [ "groups" => $groups, "user" => $user, "has_more" => $groups_more ? true : false, "reqed" => !empty( $requested_hash ) ? $requested_hash : false ] );

}

?>
