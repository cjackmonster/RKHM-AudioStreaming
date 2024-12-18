<?php

if ( !defined( "bof_root" ) ) die;

function endpoint_youtube_test( $loader, $excuter, $args ){

  if ( bof()->user->check()->ID != 1 ){
    $loader->api->set_error("Only root-admin can do this");
    return;
  }

  if ( !function_exists('exec') ){
    $loader->api->set_error("exec function is disabled by your host");
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
      $test[] = "<b style='color:red'>youtube-dl</b> detected. We highly recommend intalling & using <b style='color:green'>yt-dlp</b> instead";

      $version_command = "\"{$path}\" --version";
      $test[] = "Checking version ...";
      $version = exec( $version_command );
      $test[] = "Result: {$version}";

      if ( preg_match( "/(\d{4}).(\d{2}).(\d{2}(.*?))?$/", $version, $_ms ) ){
        $date = implode( "/", array_slice( $_ms, 1 ) );
        $date_i = time() - strtotime( $date );
        //$test[] = "Last update: " . ( floor( $date_i / (24*60*60) ) ) . " day(s) ago";
        //if ( $date_i > 30*24*60*60 ) $test[] = "<b style='color:red'>Outdated</b> version detected. Time to update";
        $_p = bof()->object->db_setting->get( "ut_youtubedl_proxy" );
        $test[] = "Downloading https://www.youtube.com/watch?v=cm8x4uR1bck for test" . ( $_p ? ". Proxy: <b style='color:red'>{$_p}</b>" : "" );
      } else {
        $failure = true;
        $test[] = "<b style='color:red'>Failed to get version. Path is wrong, app is not installed correctly or web-server user has no permission to access {$path}</b><br>Make sure app is correctly installed, path is accurate then try again. This is a server-side problem";
      }

    }
    else {

      $dl_path = base_root . "/" . bof()->object->core_setting->get( "file_save_base_directory", "files" ) . "/tmp";
      bof()->file->mkdir( $dl_path );
      if ( !is_dir( $dl_path ) || !is_writable( $dl_path ) || !is_readable( $dl_path ) ){
        $test[] = "<b style='color:red'>`{$dl_path}` is not accessible by youtube-dl/yt-dlp. Make sure they have enough permission then retry</b>";
        $failure = true;
      } else {

        try {

          $start = time();

          if ( !bof()->plugin_exists("youtube") )
          bof()->plugin("youtube");

          bof()->youtube->download( "cm8x4uR1bck", array(
            "test" => true,
            "youtube_dl_location" => $path,
            "convert_if_required" => false
          ) );

          $exe = time() - $start;

          $test[] = "<b style='color:green'>Ok. Downloaded in {$exe} second(s)</b>";

        } catch( Exception|bofException $err ){

          $command = bof()->youtube->download( "cm8x4uR1bck", array(
            "youtube_dl_location" => $path,
            "returnCommand" => true
          ) );

          $test[] = "<b style='color:red'>Failed: ".($err->getMessage())."</b>";
          $test[] = "Try following command yourself and see why it fails, fix the issue then retry. This is a server-related issue";
          $test[] = $command;
          $failure = true;

        }

      }

    }
  }

  if ( empty( $failure ) )
  $loader->api->set_message( $test );

  else
  $loader->api->set_error( $test );
}

?>
