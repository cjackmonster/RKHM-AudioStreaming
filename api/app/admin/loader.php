<?php

if ( !defined( "root" ) || !defined( "bof_root" ) ) die;

$bof_instance = new BusyOwlFramework(array(
  "name" => "bof_admin",
  "plugins" => array(
    "id3" => [],
    "ffmpeg" => [],
    "chapar" => [],
    "pgt" => [],
    "google-translate" => [],
    "ai" => []
  )
));

function bof(){
  global $bof_instance;
  return $bof_instance;
}

bof()->__setup();

require_once( root . "/app/admin/_setup/endpoint_groups.php" );
require_once( root . "/app/admin/_setup/endpoints.php" );
require_once( root . "/app/admin/_setup/classes.php" );
require_once( root . "/app/admin/_setup/objects.php" );
require_once( root . "/app/admin/_setup/db.php" );
require_once( root . "/app/admin/_setup/parasites.php" );
require_once( root . "/app/admin/_setup/plugins.php" );

bof()->object->core_setting->set( "session_lock_agent", bof()->object->core_setting->get( "admin_session_lock_agent" ) );
bof()->object->core_setting->set( "session_lock_ip", bof()->object->core_setting->get( "admin_session_lock_ip" ) );
bof()->object->core_setting->set( "session_max", bof()->object->core_setting->get( "admin_session_max" ) );
bof()->object->core_setting->set( "session_expire", bof()->object->core_setting->get( "admin_session_expire" ) );
bof()->object->core_setting->set( "session_cc", 100 );

bof()->object->core_setting->set( "session_table_name", "_bof_cache_sessions_admin" );
bof()->object->core_setting->set( "request_log_table_name", "_bof_log_requests_admin" );
bof()->object->core_setting->set( "api_request_log_table_name", "_bof_log_api_requests_admin", true );
bof()->object->core_setting->set( "supported_platforms", array( "web" ), true );

?>
