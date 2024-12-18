<?php

if (!defined("bof_root")) die;

class audiobook
{

	protected $PID = null;
	protected $GID = null;

	public $cache = [];
	public function set_cache($var, $val)
	{
		$this->cache[$var] = $val;
	}
	public function get_cache($var, $default_val = null, $resetAfter = false)
	{
		$val = in_array($var, array_keys($this->cache), true) ? $this->cache[$var] : $default_val;
		if ($resetAfter) $this->reset_cache();
		return $val;
	}
	public function reset_cache()
	{
		$this->cache = [];
	}

	public function setup()
	{

		bof()->object->core_files->add_object("a_genre", bof_audiobook_root . "/objects/object_genre.php");
		bof()->object->core_files->add_object("a_tag", bof_audiobook_root . "/objects/object_tag.php");
		bof()->object->core_files->add_object("a_language", bof_audiobook_root . "/objects/object_language.php");
		bof()->object->core_files->add_object("a_narrator", bof_audiobook_root . "/objects/object_narrator.php");
		bof()->object->core_files->add_object("a_writer", bof_audiobook_root . "/objects/object_writer.php");
		bof()->object->core_files->add_object("a_translator", bof_audiobook_root . "/objects/object_translator.php");
		bof()->object->core_files->add_object("a_book", bof_audiobook_root . "/objects/object_book.php");
		bof()->object->core_files->add_object("a_book_chapter", bof_audiobook_root . "/objects/object_book_chapter.php");
		bof()->object->core_files->add_object("a_book_source", bof_audiobook_root . "/objects/object_book_source.php");

		if (bof()->getName() == "bof_admin")
			$this->setup_admin();

		else
			$this->setup_client();

		$this->setup_cronjob();

		bof()->listen("source", "get_contents_after", function ($method_args, &$method_result, $loader) {
			$method_result["a_book_source"] = $loader->object->__get("a_book_source");
		});
	}

	protected function setup_admin()
	{

		$this->setup_bofAdmin();
		$this->setup_admin_job_runner();
		$this->setup_admin_app_pages();
		$this->setup_admin_highlights();
		$this->setup_admin_endpoints();

		bof()->listen("bofAdmin", "setting_pre", function ($method_args) {
			$setting_name = $method_args[0];
			if ($setting_name == "audiobook_automation")
				$this->setup_admin_settings();
		});

		bof()->listen( "object_user_role", "bof_admin_after", function( $method_args, &$bof_admin, $loader ){

			$bof_admin["object"]["user_premium_a_writer"] = array(
				"label" => "Premium Audiobook - Access by writer",
				"tip" => "Users belonging this user-role will have access to premium audiobooks belonging to selected writers",
				"multi" => false,
				"display_on" => array(
					"type" => [ "equal", "user" ],
					"user_premium" => [ "equal", "some" ]
				),
				"input" => array(
					"name" => "user_premium_a_writer",
				),
				"bofInput" => array(
					"object",
					array(
						"type" => "a_writer",
						"multi" => true,
						"autoload" => false
					)
				)
			);
			$bof_admin["object"]["user_premium_a_tag"] = array(
				"label" => "Premium Audiobook - Access by tag",
				"tip" => "Users belonging this user-role will have access to premium audiobooks belonging to selected tags",
				"multi" => false,
				"display_on" => array(
					"type" => [ "equal", "user" ],
					"user_premium" => [ "equal", "some" ]
				),
				"input" => array(
					"name" => "user_premium_a_tag",
				),
				"bofInput" => array(
					"object",
					array(
						"type" => "a_tag",
						"multi" => true,
						"autoload" => false
					)
				)
			);
			$bof_admin["object"]["user_premium_a_genre"] = array(
				"label" => "Premium Audiobook - Access by genre",
				"tip" => "Users belonging this user-role will have access to premium audiobooks belonging to selected genres",
				"multi" => false,
				"display_on" => array(
					"type" => [ "equal", "user" ],
					"user_premium" => [ "equal", "some" ]
				),
				"input" => array(
					"name" => "user_premium_a_genre",
				),
				"bofInput" => array(
					"object",
					array(
						"type" => "a_genre",
						"multi" => true,
						"autoload" => false
					)
				)
			);

		} );

	}
	protected function setup_bofAdmin()
	{

		bof()->bofAdmin->_add_object("a_genre");
		bof()->bofAdmin->_add_object("a_tag");
		bof()->bofAdmin->_add_object("a_language");
		bof()->bofAdmin->_add_object("a_narrator", ["social_links" => true, "biography" => true]);
		bof()->bofAdmin->_add_object("a_writer", ["social_links" => true, "biography" => true]);
		bof()->bofAdmin->_add_object("a_translator", ["social_links" => true, "biography" => true]);
		bof()->bofAdmin->_add_object("a_book");
		bof()->bofAdmin->_add_object("a_book_chapter", ["seo" => false]);
		bof()->bofAdmin->_add_object("a_book_source", ["seo" => false]);
	}
	protected function setup_admin_job_runner() {}
	protected function setup_admin_app_pages()
	{

		bof()->listen("client_config", "get_pages_after", function ($method_args, &$method_result, $loader) {

			if (is_array($method_result)) {

				$method_result["audiobook_automation"] = array(
					"title" => "Audiobook Automation",
					"url" => "^audiobook_automation$",
					"link" => "audiobook_automation",
					"theme_file" => "parts/content_setting",
					"extenders" => (object) array(
						"bof_api_automation_filters" => (object) array(
							"type" => "js",
							"name" => "bof_api_automation_filters",
							"path" => web_address . "/plugins/bof_audiobook/assets/bof_api_automation_filters.js",
							"dir" => false
						),
						"bof_api_automation_filters_css" => (object) array(
							"type" => "css",
							"name" => "bof_api_automation_filters",
							"path" => web_address . "/plugins/bof_audiobook/assets/bof_api_automation_filters.css",
							"dir" => false
						),
					),
					"events" => (object) array(
						"displaying" => "bof_api_automation_filters.displaying",
						"ready" => "bof_api_automation_filters.ready",
						"unloading" => "bof_api_automation_filters.unloading",
					),
					"becli" => array(
						(object) array(
							"endpoint" => "bofAdmin/setting/audiobook_automation/",
							"key" => "setting"
						)
					),
					"__sb_family" => "content",
				);

				foreach (
					array(
						"book" => array(
							"title" => "Book"
						),
						"book_chapter" => array(
							"title" => "Book Chapter",
						),
						"book_source" => array(
							"title" => "Source",
						),
						"genre" => array(
							"title" => "Genre"
						),
						"tag" => array(
							"title" => "Tag"
						),
						"language" => array(
							"title" => "Language"
						),
						"writer" => array(
							"title" => "Writer"
						),
						"narrator" => array(
							"title" => "Narrator"
						),
						"translator" => array(
							"title" => "Translator"
						)
					) as $object_k => $object_as
				) {

					$_p_title = substr($object_as["title"], -1) == "y" ?  substr($object_as["title"], 0, -1) . "ies" : $object_as["title"] . "s";
					$_p_link = substr($object_k, -1) == "y" ?  substr($object_k, 0, -1) . "ies" : $object_k . "s";

					$method_result["audiobook_{$object_k}s"] = array(
						"title" => "Audiobook {$_p_title}",
						"url" => "^audiobook_{$_p_link}$",
						"link" => "audiobook_{$_p_link}",
						"theme_file" => "parts/content_table",
						"becli" => array(
							(object) array(
								"endpoint" => "bofAdmin/list/a_{$object_k}/?\$bof ? urlData^url^query_s\$",
								"key" => "content",
							)
						),
						"__sb_family" => "content",
					);
					$method_result["audiobook_{$object_k}"] = array(
						"title" => "Audiobook {$object_as["title"]}",
						"url" => "^audiobook_{$object_k}\/(.*?)$",
						"link" => "audiobook_{$object_k}",
						"link_par" => "audiobook_{$_p_link}",
						"theme_file" => "parts/content_single",
						"becli" => array(
							(object) array(
								"endpoint" => "bofAdmin/object/a_{$object_k}/?IDs=\$bof ? urlData^url^match^0\$&\$bof ? urlData^url^query_s\$",
								"key" => "entity",
							)
						),
						"__sb_family" => "content",
					);
				}
			}
		});
	}
	protected function setup_admin_highlights()
	{

		bof()->listen("highlights", "display_pre", function ($method_args, $method_result, $loader) {

			$sb_family = $method_args[0];

			$highlights = bof()->highlights->getData();
			$highlights["setting_links"]["items"]["cronjob_links"]["args"]["childs"] = array_merge(
				array_slice($highlights["setting_links"]["items"]["cronjob_links"]["args"]["childs"], 0, 1),
				array(
					array(
						"title" => "Audiobook - Automation",
						"icon" => "book",
						"link" => "audiobook_automation"
					),
				),
				array_slice($highlights["setting_links"]["items"]["cronjob_links"]["args"]["childs"], 1),
			);
			bof()->highlights->setData($highlights);
		});

		bof()->highlights
			->new_item("content_links", array(
				"icon" => "library_books",
				"title" => "Audiobook",
				"ID" => "audiobook",
				"childs" => array(
					array(
						"title" => "List Books",
						"icon" => "book",
						"link" => "audiobook_books"
					),
					array(
						"title" => "List Book Chapters",
						"icon" => "auto_stories",
						"link" => "audiobook_book_chapters"
					),
					array(
						"title" => "List Sources",
						"icon" => "audio_file",
						"link" => "audiobook_book_sources"
					),
					array(
						"title" => "List Writers",
						"icon" => "edit",
						"link" => "audiobook_writers"
					),
					array(
						"title" => "List Translators",
						"icon" => "translate",
						"link" => "audiobook_translators"
					),
					array(
						"title" => "List Narrators",
						"icon" => "record_voice_over",
						"link" => "audiobook_narrators"
					),
					array(
						"title" => "List Tags",
						"icon" => "tag",
						"link" => "audiobook_tags"
					),
					array(
						"title" => "List Genres",
						"icon" => "category",
						"link" => "audiobook_genres"
					),
					array(
						"title" => "List Languages",
						"icon" => "translate",
						"link" => "audiobook_languages"
					),
					array(
						"title" => "Automation",
						"icon" => "smart_toy",
						"link" => "audiobook_automation"
					),
				)
			), false);
	}
	protected function setup_admin_settings()
	{

		$a_langs = bof()->boac->varys_filters("audiobook");

		$total_a_que = bof()->db->query("SELECT COUNT(*) as c FROM _c_a_automate_cache", null, true)->fetch_assoc()["c"];
		$total_ad_que = bof()->db->query("SELECT COUNT(*) as c FROM _c_a_automate_cache WHERE sta IS NULL", null, true)->fetch_assoc()["c"];
		$total_ac_que = bof()->db->query("SELECT COUNT(*) as c FROM _c_a_automate_cache WHERE sta IS NOT NULL", null, true)->fetch_assoc()["c"];

		$queue_string = "<br><br><b style='color:rgb(var(--c_red));font-size:120%;margin-bottom:4px;display:inline-block'>Queue status:</b><br>
		Total: <b>{$total_a_que}</b><br>
		Waiting: <b>{$total_ad_que}</b><br>
		Done: <b>{$total_ac_que}</b> <a href='cronjobs?code=audiobook'>Cronjob logs</a><br>";

		bof()->bofAdmin->_add_setting("audiobook_automation", array(
			"groups" => array(
				"busyowl" => array(
					"title" => "Busyowl",
					"icon" => "source",
					"inputs" => array(
						"busyowl_a_auto" => array(
							"title" => "Sync Audiobooks",
							"tip" => "Script will sync audiobooks with Busyowl's API server. Audiobooks from librivox.org and gutenberg.org are available to scrap. {$queue_string}",
							"col_name" => "busyowl_a_auto",
							"input" => array(
								"name" => "busyowl_a_auto",
								"type" => "checkbox",
							),
							"validator" => array(
								"boolean",
								array(
									"empty()"
								)
							)
						),
						"busyowl_a_auto_ls" => array(
							"title" => "Filter: Language",
							"col_name" => "busyowl_a_auto_ls",
							"input" => array(
								"name" => "busyowl_a_auto_ls",
								"type" => "select_m",
								"options" => array_merge([["__all__", "All"]], $a_langs["audiobook_langs"])
							),
							"validator" => array(
								"in_array",
								array(
									"values" => array_merge(["__all__"], array_map(function ($item) {
										return $item[0];
									}, $a_langs["audiobook_langs"]))
								)
							)
						),
						"busyowl_a_auto_cs" => array(
							"title" => "Filter: Category",
							"col_name" => "busyowl_a_auto_cs",
							"input" => array(
								"name" => "busyowl_a_auto_cs",
								"type" => "select_m",
								"options" => array_merge([["__all__", "All"]], $a_langs["audiobook_cats"])
							),
							"validator" => array(
								"in_array",
								array(
									"values" => array_merge(["__all__"], array_map(function ($item) {
										return $item[0];
									}, $a_langs["audiobook_cats"]))
								)
							)
						),
					)
				),
			),
			"functions" => array(
				"be_after" => function ($groups, $inputs) {

					if (!empty($inputs["data"]["busyowl_a_auto_ls"]) && !empty($inputs["data"]["busyowl_a_auto_cs"])) {
						bof()->boac->varys_filters_check("audiobook", array(
							"cs" => $inputs["data"]["busyowl_a_auto_cs"] == "__all__" ? "all" : $inputs["data"]["busyowl_a_auto_cs"],
							"ls" => $inputs["data"]["busyowl_a_auto_ls"] == "__all__" ? "all" : $inputs["data"]["busyowl_a_auto_ls"],
						), true);
					}

					return $inputs;
				}
			)
		));
	}
	protected function setup_admin_endpoints()
	{
		bof()->object->endpoint->add("bof_api_filters_load", array(
			"url" => "bof_api_filters_load",
			"groups" => ["admin"],
			"executers" => array(
				bof_audiobook_root . "/endpoints/endpoint_bof_api_filters_load.php"
			)
		));
	}

	protected function setup_client()
	{

		$this->setup_bofClient();
	}
	protected function setup_bofClient()
	{

		bof()->bofClient->_add_object("a_writer");
		bof()->bofClient->_add_object("a_translator");
		bof()->bofClient->_add_object("a_narrator");
		bof()->bofClient->_add_object("a_genre");
		bof()->bofClient->_add_object("a_tag");
		bof()->bofClient->_add_object("a_language");
		bof()->bofClient->_add_object("a_book");

		bof()->listen("muse", "req_source", function () {
			bof()->bofClient->_add_object("a_book_chapter");
		});
		bof()->listen("muse_infinite", "endpoint", function () {
			bof()->bofClient->_add_object("a_book_chapter");
		});
	}

	protected function _cli($string)
	{
		bof()->cronjob->log_p($this->PID, $this->GID, $string);
	}
	protected function setup_cronjob()
	{

		bof()->listen("cronjob", "_clean_database_get_map_after", function ($method_args, &$map, $loader) {

			$map["_c_a_books"] = [];
			$map["_c_a_books_chapters"] = [];
			$map["_c_a_books_relations"] = [];
			$map["_c_a_books_sources"] = [];
			$map["_c_a_genres"] = [];
			$map["_c_a_langs"] = [];
			$map["_c_a_narrators"] = [];
			$map["_c_a_narrators_relations"] = [];
			$map["_c_a_tags"] = [];
			$map["_c_a_translators"] = [];
			$map["_c_a_translators_relations"] = [];
			$map["_c_a_writers"] = [];
			$map["_c_a_writers_relations"] = [];
		});

		bof()->listen("cronjob", "get_jobs_after", function ($method_args, &$jobs, $loader) {

			if ($loader->object->db_setting->get("busyowl_a_auto")) {
				$jobs["audiobook"] = array(
					"title" => "Audiobook Plugin",
					"interval" => 1,
					"exe" => function ($PID, $GID, $loader) {
						return $loader->audiobook->job_runner($PID, $GID);
					}
				);
			}
		});
	}
	public function job_runner($PID, $GID)
	{

		$this->PID = $PID;
		$this->GID = $GID;
		return $this->get_books();
	}
	public function get_books()
	{

		$books = bof()->boac->varys_audiobook();

		if (!$books) {
			fall("Failed to pull audiobook list / Nothing in the queue");
		}

		$created_c = 0;

		foreach ($books as $book) {

			$created_ps = [];

			$book_exists = bof()->object->a_book->select(
				array(
					"code" => bof()->general->make_code([$book["writers"][0], $book["title"]])
				)
			);

			if ($book_exists) {
				$this->_cli("Skipped book:{$book["title"]} -> exists");
			} else {

				foreach (["narrator", "writer", "translator"] as $_pt) {
					if (!empty($book["{$_pt}s"])) {
						foreach ($book["{$_pt}s"] as $_p) {
							$create_p_err = null;
							try {
								$create_p = bof()->object->__get("a_{$_pt}")->create(
									array(
										"code" => bof()->general->make_code($_p)
									),
									array(
										"code" => bof()->general->make_code($_p),
										"name" => $_p,
										"seo_url" => bof()->object->__get("a_{$_pt}")->get_free_url($_p),
									),
									array()
								);
							} catch (Exception $err) {
								$create_p = false;
								$create_p_err = $err->getMessage();
							}
							if ($create_p) {
								$created_ps[$_pt][] = $create_p;
								$this->_cli("Created {$_pt}:{$_p}:{$create_p}");
							} else {
								$this->_cli("Creating {$_pt}:{$_p}:{$create_p} failed: {$create_p_err}");
							}
						}
					}
				}

				try {
					$bookID = bof()->object->a_book->create(
						array(
							"code" => bof()->general->make_code([$book["writers"][0], $book["title"]])
						),
						array(
							"code" => $book["code"],
							"title" => $book["title"],
							"seo_url" => bof()->object->a_book->get_free_url($book["title"]),
							"writer_ids" => !empty($created_ps["writer"]) ? $created_ps["writer"] : null,
							"translator_ids" => !empty($created_ps["translator"]) ? $created_ps["translator"] : null,
							"narrator_ids" => !empty($created_ps["narrator"]) ? $created_ps["narrator"] : null,
							"language_string_array" => !empty($book["languages"]) ? $book["languages"] : null,
							"genre_string_array" => !empty($book["genres"]) ? $book["genres"] : null,
							"tag_string_array" => !empty($book["tags"]) ? $book["tags"] : null,
							"time_publish" => $book["time_publish"] ? bof()->general->mysql_timestamp(strtotime($book["time_publish"])) : null,
						),
						array()
					);
				} catch (Exception $err) {
					$bookID = false;
				}

				if (empty($bookID)) {
					$this->_cli("Failed to created book:{$book["title"]}");
					continue;
				}

				$this->_cli("Created book:{$book["title"]}:{$bookID}");

				if (!empty($book["chapters"])) {
					foreach ($book["chapters"] as $_bc) {

						$create = bof()->object->a_book_chapter->create(
							array(),
							array(
								"book_id" => $bookID,
								"title" => $_bc["title"],
								"writer_ids" => !empty($created_ps["writer"]) ? $created_ps["writer"] : null,
								"translator_ids" => !empty($created_ps["translator"]) ? $created_ps["translator"] : null,
								"narrator_ids" => !empty($created_ps["narrator"]) ? $created_ps["narrator"] : null,
								"category_string_array" => !empty($book["categories"]) ? $book["categories"] : null,
								"tag_string_array" => !empty($book["tags"]) ? $book["tags"] : null,
								"sources" => $_bc["sources"],
							),
							array()
						);

						$this->_cli("Created chapter:{$_bc["title"]}:{$create}");
					}
				}

				$created_c++;
			}
		}

		return "Created {$created_c} book(s)";
	}
}
