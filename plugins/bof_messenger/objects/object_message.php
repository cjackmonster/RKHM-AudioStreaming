<?php

if ( !defined( "bof_root" ) ) die;

class object_ms_message extends bof_type_object {

  // BusyOwlFramework handshake
  public function bof(){
    return array(
      "name" => "ms_message",
      "label" => "Message",
      "icon" => "message",
      "db_table_name" => "_u_ms_messages"
    );
  }
  public function columns(){
    return array(
      "user_id" => array(
        "validator" => "int",
        "relations" => array(
          "user" => array(
            "exec" => array(
              "type" => "direct",
              "parent_object" => "user",
              "child_object" => "ms_message",
              "child_object_selector_column" => "user_id",
              "delete_child_too" => true,
            )
          )
        )
      ),
      "group_id" => array(
        "validator" => "int",
        "selectors" => array(
          "col_group" => [ "group_id", "by_column" ]
        ),
        "relations" => array(
          "group" => array(
            "exec" => array(
              "type" => "direct",
              "parent_object" => "ms_group",
              "parent_object_stats_column" => "s_messages",
              "parent_object_custom_columns" => function( $effected_parents, $effected_childs ){
                if ( $effected_parents ? $effected_parents["all"] : false ){
                  foreach( $effected_parents["all"] as $_pid ){
                    bof()->db->query("UPDATE _u_ms_groups SET time_reply = ( SELECT time_add FROM _u_ms_messages WHERE _u_ms_messages.group_id = _u_ms_groups.ID ORDER BY time_add DESC LIMIT 1 ) WHERE ID = '{$_pid}'");
                  }
                }
              },
              "child_object" => "ms_message",
              "child_object_selector_column" => "group_id",
              "delete_child_too" => true
            ),
          ),
        ),
        "bofAdmin" => array(
          "filters" => array(
            "col_group" => array(
              "title" => "Group(s)",
              "bofInput" => array(
                "object",
                array(
                  "type" => "ms_group"
                )
              )
            )
          ),
        ),
      ),
      "message_id" => array(
        "validator" => array(
          "int",
          array(
            "empty()",
            "min" => 0
          ),
        ),
      ),
      "type" => array(
        "validator" => array(
          "in_array",
          array(
            "values" => array(
              "text",
              "object"
            ),
          ),
        ),
      ),
      "content" => array(
        "validator" => array(
          "json",
          array(
            "empty()",
            "encode" => true,
          ),
        ),
      ),
      "time_seen" => array(
        "validator" => array(
          "timestamp",
          array(
            "empty()"
          ),
        ),
      ),
    );
  }
  public function selectors(){
    return array(
      "user_id" => [ "user_id", "=" ],
      "group_id" => [ "group_id", "=" ],
      "message_id" => [ "message_id", "=" ],
      "type" => [ "type", "=" ],
    );
  }
  public function bof_columns(){
    return array(
      "ID",
      "hash",
      "time_add"
    );
  }
  public function bof_admin(){
    return array(
      "config" => array(
        "search" => false,
        "create" => false,
        "edit" => false,
        "delete" => false,
        "pagination" => false,
        "edit_page_url" => null,
        "list_page_url" => null,
        "multi" => array(
          "select" => false,
          "delete" => false,
          "edit"   => false
        )
      ),
      "buttons" => array(
      ),
      "buttons_renderer" => function( $item, $buttons ){
        return $buttons;
      },
      "filters" => array(),
      "list" => array(
        "message" => array(
          "type" => "simple",
          "label" => "Message",
          "renderer" => function( $displayItem, $item, $displayData ){
            $displayData["data"] = $item["display_data_full"];
            return $displayData;
          },
        )
      ),
      "list_config" => array(
        "limit" => 500
      ),
      "object" => array(),
      "actions" => array(),

    );
  }

  // BusyOwlFramework helpers
  public function select( $whereArgs=[], $selectArgs=[] ){

    $search = false;
    $listing = false;
    $_eq = [];
    extract( $selectArgs );

    if ( $listing ){
      $_eq["user"] = [ "_eq" => [ "avatar" => [] ] ];
    }

    $selectArgs["_eq"] = $_eq;
    return bof()->object->_select( $this, $whereArgs, $selectArgs );

  }
  public function insert( $setArray ){

    $setArray["hash"] = !empty( $setArray["hash"] ) ? $setArray["hash"] : bof()->object->ms_message->get_free_hash();
    $insert = bof()->object->_insert( $this, $setArray );

    if ( !empty( $setArray["group_id"] ) && bof()->user->check()->ID ){

      $getGroup = bof()->object->ms_group->sid( $setArray["group_id"] );
      $userIDs = explode( ",", $getGroup["users_ids"] );
      foreach( $userIDs as $userID ){
        if ( $userID == bof()->user->check()->ID ) continue;

        bof()->chapar->notify( "new_{$getGroup["type"]}_message", array(
          "triggerer" => array(
            "object" => "ms_group",
            "id" => $setArray["group_id"]
          ),
          "target" => array(
            "user_id" => $userID
          ),
          "message" => array(
            "params" => [ "replier" => bof()->user->get()->data["username"], "group_name" => $getGroup["name"] ? html_entity_decode( $getGroup["name"] , ENT_QUOTES) : $getGroup["name"] ],
            "image" => !empty( bof()->user->get()->data["avatar_thumb"] ) ? bof()->user->get()->data["avatar_thumb"] : null,
            "link" => "messenger?group=" . $getGroup["hash"]
          ),
        ) );

      }

    }

    return $insert;

  }
  public function clean( $item, $args, $pre, $next ){

    $_eq = [];
    $listing = false;
    extract( $args );

    $item["group_class"] = "";
    $item["group_class"] .= " type_{$item["type"]}";

    if ( $item["type"] == "text" ){
      $item["display_data"] = $item["content_decoded"];
      $item["preview_data"] = $item["display_data"] ? mb_substr( $item["display_data"], 0, 80, "UTF-8" ) : false;
      if ( $item["display_data"] ) $item["display_data"] = str_replace( PHP_EOL, "<BR>", $item["display_data"] );
    }
    elseif ( $item["type"] == "object" ){

      $item["display_data"] = "";
      $item["group_class"] .= " type_{$item["type"]} object_type_{$item["content_decoded"]["type"]}";

      try {

        $object = bof()->object->__get( $item["content_decoded"]["type"] );
        $_exEqs = [];
        if ( $item["content_decoded"]["type"] == "m_album" || $item["content_decoded"]["type"] == "m_track" )
        $_exEqs = [ "artist" => [] ];
        $objectItem = $object->sid( $item["content_decoded"]["ID"], [ "as_widget" => true, "_eq" => array_merge( [ "cover" => [], "avatar" => [] ], $_exEqs ) ] );
        if ( !empty( $objectItem ) ){
          $objectItemLink = bof()->seo->url( $object, $objectItem["raw"] );
          $objectTitle = $objectItem["title"];
          $objectCover = $objectItem["cover"];
          $objectLabel = bof()->object->language->turn( $object->bof()["name"], [], [ "lang" => "users" ] );
        }

        if ( empty( $objectCover ) ){
          $placeholder = bof()->object->db_setting->get( "placeholder" );
          if ( $placeholder ){
            $placeholder = bof()->object->file->select( [ "ID" => $placeholder ] );
            if ( !empty( $placeholder["image_strings"] ) ){
              $objectCover = $placeholder["image_strings"]["_raw"];
              $objectCover = reset( $objectCover );
            }
          }
        } else {
          $objectCover = $objectCover["image_strings"]["_raw"];
          $objectCover = reset( $objectCover );
        }

        if ( !empty( $objectItemLink ) ){
          $item["display_data"] .= "<a href='{$objectItemLink}' class='object_wrapper'>";
            // $item["display_data"] .= "<span class='objectLabel'>{$objectLabel}</span>";
            $item["display_data"] .= "<span class='objectCover' style='background-image:url(\"{$objectCover}\")'></span>";
            $item["display_data"] .= "<span class='objectTitle'>{$objectTitle}</span>";
          $item["display_data"] .= "</a>";
        }


      } catch( bofException|Exception|Error $err ){}

    }

    $writerOfPre = empty( $pre ) ? false : $pre["user_id"] == $item["user_id"];
    $writerOfNext = empty( $next ) ? false : $next["user_id"] == $item["user_id"];

    if ( $writerOfPre && $writerOfNext )
    $group = "mid";
    elseif ( $writerOfPre )
    $group = "last";
    elseif( $writerOfNext )
    $group = "first";
    else
    $group = "single";

    $item["group_class"] .= " " . ( $group == "single" ? $group : "family {$group}" );

    if ( $listing ){
      $item["display_data_full"] = "";

      $inGroup = empty( $pre ) ? false : $pre["user_id"] == $item["user_id"];
      $inGroup_class = $inGroup ? "_g" : "";

      if ( !empty( $next ) && !$inGroup ? $next["user_id"] == $item["user_id"] : false )
      $inGroup_class = "_p";


      $item["display_data_full"] .= "<div class='message_wrapper clearafter id_{$item["ID"]} user_id_{$item["user_id"]} {$inGroup_class}'>";
      $item["display_data_full"] .= "<div class='user id_{$item["user_id"]}'>";
      $item["display_data_full"] .= !empty( $item["bof_dir_user"][0]["bof_file_avatar"] ) ? "<div class='user_avatar' style='background-image:url(\"{$item["bof_dir_user"][0]["bof_file_avatar"]["image_thumb"]}\")'></div>" : "";
      $item["display_data_full"] .= "<div class='user_name'>{$item["bof_dir_user"][0]["username"]}</div>";
      $item["display_data_full"] .= "</div>";

      $item["display_data_full"] .= "<div class='message id_{$item["user_id"]}'>";
      $item["display_data_full"] .= $item["display_data"];
      $item["display_data_full"] .= "</div>";

      $item["display_data_full"] .= "<div class='message_time'>";
      $item["display_data_full"] .= bof()->general->passed_time_hr( time() - strtotime($item["time_add"]), [ "maximum" => 2 ] )["string"];
      $item["display_data_full"] .= "</div>";

      $item["display_data_full"] .= "</div>";

    }

    return $item;

  }

}

?>
