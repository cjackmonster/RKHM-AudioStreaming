<?php

if ( !defined( "root" ) || !defined( "bof_root" ) ) die;

class highlights {

  protected $data = [];
  protected $colors = [ "orange", "purple", "blue", "red", "green", "yellow" ];
  protected $limits = [];

  public function __construct(){

    // Sidebar Dash links
    $this
    ->new_group( "dashboard_links", "section_links", array(
      "sb_family" => "dashboard"
    ) )
    ->new_item( "dashboard_links", array(
      "icon" => "stacked_bar_chart",
      "title" => "Dashboard",
      "link" => "index"
    ) );

    // setting links
    $this
    ->new_group( "setting_links", "section_links", array(
      "sb_family" => "setting"
    ) )
    ->new_item( "setting_links", array(
      "icon" => "settings",
      "title" => "Setting",
      "ID"    => "general_links",
      "childs" => array(
        array(
          "title" => "General",
          "icon" => "settings",
          "link" => "general_setting"
        ),
        array(
          "title" => "Brand",
          "icon" => "public",
          "link" => "brand_setting"
        ),
        array(
          "title" => "Player",
          "icon" => "smart_display",
          "link" => "player_setting"
        ),
        array(
          "title" => "Session",
          "icon" => "fingerprint",
          "link" => "session_setting"
        ),
        array(
          "title" => "Currencies",
          "icon" => "attach_money",
          "link" => "currencies"
        ),
        array(
          "title" => "Email",
          "icon" => "email",
          "link" => "email_setting"
        ),
        array(
          "title" => "Notifications",
          "icon" => "notifications",
          "link" => "notifications"
        ),
        array(
          "title" => "Social Login",
          "icon" => "login",
          "link" => "social_login_setting"
        ),
        array(
          "title" => "CLI Apps",
          "icon" => "keyboard_command_key",
          "link" => "cli_setting"
        ),
        array(
          "title" => "SEO Titles",
          "icon" => "public",
          "link" => "seo_setting"
        ),
        array(
          "title" => "Blacklists",
          "icon" => "block",
          "link" => "blacklists"
        ),
        array(
          "title" => "Browse pages",
          "icon" => "web",
          "link" => "browse_setting"
        ),
        array(
          "title" => "Touch & Mouse",
          "icon" => "touch_app",
          "link" => "touch_setting"
        ),
        array(
          "title" => "Search",
          "icon" => "search",
          "link" => "search_setting"
        ),
        array(
          "title" => "User Pages",
          "icon" => "account_box",
          "link" => "user_pps_setting"
        ),
        array(
          "title" => "YouTube Piped",
          "icon" => "valve",
          "link" => "youtube_piped_setting"
        ),
      )
    ) )
    ->new_item( "setting_links", array(
      "icon" => "perm_media",
      "title" => "Files",
      "childs" => array(
        array(
          "title" => "Storage Servers",
          "icon" => "dns",
          "link" => "storages"
        ),
        array(
          "title" => "Storage Setting",
          "icon" => "filter_alt",
          "link" => "storage_setting"
        ),
        array(
          "title" => "Upload Setting",
          "icon" => "file_upload",
          "link" => "upload_setting"
        ),
        array(
          "title" => "File List",
          "icon" => "format_list_numbered",
          "link" => "files"
        ),
      )
    ) )
    ->new_item( "setting_links", array(
      "ID" => "page_builder",
      "icon"  => "grid_view",
      "title" => "Page Builder",
      "link"  => "pages"
    ) )
    ->new_item( "setting_links", array(
      "icon" => "drag_indicator",
      "title" => "Menu Builder",
      "link" => "menus"
    ) )
    ->new_item( "setting_links", array(
      "icon" => "translate",
      "title" => "Languages",
      "link" => "languages"
    ) )
    ->new_item( "setting_links", array(
      "icon" => "format_shapes",
      "title" => "Themes",
      "link" => "themes"
    ) )
    ->new_item( "setting_links", array(
      "icon"  => "extension",
      "title" => "Plugins",
      "link" => "plugins"
    ) )
    ->new_item( "setting_links", array(
      "icon" => "construction",
      "title" => "Tools",
      "ID"    => "tools_links",
      "childs" => array(
        array(
          "icon"  => "extension",
          "title" => "Tool Manager",
          "link" => "tools"
        )
      )
    ) )
    ->new_item( "setting_links", array(
      "icon" => "precision_manufacturing",
      "title" => "Cronjob",
      "ID"    => "cronjob_links",
      "childs" => array(
        array(
          "icon"  => "smart_toy",
          "title" => "Setting",
          "link" => "cronjob_setting"
        ),
        array(
          "icon"  => "view_timeline",
          "title" => "Run logs",
          "link" => "cronjobs"
        ),
      )
    ) );

    // content links
    $this
    ->new_group( "content_links", "section_links", array(
      "sb_family" => "content"
    ) )
    ->new_item( "content_links", array(
      "icon" => "article",
      "title" => "Blog",
      "ID" => "blog",
      "childs" => array(
        array(
          "title" => "List Posts",
          "icon" => "format_list_numbered",
          "link" => "blog_posts"
        ),
        array(
          "title" => "Categories",
          "icon" => "category",
          "link" => "blog_categories"
        ),
        array(
          "title" => "Tags",
          "icon" => "tag",
          "link" => "blog_tags"
        ),
      )
    ) )
    ->new_item( "content_links", array(
      "icon" => "grid_view",
      "title" => "Page Builder",
      "link" => "pages"
    ) )
    ->new_item( "content_links", array(
      "icon" => "drag_indicator",
      "title" => "Menu Builder",
      "link" => "menus"
    ) );

    // User links
    $this
    ->new_group( "users_links", "section_links", array(
      "sb_family" => "users"
    ) )
    ->new_item( "users_links", array(
      "icon"  => "key",
      "title" => "Roles & Access",
      "link"  => "user_roles"
    ) )
    ->new_item( "users_links", array(
      "ID" => "users_links",
      "icon"  => "person",
      "title" => "User List",
      "childs" => array(
        array(
          "link" => "user_list",
          "title" => "All users",
          "icon" => "person"
        ),
        array(
          "link" => "user_list?is_subscribed=yes",
          "title" => "Subscribed users",
          "icon" => "card_membership"
        ),
        array(
          "icon"  => "security",
          "title" => "Admins",
          "link"  => "user_list?role_type=admin"
        ),
        array(
          "icon"  => "engineering",
          "title" => "Moderators",
          "link"  => "user_list?role_type=moderator"
        ),
      )
    ) )
    ->new_item( "users_links", array(
      "ID" => "users_content",
      "icon"  => "folder_shared",
      "title" => "User Content",
      "childs" => array(
        array(
          "link" => "user_playlists",
          "title" => "Playlists",
          "icon" => "queue_music"
        ),
        array(
          "link" => "user_properties?type=playlist",
          "title" => "Playlist-Items",
          "icon" => "queue_music"
        ),
        array(
          "link" => "user_properties?type=pl_collab",
          "title" => "Playlist-Collabs",
          "icon" => "queue_music"
        ),
        array(
          "link" => "user_properties?type=playlist_k",
          "title" => "Playlist-Subs",
          "icon" => "queue_music"
        ),
        array(
          "link" => "user_properties?type=like",
          "title" => "Likes",
          "icon" => "favorite"
        ),
        array(
          "link" => "user_properties?type=purchase",
          "title" => "Purchases",
          "icon" => "shopping_bag"
        ),
        array(
          "link" => "user_properties?type=upload",
          "title" => "Uploads",
          "icon" => "cloud_upload"
        ),
        array(
          "link" => "user_properties?type=subscribe",
          "title" => "Relations",
          "icon" => "workspaces"
        ),
      )
    ) )
    ->new_item( "users_links", array(
      "ID" => "users_requests",
      "icon"  => "report",
      "title" => "User Requests",
      "childs" => array(
        array(
          "link" => "user_withdraws",
          "title" => "withdrawal",
          "icon" => "cases"
        )
      )
    ) );

    // Business links
    $this
    ->new_group( "business_links", "section_links", array(
      "sb_family" => "business"
    ) )
    ->new_item( "business_links", array(
      "icon"  => "star_rate",
      "title" => "Advertisement",
      "childs" => array(
        array(
          "icon" => "directions",
          "title" => "Campaigns",
          "link" => "ads_list"
        ),
        array(
          "icon" => "tune",
          "title" => "Setting",
          "link" => "ads_setting"
        ),
      )
    ) )
    ->new_item( "business_links", array(
      "icon"  => "payment",
      "title" => "Payments",
      "link" => "payments",
    ) )
    ->new_item( "business_links", array(
      "icon"  => "workspace_premium",
      "title" => "Subscription",
      "childs" => array(
        array(
          "icon" => "price_change",
          "title" => "Plan list",
          "link" => "user_subs_plans"
        ),
        array(
          "icon" => "check_box",
          "title" => "Subscription list",
          "link" => "user_subs"
        ),
        array(
          "link" => "user_list?is_subscribed=yes",
          "title" => "Subscribed users",
          "icon" => "card_membership"
        ),
      )
    ) )
    ->new_item( "business_links", array(
      "icon"  => "account_tree",
      "title" => "Transactions",
      "link"  => "transactions"
    ) )
    ->new_item( "business_links", array(
      "icon"  => "account_balance",
      "title" => "Payment Gateways",
      "ID" => "payment_gateways",
      "childs" => array(
        array(
          "title" => "Currencies",
          "icon" => "attach_money",
          "link" => "currencies"
        ),
        array(
          "title" => "Offline",
          "icon" => "local_atm",
          "link" => "gateway_offline"
        ),
        array(
          "title" => "Paypal",
          "icon" => "credit_card",
          "link" => "gateway_paypal"
        ),
        array(
          "title" => "Stripe",
          "icon" => "credit_card",
          "link" => "gateway_stripe"
        ),
      )
    ) );

    // Page-builder
    $this
    ->new_group( "page_builder", "page_builder_widgets", array(
      "sb_family" => "page_builder"
    ) );

  }

  public function new_group( $name, $type, $args=[] ){

    if ( in_array( $name, array_keys( $this->data ), true ) )
    unset( $this->data[ $name ] );

    if ( $type == "section_stats2" )
    $args["class"] = empty( $args["class"] ) ? "section_stats style2" : "{$args["class"]} section_stats style2";

    $this->data[ $name ] = array(
      "name" => $name,
      "type" => $type,
      "args" => $args,
      "items" => []
    );

    return $this;

  }
  public function new_item( $group_name, $args=[], $append=true ){

    if ( !in_array( $group_name, array_keys( $this->data ), true ) )
    fall( "Highlights: new_item: {$group_name} doesnt exists" );

    $group_data = $this->data[ $group_name ];

    $item_data = array(
      "type" => $group_data["type"],
      "group_name" => $group_name,
      "args" => $args
    );

    if ( !empty( $args["ID"] ) )
    $this->data[ $group_name ][ "items" ][ $args["ID"] ] = $item_data;
    else
    {
      if ( $append )
      $this->data[ $group_name ][ "items" ][] = $item_data;
      else
      array_unshift( $this->data[ $group_name ][ "items" ], $item_data );
    }

    return $this;

  }

  public function display_item( $data, $ii ){

    $type = false;
    $args = [];
    extract( $data );
    $icon = "";
    $title = "";
    $tip = "";
    $value = "";
    $bg = false;
    $link = "";
    $childs = [];
    $id = "";
    $graph_type = "";
    $graph_data = [];
    if ( $args )
    extract( $args );

    if ( !$bg ){
      $bg = $this->colors[ $ii % count( $this->colors ) ];
    }

    $str = "";
    $json = "";

    if ( $type == "section_stats2" && empty( $this->limits ) ){

      $str .= "<div class=\"section_stat\">" .
        "<span class=\"icon bg_{$bg}\"><span class=\"material-icons-outlined\">{$icon}</span></span>" .
        "<span class=\"title\">{$title}</span>" .
        "<span class=\"tip\">{$tip}</span>" .
        "<span class=\"value _n\">{$value}</span>" .
      "</div>";

    }
    elseif ( $type == "section_stats" && empty( $this->limits ) ){

      $str .= "<div class=\"section_stat\">" .
        "<span class=\"icon bg_{$bg}\"><span class=\"material-icons-outlined\">{$icon}</span></span>" .
        "<span class=\"title\">{$title}</span>" .
        "<span class=\"value\">{$value}</span>" .
      "</div>";

    }
    elseif ( $type == "section_graph" && empty( $this->limits ) ){

      $str .= "<div class=\"section_title\">" .
          $title .
          "<div class=\"value _n\">{$value}</div>" .
        "</div>" .
        "<div class=\"graph\" id=\"{$id}\" style=\"height: 140px\"></div>";

      $json = array(
        "action" => "graph",
        "graph_type" => $graph_type,
        "id" => $id,
        "graph_data" => $graph_data
      );

    }
    elseif ( $type == "section_links" ){

      $_section_links = [];

      if ( $link )
      $_section_links[] = parse_url( $link )["path"];

      if ( $childs ){
        foreach( $childs as $child )
        $_section_links[] = parse_url( $child["link"] )["path"];
      }

      if ( !empty( $this->limits ) ? count( $this->limits ) <= count( array_diff( $this->limits, $_section_links ) ) : false ){
        return [
          "str" => $str,
          "json" => $json
        ];
      }

      $wrapper = $childs ? "div" : "a";
      $str .= "<{$wrapper} class=\"link_group\" ".($link?"href=\"{$link}\"":"").">" .
        "<div class=\"p\">" .
          "<span class=\"icon bg_{$bg}\"><span class=\"material-icons-outlined\">{$icon}</span></span>" .
          "<span class=\"title\">{$title}</span>" .
        "</div>";

      if ( $childs ){
        $str .= "<div class=\"childs\">";
        foreach( $childs as $child ){
          if ( !empty( $this->limits ) ? !in_array( parse_url( $child["link"] )["path"], $this->limits, true ) : false ) continue;
          $str .= "<a href=\"{$child["link"]}\"><span class=\"c_icon\"><span class=\"material-icons-outlined\">{$child["icon"]}</span></span><span class=\"c_text\">{$child["title"]}</span></a>";
        }
        $str .= "</div>";
      }

      $str .= "</{$wrapper}>";

    }

    return [
      "str" => $str,
      "json" => $json
    ];

  }
  public function display( $sb_name=false, $return=false ){

    if ( !$this->data ) return;

    if ( bof()->user->get()->extra["role"] == "moderator" ){

      $moderator_type = bof()->user->get()->extra["moderator_roles"]["type"];
      $moderator_objects = $moderator_type == "all" ? bof()->bofAdmin->_get_objects() : bof()->user->get()->extra["moderator_roles"]["objects"];

      foreach( array_keys( $moderator_objects ) as $moderator_object_name ){

        $moderator_object = bof()->object->__get( $moderator_object_name );

        foreach( array(
          "list" => "list_page_url",
          "edit" => "edit_page_url"
        ) as $_key => $_key2 ){
          if ( !empty( $moderator_object->bof_admin()["config"][ $_key2 ] ) )
          $this->limits[] = $moderator_object->bof_admin()["config"][ $_key2 ];
        }

      }

      $_sbs = [];
      foreach( $this->data as $group ){

        if ( empty( $group["args"]["sb_family"] ) ) continue;
        $_sb_name = $group["args"]["sb_family"];

        if ( empty( $group["items"] ) ) continue;

        foreach ($group["items"] as $item) {
          $__item = bof()->highlights->display_item($item, 1);
          if ( !empty( $__item["str"] ) && !in_array( $_sb_name, $_sbs, true ) )
          $_sbs[] = $_sb_name;
        }

      }

    }

    $str = "";
    $str .= "<div class='_b_title'><span>".ucfirst($sb_name=="dashboard"?"Statistics":$sb_name)."</span></div>";

    $jsons = [];
    foreach( $this->data as $group ){

      if ( $sb_name ? ( !empty( $group["args"]["sb_family"] ) ? $group["args"]["sb_family"] != $sb_name : false ) : false ) continue;

      $str .= "<div id=\"{$group["name"]}\" class=\"{$group["type"]}".(!empty($group["args"]["class"])?" ".$group["args"]["class"]:"")."\" >";
      if ( !empty( $group["items"] ) ){
        $ii=0;
        foreach( $group["items"] as $item ){
          $__item = bof()->highlights->display_item( $item, $ii );
          $str .= $__item["str"];
          if ( $__item["json"] ) $jsons[] = $__item["json"];
          $ii++;
        }
      }
      $str .= "</div>";

      if ( $group["type"] == "page_builder_widgets" ){

        $_ws_and_gs = bof()->object->page->_get_widgets();
        $_widgets = $_ws_and_gs["items"];
        $_groups = $_ws_and_gs["groups"];

        $str = "<div class='_b_title'><span>Available widgets</span></div>";
        $str .= "<div id='page_builder'>";

        foreach ( $_groups as $_g_key => $_group ) {
          $str .= "<div class='_group'>";
            $str .= "<div class='_title'>";
            $str .= "<span class='material-icons-outlined'>{$_group["icon"]}</span>";
            $str .= $_group["title"];
            $str .= "</div>";
            $str .= "<div class='_widgets clearafter'>";
            foreach( $_widgets as $_w_key => $_widget ){
              if ( $_widget["group"] !== $_g_key ) continue;
              $str .= "<div class='_widget' data-name='{$_w_key}'>";
              $str .= "<span class='material-icons-outlined _icon'>{$_widget["icon"]}</span>";
              $str .= "<span class='_label'>{$_widget["label"]}</span>";
              $str .= "</div>";
            }
            $str .= "</div>";
          $str .= "</div>";
        }
        $str .= "</div>";

        $setting_str = $this->display( "setting", true );
        $str .= $setting_str["str"];

        $jsons = $_ws_and_gs;

      }

    }

    if ( $return )
    return [
      "str" => $str,
      "json" => $jsons,
      "sbs" => !empty( $_sbs ) ? $_sbs : false
    ];

  }

  public function getData(){
    return $this->data;
  }
  public function setData( $newData ){
    $this->data = $newData;
  }
  public function getDashData(){
    return $this->dashboard_content_highlights;
  }
  public function setDashData( $newData ){
    $this->dashboard_content_highlights = $newData;
  }

}

?>
