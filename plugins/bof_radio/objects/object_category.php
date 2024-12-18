<?php

if ( !defined( "bof_root" ) ) die;

class object_r_category extends bof_type_object_child {

  public $sample_parent = "tag";
  public function child(){
    return (object) array(
      "bof_admin_edit_url" => "radio_category",
      "bof_admin_list_url" => "radio_categories",
      "bof_client_single_url" => "radio/category",
      "bof_client_list_url" => "radio/category",
      "relations" => array(
        "r_station" => array(
          "stat" => "stations",
          "hub_type" => "category",
          "plural" => "categories",
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
        "name" => "r_category",
        "label" => "Radio Category",
        "db_table_name" => "_c_r_categories",
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
