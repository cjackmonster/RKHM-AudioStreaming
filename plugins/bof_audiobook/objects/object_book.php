<?php

if ( !defined( "bof_root" ) ) die;

class object_a_book extends bof_type_object {

  // BusyOwlFramework handshake
  public function bof(){
    return array(
      "name" => "a_book",
      "label" => "Audio Book",
      "icon" => "library_books",
      "db_table_name" => "_c_a_books",
      "db_rel_table_name" => "_c_a_books_relations",
      "db_rel_table_col_name" => "book_id",
      "widgetable" => true,
      "browsable" => true,
      "client_single_disable_placeholder" => true,
      "query_be_share" => true
    );
  }
  public function columns(){
    return array(

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
      "description" => array(
        "label" => "Description",
        "validator" => array(
          "editor_js",
          array(
            "empty()",
          ),
        ),
        "input" => array(
          "type" => "text_editor",
        ),
        "bofAdmin" => array(
          "object" => array(
            "group" => "description"
          ),
        ),
      ),

      "_writer_ids" => array(
        "validator" => array(
          "string",
          array(
            "empty()",
            "strict" => true,
            "strict_regex" => "[0-9,]"
          ),
        ),
      ),
      "_translator_ids" => array(
        "validator" => array(
          "string",
          array(
            "empty()",
            "strict" => true,
            "strict_regex" => "[0-9,]"
          ),
        ),
      ),
      "_narrator_ids" => array(
        "validator" => array(
          "string",
          array(
            "empty()",
            "strict" => true,
            "strict_regex" => "[0-9,]"
          ),
        ),
      ),

      "time_play" => array(
        "public" => true,
        "validator" => array(
          "timestamp",
          array(
            "empty()",
          ),
        ),
      ),
      "time_publish" => array(
        "public" => true,
        "label" => "Publish date",
        "tip" => "Publish date in yyyy/mm/dd format",
        "validator" => array(
          "datetime",
          array(
            "empty()",
            "strict" => false
          ),
        ),
        "input" => array(
          "type" => "text"
        ),
        "bofAdmin" => array(
          "sortable" => true,
          "object" => array(
          ),
          "list" => array(
            "type" => "simple"
          ),
          "filters" => array(
            "publish_year_range" => array(
              "title" => "Publish time",
              "input" => array(
                "type" => "text",
                "placeholder" => "19xx-2024"
              ),
              "validator" => array(
                "year_range",
                array(
                  "empty()",
                  "min" => 1500
                )
              )
            ),
          )
        ),
        "selectors" => array(
          "publish_year_range" => function( $val ){

            if ( !$val ? true : !is_string( $val ) )
            return;

            list( $min, $max ) = explode( "-", $val );

            return array(
              "oper" => "AND",
              "cond" => array(
                [ "time_publish", ">", $min . ( "-01-01" ) ],
                [ "time_publish", "<", $max+1 . ( "-01-01" ) ],
              )
            );

          }
        )
      ),

    );
  }
  public function stats_columns(){
    return array(
      "views",
      "views_unique",
      "plays",
      "plays_unique",
      "likes",
      "sales",
      "chapters" => array(
        "label" => "Chapters"
      )
    );
  }
  public function bof_columns(){
    return array(
      "ID",
      "code" => array(
        "from" => array(
          "title"
        )
      ),
      "hash",
      "time_add",
      "seo" => array(
        "o_title_format" => array(
          "title" => "book title/name",
          "writer_name" => "writer name"
        )
      ),
      "cover",
      "translations" => array(
        "title"
      ),
      "price" => [],
    );
  }
  public function selectors(){
    return array(
      "query" => [ "title", "LIKE%lower" ],
      "rel_narrator" => [ "ID", "parent_with_relations", "rel_parent" => "a_book", "hub_type" => "narrator" ],
      "rel_writer" => [ "ID", "parent_with_relations", "rel_parent" => "a_book", "hub_type" => "writer" ],
      "rel_translator" => [ "ID", "parent_with_relations", "rel_parent" => "a_book", "hub_type" => "translator" ],
      "a_book_sim_books" => [ "ID", "parent_with_relations", "rel_parent" => "a_book", "hub_type" => "sim" ],
    );
  }
  public function relations(){
    return array(
      "genres" => array(

        "bofAdmin" => array(
          "objects" => array(

            "a_book_genres" => array(
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
          "lists" => array(

            "genres" => array(
              "label" => "Genres",
              "type" => "simple",
              "class" => "tags",
              "renderer" => function( $displayItem, $item, $displayData ){
                $displayData["data"] = "";
                if ( !empty( $item["bof_rel_genres"] ) ){
                  foreach( $item["bof_rel_genres"] as $_genre )
                  $displayData["data"] .= "<span>{$_genre["name"]}</span>";
                }
                return $displayData;
              },
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
        "bofClient" => array(
          "filters" => array(
            "rel_genre" => "_bofAdmin"
          )
        ),

        "selectors" => array(
          "rel_genre" => [ "ID", "parent_with_relations", "rel_parent" => "a_book", "hub_type" => "genre" ],
        ),

        "exec" => array(
          "type" => "hub",
          "hub_type" => "genre",
          "parent_object" => "a_book",
          "child_object" => "a_genre",
          "child_object_stats_column" => "s_books"
        ),

      ),
      "tags" => array(

        "bofAdmin" => array(

          "objects" => array(

            "a_book_tags" => array(
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
        "bofClient" => array(
          "filters" => array(
            "rel_tag" => "_bofAdmin"
          )
        ),

        "selectors" => array(
          "rel_tag" => [ "ID", "parent_with_relations", "rel_parent" => "a_book", "hub_type" => "tag" ],
        ),

        "exec" => array(
          "type" => "hub",
          "hub_type" => "tag",
          "parent_object" => "a_book",
          "child_object" => "a_tag",
          "child_object_stats_column" => "s_books"
        ),

      ),
      "languages" => array(

        "bofAdmin" => array(

          "objects" => array(

            "a_book_languages" => array(
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
        "bofClient" => array(
          "filters" => array(
            "rel_language" => "_bofAdmin"
          )
        ),

        "selectors" => array(
          "rel_language" => [ "ID", "parent_with_relations", "rel_parent" => "a_book", "hub_type" => "language" ],
        ),

        "exec" => array(
          "type" => "hub",
          "hub_type" => "language",
          "parent_object" => "a_book",
          "child_object" => "a_language",
          "child_object_stats_column" => "s_books"
        ),

      ),
      "sim_books" => array(

        "bofAdmin" => array(
          "objects" => array(

            "a_book_sim_books" => array(
              "label" => "Similar Book(s)",
              "column_name" => "sim_ids",
              "bofInput" => array(
                "object",
                array(
                  "type" => "a_book",
                  "multi" => true
                ),
              ),
            ),

          ),
        ),

        "exec" => array(
          "type" => "hub",
          "hub_type" => "sim",
          "parent_object" => "a_book",
          "child_object" => "a_book",
        ),

      ),
      "narrators" => array(

        "bofAdmin" => array(

          "objects" => array(

            "a_book_narrators" => array(
              "label" => "Narrator(s)",
              "column_name" => "narrator_ids",
              "bofInput" => array(
                "object",
                array(
                  "type" => "a_narrator",
                  "multi" => true
                ),
              ),
            ),


          ),
          "filters" => array(
            "rel_narrator" => array(
              "title" => "Narrator(s)",
              "bofInput" => array(
                "object",
                array(
                  "type" => "a_narrator",
                  "multi" => true,
                  "autoload" => false,
                )
              ),
              "input" => array(
                "name" => "rel_narrator"
              )
            )
          ),

        ),
        "bofClient" => array(
          "filters" => array(
            "rel_narrator" => "_bofAdmin"
          )
        ),

        "selectors" => array(
          "rel_narrator" => [ "ID", "parent_with_relations", "rel_parent" => "a_book", "hub_type" => "narrator" ],
        ),

        "exec" => array(
          "type" => "hub",
          "hub_type" => "narrator",
          "parent_object" => "a_book",
          "parent_object_list_column" => "_narrator_ids",
          "child_object" => "a_narrator",
          "child_object_stats_column" => "s_books"
        ),

      ),
      "translators" => array(

        "bofAdmin" => array(

          "objects" => array(

            "a_book_translators" => array(
              "label" => "Translator(s)",
              "column_name" => "translator_ids",
              "bofInput" => array(
                "object",
                array(
                  "type" => "a_translator",
                  "multi" => true
                ),
              ),
            ),


          ),
          "filters" => array(
            "rel_translator" => array(
              "title" => "Translator(s)",
              "bofInput" => array(
                "object",
                array(
                  "type" => "a_translator",
                  "multi" => true,
                  "autoload" => false,
                )
              ),
              "input" => array(
                "name" => "rel_translator"
              )
            )
          ),

        ),
        "bofClient" => array(
          "filters" => array(
            "rel_translator" => "_bofAdmin"
          )
        ),

        "selectors" => array(
          "rel_translator" => [ "ID", "parent_with_relations", "rel_parent" => "a_book", "hub_type" => "translator" ],
        ),

        "exec" => array(
          "type" => "hub",
          "hub_type" => "translator",
          "parent_object" => "a_book",
          "parent_object_list_column" => "_translator_ids",
          "child_object" => "a_translator",
          "child_object_stats_column" => "s_books"
        ),

      ),
      "writers" => array(

        "bofAdmin" => array(

          "objects" => array(

            "a_book_writers" => array(
              "label" => "Writer(s)",
              "column_name" => "writer_ids",
              "bofInput" => array(
                "object",
                array(
                  "type" => "a_writer",
                  "multi" => true
                ),
              ),
            ),


          ),
          "filters" => array(
            "rel_writer" => array(
              "title" => "Writer(s)",
              "bofInput" => array(
                "object",
                array(
                  "type" => "a_writer",
                  "multi" => true,
                  "autoload" => false,
                )
              ),
              "input" => array(
                "name" => "rel_writer"
              )
            )
          ),

        ),
        "bofClient" => array(
          "filters" => array(
            "rel_writer" => "_bofAdmin"
          )
        ),

        "selectors" => array(
          "rel_writer" => [ "ID", "parent_with_relations", "rel_parent" => "a_book", "hub_type" => "writer" ],
        ),

        "exec" => array(
          "type" => "hub",
          "hub_type" => "writer",
          "parent_object" => "a_book",
          "parent_object_list_column" => "_writer_ids",
          "child_object" => "a_writer",
          "child_object_stats_column" => "s_books"
        ),

      ),
      "likers" => array(
        "exec" => array(
          "type" => "direct",
          "parent_object" => "a_book",
          "parent_object_stats_column" => "s_likes",
          "child_object" => "ugc_property",
          "child_object_selector_column" => "object_id",
          "child_object_where_array" => array(
            "type" => "like",
            [ "object_name", "=", "a_book" ]
          ),
          "delete_child_too" => true
        ),
      ),
      "uploader_p" => array(
        "exec" => array(
          "type" => "direct",
          "parent_object" => "a_book",
          "child_object" => "ugc_property",
          "child_object_selector_column" => "object_id",
          "child_object_where_array" => array(
            "type" => "upload",
            [ "object_name", "=", "a_book" ]
          ),
          "delete_child_too" => true
        ),
      ),
      "chapters" => array(
        "exec" => array(
          "type" => "direct",
          "parent_object" => "a_book",
          "parent_object_stats_column" => "s_chapters",
          "child_object" => "a_book_chapter",
          "child_object_selector_column" => "book_id",
          "delete_child_too" => true,
        )
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
        "edit_page_url" => "audiobook_book",
        "list_page_url" => "audiobook_books",
        "multi" => array(
          "select" => true,
          "delete" => true,
          "edit"   => true,
        ),
      ),
      "filters" => array(),
      "list" => array(
        "title" => null,
        "genres" => null,
        "stats" => array(
          "type" => "simple",
          "class" => "details",
          "label" => "Stats",
          "renderer" => function( $displayItem, $item, $displayData ){
            $displayData["data"] = "<ul style='white-space:nowrap'>";
            if( $item["price"] )
            $displayData["data"] .= "<li><b>Sales</b>" . ($item["s_sales"]?number_format($item["s_sales"]):"-") . "</li>";
            $displayData["data"] .= "<li><b>Plays</b>" . ($item["s_plays"]?number_format($item["s_plays"]):"-") . "</li>";
            $displayData["data"] .= "<li><b>Unique Plays</b>" . ($item["s_plays_unique"]?number_format($item["s_plays_unique"]):"-") . "</li>";
            $displayData["data"] .= "<li><b>Views</b>" . ($item["s_views"]?number_format($item["s_views"]):"-") . "</li>";
            $displayData["data"] .= "<li><b>Chapters</b>" . ($item["s_chapters"]?number_format($item["s_chapters"]):"-") . "</li>";
            $displayData["data"] .= "</ul>";
            return $displayData;
          },
        ),
        "price" => null
      ),
      "object" => array(
      ),
      "object_groups" => array(
        [ "price", "Price" ],
        [ "description", "Description" ],
      ),
      "buttons_renderer" => function( $item, $buttons ){

        $buttons["list_chapters"] = array(
          "label" => "List chapters",
          "link" => "audiobook_book_chapters?col_book={$item["ID"]}"
        );

        $buttons["add_chapter"] = array(
          "label" => "Add chapter",
          "link" => "audiobook_book_chapter/__new?book_id={$item["ID"]}"
        );

        $buttons["list_sources"] = array(
          "label" => "List sources",
          "link" => "audiobook_book_sources?col_book={$item["ID"]}"
        );

        return $buttons;

      },
    );
  }
  public function bof_client(){
    return array(
      "public_browse" => true,
      "single_url_prefix" => "audiobook/book",
      "list_url" => "audiobook/books",
      "buttons" => array(
        "link" => true,
        "share" => true,
        "purchase" => true,
        "play" => true,
        "playlist" => true,
        "like" => true,
        "download_child" => true,
        "extra_after" => array(
          "visit_tags" => array(
            "dynamic" => true,
            "func" => function( $button, $item, $args ){

              $button = null;
              $tags = !empty( $item["bof_rel_tags"] ) ? $item["bof_rel_tags"] : bof()->object->a_tag->select(["a_book_tags"=>$item["ID"]],["limit"=>20]);
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
              $cats = !empty( $item["bof_rel_genres"] ) ? $item["bof_rel_genres"] : bof()->object->a_genre->select(["a_book_genres"=>$item["ID"]],["limit"=>20]);
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
          "visit_writer" => array(
            "dynamic" => true,
            "func" => function( $button, $item, $args ){

              $button = [];

              if ( !empty( $item["bof_rel_writers"] ) ){
                $button = array(
                  "hook" => "open_writer",
                  "icon" => "open-in-app",
                  "url" => $item["bof_rel_writers"]["url"]
                );
              }
              $writer = bof()->object->a_writer->select(["a_book_writers"=>$item["ID"]]);
              if ( !$writer ) return $button;
              $button = array(
                "hook" => "open_writer",
                "icon" => "open-in-app",
                "url" => $writer["url"]
              );

              return $button;

            }
          ),
          "visit_narrator" => array(
            "dynamic" => true,
            "func" => function( $button, $item, $args ){

              $button = [];

              if ( !empty( $item["bof_rel_narrators"] ) ){
                $button = array(
                  "hook" => "open_narrator",
                  "icon" => "open-in-app",
                  "url" => $item["bof_rel_narrators"]["url"]
                );
              }
              $narrator = bof()->object->a_narrator->select(["a_book_narrators"=>$item["ID"]]);
              if ( !$narrator ) return $button;
              $button = array(
                "hook" => "open_narrator",
                "icon" => "open-in-app",
                "url" => $narrator["url"]
              );

              return $button;

            }
          ),
          "visit_translator" => array(
            "dynamic" => true,
            "func" => function( $button, $item, $args ){

              $button = [];

              if ( !empty( $item["bof_rel_translators"] ) ){
                $button = array(
                  "hook" => "open_translator",
                  "icon" => "open-in-app",
                  "url" => $item["bof_rel_translators"]["url"]
                );
              }
              $translator = bof()->object->a_translator->select(["a_book_translators"=>$item["ID"]]);
              if ( !$translator ) return $button;
              $button = array(
                "hook" => "open_translator",
                "icon" => "open-in-app",
                "url" => $translator["url"]
              );

              return $button;

            }
          ),
        )
      )
    );
  }

  // BusyOwlFramework helpers
  public function select( $whereArgs=[], $selectArgs=[] ){

    $has_genre = null;
    $has_artist = null;
    $has_album = null;
    extract( $whereArgs );

    $search = false;
    $listing = false;
    $client_single = false;
    $as_widget = false;
    $muse_infinite_related = false;
    $muse_source = false;
    $match_page = false;
    $search_terms = false;
    $_eq = [];
    extract( $selectArgs );

    if ( $muse_source ){
      $_eq[ "cover" ] = [];
      $_eq[ "writers" ] = [ "limit" => 1 ];
    }

    if ( $listing ){
      $_eq[ "cover" ] = [];
      $_eq[ "album" ] = array(
        "_eq" => [ "cover" => [], "writers" => [ "limit" => 1 ] ]
      );
      $_eq[ "genres" ] = [];
      $_eq[ "uploader" ] = [];
      $_eq[ "writers" ] = [];
    }

    if ( $client_single ){
      $_eq[ "cover" ] = [];
      $_eq[ "bg" ] = [];
      $_eq[ "genres" ] = [ "limit" => 3 ];
      $_eq[ "tags" ] = [ "limit" => 3 ];
      $_eq[ "languages" ] = [ "limit" => 3 ];
      $_eq[ "writers" ] = [ "limit" => 3 ];
      $_eq[ "narrators" ] = [ "limit" => 3 ];
      $_eq[ "translators" ] = [ "limit" => 3 ];
    }

    if ( $search_terms ){
      $_eq[ "genres" ] = [ "limit" => 3, "clean" => false ];
      $_eq[ "tags" ] = [ "limit" => 3, "clean" => false ];
      $_eq[ "languages" ] = [ "limit" => 3, "clean" => false ];
      $_eq[ "writers" ] = [ "limit" => 3, "clean" => false ];
      $_eq[ "narrators" ] = [ "limit" => 3, "clean" => false ];
      $_eq[ "translators" ] = [ "limit" => 3, "clean" => false ];
    }

    if ( $as_widget ){
      $_eq[ "cover" ] = [];
      $_eq[ "writers" ] = [ "limit" => 1 ];
    }

    if ( $muse_source ){
      $_eq[ "writers" ] = [ "limit" => 1 ];
    }

    if ( $match_page ){
      $_eq[ "writers" ] = [ "limit" => 1, "clean" => false ];
    }

    if ( $muse_infinite_related ){
      $_eq["cover" ] = [];
      $_eq["genres"] = array(
        "limit" => 10
      );
    }

    $selectArgs["_eq"] = $_eq;
    return bof()->object->_select( $this, $whereArgs, $selectArgs );

  }
  public function create( $whereArray, $insertArray, $updateArray=false, $returnDetails=false ){

    $db_id = bof()->object->_create( $this, $whereArray, $insertArray, $updateArray, $returnDetails );

    if ( $db_id && !empty( $insertArray["genre_string_array"] ) ){
			$book_genre_ids = [];
			foreach( $insertArray["genre_string_array"]  as $_genreName ){
				$_genreID = bof()->object->a_genre->get_id( $_genreName );
				if ( $_genreID ) $book_genre_ids[] = $_genreID;
			}
			if ( $book_genre_ids )
			bof()->object->a_book->make_rels( $returnDetails ? $db_id["ID"] : $db_id, $book_genre_ids, "genre" );
		}

    if ( $db_id && !empty( $insertArray["language_string_array"] ) ){
			$book_language_ids = [];
			foreach( $insertArray["language_string_array"]  as $_languageName ){
				$_languageID = bof()->object->a_language->get_id( $_languageName );
				if ( $_languageID ) $book_language_ids[] = $_languageID;
			}
			if ( $book_language_ids )
			bof()->object->a_book->make_rels( $returnDetails ? $db_id["ID"] : $db_id, $book_language_ids, "language" );
		}

    if ( $db_id && !empty( $insertArray["tags_string_array"] ) ){
			$book_tags_ids = [];
			foreach( $insertArray["tag_string_array"]  as $_tagName ){
				$_tagID = bof()->object->a_tag->get_id( $_tagsName );
				if ( $_tagID ) $book_tags_ids[] = $_tagID;
			}
			if ( $book_tags_ids )
			bof()->object->a_book->make_rels( $returnDetails ? $db_id["ID"] : $db_id, $book_tags_ids, "tags" );
		}

    return $db_id;

  }
  public function insert( $setArray ){

    $setArray["hash"] = !empty( $setArray["hash"] ) ? $setArray["hash"] : bof()->object->a_book->get_free_hash();
    return bof()->object->_insert( $this, $setArray );

  }
  public function clean( $item, $args ){

    $search = false;
    $_eq = [];
    $muse_source = false;
    $match_page = false;
    extract( $args );

    $item["premium"] = !empty( $item["price"] );

    if ( $search ){
      $item = array(
        "ID" => $item["ID"],
        "title" => $item["title"],
        "image" => !empty( $item["bof_file_cover"]["image_thumb"] ) ? $item["bof_file_cover"]["image_thumb"] : false
      );
    }

    if ( $match_page ){
      $item = array(
        "title" => $item["title"],
        "writer_name" => !empty( $item["bof_rel_writers"]["name"] ) ? $item["bof_rel_writers"]["name"] : null,
        "seo_url" => $item["seo_url"],
        "cover_id" => $item["cover_id"]
      );
    }

    if ( $muse_source ){

      $chapters = bof()->object->a_book_chapter->select(
        array(
          "book_id" => $item["ID"]
        ),
        array(
          "order_by" => "book_index",
          "order" => "ASC",
          "limit" => 100,
          "_eq" => [ "sources" => [], "cover" => [] ],
          "muse_source" => true
        )
      );

      if ( $chapters ){
        foreach( $chapters as $chapter ){
          if ( !empty( $chapter["sources"] ) ){
            $item["sources"] = empty( $item["sources"] ) ? $chapter["sources"] : array_merge( $item["sources"], $chapter["sources"] );
          }
        }
      }

      $item["sources"] = !empty( $item["sources"] ) ? $item["sources"] : [];

    }

    return $item;

  }
  public function clean_as_widget( $item, $args=[] ){

    $clean_for_show = false;
    extract( $args );

    return array(
      "title" => $item["title"],
      "sub_data" => $item["bof_rel_writers"] ? $item["bof_rel_writers"]["name"] : "?",
      "sub_link" => $item["bof_rel_writers"] ? $item["bof_rel_writers"]["url"] : "?",
      "cover" =>  !empty( $item["bof_file_cover"] ) ? $item["bof_file_cover"] : null,
      "ot" => "a_book",
      "raw" => $item
    );

  }
  public function clean_client_single( $item, $args=[] ){

    $widgets = $page = [];

    if ( !empty( $item["description_html"] ) ){
      $widgets["description"] = array(
        "ID" => "desc",
        "display" => array(
          "classes" => [ "desc" ],
          "type" => "html",
          "title" => bof()->object->language->turn("description",[],["uc_first"=>true,"lang"=>"users"]),
          "html" => $item["description_html"]
        )
      );
    }

    $_page = bof()->nest->user_input( "get", "page", "int", [ "min" => 2 ], 1 );

    $chapters = bof()->object->a_book_chapter->select(
      array(
        "book_id" => $item["ID"]
      ),
      array(
        "limit" => 10,
        "single" => false,
        "order_by" => "book_index",
        "order" => "ASC",
        "public" => true,
        "page" => $_page
      )
    );
    $chapters_more = bof()->object->a_book_chapter->select(
      array(
        "book_id" => $item["ID"]
      ),
      array(
        "limit" => 1,
        "offset" => ($_page)*10,
        "single" => false,
        "order_by" => "book_index",
        "order" => "ASC",
        "clean" => false
      )
    );

    $widgets["book_chapters_0"] = array(
      "ID" => "book_chapters_0",
      "display" => array(
        "type" => "table",
        "title" => "Chapters",
        "link" => $chapters_more ? ("{$item["url"]}?page=".($_page+1)) : false,
        "table_columns" => array(
          "duration_hr" => array(
            "func" => function( $data, $displayData ){
              return $data["duration_hr"];
            },
            "classes" => [ "date" ]
          ),
        ),
        "table_labels" => array(
          [ "val" => "Duration", "class" => "date" ]
        ),
        "table_hide_cover" => true,
        "table_count" => $_page>1?($_page-1)*10:true,
        "classes" => [ "no_thead" ]
      ),
      "items" => $chapters,
      "object" => array(
        "name" => "a_book_chapter",
      ),
    );

    // $__r = bof()->object->__get( "a_{$__k}" )->publicize( $__r );

    foreach( array(
      "writer" => [],
      "translator" => [],
      "narrator" => [],
      "genre" => [],
      "tag" => [],
      "language" => []
    ) as $__k => $__a ){

      if ( empty( $item["bof_rel_{$__k}s"] ) )
      continue;

      if ( $_page > 1 )
      continue;

      $per_rel = 0;
      foreach( $item["bof_rel_{$__k}s"] as $i => &$__r ){

        $per_rel++;
        if ( $per_rel > 2 ) continue;
        $widgets["book_{$__k}_{$i}"] = array(
          "ID" => "book_{$__k}_{$i}",
          "display" => array(
            "type" => "slider",
            "title" => ucfirst( !empty( $__r["title"] ) ? $__r["title"] : $__r["name"] ),
            "sub_data" => bof()->object->language->turn("related_by_{$__k}",[],["uc_first"=>true,"lang"=>"users"]),
            "link" => $__r["url"],
            "pagination" => true,
            "slider_size" => "medium",
            "slider_rows" => 1,
            "slider_mason" => false,
          ),
          "object" => array(
            "name" => "a_book",
            "whereArray" => array(
              "rel_{$__k}" => $__r["ID"]
            ),
            "selectArray" => array(
              "limit" => 10,
            )
          ),
        );

        $__r = bof()->object->__get( "a_{$__k}" )->publicize( $__r );

      }

    }

    $item["liked"] = false;
    if ( bof()->user->get()->ID ){
      $item["liked"] = bof()->object->ugc_property->select(
        array(
          "user_id" => bof()->user->get()->ID,
          "type" => "like",
          "object_name" => "a_book",
          "object_id" => $item["ID"]
        )
      ) ? true : false;
    }

    $item["head_play_title"] = $item["title"];

    return array(
      "data" => $item,
      "widgets" => $widgets,
      "page" => $page
    );

  }
  public function clean_search_terms( $item ){

    $o = array(
      $item["title"] => 1,
    );

    foreach( [ "genres", "tags", "language", "writer", "translator", "narrator" ] as $_k ){
      if ( !empty( $item["bof_rel_{$_k}"] ) ){
        foreach( $item["bof_rel_{$_k}"] as $_i ){
          $o[ $_i["name"] ] = $_k == "tags" ? 0.2 : 0.14;
        }
      }
    }

    return $o;

  }

  public function get_sources_data( $item, $args=[] ){

    $data = array(
      "ID" => null,
      "cover" => !empty( $item["bof_file_cover"] ) ? $item["bof_file_cover"]["image_thumb"] : null,
      "back" => !empty( $item["bof_file_cover"] ) ? reset( $item["bof_file_cover"]["image_strings"]["_raw"] ) : null,
      "title" => $item["title"],
      "link" => $item["url"],
      "sub_title" => null,
      "sub_link" => null,
      "duration" => null,
      "buttons" => bof()->bofClient->__parse_item_buttons( "a_book", $this->_bof_this, $item, $this->_bof_this->bof_client()["buttons"] ),
      "ot" => "a_book",
      "hash" => $item["hash"],
      "lyrics" => null,
      "preview" => array(
        "type" => "image",
        "image" => !empty( $item["bof_file_cover"] ) ? $item["bof_file_cover"]["image_strings"][1]["html"] : null
      )
    );
    return $data;

  }
  public function get_infinite_related( $item, $args=[] ){

    $per_item = 12;
    $queue = null;
    $infinite = null;
    $related = null;
    $exclude = array();
    extract( $args );

    return bof()->object->a_book_chapter->select(
      array(
        "book_id" => $item["ID"]
      ),
      array(
        "order_by" => "book_index ASC, ID ASC",
        "order" => " ",
        "single" => false,
        "limit" => false,
        "as_widget" => true,
        "thumb_as_cover" => true,
        "_eq" => array(
          "cover" => [],
          "artist" => []
        ),
        "cache_load_rt" => false
      )
    );

  }

  public function download_child( $button, $item, $args ){

    $tracks = bof()->object->a_book_chapter->select(
      array(
        "book_id" => $item["ID"]
      ),
      array(
        "muse_source" => true,
        "order_by" => "book_index ASC, ID ASC",
        "order" => " ",
        "_eq" => array(
          "sources" => array(
            "for_download" => true
          ),
        ),
        "limit" => false,
        "single" => false
      )
    );

    if ( $tracks ){
      $tracks_dir_sources = [];
      foreach( $tracks as $track ){

        if ( !empty( $track["bof_dir_sources"] ) ){

          usort( $track["bof_dir_sources"], function($a, $b) {
            return $a['download_able'] < $b['download_able'] ? 1 : 0;
          });

          $_source = reset( $track["bof_dir_sources"] );
          $_source["real_ot"] = "a_book_chapter";
          $_source["real_oh"] = $track["hash"];
          $tracks_dir_sources = array_merge( $tracks_dir_sources, [ $_source ] );
        }

      }
      $item["bof_dir_sources"] = $tracks_dir_sources;
    }

    return $item;

  }

  public function check_role_access( $item, $premium_access ){

    $a_writer = null;
    $a_genre = null;
    $a_tag = null;
    extract( $premium_access );

    if ( $a_writer ){

      $writers = bof()->object->a_writer->select(
        array(
          "a_book_writers" => $item["ID"]
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
          "a_book_tags" => $item["ID"]
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
          "a_book_genres" => $item["ID"]
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
