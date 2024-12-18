<?php

if ( !defined( "bof_root" ) ) die;

class curl_proxy {

	public function setup(){

		if ( bof()->getName() == "bof_admin" )
		$this->setup_admin();

		bof()->listen( "curl", "exe_pre", function(){

			$activated = bof()->object->db_setting->get("cup");

			if ( !$activated ) return;

			$type = bof()->object->db_setting->get("cup_type");
			$addr = bof()->object->db_setting->get("cup_addr");
			$port = bof()->object->db_setting->get("cup_port");
			$user = bof()->object->db_setting->get("cup_user");
			$pass = bof()->object->db_setting->get("cup_pass");

			if ( !$addr ) return;

			bof()->curl->set_args( array(
				"proxy" => array(
					"type" => $type == "http" ? CURLPROXY_HTTP : ( $type == "socks4" ? CURLPROXY_SOCKS4 : CURLPROXY_SOCKS5 ),
					"address" => $addr,
					"port" => $port,
					"username" => $user,
					"password" => $pass
				)
			) );

		} );

	}
	protected function setup_admin(){

		bof()->listen( "highlights", "display_pre", function( $method_args, $method_result, $loader ){

			$highlights = $loader->highlights->getData();
			$highlights[ "setting_links" ][ "items" ][ "tools_links" ][ "args" ][ "childs" ][] = array(
				"title" => "cURL Proxy",
				"icon" => "cloud_sync",
				"link" => "curl_proxy"
			);
			$highlights[ "setting_links" ][ "items" ][ "general_links" ][ "args" ][ "childs" ][] = array(
				"title" => "cURL Proxy",
				"icon" => "cloud_sync",
				"link" => "curl_proxy"
			);
			bof()->highlights->setData( $highlights );

		} );
		bof()->listen( "client_config", "get_pages_after", function( $method_args, &$method_result, $loader ){

			if ( is_array( $method_result ) ){
				$method_result[ "curl_proxy" ] = array(
					"title" => "cURL Proxy",
					"url" => "^curl_proxy$",
					"link" => "curl_proxy",
					"theme_file" => "parts/content_setting",
					"becli" => array(
						(object) array(
							"endpoint" => "bofAdmin/setting/curl_proxy/",
							"key" => "setting"
						)
					),
					"__sb_family" => "setting",
				);
			}

		} );

		$setting = array(
	    "groups" => array(
				"setting" => array(
		      "title" => "cURL Proxy",
		      "icon" => "cloud_sync",
		      "inputs" => array(
						"cup" => array(
              "title" => "Active",
							"col_name" => "cup",
              "input" => array(
                "name" => "cup",
                "type" => "checkbox",
              ),
              "validator" => array(
                "boolean",
                array(
									"empty()",
									"int" => true
                )
              )
            ),
						"cup_type" => array(
              "title" => "Type",
							"col_name" => "cup_type",
              "input" => array(
                "name" => "cup_type",
                "type" => "select_i",
								"value" => "http",
								"options" => array(
									[ "http", "HTTP" ],
									[ "socks4", "SOCKS4" ],
									[ "socks5", "SOCKS5" ],
								)
              ),
              "validator" => array(
                "in_array",
                array(
									"values" => [ "http", "socks4", "socks5" ]
                )
              )
            ),
						"cup_addr" => array(
							"title" => "Address",
							"col_name" => "cup_addr",
							"input" => array(
								"name" => "cup_addr",
								"type" => "text",
							),
							"validator" => array(
								"string",
								array(
									"empty()"
								)
							)
						),
						"cup_port" => array(
							"title" => "Port",
							"col_name" => "cup_port",
							"input" => array(
								"name" => "cup_port",
								"type" => "digit",
							),
							"validator" => array(
								"int",
								array(
									"empty()"
								)
							)
						),
						"cup_username" => array(
							"title" => "Username",
							"col_name" => "cup_username",
							"input" => array(
								"name" => "cup_username",
								"type" => "text",
							),
							"validator" => array(
								"string",
								array(
									"empty()"
								)
							)
						),
						"cup_password" => array(
							"title" => "Password",
							"col_name" => "cup_password",
							"input" => array(
								"name" => "cup_password",
								"type" => "text",
							),
							"validator" => array(
								"string",
								array(
									"empty()"
								)
							)
						),
          )
		    ),
			),
			"action_btn_title" => "Save"
	  );

		bof()->bofAdmin->_add_setting( "curl_proxy", $setting );

	}

}

?>
