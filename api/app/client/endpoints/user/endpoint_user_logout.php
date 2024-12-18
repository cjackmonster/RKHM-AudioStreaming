<?php

if ( !defined( "bof_root" ) ) die;

function endpoint_user_logout( $loader, $excuter, $args ){

  $id = $loader->session->getID();
  $userID = bof()->user->check()->ID;
  
  if ( $id ){
    bof()->object->session->delete( array(
      "session_id" => $id,
      "user_id" => $userID
    ) );
  }

}

?>
