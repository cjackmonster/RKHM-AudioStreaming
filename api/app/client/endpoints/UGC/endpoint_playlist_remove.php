<?php

if ( !defined( "bof_root" ) ) die;

function endpoint_playlist_remove( $loader, $excuter, $args ){

  $playlist_id = $loader->nest->user_input( "post", "id", "md5" );

  if ( $playlist_id ){

    $playlist = $loader->object->ugc_playlist->select(
      array(
        "hash" => $playlist_id,
        "user_id" => $loader->user->get()->ID
      )
    );

    if ( $playlist ){
      $loader->object->ugc_playlist->delete(
        array(
          "ID" => $playlist["ID"]
        )
      );
    }

  }
  $loader->api->set_message( "deleted" );

}

?>
