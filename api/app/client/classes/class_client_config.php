<?php

if ( !defined( "bof_root" ) ) die;

class client_config extends bof_type_class {

  public $pages = array(

    "user_area" => array(
      "url" => "^user_area$",
      "link" => "user_area",
      "theme_file" => "theme/pages/user_area",
      "theme_args" => array(
        "base" => assets_address
      ),
      "body_class" => [ "user_page" ],
      "becli" => [],
    ),
    "user_library" => array(
      "title_hook" => "library",
      "url" => "^user_library$",
      "link" => "user_library",
      "theme_file" => "theme/pages/user_library",
      "theme_args" => array(
        "base" => assets_address
      ),
      "body_class" => [ "user_page", "user_library", "no_footer" ],
      "becli" => array(
        array(
          "key" => "single",
          "endpoint" => "user_library?\$bof ? urlData^url^query_s\$"
        )
      ),
    ),
    "user_edit" => array(
      "title_hook" => "setting",
      "url" => "^user_edit$",
      "link" => "user_edit",
      "theme_file" => "theme/pages/user_edit",
      "theme_args" => array(
        "base" => assets_address
      ),
      "body_class" => [ "user_page", "user_edit" ],
      "becli" => array(
        array(
          "key" => "single",
          "endpoint" => "user_edit?\$bof ? urlData^url^query_s\$"
        )
      ),
    ),
    "user_pay" => array(
      "title_hook" => "pay",
      "url" => "^user_pay$",
      "link" => "user_pay",
      "theme_file" => "theme/pages/user_pay",
      "theme_args" => array(
        "base" => assets_address
      ),
      "body_class" => [],
      "becli" => array(
        array(
          "key" => "single",
          "endpoint" => "user_pay_ini"
        )
      ),
    ),
    "user_withdrawal" => array(
      "title_hook" => "withdrawal",
      "url" => "^user_withdrawal$",
      "link" => "user_withdrawal",
      "theme_file" => "theme/pages/user_verify",
      "theme_args" => array(
        "base" => assets_address
      ),
      "body_class" => [ "user_page", "user_verify" ],
      "becli" => array(
        array(
          "key" => "single",
          "endpoint" => "user_withdrawal_ini"
        )
      ),
    ),
    "user_verify" => array(
      "title_hook" => "verification",
      "url" => "^user_verify$",
      "link" => "user_verify",
      "theme_file" => "theme/pages/user_verify",
      "theme_args" => array(
        "base" => assets_address
      ),
      "body_class" => [ "user_page", "user_verify" ],
      "becli" => array(
        array(
          "key" => "single",
          "endpoint" => "user_verify?\$bof ? urlData^url^query_s\$"
        )
      ),
    ),
    "user_subs" => array(
      "title_hook" => "user_subs_plan",
      "url" => "^subscription_plans$",
      "link" => "subscription_plans",
      "theme_file" => "theme/pages/user_subs",
      "theme_args" => array(
        "base" => assets_address
      ),
      "body_class" => [ "user_page", "user_subs", "no_sidebar", "no_footer", "muse_hide" ],
      "becli" => array(
        array(
          "key" => "single",
          "endpoint" => "user_subs?\$bof ? urlData^url^query_s\$"
        )
      ),
    ),
    "user_auth" => array(
      "title_hook" => "login",
      "url" => "^userAuth$",
      "link" => "userAuth",
      "theme_file" => "theme/pages/user_auth",
      "theme_args" => array(
        "base" => assets_address
      ),
      "body_class" => [ "noParts", "noPaddings", "auth_page" ],
      "becli" => array(
        array(
          "key" => "auth",
          "endpoint" => "user_auth?\$bof ? urlData^url^query_s\$"
        )
      ),
      "events" =>[],
    ),
    "upload" => array(
      "title_hook" => "upload",
      "url" => "^upload$",
      "link" => "upload",
      "theme_file" => "theme/pages/upload",
      "theme_args" => array(
        "base" => assets_address
      ),
      "body_class" => [ "no_sidebar", "no_footer", "muse_hide" ],
      "becli" => array(
        array(
          "key" => "upload",
          "endpoint" => "user_upload_config"
        )
      ),
      "events" =>[],
    ),
    "object_list" => array(
      "object" => "page_widget",
      "object_column" => "unique_id",
      "theme_file" => "theme/pages/object_list",
      "url" => "^list\/(.*?)$",
      "theme_args" => array(
        "base" => assets_address
      ),
      "becli" => array(
        array(
          "key" => "single",
          "endpoint" => "bofClient/list/\$bof ? urlData^url^match^0\$/?\$bof ? urlData^url^query_s\$"
        )
      ),
      "events" =>[],
    ),
    "object_browse" => array(
      "free_content" => true,
      "title_hook" => "browse",
      "theme_file" => "theme/pages/object_browse",
      "url" => "^browse\/(.*?)$",
      "theme_args" => array(
        "base" => assets_address
      ),
      "becli" => array(
        array(
          "key" => "single",
          "endpoint" => "bofClient/browse/\$bof ? urlData^url^match^0\$/?\$bof ? urlData^url^query_s\$"
        )
      ),
      "events" =>[],
    ),
    "404" => array(
      "title" => "Not Found",
      "theme_file" => "theme/pages/404",
      "url" => true,
      "link" => true,
      "theme_args" => array(
        "base" => assets_address
      ),
      "body_class" => [ "404" ],
      "becli" => [],
      "events" =>[],
    ),
    "403" => array(
      "title" => "No Access",
      "theme_file" => "theme/pages/403",
      "url" => true,
      "link" => true,
      "theme_args" => array(
        "base" => assets_address
      ),
      "body_class" => [ "noParts", "noPaddings", "403" ],
      "becli" => [],
      "events" =>[],
    ),

  );

  public function add_page( $name, $arr ){
    $this->pages[ $name ] = $arr;
  }
  public function remove_page( $name ){

    $pages = $this->pages;

    if ( !empty( $pages[ $name ] ) )
    unset( $pages[ $name ] );

    $this->pages = $pages;

  }
  public function get_pages( $includeTheme=false ){

    $pages = $this->pages;
    $objects = bof()->bofClient->_get_objects();
    $theme_data = $theme = bof()->theme->get();

    $spotify_automation =  bof()->object->db_setting->get( "spotify_automation" );
    if ( $spotify_automation ){
      $pages[ "external_music" ] = array(
        "title" => "External Source",
        "theme_file" => "theme/pages/object_list",
        "url" => "^external_music\/(.*?)$",
        "theme_args" => array(
          "base" => assets_address
        ),
        "becli" => array(
          array(
            "key" => "single",
            "endpoint" => "external_music?id=\$bof ? urlData^url^match^0\$&\$bof ? urlData^url^query_s\$"
          )
        ),
        "events" =>[],
      );
    }

    if ( $includeTheme ){
      $theme_pages = $theme["page_themes"];
    }

    foreach( $pages as $_k => &$_p ){
      if ( !empty( $theme_pages[ $_k ] ) ){
        $_p["theme_file"] = $theme_pages[$_k]["file"];
        $_p["theme_args"] = $theme_pages[$_k]["args"];
      }
    }

    $pages["upload"]["extenders"] = (object) array(
      "upload_css" => $theme_data["assets"]["upload"],
      "upload_js" => array(
        "name" => "bof_upload",
        "path" => "js/app".(production?"/minified":"")."/bof_upload.js",
        "base" => assets_address,
        "dir"  => false
      )
    );

    foreach( $objects as $object_name => $object_args ){

      $the_object = bof()->object->__get( $object_name );
      $object_bof = $the_object->bof();
      $object_client = $the_object->bof_client();

      foreach( array(
        // "list" => [ "url" => "list_url", "a_prefix" => false ],
        "single" => [ "url" => "single_url_prefix", "a_prefix" => true ]
      ) as $key => $key_args ){

        if ( empty( $object_args[ $key ] ) ) continue;

        $page_theme = array(
          "file" => "theme/pages/object_{$key}",
          "args" => array(
            "base" => assets_address
          )
        );

        if ( in_array( $object_name, $theme_data["supported_objects"], true ) || in_array( $object_name, array_keys( $theme_data["supported_objects"] ), true ) ){
          $page_theme = array(
            "file" => "pages/" . ( in_array( $object_name, array_keys( $theme_data["supported_objects"] ), true ) ? $theme_data["supported_objects"][ $object_name ] : $object_name ),
            "args" => array(
              "base" => $theme_data["address"],
              "version" => $theme_data["version"]
            )
          );
        }

        if ( !empty( $theme_pages[ "{$object_name}_{$key}" ] ) )
        $page_theme =  $theme_pages[ "{$object_name}_{$key}" ];

        $bof_cache = 120;
        if ( in_array( "bof_cache", array_keys( $object_client ), true ) )
        $bof_cache = $object_client["bof_cache"];
        if ( defined("production") ? production === false : false )
        $bof_cache = false;

        $urlStart = $bof_cache ? "?bof_cache={$bof_cache}&" : "?";

        $pages[ "{$object_name}_{$key}" ] = array(
          "object" => $object_name,
          "title" => $object_name,
          "url" => "^" . $object_client[ $key_args["url"] ] . ( $key_args["a_prefix"] ? ( $object_client[ $key_args["url"] ] ? "\/" : "" ) . "(.*?)" : "" ) . "$",
          "link" => $object_client[ $key_args["url"] ],
          "theme_file" => $page_theme["file"],
          "theme_args" => $page_theme["args"],
          "body_class" => [ "object_k_{$key}", "object_n_{$object_name}" ],
          "becli" => array(
            array(
              "key" => $key,
              "endpoint" => "bofClient/{$key}/{$object_name}/{$urlStart}slug=\$bof ? urlData^url^match^0\$" . ( !empty( $object_bof["query_be_share"] ) ? "&\$bof ? urlData^url^query_s\$" : "" )
            )
          ),
          "events" => []
        );

      }

    }

    return $pages;

  }

  public function get_additional_body_classes(){

    $classes = [];

    $muse_setting = bof()->object->db_setting->get( "muse_setting" );

    if ( !empty( $muse_setting["muse_hide_yt"] ) )
    $classes[] = "always_hide_yt_frame";
    if ( !empty( $muse_setting["muse_hide"] ) )
    $classes[] = "muse_hide";
    if ( !empty( $muse_setting["queue_hide"] ) ){
      $classes[] = "queue_disable_auto";
      $classes[] = "queue_hide";
    }
    elseif ( !empty( $muse_setting["queue_disable_auto"] ) )
    $classes[] = "queue_disable_auto";
    if ( !empty( $muse_setting["queue_hide_lyrics"] ) )
    $classes[] = "queue_hide_lyrics";
    if ( !empty( $muse_setting["queue_hide_infinite"] ) )
    $classes[] = "queue_hide_infinite";

    if ( ( $theme_def_classes = bof()->object->db_setting->get( "default_body_class" ) ) )
    $classes = array_merge( $classes, explode( " ", $theme_def_classes ) );

    return $classes;

  }
  public function get_muse_setting(){

    $muse_setting = bof()->object->db_setting->get( "muse_setting" );
    $def_setting = json_decode( '{"muse_hide":null,"muse_hide_yt":null,"muse_rec_thres":22,"queue_hide_infinite":null,"queue_hide":null,"queue_disable_auto":null,"queue_hide_lyrics":null,"ad_offset":5,"ad_interval":5,"ad_skippability":true,"ad_skippability_threshold":10}', true );
    return array_merge( $def_setting, $muse_setting ? $muse_setting : [] );

  }

  public function get(){

    $logoID = bof()->object->db_setting->get( "logo" );
    if ( $logoID ){
      $logo = bof()->object->file->select( [ "ID" => $logoID ] );
      if ( $logo ) $logoAddress = $logo["image_original"];
    }

    $secondary_logoID = bof()->object->db_setting->get( "secondary_logo" );
    if ( $secondary_logoID ){
      $secondary_logo = bof()->object->file->select( [ "ID" => $secondary_logoID ] );
      if ( $secondary_logo ) $secondary_logoAddress = $secondary_logo["image_original"];
    }
    elseif ( !empty( $logoAddress ) )
    $secondary_logoAddress = $logoAddress;

    $mobile_logoID = $mobile_logo = $mobile_logoAddress = null;
    if ( bof()->request->is_mobile() ){
      $mobile_logoID = bof()->object->db_setting->get( "mobile_logo" );
      if ( $mobile_logoID ){
        $mobile_logo = bof()->object->file->select( [ "ID" => $mobile_logoID ] );
        if ( $mobile_logo ) $mobile_logoAddress = $mobile_logo["image_original"];
      }
    }

    $userData = bof()->user->get();
    $userData->data = bof()->object->user->publicize( $userData->data );
    $userData->data["playlists"] = bof()->object->ugc_playlist->select(
      array(
        "user_access_id" => $userData->ID
      ),
      array(
        "order_by" => "time_update",
        "order" => "DESC",
        "limit" => 100,
        "_eq" => array(
          "for_display" => true
        )
      )
    );

    $user_menu_raw = bof()->object->menu->get("3");
    if ( !empty( $user_menu_raw ) ){
      $user_menu = $user_menu_raw;
    }

    $currencies = bof()->object->currency->select(
      array(
        "active" => 1
      ),
      array(
        "limit" => false,
        "single" => false,
        "public" => true,
        "select_cleaner" => function( $items ){
          foreach( $items as $i )
          $_s[$i["iso_code"]] = $i["name"];
          return $_s;
        }
      )
    );

    $languages = bof()->object->language->select(
      array(
        "_index" => 1
      ),
      array(
        "limit" => false,
        "single" => false,
        "public" => true,
        "select_cleaner" => function( $items ){
          foreach( $items as $i )
          $_s[$i["code2"]] = $i["name"];
          return $_s;
        }
      )
    );

    return array(

      "mobile" => bof()->request->is_mobile(),
      "brand" => array(
        "name" => bof()->object->db_setting->get( "sitename" ),
        "logo" => !empty( $logoAddress ) ? $logoAddress : null,
        "secondary_logo" => !empty( $secondary_logoAddress ) ? $secondary_logoAddress : null,
        "mobile_logo" => $mobile_logoAddress,
        "sl_facebook" => bof()->object->db_setting->get( "sl_facebook" ),
        "sl_youtube" => bof()->object->db_setting->get( "sl_youtube" ),
        "sl_instagram" => bof()->object->db_setting->get( "sl_instagram" ),
        "sl_linkedin" => bof()->object->db_setting->get( "sl_linkedin" ),
        "sl_soundcloud" => bof()->object->db_setting->get( "sl_soundcloud" ),
        "sl_spotify" => bof()->object->db_setting->get( "sl_spotify" ),
        "sl_twitter" => bof()->object->db_setting->get( "sl_twitter" ),
      ),
      "setting" => array(
        "private" => !empty( client_private ) ? true : false,
        "constructing" => !empty( client_constructing ) ? true : false,
        "social_login" => bof()->object->db_setting->get( "sl" ) ? true : false,
        "vapid_public" => vapid_public,
        "additional_body_classes" => array_merge(
          bof()->client_config->get_additional_body_classes(),
          array(
            "_cc_" . count( $currencies ),
            "_lc_" . count( $languages )
          )
        ),
        "muse" => bof()->client_config->get_muse_setting(),
        "footer" => array(
          "text" => bof()->object->db_setting->get("footer_sign")
        ),
        "touch" => bof()->object->db_setting->get("touch_setting"),
        "has_thingie" => bof()->object->ads->select(["active"=>1],["limit"=>1,"clean"=>false,"columns"=>"ID"])?true:false,
      ),
      "user" => $userData,
      "user_menu" => !empty( $user_menu ) ? $user_menu : false,
      "pages" => $this->get_pages( true ),
      "theme" => bof()->theme->get(),
      "currencies" => $currencies,
      "languages" => $languages,
    );

  }

}

?>
