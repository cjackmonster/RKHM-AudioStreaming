<?php

if ( !defined( "bof_root" ) ) die;

class object_a_book_chapter extends bof_type_object {

  // BusyOwlFramework handshake
  public function bof(){
    return array(
      "name" => "a_book_chapter",
      "label" => "Audio book_chapter",
      "icon" => "library_book_chapters",
      "db_table_name" => "_c_a_books_chapters",
      "client_single_disable_placeholder" => true
    );
  }
  public function columns(){
    return array(

      "book_id" => array(
        "label" => "Book",
        "bofInput" => array(
          "object",
          array(
            "type" => "a_book"
          )
        ),
        "bofAdmin" => array(
          "list" => array(
            "type" => "simple",
            "renderer" => function( $displayItem, $item, $displayData ){
              $displayData["data"] = !empty( $item["bof_dir_book"]["title"] ) ? $item["bof_dir_book"]["title"] : "?";
              return $displayData;
            },
          ),
          "object" => array(
            "required" => true
          ),
          "filters" => array(
            "col_book" => array(
              "title" => "Book(s)",
              "bofInput" => array(
                "object",
                array(
                  "type" => "a_book",
                  "multi" => true,
                )
              )
            ),
          ),
        ),
        "selectors" => array(
          "book_id" => [ "book_id", "=" ],
          "col_book" => [ "book_id", "by_column" ]
        ),
        "relations" => array(
          "book" => array(
            "exec" => array(
              "type" => "direct",
              "parent_object" => "a_book",
              "parent_object_stats_column" => "s_chapters",
              "child_object" => "a_book_chapter",
              "child_object_selector_column" => "book_id",
              "delete_child_too" => true,
              "limit" => 1,
            )
          )
        )
      ),
      "book_index" => array(
        "public" => true,
        "label" => "Chapter # in book",
        "input" => array(
          "type" => "digit",
        ),
        "validator" => array(
          "int",
          array(
            "empty()",
            "forceZero" => true,
            "min" => 0,
          ),
        ),
        "bofAdmin" => array(
          "object" => [],
          "list" => array(
            "type" => "simple",
          ),
        ),
      ),
      "title" => array(
        "public" => true,
        "label" => "Title",
        "input" => array(
          "type" => "text"
        ),
        "validator" => array(
          "string",
          array(
            "strip_emoji" => false,
          ),
        ),
        "bofAdmin" => array(
          "sortable" => true,
          "list" => array(
            "type" => "simple",
            "class" => "title",
            "renderer" => function( $displayItem, $item, $displayData ){
              if ( !empty( $item["bof_file_cover"] ) )
              $displayData["image_preview"] = $item["bof_file_cover"]["image_thumb"];
              if ( !empty( $item["bof_rel_writers"] ) )
              $displayData["data"] .= "<span class='sub'>{$item["bof_rel_writers"][0]["name"]}</span>";
              return $displayData;
            }
          ),
          "object" => array(
            "type" => "text",
            "required" => true,
            "seo_slug_source" => true
          )
        ),
      ),
      "duration" => array(
        "public" => true,
        "label" => "Duration",
        "input" => array(
          "type" => "digit"
        ),
        "validator" => array(
          "int",
          array(
            "empty()",
            "min" => 0,
            "forceZero" => true
          )
        ),
        "bofAdmin" => array(
          "object" => [],
          "list" => array(
            "type" => "simple"
          )
        )
      ),

    );
  }
  public function stats_columns(){
    return array(
      "plays",
      "plays_unique",
    );
  }
  public function bof_columns(){
    return array(
      "ID",
      "hash",
      "time_add",
      "translations" => array(
        "title",
      ),
      "price" => array(
        "parent" => "book_id",
        "parent_name" => "book"
      ),
    );
  }
  public function selectors(){
    return array(
      "query" => [ "title", "LIKE%lower" ],
    );
  }
  public function relations(){
    return array(
      "sources" => array(
        "exec" => array(
          "type" => "direct",
          "parent_object" => "a_book_chapter",
          "child_object" => "a_book_source",
          "child_object_selector_column" => "target_id",
          "delete_child_too" => true,
          "limit" => 100
        ),
      ),
    );
  }
  public function bof_admin(){
    return array(
      "config" => array(
        "search" => false,
        "create" => true,
        "edit" => true,
        "delete" => true,
        "pagination" => true,
        "edit_page_url" => "audiobook_book_chapter",
        "list_page_url" => "audiobook_book_chapters",
        "multi" => array(
          "select" => true,
          "delete" => true,
          "edit"   => false,
        ),
      ),
      "filters" => array(),
      "list" => array(
        "title" => null,
        "book_index" => null,
        "book_id" => null,
      ),
      "object" => array(
      ),
      "object_groups" => array(
        [ "price", "Price" ],
      ),
      "buttons_renderer" => function( $item, $buttons ){

        $buttons["list_sources"] = array(
          "label" => "List sources",
          "link" => "audiobook_book_sources?col_book_chapter={$item["ID"]}"
        );

        $buttons["add_source"] = array(
          "label" => "Add source",
          "link" => "audiobook_book_source/__new?target_id={$item["ID"]}"
        );

        return $buttons;

      },
      "object_item_renderer" => function( $item_name, &$item_data, $request ){

        if ( $item_name == "book_id" && empty( $item_data["input"]["value"] ) && $request["type"] == "new" ){
          $givenID = bof()->nest->user_input( "get", "book_id", "int" );
          if ( $givenID ) $item_data["input"]["value"] = $givenID;
        }

      },
    );
  }
  public function bof_client(){
    return array(
      "buttons" => array(
        "play" => true,
        "source" => true,
        "download" => true
      )
    );
  }

  // BusyOwlFramework helpers
  public function select( $whereArgs=[], $selectArgs=[] ){

    $search = false;
    $listing = false;
    $muse_infinite_related = false;
    $muse_source = false;
    $_eq = [];
    extract( $selectArgs );


    if ( $listing ){
      $_eq[ "book" ] = [];
    }

    $selectArgs["_eq"] = $_eq;
    return bof()->object->_select( $this, $whereArgs, $selectArgs );

  }
  public function create( $whereArray, $insertArray, $updateArray=false, $returnDetails=false, $exeRelations=true ){

    $db_id = bof()->object->_create( $this, $whereArray, $insertArray, $updateArray, $returnDetails, $exeRelations );

    if ( $db_id && !empty( $insertArray["sources"] ) ? is_array( $insertArray["sources"] ) : false ){

      foreach ( $insertArray["sources"] as $source ){
        if ( !empty( $source["type"] ) && !empty( $source["data"] ) ){
          $source["hash"] = md5( $source["type"] . $source["data"] );
          bof()->object->a_book_source->create(
            array(
              "hash" => $source["hash"]
            ),
            array_merge(
              $source,
              array(
                "target_id" => $db_id,
              )
            ),
            array()
          );
        }
      }

    }

    return $db_id;

  }
  public function insert( $setArray ){

    $setArray["hash"] = !empty( $setArray["hash"] ) ? $setArray["hash"] : $this->_bof_this->get_free_hash();
    return bof()->object->_insert( $this, $setArray );

  }
  public function clean( $item, $args ){

    $search = false;
    $muse_source = false;
    $_eq = [];
    extract( $args );

    $item["price"] = 0;

    $item["duration_hr"] = $item["duration"] ? bof()->general->duration_hr( $item["duration"] )["string"] : false;

    if ( $muse_source )
    $item["sources"] = array(
      $item["hash"] => array(
        "ot" => "a_book_chapter",
        "sources" => $item["bof_dir_sources"],
        "data" => $this->_bof_this->get_sources_data( $item ),
        "raw" => $item
      )
    );

    return $item;

  }
  public function clean_as_widget( $item, $args=[] ){

    $clean_for_show = false;
    extract( $args );

    $book = bof()->object->a_book->sid( $item["book_id"], array(
      "_eq" => array(
        "cover" => []
      )
    ) );

    return array(
      "title" => $book["title"] . " - " . $item["title"],
      "sub_data" => null,
      "sub_link" => null,
      "cover" => !empty( $book["bof_file_cover"]["image_strings"] ) ? $book["bof_file_cover"]["image_thumb"] : null,
      "ot" => "a_book_chapter",
      "raw" => $item
    );

  }

  public function get_sources_data( $item, $args=[] ){

    $book = bof()->object->a_book->select(
      array(
        "ID" => $item["book_id"]
      ),
      array(
        "_eq" => array(
          "cover" => [],
          "writers" => []
        )
      )
    );

    $data = array(
      "ID" => null,
      "cover" => !empty( $book["bof_file_cover"]["image_strings"] ) ? $book["bof_file_cover"]["image_thumb"] : null,
      "back" => !empty( $book["bof_file_cover"]["image_strings"] ) ? reset( $book["bof_file_cover"]["image_strings"]["_raw"] ) : null,
      "title" =>  $item["title"],
      "link" => $book["url"],
      "sub_title" =>$book["title"],
      "sub_link" =>  $book["url"],
      "duration" => !empty( $item["duration"] ) ? $item["duration"] : false,
      "buttons" => bof()->bofClient->__parse_item_buttons( "a_book", bof()->object->__get( "a_book" ), $book, bof()->object->a_book->bof_client()["buttons"] ),
      "ot" => "a_book",
      "hash" => $book["hash"],
      "lyrics" => false,
      "preview" => array(
        "type" => "image",
        "image" => !empty( $book["bof_file_cover"]["image_strings"] ) ? $book["bof_file_cover"]["image_strings"][1]["html"] : null
      )
    );

    return $data;

  }
  public function get_sources( $item, $args=[] ){

    $sources = [];
    if ( !empty( $item["bof_dir_sources"] ) ){

      foreach( $item["bof_dir_sources"] as $_source ){

        $sources[ $_source["hash"] ] = array(
          "data" => array(
            "ID" => $_source["hash"],
            "cover" => !empty( $item["bof_file_cover"] ) ? $item["bof_file_cover"]["image_thumb"] : null,
            "title" => !empty( $_source["data_decoded"]["title"] ) ? $_source["data_decoded"]["title"] : $item["title"] ,
            "link" => $item["url"],
            "sub_title" => $item["title"],
            "sub_link" => $item["url"],
            "duration" => $_source["duration"],
            "buttons" => bof()->bofClient->__parse_item_buttons( "a_book_chapter", $this->_bof_this, $item, $this->_bof_this->bof_client()["buttons"], false, "source" ),
            "ot" => "a_book_chapter",
            "hash" => $item["hash"],
            "preview" => array(
              "type" => "image",
              "image" => !empty( $item["bof_file_cover"] ) ? $item["bof_file_cover"]["image_strings"][1]["html"] : null
            )
          ),
          "source" => array(
            "type" => array(
              "audio",
              array(
                "type" => "free",
                "live" => true,
                "address" => $_source["data_decoded"]["file"]
              )
            ),
          )
        );

      }

    }

    return $sources;

  }
  public function get_infinite_related( $item, $args ){

    $per_item = 12;
    $queue = null;
    $infinite = null;
    $related = null;
    $exclude = array();
    extract( $args );

    if ( !empty( $queue["by_object"]["a_book_chapter"] ) ){
      foreach( $queue["by_object"]["a_book_chapter"] as $_book_chapter ){
        $exclude["hash"][] = $_book_chapter;
      }
    }

    if ( !empty( $infinite["by_object"]["a_book_chapter"] ) ){
      foreach( $infinite["by_object"]["a_book_chapter"] as $_book_chapter ){
        $exclude["hash"][] = $_book_chapter;
      }
    }

    if ( !empty( $related ) ){
      foreach( $related as $_r ){
        $exclude["hash"][] = $_r["raw"]["hash"];
      }
    }

    $genreIDS = [];
    foreach( $item["bof_rel_genres"] as $_genre )
    $genreIDS[] = $_genre["ID"];

    $_whereArray = array(
      "rel_genre" => $genreIDS
    );

    if ( !empty( $exclude["hash"] ) ){
      $_whereArray[] = array(
        "hash",
        "NOT IN",
        "'".(implode("','",$exclude["hash"]))."'",
        true
      );
    }

    $related_items = $this->_bof_this->select(
      $_whereArray,
      array(
        "order_by" => " ",
        "order" => "RAND()",
        "limit" => $per_item,
        "single" => false,
        "as_widget" => true,
        "thumb_as_cover" => true,
        "_eq" => array(
          "cover" => [],
          "writer" => []
        ),
        "cache_load_rt" => false
      )
    );

    return $related_items;

  }

  public function check_role_access( $item, $premium_access ){

    $a_writer = null;
    $a_genre = null;
    $a_tag = null;
    extract( $premium_access );

    if ( $a_writer ){

      $writers = bof()->object->a_writer->select(
        array(
          "a_book_writers" => $item["book_id"]
        ),
        array(
          "limit" => 20,
          "single" => false,
          "clean" => false
        )
      );

      if ( $writers ){
        foreach( $writers as $writer ){
          if ( in_array( $writer["ID"], $a_writer ) )
          return true;
        }
      }

    }
    if ( $a_tag ){

      $get_item_tags = bof()->object->a_tag->select(
        array(
          "a_book_tags" => $item["book_id"]
        ),
        array(
          "limit" => false,
          "single" => false
        )
      );

      if ( $get_item_tags ){
        foreach( $get_item_tags as $item_tag ){
          if ( in_array( $item_tag["ID"], $a_tag ) )
          return true;
        }
      }

    }
    if ( $a_genre ){

      $get_item_genres = bof()->object->a_genre->select(
        array(
          "a_book_genres" => $item["book_id"]
        ),
        array(
          "limit" => false,
          "single" => false
        )
      );

      if ( $get_item_genres ){
        foreach( $get_item_genres as $item_genre ){
          if ( in_array( $item_genre["ID"], $a_genre ) )
          return true;
        }
      }

    }

    return false;

  }

}

?>
