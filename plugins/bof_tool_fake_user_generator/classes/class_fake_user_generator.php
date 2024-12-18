<?php

if ( !defined( "bof_root" ) ) die;

class fake_user_generator {

	public function setup(){

		if ( bof()->getName() == "bof_admin" )
		$this->setup_admin();

	}
	protected function setup_admin(){

		bof()->listen( "highlights", "display_pre", function( $method_args, $method_result, $loader ){

			$highlights = $loader->highlights->getData();
			$highlights[ "setting_links" ][ "items" ][ "tools_links" ][ "args" ][ "childs" ][] = array(
				"title" => "Fake user generator",
				"icon" => "manage_accounts",
				"link" => "fake_user_generator"
			);
			bof()->highlights->setData( $highlights );

		} );
		bof()->listen( "client_config", "get_pages_after", function( $method_args, &$method_result, $loader ){

			if ( is_array( $method_result ) ){
				$method_result[ "fake_user_generator" ] = array(
					"title" => "Fake user generator",
					"url" => "^fake_user_generator$",
					"link" => "fake_user_generator",
					"theme_file" => "parts/content_setting",
					"becli" => array(
						(object) array(
							"endpoint" => "bofAdmin/setting/fake_user_generator/",
							"key" => "setting"
						)
					),
					"__sb_family" => "setting",
				);
			}

		} );

		$setting = array(
	    "groups" => array(
				"gateway" => array(
		      "title" => "Create fake users",
		      "icon" => "manage_accounts",
		      "inputs" => array(
						"fug_count" => array(
              "title" => "Number",
              "tip" => "How many fake users do you wish to create?",
              "input" => array(
                "name" => "fug_count",
                "type" => "digit",
								"value" => 10
              ),
              "validator" => array(
                "int",
                array(
									"min" => 1
                )
              )
            ),
						"fug_locale" => array(
              "title" => "Locale",
              "tip" => "This will only effect NAME, not email and username and etc",
              "input" => array(
                "name" => "fug_locale",
                "type" => "select",
								"value" => "en_US",
								"options" => [["ar_EG","ar_EG"],["ar_JO","ar_JO"],["ar_SA","ar_SA"],["at_AT","at_AT"],["bg_BG","bg_BG"],["bn_BD","bn_BD"],["cs_CZ","cs_CZ"],["da_DK","da_DK"],["de_AT","de_AT"],["de_CH","de_CH"],["de_DE","de_DE"],["el_CY","el_CY"],["el_GR","el_GR"],["en_AU","en_AU"],["en_CA","en_CA"],["en_GB","en_GB"],["en_HK","en_HK"],["en_IN","en_IN"],["en_NG","en_NG"],["en_NZ","en_NZ"],["en_PH","en_PH"],["en_SG","en_SG"],["en_UG","en_UG"],["en_US","en_US"],["en_ZA","en_ZA"],["es_AR","es_AR"],["es_ES","es_ES"],["es_PE","es_PE"],["es_VE","es_VE"],["et_EE","et_EE"],["fa_IR","fa_IR"],["fi_FI","fi_FI"],["fr_BE","fr_BE"],["fr_CA","fr_CA"],["fr_CH","fr_CH"],["fr_FR","fr_FR"],["he_IL","he_IL"],["hr_HR","hr_HR"],["hu_HU","hu_HU"],["hy_AM","hy_AM"],["id_ID","id_ID"],["is_IS","is_IS"],["it_CH","it_CH"],["it_IT","it_IT"],["ja_JP","ja_JP"],["ka_GE","ka_GE"],["kk_KZ","kk_KZ"],["ko_KR","ko_KR"],["lt_LT","lt_LT"],["lv_LV","lv_LV"],["me_ME","me_ME"],["mn_MN","mn_MN"],["ms_MY","ms_MY"],["nb_NO","nb_NO"],["ne_NP","ne_NP"],["nl_BE","nl_BE"],["nl_NL","nl_NL"],["pl_PL","pl_PL"],["pt_BR","pt_BR"],["pt_PT","pt_PT"],["ro_MD","ro_MD"],["ro_RO","ro_RO"],["ru_RU","ru_RU"],["sk_SK","sk_SK"],["sl_SI","sl_SI"],["sr_RS","sr_RS"],["sv_SE","sv_SE"],["th_TH","th_TH"],["tr_TR","tr_TR"],["uk_UA","uk_UA"],["vi_VN","vi_VN"],["zh_CN","zh_CN"],["zh_TW","zh_TW"]],
              ),
              "validator" => array(
                "in_array",
                array(
                  "empty()",
									"values" => ["ar_EG","ar_JO","ar_SA","at_AT","bg_BG","bn_BD","cs_CZ","da_DK","de_AT","de_CH","de_DE","el_CY","el_GR","en_AU","en_CA","en_GB","en_HK","en_IN","en_NG","en_NZ","en_PH","en_SG","en_UG","en_US","en_ZA","es_AR","es_ES","es_PE","es_VE","et_EE","fa_IR","fi_FI","fr_BE","fr_CA","fr_CH","fr_FR","he_IL","hr_HR","hu_HU","hy_AM","id_ID","is_IS","it_CH","it_IT","ja_JP","ka_GE","kk_KZ","ko_KR","lt_LT","lv_LV","me_ME","mn_MN","ms_MY","nb_NO","ne_NP","nl_BE","nl_NL","pl_PL","pt_BR","pt_PT","ro_MD","ro_RO","ru_RU","sk_SK","sl_SI","sr_RS","sv_SE","th_TH","tr_TR","uk_UA","vi_VN","zh_CN","zh_TW"]
                )
              )
            ),
						"fug_gender" => array(
							"title" => "Gender",
							"input" => array(
								"name" => "fug_gender",
								"type" => "select_i",
								"value" => "both",
								"options" => array(
									[ "both", "Both" ],
									[ "male", "Male" ],
									[ "female", "Female" ]
								)
							),
							"validator" => array(
								"in_array",
								array(
									"values" => [ "both", "male", "female" ]
								)
							)
						),
						"fug_avatar" => array(
							"title" => "Avatar",
							"input" => array(
								"name" => "fug_avatar",
								"type" => "checkbox",
								"value" => true
							),
							"tip" => "Should script download random avatars from <a href='https://picsum.photos/' target='_blank'>picsum.photos</a>",
							"validator" => array(
								"boolean",
								array(
									"empty()"
								)
							)
						),
          )
		    ),
			),
			"action_btn_title" => "Create"
	  );
		$setting["functions"]["be_after"] = function( $gs, $is ){

			bof()->fake_user_generator->create( array(
				"count"  => $is["data"]["fug_count"],
				"gender" => $is["data"]["fug_gender"],
				"locale" => $is["data"]["fug_locale"],
				"avatar" => $is["data"]["fug_avatar"],
			) );
			return $is;

		};

		bof()->bofAdmin->_add_setting( "fake_user_generator", $setting );

	}
	public function create( $args=[] ){

		$count = 10;
		$gender = "both";
		$locale = "en_US";
		$avatar = true;
		extract( $args );
		$gender = in_array( $gender, [ "male", "female" ], true ) ? $gender : null;

		require_once( bof_root . "/app/core/third/fakerphp_faker/vendor/autoload.php" );
		$faker = Faker\Factory::create( $locale );
		$_created_users = 0;

		while( $_created_users < $count ){

			$name = $faker->unique()->name( $gender );
			$username = $faker->unique()->username();
			$email = $faker->unique()->freeEmail();
			$password = $faker->unique()->password();

			if (
				bof()->object->user->select( [ "username" => $username ] ) ||
				bof()->object->user->select( [ "email" => $email ] )
			) continue;

			$ID = bof()->object->user->create( [], array(
				"username" => $username,
				"email" => $email,
				"password" => bof()->object->user->hash_password( $password ),
				"name" => $name,
				"time_verify" => bof()->general->mysql_timestamp()
			) );

			if ( $avatar ){

				$_get_avatar = bof()->object->file->handle_url( "https://picsum.photos/500", array(
					"type" => "image",
					"object_type" => "user_avatar",
					"filename" => uniqid(),
					"extension" => "jpg",
				) );

				if ( $_get_avatar[0] ){
					bof()->object->user->create(
						array(
							"ID" => $ID
						),
						array(),
						array(
							"avatar_id" => $_get_avatar[1]["file_id"]
						)
					);
				}

			}

			$_created_users++;

		}

	}
	public function create_chat(){

		require_once( bof_root . "/app/core/third/fakerphp_faker/vendor/autoload.php" );
		$faker = Faker\Factory::create( "en_US" );

		$users = bof()->object->user->select([],array(
			"empty_select" => true,
			"single" => false,
			"limit" => 150
		));

		foreach( $users as $user ){

			// 1on1
			foreach( $users as $second_user ){

				if ( rand( 1, 90 ) >= 6 ) continue;
				if ( $second_user["ID"] == $user["ID"] ) continue;

				$group_id = bof()->object->ms_group->_1on1_group( $user["ID"], $second_user["ID"] );
				for( $i=1; $i<=rand( 5, 100 ); $i++ ){
					$from = rand( 1, 2 ) == 1 ? $user : $second_user;
					$text = $faker->realText( rand( 10, rand( 50, 250 ) ), 3 );
					bof()->object->ms_message->insert( array(
						"user_id" => $from["ID"],
						"group_id" => $group_id,
						"type" => "text",
						"content" => json_encode( $text ),
					) );
				}


			}

			for( $i=1; $i<=rand(0,5); $i++ ){

				$_users = [];
				foreach( $users as $second_user ){
					if ( rand( 1, 99 ) > 66 )
					$_users[] = $second_user["ID"];
				}

				$_users = array_unique( $_users );

				if ( !empty( $_users ) && count( $_users ) > 2 ){

					$_users = array_merge( $_users, [ $user["ID"] ] );
					$_users = array_unique( $_users );

					$group_id = bof()->object->ms_group->insert(array(
						"type" => "group",
						"name" => $faker->realText( rand( 10, 20 ), 5 ),
						"admin_id" => $user["ID"],
						"users_ids" => implode( ",", $_users )
					));

					for( $z=1; $z<=rand( 5, 100 ); $z++ ){

						$from = $_users[ rand( 0, count( $_users ) - 1 ) ];
						$text = $faker->realText( rand( 10, rand( 50, 250 ) ), 3 );

						bof()->object->ms_message->insert( array(
							"user_id" => $from,
							"group_id" => $group_id,
							"type" => "text",
							"content" => json_encode( $text ),
							"time_add" => "2022-09-" . str_pad(rand(1,14), 2, '0', STR_PAD_LEFT) . " " . str_pad(rand(1,23), 2, '0', STR_PAD_LEFT) . ":07:59"
						) );

					}

				}

			}

		}

	}

}

?>
