<?php

if ( !defined( "bof_root" ) ) die;

class object_up_badge extends bof_type_object {

  // BusyOwlFramework handshake
  public function bof(){
    return array(
      "name" => "up_badge",
      "label" => "User Badge",
      "icon" => "medal",
      "db_table_name" => "_u_badges",
    );
  }
  public function columns(){
    return array(

      "code" => array(
        "label" => "Code",
        "tip" => "A unique ID for this badge. made of a-z & numbers only",
        "validator" => array(
          "string",
          array(
            "strict" => true,
            "strict_regex" => "[a-z0-9]"
          )
        ),
        "input" => array(
          "type" => "text"
        ),
        "bofAdmin" => array(
          "object" => [
            "required" => true,
          ]
        ),
        "selectors" => array(
          "code" => [ "code", "=" ]
        )
      ),
      "name" => array(
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

              $displayData["data"] = $item["name"];

              return $displayData;

            }
          ),
          "object" => array(
            "required" => true,
          )
        ),
      ),
      "detail" => array(
        "label" => "Detail",
        "tip" => "A few words about users owning this badge or badg eitself",
        "input" => array(
          "type" => "textarea",
        ),
        "validator" => array(
          "string",
          array(
            "empty()",
            "allow_eol" => true,
            "strip_emoji" => false,
          ),
        ),
        "bofAdmin" => array(
          "object" => array()
        ),
      ),

      "icon_type" => array(
        "label" => "Icon Type",
        "input" => array(
          "type" => "select_i",
          "options" => array(
            [ "mdi", "MDI" ],
            [ "file", "File" ]
          ),
          "value" => "mdi"
        ),
        "validator" => array(
          "in_array",
          array(
            "values" => [ "mdi", "file" ]
          )
        ),
        "bofAdmin" => array(
          "object" => array(),
          "list" => array(
            "type" => "tag",
          )
        ),
      ),
      "icon_mdi" => array(
        "label" => "Material Design Icon",
        "tip" => "Use MDI icon as a badge. List <a href='https://materialdesignicons.com/' target='_blank'>here</a>. Example: Star",
        "validator" => array(
          "string",
          array(
            "empty()",
            "strict" => true,
            "strict_regex" => "[a-zA-Z0-9\-]"
          )
        ),
        "input" => array(
          "type" => "text"
        ),
        "bofAdmin" => array(
          "object" => array(
            "display_on" => array(
              "icon_type" => [ "equal", "mdi" ],
            )
          ),
          "list" => array(
            "type" => "simple",
            "label" => "Icon",
            "renderer" => function( $displayItem, $item, $displayData ){

              if ( $item["icon_type"] == "mdi" )
              $D = $item["icon_mdi"];
              else{
                $D = $item["icon_file"];
                if ( $D ? ( $iconFile = bof()->object->file->sid( $item["icon_file"], [ "select" => "image_strings_1_html" ] ) ) : false )
                $D = "<div style='width:30px; height: 30px'>{$iconFile}</div>";
              }
              $displayData["data"] = $D;

              return $displayData;
            },
          )
        ),
      ),
      "icon_file" => array(
        "label" => "File",
        "tip" => "Upload an img to be used as badge",
        "bofInput" => array(
          "file",
          array(
            "type" => "image",
            "object_type" => "up_badge"
          ),
        ),
        "bofAdmin" => array(
          "object" => array(
            "display_on" => array(
              "icon_type" => [ "equal", "file" ],
            )
          )
        ),
      ),
      "icon_bg" => array(
        "label" => "Background color",
        "bofInput" => array(
          "color",
          array(
            "toRGB" => true,
            "accept_transparent" => true,
            "empty()"
          )
        ),
        "validator" => array(
          "string_color_hex",
          array(
            "accept_transparent" => true,
            "empty()"
          )
        ),
        "bofAdmin" => array(
          "object" => array()
        ),
      ),

      "priority" => array(
        "label" => "Order",
        "tip" => "Badges will be displayed sorted by their order from low to high. A badge with order 1 will be displayed before all other badges and has the highest priority. A number between 1 to 99",
        "input" => array(
          "type" => "digit",
          "value" => 99
        ),
        "validator" => array(
          "int",
          array(
            "min" => 1,
            "max" => 99,
          )
        ),
        "bofAdmin" => array(
          "list" => array(
            "type" => "simple"
          ),
          "object" => array(
            "required" => true
          )
        )
      ),

      "aas" => array(
        "label" => "Auto<br>Assiged",
        "validator" => array(
          "json",
          array(
            "empty()",
            "encode" => true
          )
        ),
        "bofAdmin" => array(
          "list" => array(
            "type" => "boolean_d",
            "renderer" => function( $displayItem, $item, $displayData ){
              $displayData["data"] = !empty( $item["aas_decoded"] );
              return $displayData;
            },
          )
        )
      ),

    );
  }
  public function bof_columns(){
    return array(
      "ID",
      "time_add",
      "translations" => array(
        "name",
        "detail"
      ),
    );
  }
  public function selectors(){
    return array(
      "query" => [ "name", "LIKE%lower" ],
      "rel_user" => [ "ID", "related_to_parent", "rel_parent" => "user", "hub_type" => "badge" ],
      "has_aas" => function(){
        return array(
          "oper" => "AND",
          "cond" => array(
            [ "aas", "NOT", null, true ],
            [ "aas", "!=", "" ],
            [ "aas", "!=", " " ]
          )
        );
      }
    );
  }
  public function relations(){
    return array(
      "users" => array(
        "exec" => array(
          "type" => "hub",
          "hub_type" => "badge",
          "parent_object" => "user",
          "child_object" => "up_badge",
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
        "edit_page_url" => "up_badge",
        "list_page_url" => "up_badges",
        "multi" => array(
          "select" => true,
          "delete" => true,
          "edit"   => false
        )
      ),
      "object" => array(
        "aa_by_role" => array(
          "label" => "User-Role",
          "tip" => "Automatically assign this badge to users belonging to selected user roels",
          "bofInput" => array(
            "object",
            array(
              "type" => "user_role",
              "multi" => true,
              "autoload" => false
            )
          ),
          "bofAdmin" => array(
            "object" => array(
              "group" => "auto",
              "offable" => true
            )
          )
        ),
        "aa_by_age" => array(
          "label" => "Account age",
          "tip" => "Automatically assign this badge to users with same account age<br>Script calculate the difference between signup time and current time in years, rounded up to nearest integer",
          "input" => array(
            "type" => "select",
            "options" => array(
              [ 1, "1 year old" ],
              [ 2, "2 year old" ],
              [ 3, "3 year old" ],
              [ 4, "4 year old" ],
              [ 5, "5 year old" ],
            )
          ),
          "validator" => array(
            "int",
            []
          ),
          "bofAdmin" => array(
            "object" => array(
              "group" => "auto",
              "offable" => true
            )
          )
        ),
      ),
      "object_renderer" => function( $object, &$parsed, $args, $request ){

        $userCols = bof()->object->parse_caller( "user" )->parsed->columns;
        foreach( $userCols as $userColN => $userColA ){
          if ( substr( $userColN, 0, 2) == "s_" ? substr( $userColN, 0, strlen("s_managed_")) != "s_managed_" : false ){
            $userColA["label"] = ( !empty( $userColA["label"] ) ? $userColA["label"] : $userColN );
            $parsed["items"]["aa_by_{$userColN}_gt"] = array(
              "label" => "{$userColA["label"]} >",
              "tip" => "Automatically assign this badge to users who have <b>{$userColA["label"]}</b> greater than or equal to given number",
              "input" => array(
                "name" => "aa_by_{$userColN}_gt",
                "type" => "digit"
              ),
              "group" => "auto",
              "validator" => array(
                "int",
                array(
                  "empty()"
                )
              ),
              "bofAdmin" => array(
                "object" => array(
                  "group" => "auto",
                  "offable" => true
                )
              )
            );
            $parsed["items"]["aa_by_{$userColN}_lt"] = array(
              "label" => "{$userColA["label"]} <",
              "tip" => "Automatically assign this badge to users who have <b>{$userColA["label"]}</b> lesser than  or equal to given number",
              "input" => array(
                "name" => "aa_by_{$userColN}_lt",
                "type" => "digit"
              ),
              "group" => "auto",
              "validator" => array(
                "int",
                array(
                  "empty()"
                )
              ),
              "bofAdmin" => array(
                "object" => array(
                  "group" => "auto",
                  "offable" => true
                )
              )
            );
          }
        }

      },
      "object_item_renderer" => function( $item_name, &$item_data, $request ){

        if ( $request["type"] != "single" ) return;

        $content = $request["content"][ $request["IDS"][0] ];

        if ( substr( $item_name, 0, 3 ) == "aa_" ){
          if ( isset( $content["aas_decoded"][ $item_name ] ) )
          $item_data["input"]["value"] = $content["aas_decoded"][ $item_name ];
        }

      },
      "object_be_renderer" => function( $_inputs, $request ){

        if ( $request["type"] == "multi" ) return;

        $itemID = $request["type"] == "new" ? null : $request["IDS"][0];
        $checkCode = bof()->object->up_badge->select(["code"=>$_inputs["data"]["code"]]);
        if ( $checkCode ? ( !$itemID ? true : $checkCode["ID"] != $itemID ) : false )
        $_inputs["report"]["fail"]["code"] = "Exists";

        $aas = [];
        foreach( $_inputs["data"] as $inputName => $inputValue ){
          if ( substr( $inputName, 0, 3 ) == "aa_" && $inputValue )
          $aas[ $inputName ] = $inputValue;
        }

        $_inputs["data"]["aas"] = $_inputs["set"]["aas"] = $_inputs["update"]["aas"] = $aas ? json_encode( $aas ) : false;

        return $_inputs;

      },
      "object_groups" => array(
        [ "auto", "Auto-Assign" ],
      ),
      "buttons_renderer" => function( $item, $buttons ){

        if ( !empty( $item["_def"] ) )
        unset( $buttons["delete"] );

        $buttons["list_users"] = array(
          "ID" => "list_users",
          "label" => "List Users",
          "link" => "user_list?rel_badge={$item["ID"]}"
        );

        return $buttons;

      },
    );
  }

  public function clean( $item, $args ){

    $search = false;
    extract( $args );

    if ( $search ){
      $item = array(
        "ID" => $item["ID"],
        "title" => $item["name"],
        "image" => false
      );
    }

    return $item;

  }

  public function cacheHTML( $array ){

    if ( empty( $array["auto"] ) && empty( $array["manual"] ) )
    return "";

    $all = array_merge(
      !empty( $array["auto"] ) ? $array["auto"] : [],
      !empty( $array["manual"] ) ? $array["manual"] : []
    );

    $badges = $this->_bof_this->select(
      array(
        "ID_in" => $all
      ),
      array(
        "single" => false,
        "limit" => bof()->user_points->get_display_setting()["max"],
        "order_by" => "priority",
        "order" => "ASC"
      )
    );

    return $this->_bof_this->htmlize( $badges );

  }
  public function htmlize( $badges ){

    $badgesHTMLS = [];
    if ( $badges ){
      foreach( $badges as $badge ){
        if ( $badge ) $badgesHTMLS[] = $this->_bof_this->_bth( $badge );
      }
    }

    return implode( "", $badgesHTMLS );

  }
  public function _bth( $badge ){

    $icon_type = null;
    $icon_mdi = null;
    $icon_file = null;
    $icon_bg = null;
    extract( $badge );

    if ( $icon_type == "mdi" && !empty( $icon_mdi ) ){
      $icon_bg = $icon_bg ? "style=\"--badge_bg:#{$icon_bg}\"" : "";
      $icon_class = empty( $icon_bg ) ? "" : " hasBg";
      return "<div class=\"badge{$icon_class}\" {$icon_bg}><span class=\"hs\"><span class=\"h1\"></span><span class=\"h2\"></span><span class=\"h3\"></span></span><span class=\"mdi mdi-{$icon_mdi}\"></span></div>";
    }
    elseif ( $icon_type == "file" && !empty( $icon_file ) ){
      $icon_bg = $icon_bg ? "style=\"--badge_bg:#{$icon_bg}\"" : "";
      $icon_class = empty( $icon_bg ) ? "" : " hasBg";
      $icon_file_data = bof()->object->file->sid( $icon_file );
      if ( $icon_file_data ? !empty( $icon_file_data["image_original"] ) : false ){
        return "<div class=\"badge isImg{$icon_class}\" {$icon_bg}><span class=\"hs\"><span class=\"h1\"></span><span class=\"h2\"></span><span class=\"h3\"></span></span><span class=\"imgHolder\" style=\"background-image:url('{$icon_file_data["image_original"]}')\"></span></div>";
      }
    }

  }

}

?>
