<?php

if ( !defined( "bof_root" ) ) die;

class messenger {

  public function setup(){

    bof()->object->core_files->add_object( "ms_group", bof_messenger_root . "/objects/object_group.php" );
    bof()->object->core_files->add_object( "ms_message", bof_messenger_root . "/objects/object_message.php" );

    if ( bof()->getName() == "bof_admin" )
		$this->setup_admin();

    else
		$this->setup_client();

	}

	protected function setup_admin(){

		$this->setup_bofAdmin();
		$this->setup_admin_app_pages();
		$this->setup_admin_highlights();
		$this->setup_admin_settings();
    $this->setup_admin_endpoints();

	}
	protected function setup_bofAdmin(){

    bof()->bofAdmin->_add_object( "ms_group", [ "seo" => false ] );
    bof()->bofAdmin->_add_object( "ms_message", [ "seo" => false ] );

    bof()->listen( "object_user", "admin_list_item_buttons_after", function( $method_args, &$method_result, $loader ){

      $method_result["zzx11"] = array(
        "label" => "Chats",
        "link" => "messenger?col_user={$method_args[0]["ID"]}"
      );

    } );
    bof()->listen( "object_menu", "get_app_pages_after", function( $args, &$pages ){
      $pages["messenger"] = "Messenger Page";
    } );

	}
	protected function setup_admin_app_pages(){

		bof()->listen( "client_config", "get_pages_after", function( $method_args, &$method_result, $loader ){

			if ( is_array( $method_result ) ){
				$method_result[ "messenger_setting" ] = array(
					"title" => "Messenger Setting",
					"url" => "^messenger_setting$",
					"link" => "messenger_setting",
					"theme_file" => "parts/content_setting",
					"becli" => array(
						(object) array(
							"endpoint" => "bofAdmin/setting/messenger_setting/",
							"key" => "setting"
						)
					),
					"__sb_family" => "users",
				);
				$method_result[ "messenger" ] = array(
					"title" => "Messenger",
					"url" => "^messenger$",
					"link" => "messenger",
          "theme_file_executer" => "content_table",
					"theme_file" => web_address . "plugins/bof_messenger/theme/admin_theme",
          "theme_args" => (object) array(
            "use_base" => false,
          ),
          "extenders" => (object) array(
            "messenger_admin_css" => (object) array(
              "type" => "css",
              "name" => "messenger_admin_css",
              "path" => web_address . "plugins/bof_messenger/theme/admin_theme.css",
              "dir" => false
            ),
            "messenger_admin_js" => (object) array(
              "type" => "js",
              "name" => "bof_messenger_admin_js",
              "path" => web_address . "plugins/bof_messenger/theme/admin_theme.js",
              "dir" => false
            )
          ),
          "body_class" => [ "hide_header", "no_main_content_padding" ],
					"becli" => array(
						(object) array(
							"endpoint" => "bofAdmin/list/ms_group/?\$bof ? urlData^url^query_s\$",
							"key" => "content",
						)
					),
          "events" => (object) array(
            "ready" => "bof_messenger_admin_js.set",
            "unloading" => "bof_messenger_admin_js.unset",
          ),
					"__sb_family" => "users",
				);
			}

		} );

	}
	protected function setup_admin_highlights(){

		bof()->listen( "highlights", "display_pre", function( $method_args, $method_result, $loader ){

			bof()->highlights
			->new_item( "users_links", array(
        "ID" => "zzz2",
				"icon" => "send",
				"title" => "Messenger",
        "link" => "messenger"
			), false );

		} );

	}
	protected function setup_admin_settings(){}
  protected function setup_admin_endpoints(){}

  protected function setup_client(){

    $this->setup_bofClient();
    $this->setup_client_endpoints();
    $this->setup_client_pages();

    bof()->listen( "object_menu", "get_after", function( $method_args, &$method_result, $loader ){

      $ID = $method_args[0];
      if ( $ID != 3 ) return;

      $method_result[] = array(
        "href" => "",
        "icon" => "",
        "title" => "",
        "class" => "_seperator"
      );

      $method_result[] = array(
        "href" => "messenger",
        "icon" => "chat",
        "title" => bof()->object->language->turn( "messenger", [], [ "uc_first" => true, "lang" => "users" ] )
      );

    } );
    bof()->listen( "bofClient", "_ob_after", function( $method_args, &$method_result, $loader ){

      $ot = $method_args[0];
      $json = $loader->execute->get_data("json");

      if ( !empty( $json["success"] ) && !empty( $method_result["raw"] ) ){

        $item = $method_result["raw"];

        if ( $loader->user->get()->ID ){

          if ( $ot == "user" ? $item["ID"] == $loader->user->get()->ID : false ){
            $json["buttons"]["items"] = array_merge( array(
              "message" => array(
                "icon" => "chat",
                "title" => turn( "messenger" ),
                "url" => "messenger",
              )
            ), $json["buttons"]["items"] );
          }

          elseif ( $ot == "user" ? $item["ID"] != $loader->user->get()->ID : false ){
            $json["buttons"]["items"] = array_merge( array(
              "message" => array(
                "icon" => "chat-processing",
                "title" => turn( "message" ),
                "url" => "messenger?direct={$item["hash"]}"
              )
            ), $json["buttons"]["items"] );
          }

          elseif ( in_array( $ot, [ "m_artist", "m_album", "m_track", "p_show", "p_creator", "p_podcaster", "p_episode", "r_station", "a_book" ], true ) ) {

            $json["buttons"]["items"] = array_merge(
              array_slice( $json["buttons"]["items"], 0, array_search( "share", array_keys( $json["buttons"]["items"] ) ) + 1 ),
              array(
                "message" => array(
                  "icon" => "send",
                  "title" =>  bof()->object->language->turn( "send", [], [ "uc_first" => true, "lang" => "users" ] ),
                  "attr" => "onClick=\"window.bof_messenger_mini_js.send('{$ot}','{$item["hash"]}')\"",
                )
              ),
              array_slice( $json["buttons"]["items"], array_search( "share", array_keys( $json["buttons"]["items"] ) ) + 1 )
            );

          }

        }

      }

      $loader->execute->set_data( "json", $json );

    } );
    bof()->listen( "theme", "get_after", function( $method_args, &$config ){

      if ( empty( $config["assets"] ) ) $config["assets"] = [];
      if ( empty( $config["assets"]["js"] ) ) $config["assets"]["js"] = [];
      if ( empty( $config["assets"]["css"] ) ) $config["assets"]["css"] = [];

      $version = bof()->plug->read( "plugin", "bof_messenger" )["version"];

      $config["assets"]["js"][] = array(
        "name" => "bof_messenger_mini_js",
        "path" => "messenger_mini.js" . "?bof_version=" . ( !production ? "dont_cache" : $version ),
        "base" => web_address . "plugins/bof_messenger/theme/",
        "dir" => false,
        "version" => bof()->plug->read( "plugin", "messenger" )["version"]
      );

      $config["assets"]["css"][] = array(
        "type" => "css",
        "name" => "messenger_css",
        "path" => web_address . "plugins/bof_messenger/theme/messenger.css",
        "dir" => false,
        "version" => bof()->plug->read( "plugin", "messenger" )["version"]
      );

    } );

  }
  protected function setup_client_pages(){

    bof()->client_config->add_page( "messenger", array(
      "title_hook" => "messenger",
      "url" => "^messenger$",
      "theme_file" => web_address . "plugins/bof_messenger/theme/messenger",
      "theme_args" => (object) array(
        "use_base" => false,
      ),
      "extenders" => (object) array(
        "messenger_js" => (object) array(
          "type" => "js",
          "name" => "bof_messenger_js",
          "path" => web_address . "plugins/bof_messenger/theme/messenger.js",
          "dir" => false
        )
      ),
      "body_class" => [],
      "becli" => array(),
      "events" => (object) array(
        "ready" => "bof_messenger_js.ready",
        "unloading" => "bof_messenger_js.unloading",
      ),
      "ignore_history" => true,
      "ignore_history_restore" => true
    ) );

  }
  protected function setup_client_endpoints(){

    // Actions
    bof()->object->endpoint->add( "messenger", array(
      "url" => "messenger",
      "groups" => [ "user" ],
      "executers" => array(
        bof_messenger_root . "/endpoints/endpoint_messenger.php"
      )
    ) );

    // Group Actions
    bof()->object->endpoint->add( "messenger_group_messages", array(
      "url" => "messenger_group_messages",
      "groups" => [ "user" ],
      "executers" => array(
        bof_messenger_root . "/endpoints/endpoint_messenger_group_messages.php"
      )
    ) );
    bof()->object->endpoint->add( "messenger_group_message_new", array(
      "url" => "messenger_group_message_new",
      "groups" => [ "user" ],
      "executers" => array(
        bof_messenger_root . "/endpoints/endpoint_messenger_group_message_new.php"
      )
    ) );
    bof()->object->endpoint->add( "messenger_group_list", array(
      "url" => "messenger_group_list",
      "groups" => [ "user" ],
      "executers" => array(
        bof_messenger_root . "/endpoints/endpoint_messenger_group_list.php"
      )
    ) );
    bof()->object->endpoint->add( "messenger_group_members_list", array(
      "url" => "messenger_group_members_list",
      "groups" => [ "user" ],
      "executers" => array(
        bof_messenger_root . "/endpoints/endpoint_messenger_group_members_list.php"
      )
    ) );
    bof()->object->endpoint->add( "messenger_group_members_remove", array(
      "url" => "messenger_group_members_remove",
      "groups" => [ "user" ],
      "executers" => array(
        bof_messenger_root . "/endpoints/endpoint_messenger_group_members_remove.php"
      )
    ) );
    bof()->object->endpoint->add( "messenger_group_members_add", array(
      "url" => "messenger_group_members_add",
      "groups" => [ "user" ],
      "executers" => array(
        bof_messenger_root . "/endpoints/endpoint_messenger_group_members_add.php"
      )
    ) );
    bof()->object->endpoint->add( "messenger_group_setting_load", array(
      "url" => "messenger_group_setting_load",
      "groups" => [ "user" ],
      "executers" => array(
        bof_messenger_root . "/endpoints/endpoint_messenger_group_setting_load.php"
      )
    ) );
    bof()->object->endpoint->add( "messenger_group_new", array(
      "url" => "messenger_group_new",
      "groups" => [ "user" ],
      "executers" => array(
        bof_messenger_root . "/endpoints/endpoint_messenger_group_new.php"
      )
    ) );
    bof()->object->endpoint->add( "messenger_group_setting_save", array(
      "url" => "messenger_group_setting_save",
      "groups" => [ "user" ],
      "executers" => array(
        bof_messenger_root . "/endpoints/endpoint_messenger_group_setting_save.php"
      )
    ) );
    bof()->object->endpoint->add( "messenger_share", array(
      "url" => "messenger_share",
      "groups" => [ "user" ],
      "executers" => array(
        bof_messenger_root . "/endpoints/endpoint_messenger_share.php"
      )
    ) );

  }
  protected function setup_bofClient(){
    bof()->bofClient->_add_object( "ms_group", [ "single" => false, "search" => false ] );
  }

}

?>
