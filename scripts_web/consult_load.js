$(document).ready(function(){

	var user ="";
	//On cache la div du r�sultat ne contenant rien au chargement
	$('#div_resultat').hide();

	//Avec authentification
    /*$('#centre').hide();*/

    //Sans authentification
    $('#connexion').hide();
    RemplirAgence(4,18);

    //Click pour l'authentification dans l'application
    $('#cmdConnect').on('click', function(){
    	if ($('#idUser').val() == '' && $('#pwdUser').val() == '') 
    	{
    		alert('Veuillez saisir votre identifiant et votre mot de passe');
    	}
    	else if($('#idUser').val() == '') 
    	{
    		alert('Veuillez saisir votre identifiant');
    	}
    	else if($('#pwdUser').val() == '')
    	{
    		alert('Veuillez saisire votre mot de passe');
    	}
    	else
    	{
	    	$.ajax({
	    		type:'POST',
	    		url:'lib/consult_inter.php?connect',
	    		datatype:'json',
	    		data:$('#connexion').serialize(),

	    		success:function(res)
	    		{
	    			if(res=='')
	    			{
	    				alert('Le nom d\'utilisateur ou le mot de passe n\'est pas valide');
	    			}
	    			else
	    			{
	    				var ok = false;
	    				var index;
	    				for (var i = 0; i < res.length; i++) 
	    				{
		    				if(res[i].Groupe == 'Responsable d\'intervenant')
		    				{		    					
		    					ok = true;
		    					index = i;
		    					break;
		    				}		    				
		    			}
		    			if(ok == false)
		    			{
		    				alert('Vous n\'�tes pas habilit� � acceder � l\'outil');
		    			}
		    			else
		    			{
		    				user = res[index].Prenom+' '+res[index].Nom;
	    					alert('Bienvenue '+user);
	    					$('#centre').show();
	    					$('#connexion').hide();

	    					$('#userConnect').empty();
	    					$('#userConnect').append(user);

	    					RemplirAgence(res[index].Id_agence_niv1, res[index].Id_agence_niv2);
	    					if($('#di_rtsp').val() == res[index].Id_agence_niv1)
							{
								RemplirAgence2(res[index].Id_agence_niv2);
							}
		    			}
	    			}
	    		},
	    		error:function()
	    		{
	    			alert('Le nom d\'utilisateur ou le mot de passe n\'est pas valide2');
	    		}
	    	});
		}
    });

	//Evenement du click sur le lien de d�connection
	$('#deconnect').on('click', function(){
		//On cache la div du r�sultat ne contenant rien au chargement
		$('#div_resultat').hide();

		//Avec authentification
	    $('#centre').hide();

	    $('#connexion').show();
	});

	//Efface le test
    $('#lienPoub').on('click', function(){
    	$('#info').empty();
    });

    //Afficher l'historique de l'intervention au clic
	//sur le num�ro d'intervention dans le tableau r�sultat
	$('#centre').on('click', '.histo_inter', function(){
		var numHisto = $(this).text().split('/')[0];
		$.ajax({
			url:'lib/search_intervention.php?search_numero&histo='+numHisto,
			datatype:'json',

			success:function(res)
			{
				RemplirTableauPopup(res);
			},
			error:function()
			{
				alert('Erreur de la r�cup�ration de l\'historique');
			}
		});

		//On ouvre un popup qui affiche l'historique de l'intervention s�lectionn�e
		//dans un tableau de r�sultat
		
		$('#dialog').attr('title', 'Historique de l\'intervention '+ numHisto);
		$("#dialog").dialog({
			width:1200,
			resizable:false,
			draggable:false,
			modal:true
		});
		;
	});

	//Lie de test PHP
	/*$('#centre').on('click', '#lien23', function(){
		$("#dialog").dialog({
			height:200,
			width:400,
			resizable:false,
			draggable:false,
			modal:true
		});
		Test2($('#dib').val());
		$.ajax({
			type:'POST',
			url:'../lib/search_intervention.php?test',
			datatype:'html',
			data: $('#form_rtsp').serialize(),
			
			success:function(res)
			{
				Test2(res);
			},
			error:function()
			{
				Test2('Erreur Du TEST');
			}
		});
	});*/

	
	// Remplissage combobox Agences au chargement
	$('#di_rtsp').on('change', function()
	{
		RemplirAgence2(0);
	});

	//Fonction qui g�re les onglets du r�sultat
	jQuery( function($) {     
		$('.simple-tabs').each( function() {
			var container = $(this);         
			container.find('> ul li a').click( function () {             
					 $(this).parent().addClass( 'selected-tab' ).siblings().removeClass( 'selected-tab' );
					 container.find('.tab-panel').hide().filter(this.hash).show();
					 return false;
			}).eq(0).click();
		});
	});
	
			
	//Chargement des Checkboxs priorit�s
	$.ajax({
		type:'POST',
		url:'lib/consult_inter.php?loadpriorite',
		datatype:'json',

		success:function(res)
		{
			var mesCouleurs = ['#ff6600', '#ff7e27', '#ff954e', '#ffad76', '#ffc49d', '#ffdcc4'];
			var fausse = '';
			for(var i = 0; i<mesCouleurs.length; i++)
			{
				fausse += mesCouleurs[mesCouleurs.length-1-i]
			}

			var html='<td style="text-align:right;font-weight:bold;"><label>Priorit�s :</label></td>';
			for(var i = 0 ; i < res.length ; i++)
			{
				html+='<td class="prio" style="border:1px solid #000;text-align:center;width:'+100/(res.length+1)+'%;height:30px;background-color:'+mesCouleurs[i]+'">'+res[i].Libelle+'&nbsp; <input type="checkbox" class="chkPrio" name="priority[]" value="'+res[i].Id+'" checked/>&nbsp;&nbsp;&nbsp;</td>';
			}

			$('#priorite_rtsp').append(html);
		}
	});
						   
	$('#centre').on('mouseover', '#lien23', function(){
		overlib('<ul>'+$(this).attr('name')+'<ul>', ABOVE, CENTER,SNAPY, 10, CAPTION,'Code site',WIDTH,'320',FGCOLOR ,'#ff751a ',BGCOLOR ,'#3e3e3e');	
	});
	$('#centre').on('mouseout', '#lien23', function(){
		nd();	
	});
	

	
	//Au clic dans la cellule la chk se coche et se d�coche (priorit�)
	$('#centre').on('click', '.prio', function()
	{
		var chk = $(this).children();
		if(chk.prop('checked'))
		{
			chk.prop('checked', false);
		}
		else
		{
			chk.prop('checked', true);
		}
	});

	$('#centre').on('click', '.chkPrio', function(e){
		e.stopPropagation();
	});
	
	//Au passsage de la souris sur le site et le tsp dans le tableau r�sultat
	$('#centre').on('mouseover', '.code_site, .rq_tsp', function(){
		var titre = '';	
		if($(this).attr('class')=='code_site')
		titre = 'Code site';
		else if($(this).attr('class')=='rq_tsp')
		titre = 'Remarque TSP';
		//On ouvre une infobulle grace � la bibliot�que overlib
		overlib('<ul>'+$(this).attr('name')+'<ul>',  ABOVE, CENTER,SNAPY, 10, CAPTION,titre,WIDTH,'320',FGCOLOR ,'#ff8434',BGCOLOR ,'#3e3e3e');		
	});
	
	//Quand le curseur de la souris s'enl�vele du site et du tsp dans le tableau r�sultat
	//On ferme l'infobulle (overlib)
	$('#centre').on('mouseout', '.code_site, .rq_tsp, .infoBulle', function(){
		nd();		
	});
	
	//Au passage de la souris sur les "?"
	$('#centre').on('mouseover', '.infoBulle', function(){
		var titre='';
		var contenu='';
		if($(this).attr('id') == 'infoNum')
		{
			titre = 'Recherche du num�ro d\'intervention';
			contenu = '<li>Recherche globale : <ul style="list-style-type:disc"><li>Tout &eacutetat</li><li>Tout type</li><li>Toute date</li></ul></li><li>Vous pouvez ne renseigner que les nombre significatis</li><li>Vous pouvez renseigner le code entier de la demande</li>';
		}
		if($(this).attr('id') == 'infoRtsp')
		{
			titre = 'Recherche des interventions en cours pour mon agence';
			contenu = '<li>Affiche le brief du jour pour votre agence</li><li>Si toutes o&ugrave aucunes des priorit&eacutes ne sont coch&eacutees,<br/>le crit&egravere ne sera pas pris en compte</li><li>Si tous o&ugrave aucun des types ne sont coch&eacutes,<br/>le crit&egravere ne sera pas pris en compte</li>';
		}
		
		overlib('<ul style="list-style-type:square">'+contenu+'</ul>',  BELOW, CENTER,SNAPY, 10, CAPTION,titre,WIDTH,'320',FGCOLOR ,'#ff8434',BGCOLOR ,'#3e3e3e');		
	});
	
	//Clic sur recherhce du RTSP
	$('#centre').on('click', '#search_rtsp', function(){
		//On remplit les tableau r�capitulatifs
		$.ajax({
			type:'POST',
			url:'lib/search_intervention.php?recap&rtsp',
			datatype:'json',
			data:$('#form_rtsp').serialize(),
			
			success:function(res)
			{
				//On assigne les valeurs retourn�es du tableau
				//dans chaque cellule du tableau r�capitulatif
				$('#ot_rea_p1_fait').text(res['OT']['ot_rp1_fait']);
				$('#ot_rea_p2_fait').text(res['OT']['ot_rp2_fait']);
				$('#ot_rea_p3_fait').text(res['OT']['ot_rp3_fait']);
				$('#ot_rea_p4_fait').text(res['OT']['ot_rp4_fait']);
				$('#ot_rea_tot_fait').text(res['OT']['ot_rt_fait']);				
				$('#ot_rea_p1_nfait').text(res['OT']['ot_rp1_nfait']);
				$('#ot_rea_p2_nfait').text(res['OT']['ot_rp2_nfait']);
				$('#ot_rea_p3_nfait').text(res['OT']['ot_rp3_nfait']);
				$('#ot_rea_p4_nfait').text(res['OT']['ot_rp4_nfait']);
				$('#ot_rea_tot_nfait').text(res['OT']['ot_rt_nfait']);				
				$('#ot_ord_p1').text(res['OT']['ot_op1']);
				$('#ot_ord_p2').text(res['OT']['ot_op2']);
				$('#ot_ord_p3').text(res['OT']['ot_op3']);
				$('#ot_ord_p4').text(res['OT']['ot_op4']);
				$('#ot_ord_tot').text(res['OT']['ot_ot']);
				
				$('#wo_rea_p1_fait').text(res['WO']['wo_rp1_fait']);
				$('#wo_rea_p2_fait').text(res['WO']['wo_rp2_fait']);
				$('#wo_rea_p3_fait').text(res['WO']['wo_rp3_fait']);
				$('#wo_rea_p4_fait').text(res['WO']['wo_rp4_fait']);
				$('#wo_rea_tot_fait').text(res['WO']['wo_rt_fait']);				
				$('#wo_rea_p1_nfait').text(res['WO']['wo_rp1_nfait']);
				$('#wo_rea_p2_nfait').text(res['WO']['wo_rp2_nfait']);
				$('#wo_rea_p3_nfait').text(res['WO']['wo_rp3_nfait']);
				$('#wo_rea_p4_nfait').text(res['WO']['wo_rp4_nfait']);
				$('#wo_rea_tot_nfait').text(res['WO']['wo_rt_nfait']);				
				$('#wo_ord_p1').text(res['WO']['wo_op1']);
				$('#wo_ord_p2').text(res['WO']['wo_op2']);
				$('#wo_ord_p3').text(res['WO']['wo_op3']);
				$('#wo_ord_p4').text(res['WO']['wo_op4']);
				$('#wo_ord_tot').text(res['WO']['wo_ot']);
				
				$('#inc_rea_p1_fait').text(res['INC']['inc_rp1_fait']);
				$('#inc_rea_p2_fait').text(res['INC']['inc_rp2_fait']);
				$('#inc_rea_p3_fait').text(res['INC']['inc_rp3_fait']);
				$('#inc_rea_p4_fait').text(res['INC']['inc_rp4_fait']);
				$('#inc_rea_tot_fait').text(res['INC']['inc_rt_fait']);
				$('#inc_rea_p1_nfait').text(res['INC']['inc_rp1_nfait']);
				$('#inc_rea_p2_nfait').text(res['INC']['inc_rp2_nfait']);
				$('#inc_rea_p3_nfait').text(res['INC']['inc_rp3_nfait']);
				$('#inc_rea_p4_nfait').text(res['INC']['inc_rp4_nfait']);
				$('#inc_rea_tot_nfait').text(res['INC']['inc_rt_nfait']);				
				$('#inc_ord_p1').text(res['INC']['inc_op1']);
				$('#inc_ord_p2').text(res['INC']['inc_op2']);
				$('#inc_ord_p3').text(res['INC']['inc_op3']);
				$('#inc_ord_p4').text(res['INC']['inc_op4']);
				$('#inc_ord_tot').text(res['INC']['inc_ot']);
			},
			error:function()
			{
				alert('Erreur de chargement du r�capitulatif');
			}
		});
		
		//On affiche uniquement les r�capitulatifs
		//des types d'interventions s�lectionn�s
		
		if($('#ot_rtsp').is(':checked') == false)
		{
			$('#div_recap_ot').hide();
		}
		else
		$('#div_recap_ot').show();
		
		if($('#wo_rtsp').is(':checked') == false)
		{
			$('#div_recap_wo').hide();
		}
		else
		$('#div_recap_wo').show();
		
		if($('#inc_rtsp').is(':checked') == false)
		{
			$('#div_recap_inc').hide();
		}
		else
		$('#div_recap_inc').show();
		
		if($('#inc_rtsp, #ot_rtsp, #wo_rtsp').is(':checked') == false)
		{
			$('#div_recap_inc, #div_recap_ot, #div_recap_wo').show();
		}

		var prio = '';

		if($('.chkPrio:checked').size() < $('.chkPrio').size() && $('.chkPrio:checked').size() > 0)
		{
			$('.chkPrio:checked').each(function(){
				prio += $(this).val()+',';
			});
			prio = prio.substr(0, prio.length-1);
		}

		var txturl = 'lib/search_intervention.php?search_rtsp';
		if(prio != '')
		txturl+='&prio='+prio;
		
		//On remplit le tableau d'affichage du r�sultat
		$.ajax({
			type:'POST',
			url:txturl,
			datatype:'json',
			data:$('#form_rtsp').serialize(),
			
			success:function(res)
			{
				$('#info').empty();
				$('#info').append(res);
				RemplirTableau(res);
				//On affiche la div avec les onglet de r�sultat cach� au chargement
				$('#recap').show();
				$('#div_resultat').show();
			},
			error:function()
			{
				alert('Erreur du chargement du r�sultat');
			}
		});
	});	
	
	//Clic sur recherche par num�ro
	$('#centre').on('click', '#search_numero', function(){
		//V�rification de saisie
		if($('#num_intervention').val() == "")
		alert('Veuillez saisir un num�ro d\'intervention ou la partie significative du num�ro d\'intervention.');
		else
		{
			$.ajax({
				type:'POST',
				url:'lib/search_intervention.php?search_numero',
				datatype:'json',
				data:$('#form_numero').serialize(),
				success:function(res)
				{
					alert(res.length);
					//Si le r�sultat renvoy� contient plus de 500 lignes
					//On demande une confirmation d'affichage des 500 premi�res inter
					if(res.length == 500)
					{
						if(confirm('Le r�sultat de la recherche retourne un nombre d\'intervention sup�rieur � 500.\n'+'Veuillez renseigner le champs num�ro  plus pr�cis�ment\n\nCliquez sur OK pour afficher les 500 premi l�resignes\nCliquez sur Annuler pour retourner � la recherche'))
						{
							RemplirTableau(res);
							//On cache le r�cap pour ce r�sultat
							$('#recap').hide();
							$('#div_resultat').show();
							$('#fait').click();
						}
					}
					//Si la requete ne renvoit rien, on l'indique � l'utilisateur
					else if(res.length == 0)
					{
						alert('Aucunes interventions ne corresponds au num�ro saisi.');
					}
					//Sinon on affiche le r�sultat
					else
					{
						RemplirTableau(res);					
						$('#recap').hide();
						$('#div_resultat').show();
						$('#fait').click();
					}
				},
				error:function()
				{
					alert('Erreur du chargement de la recherche par num�ro');
				}
			});
		}
	});
	
	//Permet de lancer la recherche en appuyat sur la touche "Entr�e"
	$('#centre').on('keydown', '#num_intervention', function(e){
		if(e.keyCode==13)
		{
			$('#search_numero').click();
		}
	});	
													 
	// Permet la s�lection multiple sur les listes d�roulantes
	//
	//
	// Permet la selection multiple DI, Agence de la section RSTP
	$('#chkMulti_rtsp').change(function(){
		if(!$(this).prop('checked'))
		{
			$('#agence_rtsp').attr('multiple', false);
			$('#agence_rtsp').attr('size', '1');
			$('#agence_rtsp').attr('name', 'agence_rtsp');
			$('.label_rtsp').css('vertical-align', '1px');
			$('multi_rtsp').css('vertical-align', '2px');
			$('#di_rtsp').css('vertical-align', '0px');
		}
		else
		{
			$('#agence_rtsp').attr('multiple', true);
			$('#agence_rtsp').attr('size', '5');
			$('#agence_rtsp').attr('name', 'agence_rtsp[]');
			$('.label_rtsp').css('vertical-align', '70px');
			$('#di_rtsp').css('vertical-align', '68px');
		}
	});
	$('#multi_rtsp').on('click', function(){
		$('#chkMulti_rtsp').click();
	});

});