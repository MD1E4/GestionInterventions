<script>
$(document).ready(function(){
$.ajax({
	type:'GET',
	url:'search_intervention.php?search_numero&histo=<?php echo $_GET['num']; ?>',
	datatype:'json',
	
	success:function(res)
	{
		//On met en titre du popup le numéro de l'intervention recherchée
		$('#popup_title').append('Historique de l\'intervention <b>'+res[0].CODE_INTERVENTION.split('/')[0]+'</b>');;
		//On remplit le tableau du popup à partir du résultat
		//grace à la fonction RemplirTableauPopup()
		RemplirTableauPopup(res);
		$('#bas_page').append('');
	},
	
	error:function()
	{
		alert('Erreur récup code inter');
	}
});

});
</script>

<style>
.ModalPopup {
  	display:block;
  	width:100%;
 	height:auto;
   background-color:#FFFFFF; 
}
</style>
<div class="ModalPopup" id="popup" style="vertical-align:350px">
<table border="0" style="width:100%; border-collapse:collapse;">
<tr style="background-color:#3E3E3E;color:#FFF">
	<td style="text-align:right;width:20%">&nbsp;</td>
	<td id="popup_title" style="text-align:center;"></td>
    <td id="popup_close" style="text-align:right;width:20%"><a href="#" onclick="$.modal.close(); return false"><img src="/img/close.jpg" alt="Fermer" width="21" height="21"></a></td>
</tr>
<tr><td colspan="3" id="popup_contenu">
</td></tr>
<tr><td colspan="3" id="bas_page" style="background-color:#F60;text-align:right;color:#FFF;size:9">
Module de consultation d'intervention
</td></tr>
</table>
</div>


