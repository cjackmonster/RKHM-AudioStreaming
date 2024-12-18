<?php

if ( !defined( "root" ) ) die;

function validator_username( &$value, $args, $nest ){

	$min_length = 4;
	$max_length = 40;
	extract( $args );

	// Check value type
	if ( !is_string( $value ) )
		return false;

	$validate = filter_var(
		$value,
		FILTER_VALIDATE_REGEXP,
		array(
			"options" => array(
				"regexp" => "/^(?![.])[a-zA-Z0-9_.]{{$min_length},{$max_length}}$/"
			)
		)
	);

	$value = strtolower( trim( $value ) );

	return $validate;

}

?>
