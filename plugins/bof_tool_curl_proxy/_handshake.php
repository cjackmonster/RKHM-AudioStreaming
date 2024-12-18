<?php

if ( !defined( "bof_root" ) ) die;

define( "bof_curl_proxy", dirname(__FILE__) );

$bof->object->core_files->add_key(
  "class",
  "curl_proxy",
  bof_curl_proxy . "/classes/class_curl_proxy.php"
);

$bof->curl_proxy->setup();

?>
