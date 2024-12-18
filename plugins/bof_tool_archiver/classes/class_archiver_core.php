<?php

if ( !defined( "bof_root" ) ) die;

class archiver_core {

	protected $cache = array(
		"temp_dir_path" => null
	);

	public function exe( $PID, $GID ){

		$this->rm_tmp_dir();
		$dir = $this->mk_tmp_dir();
		sleep(1);

		$zip = new ZipArchive;
		$zip_path = bof()->object->file->clean_path("{$dir}bof.zip");

    $res = $zip->open( $zip_path, ZipArchive::CREATE | ZipArchive::OVERWRITE );

    if ( $res !== true )
		throw new Exception( "failed to create zip file" );

		if ( bof()->object->db_setting->get( "arch_db_active" ) && ( $mysqldump_path = bof()->object->db_setting->get( "arch_db_path" ) ) ){

			$map = bof()->object->db_setting->get( "arch_db_map" );
			if ( $map ? is_array( $map ) : false ){
				foreach( $map as $tableName => $tableSta ){

					if ( !$tableSta ) continue;

					$command = "\"{$mysqldump_path}\" -u ".db_user." \"-p".db_pass."\" \"".db_name."\" \"{$tableName}\"> {$dir}/{$tableName}.sql";
					exec( $command );

					if ( is_file( "{$dir}/{$tableName}.sql" ) ){
						bof()->cronjob->log_p( $PID, $GID, "Dumped {$tableName} successfully" );
						$add = $zip->addFile( realpath("{$dir}/{$tableName}.sql"), "database/{$tableName}.sql" );
						if ( $add ) bof()->cronjob->log_p( $PID, $GID, "Added {$tableName} to zip file successfully" );
						else bof()->cronjob->log_p( $PID, $GID, "Adding {$tableName} to zip file failed" );
					}
					else
					bof()->cronjob->log_p( $PID, $GID, "Dumping {$tableName} failed" );

				}

				$zip->close();
				$zip = new ZipArchive;
		    $res = $zip->open( bof()->object->file->clean_path("{$dir}bof.zip"), ZipArchive::CREATE );

				foreach( $map as $tableName => $tableSta ){

					if ( !$tableSta ) continue;

					if ( is_file( "{$dir}/{$tableName}.sql" ) ){
						unlink( "{$dir}/{$tableName}.sql" );
					}

				}
			}

		}
		if ( bof()->object->db_setting->get( "arch_file_active" ) ){

			$files = bof()->file->scandir( base_root . "/files", ["no_base"=>true] )["files"];
			foreach( $files as $i => $filePath ){

				$fileFullPath = realpath( base_root . "/files/" . $filePath );

				if ( preg_match( '/(files\/protected\/_archiver_temp\/|files\/unused\/|files\/url\/|files\/tmp\/)/', bof()->object->file->clean_path( base_root . "/files/" . $filePath ) ) )
				continue;

				$add = $zip->addFile( $fileFullPath, "files/{$filePath}" );
				if ( $add ) bof()->cronjob->log_p( $PID, $GID, "Added {$filePath} to zip file successfully" );
				else bof()->cronjob->log_p( $PID, $GID, "Adding {$filePath} to zip file failed" );

				// memory leak is not a nice thing. is it?
				if ( $i % 50 == 0 ){
					$zip->close();
					$zip = new ZipArchive;
			    $res = $zip->open( bof()->object->file->clean_path("{$dir}bof.zip"), ZipArchive::CREATE );
				}

			}

		}

		$zip->close();

		if ( !is_file( $zip_path ) )
		throw new Exception( "failed to find created zip file" );

		$dest_storage_id = bof()->object->db_setting->get( "arch_storage", 1 );
		if ( !$dest_storage_id ) $dest_storage_id = 1;
		$dest_storage = bof()->object->storage->sid( $dest_storage_id );
		$dest_subdir = bof()->object->db_setting->get( "arch_storage_path" );

		$move = bof()->transit
		->set_storage( $dest_storage )
		->set_file( bof()->object->file->clean_path( $zip_path, true ) )
		->move( array(
			"random_subdir" => false,
			"dirname" => "protected/archiver" . ( $dest_subdir ? "/{$dest_subdir}" : "" ),
			"filename" => "_backup_" . date("y-m-d_H-i-s")
		) );

		if ( !$move ? true : !$move[0] )
		throw new Exception( "failed to move zipped file to storage" );

		return $move[1];

	}

	protected function mk_tmp_dir(){
		return bof()->file->mkdir( base_root . "/files/protected/_archiver_temp" );
	}
	public function rm_tmp_dir(){

		if ( DIRECTORY_SEPARATOR === '\\' )
		exec( "rmdir \"" . base_root . "/files/protected/_archiver_temp\" /s /q" );
		else
		exec( "rm -rf \"" . base_root . "/files/protected/_archiver_temp\"" );

	}

}

?>
