<?php

if ( !defined( "bof_root" ) ) die;

function endpoint_messenger_group_message_new( $loader, $excuter, $args ){

  $user = $loader->user->get();
  $group = $loader->nest->user_input( "post", "group", "md5" );
  $text = $loader->nest->user_input( "post", "text", "string", array(
    "strip_emoji" => false,
    "allow_eol" => true
  ) );

  if ( $group && $text ){

    $checkGroup = bof()->object->ms_group->select( array(
      "hash" => $group,
      "users_ids" => $user->ID
    ) );

    if ( $checkGroup ){

      $content = json_encode( trim( str_replace( [ PHP_EOL.PHP_EOL, PHP_EOL.PHP_EOL, PHP_EOL.PHP_EOL ], PHP_EOL, $text ) ) );

      if ( !empty( $content ) ? strlen( $content ) > 3 : false ){

        bof()->object->ms_message->insert( array(
          "user_id" => $user->ID,
          "group_id" => $checkGroup["ID"],
          "type" => "text",
          "content" => $content,
        ) );

        $loader->api->set_message( "ok" );
        return;

      }

    }

  }

  $loader->api->set_error( "failed" );

}

?>
