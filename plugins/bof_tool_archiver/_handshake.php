<?php

if ( !defined( "bof_root" ) ) die;

define( "bof_archiver", dirname(__FILE__) );

$bof->object->core_files->add_key(
  "class",
  "archiver",
  bof_archiver . "/classes/class_archiver.php"
);

$bof->archiver->setup();

?>
