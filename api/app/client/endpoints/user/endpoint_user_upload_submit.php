<?php

if ( !defined( "bof_root" ) ) die;

function endpoint_user_upload_submit( $loader, $excuter, $args ){

  try {
    $verify = $loader->upload->setup()->verify_submit();
  } catch( bofException|Exception $err ){
    $loader->api->set_error(
      $err->getMessage(),
      array_merge(
        method_exists( $err, "getExtra") ? $err->getExtra() : [],
        [ "output_args" => [ "turn" => false ] ]
      )
    );
    return;
  }

  $loader->api->set_message( "ok", $verify );

}

?>
