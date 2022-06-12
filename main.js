window.data = [];

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').then(
      registration => console.log('ServiceWorker registration successful with scope: ', registration.scope),
      err => console.log('ServiceWorker registration failed: ', err)
    );
  });
}

window.addEventListener('load', () => {

  let loadStratagems = function (data) {

    document.querySelector('#setup ol').innerHTML = '';
    document.querySelector('#sidebar').innerHTML = '';
    document.querySelector('article').innerHTML = '';

    for(const stratagem of data.stratagems)
    {
      const className = stratagem.title.toLowerCase().replaceAll(' ', '-');
      const typeClass = stratagem.type.toLowerCase().replace(' stratagem', '').replaceAll(' ', '-');
      const state = ( window.localStorage.getItem(className) ?? "true" ) === "true";

      document.querySelector('#setup ol').innerHTML += '<li><input type="checkbox" class="switch" id="switch-' + className + '" autocomplete="off" ' + ( state === true ? 'checked="checked" ' : ' ' ) + '/><label class="configuration-item" id="label-switch-' + className + '" for="switch-' + className + '" data-class="' + className + '">Show "' + stratagem.title + '" on the list</label>' + stratagem.description + '</li>';
      document.querySelector('#sidebar').innerHTML += '<a href="#' + className + '" class="' + className + ( state === true ? '' : ' hidden' ) + '">' + stratagem.title + '</a>';

      let html = "";

      html += '<div class="stratagem ' + className + ( state === true ? '' : ' hidden' ) + '">';
      html += '   <span class="cost">' + stratagem.min_cost + 'CP' + ( stratagem.max_cost ? '/' + stratagem.max_cost + 'CP' : '' ) + '</span>';
      html += '   <h2 id="' + className + '" class="' + typeClass + '">' + stratagem.title + '</h2>';
      html += '   <p class="type">' + stratagem.type + ( stratagem.specialism === null ? '' : ' - ' + stratagem.specialism ) +  '</p>';
      html += '   <section class="description">' + stratagem.description + '</section>';
      html += '</div>';

      document.querySelector('article').innerHTML += html;
    }

  }

  document.getElementById( 'sidebar' ).addEventListener( 'click', (e) => {
    if (e.target && e.target.matches('a')) {
      document.getElementById( 'sidebar-collapse' ).checked = false;
    }
  });

  document.getElementById( 'setup' ).addEventListener( 'click', (e) => {

    if (e.target && e.target.matches('.configuration-item')) {
      let className = e.target.getAttribute( 'data-class' );
      let state = e.target.previousElementSibling.checked;

      window.localStorage.setItem( className, (!state).toString() );

      for(let target of document.querySelectorAll( '.' + className )) {
        target.classList.toggle( 'hidden', state );
      }
    }

    if (e.target && e.target.matches('[data-source]')) {
      let source = e.target.getAttribute( 'data-source');
      window.localStorage.setItem('faction', source);
      loadStratagems(window.data[parseInt(source,10)]);
    }
  });

  for( var i = 0; i < window.data.length; i++ ) 
  {
      let faction = window.data[i];
      let button = '';
      
      button += '<input type="radio" name="faction" id="' + faction.id + '" autocomplete="off" />';
      button += '<label id="label-' + faction.id + '" for="' + faction.id + '">';
      button += '  <img src="resources/img/factions/' + faction.id + '.svg" title="'+ faction.faction +'" data-source="' + i + '" />';
      button += '  <span>' + faction.faction + '</span>';
      button += '</label>';

      document.getElementById( 'factions' ).innerHTML += button;
  }
  
  const selectedFaction = parseInt( ( window.localStorage.getItem('faction') ?? "0" ), 10);

  document.querySelectorAll( '#setup input[type="radio"]' ).item( selectedFaction ).checked = true;

  loadStratagems(window.data[selectedFaction]);
})