<?php

if ( !defined( "bof_root" ) ) die;

function endpoint_user_edit_single_item_rem( $loader, $excuter, $args ){

  $object_name = $loader->nest->user_input( "post", "ot", "bofClient_object" );
  $object_hash = $loader->nest->user_input( "post", "oh", "md5" );

  if ( $object_name && $object_hash ){

    $object_item = bof()->object->__get( $object_name )->select( array(
      "hash" => $object_hash,
      "uploader_id" => bof()->user->get()->ID
    ) );

    if ( $object_item ){

      bof()->object->__get( $object_name )->delete( array(
        "ID" => $object_item["ID"]
      ) );

    }

  }

  $loader->api->set_message( "deleted" );

}

?>
