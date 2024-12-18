<?php

if (!defined("root")) die;

function validator_web3_wallet(&$value, $args, $nest)
{

	$validate = false;

	if (preg_match("/^(0x)?([a-fA-F0-9]{40})$/", $value, $matches)) {
		$value = isset($matches[2]) ? $matches[2] : $matches[1];
		$value = strtolower( $value );
		$validate = true;
	}

	return $validate;
}
