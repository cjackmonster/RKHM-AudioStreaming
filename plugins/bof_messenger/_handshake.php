<?php

if ( !defined( "bof_root" ) ) die;

define( "bof_messenger_root", dirname(__FILE__) );

$bof->object->core_files->add_key(
  "class",
  "messenger",
  bof_messenger_root . "/classes/class_messenger.php"
);

$bof->messenger->setup();

?>
