<?php

if ( !defined( "bof_root" ) ) die;

define( "bof_audiobook_root", dirname(__FILE__) );

$bof->object->core_files->add_key(
  "class",
  "audiobook",
  bof_audiobook_root . "/classes/class_audiobook.php"
);

$bof->audiobook->setup();

?>
