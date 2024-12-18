<?php

if ( !defined( "bof_root" ) ) die;

function endpoint_archiver_mysqldump_path_test( $loader, $excuter, $args ){

  if ( bof()->user->check()->ID != 1 ){
    $loader->api->set_error("Only root-admin can do this");
    return;
  }

  $job = bof()->nest->user_input( "post", "job", "in_array", [ "values" => [ "check_version", "download_video" ] ], "check_version" );
  $path = bof()->nest->user_input( "post", "path", "string", array(
    "strict" => true,
    "strict_regex" => "[a-zA-Z0-9_.\-\/\:\\\ ]"
  ) );

  $test = [];

  if ( empty( $path ) ){
    $test[] = "Given path is in incorrect format";
    $failure = true;
  }
  else {
    if ( $job == "check_version" ){
      if ( !preg_match( "/yt-dlp/", $path ) )

      $version_command = "\"{$path}\" --version";
      $test[] = "Checking version ...";
      $version = exec( $version_command );
      $test[] = "Result: {$version}";
      $test[] = "If you can't see the version number, given path is incorrect";
    }
  }

  if ( empty( $failure ) )
  $loader->api->set_message( $test );

  else
  $loader->api->set_error( $test );
}

?>
