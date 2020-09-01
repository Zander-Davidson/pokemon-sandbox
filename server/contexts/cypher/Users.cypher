CREATE (:User {username: 'zander', created_at: datetime()})
CREATE (:UserTeam {name: "Zander's First Team", created_at: datetime(), updated_at: datetime()})
CREATE (:UserSet {name: 'Set1', nickname: 'Chompy', created_at: datetime(), updated_at: datetime(), })

CREATE CONSTRAINT unique_username
ON (u:User) ASSERT u.username IS UNIQUE
