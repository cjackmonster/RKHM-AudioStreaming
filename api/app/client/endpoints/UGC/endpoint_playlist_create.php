<?php

if ( !defined( "bof_root" ) ) die;

function endpoint_playlist_create( $loader, $excuter, $args ){

  $object_name = $loader->nest->user_input( "post", "object_type", "bofClient_object", [ "has_button" => "playlist" ] );
  $object_hash = $loader->nest->user_input( "post", "object", "md5" );
  $name = $loader->nest->user_input( "post", "playlist", "string", [ "strip_emoji" => false ] );

  if ( !$name ){
    $loader->api->set_error( "name_cant_be_empty" );
    return;
  }

  if ( $object_name ){

    $the_object = $loader->object->__get( $object_name );

    try {
      $playlistID = $loader->object->ugc_playlist->create(
        array(),
        array(
          "name" => $name,
          "user_id" => $loader->user->get()->ID
        ),
        array(),
      );
    } catch( Exception $err ){
      $playlistID = fales;
    }

    $object_item = $the_object->select( array(
      "hash" => $object_hash
    ) );

    if ( $playlistID && $object_item ){

      if ( $the_object->method_exists( "playlisting" ) ){

        list( $new_object_name, $new_object_items ) = $the_object->playlisting( $object_item );
        foreach( $new_object_items as $_i => $_item ){
          $loader->object->ugc_property->insert(
            array(
              "user_id" => $loader->user->get()->ID,
              "type" => "playlist",
              "object_name" => $new_object_name,
              "object_id" => $_item["ID"],
              "related_object_name" => "ugc_playlist",
              "related_object_id" => $playlistID,
              "i" => $_i+1
            )
          );
        }

      }
      else {
        $loader->object->ugc_property->insert(
          array(
            "user_id" => $loader->user->get()->ID,
            "type" => "playlist",
            "object_name" => $object_name,
            "object_id" => $object_item["ID"],
            "related_object_name" => "ugc_playlist",
            "related_object_id" => $playlistID,
            "i" => "1"
          )
        );
      }

    }
    else {
      return;
    }

  }



  $loader->api->set_message( [ "playlist_created", "playlist_extended" ] );

}

?>
