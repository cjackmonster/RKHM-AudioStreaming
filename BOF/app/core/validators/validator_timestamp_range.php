<?php

if ( !defined( "root" ) ) die;

function validator_timestamp_range( &$value, $args, $nest ){

	return preg_match( "/^(19|20)([0-9]{2})\-(0|1)([0-9]{1})\-(0|1|2|3)([0-9]{1}) (0|1|2)([0-9]{1}):([0-6]{1})([0-9]{1}) \- (19|20)([0-9]{2})\-(0|1)([0-9]{1})\-(0|1|2|3)([0-9]{1}) (0|1|2)([0-9]{1}):([0-6]{1})([0-9]{1})$/", $value );

}

?>
