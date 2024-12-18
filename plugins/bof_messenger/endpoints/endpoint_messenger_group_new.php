<?php

if ( !defined( "bof_root" ) ) die;

function endpoint_messenger_group_new( $loader, $excuter, $args ){

  $users = bof()->nest->user_input( "post", "users", "int_imploded" );

  if ( $users ){

    $users_exploded = explode( ",", $users );
    foreach( $users_exploded as $userID ){

      if ( $userID == bof()->user->check()->ID )
      continue;

      $user = bof()->object->user->sid( $userID );
      if ( !$user )
      continue;

      $validUserIDs[] = $userID;

    }

    if ( !empty( $validUserIDs ) ){
      if ( count( $validUserIDs ) == 1 ){
        $group_id = bof()->object->ms_group->_1on1_group( $validUserIDs[0], bof()->user->check()->ID );
      } else {
        $validUserIDs[] = bof()->user->check()->ID;
        $group_id = bof()->object->ms_group->insert(array(
          "name" => "new group",
          "type" => "group",
          "admin_id" => end( $validUserIDs ),
          "users_ids" => implode( ",", $validUserIDs ),
        ));
      }
      if ( !empty( $group_id ) ){
        $groupData = bof()->object->ms_group->sid($group_id);
        $loader->api->set_message( "ok", array(
          "group_id" => $groupData["hash"]
        ) );
        return;
      }
    }

  }


  $loader->api->set_error( "failed" );

}

?>
