<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
<meta http-equiv="content-type" content="text/html; charset=iso-8859-1" />
<title>info cache pilotageCA</title>
</head>

<body>
<form>
<?php
include_once("lib/libCachePil.php");

	//getAllCache();

  $cacheNames = array( "ETATS", "PRIORITES", "BORNES", "AGENCESN1", "AGENCESN2", "AGENTS", "DEPARTEMENTS", "CODE_SITES" );
  $data = array();
  foreach( $cacheNames as $item ) 
  {
	  $data = zend_disk_cache_fetch("PILOTCA::".$item);
	  
	  if ( $data === false )
	  { 
		  echo "pas de donn&eacute; ".$item."<br>";
	  }
	  else 
	  {
		  $cntVal = count($data);
		  echo $cntVal." enregistrements dans ".$item." :<br/>";
		  
		  echo '<table border="1">';
		  
		  for ($i = 0; $i < $cntVal; $i++) 
		  {
			  echo '<tr>';
			  for($j = 0; $j < count($data[$i]); $j++)
			  {
				  //Si tableau multi dimensions
				  if(count($data[$i]) > 1)
				  {
					  echo '<td>'.$data[$i][$j].'</td>';
				  }
				  else
				  {
					  echo '<td>'.$data[$i].'</td>';
				  }
			  }
			  echo '</tr>';
		  }
		  echo '</table>';
	  }
  }
      
?>

</form>
</body>
</html>