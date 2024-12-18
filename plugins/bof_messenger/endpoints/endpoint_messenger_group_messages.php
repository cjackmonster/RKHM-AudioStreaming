<?php

if ( !defined( "bof_root" ) ) die;

function endpoint_messenger_group_messages( $loader, $excuter, $args ){

  $user = $loader->user->get();
  $hash = $loader->nest->user_input( "post", "hash", "md5" );
  $page = $loader->nest->user_input( "post", "page", "int", [], 1 );
  $check = !empty( $_POST["check"] );
  $limit = 40;

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

      if ( $check ){

        $last_hash = $loader->nest->user_input( "post", "last_hash", "md5" );
        $last_time = $loader->nest->user_input( "post", "last_time", "timestamp" );
        if ( !$last_time || !$last_hash ) return;

        $messages = $loader->object->ms_message->count(
          array(
            "group_id" => $group["ID"],
            [ "time_add", ">", $last_time ]
          ),
          array(
            "cache" => false,
            "cache_load_rt" => false,
          )
        );

        $loader->api->set_message( "ok", [ "new_messages" => $messages ] );
        return;

      }

      $messages = $loader->object->ms_message->select(
        array(
          "group_id" => $group["ID"]
        ),
        array(
          "single" => false,
          "limit" => $limit,
          "page" => $page,
          "order_by" => "time_add",
          "order" => "DESC",
          "_eq" => array(
            "user" => array(
              "limit" => 1,
              "_eq" => array(
                "avatar" => array(
                  "select" => "image_strings_6_html"
                )
              ),
              "public" => true
            )
          ),
          "public" => true
        )
      );
      $messages_more = $loader->object->ms_message->select(
        array(
          "group_id" => $group["ID"]
        ),
        array(
          "single" => false,
          "limit" => $limit,
          "page" => ( $page + 1),
          "order_by" => "time_add",
          "order" => "DESC",
          "clean" => false
        )
      );
      $group = $loader->object->ms_group->publicize( $group );

      $loader->api->set_message( "ok", [ "group" => $group, "group_messages" => $messages, "has_more" => $messages_more ? true : false ] );
      return;

    }

  }

  $loader->api->set_error( "failed" );

}

?>
