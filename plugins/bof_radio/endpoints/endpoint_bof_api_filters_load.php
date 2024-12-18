<?php

if ( !defined( "bof_root" ) ) die;

if ( function_exists("endpoint_bof_api_filters_load") ) return;

function endpoint_bof_api_filters_load( $loader, $excuter, $args ){

  $page = bof()->nest->user_input( "post", "page", "in_array", [ "values" => [ "audiobook_automation", "radio_automation", "podcast_automation" ] ] );
  $is = bof()->nest->user_input( "post", "inputs", "string" );

  if ( !$page || !$is ){
    $loader->api->set_error( "Select filters" );
    return;
  }

  $types = [];
  foreach( explode( ",", $is ) as $i ){

    $i = trim( $i );
    if ( empty( $i ) ) continue;

    if ( $i == "cs___all__" || $i == "ls___all__" ){
      $types[ substr( $i, 0, 2 ) ][] = "all";
    } else {
      if ( count( explode( "_", $i ) ) != 2 ) continue;
      list( $it, $iid ) = explode( "_", $i );
      if ( $it != "cs" && $it != "ls" ) continue;
      if ( !bof()->nest->validate( $iid, "int" ) ) continue;
      $types[ $it ][] = $iid;
    }

  }

  if ( empty( $types["cs"] ) || empty( $types["ls"] ) ){
    $loader->api->set_error( "Select filters" );
    return;
  }

  if ( in_array( "all", $types["cs"], true ) )
  $types["cs"] = ["all"];

  if ( in_array( "all", $types["ls"], true ) )
  $types["ls"] = ["all"];

  $check = bof()->boac->varys_filters_check( str_replace( "_automation", "", $page ), $types );

  $loader->api->set_message($check["messages"][0]);

}

?>
