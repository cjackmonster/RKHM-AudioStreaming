<?php

if ( !defined( "bof_root" ) ) die;

function endpoint_muse_request_source( $loader, $excuter, $args ){

  bof()->call( "muse", "req_source" );

  $object_name = $loader->nest->user_input( "post", "object_type", "bofClient_object", [ "has_button" => "play" ] );
  $object_hash = $loader->nest->user_input( "post", "object_hash", "md5" );

  if ( $object_name && $object_hash ){

    $the_object = $loader->object->__get( $object_name );
    $object_item = $the_object->select(
      array(
        "hash" => $object_hash
      ),
      array(
        "muse_source" => true,
        "_eq" => array(
          "sources" => array(),
          "cover" => []
        )
      )
    );

    if ( $object_item ? !empty( $object_item["sources"] ) : false ){

      $sources_gs = $object_item["sources"];

      foreach( $sources_gs as $source_G ){

        $sources_data = $source_G["data"];
        $sources_by_type = $loader->source->get( "stream", $source_G["ot"], $source_G["raw"], $source_G["sources"], "stream" );

        if ( $sources_by_type === "pending" ){
          $loader->api->set_error( "failed_pending", [ "pending" => true ] );
          return;
        }

        if ( !empty( $sources_by_type["user"] ) ){

          $source = [];
          $source["data"] = $sources_data;
          $source["source"] = $sources_by_type["user"]["muse"];
          $source["types"] = $sources_by_type["all"];

          $source["data"]["ID"] = $sources_by_type["user"]["hash"];

          if ( !empty( $source["source"]["type"][0] ) ?
            ( $source["source"]["type"][0] == "audio" || $source["source"]["type"][0] == "video" ) &&
            !empty( $source["source"]["type"][1]["address"] ) &&
            !empty( $sources_by_type["user"]["protected"] )
          : false ){
            if ( preg_match( "/\/files\/protected\//", $source["source"]["type"][1]["address"] ) ){
              $source["source"]["type"][1]["type"] = "protected";
              $source["source"]["type"][1]["address"] = $loader->source->grant_access( $source_G["ot"], $source_G["raw"]["hash"], $source["data"]["ID"], $source["source"]["type"][1]["address"], "20 MINUTE" );
            }
          }

          if ( !empty( $source["source"]["type"][0] ) && !empty( $source["source"]["type"][1] ) && !empty( $sources_by_type["user"]["hash"] ) ? is_array( $source["source"]["type"][1] ) : false ){
            $source["source"]["type"][1]["_report"] = md5( $sources_by_type["user"]["hash"] . sign_code );
            $source["source"]["type"][1]["_hash"] = $sources_by_type["user"]["hash"];
          }

          if ( empty( $source["data"]["cover"] ) ){
            $placeholder = $loader->object->db_setting->get( "placeholder" );
            if ( $placeholder ){
              $placeholder = $loader->object->file->select( [ "ID" => $placeholder ] );
              $source["data"]["cover"] = $placeholder["image_thumb"];
            }
          }

          if ( empty( $source["data"]["preview"] ) ? true : (  $source["data"]["preview"]["type"] == "image" && empty(  $source["data"]["preview"]["image"] ) ) ){
            $placeholder = $loader->object->db_setting->get( "placeholder" );
            if ( $placeholder ){
              $placeholder = $loader->object->file->select( [ "ID" => $placeholder ] );
              $source["data"]["preview"] = array(
                "type" => "image",
                "image" => $placeholder["image_strings"][1]["html"]
              );
            }
          }

          $sources[] = $source;

        }

      }

      if ( empty( $sources_by_type["all"]["count"] ) ){
        $loader->api->set_error( "cant_play", array(
          "dont_seek_resolution" => true
        ) );
        return;
      }

      if ( empty( $sources ) ){
        $loader->api->set_error( "access_denied" );
        return;
      }

      $loader->api->set_message( "ok", array(
        "sources" => $sources,
      ) );

      return;

    }

  }

  $loader->api->set_error( "failed", [ "available" => !empty( $sources_by_type["all"] ) ? $sources_by_type["all"] : false ] );

}

?>
