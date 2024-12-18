<?php

if ( !defined( "bof_root" ) ) die;

class object_ms_group extends bof_type_object {

  // BusyOwlFramework handshake
  public function bof(){
    return array(
      "name" => "ms_group",
      "label" => "Messenger",
      "icon" => "forum",
      "db_table_name" => "_u_ms_groups",
    );
  }
  public function columns(){
    return array(
      "type" => array(
        "public" => true,
        "validator" => array(
          "in_array",
          array(
            "values" => [ "1on1", "group" ]
          ),
        ),
      ),
      "name" => array(
        "public" => true,
        "label" => "Name",
        "validator" => array(
          "string",
          array(
            "strip_emoji" => false,
            "empty()"
          ),
        ),
        "bofAdmin" => array(
          "sortable" => true,
          "list" => array(
            "type" => "simple",
            "renderer" => function( $displayItem, $item, $displayData ){

              foreach( $item["bof_rel_users"] as $user )
              $_user_names[] = "@{$user["username"]}";
              $displayData["sub_data"] = implode( ", ", $_user_names );

              return $displayData;

            },
          ),
        ),
      ),
      "cover_id" => array(
        "label" => "Cover",
        "input" => array(
          "name" => "cover_id",
          "type" => "bof_input"
        ),
        "bofInput" => array(
          "file",
          array(
            "type" => "image",
            "object_type" => "ms_group_c"
          )
        ),
        "selectors" => array(
          "has_cover" => function( $val ){

            if ( $val > 0 )
            return [ "cover_id", ">", "0" ];

            return array(
              "oper" => "OR",
              "cond" => array(
                [ "cover_id", "=", "0" ],
                [ "cover_id", null, null, true ]
              )
            );

          },
        ),
        "bofAdmin" => array(
          "object" => array(),
          "filters" => array(
            "has_cover" => array(
              "title" => "Has cover",
              "input" => array(
                "type" => "select_i",
                "options" => array(
                  [ -1, "no" ],
                  [ 1, "yes" ],
                  [ "__all__", "all" ]
                ),
                "value" => "__all__"
              ),
              "validator" => array(
                "in_array",
                [ "values" => [ "-1", "1", "__all__" ] ]
              )
            ),
          ),
        ),
      ),
      "setting" => array(
        "public" => true,
        "validator" => array(
          "json",
          array(
            "empty()",
            "encode" => true
          ),
        )
      ),
      "admin_id" => array(
        "validator" => array(
          "int",
          array(
            "empty()"
          ),
        ),
      ),
      "user1_id" => array(
        "validator" => array(
          "int",
          array(
            "empty()"
          ),
        ),
      ),
      "user2_id" => array(
        "validator" => array(
          "int",
          array(
            "empty()"
          ),
        ),
      ),
      "users_ids" => array(
        "validator" => array(
          "string",
          array(
            "empty()",
            "strict" => true,
            "strict_regex" => "[0-9,]"
          ),
        ),
        "bofAdmin" => array(
          "filters" => array(
            "users_ids" => array(
              "title" => "User(s)",
              "bofInput" => array(
                "object",
                array(
                  "type" => "user",
                  "multi" => true,
                  "autoload" => false
                )
              )
            )
          )
        ),
        "relations" => array(
          "users" => array(
            "exec" => array(
              "type" => "hub",
              "hub_type" => "ms_group",
              "parent_object" => "user",
              "child_object" => "ms_group",
              "child_object_stats_column" => "s_users",
              "child_object_selector_column" => "users_ids",
            ),
          ),
        ),
      ),
      "time_reply" => array(
        "public" => true,
        "validator" => array(
          "timestamp",
          array(
            "empty()"
          ),
        ),
      ),
      "s_messages" => array(
        "public" => true,
        "validator" => array(
          "int",
          array(
            "empty()",
            "min" => 0
          ),
        ),
      ),
    );
  }
  public function bof_columns(){
    return array(
      "ID",
      "hash",
      "time_add",
    );
  }
  public function selectors(){
    return array(
      "type" => [ "type", "=" ],
      "admin_id" => [ "admin_id", "=" ],
      "user1_id" => [ "user1_id", "=" ],
      "user2_id" => [ "user2_id", "=" ],
      "users_ids" => [ "ID", "related_to_parent", "rel_parent" => "user", "hub_type" => "ms_group" ],
      "query" => [ "name", "LIKE%lower" ]
    );
  }
  public function relations(){
    return array(
      "messages" => array(
        "exec" => array(
          "type" => "direct",
          "parent_object" => "ms_group",
          "parent_object_stats_column" => "s_messages",
          "child_object" => "ms_message",
          "child_object_selector_column" => "group_id",
          "delete_child_too" => true,
        ),
      ),
    );
  }
  public function bof_admin(){
    return array(
      "config" => array(
        "search" => false,
        "create" => false,
        "edit" => false,
        "delete" => true,
        "pagination" => true,
        "edit_page_url" => "messenger",
        "list_page_url" => "messenger",
        "multi" => array(
          "select" => false,
          "delete" => true,
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
        "avatars" => array(
          "type" => "simple",
          "label" => "Avatars",
          "renderer" => function( $displayItem, $item, $displayData ){

            $displayData["data"] = "";
            if ( !empty( $item["users"] ) ){

              $_users = array_slice( $item["users"], 0, 4 );
              $_users_htmls = [];
              foreach( $_users as $user ){
                if ( !empty( $user["bof_file_avatar"] ) )
                $_users_htmls[] = "<div class='user_avatar_holder' style='background-image:url(\"{$user["bof_file_avatar"]["image_thumb"]}\")'></div>";
              }

              $displayData["data"] = "<div class='users_wrapper user_count_".count($_users)." user_t_{$item["type"]}'>";
              $displayData["data"] .= implode( PHP_EOL, $_users_htmls );
              $displayData["data"] .= "</div>";

            }

            return $displayData;

          },
        ),
        "name" => null
      ),
      "object" => array(),
      "actions" => array(),
    );
  }
  public function bof_client(){
    return array(
      "buttons" => array(
        "extra_after" => array(

          "ms_group_users" => array(
            "dynamic" => true,
            "func" => function( $button, $item, $args ){

              $button = false;

              $_users = [];
              foreach( $item["bof_rel_users"] as $_user ){
                if ( empty( $_user ) ? true : empty( $_user["hash"] ) ) continue;
                if ( $_user["hash"] == bof()->user->get()->data["hash"] ) continue;
                $_users[] = array(
                  "title" => "Remove {$_user["username"]}",
                  "icon" => "skull-outline",
                  "_url" => $_user["url"]
                );
              }

              if ( !empty( $item["bof_rel_users"] ) ){
                if ( $item["type"] == "1on1" ){

                  $button = array(
                    "title" => "Visit {$item["name"]}",
                    "icon" => "account-arrow-right-outline",
                    "url" => reset( $_users )["_url"]
                  );

                }
                else {

                  $button = array(
                    "class" => "group_member_list_handle",
                    "title" => "Member list",
                    "icon" => "format-list-bulleted-square",
                    "attr" => " data-group-hash='{$item["hash"]}'"
                  );

                }
              }

              return $button;

            }
          ),
          "ms_group_setting" => array(
            "dynamic" => true,
            "func" => function( $button, $item, $args ){

              if ( $item["type"] != "group" || $item["admin_id"] != bof()->user->get()->ID )
              return false;

              $button = array(
                "title" => "Setting",
                "icon" => "cog",
                "class" => "group_setting_handle",
                "attr" => " data-group-hash='{$item["hash"]}'"
              );

              return $button;

            }
          ),
          "ms_group_remove" => array(
            "dynamic" => true,
            "func" => function( $button, $item, $args ){

              if ( $item["type"] != "group" || $item["admin_id"] != bof()->user->get()->ID )
              return false;

              $button = array(
                "title" => "Remove group",
                "icon" => "skull-crossbones-outline",
                "class" => "group_remove_handle",
                "attr" => " data-group-hash='{$item["hash"]}'"
              );

              return $button;

            }
          ),
          "ms_group_leave" => array(
            "dynamic" => true,
            "func" => function( $button, $item, $args ){

              if ( $item["type"] == "group" && $item["admin_id"] == bof()->user->get()->ID )
              return false;

              $button = array(
                "title" => "Leave",
                "icon" => "exit-to-app",
                "class" => "group_remove_handle",
                "attr" => " data-group-hash='{$item["hash"]}'"
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

    $search = false;
    $listing = false;
    $as_button = false;
    $_eq = [];
    extract( $selectArgs );

    if ( $listing || $as_button ){
      $_eq[ "users" ] = [ "_eq" => [ "avatar" => [] ] ];
      $_eq[ "last_message" ] = true;
    }

    $selectArgs["_eq"] = $_eq;
    return bof()->object->_select( $this, $whereArgs, $selectArgs );

  }
  public function insert( $setArray ){

    $setArray["hash"] = !empty( $setArray["hash"] ) ? $setArray["hash"] : bof()->object->ms_group->get_free_hash();
    $db_id = bof()->object->_insert( $this, $setArray );
    return $db_id;

  }
  public function clean( $item, $args ){

    $_eq = [];
    extract( $args );

    if ( !empty( $_eq["last_message"] ) )
    $item["last_message"] = bof()->object->ms_message->select(
      array(
        "group_id" => $item["ID"]
      ),
      array(
        "order_by" => "time_add",
        "order" => "DESC",
        "_eq" => array(
          "user" => array(
            "public" => true
          )
        ),
        "public" => true
      )
    );

    if ( !empty( $item["bof_rel_users"] ) ? $item["type"] == "1on1" && count( $item["bof_rel_users"] ) == 2 : false ){

      $item["name"] = "";

      foreach( $item["bof_rel_users"] as $_user ){
        if ( bof()->getName() == "bof_client" && $_user["ID"] == bof()->user->get()->ID ) continue;
        $_names[] = "@". $_user["username"];
      }

      $item["name"] = implode( " and ", $_names );

    }
    elseif ( !empty( $item["bof_rel_users"] ) ? $item["type"] == "self" && count( $item["bof_rel_users"] ) == 1 : false ){

      $_keys = array_keys( $item["bof_rel_users"] );
      $item["name"] = "@" . $item["bof_rel_users"][ reset( $_keys ) ]["username"] . " to themself";

    }

    $_coverHTML = "";
    if ( !empty( $item["bof_rel_users"] ) ){
      $_coverHTML .= "<div class='user_avatars'>";
      foreach( $item["bof_rel_users"] as &$_rel_user ){
        if ( empty( $_rel_user["bof_file_avatar"] ) ? true : is_array( $_rel_user["bof_file_avatar"] ) ) continue;
        $_coverHTML .= "<div class='user_avatar user_{$_rel_user["hash"]}'>";
        $_coverHTML .= $_rel_user["bof_file_avatar"];
        $_coverHTML .= "</div>";
        $_rel_user = bof()->object->user->publicize( $_rel_user );
      }
      $_coverHTML .= "</div>";
    }

    if ( !empty( $item["bof_file_cover"] ) )
    $_coverHTML = "<div class='group_avatar'>{$item["bof_file_cover"]}</div>";

    $item["cover"] = $_coverHTML;

    if ( in_array( "bof_rel_users", array_keys( $item ) ) )
    $item["buttons"] = bof()->bofClient->__parse_item_buttons( $this->bof()["name"], $this->_bof_this, $item, $this->_bof_this->bof_client()["buttons"], true );

    $item["ot"] = $this->bof()["name"];
    $item["raw"] = $item;

    return $item;

  }

  public function _1on1_group( $user1, $user2, $create=true ){

    $_id1 = $user1 > $user2 ? $user2 : $user1;
    $_id2 = $user1 > $user2 ? $user1 : $user2;

    $exists = bof()->object->ms_group->select(array(
      "user1_id" => $_id1,
      "user2_id" => $_id2,
      "type" => "1on1"
    ));

    if ( $exists )
    return $create ? $exists["ID"] : $exists;

    if ( !$create )
    return false;

    return bof()->object->ms_group->insert(array(
      "user1_id" => $_id1,
      "user2_id" => $_id2,
      "type" => "1on1",
      "users_ids" => implode( ",", [ $_id1, $_id2 ] )
    ));

  }
  public function _remove_member( $groupID, $userID ){

    bof()->object->ms_message->delete(
      array(
        "group_id" => $groupID,
        "user_id" => $userID
      )
    );

    bof()->object->user->delete_rels( $userID, $groupID, "ms_group" );

    $rels = bof()->object->user->select_rels( false, $groupID, "ms_group" );
    if ( $rels ){
      foreach( $rels as $_rel ){
        $new_user_ids[] = $_rel["user_id"];
        $this->_bof_this->update(
          array(
            "ID" => $groupID
          ),
          array(
            "users_ids" => implode( ",", $new_user_ids )
          ),
          false
        );
      }
    }
    else {
      $this->_bof_this->delete(["ID"=>$groupID]);
    }

  }

}

?>
