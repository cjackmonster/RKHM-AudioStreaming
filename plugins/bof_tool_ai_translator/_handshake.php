<?php

if ( !defined( "bof_root" ) ) die;

define( "bof_ai_translator", dirname(__FILE__) );

$bof->object->core_files->add_key(
  "class",
  "ai_translator",
  bof_ai_translator . "/classes/class_ai_translator.php"
);

$bof->ai_translator->setup();

?>
