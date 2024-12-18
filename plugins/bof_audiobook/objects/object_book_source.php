<?php

if ( !defined( "bof_root" ) ) die;

class object_a_book_source extends bof_type_object_child {

  public $sample_parent = "source";
  public function child(){
    return (object) array(
      "bof_admin_edit_url" => "audiobook_book_source",
      "bof_admin_list_url" => "audiobook_book_sources",
      "types" => [ "audio", "video", "youtube" ]
    );
  }

  // BusyOwlFramework handshake
  public function bof(){
    return $this->_parent->bof(
      $this->_bof_this,
      array(
        "name" => "a_book_source",
        "label" => "Audiobook Source",
        "db_table_name" => "_c_a_books_sources",
      )
    );
  }
  public function columns(){

    return $this->_parent->columns(
      $this->_bof_this,
      array(
        "target_id" => array(
          "label" => "Target",
          "bofInput" => array(
            "object",
            array(
              "type" => "a_book_chapter"
            )
          ),
          "bofAdmin" => array(
            "object" => array(
              "required" => true
            ),
            "list" => array(
              "type" => "simple",
              "renderer" => function( $displayItem, $item, $displayData ){
                $book = bof()->object->a_book->sid( $item["bof_dir_target"]["book_id"] );
                $displayData["data"] = $item["bof_dir_target"]["title"];
                $displayData["data"] .= "<span class='sub'>book: <b>";
                $displayData["data"] .= $book["title"];
                $displayData["data"] .= "</b></span>";
                $displayData["data"] .= "<span class='sub'>";
                $displayData["data"] .= ucfirst( $item["_title"] );
                $displayData["data"] .= "</span>";
                return $displayData;
              },
            ),
            "filters" => array(
              "col_book" => array(
                "title" => "Book",
                "input" => array(
                  "name" => "col_book",
                ),
                "bofInput" => array(
                  "object",
                  array(
                    "type" => "a_book",
                    "multi" => true,
                    "autoload" => false
                  )
                )
              ),
              "col_book_chapter" => array(
                "title" => "Book Chapter",
                "input" => array(
                  "name" => "col_book_chapter",
                ),
                "bofInput" => array(
                  "object",
                  array(
                    "type" => "a_book_chapter",
                    "multi" => true,
                    "autoload" => false
                  )
                )
              ),
            )
          ),
          "relations" => array(
            "target" => array(
              "exec" => array(
                "type" => "direct",
                "parent_object" => "a_book_chapter",
                "child_object" => "a_book_source",
                "child_object_selector_column" => "target_id",
                "delete_child_too" => true,
                "limit" => 1
              )
            )
          ),
          "selectors" => array(
            "target_id" => [ "target_id", "=" ],
            "book_chapter_id" => [ "target_id", "=" ],
            "col_book_chapter" => [ "target_id", "by_column" ],
            "col_book" => function( $val ){
              if ( !$val ) return;
              $_val = is_array( $val ) ? implode( ",", $val ) : $val;
              if ( !bof()->nest->validate( $_val, "int_imploded" ) ) return;
              return [ "target_id", "IN", "SELECT ID FROM _c_a_books_chapters WHERE book_id IN ( {$_val} ) ", true ];
            },
            "col_target" => [ "target_id", "by_column" ],
          )
        ),
      )
    );

  }
  public function create( $whereArray, $insertArray, $updateArray ){

    if ( ( !empty( $insertArray["duration"] ) || !empty( $updateArray["duration"] ) ) &&
    ( !empty( $insertArray["target_id"] ) || !empty( $updateArray["target_id"] ) ) ){
      $duration = !empty( $insertArray["duration"] ) ? $insertArray["duration"] : $updateArray["duration"];
      $target_id = !empty( $insertArray["target_id"] ) ? $insertArray["target_id"] : $updateArray["target_id"];
      bof()->object->a_book_chapter->update(
        array(
          "ID" => $target_id
        ),
        array(
          "duration" => $duration
        )
      );
    }

    return $this->_parent->create(
      $this->_bof_this,
      $whereArray,
      $insertArray,
      $updateArray
    );

  }
  public function update( $whereArray, $updateArray ){

    if ( !empty( $updateArray["duration"] ) ){
      $_items = $this->_bof_this->select( $whereArray, [ "limit" => false, "single" => false ] );
      $_items_ids = [];
      if ( $_items ){
        foreach( $_items as $_item ){

          if ( in_array( $_item["target_id"], $_items_ids, true ) ) continue;
          $_items_ids[] = $_item["target_id"];

          bof()->object->a_book_chapter->update(
            array(
              "ID" => $_item["target_id"]
            ),
            array(
              "duration" => $updateArray["duration"]
            )
          );

        }
      }
    }
    
    return bof()->object->_update( $this->_bof_this, $whereArray, $updateArray );

  }

  public function fetch_file_data( $target_id ){

    $book_chapter = bof()->object->a_book_chapter->select(
      array(
        "ID" => $target_id
      ),
      array(
        "_eq" => array(
          "book" => array(
            "_eq" => array(
              "writers" => []
            )
          )
        )
      )
    );

    $book = $book_chapter["bof_dir_book"];

    return array(
      "premium" => $book["premium"],
      "new_name" => $book["bof_rel_writers"][0]["name"] . " - " . $book["title"],
      "new_id3_tags" => array(
        "title"        => [ $book["title"] ],
        "artist"       => [ $book["bof_rel_writers"][0]["name"] ],
        // "genre"        => [ $track["bof_rel_genres"] ],
        "year"         => !empty( $book["time_publish"] ) ? [ substr( $book["time_publish"][0], 0, 4 ) ] : null,
      )
    );

  }

}

?>
