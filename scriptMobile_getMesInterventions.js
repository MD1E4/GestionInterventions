$('#mesInterventions').on('pageshow', function () {

    $.ajax({
        type:'POST',
        url:'mobile_interventions.php?getMesInters',
        datatype:'json',

        success:function(mesInters)
        {
            if(mesInters == '')
            {
                alert('Veuillez vous connecter pour acceder à ce service');
                $('#link_connect').click();
            }
            else
            {
                var html = '<li data-role="list-divider"  role="heading">Le 13/03/2013</li>';

                for( var i = 0 ; i < mesInters.length ; i++ )
                {
                    var linter = mesInters[i];
                    html += '<li><a class="lesInters" title="'+linter.Code_intervention+'" href="#monIntervention">'+linter.Heure_prevue+'</a></li>';
                }

                $('#list_mesInterventions').empty();
                $('#list_mesInterventions').append(html);
                $('#list_mesInterventions').listview('refresh', true);
            }
        },

        error:function()
        {
            alert('Erreur lors du chargement de vos interventions');
        }
    });

    $('#list_mesInterventions').on('click', '.lesInters', function() {
        $.ajax({
            type:'POST',
            url:'mobile_interventions.php?getMonInter',
            datatype:'html',
            data:{ codeInter:$(this).attr('title') },

            success:function(monInter)
            {
                $('.infoInter').empty();
                $('#iNumero').append(monInter[0].Code_intervention);
                $('#iLieu').append(monInter[0].Code_site);
                $('#iUtilisateur').append(monInter[0].Utilisateur);
                $('#iPriorite').append(monInter[0].Priorite);
                $('#iHPrevue').append(monInter[0].Heure_prevue.substr(0,5));
                $('#iDPrevue').append(monInter[0].Duree_prevue);

                var etat = monInter[0].Id_etat;

                if(etat == 1)
                {
                    $('#cmdStartEnd').css('background', 'green');
                    $('#labelSTEN').empty()
                    .append('D&eacute;marrer');
                }
                else if (etat == 4)
                {
                    $('#cmdStartEnd').css('background', 'red');
                    $('#labelSTEN').empty()
                    .append('Terminer');
                }
            },

            error:function()
            {
                alert('Erreur lors du chargement de vos interventions');
            }
        });

    });
});