<?php

define( "installer_root", dirname(__FILE__) );

set_time_limit(0);
ignore_user_abort(1);

ini_set('session.use_cookies', 0);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
 

function iFall( $reason, $extra=[] ){
  die( $reason );
}

header("Cache-Control: no-cache, must-revalidate");

$configs["base"] = dirname(installer_root) . "/api/app/config.php";
$configs["user_file"] = dirname(installer_root) . "/api/app/config_license.php";
$configs["license_file"] = dirname(installer_root) . "/api/app/config_user.php";

foreach( $configs as $config_file_name => $config_file_path ){

  if ( !is_file( $config_file_path ) )
  iFall( "{$config_file_path} does not exists. Read the documentation, re-upload everything" );

  if ( !is_writable( $config_file_path ) )
  iFall( "{$config_file_path} is not writable. This is a server-related issue, you need to give proper access to all files inside " . (  dirname(installer_root) ) . " directory" );

  require_once( $config_file_path );

}

require_once( installer_root . "/class_installer.php" );

$installer = new installer();

if ( empty( $_POST ) )
$installer->ui();

else
$installer->be();

?>
