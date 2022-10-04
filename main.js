window.data = [];

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').then(
      registration => console.log('ServiceWorker registration successful with scope: ', registration.scope),
      err => console.log('ServiceWorker registration failed: ', err)
    );
  });
}

// Sidebar closing gestures
window.addEventListener('load', () => {
  let touchstartX = 0;
  let touchendX = 0;

  const gestureZone = document.querySelectorAll('.sidebar');

  gestureZone.forEach( item => {
    item.addEventListener('touchstart', function(event) {
      touchstartX = event.changedTouches[0].screenX;
    }, false);
  });

  gestureZone.forEach( item => {
    item.addEventListener('touchend', function(event) {
        touchendX = event.changedTouches[0].screenX;
        handleGesture(item);
    }, false); 
  });

  gestureZone.forEach( item => {
    item.addEventListener('mousedown', function(event) {
      touchstartX = event.clientX;
    }, false);
  });

  gestureZone.forEach( item => {
    item.addEventListener('mouseup', function(event) {
      touchendX = event.clientX;
      handleGesture(item);
    }, false); 
  });

  function handleGesture(item) {
      // Add a small threshold of 100px to avoid false swipes
      if (touchendX + 100 < touchstartX) {
          item.previousElementSibling.checked = false;
      }
  }
});
// End sidebar closing gestures

// Sidebar opening gestures
window.addEventListener('load', () => {
  let touchstartX = 0;
  let touchendX = 0;

  const gestureZone = document.querySelectorAll('.screen');

  gestureZone.forEach( item => {
    item.addEventListener('touchstart', function(event) {
      touchstartX = event.changedTouches[0].screenX;
    }, false);
  });

  gestureZone.forEach( item => {
    item.addEventListener('touchend', function(event) {
        touchendX = event.changedTouches[0].screenX;
        handleGesture(item);
    }, false); 
  });

  gestureZone.forEach( item => {
    item.addEventListener('mousedown', function(event) {
      touchstartX = event.clientX;
    }, false);
  });

  gestureZone.forEach( item => {
    item.addEventListener('mouseup', function(event) {
      touchendX = event.clientX;
      handleGesture(item);
    }, false); 
  });

  function handleGesture(item) {
      // Add a small threshold of 100px to avoid false swipes
      if (touchendX - 100 > touchstartX) {
          item.querySelector(".sidebar-collapse").checked = true;
      }
  }
});
// End sidebar opening gestures


window.addEventListener('load', () => {

  let getCurrentFactionId = function() {

    return window.localStorage.getItem('faction') ?? "space-marines";

  };

  let getCurrentFaction = function(identifier) {

    let currentFaction = null;

    // Look up for the id
    for(let i in window.data) {
      let faction = window.data[i];

      if(faction.id === identifier) {
        currentFaction = faction;
      }
    }

    // Last chance fallback, use the first item
    if(currentFaction === null) {
      currentFaction = window.data[0];
    }

    return currentFaction;
  };

  let loadStratagems = function (identifier) {

    let currentFaction = getCurrentFaction(identifier);

    window.localStorage.setItem( 'faction', currentFaction.id );

    document.querySelector('#setup article').innerHTML = '';
    document.querySelector('#main .sidebar').innerHTML = '';
    document.querySelector('#main article').innerHTML = '';

    // Fill stratagems on the main app
    for(const stratagem of currentFaction.stratagems)
    {
      const className = currentFaction.id + '-' + stratagem.title.toLowerCase().replaceAll(/[^a-zA-Z]/g, '-').replaceAll( /-*$/g, '' );
      const typeClass = stratagem.type?.toLowerCase().replace(' stratagem', '').replaceAll(/[^a-zA-Z]/g, '-').replaceAll( /-*$/g, '' );
      const state = ( window.localStorage.getItem(className) ?? "true" ) === "true";

      // Add the element to the main sidebar
      document.querySelector('#main .sidebar').innerHTML += '<a href="#' + className + '" class="' + className + ( state === true ? '' : ' hidden' ) + '">' + stratagem.title + '</a>';

      let html = "";

      types = [];

      if( stratagem.type !== null ) {
        types.push(stratagem.type);
      }

      if( stratagem.specialism !== null) {
        types.push(stratagem.specialism);
      }

      html += '<div class="stratagem ' + className + ( state === true ? '' : ' hidden' ) + '">';
      html += '  <h2 id="' + className + '" class="' + typeClass + '">';
      html += '    <span>' + stratagem.title + '</span>';
      html += '    <span class="cost">' + stratagem.min_cost + 'CP' + ( stratagem.max_cost ? '/' + stratagem.max_cost + 'CP' : '' ) + '</span>';
      html += '  </h2>';
      html += '  <p class="type">' + types.join( ' - ' ) + '</p>';
      html += '  <section class="description">' + stratagem.description + '</section>';
      html += '</div>';

      document.querySelector('#main article').innerHTML += html;
    }

    document.getElementById( 'setup' ).setAttribute( 'data-faction-id', currentFaction.id );

    // Fill stratagems on setup screen
    for(const stratagem of currentFaction.stratagems)
    {
      const className = currentFaction.id + '-' + stratagem.title.toLowerCase().replaceAll(/[^a-zA-Z]/g, '-').replaceAll( /-*$/g, '' );
      const typeClass = stratagem.type?.toLowerCase().replace(' stratagem', '').replaceAll(/[^a-zA-Z]/g, '-').replaceAll( /-*$/g, '' );
      const state = ( window.localStorage.getItem(className) ?? "true" ) === "true";
  
      let html = "";
  
      html += '<div class="stratagem ' + className + '">';
      html += '  <input type="checkbox" data-stratagem-id="'+ stratagem.id + '" class="switch" id="switch-' + className + '" autocomplete="off" ' + ( state === true ? 'checked="checked" ' : ' ' ) + '/>';
      html += '  <label class="configuration-item" id="label-switch-' + className + '" for="switch-' + className + '" data-class="' + className + '">Show "' + stratagem.title + '" on the list</label>';
      html += '  <section class="description">' + stratagem.description + '</section>';
      html += '</div>';
  
      document.querySelector('#setup article').innerHTML += html;
    }

    // Load the preset list
    let html = '';

    let savedPresets = JSON.parse( window.localStorage.getItem( 'presets' ) || '{}' );

    for( let faction of window.presets ) 
    {
      if(faction.id === identifier)
      {
        // Generate public presets
        for( let preset of faction.presets )
        { 
          html += generatePreset(preset, false);
        }
      }
    }

    // Generate custom saved presets
    let factionSavedPresets = savedPresets[identifier] ?? [];

    for( let preset of factionSavedPresets )
    {
      html += generatePreset(preset, true);
    }
    

    document.getElementById( 'presets' ).innerHTML = html;
  }

  // Close off the main sidebar when a stratagem has been selected
  document.querySelector( '#main .sidebar' ).addEventListener( 'click', (e) => {
    if (e.target && e.target.matches('a')) {
      document.getElementById( 'main-sidebar-collapse' ).checked = false;
    }
  });

  // Close off the main sidebar when a stratagem has been selected
  document.querySelector( '#setup .sidebar' ).addEventListener( 'click', (e) => {
    if (e.target && e.target.matches('label')) {
      document.getElementById( 'setup-sidebar-collapse' ).checked = false;
    }
  });

  // When clicking on a faction, set the faction on the main screen
  document.querySelector( '#setup .sidebar' ).addEventListener( 'click', (e) => {
    if (e.target && e.target.matches('[data-faction-id]')) {
      let source = e.target.getAttribute( 'data-faction-id' );
      window.localStorage.setItem('faction', source);
      loadStratagems(source);
    }
  });

  let getPreset = function(presetId) {

    for( faction of window.presets ) {
      for( candidate of faction.presets ) {
        if(candidate.id === presetId) {
          return preset;
        }
      }
    }

    return null;
  };

  document.querySelector( '#presets' ).addEventListener( 'click', (e) => {

    // When clicking on a preset, set the preset
    if (e.target && e.target.matches('li[data-preset-id]')) {

      let presetId = e.target.getAttribute( 'data-preset-id' );
      let preset = getPreset(presetId);

      let currentFaction = getCurrentFaction(getCurrentFactionId());

      for(stratagem of currentFaction.stratagems) {
        let elt = document.querySelector( '#setup article [data-stratagem-id="' + stratagem.id + '"]' );

        if(elt.checked == false) {
          if(preset.stratagems.includes(stratagem.id)) {
            elt.nextElementSibling.click();
          }
        } else {
          if(!preset.stratagems.includes(stratagem.id)) {
            elt.nextElementSibling.click();
          }
        }
      }

      // Close the window
      document.getElementById( 'open-prompt-control' ).checked = false;
    }

    // Trash the preset
    if (e.target && e.target.matches('.trash[data-preset-id]')) {

      let savedPresets = JSON.parse( window.localStorage.getItem( 'presets' ) || '{}' );

      let presetId = e.target.getAttribute( 'data-preset-id' );

      if(typeof savedPresets[getCurrentFactionId()] === "undefined") {
        savedPresets[getCurrentFactionId()] = [];
      }
  
      savedPresets[getCurrentFactionId()] = savedPresets[getCurrentFactionId()].filter( (x) => x.id !== presetId );

      window.localStorage.setItem('presets', JSON.stringify(savedPresets));

      document.querySelector( '#presets li[data-preset-id="' + presetId + '"]' ).remove();
    }

  });

  // Save preset function
  document.getElementById( 'process-save' ).addEventListener( 'click', (e) => {

    const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

    let preset = {};

    preset.id = genRanHex(6);
    preset.is_default = false;
    preset.name = document.getElementById( 'configuration-name').value;
    preset.stratagems = [];

    document.querySelectorAll( '#setup article input' ).forEach( (item) => {
      if( item.checked ) {
        preset.stratagems.push(item.getAttribute( 'data-stratagem-id' ));
      }
    });

    // Save the preset to the local preset list
    let savedPresets = JSON.parse( window.localStorage.getItem( 'presets' ) || '{}' );

    if(typeof savedPresets[getCurrentFactionId()] === "undefined") {
      savedPresets[getCurrentFactionId()] = [];
    }

    savedPresets[getCurrentFactionId()].push(preset);

    window.localStorage.setItem('presets', JSON.stringify(savedPresets));

    // Add the newly created preset to the list of the presets
    document.querySelector( '#presets' ).innerHTML += generatePreset(preset, true);
  });

  // Show and hide items
  document.getElementById( 'setup' ).addEventListener( 'click', (e) => {

    if (e.target && e.target.matches('.configuration-item')) {
      let className = e.target.getAttribute( 'data-class' );
      let state = e.target.previousElementSibling.checked;

      window.localStorage.setItem( className, (!state).toString() );

      for(let target of document.querySelectorAll( '#main .' + className )) {
        target.classList.toggle( 'hidden', state );
      }
    }
  });

  function generatePreset(preset, isCustom)
  {
    html = '';

    html += '    <li id="preset-' + preset.id + '" class="preset ' + ( isCustom ? 'custom' : 'public' ) + '" data-preset-id="' + preset.id + '">';
    html += '      <span>' + preset.name + '</span>';

    if(isCustom) {
      html += '      <span class="trash" data-preset-id="' + preset.id + '"></span>';
    }

    html += '    </li>';  

    return html;
  }

  // Setup 
  let html = '<h3>Faction selection</h3>';

  const selectedFaction = getCurrentFactionId();

  for( let faction of window.data ) 
  {
      html += '  <input type="radio" name="faction" id="faction-' + faction.id + '" autocomplete="off" ' + ( faction.id === selectedFaction ? ' checked="checked"' : '' ) + '/>';
      html += '  <label class="faction" for="faction-' + faction.id + '" data-faction-id="'+ faction.id + '">';
      html += '    <img src="resources/img/factions/' + faction.id + '.svg" title="'+ faction.faction +'" />';
      html += '    <span>' + faction.faction + '</span>';
      html += '  </label>';
  }

  document.querySelector( '#setup .sidebar' ).innerHTML += html;
  
  loadStratagems(selectedFaction);
});