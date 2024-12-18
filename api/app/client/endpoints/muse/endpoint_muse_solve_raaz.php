<?php

if ( !defined( "bof_root" ) ) die;

function endpoint_muse_solve_raaz( $loader, $excuter, $args ){

  // Validate simplified data
  $_d["title"] = $title = $loader->nest->user_input( "post", "title", "string" );
  $_d["sub_title"] = $sub_title = $loader->nest->user_input( "post", "sub_title", "string" );
  $_d["object_type"] = $object_type = $loader->nest->user_input( "post", "object_type", "bofClient_object", [ "has_button" => "play" ] );
  $_d["object_hash"] = $object_hash = $loader->nest->user_input( "post", "object_hash", "md5" );
  $_d["duration"] = $duration = $loader->nest->user_input( "post", "duration", "int", [ "empty()" => true, "min" => 0 ] );
  if ( !$title || !$sub_title || !$object_type || !$object_hash || $object_type != "m_track" ){
    $loader->api->set_error( "bad_inputs" );
    return;
  }

  // Validate Raaz data
  $youtube_id = bof()->nest->user_input( "post", "youtube_id", "youtube_uri" );
  $youtube_get = bof()->nest->user_input( "post", "youtube_get", "equal", [ "value" => "true" ] );
  $youtube_piped = bof()->nest->user_input( "post", "youtube_piped", "equal", [ "value" => "true" ] );
  $youtube_piped_instances = bof()->nest->user_input( "post", "youtube_piped_instances", "equal", [ "value" => "true" ] );
  $youtube_download = bof()->nest->user_input( "post", "youtube_download", "equal", [ "value" => "true" ] );
  $soundcloud_get = bof()->nest->user_input( "post", "soundcloud_get", "equal", [ "value" => "true" ] );

  if ( $youtube_get ? !$loader->object->db_setting->get( "youtube_automation" ) : false )
  return;

  if ( $youtube_download ? !$loader->object->db_setting->get( "ut" ) : false )
  return;

  if ( $youtube_piped ? !$loader->object->db_setting->get( "youtube_piped" ) : false )
  return;

  if ( $soundcloud_get ? !$loader->object->db_setting->get( "soundcloud_automation" ) : false )
  return;

  if ( $youtube_get || $youtube_download || $youtube_piped ){
    $target = "youtube";
  }
  elseif ( $soundcloud_get ){
    $target = "soundcloud";
  }
  else{
    return;
  }

  // Validate object type & hash & existence
  $the_object = $loader->object->__get( $object_type );
  $object_item = $the_object->select(
    array(
      "hash" => $object_hash
    ),
    array(
      "_eq" => array(
        "sources" => [],
        "cover" => [],
        "artist" => []
      )
    )
  );

  if ( !$object_item ){
    $loader->api->set_error( "bad_inputs" );
    return;
  }

  // Validate titlle & sub-title
  $_nd = array(
    "title" => $object_item["title"],
    "sub_title" => $object_item["bof_dir_artist"]["name"],
    "duration" => $object_item["duration"]
  );

  $target_source_exists = null;
  $target_source_id = null;
  $required_source_exists = null;
  // Check source existence
  if ( !empty( $object_item["bof_dir_sources"] ) ){
    foreach( $object_item["bof_dir_sources"] as $source ){
      if ( $target == "youtube" && ( $source["type"] == "youtube" ? !empty( $source["data_decoded"]["youtube_id"] ) : false ) ){
        $target_source_exists = $source;
        $target_source_id = $source["data_decoded"]["youtube_id"];
        if ( !$youtube_download && !$youtube_piped )
        $required_source_exists = $source;
      }
      elseif ( $target == "youtube" && $youtube_download ? ( $source["type"] == "audio" ) : false ){
        $required_source_exists = $source;
      }
      elseif ( $target == "soundcloud" && ( $source["type"] == "soundcloud" ? !empty( $source["data_decoded"]["soundcloud_id"] ) : false ) ){
        $target_source_exists = $source;
        $target_source_id = $source["data_decoded"]["soundcloud_id"];
        $required_source_exists = $source;
      }
    }
  }

  // Required source exists
  if ( $required_source_exists ){
    $loader->api->set_message( "ok", $required_source_exists["muse"] );
    return;
  }

  // Check if we can get target source if required
  $can_get_target = $target == "youtube" ? $youtube_get : $soundcloud_get;
  if ( !$required_source_exists && !$target_source_exists && !$can_get_target ){
    return;
  } 

  // Check if we need to get target source
  if ( !$target_source_exists ){

    $_urid = bof()->request->user_request_ini("{$target}_id", $_d);
    if ( $_urid === true )
    return;

    // fetch
    if ( $target == "youtube" ){
      $try_to_fetch_target_id = $loader->youtube->find_video( $_nd );
    } 
    else {
      $try_to_fetch_target_id = $loader->soundcloud->find_track( $_nd );
    }

    bof()->request->user_request_update(
      $_urid,
      $try_to_fetch_target_id[0] ? true : false,
      $try_to_fetch_target_id[0] ? ["{$target}_id" => $try_to_fetch_target_id[1]] : $try_to_fetch_target_id[1]
    );

    if ( !$try_to_fetch_target_id[0] ? true : !$try_to_fetch_target_id[1] ){
      $loader->api->set_error( 
        $try_to_fetch_target_id[1], 
        [ "output_args" => [ "turn" => false ] ] 
      );
      return;
    }

    // record
    $target_source_id = $try_to_fetch_target_id[1];
    $loader->object->__get("m_track_source")->insert(array(
      "target_id" => $object_item["ID"],
      "type" => $target,
      "data" => json_encode([
        "{$target}_id" => $target_source_id
      ]),
      "stream_able" => 1,
      "download_able" => -2,
      "encrypted" => 0
    ));

  }

  if ( ( $target == "youtube" && !$youtube_download && !$youtube_piped ) || ( $target == "soundcloud" ) ){
    $loader->api->set_message( "ok", array(
      "type" => array(
        $target,
        array(
          "{$target}_id" => $target_source_id
        )
      )
    ) );
    return;
  }

  // yt-dl
  if ($youtube_download) {

    $_urid = bof()->request->user_request_ini("youtube_dl", $target_source_id);
    if ($_urid === true) return;

    try {
      $download_and_convert = $loader->youtube->download($target_source_id);
    } catch (Exception $err) {

      // $loader->api->set_error("Failure: " . $err->getMessage(), ["output_args" => ["turn" => false]]);

      bof()->request->user_request_update(
        $_urid,
        false,
        "Failure: " . $err->getMessage()
      );

      $loader->api->set_message("ok", array(
        "type" => array(
          $target,
          array(
            "{$target}_id" => $target_source_id
          )
        )
      ));

      return;

    }

    $rules = $loader->object->file->get_rules("audio", "m_track_source", ["get_host" => true]);

    $convert_file_id = $loader->object->file->insert(
      array(
        "type" => "audio",
        "host_id" => "1",
        "dest_host_id" => $rules["file_host"],
        "path" => $loader->object->file->clean_path($download_and_convert, true),
        "object_type" => "m_track_source",
      )
    );

    $convert_source = $loader->object->m_track_source->create(
      [],
      array(
        "target_id" => $object_item["ID"],
        "type" => "audio",
        "data" => array(
          "file_type" => "local",
          "local_file" => $convert_file_id,
        ),
      ),
      []
    );

    bof()->db->reset_cache();
    $object_sources = bof()->object->__get( "{$object_type}_source" )->select(
      array(
        "target_id" => $object_item["ID"],
        "type" => "audio"
      ),
      array(
        "limit" => 1,
        "single" => true,
        "cache_load_rt" => false
      )
    );

    bof()->request->user_request_update(
      $_urid,
      true,
      $object_sources["muse"]
    );

    $loader->api->set_message("ok", $object_sources["muse"]);
    return;

  }

  // yt-piped
  if ($youtube_piped) {

    $youtube_piped_method = bof()->object->db_setting->get( "youtube_piped_be", "server" );

    if ($youtube_piped_method == "server") {

      try {
        $stream = bof()->youtube_piped->set_setting()->get_stream($target_source_id);
      } catch (Exception | bofException $err) {

        $loader->api->set_message("ok", array(
          "type" => array(
            $target,
            array(
              "{$target}_id" => $target_source_id
            )
          )
        ));
        return;

        /*$loader->api->set_error( 
          $err->getMessage(), 
          [ "output_args" => [ "turn" => false ] ] 
        );
        return;*/
      }

      $loader->api->set_message("ok", array(
        "type" => array(
          $stream["type"],
          array(
            "address" => $stream["url"] . "&bof_sw_ignore_me=sure&unique=" . uniqid(),
            "type" => "free",
            "format" => $stream["mime"],
          )
        )
      ));

    }
    else {

      $response = array(
        "youtube_id" => $target_source_id,
        "youtube_piped_browser" => true,
      );

      if ( !$youtube_piped_instances ){
        $_urls = bof()->object->db_setting->get( "youtube_piped_iu", "https://pipedapi.darkness.services/" );
        if ( $_urls ){
          $_urls = explode( PHP_EOL, $_urls );
          $_urls = array_unique( $_urls );  
        }        
        $response["youtube_piped_urls"] = $_urls ? $_urls : false;
        $response["youtube_piped_type"] = explode( "_", bof()->object->db_setting->get( "youtube_piped_st" ) );
      }

      $loader->api->set_message("ok", $response );
      
    }

    return;

  }

}

?>
