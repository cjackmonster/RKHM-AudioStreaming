<?php

if ( !defined( "bof_root" ) ) die;

function endpoint_extension( $loader, $excuter, $args ){

  $plugin_list = $loader->plug->list();
  $plugin_name = $loader->nest->user_input( "get", "name", "string" );
  $action = $loader->nest->user_input( "get", "do", "in_array", [ "values" => [ "install", "uninstall", "activate", "deactivate", "update" ] ] );

  if ( $plugin_name == "self" && $action == "update" ){

    $process = $loader->plug->process_create( "update", "self" );
    $txt = "Creating a process to update script";

  }
  elseif ( $plugin_name && $action ? in_array( $plugin_name, array_keys( $plugin_list ), true ) : false ){

    $plugin_data = $plugin_list[ $plugin_name ];

    if ( $action == "install" && $plugin_data["installable"] && !$plugin_data["installed"] && in_array( $plugin_data["type"], [ "plugin", "tool", "theme" ], true ) ){
      $process = $loader->plug->process_create( "install", $plugin_data );
      $txt = "Creating a process to install <b>{$plugin_data["name"]}</b> version {$plugin_data["version_hr"]}";
    }

    else if ( $action == "update" && $plugin_data["installable"] && $plugin_data["installed"] && $plugin_data["exists"] && $plugin_data["installed_version"] < $plugin_data["version"] ){
      $process = $loader->plug->process_create( "update", $plugin_data );
      $txt = "Creating a process to update <b>{$plugin_data["name"]}</b> from version {$plugin_data["installed_version_hr"]} to version {$plugin_data["version_hr"]}";
    }

    else if ( $action == "activate" && $plugin_data["installable"] && !$plugin_data["installed"] && $plugin_data["exists"] && in_array( $plugin_data["type"], [ "plugin", "tool" ], true ) ){
      $process = $loader->plug->process_create( "activate", $plugin_data );
      $txt = "Creating a process to activate <b>{$plugin_data["name"]}</b>";
    }

    else if ( $action == "uninstall" && $plugin_data["exists"] && in_array( $plugin_data["type"], [ "plugin", "tool", "theme" ], true ) ){
      $process = $loader->plug->process_create( "uninstall", $plugin_data );
      $txt = "Creating a process to uninstall <b>{$plugin_data["name"]}</b>";
    }

    else if ( $action == "deactivate" && $plugin_data["installed"] && in_array( $plugin_data["type"], [ "plugin", "tool" ], true ) ){
      $process = $loader->plug->process_create( "deactivate", $plugin_data );
      $txt = "Creating a process to de-activate <b>{$plugin_data["name"]}</b>";
    }

  }

  if ( empty( $process ) )
  $loader->api->set_error( "Failed", [] );

  else
  $loader->api->set_message( "<div class='_head'>{$txt}</div>", array(
    "process" => $process
  ) );

}

?>
