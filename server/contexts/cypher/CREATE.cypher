CREATE
(:Stat {name: 'hp'}),
(:Stat {name: 'attack'}),
(:Stat {name: 'defense'}),
(:Stat {name: 'special-attack'}),
(:Stat {name: 'special-defense'}),
(:Stat {name: 'speed'})

MATCH (h:Stat {name: 'hp'}) SET h.order = 0;
MATCH (a:Stat {name: 'attack'}) SET a.order = 1;
MATCH (d:Stat {name: 'defense'}) SET d.order = 2;
MATCH (sa:Stat {name: 'special-attack'}) SET sa.order = 3;
MATCH (sd:Stat {name: 'special-defense'}) SET sd.order = 4;
MATCH (sp:Stat {name: 'speed'}) SET sp.order = 5;


CREATE
(:DamageClass {name: 'physical'}),
(:DamageClass {name: 'special'}),
(:DamageClass {name: 'status'})

CREATE INDEX ON :Type(name);
CREATE INDEX ON :Move(name);
CREATE INDEX ON :Ability(name);
CREATE INDEX ON :Pokemon(name);
CREATE INDEX ON :DamageClass(name);
CREATE INDEX ON :Stat(name);
CREATE INDEX ON :Item(name);



CREATE INDEX ON :Nature(name)

MATCH
    (atk:Stat {name: 'attack'}),
    (def:Stat {name: 'defense'}),
    (spa:Stat {name: 'special-attack'}),
    (spd:Stat {name: 'special-defense'}),
    (spe:Stat {name: 'speed'})

MERGE (bashful:Nature {name: 'bashful'}) 
MERGE (docile:Nature {name: 'docile'}) 
MERGE (hardy:Nature {name: 'hardy'}) 
MERGE (quirky:Nature {name: 'quirky'}) 
MERGE (serious:Nature {name: 'serious'})

MERGE (adamant:Nature {name: 'adamant'})
MERGE (bold:Nature {name: 'bold'})
MERGE (brave:Nature {name: 'brave'})
MERGE (calm:Nature {name: 'calm'})
MERGE (careful:Nature {name: 'careful'})
MERGE (gentle:Nature {name: 'gentle'})
MERGE (hasty:Nature {name: 'hasty'})
MERGE (impish:Nature {name: 'impish'})
MERGE (jolly:Nature {name: 'jolly'})
MERGE (lax:Nature {name: 'lax'})
MERGE (lonely:Nature {name: 'lonely'})
MERGE (mild:Nature {name: 'mild'})
MERGE (modest:Nature {name: 'modest'})
MERGE (naive:Nature {name: 'naive'})
MERGE (naughty:Nature {name: 'naughty'})
MERGE (quiet:Nature {name: 'quiet'})
MERGE (rash:Nature {name: 'rash'})
MERGE (relaxed:Nature {name: 'relaxed'})
MERGE (sassy:Nature {name: 'sassy'})
MERGE (timid:Nature {name: 'timid'})


MERGE(adamant)-[:MODIFIES_STAT {multiplier: 1.1}]->(atk) 
MERGE(adamant)-[:MODIFIES_STAT {multiplier: 0.9}]->(spa)  
MERGE(bold)-[:MODIFIES_STAT {multiplier: 0.9}]->(atk) 
MERGE(bold)-[:MODIFIES_STAT {multiplier: 1.1}]->(def)   
MERGE(brave)-[:MODIFIES_STAT {multiplier: 1.1}]->(atk) 
MERGE(brave)-[:MODIFIES_STAT {multiplier: 0.9}]->(spe)
MERGE(calm)-[:MODIFIES_STAT {multiplier: 0.9}]->(atk) 
MERGE(calm)-[:MODIFIES_STAT {multiplier: 1.1}]->(spd) 
MERGE(careful)-[:MODIFIES_STAT {multiplier: 0.9}]->(spa) 
MERGE(careful)-[:MODIFIES_STAT {multiplier: 1.1}]->(spd) 
MERGE(gentle)-[:MODIFIES_STAT {multiplier: 0.9}]->(def) 
MERGE(gentle)-[:MODIFIES_STAT {multiplier: 1.1}]->(spd) 
MERGE(hasty)-[:MODIFIES_STAT {multiplier: 0.9}]->(def) 
MERGE(hasty)-[:MODIFIES_STAT {multiplier: 1.1}]->(spe)
MERGE(impish)-[:MODIFIES_STAT {multiplier: 1.1}]->(def) 
MERGE(impish)-[:MODIFIES_STAT {multiplier: 0.9}]->(spa)  
MERGE(jolly)-[:MODIFIES_STAT {multiplier: 0.9}]->(spa) 
MERGE(jolly)-[:MODIFIES_STAT {multiplier: 1.1}]->(spe)
MERGE(lax)-[:MODIFIES_STAT {multiplier: 1.1}]->(def) 
MERGE(lax)-[:MODIFIES_STAT {multiplier: 0.9}]->(spd) 
MERGE(lonely)-[:MODIFIES_STAT {multiplier: 1.1}]->(atk) 
MERGE(lonely)-[:MODIFIES_STAT {multiplier: 0.9}]->(def)   
MERGE(mild)-[:MODIFIES_STAT {multiplier: 0.9}]->(def) 
MERGE(mild)-[:MODIFIES_STAT {multiplier: 1.1}]->(spa)  
MERGE(modest)-[:MODIFIES_STAT {multiplier: 0.9}]->(atk) 
MERGE(modest)-[:MODIFIES_STAT {multiplier: 1.1}]->(spa)  
MERGE(naive)-[:MODIFIES_STAT {multiplier: 0.9}]->(spd) 
MERGE(naive)-[:MODIFIES_STAT {multiplier: 1.1}]->(spe)
MERGE(naughty)-[:MODIFIES_STAT {multiplier: 1.1}]->(atk) 
MERGE(naughty)-[:MODIFIES_STAT {multiplier: 0.9}]->(spd) 
MERGE(quiet)-[:MODIFIES_STAT {multiplier: 1.1}]->(spa) 
MERGE(quiet)-[:MODIFIES_STAT {multiplier: 0.9}]->(spe)
MERGE(rash)-[:MODIFIES_STAT {multiplier: 1.1}]->(spa) 
MERGE(rash)-[:MODIFIES_STAT {multiplier: 0.9}]->(spd) 
MERGE(relaxed)-[:MODIFIES_STAT {multiplier: 1.1}]->(def) 
MERGE(relaxed)-[:MODIFIES_STAT {multiplier: 0.9}]->(spe)
MERGE(sassy)-[:MODIFIES_STAT {multiplier: 1.1}]->(spd) 
MERGE(sassy)-[:MODIFIES_STAT {multiplier: 0.9}]->(spe)
MERGE(timid)-[:MODIFIES_STAT {multiplier: 0.9}]->(atk) 
MERGE(timid)-[:MODIFIES_STAT {multiplier: 1.1}]->(spe)


CREATE INDEX nature_index FOR (n:Nature) ON (n.name);
CREATE INDEX user_index FOR (u:User) ON (u.username);
CREATE INDEX user_team_index FOR (ut:UserTeam) ON (ut.name);
CREATE INDEX user_set_index FOR (us:UserSet) ON (us.name);

CREATE CONSTRAINT ON (u:User) ASSERT u.username IS UNIQUE;
CREATE CONSTRAINT ON (u:User) ASSERT u.email IS UNIQUE;
CREATE INDEX ON :UserSet(name);




// given a user, get list of teams including thumbnail sprite links of all sets
MATCH (u:User {username: 'Zander'})-[:HAS_TEAM]->(t:UserTeam) WITH t
OPTIONAL MATCH (t)-[hs:HAS_SET]->(s:UserSet)-[:IS_POKEMON]->(p:Pokemon) WITH t, s, hs, p
ORDER BY t.updated_at DESC, hs.slot
RETURN {
    guid: id(t), 
    name: t.name, 
    sets: CASE WHEN s IS NOT NULL THEN collect({guid: id(s), slot: hs.slot, sprite_link: p.sprite_link})
        ELSE [] END
}



MATCH (m:Move) WHERE m.accuracy = -1 SET m.accuracy = NULL
MATCH (m:Move) WHERE m.power = -1 SET m.power = NULL




MATCH (ut:UserTeam)-[hus:HAS_SET]->(us:UserSet) 
    WHERE id(ut) = $teamguid AND ut.username = $username WITH us, hus ORDER BY hus.slot
MATCH (us)-[:HAS_ABILITY]->(a:Ability) WITH us, hus, a
MATCH (us)-[:HAS_ITEM]->(i:Item) WITH us, hus, a, i
MATCH (us)-[:HAS_NATURE]->(n:Nature) WITH us, hus, a, i, n
MATCH (us)-[ip:IS_POKEMON]->(p:Pokemon) WITH us, hus, a, i, n, ip, p
MATCH (us)-[hs:HAS_STAT]->(s:Stat) WITH us, hus, a, i, n, ip, p, hs, s ORDER BY s.order
WITH us, hus, a, i, n, ip, p, collect({stat_name: s.name, evs: hs.evs, ivs: hs.ivs}) AS stats
MATCH (us)-[hm:HAS_MOVE]->(m:Move) WITH us, hus, a, i, n, ip, p, stats, hm, m ORDER BY hm.slot
WITH us, hus, a, i, n, ip, p, stats, collect({move_name: m.name, move_slot: hm.slot}) AS moves

RETURN {
    set_name: us.name,
    set_guid: id(us),
    set_slot: hus.slot,
    pokemon_name: p.name,
    ability_name: a.name,
    item_name: i.name,
    nature_name: n.name,
    is_shiny: ip.is_shiny,
    pokemon_nickname: ip.nickname,
    stats: stats,
    moves: moves
}


// create previous evo move relationships
MATCH(p:Pokemon)-[:EVOLVES_FROM*]-(f:Pokemon)
WHERE (p)-[]->(p)
RETURN p, m
ORDER BY p.game_id ASC
LIMIT 3


MATCH
	(p:Pokemon {name: 'venusaur'})-[:EVOLVES_FROM]-(q:Pokemon)
    (q)-[:HAS_MOVE]->(n:Move),
    (p)-[:HAS_MOVE]->(m:Move)
WITH p, q, COLLECT(n.name) as preEvo, COLLECT(m.name) as postEvo
RETURN preEvo, postEvo


MATCH
	(p:Pokemon {name: 'venusaur'})-[:EVOLVES_FROM]->(q:Pokemon),
    (q)-[:HAS_MOVE]->(n:Move),
     (p)-[:HAS_MOVE]->(m:Move)
WITH n ORDER BY n.name  
, p, q, COLLECT(distinct n.name) as preEvo, COLLECT(distinct m.name) as postEvo

RETURN {
	preEvo: preEvo, 
    postEvo: postEvo
}


MATCH
	(p:Pokemon)-[:EVOLVES_FROM*]->(q:Pokemon)
WITH p, q ORDER BY p.game_id LIMIT 3
MATCH (q)-[:HAS_MOVE]->(n:Move)
WITH p, q, n ORDER BY n.name
WITH p, q, COLLECT(n.name) as preEvo
MATCH (p)-[:HAS_MOVE]->(m:Move)
WITH p, q, preEvo, m ORDER BY m.name  
WITH p, q, preEvo, COLLECT(distinct m.name) as postEvo
return [x in preEvo WHERE not(x in postEvo)] as z, p, q

MATCH
	(p:Pokemon)-[:EVOLVES_FROM*]->(q:Pokemon)
WITH p, q ORDER BY p.game_id
MATCH (q)-[:HAS_MOVE]->(n:Move)
WITH p, q, n ORDER BY n.name
WITH p, q, COLLECT(n.name) as preEvo
MATCH (p)-[:HAS_MOVE]->(m:Move)
WITH p, q, preEvo, m ORDER BY m.name  
WITH p, q, preEvo, COLLECT(distinct m.name) as postEvo
WITH p, q, [x in preEvo WHERE not(x in postEvo)] as missingMoves
MATCH (l:Move) WHERE l.name IN missingMoves
MERGE(p)-[:HAS_MOVE]->(l)

match(p:Pokemon) set p.image_link = p.sprite_link
match(p:Pokemon) set p.sprite_link = 'https://raw.githubusercontent.com/msikma/pokesprite/master/pokemon-gen7x/regular/' + COALESCE(p.name ,"") + '.png'


create(e:Error {code: "ucs1"}) set e.message= "Error: This team already has 6 sets."