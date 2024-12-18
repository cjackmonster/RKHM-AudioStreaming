<?php

if ( !defined( "bof_root" ) ) die;

class youtube extends bof_type_class {

  protected $base = "https://www.googleapis.com/youtube/v3/";
  protected $key  = null;
  protected $setting = array(
    "regionCode" => "us",
    "simRatio" => 40
  );

  protected function set_key(){

    $keys = bof()->object->db_setting->get( "youtube_api_keys" );
    if ( !$keys ) return false;

    $keys = explode( PHP_EOL, str_replace( [ "<br>", "\r\n", "\n" ], PHP_EOL, $keys ) );

    $this->key = $keys[ rand( 0, count( $keys ) - 1 ) ];
    return true;

  }
  protected function set_setting(){

    if ( ( $regionCode = bof()->object->db_setting->get( "youtube_api_regionCode" ) ) )
    $this->setting["regionCode"] = $regionCode;

    if ( ( $simRatio = bof()->object->db_setting->get( "youtube_api_simRatio" ) ) )
    $this->setting["simRatio"] = $simRatio;

  }

  public function find_video( $data ){

    $title = null;
    $sub_title = null;
    $duration = null;
    extract( $data );
    $_query = ( $sub_title ? $sub_title . " - " : "" ) . "{$title}" ;

    $this->set_setting();

    $exe_search = $this->_bof_this->clean_search( $_query );

    if ( !$exe_search[0] )
    return $exe_search;

    $exe_search_items = $exe_search[1];

    if ( empty( $exe_search_items ) )
    return [ false, "YoutubeAPI: Found Nothing" ];

    $highest_similarity = 0;
    $highest_similarity_youtube_id = null;
    $highest_similarity_youtube_data = null;

    foreach( $exe_search_items as $result_item ){

      $found_bad_word = false;
      foreach( [ "re-action", "reaction", "re action", "live", "cover", "meaning", "verified", "awards", "show", "reverb", "explaining", "instrumental", "mashup", "tour", "interview", "slowed", "remix" ] as $not_allowed_text ){
				if ( !preg_match( "/{$not_allowed_text}/i", $_query ) ){
					if ( preg_match( "/{$not_allowed_text}/i", $result_item["title"] ) ){
            $found_bad_word = true;
          }
				}
			}

      if ( $found_bad_word )
      continue;

      if ( !empty( $duration ) && !empty( $result_item["duration"] ) ? abs( $duration - $result_item["duration"] ) > 60 : false )
      continue;

      similar_text(
        mb_strtolower( $_query, "UTF-8" ),
        mb_strtolower( $result_item["title"], "UTF-8" ),
        $sim
      );

      foreach( [ "official audio" => 13, "official video" => 13, "music video" => 10, "audio" => 7 , "video" => 7, "lyrics" => 4, "explicit" => 6 ] as $good_text => $good_text_point ){
				if ( preg_match( "/{$good_text}/i", $result_item["title"] ) ) $sim += $good_text_point;
			}

			if ( $sim > $highest_similarity && $sim >= $this->setting["simRatio"] ){
				$highest_similarity_youtube_id  = $result_item["id"];
        $highest_similarity_youtube_data = $result_item;
				$highest_similarity = $sim;
			}

    }

    if ( $highest_similarity_youtube_id )
    return [ true, $highest_similarity_youtube_id, $highest_similarity_youtube_data ];

    return [ false, "YoutubeAPI: Found Nothing Relevant" ];

  }
  public function clean_search( $query, $args=[] ){

    if ( !( $this->set_key() ) )
    return [ false, "YoutubeAPI: No Keys" ];

    $search = $this->_bof_this->search( $query, $args );
    if ( !$search[0] ) return $search;

    $clean = [];
    foreach( $search[1]["items"] as $item ){
      $clean[] = array(
        "id" => $item["id"]["videoId"],
        "title" => $item["snippet"]["title"],
        "description" => !empty( $item["snippet"]["description"] ) ? $item["snippet"]["description"] : null,
        "channel_id" => $item["snippet"]["channelId"],
        "channel_title" => $item["snippet"]["channelTitle"],
        "images" => !empty( $item["snippet"]["thumbnails"] ) ? $item["snippet"]["thumbnails"] : null,
      );
    }

    return [ true, $clean ];

  }
  public function search( $query, $args=[] ){

    $q = urldecode( $query );
    $part = "snippet";
    $maxResults = 10;
    $order = "relevance";
    $safeSearch = "moderate";
    $videoCategoryId = 10;
    $type = "video";
    $videoEmbeddable = true;
    $regionCode = $this->setting["regionCode"];
    extract( $args );

    return $this->_req( "search", array(
      "params" => array(
        "q" => $q,
        "part" => $part,
        "maxResults" => $maxResults,
        "order" => $order,
        "safeSearch" => $safeSearch,
        "videoCategoryId" => $videoCategoryId,
        "type" => $type,
        "videoEmbeddable" => $videoEmbeddable,
        "regionCode" => $regionCode
      )
    ) );

  }

  public function get_video_clean( $id, $args=[] ){

    $get_video = $this->_bof_this->get_video( $id, $args );
    if ( !$get_video[0] ) return $get_video;

    $api_data = $get_video[1];
    if ( empty( $api_data["items"] ) || empty( $api_data["pageInfo"] ) ? true : $api_data["pageInfo"]["totalResults"] != 1 || $api_data["items"][0]["kind"] != "youtube#video" )
    return [ 0, "not_found" ];

    $video_snippet = $api_data["items"][0]["snippet"];

    return [ true, array(
      "id" => $id,
      "title" => $video_snippet["title"],
      "channel_id" => $video_snippet["channelId"],
      "channel_name" => $video_snippet["channelTitle"],
      "description" => $video_snippet["description"],
      "tags" => !empty( $video_snippet["tags"] ) ? $video_snippet["tags"] : null,
      "time_publish" => $video_snippet["publishedAt"],
      "covers" => $video_snippet["thumbnails"],
      "live" => !empty( $video_snippet["liveBroadcastContent"] ) ? $video_snippet["liveBroadcastContent"] == "live" : false
    ) ];

  }
  public function get_video( $id, $args=[] ){

    $part = "snippet";
    extract( $args );

    if ( !( $this->set_key() ) )
    return [ false, "YoutubeAPI: No Keys" ];

    $this->set_setting();

    return $this->_req( "videos", array(
      "params" => array(
        "id" => $id,
        "part" => $part,
      )
    ) );

  }

  public function download_sub( $youtube_id, $args = [] ){

    $youtube_dl_location = null;
    $simplify = false;
    extract( $args );

    // Get & Check setting
    $youtube_dl_location = $youtube_dl_location ? $youtube_dl_location : bof()->object->db_setting->get( "ut_youtubedl_path" );
    $youtube_dl_proxy = bof()->object->db_setting->get( "ut_youtubedl_proxy" );
    if ( !$youtube_dl_location  )
    throw new Exception("Invalid youtube_dl path");

    $youtube_dl_location = htmlspecialchars_decode( $youtube_dl_location );

    // Variables
    $youtube_dir_path  = bof()->file->mkdir( base_root . "/" . bof()->object->core_setting->get( "file_save_base_directory", "files" ) . "/tmp/youtube_dl_" . uniqid()  );
    $youtube_file_path = null;
    $proxy_string = $youtube_dl_proxy ? " --proxy {$youtube_dl_proxy} " : "";

    // Run youtube-dl and catch the output
    $command = "\"{$youtube_dl_location}\"" . $proxy_string . ' --write-auto-sub --skip-download -o "'.$youtube_dir_path.'sub" "https://www.youtube.com/watch?v=' . $youtube_id . '" 2>&1';
    bof()->general->exec( $command );
    
    foreach( scandir( $youtube_dir_path ) as $youtube_dir_ent ){
      if ( substr( $youtube_dir_ent, -4 ) == ".vtt" )
      $youtube_file_path = realpath( $youtube_dir_path . "/" . $youtube_dir_ent );
    }

    if ( empty( $youtube_file_path ) )
    throw new Exception("youtube_dl error: no vtt file found" );

    if ( !$simplify )
    return $youtube_file_path;

    $raw_lines = [];
    foreach( bof()->general->explode_by_line( file_get_contents( $youtube_file_path ) ) as $raw_line ){
    
      $raw_line = trim( $raw_line );
    
      if ( preg_match( "/-->/i", $raw_line ) )
      continue;

      if ( !in_array( $raw_line, $raw_lines, true ) )
      $raw_lines[] = strip_tags( $raw_line, "" );

    }

    return implode( ". ", $raw_lines );

  }
  public function download( $youtube_id, $args = [] ){

    $file_name = substr( md5( $youtube_id ), 0, 20 );
    $test = false;
    $youtube_dl_location = null;
    $convert_if_required = true;
    $returnCommand = false;
    $ftype = "bestaudio";
    extract( $args );

    // Get & Check setting
    $youtube_dl_location = $youtube_dl_location ? $youtube_dl_location : bof()->object->db_setting->get( "ut_youtubedl_path" );
    $youtube_dl_proxy = bof()->object->db_setting->get( "ut_youtubedl_proxy" );
    if ( !$youtube_dl_location  )
    throw new Exception("Invalid youtube_dl path");

    $youtube_dl_location = htmlspecialchars_decode( $youtube_dl_location );

    // Variables
    $random_file_name  = $file_name;
    $youtube_dir_path  = bof()->file->mkdir( base_root . "/" . bof()->object->core_setting->get( "file_save_base_directory", "files" ) . "/tmp/youtube_dl_" . uniqid()  );
    $youtube_file_path = null;
    $youtube_mp3_path  = null;
    $proxy_string = $youtube_dl_proxy ? " --proxy {$youtube_dl_proxy} " : "";

    // Run youtube-dl and catch the output
    $command = "\"{$youtube_dl_location}\"" . $proxy_string . ' -f '.$ftype.' "https://www.youtube.com/watch?v=' . $youtube_id . '" --output "' . $youtube_dir_path . '/' . $random_file_name . '.%(ext)s" ';
    if ( $returnCommand ) return $command;
    $oo = exec( $command, $o );

    // Get youtube_dl output. we don't know the extension so search all dir ents for the file
    foreach( scandir( $youtube_dir_path ) as $youtube_dir_ent ){
      if ( substr( $youtube_dir_ent, 0, strlen( $random_file_name ) ) == $random_file_name ){
        $youtube_file_path = realpath( $youtube_dir_path . "/" . $youtube_dir_ent );
      }
    }
    if ( empty( $youtube_file_path ) )
    throw new Exception("youtube_dl error: " . ( !empty( $stderr ) ? $stderr : "failed" ) );

    // If output is not mp3, convert it to mp3
    if ( substr( $youtube_file_path, -4 ) == ".mp3" ){

      $youtube_mp3_path = $youtube_file_path;

    } elseif ( $convert_if_required ) {

      $convert = bof()->ffmpeg->convert_to_mp3( $youtube_file_path, null, array(
        "dir" => $youtube_dir_path,
        "name" => $random_file_name,
        "ab" => null,
        "ca" => "mp3",
      ) );

      if ( $convert ){
        $youtube_mp3_path = $convert;
        unlink( $youtube_file_path );
      }

    } else {
      $youtube_mp3_path = $youtube_file_path;
    }

    if ( empty( $youtube_mp3_path ) )
    throw new Exception("FFmpeg failed: no MP3 files found");

    if ( $test )
    unlink( $youtube_mp3_path );

    return $youtube_mp3_path;

  }

  protected function _req( $endpoint, $args=[] ){

    $params = null;
    extract( $args );
    $params[ "key" ] = $this->key;

    $url = $this->base . $endpoint . ( $params ? "?" . http_build_query( $params ) : "" );
    $curl = bof()->curl->exe( array(
      "url" => $url,
      "cache_load" => true,
      "cache" => true
    ) );

    if ( empty( $curl["data"] ) )
    return [ false, "YoutubeAPI: cURL Failed" ];
    return [ true, $curl["data"] ];

  }

}

?>
