<?php

if ( !defined( "bof_root" ) ) die;

class object_r_station extends bof_type_object {

  // BusyOwlFramework handshake
  public function bof(){
    return array(
      "name" => "r_station",
      "label" => "Radio Station",
      "icon" => "radio",
      "db_table_name" => "_c_r_stations",
      "db_rel_table_name" => "_c_r_stations_relations",
      "db_rel_table_col_name" => "station_id",
      "widgetable" => true,
      "browsable" => true,
      "client_single_disable_placeholder" => true
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
          "type" => "text_editor"
        ),
        "bofAdmin" => array(
          "object" => array(
            "group" => "description"
          )
        ),
      ),

      "website" => array(
        "public" => true,
        "label" => "Website",
        "validator" => array(
          "string",
          array(
            "empty()"
          )
        ),
        "input" => array(
          "type" => "text"
        ),
        "bofAdmin" => array(
          "object" => []
        )
      ),
      "website_fav" => array(
        "validator" => array(
          "boolean",
          array(
            "empty()",
            "int" => true
          )
        ),
      ),
      "website_fav_time" => array(
        "validator" => array(
          "timestamp",
          array(
            "empty()",
          ),
        ),
      ),
      "api_data" => array(
        "validator" => array(
          "json",
          array(
            "encode" => true,
            "empty()"
          )
        )
      ),

      "icy_title" => array(
        "validator" => array(
          "string",
          array(
            "empty()",
          )
        ),
      ),
      "icy_time" => array(
        "validator" => array(
          "timestamp",
          array(
            "empty()",
          ),
        ),
      ),

      "language_id" => array(
        "label" => "Language",
        "bofInput" => array(
          "object",
          array(
            "type" => "r_language"
          )
        ),
        "bofAdmin" => array(
          "object" => array(
            "multi" => true
          ),
          "list" => array(
            "type" => "simple",
            "renderer" => function( $displayItem, $item, $displayData ){
              $displayData["data"] = !empty( $item["bof_dir_language"]["name"] ) ? $item["bof_dir_language"]["name"] : "?";
              return $displayData;
            },
          ),
          "filters" => array(
            "col_language" => array(
              "title" => "Language(s)",
              "bofInput" => array(
                "object",
                array(
                  "type" => "r_language",
                  "multi" => true,
                )
              )
            ),
          )
        ),
        "bofClient" => array(
          "filters" => array(
            "col_language" => "_bofAdmin"
          )
        ),
        "relations" => array(
          "language" => array(
            "exec" => array(
              "type" => "direct",
              "parent_object" => "r_language",
              "parent_object_stats_column" => "s_stations",
              "child_object" => "r_station",
              "child_object_selector_column" => "language_id",
              "limit" => 1,
              "delete_child_too" => true
            )
          )
        ),
        "selectors" => array(
          "language_id" => [ "language_id", "=" ],
          "col_language" => [ "language_id", "by_column" ],
        )
      ),
      "region_id" => array(
        "label" => "Region",
        "bofInput" => array(
          "object",
          array(
            "type" => "r_region"
          )
        ),
        "bofAdmin" => array(
          "object" => array(
            "multi" => true
          ),
          "list" => array(
            "type" => "simple",
            "renderer" => function( $displayItem, $item, $displayData ){
              $displayData["data"] = !empty( $item["bof_dir_region"]["name"] ) ? $item["bof_dir_region"]["name"] : "";
              return $displayData;
            },
          ),
          "filters" => array(
            "col_region" => array(
              "title" => "Region(s)",
              "bofInput" => array(
                "object",
                array(
                  "type" => "r_region",
                  "multi" => true,
                )
              )
            ),
          )
        ),
        "bofClient" => array(
          "filters" => array(
            "col_region" => "_bofAdmin"
          )
        ),
        "relations" => array(
          "region" => array(
            "exec" => array(
              "type" => "direct",
              "parent_object" => "r_region",
              "parent_object_stats_column" => "s_stations",
              "child_object" => "r_station",
              "child_object_selector_column" => "region_id",
              "limit" => 1,
              "delete_child_too" => true
            )
          )
        ),
        "selectors" => array(
          "region_id" => [ "region_id", "=" ],
          "col_region" => [ "region_id", "by_column" ],
        )
      ),
      "country_id" => array(
        "label" => "Country",
        "bofInput" => array(
          "object",
          array(
            "type" => "r_country"
          )
        ),
        "bofAdmin" => array(
          "object" => array(
            "multi" => true
          ),
          "filters" => array(
            "col_country" => array(
              "title" => "Country(s)",
              "bofInput" => array(
                "object",
                array(
                  "type" => "r_country",
                  "multi" => true,
                )
              )
            ),
          )
        ),
        "bofClient" => array(
          "filters" => array(
            "col_country" => "_bofAdmin"
          )
        ),
        "relations" => array(
          "country" => array(
            "exec" => array(
              "type" => "direct",
              "parent_object" => "r_country",
              "parent_object_stats_column" => "s_stations",
              "child_object" => "r_station",
              "child_object_selector_column" => "country_id",
              "limit" => 1,
              "delete_child_too" => true
            )
          )
        ),
        "selectors" => array(
          "country_id" => [ "country_id", "=" ],
          "col_country" => [ "country_id", "by_column" ],
        )
      ),
      "city_id" => array(
        "label" => "City",
        "bofInput" => array(
          "object",
          array(
            "type" => "r_city"
          )
        ),
        "bofAdmin" => array(
          "object" => array(
            "multi" => true
          ),
          "filters" => array(
            "col_city" => array(
              "title" => "City(s)",
              "bofInput" => array(
                "object",
                array(
                  "type" => "r_city",
                  "multi" => true,
                )
              )
            ),
          )
        ),
        "bofClient" => array(
          "filters" => array(
            "col_city" => "_bofAdmin"
          )
        ),
        "relations" => array(
          "city" => array(
            "exec" => array(
              "type" => "direct",
              "parent_object" => "r_city",
              "parent_object_stats_column" => "s_stations",
              "child_object" => "r_station",
              "child_object_selector_column" => "city_id",
              "limit" => 1,
              "delete_child_too" => true
            )
          )
        ),
        "selectors" => array(
          "city_id" => [ "city_id", "=" ],
          "col_city" => [ "city_id", "by_column" ],
        )
      ),

      "active" => array(
        "label" => "Active",
        "input" => array(
          "type" => "checkbox"
        ),
        "validator" => array(
          "boolean",
          array(
            "empty()",
            "int" => true
          )
        ),
        "bofAdmin" => array(
          "list" => array(
            "type" => "boolean",
            "args" => array(
              "payloads" => [ "activate", "deactivate" ]
            )
          ),
          "object" => [],
          "filters" => array(
            "active" => array(
              "title" => "Active",
              "input" => array(
                "name" => "active",
                "type" => "select_i",
                "options" => array(
                  [ "0", "no" ],
                  [ "1", "Yes" ],
                  [ "__all__", "All" ],
                ),
                "value" => "__all__"
              ),
              "validator" => array(
                "in_array",
                [ "values" => [ "0", "1", "__all__" ] ]
              )
            ),

          )
        ),
        "selectors" => array(
          "active" => [ "active", "=" ]
        )
      ),

      "time_play" => array(
        "label" => "Play time",
        "validator" => array(
          "timestamp",
          array(
            "empty()",
          ),
        ),
        "input" => array(
          "type" => "time"
        ),
        "bofAdmin" => array(
          "object" => []
        )
      ),

    );
  }
  public function stats_columns(){
    return array(
      "views",
      "views_unique",
      "plays",
      "likes",
      "plays_unique",
      "popularity",
      "muse_report"
    );
  }
  public function bof_columns(){
    return array(
      "ID",
      "hash",
      "cover",
      "code" => array(
        "from" => array(
          "title"
        )
      ),
      "time_add",
      "seo",
      "translations" => array(
        "title"
      )
    );
  }
  public function selectors(){
    return array(
      "query"   => [ "title", "LIKE%lower" ],
    );
  }
  public function relations(){
    return array(
      "categories" => array(
        "bofAdmin" => array(
          "objects" => array(

            "r_station_categories" => array(
              "label" => "Category(s)",
              "column_name" => "category_ids",
              "bofInput" => array(
                "object",
                array(
                  "type" => "r_category",
                  "multi" => true
                ),
              ),
              "bofAdmin" => array(
                "object" => array(
                  "multi" => true
                )
              )
            ),

          ),
          "lists" => array(

            "categories" => array(
              "label" => "Categories",
              "type" => "simple",
              "class" => "tags",
              "renderer" => function( $displayItem, $item, $displayData ){
                $displayData["data"] = "";
                if ( !empty( $item["bof_rel_categories"] ) ){
                  foreach( $item["bof_rel_categories"] as $_genre )
                  $displayData["data"] .= "<span>{$_genre["name"]}</span>";
                }
                return $displayData;
              },
            ),

          ),
          "filters" => array(
            "rel_category" => array(
              "title" => "Category(s)",
              "bofInput" => array(
                "object",
                array(
                  "type" => "r_category",
                  "multi" => true,
                  "autoload" => false,
                )
              )
            )
          ),
        ),
        "bofClient" => array(
          "filters" => array(
            "rel_category" => "_bofAdmin"
          )
        ),
        "selectors" => array(
          "rel_category" => [ "ID", "parent_with_relations", "rel_parent" => "r_station", "hub_type" => "category" ],
        ),
        "exec" => array(
          "type" => "hub",
          "hub_type" => "category",
          "parent_object" => "r_station",
          "child_object" => "r_category",
          "child_object_stats_column" => "s_stations"
        ),
      ),
      "sources" => array(
        "exec" => array(
          "type" => "direct",
          "parent_object" => "r_station",
          "child_object" => "r_station_source",
          "child_object_selector_column" => "station_id",
          "delete_child_too" => true,
        ),
      ),
      "likers" => array(
        "exec" => array(
          "type" => "direct",
          "parent_object" => "r_station",
          "parent_object_stats_column" => "s_likes",
          "child_object" => "ugc_property",
          "child_object_selector_column" => "object_id",
          "child_object_where_array" => array(
            "type" => "like",
            [ "object_name", "=", "r_station" ]
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
        "edit_page_url" => "radio_station",
        "list_page_url" => "radio_stations",
        "multi" => array(
          "select" => true,
          "delete" => true,
          "edit"   => true,
        ),
      ),
      "buttons" => array(
        "activate" => array(
          "id" => "activate",
          "label" => "Activate",
          "payload" => array(
            "post" => array(
              "__action" => "activate"
            )
          )
        ),
        "deactivate" => array(
          "id" => "deactivate",
          "label" => "De-Activate",
          "payload" => array(
            "post" => array(
              "__action" => "deactivate"
            )
          )
        ),
      ),
      "filters" => array(),
      "list" => array(
        "title" => null,
        "region_id" => null,
        "language_id" => null,
        "categories" => null,
        "stats" => array(
          "type" => "simple",
          "class" => "details",
          "label" => "Stats",
          "renderer" => function( $displayItem, $item, $displayData ){
            $displayData["data"] = "<ul>";
            $displayData["data"] .= "<li><b>Views:</b> {$item["s_views"]}</li>";
            $displayData["data"] .= "<li><b>Likes:</b> {$item["s_likes"]}</li>";
            $displayData["data"] .= "<li><b>Plays:</b> {$item["s_plays"]}</li>";
            $displayData["data"] .= "<li><b>Failures:</b> {$item["s_muse_report"]}</li>";
            $displayData["data"] .= "</ul>";
            return $displayData;
          },
        ),
      ),
      "object" => array(
        "title" => null,
        "cover_id" => null,
        "language_id" => null,
        "region_id" => null,
        "country_id" => null,
        "city_id" => null,
        "r_station_categories" => null,
        "website" => null,
        "time_play" => null,
        "time_add" => null,
        "description" => null
      ),
      "object_groups" => array(
        [ "description", "Description" ]
      ),
      "buttons_renderer" => function( $item, $buttons ){

        $buttons["list_sources"] = array(
          "label" => "List sources",
          "link" => "radio_station_sources?col_station={$item["ID"]}",
        );

        $buttons["add_source"] = array(
          "label" => "Add source",
          "link" => "radio_station_source/__new?target_id={$item["ID"]}"
        );

        if ( $item["active"] )
        unset( $buttons["activate"] );

        if ( !$item["active"] )
        unset( $buttons["deactivate"] );


        return $buttons;

      },
      "actions" => array(
        "activate" => function( $ids ){
          bof()->object->r_station->update(array(
            "ID_in" => $ids
          ),array(
            "active" => 1
          ));
          return [ true, "Activated" ];
        },
        "deactivate" => function( $ids ){
          bof()->object->r_station->update(array(
            "ID_in" => $ids
          ),array(
            "active" => 0
          ));
          return [ true, "De-Activated" ];
        },
      ),
    );
  }
  public function bof_client(){
    return array(
      "public_browse" => true,
      "single_url_prefix" => "radio/station",
      "list_url" => "radios",
      "buttons" => array(
        "link" => true,
        "share" => true,
        "purchase" => false,
        "play" => true,
        "playlist" => true,
        "like" => true,
        "source" => true,
        "extra_after" => array(

          "visit_language" => array(
            "dynamic" => true,
            "func" => function( $button, $item, $args ){

              $button = [];

              if ( !empty( $item["bof_dir_language"] ) ){
                $button = array(
                  "hook" => "open_language",
                  "icon" => "open-in-app",
                  "url" => $item["bof_dir_language"]["url"]
                );
              }
              $language = bof()->object->r_language->select(["ID"=>$item["language_id"]]);
              if ( !$language ) return $button;
              $button = array(
                "hook" => "open_language",
                "icon" => "open-in-app",
                "url" => $language["url"]
              );

              return $button;

            }
          ),
          "visit_region" => array(
            "dynamic" => true,
            "func" => function( $button, $item, $args ){

              $button = [];

              if ( !empty( $item["bof_dir_region"] ) ){
                $button = array(
                  "hook" => "open_region",
                  "icon" => "open-in-app",
                  "url" => $item["bof_dir_region"]["url"]
                );
              }
              $region = bof()->object->r_region->select(["ID"=>$item["region_id"]]);
              if ( !$region ) return $region;
              $button = array(
                "hook" => "open_region",
                "icon" => "open-in-app",
                "url" => $region["url"]
              );

              return $button;

            }
          ),
          "visit_country" => array(
            "dynamic" => true,
            "func" => function( $button, $item, $args ){

              $button = [];

              if ( !empty( $item["country"] ) ){
                $button = array(
                  "hook" => "open_country",
                  "icon" => "open-in-app",
                  "url" => $item["bof_dir_country"]["url"]
                );
              }
              $country = bof()->object->r_country->select(["ID"=>$item["country_id"]]);
              if ( !$country ) return $button;
              $button = array(
                "hook" => "open_country",
                "icon" => "open-in-app",
                "url" => $country["url"]
              );

              return $button;

            }
          ),
          "visit_city" => array(
            "dynamic" => true,
            "func" => function( $button, $item, $args ){

              $button = [];

              if ( !empty( $item["bof_dir_city"] ) ){
                $button = array(
                  "hook" => "open_city",
                  "icon" => "open-in-app",
                  "url" => $item["bof_dir_city"]["url"]
                );
              }
              $city = bof()->object->r_city->select(["ID"=>$item["city_id"]]);
              if ( !$city ) return $button;
              $button = array(
                "hook" => "open_city",
                "icon" => "open-in-app",
                "url" => $city["url"]
              );

              return $button;

            }
          ),
          "visit_cats" => array(
            "dynamic" => true,
            "func" => function( $button, $item, $args ){

              $button = null;
              $cats = !empty( $item["bof_rel_categories"] ) ? $item["bof_rel_categories"] : bof()->object->r_category->select(["r_station_categories"=>$item["ID"]],["limit"=>20]);
              if ( $cats ){
                $button = array(
                  "hook" => "open_category",
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

        ),
      )
    );
  }

  // BusyOwlFramework helpers
  public function select( $whereArgs=[], $selectArgs=[] ){

    $listing = false;
    $search = false;
    $order_by = false;
    $as_widget = false;
    $client_single = false;
    $muse_infinite_related = false;
    $muse_source = false;
    $_eq = [];
    $search_terms = false;
    extract( $selectArgs );

    if ( in_array( "sources", array_keys( $_eq ), true ) ){
      $_eq[ "cover" ] = [];
    }

    if ( $search || $listing ){
      $_eq[ "cover" ] = "";
      $_eq[ "categories" ] = [];
      $_eq[ "region" ] = [];
      $_eq[ "language" ] = [];
    }

    if ( $as_widget ){
      $_eq[ "cover" ] = [];
    }

    if ( $client_single ){
      $_eq[ "cover" ] = [];
      $_eq[ "bg" ] = [];
      $_eq[ "categories" ] = [ "public" => true ];
      $_eq[ "country" ] = [ "public" => true ];
      $_eq[ "city" ] = [ "public" => true ];
      $_eq[ "region" ] = [ "public" => true ];
      $_eq[ "language" ] = [ "public" => true ];
      $_eq[ "sources" ] = [ ];
    }

    if ( $search_terms ){
      $_eq["categories"] = array(
        "limit" => 3,
        "clean" => false
      );
      $_eq["country"] = array(
        "clean" => false
      );
      $_eq["city"] = array(
        "clean" => false
      );
      $_eq["region"] = array(
        "clean" => false
      );
      $_eq["language"] = array(
        "clean" => false
      );
    }

    if ( $muse_infinite_related ){
      $_eq["cover" ] = [];
      $_eq["categories"] = array(
        "limit" => 10
      );
    }

    if ( bof()->getName() == "bof_client" )
    $whereArgs["active"] = 1;

    $selectArgs["_eq"] = $_eq;
    return bof()->object->_select( $this, $whereArgs, $selectArgs );

  }
  public function insert( $setArray ){

    $setArray["code"] = !empty( $setArray["code"] ) ? $setArray["code"] : bof()->general->make_code( $setArray["name"] );
    $setArray["hash"] = !empty( $setArray["hash"] ) ? $setArray["hash"] : bof()->object->r_station->get_free_hash();
    $setArray["seo_url"] = !empty( $setArray["seo_url"] ) ? $setArray["seo_url"] : bof()->object->r_station->get_free_url( $setArray["name"] );
    return bof()->object->_insert( $this, $setArray );

  }
  public function create( $whereArray, $insertArray, $updateArray=false ){

    $db_id = bof()->object->_create( $this, $whereArray, $insertArray, $updateArray );

    if ( $db_id && !empty( $insertArray["category_string_array"] ) ){
      $__category_ids = [];
      foreach( $insertArray["category_string_array"]  as $_categoryName ){
        $_categoryID = bof()->object->r_category->get_id( $_categoryName );
        if ( $_categoryID ) $__category_ids[] = $_categoryID;
      }
      if ( $__category_ids )
      bof()->object->r_station->make_rels( $db_id, array_unique( $__category_ids ), "category" );
    }

    if ( $db_id && !empty( $insertArray["sources"] ) ? is_array( $insertArray["sources"] ) : false ){

      foreach ( $insertArray["sources"] as $source ){
        if ( !empty( $source["type"] ) && !empty( $source["data"] ) ){
          $source["hash"] = md5( $source["type"] . $source["data"] );
          bof()->object->r_station_source->create(
            array(
              "hash" => $source["hash"]
            ),
            array_merge(
              $source,
              array(
                "target_id" => $db_id,
                "download_able" => -2
              )
            ),
            array()
          );
        }
      }

    }

    return $db_id;

  }
  public function update( $whereArray, $updateArray, $exeRelations=true ){

    if ( !empty( $updateArray["active"] ) )
    $updateArray["s_muse_report"] = 0;

    return bof()->object->_update( $this, $whereArray, $updateArray, $exeRelations );

  }
  public function clean( $item, $args ){

    $search = false;
    $cleanest = false;
    $listing = false;
    $as_widget = false;
    $client_single = false;
    $muse_source = false;
    $_eq = false;
    extract( $args );

    if ( $cleanest ? in_array( $cleanest, array_keys( $item ), true ) : false )
    $item = $item[ $cleanest ];

    //if ( in_array( "cover", array_keys( $_eq ), true ) && empty( $item["bof_file_cover"] ) && !empty( $item["api_data_decoded"]["image"] ) && client_auto_images ){
    //  $item["bof_file_cover"]["image_strings"] = bof()->image->html( array( $item["api_data_decoded"]["image"] => [ 1, 1 ] ) );
    //  $item["bof_file_cover"]["image_thumb"] = $item["api_data_decoded"]["image"];
    //}

    if ( in_array( "cover", array_keys( $_eq ), true ) && empty( $item["bof_file_cover"] ) && !empty( $item["website"] ) ){
      if ( $item["website_fav_time"] ? bof()->general->timestamp_difference( $item["website_fav_time"], "-", 14*24*60*60 ) : false ){
        if ( !empty( $item["website_fav"] ) ){
          $_ws = str_replace( [ "https://", "http://" ], "", $item["website"] );
          $item["bof_file_cover"]["image_strings"] = bof()->image->html( array( "https://www.google.com/s2/favicons?domain={$_ws}&sz=256" => [ 1, 1 ] ) );
          $item["bof_file_cover"]["image_thumb"] = "https://www.google.com/s2/favicons?domain={$_ws}&sz=256";
        }
      } elseif ( bof()->object->db_setting->get( "radio_fav_as_icon" ) ) {
        $item["bof_file_cover"]["image_strings"] = bof()->image->html( array( web_address . "api/radio_fav_catcher?hash={$item["hash"]}" => [ 1, 1 ] ) );
        $item["bof_file_cover"]["image_thumb"] = web_address . "api/radio_fav_catcher?hash={$item["hash"]}";
      }
    }

    if ( $search ){
      $item = array(
        "ID" => $item["ID"],
        "title" => $item["title"],
        "image" => !empty( $item["bof_file_cover"]["image_thumb"] ) ? $item["bof_file_cover"]["image_thumb"] : false
      );
    }

    if ( $muse_source )
    $item["sources"] = array(
      $item["hash"] => array(
        "ot" => "r_station",
        "sources" => $item["bof_dir_sources"],
        "data" => $this->_bof_this->get_sources_data( $item ),
        "raw" => $item
      )
    );

    return $item;

  }
  public function clean_as_widget( $item, $args=[] ){

    return array(
      "title" => $item["title"],
      "sub_data" => "",
      "cover" =>  !empty( $item["bof_file_cover"] ) ? $item["bof_file_cover"] : null,
      "ot" => "r_station",
      "raw" => $item
    );

  }
  public function clean_client_single( $item, $args=[] ){

    if ( !empty( $item["bof_dir_sources"] ) )
    $item["sources"] = bof()->object->r_station->get_sources( $item, $args );

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

    if ( !empty( $item["bof_dir_language"] ) ){
      $widgets["language"] = array(
        "ID" => "radio_language",
        "display" => array(
          "type" => "slider",
          "title" => $item["bof_dir_language"]["name"],
          "sub_data" => bof()->object->language->turn("related_by_lang",[],["uc_first"=>true,"lang"=>"users"]),
          "link" => $item["bof_dir_language"]["url"],
          "pagination" => true,
          "slider_size" => "medium",
          "slider_rows" => 1,
          "slider_mason" => false,
        ),
        "object" => array(
          "name" => "r_station",
          "whereArray" => array(
            "col_language" => $item["language_id"],
          ),
          "selectArray" => array(
            "limit" => 10,
          )
        ),
      );
    }
    if ( !empty( $item["bof_dir_region"] ) ){
      $widgets["region"] = array(
        "ID" => "radio_region",
        "display" => array(
          "type" => "slider",
          "title" => $item["bof_dir_region"]["name"],
          "sub_data" => bof()->object->language->turn("related_by_region",[],["uc_first"=>true,"lang"=>"users"]),
          "link" => $item["bof_dir_region"]["url"],
          "pagination" => true,
          "slider_size" => "medium",
          "slider_rows" => 1,
          "slider_mason" => false,
        ),
        "object" => array(
          "name" => "r_station",
          "whereArray" => array(
            "col_region" => $item["region_id"],
          ),
          "selectArray" => array(
            "limit" => 10,
          )
        ),
      );
    }
    if ( !empty( $item["bof_dir_country"] ) ){
      $widgets["country"] = array(
        "ID" => "radio_country",
        "display" => array(
          "type" => "slider",
          "title" => $item["bof_dir_country"]["name"],
          "sub_data" => bof()->object->language->turn("related_by_country",[],["uc_first"=>true,"lang"=>"users"]),
          "link" => $item["bof_dir_country"]["url"],
          "pagination" => true,
          "slider_size" => "medium",
          "slider_rows" => 1,
          "slider_mason" => false,
        ),
        "object" => array(
          "name" => "r_station",
          "whereArray" => array(
            "col_country" => $item["country_id"],
          ),
          "selectArray" => array(
            "limit" => 10,
          )
        ),
      );
    }
    if ( !empty( $item["bof_dir_city"] ) ){
      $widgets["city"] = array(
        "ID" => "radio_city",
        "display" => array(
          "type" => "slider",
          "title" => $item["bof_dir_city"]["name"],
          "sub_data" => bof()->object->language->turn("related_by_city",[],["uc_first"=>true,"lang"=>"users"]),
          "link" => $item["bof_dir_city"]["url"],
          "pagination" => true,
          "slider_size" => "medium",
          "slider_rows" => 1,
          "slider_mason" => false,
        ),
        "object" => array(
          "name" => "r_station",
          "whereArray" => array(
            "col_city" => $item["city_id"],
          ),
          "selectArray" => array(
            "limit" => 10,
          )
        ),
      );
    }

    $item["liked"] = false;
    if ( bof()->user->get()->ID ){
      $item["liked"] = bof()->object->ugc_property->select(
        array(
          "user_id" => bof()->user->get()->ID,
          "type" => "like",
          "object_name" => "r_station",
          "object_id" => $item["ID"]
        )
      ) ? true : false;
    }

    if ( client_give_attribute && !empty( $item["website"] ) ){
      $item["copyright"] = "We don't host this radio or are affiliated with them in anyway. Click to visit <a target='_blank' href='{$item["website"]}'>{$item["title"]}'s website <span class='mdi mdi-open-in-new'></span></a>";
    }

    $item["head_play_title"] = $item["title"];

    return array(
      "widgets" => $widgets,
      "data" => $item,
      "page" => $page
    );

  }
  public function clean_search_terms( $item ){

    $o = array(
      $item["title"] => 1,
    );

    foreach( [ "categories" ] as $_k ){
      if ( !empty( $item["bof_rel_{$_k}"] ) ){
        foreach( $item["bof_rel_{$_k}"] as $_i ){
          $o[ $_i["name"] ] = 0.14;
        }
      }
    }

    foreach( [ "region", "country", "city", "language" ] as $_k ){
      if ( !empty( $item["bof_dir_{$_k}"] ) ){
        $o[ $item["bof_dir_{$_k}"]["name"] ] = 0.14;
      }
    }

    return $o;

  }

  public function get_sources( $item, $args=[] ){

    $sources = [];
    if ( !empty( $item["bof_dir_sources"] ) ? !empty( $item["bof_dir_sources"]["data_decoded"]["url"] ) || !empty( $item["bof_dir_sources"]["data_decoded"]["seo_url"] ) : false ){

      $sources = array(
        $item["bof_dir_sources"]["hash"] => array(
          "data" => array(
            "ID" => $item["bof_dir_sources"]["hash"],
            "cover" => !empty( $item["bof_file_cover"] ) ? $item["bof_file_cover"]["image_thumb"] : null,
            "title" => $item["title"],
            "link" => $item["url"],
            "sub_title" => "<span class='live'>Radio</span>",
            "sub_link" => $item["url"],
            "duration" => $item["bof_dir_sources"]["duration"],
            "buttons" => bof()->bofClient->__parse_item_buttons( "r_station", $this->_bof_this, $item, $this->_bof_this->bof_client()["buttons"] ),
            "ot" => "r_station",
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
                "address" => isset( $item["bof_dir_sources"]["data_decoded"]["url"] ) ? $item["bof_dir_sources"]["data_decoded"]["url"] : $item["bof_dir_sources"]["data_decoded"]["seo_url"]
              )
            ),
          )
        )
      );

    }

    return $sources;

  }
  public function get_sources_data( $item, $args=[] ){

    $data = array(
      "ID" => null,
      "cover" => !empty( $item["bof_file_cover"] ) ? $item["bof_file_cover"]["image_thumb"] : null,
      "back" => !empty( $item["bof_file_cover"] ) ? reset( $item["bof_file_cover"]["image_strings"]["_raw"] ) : null,
      "title" => $item["title"],
      "link" => $item["url"],
      "sub_title" => "<span class='live'>Radio</span>",
      "sub_link" => "",
      "duration" => null,
      "buttons" => bof()->bofClient->__parse_item_buttons( "m_track", $this->_bof_this, $item, $this->_bof_this->bof_client()["buttons"] ),
      "ot" => "r_station",
      "hash" => $item["hash"],
      "lyrics" => false,
      "preview" => array(
        "type" => "image",
        "image" => !empty( $item["bof_file_cover"] ) ? $item["bof_file_cover"]["image_strings"][1]["html"] : null
      )
    );
    return $data;

  }
  public function get_infinite_related( $item, $args ){

    $per_item = 12;
    $queue = null;
    $infinite = null;
    $related = null;
    $exclude = array();
    extract( $args );

    if ( !empty( $queue["by_object"]["r_station"] ) ){
      foreach( $queue["by_object"]["r_station"] as $_station ){
        $exclude["hash"][] = $_station;
      }
    }

    if ( !empty( $infinite["by_object"]["r_station"] ) ){
      foreach( $infinite["by_object"]["r_station"] as $_station ){
        $exclude["hash"][] = $_station;
      }
    }

    if ( !empty( $related ) ){
      foreach( $related as $_r ){
        $exclude["hash"][] = $_r["raw"]["hash"];
      }
    }

    $categoryIDS = [];
    if ( $item["bof_rel_categories"] ? is_array( $item["bof_rel_categories"] ) : false ){
      foreach( $item["bof_rel_categories"] as $_category )
      $categoryIDS[] = $_category["ID"];
    }

    $_whereArray = array(
      "rel_category" => $categoryIDS
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
          "artist" => []
        ),
        "cache_load_rt" => false
      )
    );

    return $related_items;

  }

}

?>
