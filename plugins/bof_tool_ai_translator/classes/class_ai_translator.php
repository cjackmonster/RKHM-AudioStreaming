<?php

if ( !defined( "bof_root" ) ) die;

class ai_translator {

	public function setup(){
		if ( bof()->getName() == "bof_admin" )
		$this->setup_admin();
		$this->setup_cronjob();

	}
	protected function setup_admin(){

		bof()->object->endpoint->add( "bof_ai_translator_css", array(
			"url" => "bof_ai_translator.css",
			"response_type" => "file",
			"response_data" => array(
				"path" => bof_ai_translator . "/assets/admin.css",
				"mime_type" => "text/css; charset=utf-8"
			),
		) );

		bof()->object->endpoint->add( "bof_ai_translator_js", array(
			"url" => "bof_ai_translator.js",
			"response_type" => "file",
			"response_data" => array(
				"path" => bof_ai_translator . "/assets/admin.js"
			),
		) );

		bof()->object->endpoint->add( "ai_translator_cancel", array(
      "url" => "ai_translator_cancel",
      "groups" => [ "admin" ],
      "executers" => array(
        bof_ai_translator . "/endpoints/endpoint_ai_translator_cancel.php"
      )
    ) );

		bof()->listen( "highlights", "display_pre", function( $method_args, $method_result, $loader ){

			$highlights = $loader->highlights->getData();
			$highlights[ "setting_links" ][ "items" ][ "tools_links" ][ "args" ][ "childs" ][] = array(
				"icon" => "g_translate",
				"title" => "AI Translator",
				"link" => "ai_translator_setting"
			);
			bof()->highlights->setData( $highlights );

		} );


		bof()->listen( "client_config", "get_pages_after", function( $method_args, &$method_result, $loader ){

			if ( is_array( $method_result ) ){
				$method_result[ "ai_translator" ] = array(
					"title" => "AI Translator Setting",
					"url" => "^ai_translator_setting$",
					"link" => "ai_translator_setting",
					"theme_file" => "parts/content_setting",
					"extenders" => (object) array(
						"bof_ai_translator_css" => (object) array(
							"type" => "css",
							"name" => "bof_ai_translator",
							"path" => admin_endpoint_address . "bof_ai_translator.css",
							"dir" => false
						),
						"bof_ai_translator_js" => (object) array(
							"type" => "js",
							"name" => "bof_ai_translator",
							"path" => admin_endpoint_address . "bof_ai_translator.js",
							"dir" => false
						)
					),
					"becli" => array(
						(object) array(
							"endpoint" => "bofAdmin/setting/ai_translator/",
							"key" => "setting"
						)
					),
					"events" => (object) array(
						"ready" => "bof_ai_translator.set",
						"unloading" => "bof_ai_translator.unset",
					),
					"__sb_family" => "setting",
				);
			}

		} );

		$setting = array(
			"functions" => array(
				"ui_pre" => function( $groups ){

					$langs = bof()->object->language->select(
						array(
							"code2_not" => "en"
						),
						array(
							"limit" => false,
							"single" => false,
							"clean" => false
						)
					);

					if ( !empty( $langs ) ){
						foreach( $langs as $lang ){
							$groups["ai_translator"]["inputs"]["target_lang"]["input"]["options"][] = [ $lang["code2"], $lang["name"] ];
						}
					}

					$aitor_config = bof()->object->db_setting->get( "aitor_config" );
					if ( !empty( $aitor_config ) ){
						foreach( $aitor_config as $icN => $ic ){
							if ( !empty( $groups["ai_translator"]["inputs"][ $icN ]["input"] ) )
							$groups["ai_translator"]["inputs"][ $icN ]["input"]["value"] = $ic;
						}
					}

					return $groups;

				},
				"ui_after" => function( $groups, &$_output ){

					$_output["state"] = bof()->object->db_setting->get( "aitor_state" );
					if ( $_output["state"] == 2 ){
						$aitor_state = bof()->object->db_setting->select(["var"=>"aitor_state"]);
						if ( !empty( $aitor_state["time_update"] ) ? ( time() - strtotime( $aitor_state["time_update"] ) > 6*60*60 ) : false ){
							$_output["state"] = 0;
							bof()->object->db_setting->set( "aitor_state", 0 );
						}
					}

					$get_logs = bof()->db->_select( array(
						"table" => "_bof_log_cronjob_p",
						"where" => array(
							[ "GID", "IN", "SELECT ID FROM _bof_log_cronjob_g WHERE `code` = 'ai_translator' AND time_start > SUBDATE( now(), INTERVAL 4 DAY )", true ]
						),
						"order_by" => "time_add",
						"order" => "DESC",
						"limit" => 200,
						"single" => false
					) );

					if ( $get_logs ){
						foreach( $get_logs as &$log ){
							$log = "<i>" . bof()->general->passed_time_from_time_hr( $log["time_add"] ) . "</i> -> " . $log["text"];
						}
						unset( $log );
					}

					$_output["logs"] = $get_logs;

				},
				"be_after" => function( $groups, $items ){

					if ( empty( $items["report"]["fail"] ) ){

						if ( bof()->user->check()->ID != 1 ){
							bof()->api->set_error("Only root-admin can do this");
							return;
						}

						$state = bof()->object->db_setting->get( "aitor_state" );
						if ( $state ? $state > 0 : false ){
							bof()->api->set_error("Already in-progress or queued");
							return;
						}

						bof()->object->db_setting->set( "aitor_state", 1 );
						bof()->api->set_message("ok");

						bof()->object->db_setting->set( "aitor_config", json_encode( $items["data"] ), "json" );

					}

					return $items;

				}
			),
			"groups" => array(
				"ai_translator" => array(
					"title" => "AI Translator Translator",
					"icon" => "g_translate",
					"inputs" => array(
						"target_lang" => array(
							"title" => "Target language",
							"tip" => "Select the language you want to translate to. Language should have been added in \"Setting -> Languages\" before you can translate into it",
							"input" => array(
								"name" => "target_lang",
								"type" => "select_i",
								"options" => []
							),
							"validator" => array(
								"string",
								array(
									"min_length" => 2,
									"max_length" => 2
								)
							)
						),
						"translate_language_items" => array(
							"title" => "Translate language items",
							"tip" => "Translate untranslated items available in \"Setting -> Languages -> Target language\"",
							"input" => array(
								"name" => "translate_language_items",
								"type" => "checkbox",
							),
							"validator" => array(
								"boolean",
								array(
									"empty()",
								)
							)
						),
						"translate_pb_items" => array(
							"title" => "Translate PageBuilder items",
							"tip" => "Translate untranslated titles & sub-titles available in \"Setting -> PageBuilder\"",
							"input" => array(
								"name" => "translate_pb_items",
								"type" => "checkbox",
							),
							"validator" => array(
								"boolean",
								array(
									"empty()",
								)
							)
						),
						"translate_mb_items" => array(
							"title" => "Translate MenuBuilder items",
							"tip" => "Translate untranslated titles available in \"Setting -> MenuBuilder\"",
							"input" => array(
								"name" => "translate_mb_items",
								"type" => "checkbox",
							),
							"validator" => array(
								"boolean",
								array(
									"empty()",
								)
							)
						),
						"translate_overwrite" => array(
							"title" => "Overwrite translated items",
							"tip" => "If left unchecked, AI Translator will ignore all already translated items otherwise all items, including already translated ones will be translated into target language",
							"input" => array(
								"name" => "translate_overwrite",
								"type" => "checkbox",
							),
							"validator" => array(
								"boolean",
								array(
									"empty()",
								)
							)
						)
					)
				),
				"openai" => array(
					"title" => "OpenAI",
					"icon" => "g_translate",
					"inputs" => array(
						"aitor_openai_key" => array(
							"title" => "OpenAI Key",
							"col_name" => "aitor_openai_key",
							"input" => array(
								"name" => "aitor_openai_key",
								"type" => "text",
							),
							"validator" => array(
								"string",
								array(
									"empty()",
								)
							)
						),
						"aitor_openai_model" => array(
							"title" => "ChatGPT Model",
							"col_name" => "aitor_openai_model",
							"input" => array(
								"name" => "aitor_openai_model",
								"type" => "select_i",
								"options" => array(
									[ "_gpt_3", "GPT 3.5 Turbo" ],
									[ "_gpt_4", "GPT 4 Turbo" ]
								)
							),
							"validator" => array(
								"in_array",
								array(
									"values" => [ "_gpt_3", "_gpt_4" ]
								)
							)
						),
					)
				),
				"ai_translator_result" => array(
					"title" => "AI Translator :: Cronjob Logs",
					"icon" => "g_translate",
					"inputs" => [],
				),
			),
			"action_btn_title" => "Start"
		);
		bof()->bofAdmin->_add_setting( "ai_translator", $setting );


	}
	protected function setup_cronjob(){
		bof()->listen( "cronjob", "get_jobs_after", function( $method_args, &$jobs, $loader ){

			$state = bof()->object->db_setting->get( "aitor_state" );

			if ( $state === 1 || $state === "1" ){

				$jobs["ai_translator"] = array(
					"title" => "AI Translator",
					"interval" => 1,
					"exe" => function( $PID, $GID ){
						bof()->ai_translator->run_cronjob( $PID, $GID );
					}
				);

			}

		} );
	}

	public function run_cronjob( $PID, $GID ){

		bof()->listen( "ai", "fee_after", function( $method_args, $feeLogID ){
			$_args = bof()->ai->get_fee_args( "aitor" );
			list( $service, $core, $action, $fees ) = $method_args;
			bof()->cronjob->log_p( $_args["PID"], $_args["GID"], "OpenAI fee: {$fees["total_price"]}$" );
		} );

		bof()->object->db_setting->set( "aitor_state", 2 );
		$aitor_config = bof()->object->db_setting->get( "aitor_config" );

		if ( !empty( $aitor_config["translate_language_items"] ) )
		$this->translate_language_items( $PID, $GID, $aitor_config["target_lang"], !empty( $aitor_config["translate_overwrite"] ) );

		if ( !empty( $aitor_config["translate_pb_items"] ) )
		$this->translate_pagebuilder_items( $PID, $GID, $aitor_config["target_lang"], !empty( $aitor_config["translate_overwrite"] ) );

		if ( !empty( $aitor_config["translate_mb_items"] ) )
		$this->translate_menubuilder_items( $PID, $GID, $aitor_config["target_lang"], !empty( $aitor_config["translate_overwrite"] ) );

		bof()->object->db_setting->set( "aitor_state", 0 );

	}
	protected function translate_language_items( $PID, $GID, $target_language, $overwrite ){

		$bID = 0;
		while( true ){

			$state = bof()->object->db_setting->get( "aitor_state", false, false, true );
			if ( $state != 2 ){
				bof()->cronjob->log_p( $PID, $GID, "Translate language items: Progress canceled" );
				break;
			}

			$whereArray = array(
				"lang_code2" => "en",
				[ "ID", ">", $bID ],
			);

			if ( !$overwrite )
			$whereArray[] = [ "hook", "NOT IN", "SELECT hook FROM _d_languages_items as x2 WHERE x2.lang_code2 = '{$target_language}' AND x2.text IS NOT NULL AND x2.text != '' AND x2.text != ' '", true ];

			$get_items = bof()->object->language_item->select(
				$whereArray,
				array(
					"limit" => 50,
					"single" => false,
					"order_by" => "ID",
					"order" => "ASC"
				)
			);

			if ( !$get_items ){
				bof()->cronjob->log_p( $PID, $GID, "Translate language items: All items checked" );
				break;
			}

			$last_item = end( $get_items );
			$bID = $last_item["ID"];

			$translate_array = [];
			foreach( $get_items as $item ){
				$translate_array[ $item["hook"] ] = $item["text"];
			}

			try {
				$this->translate( $PID, $GID, $target_language, $translate_array );
			} catch( Exception|bofException $err ){
				bof()->cronjob->log_p( $PID, $GID, "Translation went wrong. Skipping to next part. Wait, disable overwrite and rerun the tool: " . $err->getMessage() );
			}

		}


	}
	protected function translate_pagebuilder_items( $PID, $GID, $target_language, $overwrite ){

		$get_all_widgets = bof()->object->page_widget->select(
			array(),
			array(
				"empty_select" => true,
				"single" => false,
				"limit" => false
			)
		);

		if ( empty( $get_all_widgets ) )
		return false;

		foreach( $get_all_widgets as $widget ){

			$widget_a = $widget["args_decoded"];
			if ( empty( $widget_a ) ) continue;
			if ( empty( $widget_a["wid_title"] ) ) continue;
			if ( !empty( $widget_a["wid_title_{$target_language}"] ) && !$overwrite ) continue;

			bof()->cronjob->log_p( $PID, $GID, "Translate PageBuilder items: Checking widget `{$widget_a["wid_title"]}`" );

			$widget_translate_these = [];

			$varNames = [ "wid_title", "wid_sub_data", "btn_title_1", "btn_title_2" ];
			foreach( $varNames as $varName ){
				if ( !empty( $widget_a[ $varName ] ) && ( empty( $widget_a[ "{$varName}_{$target_language}" ] ) || $overwrite ) ){
					$widget_translate_these[ "var_{$varName}" ] = $widget_a[ $varName ];
				}
			}

			$features = false;
			if ( !empty( $widget_a["features"] ) ){
				try {
					$features = json_decode( urldecode( $widget_a["features"] ), true );
					foreach( $features as $ftI => $feature ){
						foreach( [ "title", "text" ] as $varName2 ){
							if ( !empty( $feature[ $varName2 ] ) && ( empty( $feature[ "{$varName2}_{$target_language}" ] ) || $overwrite ) ){
								$widget_translate_these[ "ft_{$ftI}_{$varName2}" ] = $feature[ $varName2 ];
							}
						}
					}
				} catch( Exception|bofException|Error $err ){}
			}

			if ( !empty( $widget_translate_these ) ){

				$state = bof()->object->db_setting->get( "aitor_state", false, false, true );
				if ( $state != 2 ){
					bof()->cronjob->log_p( $PID, $GID, "Translate PageBuilder items: Progress canceled" );
					break;
				}

				try {

					$translate = $this->translate( $PID, $GID, $target_language, $widget_translate_these, true );

					foreach( $widget_translate_these as $k => $v ){
						if ( bof()->general->startsWith( $k, "var_" ) )
						$widget_a[ substr( $k, 4 ) . "_{$target_language}" ] = $translate[$k];
						elseif( bof()->general->startsWith( $k, "ft_" ) ){
							list( $_i, $ftID, $ftK ) = explode( "_", $k );
							$features[ $ftID ][ "{$ftK}_{$target_language}" ] = $translate[$k];
						}
					}

					if ( !empty( $features ) )
					$widget_a["features"] = rawurlencode( json_encode( $features ) );

					bof()->object->page_widget->update(
						array(
							"ID" => $widget["ID"]
						),
						array(
							"args" => json_encode( $widget_a )
						)
					);

					bof()->cronjob->log_p( $PID, $GID, "Translate PageBuilder items: Translated `{$widget_a["wid_title"]}`" );

				} catch( Exception|bofException $err ){
					bof()->cronjob->log_p( $PID, $GID, "Translate PageBuilder items: Translating `{$widget_a["wid_title"]}` failed: " . $err->getMessage() );
				}

			}
			else {
				bof()->cronjob->log_p( $PID, $GID, "Translate PageBuilder items: Skipped `{$widget_a["wid_title"]}`" );
			}

		}

	}
	protected function translate_menubuilder_items( $PID, $GID, $target_language, $overwrite  ){

		$get_all_menus = bof()->object->menu->select(
			array(),
			array(
				"empty_select" => true,
				"single" => false,
				"limit" => false
			)
		);

		if ( empty( $get_all_menus ) )
		return false;

		foreach( $get_all_menus as $menu ){

			$menu_translate_these = [];

			if ( empty( $menu["structure_decoded"] ) ) continue;

			bof()->cronjob->log_p( $PID, $GID, "Translate MenuBuilder items: Checking `{$menu["name"]}`" );

			foreach( $menu["structure_decoded"] as $menuI => $menu_ip ){
				if ( !empty( $menu_ip["title"] ) && ( empty( $menu_ip["title_{$target_language}"] ) || $overwrite ) ){
					$menu_translate_these[ "{$menuI}_title" ] = $menu_ip["title"];
				}
				if ( !empty( $menu_ip["childs"] ) ){
					foreach( $menu_ip["childs"] as $childI => $child ){
						if ( !empty( $child["title"] ) && ( empty( $child["title_{$target_language}"] ) || $overwrite ) ){
							$menu_translate_these[ "{$menuI}_{$childI}_title" ] = $child["title"];
						}
					}
				}
			}

			if ( !empty( $menu_translate_these ) ){

				$state = bof()->object->db_setting->get( "aitor_state", false, false, true );
				if ( $state != 2 ){
					bof()->cronjob->log_p( $PID, $GID, "Translate MenuBuilder items: Progress canceled" );
					break;
				}

				try {

					$translate = $this->translate( $PID, $GID, $target_language, $menu_translate_these, true );
					foreach( $menu["structure_decoded"] as $menuI => $menu_ip ){
						if ( !empty( $translate["{$menuI}_title"] ) ){
							$menu["structure_decoded"][$menuI]["title_{$target_language}"] = $translate["{$menuI}_title"];
						}
						if ( !empty( $menu_ip["childs"] ) ){
							foreach( $menu_ip["childs"] as $childI => $child ){
								if ( !empty( $translate["{$menuI}_{$childI}_title"] ) ){
									$menu["structure_decoded"][$menuI]["childs"][$childI]["title_{$target_language}"] = $translate["{$menuI}_{$childI}_title"];
								}
							}
						}
					}

					bof()->object->menu->update(
						array(
							"ID" => $menu["ID"]
						),
						array(
							"structure" => json_encode( $menu["structure_decoded"] )
						),
						array(
							"structure" => json_encode( $menu["structure_decoded"] )
						),
					);

					bof()->cronjob->log_p( $PID, $GID, "Translate MenuBuilder items: Translated" );


				} catch( Exception|bofException $err ){
					bof()->cronjob->log_p( $PID, $GID, "Translate MenuBuilder items: Failed: " . $err->getMessage() );
				}

			} else {
				bof()->cronjob->log_p( $PID, $GID, "Translate MenuBuilder items: Already translated. Skipped" );
			}

		}

	}

	protected function translate( $PID, $GID, $target_language, $items, $return=false ){

		$ask_the_ai = bof()->ai->__reset()
		->set_key( "openai_key", bof()->object->db_setting->get( "aitor_openai_key" ) )
		->set_setting( "text.core", "openai" )
		->set_setting( "text.openai_model", bof()->object->db_setting->get( "aitor_openai_model" ) )
		->set_fee_args( "aitor", array(
			"PID" => $PID,
			"GID" => $GID
		) )
		->text->generateFromText( is_array( $items ) ? json_encode( $items ) : $items, array(
			"prompt_system" => is_array( $items ) ? 'A translator bot that takes in a JSON. JSON decoded, is an array in following format for example: { "hook": "translation", "hook2": "translation2" }. Translates the value part of array to '.$target_language.' and respond with the raw JSON string. Don\'t talk or give additional information. The translations will be used in a website, so choose words that are more commonly used in websites. Sometimes there are dynamic parmeters in the translation. These variables are surronded by % for example in the following, there is no need to translate %name%: { "hook": "Hello %name%" }' : 'Translate given string to '.$target_language.' language to be used on a website. Don\'t talk or give additional information',
      "json" => is_array( $items )
		) );

		if ( !$return ){
			foreach( $items as $k => $enVal ){
				if ( !empty( $ask_the_ai[$k] ) ){
					bof()->object->language_item->create(
						array(
							"full_hook" => $target_language . "_" . $k,
						),
						array(
							"lang_code2" => $target_language,
							"text" => $ask_the_ai[$k],
							"hook" => $k
						),
						array(
							"lang_code2" => $target_language,
							"text" => $ask_the_ai[$k],
							"hook" => $k
						),
					);
					bof()->cronjob->log_p( $PID, $GID, "Translated `{$enVal}` -> `{$ask_the_ai[$k]}`" );
				}
			}
			return true;
		}

		return $ask_the_ai;

	}

}

?>
