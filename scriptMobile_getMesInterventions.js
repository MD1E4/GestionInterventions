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
        alert('1:'+$(this).attr('title'));
        $.ajax({
            type:'POST',
            url:'mobile_interventions.php?getMonInter',
            datatype:'html',
            data:{ codeInter:$(this).attr('title') },

            success:function(mesInters)
            {
                alert(mesInters);
            },

            error:function()
            {
                alert('Erreur lors du chargement de vos interventions');
            }
        });

    });
});