<?php

if ( !defined( "bof_root" ) ) die;

function endpoint_user_upload_verify_sources( $loader, $excuter, $args ){

  $given = $loader->nest->user_input( "post", "given_data", "json" );
  $content = $loader->nest->user_input( "post", "content_data", "json" );
  $source = $loader->nest->user_input( "post", "source_data", "json" );

  try {
    $verify = $loader->upload->setup()->verify_sources( $content, $source, $given );
  } catch( exception $err ){
    $loader->api->set_error( $err->getMessage() );
    return;
  }

  $loader->api->set_message( "ok", $verify );

}

?>
