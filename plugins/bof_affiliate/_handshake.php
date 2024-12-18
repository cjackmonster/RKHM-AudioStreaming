<?php

if ( !defined( "bof_root" ) ) die;

define( "bof_affiliate_root", dirname(__FILE__) );

$bof->object->core_files->add_key(
  "class",
  "affiliate",
  bof_affiliate_root . "/classes/class_affiliate.php"
);

$bof->affiliate->setup();

?>
