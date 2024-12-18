<?php

if ( !defined( "bof_root" ) ) die;

define( "bof_fake_user_generator", dirname(__FILE__) );

$bof->object->core_files->add_key(
  "class",
  "fake_user_generator",
  bof_fake_user_generator . "/classes/class_fake_user_generator.php"
);

$bof->fake_user_generator->setup();

?>
