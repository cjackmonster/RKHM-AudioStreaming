<?php

if ( !defined( "bof_root" ) ) die;

class object_r_language extends bof_type_object_child {

  public $sample_parent = "tag";
  public function child(){
    return (object) array(
      "bof_admin_edit_url" => "radio_language",
      "bof_admin_list_url" => "radio_languages",
      "bof_client_single_url" => "radio/language",
      "bof_client_list_url" => "radio/language",
      "relations" => array(
        "r_station" => array(
          "stat" => "stations",
          "selector" => "language_id",
          "bof_admin_list_url" => "radio_stations",
          "label" => bof()->object->language->turn( "stations",[],["uc_first"=>true,"lang"=>"users"] ),
          "display" => array(
            "limit" => 25,
            "slider_mason" => true,
            "link_on_bottom" => true,
          )
        ),
      ),
    );
  }

  // BusyOwlFramework handshake
  public function bof(){
    return $this->_parent->bof(
      $this->_bof_this,
      array(
        "name" => "r_language",
        "label" => "Radio Language",
        "db_table_name" => "_c_r_langs",
      )
    );
  }

  public function columns(){

    return $this->_parent->columns(
      $this->_bof_this,
      array(
        "iso2" => array(
          "public" => true,
          "label" => "ISO code",
          "tip" => "ISO 639-1 language code. Example: EN, IT",
          "validator" => array(
            "string",
            array(
              "empty()",
              "forceNull" => true
            ),
          ),
          "input" => array(
            "type" => "text"
          ),
          "bofAdmin" => array(
            "object" => array(
              "required" => true
            )
          )
        ),
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
