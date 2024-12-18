<?php

require_once( dirname(dirname(__FILE__)) . "/api/app/config.php" );

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: *");

require_once( bof_root . "/loader.php" );
require_once( root . "/app/client/loader.php" );

bof()->request->log();
bof()->execute->run();
bof()->response->display();

?>
