window.data = [];

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then((function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }), function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

$( document ).ready( function() 
{
    function loadStratagems(data) {

        $( '#setup ol' ).html('');
        $( '#sidebar' ).html('');
        $('article').html('');

        for(const stratagem of data.stratagems)
        {
            const className = stratagem.title.toLowerCase().replaceAll(' ', '-');
            const typeClass = stratagem.type.toLowerCase().replace(' stratagem', '').replaceAll(' ', '-');
            const state = ( window.localStorage.getItem(className) ?? "true" ) === "true";

            $( '#setup ol' ).append( '<li><input type="checkbox" class="switch" id="switch-' + className + '" autocomplete="off" ' + ( state === true ? 'checked="checked" ' : ' ' ) + '/><label for="switch-' + className + '" data-class="' + className + '">Show "' + stratagem.title + '" on the list</label>' + stratagem.description + '</li>' );
            $( '#sidebar' ).append( '<a href="#' + className + '" class="' + className + ( state === true ? '' : ' hidden' ) + '">' + stratagem.title + '</a>' );

            let html = "";

            html += '<div class="stratagem ' + className + ( state === true ? '' : ' hidden' ) + '">';
            html += '   <span class="cost">' + stratagem.min_cost + 'CP' + ( stratagem.max_cost ? '/' + stratagem.max_cost + 'CP' : '' ) + '</span>';
            html += '   <h2 id="' + className + '" class="' + typeClass + '">' + stratagem.title + '</h2>';
            html += '   <p class="type">' + stratagem.type + ( stratagem.specialism === null ? '' : ' - ' + stratagem.specialism ) +  '</p>';
            html += '   <section class="description">' + stratagem.description + '</section>';
            html += '</div>';

            $( 'article' ).append( html );
        }
    }

    $( '#setup' ).on( 'click', 'ol label', function() {
        let className = $(this).data('class');
        let state = $( this ).prev().prop( 'checked' );

        window.localStorage.setItem( className, (!state).toString() );
        $( '.' + className ).toggleClass( 'hidden', state );
    });

    $( '#sidebar' ).on( 'click', 'a', function() {
        $( '#sidebar-collapse' ).prop( 'checked', false );
    });

    $( '#setup' ).on('click', '[data-source]', function() {
        window.localStorage.setItem('faction', $(this).data('source'));
        loadStratagems(window.data[$(this).data('source')]);
    });

    for( var i = 0; i < window.data.length; i++ ) 
    {
        let faction = window.data[i];
        let button = '';
        
        button += '<input type="radio" name="faction" id="' + faction.id + '" autocomplete="off" />';
        button += '<label for="' + faction.id + '" data-source="' + i + '">';
        button += '  <img src="resources/img/factions/' + faction.id + '.svg" title="'+ faction.faction +'" />';
        button += '  <span>' + faction.faction + '</span>';
        button += '</label>';

        $( '#factions' ).append( button );
    }

    const selectedFaction = parseInt( ( window.localStorage.getItem('faction') ?? "0" ), 10);

    $( '#setup input[type="radio"]:eq(' + selectedFaction + ')' ).prop( 'checked', true );

    loadStratagems(window.data[selectedFaction]);
});