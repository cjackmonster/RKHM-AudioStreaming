<?php

if ( !defined( "root" ) || !defined( "bof_root" ) ) die;

$bof_instance = new BusyOwlFramework(array(
  "name" => "bof_client",
  "plugins" => array(
    "youtube" => [],
    "soundcloud" => [],
    "ffmpeg" => [],
    "google" => [],
    "social_login" => [],
    "id3" => [],
    "chapar" => [],
    "pgt" => [],
    "ai" => [],
  )
));

function bof(){
  global $bof_instance;
  return $bof_instance;
}
function turn( $hook, $params=[], $args=[] ){
  return bof()->object->language->turn( $hook, $params, array_merge(
    $args,
    array(
      "uc_first" => true,
      "lang" => "users"
    )
  ) );
}

bof()->__setup();

require_once( root . "/app/client/_setup/endpoint_groups.php" );
require_once( root . "/app/client/_setup/endpoints.php" );
require_once( root . "/app/client/_setup/classes.php" );
require_once( root . "/app/client/_setup/objects.php" );
require_once( root . "/app/client/_setup/db.php" );
require_once( root . "/app/client/_setup/plugins.php" );

bof()->object->core_setting->set( "session_table_name", "_bof_cache_sessions" );
bof()->object->core_setting->set( "request_log_table_name", "_bof_log_requests" );
bof()->object->core_setting->set( "api_request_log_table_name", "_bof_log_api_requests", true );
bof()->object->core_setting->set( "supported_platforms", array( "web", "android", "ios", "windows", "mac" ), true );

?>
