<?php

if ( !defined( "bof_root" ) ) die;

function endpoint_bofClient_single( $loader, $excuter, $args ){
  try {
    $loader->bofClient->_os( substr( $loader->request->get_requested_url(), strlen( "bofClient/single/" ), -1 ) );
  } catch( bofException $err ){}
}

?>
