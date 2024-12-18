<?php

if ( !defined( "bof_root" ) ) die;

define( "bof_radio_root", dirname(__FILE__) );

$bof->object->core_files->add_key(
  "class",
  "radio",
  bof_radio_root . "/classes/class_radio.php"
);

$bof->radio->setup();

?>
