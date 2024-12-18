<?php

define( "rawmean", false );

define( "base_root", dirname(dirname(dirname(__FILE__))) );
define( "bof_root", rawmean ? "E:/busyowl/frame/" : base_root . "/BOF/" );
define( "plugins_root", base_root . "/plugins/" );
define( "themes_root", base_root . "/themes/" );
define( "root", base_root . "/api/" );

require_once( dirname(__FILE__) . "/config_user.php" );
require_once( dirname(__FILE__) . "/config_license.php" );

define( "endpoint_address", web_address . "api/" );
define( "assets_address", endpoint_address . "assets/" );
define( "themes_address", web_address . "themes/" );

define( "bof_assets_address", rawmean ? "http://localhost:666/assets/" : web_address . "BOF/assets/" );

define( "admin_web_address", web_address . "admin/" );
define( "admin_endpoint_address", endpoint_address . "be/" );

define( "david", false );
define( "version", 2063 );
define( "bof_version", 2063 );

?>
