<?php

if ( !defined( "bof_root" ) ) die;

define( "bof_soundcloud_scrapper", dirname(__FILE__) );

$bof->object->core_files->add_key(
  "class",
  "soundcloud_scrapper",
  bof_soundcloud_scrapper . "/classes/class_soundcloud_scrapper.php"
);

$bof->soundcloud_scrapper->setup();

?>
