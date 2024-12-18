<?php

if ( !defined( "bof_root" ) ) die;

function endpoint_plugin_list( $loader, $excuter, $args ){
  $loader->api->set_message( "ok", [ "list" => $loader->plug->list(
    $loader->nest->user_input( "get", "type", "in_array", [ "values" => [ "plugin", "tool", "theme" ] ], "plugin" )
  ) ] );
}

?>
