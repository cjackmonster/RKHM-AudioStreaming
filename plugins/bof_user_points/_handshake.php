<?php

if ( !defined( "bof_root" ) ) die;

define( "bof_user_points", dirname(__FILE__) );

$bof->object->core_files->add_key(
  "class",
  "user_points",
  bof_user_points . "/classes/class_user_points.php"
);

$bof->user_points->setup();

?>
