<?php

if ( !defined( "bof_root" ) ) die;

class soundcloud_scrapper {

	public function setup(){

		bof()->listen( "soundcloud", "find_track_replace", function( $data ){
			$exe = bof()->soundcloud_scrapper->find_track( $data[0] );
			return $exe;
		} );

		bof()->listen( "soundcloud", "get_track_replace", function( $data ){
			$exe = bof()->soundcloud_scrapper->get_track( $data[0] );
			return $exe;
		} );

	}

	public function find_track( $data ){

		$title = null;
		$sub_title = null;
		$duration = null;
		extract( $data );

		$_query = ( $sub_title ? $sub_title . " - " : "" ) . "{$title}" ;

		try {
			$exe = $this->__req( array(
				"endpoint" => "search/tracks",
				"params" => array(
					"q" => $_query,
					"variant_ids" => "",
					"facet" => "genre",
					"limit" => 20,
					"offset" => 0,
					"linked_partitioning" => 1,
					"app_locale" => "en"
				),
				"include_user_id" => true
			) );
		} catch( bofException $err ){
			return [ false, $err->getMessage() ];
		}

		return !empty( $exe["collection"][0]["id"] ) ? [ true, $exe["collection"][0]["id"] ] : [ false, "failed" ];

	}
	public function get_track( $id ){

		try {
			$exe = $this->__req( array(
				"endpoint" => "tracks",
				"params" => array(
					"ids" => $id,
				)
			) );
		} catch( bofException $err ){
			return [ false, $err->getMessage() ];
		}

		return !empty( $exe[0] ) ? [ true, $exe[0] ] : [ false, "failed" ];

	}

	protected function fetch_app_keys( $force=false ){

		$last_check = bof()->object->db_setting->get( "scs_key_time", null, false, true );
		$keys = bof()->object->db_setting->get( "scs_keys", null, false, true );

		if ( $keys && $last_check && !$force ? time() - $last_check < 36*60*60 : false ){
			return json_decode( $keys, true );
		}

		$keys = $this->extract_app_keys();

		bof()->object->db_setting->set( "scs_keys", json_encode( $keys ) );
		bof()->object->db_setting->set( "scs_key_time", time() );

		return $keys;

	}
	protected function extract_app_keys(){

		$getIndex = bof()->curl->exe( array(
			"url" => "https://soundcloud.com/",
			"agent" => "chrome",
			"cache" => true,
			"cache_load" => true,
		) );

		if ( !$getIndex ? true : $getIndex["http_code"] != 200 || empty( $getIndex["body"] ) )
		throw new bofException( "indexRequestFailed" );

		$index = $getIndex["body"];

		preg_match( "/{\"hydratable\":\"anonymousId\",\"data\":\"(.*?)\"}/i", $index, $m );
		if ( empty( $m ) || !is_array( $m ) ? true : empty( $m[1] ) )
		throw new bofException( "userIdExtractionFailed" );
		$user_id = $m[1];

		preg_match( "/window.__sc_version=\"(.*?)\"/i", $index, $m );
		if ( empty( $m ) || !is_array( $m ) ? true : empty( $m[1] ) || !ctype_digit( $m[1] ) )
		throw new bofException( "appVersionExtractionFailed" );
		$app_version = $m[1];

		preg_match_all( "/\"http(.*?).js\"/i", $index, $ms );
		if ( empty( $ms ) || empty( $ms[1] ) )
		throw new bofException( "JavascriptFileListExtractionFailed" );

		foreach( $ms[0] as $jsLink ){

			$jsLink = substr( $jsLink, 1, -1 );
			$getJs = bof()->curl->exe( array(
				"url" => $jsLink,
				"agent" => "chrome",
			) );

			if ( $getJs["http_code"] == 200 && !empty( $getJs["body"] ) ){
				$jsContent = $getJs["body"];
				if ( preg_match( "/(\"client_id=(.*?)\")/i", $jsContent, $m ) ){
					$client_id = end( $m );
					break;
				}
			}

		}

		if ( empty( $client_id ) )
		throw new bofException( "clientIdExtractionFailed" );

		return array(
			"user_id" => $user_id,
			"client_id" => $client_id,
			"app_version" => $app_version
		);

	}

	protected function __req( $args, $retrying=false ){

		$endpoint = false;
		$include_user_id = false;
		$params = [];
		extract( $args );

		$keys = $this->fetch_app_keys();
		if ( !$keys )
		return false;

		if ( !$include_user_id )
		unset( $keys["user_id"] );

		$params = array_merge(
			$params,
			$keys,
			array(
				"app_locale" => "en"
			)
		);

		if ( !$endpoint )
		return false;

		$exe = bof()->curl->exe( array(
			"url" => "https://api-v2.soundcloud.com/" . $endpoint . ( $params ? "?" . http_build_query( $params ) : "" ),
			"referer" => "https://soundcloud.com/",
			"cache" => true,
			"cache_load" => true
		) );

		if ( !$retrying && $exe["http_code"] == "401" ){
			$this->fetch_app_keys( true );
			return $this->__req( $args, true );
		}

		if ( empty( $exe["data"] ) )
		return false;

		return $exe["data"];

	}

}

?>
