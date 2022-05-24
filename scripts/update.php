<?php

declare(strict_types=1);

$contents = file_get_contents("https://wahapedia.ru/wh40k9ed/factions/aeldari/#Stratagems");

preg_match_all( '%<div class=" stratWrapper_CS BreakInsideAvoid">\s*<div class="stratName_9k .*?">\s*<span>(.*?)</span>\s*<span>(.*?)</span>\s*</div>\s*<div class="stratFaction_CS">(.*?)</div>\s*<p class="ShowFluff stratLegend2">(.*?)</p>\s*<div class="stratText_CS">(.*?)</div>\s*</div>%', $contents, $matches,  PREG_SET_ORDER );

var_dump($matches);

$stratagems = [];

foreach($matches as $match) {

    list($minCost, $maxCost) = array_map( fn($value) => intval($value), explode('/', $match[2]));
    list($specialism, $type) = explode(' – ', $match[3]);

    $description = $match[5];

    $description = preg_replace( '%<span class="kwb kwbu">(.*?)</span>%', '<em>$1</em>', $description );
    $description = strip_tags( $description, '<em>' );
    $description = '<p>'.$description.'</p>';

    $stratagem = new \stdClass();
    $stratagem->title = ucwords(strtolower($match[1]));
    $stratagem->specialism = $specialism;
    $stratagem->type = ucfirst(strtolower($type));
    $stratagem->min_cost = $minCost;
    $stratagem->max_cost = $maxCost;
    $stratagem->fluff = $match[4];
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
$data->group = 'Xenos';
$data->faction = 'Aeldari - Craftworlds';
$data->stratagems = $stratagems;

file_put_contents( '../data/craftworlds.js', 'window.data = '.json_encode($data, JSON_PRETTY_PRINT));