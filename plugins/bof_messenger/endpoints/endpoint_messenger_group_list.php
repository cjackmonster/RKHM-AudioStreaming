<?php

if ( !defined( "bof_root" ) ) die;

function endpoint_messenger_group_list( $loader, $excuter, $args ){

  $user = $loader->user->get();
  $query = $loader->nest->user_input( "post", "query", "string" );

  if ( $user ){

    $userGroupsWhereArray = array(
      "users_ids" => $user->ID,
    );

    if ( $query ){
      $userGroupsWhereArray["query"] = $query;
      $userGroupsWhereArray["type"] = "group";
    }

    $userGroups = bof()->object->ms_group->select(
      $userGroupsWhereArray,
      array(
        "single" => false,
        "limit" => 6,
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
        ),
        "cleaner" => function( $item ){
          return array(
            "cover" => !empty( $item["cover"] ) ? $item["cover"] : null,
            "name" => !empty( $item["name"] ) ? $item["name"] : null,
            "detail" => count( $item["bof_rel_users"] ),
            "hash" => "msg:{$item["hash"]}",
          );
        }
      )
    );

    if ( $query ){

      $users = bof()->object->user->select(
        array(
          "query" => $query
        ),
        array(
          "limit" => 5,
          "single" => false,
          "_eq" => array(
            "avatar" => array(
              "select" => "image_strings_1_image"
            ),
          ),
          "cleaner" => function( $item ){
            return array(
              "cover" => $item["bof_file_avatar"] ? "<div class='user_avatars'><div class='user_avatar'>{$item["bof_file_avatar"]}</div></div>" : false,
              "name" => $item["username"],
              "detail" => 2,
              "hash" => "user:{$item["hash"]}"
            );
          }
        )
      );

      if ( empty( $userGroups ) )
      $userGroups = [];

      if ( $users )
      $userGroups = array_merge( $userGroups, $users );

      $sorted_result = [];
      if ( $userGroups ){
        foreach( $userGroups as $item ){

          if ( $item["name"] ){
            similar_text( $query, $item["name"], $sim );
            $sim = round( $sim );
            if( isset( $sorted_result[ $sim ] ) ) $sim .= $item["name"];
          } else {
            $sim = 0 . $item["name"];
          }
          $sorted_result[ $sim ] = $item;

        }
        $userGroups = $sorted_result;
        krsort( $userGroups );
        $userGroups = array_values( $userGroups );
      }

    }

  }

  $loader->api->set_message( "ok", array(
    "groups" => !empty( $userGroups ) ? $userGroups : null
  ) );

}

?>
