<?php

if ( !defined( "bof_root" ) ) die;

class object_a_narrator extends bof_type_object {

  // BusyOwlFramework handshake
  public function bof(){
    return array(
      "name" => "a_narrator",
      "label" => "Audiobook Narrator",
      "icon" => "record_voice_over",
      "db_table_name" => "_c_a_narrators",
      "db_rel_table_name" => "_c_a_narrators_relations",
      "db_rel_table_col_name" => "narrator_id",
      "widgetable" => true,
      "browsable" => true,
      "client_single_disable_placeholder" => true
    );
  }
  public function columns(){
    return array(

      "name" => array(
        "public" => true,
        "label" => "Name",
        "validator" => array(
          "string",
          array(
            "strip_emoji" => false,
            "only_utf8" => false
          ),
        ),
        "input" => array(
          "type" => "text",
        ),
        "bofAdmin" => array(
          "sortable" => true,
          "list" => array(
            "type" => "simple",
            "class" => "title",
            "renderer" => function( $displayItem, $item, $displayData ){

              if ( !empty( $item["bof_file_cover"] ) )
              $displayData["image_preview"] = $item["bof_file_cover"]["image_thumb"];

              $displayData["data"] = $item["name_styled"];

              return $displayData;

            }
          ),
          "object" => array(
            "required" => true,
            "seo_slug_source" => true
          )
        ),
      ),
      "time_play" => array(
        "public" => true,
        "validator" => array(
          "timestamp",
          array(
            "empty()"
          ),
        ),
      ),
      "time_release" => array(
        "public" => true,
        "label" => "Last Release",
        "validator" => array(
          "timestamp",
          array(
            "empty()"
          ),
        ),
        "input" => array(
          "type" => "time"
        ),
        "bofAdmin" => array(
          "sortable" => true,
          "object" => []
        ),
      ),

    );
  }
  public function stats_columns(){
    return array(
      "subscribers",
    );
  }
  public function bof_columns(){
    return array(
      "ID",
      "hash",
      "code" => array(
        "from" => array(
          "name"
        ),
        "childs" => array(
          "m_album"
        )
      ),
      "time_add",
      "seo",
      "social_links",
      "biography",
      "cover",
      "translations" => array(
        "name"
      ),
    );
  }
  public function selectors(){
    return array(
      "query" => [ "name", "LIKE%lower" ],
      "a_book_narrators" => [ "ID", "related_to_parent", "rel_parent" => "a_book", "hub_type" => "narrator" ],
      "a_narrator_sim_narrators" => [ "ID", "related_to_parent", "rel_parent" => "a_narrator", "hub_type" => "sim" ],
    );
  }
  public function relations(){
    return array(
      "genres" => array(

        "bofAdmin" => array(
          "objects" => array(

            "a_narrator_genres" => array(
              "label" => "Genre(s)",
              "column_name" => "genre_ids",
              "bofInput" => array(
                "object",
                array(
                  "type" => "a_genre",
                  "multi" => true
                ),
              ),
            ),

          ),
          "filters" => array(
            "rel_genre" => array(
              "title" => "Genre(s)",
              "bofInput" => array(
                "object",
                array(
                  "type" => "a_genre",
                  "multi" => true,
                  "autoload" => false,
                )
              )
            )
          ),

        ),

        "selectors" => array(
          "rel_genre" => [ "ID", "parent_with_relations", "rel_parent" => "a_narrator", "hub_type" => "genre" ],
        ),

        "exec" => array(
          "type" => "hub",
          "hub_type" => "genre",
          "parent_object" => "a_narrator",
          "child_object" => "a_genre",
          "child_object_stats_column" => "s_narrators"
        ),

      ),
      "tags" => array(

        "bofAdmin" => array(

          "objects" => array(

            "a_narrator_tags" => array(
              "label" => "Tag(s)",
              "column_name" => "tag_ids",
              "bofInput" => array(
                "object",
                array(
                  "type" => "a_tag",
                  "multi" => true
                ),
              ),
            ),


          ),
          "filters" => array(
            "rel_tag" => array(
              "title" => "Tag(s)",
              "bofInput" => array(
                "object",
                array(
                  "type" => "a_tag",
                  "multi" => true,
                  "autoload" => false,
                )
              ),
              "input" => array(
                "name" => "rel_tag"
              )
            )
          ),

        ),

        "selectors" => array(
          "rel_tag" => [ "ID", "parent_with_relations", "rel_parent" => "a_narrator", "hub_type" => "tag" ],
        ),

        "exec" => array(
          "type" => "hub",
          "hub_type" => "tag",
          "parent_object" => "a_narrator",
          "child_object" => "a_tag",
          "child_object_stats_column" => "s_narrators"
        ),

      ),
      "languages" => array(

        "bofAdmin" => array(

          "objects" => array(

            "a_narrator_languages" => array(
              "label" => "Language(s)",
              "column_name" => "language_ids",
              "bofInput" => array(
                "object",
                array(
                  "type" => "a_language",
                  "multi" => true
                ),
              ),
            ),

          ),
          "lists" => array(

            "languages" => array(
              "label" => "Languages",
              "type" => "simple",
              "class" => "tags",
              "renderer" => function( $displayItem, $item, $displayData ){
                $displayData["data"] = "";
                if ( !empty( $item["bof_rel_languages"] ) ){
                  foreach( $item["bof_rel_languages"] as $_language )
                  $displayData["data"] .= "<span>{$_language["name"]}</span>";
                }
                return $displayData;
              },
            ),

          ),
          "filters" => array(
            "rel_language" => array(
              "title" => "Language(s)",
              "bofInput" => array(
                "object",
                array(
                  "type" => "a_language",
                  "multi" => true,
                  "autoload" => false,
                )
              ),
              "input" => array(
                "name" => "rel_language"
              )
            )
          ),

        ),

        "selectors" => array(
          "rel_language" => [ "ID", "parent_with_relations", "rel_parent" => "a_narrator", "hub_type" => "language" ],
        ),

        "exec" => array(
          "type" => "hub",
          "hub_type" => "language",
          "parent_object" => "a_narrator",
          "child_object" => "a_language",
          "child_object_stats_column" => "s_narrators"
        ),

      ),
      "sim_narrators" => array(

        "bofAdmin" => array(
          "objects" => array(

            "a_narrator_sim_narrators" => array(
              "label" => "Similar Narrator(s)",
              "column_name" => "sim_ids",
              "bofInput" => array(
                "object",
                array(
                  "type" => "a_narrator",
                  "multi" => true
                ),
              ),
            ),

          ),
        ),

        "exec" => array(
          "type" => "hub",
          "hub_type" => "sim",
          "parent_object" => "a_narrator",
          "child_object" => "a_narrator",
        ),

      ),
      "books" => array(
        "exec" => array(
          "type" => "hub",
          "hub_type" => "narrator",
          "parent_object" => "a_book",
          "parent_object_selector_column" => "narrator_ids",
          "child_object" => "a_narrator",
          "limit" => 100
        ),
      ),
      "book_sources" => array(
        "exec" => array(
          "type" => "direct",
          "parent_object" => "a_narrator",
          "child_object" => "a_book_source",
          "child_object_selector_column" => "narrator_id"
        )
      ),
      "subscribers" => array(
        "exec" => array(
          "type" => "direct",
          "parent_object" => "a_narrator",
          "parent_object_stats_column" => "s_subscribers",
          "child_object" => "ugc_property",
          "child_object_selector_column" => "object_id",
          "child_object_where_array" => array(
            "type" => "subscribe",
            [ "object_name", "=", "a_narrator" ]
          ),
          "delete_child_too" => true
        ),
      ),
    );
  }
  public function bof_admin(){
    return array(
      "config" => array(
        "search" => true,
        "create" => true,
        "edit" => true,
        "delete" => true,
        "pagination" => true,
        "edit_page_url" => "audiobook_narrator",
        "list_page_url" => "audiobook_narrators",
        "multi" => array(
          "select" => true,
          "delete" => true,
          "edit"   => true
        )
      ),
      "object_groups" => array(),
      "list" => array(
        "name" => null,
        "languages" => null,
        "stats" => array(
          "type" => "simple",
          "class" => "details",
          "label" => "Stats",
          "renderer" => function( $displayItem, $item, $displayData ){
            $displayData["data"] = "<ul>";
            $displayData["data"] .= "<li><b>Books</b>" . number_format($item["s_books"]) . "</li>";
            $displayData["data"] .= "<li><b>Plays</b>" . 0 . "</li>";
            $displayData["data"] .= "</ul>";
            return $displayData;
          },
        ),
      ),
      "object" => array(
        "name" => null,
        "cover_id" => null,
        "a_narrator_genres" => null,
        "a_narrator_tags" => null,
        "a_narrator_sim_narrators" => null
      ),
      "buttons_renderer" => function( $item, $buttons ){

        return $buttons;

      },
    );
  }
  public function bof_client(){
    return array(
      "public_browse" => true,
      "single_url_prefix" => "audiobook/narrator",
      "list_url" => "audiobook_narrators",
      "buttons" => array(
        "link" => true,
        "like" => false,
        "share" => true,
        "purchase" => false,
        "play" => true,
        "subscribe" => true,
        "playlist" => false,
        "biography" => true,
        "social_links" => true,
        "extra_after" => array(
          "visit_tags" => array(
            "dynamic" => true,
            "func" => function( $button, $item, $args ){

              $button = null;
              $tags = !empty( $item["bof_rel_tags"] ) ? $item["bof_rel_tags"] : bof()->object->a_tag->select(["a_narrator_tags"=>$item["ID"]],["limit"=>20]);
              if ( $tags ){
                $button = array(
                  "hook" => "open_tag",
                  "icon" => "open-in-app",
                  "childs" => array()
                );
                foreach( $tags as $tag ){
                  $button["childs"][] = array(
                    "icon" => "open-in-app",
                    "title" => $tag["name"],
                    "url" => $tag["url"]
                  );
                }
              }

              return $button;

            }
          ),
          "visit_genres" => array(
            "dynamic" => true,
            "func" => function( $button, $item, $args ){

              $button = null;
              $cats = !empty( $item["bof_rel_genres"] ) ? $item["bof_rel_genres"] : bof()->object->a_genre->select(["a_narrator_genres"=>$item["ID"]],["limit"=>20]);
              if ( $cats ){
                $button = array(
                  "hook" => "open_genre",
                  "icon" => "open-in-app",
                  "childs" => array()
                );
                foreach( $cats as $cat ){
                  $button["childs"][] = array(
                    "icon" => "open-in-app",
                    "title" => $cat["name"],
                    "url" => $cat["url"]
                  );
                }
              }

              return $button;

            }
          ),
        )
      )
    );
  }

  // BusyOwlFramework helpers
  public function select( $whereArgs=[], $selectArgs=[] ){

    $search = false;
    $listing = false;
    $client_single = false;
    $as_widget = false;
    $_eq = [];
    extract( $selectArgs );

    if ( $client_single ){
      $_eq[ "cover" ] = [];
      $_eq[ "genres" ] = [ "public" => true ];
      $_eq[ "tags" ] = [ "public" => true ];
      $_eq[ "languages" ] = [ "public" => true ];
    }

    if  ( $as_widget ){
      $_eq[ "cover" ] = [];
    }

    if ( $search || $listing ){
      $_eq["cover"] = [];
    }
    if ( $listing ){
      // $_eq["albums_stats"] = true;
      // $_eq["tracks_stats"] = true;
      $_eq["languages"] = array(
        "limit" => 3
      );
    }

    $selectArgs[ "_eq" ] = $_eq;
    return bof()->object->_select( $this, $whereArgs, $selectArgs );

  }
  public function create( $whereArray, $insertArray, $updateArray=false ){

    $create_data = bof()->object->_create( $this, $whereArray, $insertArray, $updateArray, true );
    $db_id = $create_data["ID"];

    if ( $db_id && !empty( $insertArray["genre_string_array"] ) ){
			$narrator_genre_ids = [];
			foreach( $insertArray["genre_string_array"]  as $_genreName ){
				$_genreID = bof()->object->a_genre->get_id( $_genreName );
				if ( $_genreID ) $narrator_genre_ids[] = $_genreID;
			}
			if ( $narrator_genre_ids )
			bof()->object->a_narrator->make_rels( $db_id, $narrator_genre_ids, "genre" );
		}

    if ( $db_id && !empty( $insertArray["language_string_array"] ) ){
			$narrator_language_ids = [];
			foreach( $insertArray["language_string_array"]  as $_languageName ){
				$_languageID = bof()->object->a_language->get_id( $_languageName );
				if ( $_languageID ) $narrator_language_ids[] = $_languageID;
			}
			if ( $narrator_language_ids )
			bof()->object->a_narrator->make_rels( $db_id, $narrator_language_ids, "language" );
		}

    return $db_id;

  }
  public function insert( $setArray ){

    $setArray["hash"] = !empty( $setArray["hash"] ) ? $setArray["hash"] : bof()->object->a_narrator->get_free_hash();
    // $setArray["code"] = !empty( $setArray["code"] ) ? $setArray["code"] : bof()->general->make_code( $setArray["name"] );
    return bof()->object->_insert( $this, $setArray );

  }
  public function clean( $item, $args ){

    $_eq = [];
    $search = false;
    $listing = false;
    $muse_source = false;
    extract( $args );

    if ( !empty( $item["name"] ) ){
      $_raw_name = $item["name"];
      $item["name_styled"] = $item["name"];
      bof()->nest->validate( $_raw_name, "string", [ "strip_emoji" => false ] );
      $item["name_clean"] = $_raw_name;
    }

    if ( $search ){
      $item = array(
        "ID" => $item["ID"],
        "title" => $item["name_clean"],
        "image" => !empty( $item["bof_file_cover"]["image_thumb"] ) ? $item["bof_file_cover"]["image_thumb"] : false
      );
    }

    if ( $muse_source ){

      $books = bof()->object->a_book->select(
        array(
          "narrator_id" => $item["ID"]
        ),
        array(
          "order_by" => "time_add",
          "order" => "DESC",
          "limit" => 10,
          "_eq" => [ "sources" => [], "cover" => [] ],
          "muse_source" => true
        )
      );

      if ( $books ){
        foreach( $books as $book ){
          if ( !empty( $book["sources"] ) ){
            $item["sources"] = empty( $item["sources"] ) ? $book["sources"] : array_merge( $item["sources"], $book["sources"] );
          }
        }
      }

    }

    return $item;

  }
  public function clean_as_widget( $item, $args=[] ){

    return array(
      "title" => $item["name"],
      "cover" =>  !empty( $item["bof_file_cover"] ) ? $item["bof_file_cover"] : null,
      "raw" => $item
    );

  }
  public function clean_client_single( $item, $args=[] ){

    $widgets = [];
    $page = [];

    $widgets["books"] = $this->_bof_this->clean_client_single_widget( $item, "books", $args );

    $item["subscribed"] = false;
    if ( bof()->user->get()->ID ){
      $item["subscribed"] = bof()->object->ugc_property->select(
        array(
          "user_id" => bof()->user->get()->ID,
          "type" => "subscribe",
          "object_name" => "a_narrator",
          "object_id" => $item["ID"]
        )
      ) ? true : false;
    }

    return array(
      "widgets" => $widgets,
      "data" => $item,
      "page" => $page
    );

  }
  public function clean_client_single_widget( $item, $widget_name, $args=[], $caller="self" ){

    $widgets = array(
      "books" => array(
        "ID" => "books",
        "display" => array(
          "type" => "table",
          "title" => bof()->object->language->turn("books",[],["uc_first"=>true,"lang"=>"users"]),
          "pagination" => "list/bof_a_narrator?slug={$item["seo_url"]}&widget=books",
          "link" => false,
          "table_columns" => array(
            "duration_hr" => array(
              "func" => function( $data, $displayData ){
                return "";
              },
              "classes" => [ "_ne" ]
            ),
          ),
          "table_labels" => array(
            [ "val" => "Duration", "class" => "_ne" ]
          ),
          "table_hide_cover" => false,
          "table_count" => false,
          "classes" => [ "t_p playAsAction" ]
        ),
        "display_ol" => array(
          "title" => "Books",
          "type" => "table",
          "table_columns" => array(
            "duration_hr" => array(
              "func" => function( $data, $displayData ){
                return "";
              },
              "classes" => [ "_ne" ]
            ),
          ),
          "table_labels" => array(
            [ "val" => "Duration", "class" => "_ne" ]
          ),
          "table_hide_cover" => false,
          "table_count" => false,
          "classes" => [ "t_ab playAsAction" ]
        ),
        "object" => array(
          "name" => "a_book",
          "whereArray" => array(
            "rel_narrator" => $item["ID"]
          ),
          "selectArray" => array(
            "order" => "DESC",
            "order_by" => "time_publish",
            "limit" => 5,
            "clean_for_show" => true,
          )
        ),
      ),
    );

    return !empty( $widgets[ $widget_name ] ) ? $widgets[ $widget_name ] : null;

  }
  public function clean_search_terms( $item ){

    $o = array(
      $item["name"] => 1,
    );
    
    return $o;

  }

}

?>
