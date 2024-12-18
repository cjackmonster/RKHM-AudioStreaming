<?php

if ( !defined( "bof_root" ) ) die;

function endpoint_ai_translator_cancel( $loader, $excuter, $args ){

  if ( bof()->user->check()->ID != 1 ){
    $loader->api->set_error("Only root-admin can do this");
    return;
  }

  $state = bof()->object->db_setting->get( "aitor_state" );
  if ( $state !== 1 && $state !== "1" && $state !== 2 && $state !== "2" ){
    $loader->api->set_error("Not Queued");
    return;
  }

  bof()->object->db_setting->set( "aitor_state", 0 );
  $loader->api->set_message("ok");

}

?>
