<?php

if ( !defined( "bof_root" ) ) die;

class object_a_language extends bof_type_object_child {

  public $sample_parent = "tag";
  public function child(){
    return (object) array(
      "bof_admin_edit_url" => "audiobook_language",
      "bof_admin_list_url" => "audiobook_languages",
      "bof_client_single_url" => "audiobook/language",
      "bof_client_list_url" => "audiobook/languages",
      "relations" => array(
        "a_writer" => array(
          "stat" => "writers",
          "hub_type" => "language",
          "plural" => "languages",
          "bof_admin_list_url" => "audiobook_writers",
          "label" => bof()->object->language->turn( "writers",[],["uc_first"=>true,"lang"=>"users"] ),
        ),
        "a_narrator" => array(
          "stat" => "narrators",
          "hub_type" => "language",
          "plural" => "languages",
          "bof_admin_list_url" => "audiobook_narrators",
          "label" => bof()->object->language->turn( "narrators",[],["uc_first"=>true,"lang"=>"users"] ),
        ),
        "a_translator" => array(
          "stat" => "translators",
          "hub_type" => "language",
          "plural" => "languages",
          "bof_admin_list_url" => "audiobook_translators",
          "label" => bof()->object->language->turn( "translators",[],["uc_first"=>true,"lang"=>"users"] ),
        ),
        "a_book" => array(
          "stat" => "books",
          "hub_type" => "language",
          "plural" => "languages",
          "bof_admin_list_url" => "audiobook_books",
          "label" => bof()->object->language->turn( "books",[],["uc_first"=>true,"lang"=>"users"] ),
        ),
      )
    );
  }

  // BusyOwlFramework handshake
  public function bof(){
    return $this->_parent->bof(
      $this->_bof_this,
      array(
        "name" => "a_language",
        "label" => "Audiobook Language",
        "db_table_name" => "_c_a_langs",
      )
    );
  }

  public function clean_search_terms( $item ){

    $o = array(
      $item["name"] => 1,
    );

    return $o;

  }

}

?>
