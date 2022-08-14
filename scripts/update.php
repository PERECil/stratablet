<?php

declare(strict_types=1);

function fix_specialism(string $specialism)
{
    if($specialism === 'Aeldari (Harlequins)') {
        return 'Harlequins';
    }

    return $specialism;
}

function leech(string $group, string $faction, string $id, string $path, string $url)
{
    $contents = file_get_contents($url);

    $stratagems = [];

    // 9th ed format
    preg_match_all( '%<div class=" stratWrapper_CS BreakInsideAvoid">\s*<div class="stratName_9k (.*?)">\s*<span>(.*?)</span>\s*<span>(.*?)</span>\s*</div>\s*<div class="stratFaction_CS">(.*?)</div>\s*<p class="ShowFluff stratLegend2">(.*?)</p>\s*<div class="stratText_CS">(.*?)</div>\s*</div>%', $contents, $matches,  PREG_SET_ORDER );
        
    foreach($matches as $match) {
    
        if( $match[1] === 'BannerUpgrades') {
            continue;
        }

        $costs = array_map( fn($value) => intval($value), explode('/', $match[3]));
        
        $minCost = $costs[0];
        $maxCost = null;

        if(count($costs) > 1) {
            $maxCost = $costs[1];
        }

        $types = explode(' – ', $match[4]);

        $specialism = $types[0];

        $specialism = fix_specialism($specialism);

        $type = null;

        if(count($types) > 1) {
            $type = $types[1];
        }
    
        $description = $match[6];
    
        $description = preg_replace( '%<span class="(kwb|.*? kwb .*?|kwb .*?|.*? kwb)">(.*?)</span>%', '<em>$2</em>', $description );
        $description = strip_tags( $description, '<em><ul><li>' );
        $description = '<p>'.$description.'</p>';
    
        $stratagem = new \stdClass();
        $stratagem->title = ucwords(strtolower($match[2]));
        $stratagem->specialism = $specialism;
        $stratagem->type = $type === null ? null : ucfirst(strtolower($type));
        $stratagem->min_cost = $minCost;
        $stratagem->max_cost = $maxCost;
        $stratagem->fluff = $match[5];
        $stratagem->description = $description;
    
        // Avoid double insertions
        foreach($stratagems as $existing) {
            if($existing->title === $stratagem->title) {
                continue 2;
            }
        }
    
        $stratagems[] = $stratagem;
    }
    
    // <p class="stratName">(.*?)</p>\s*<p class="stratFaction">(.*?)</p>\s*<p class="ShowFluff stratLegend">(.*?)</p>(.*?)</td>\s*<td class="Corner7_4">\s*</td>\s*</tr>\s*<tr>\s*<td class="Corner7_7">\s*</td>\s*<td class="Corner7_6">\s*</td>\s*<td class="Corner7_5">\s*</td>\s*</tr>\s*</tbody>\s*</table>\s*</div>
    // 8th ed format
    preg_match_all( '%<div style="top:14px;left:-13px;position:absolute">\s*<div class="BreakInsideAvoid Corner6" style="padding:6px;">\s*<table class="frameLight collapse" (.*?)>\s*<tbody>\s*<tr>\s*<td(.*?)>\s*</td>\s*<td(.*?)>\s*</td>\s*<td(.*?)>\s*</td>\s*</tr>\s*<tr>\s*<td(.*?)>\s*</td>\s*<td(.*?)>\s*<div class="stratPts">(.*?)</div>\s*</td>\s*<td(.*?)>\s*</td>\s*</tr>\s*<tr>\s*<td(.*?)>\s*</td>\s*<td(.*?)>\s*</td>\s*</tr>\s*</tbody>\s*</table>\s*</div>\s*</div>\s*<div class="BreakInsideAvoid Corner7" style="padding:6px;max-width:460px;">\s*<table collapse" border="0" cellpadding="0" cellspacing="0" ><tbody><tr><td class="Corner7_1"></td><td class="Corner7_2"></td><td class="Corner7_3"></td></tr><tr><td class="Corner7_8"></td><td class="Corner7_9"><p class="stratName">(.*?)</p><p class="stratFaction">(.*?)</p><p class="ShowFluff stratLegend">(.*?)</p>(.*?)</td><td class="Corner7_4"></td>\s*%', $contents, $matches,  PREG_SET_ORDER );

    foreach($matches as $match) {
    
        $costs = array_map( fn($value) => intval($value), explode('/', $match[7]));
        
        $minCost = $costs[0];
        $maxCost = null;

        if(count($costs) > 1) {
            $maxCost = $costs[1];
        }

        $types = explode(' – ', $match[12]);

        $specialism = $types[0];

        $specialism = fix_specialism($specialism);

        $type = null;

        if(count($types) > 1) {
            $type = $types[1];
        }
    
        $description = $match[14];
    
        $description = preg_replace( '%<span class="(kwb|.*? kwb .*?|kwb .*?|.*? kwb)">(.*?)</span>%', '<em>$2</em>', $description );
        $description = strip_tags( $description, '<em><ul><li>' );
        $description = '<p>'.$description.'</p>';
    
        $stratagem = new \stdClass();
        $stratagem->title = ucwords(strtolower($match[11]));
        $stratagem->specialism = $specialism;
        $stratagem->type = $type === null ? null : ucfirst(strtolower($type));
        $stratagem->min_cost = $minCost;
        $stratagem->max_cost = $maxCost;
        $stratagem->fluff = $match[13];
        $stratagem->description = $description;
    
        // Avoid double insertions
        foreach($stratagems as $existing) {
            if($existing->title === $stratagem->title) {
                continue 2;
            }
        }
    
        $stratagems[] = $stratagem;
    }

    usort($stratagems, fn($a, $b) => $a->title <=> $b->title );
    
    $data = new \stdClass();
    $data->group = $group;
    $data->faction = $faction;
    $data->id = $id;
    $data->stratagems = $stratagems;
    
    file_put_contents( $path, 'window.data.push( '.json_encode($data, JSON_PRETTY_PRINT ).');' );
}

// leech( 'Xenos', 'Aeldari - Craftworlds', 'aeldari-craftworlds', '../data/craftworlds.js', 'https://wahapedia.ru/wh40k9ed/factions/aeldari/#Stratagems');
// leech( 'Imperium', 'Space Marines', 'space-marines', '../data/spacemarines.js', 'https://wahapedia.ru/wh40k9ed/factions/space-marines/#Stratagems');
// leech( 'Imperium', 'Astra Militarum', 'astra-militarum', '../data/astramilitarum.js', 'https://wahapedia.ru/wh40k9ed/factions/astra-militarum/#Stratagems');
// leech( 'Xenos', 'T\'au Empire', 'tau-empire', '../data/tau.js', 'https://wahapedia.ru/wh40k9ed/factions/t-au-empire/#Stratagems');
// leech( 'Imperium', 'Adeptus Custodes', 'adeptus-custodes', '../data/adeptuscustodes.js', 'https://wahapedia.ru/wh40k9ed/factions/adeptus-custodes/#Stratagems');
leech( 'Chaos', 'Thousand sons', 'thousand-sons', '../data/thousandsons.js', 'https://wahapedia.ru/wh40k9ed/factions/thousand-sons/#Stratagems' );
