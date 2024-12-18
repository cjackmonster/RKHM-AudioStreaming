<?php

if ( !defined( "bof_root" ) ) die;

class object_m_genre extends bof_type_object_child {

  public $sample_parent = "tag";
  public function child(){
    return (object) array(
      "bof_admin_edit_url" => "music_genre",
      "bof_admin_list_url" => "music_genres",
      "bof_client_single_url" => "music/genre",
      "bof_client_list_url" => "music/genres",
      "relations" => array(
        "m_album" => array(
          "stat" => "albums",
          "hub_type" => "genre",
          "plural" => "genres",
          "bof_admin_list_url" => "music_albums",
          "label_hook" => "albums",
          "label" => "albums"
        ),
        "m_artist" => array(
          "stat" => "artists",
          "hub_type" => "genre",
          "plural" => "genres",
          "bof_admin_list_url" => "music_artists",
          "label_hook" => "artists",
          "label" => "artists"
        ),
        "m_track" => array(
          "stat" => "tracks",
          "hub_type" => "genre",
          "plural" => "genres",
          "bof_admin_list_url" => "music_tracks",
          "label_hook" => "tracks",
          "label" => "tracks"
        ),
      ),
      "hiearchy" => array( true ),
    );
  }

  // BusyOwlFramework handshake
  public function bof(){
    return $this->_parent->bof(
      $this->_bof_this,
      array(
        "name" => "m_genre",
        "label" => "Music Genre",
        "db_table_name" => "_c_m_genres",
      )
    );
  }
  public function selectors(){
    return $this->_parent->selectors(
      $this->_bof_this,
      array(
        "type" => function( $val ){
          if ( $val == "master" || $val == "parent" )
          return [ "parent_id", null, null, true ];
          return [ "parent_id", "NOT", null, true ];
        }
      )
    );
  }
  public function bof_admin(){
    return $this->_parent->bof_admin( $this->_bof_this );
  }
  public function clean_search_terms( $item ){

    $o = array(
      $item["name"] => 1,
    );

    return $o;

  }


}

?>
