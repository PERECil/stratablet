# Stratablet

Stratablet is a small tool that allows you to consult Warhammer 40000 stratagems on a small portable device like 
a smartphone or a tablet.

Currently, only pure craftworlds (ie, no harlequins) are supported, because I don't have the stratagems for other 
factions. See authoring below to add new stratagems.

You can access the tool at the following url:

http://perecil.github.io/stratablet/

Or by scanning the following QR code:

![Stratablet](./resources/img/qr-code.svg)

## Authoring

If you want to have other factions in the tool, please provide a simple CSV file containing the following data:

|Field|Type|Description| Example                                                                                                                                                                                                                                                                                                                                                                                                       | Remarks                                                                                                                                                                          |
|---|---|---|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|title|string|The name of the stratagem| Multifaceted mind                                                                                                                                                                                                                                                                                                                                                                                             ||
|type|string|The type of the stratagem| Epic deed stratagem                                                                                                                                                                                                                                                                                                                                                                                           | Currently, only the following values are supported: "Battle tactic stratagem", "Epic deed stratagem", "Requisition stratagem", "Strategic ploy stratagem", "Equipment stratagem" |
|min_cost|integer|The cost of the stratagem| 1                                                                                                                                                                                                                                                                                                                                                                                                             | See the max_cost if the stratagem has a variable cost                                                                                                                            |
|max_cost|integer|The maximum cost of the stratagem| 2                                                                                                                                                                                                                                                                                                                                                                                                             | Leave empty if the stratagem has no variable cost                                                                                                                                |
|description|string|The description of the stratagem, as an HTML chunk or plain text.| &lt;p&gt;Use this Stratagem in the Fight phase, when a &lt;em&gt;FIRE DRAGONS&lt;/em&gt; unit from your army is selected to fight. Select one model in that unit, that model can only make one attack this phase, and must target an enemy &lt;em&gt;VEHICLE&lt;/em&gt; unit with that attack, but if a hit is scored, that &lt;em&gt;VEHICLE&lt;/em&gt; unit suffers 2D3 mortal wounds and	the attack sequence ends.&lt;/p&gt; | If HTML is used, you can mark keywords with the &lt;em&gt; tag.                                                                                                                  |
