<?php

if ( !defined( "bof_root" ) ) die;

function endpoint_messenger_share( $loader, $excuter, $args ){

  $object_name = $loader->nest->user_input( "post", "ot", "bofClient_object", [ "has_button" => "share" ] );
  $hash = $loader->nest->user_input( "post", "hash", "md5" );
  $ids_raw = $loader->nest->user_input( "post", "ids", "string" );

  if ( $object_name && $hash ){

    $object_item = bof()->object->__get( $object_name )->select(["hash"=>$hash]);
    if ( $object_item ){

      if ( $ids_raw ){

        $idsByType = [];
        $ids_raw = explode( ";", $ids_raw );
        foreach( $ids_raw as $id_raw ){
          $id_raw_E = explode( ":", $id_raw );
          if ( count( $id_raw_E ) != 2 ) return;
          list( $idType, $idHash ) = $id_raw_E;
          if ( !in_array( $idType, [ "msg", "user" ], true ) ) return;
          if ( !bof()->nest->validate( $idHash, "md5" ) ) return;
          if ( $idType == "user" ){
            $checkIdUser = bof()->object->user->select(["hash"=>$idHash]);
            if ( !$checkIdUser ) return;
            if ( $checkIdUser["ID"] == bof()->user->check()->ID ) return;
            $idID = $checkIdUser["ID"];
          } else {
            $checkGroup = bof()->object->ms_group->select(array(
              "users_ids" => bof()->user->check()->ID,
              "hash" => $idHash
            ));
            if ( !$checkGroup ) return;
            $idID = $checkGroup["ID"];
          }
          if ( !isset( $idsByType[$idType] ) ) $idsByType[$idType] = [];
          $idsByType[$idType][] = $idID;
        }

        if ( !empty( $idsByType ) ){

          if ( !empty( $idsByType["user"] ) ){
            foreach( $idsByType["user"] as $targetUserID ){
              $targetUserGroupID = bof()->object->ms_group->_1on1_group( bof()->user->check()->ID, $targetUserID );
              if ( empty( $idsByType["msg"] ) ) $idsByType["msg"] = [];
              if ( !in_array( $targetUserGroupID, $idsByType["msg"], true ) )
              $idsByType["msg"][] = $targetUserGroupID;
            }
          }

          if ( !empty( $idsByType["msg"] ) ){

            foreach( $idsByType["msg"] as $targetGID ){
              bof()->object->ms_message->insert( array(
                "user_id" => bof()->user->check()->ID,
                "group_id" => $targetGID,
                "type" => "object",
                "content" => json_encode( array(
                  "type" => $object_name,
                  "ID" => $object_item["ID"],
                  "hash" => $object_item["hash"]
                ) ),
              ) );
            }

            $loader->api->set_message( "ok" );
            return;

          }

        }

      }

    }

  }

}

?>
