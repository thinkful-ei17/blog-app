-- get all stories
SELECT * FROM stories;

-- get all authors
SELECT * FROM authors;

-- get all stories with authors
SELECT * FROM stories
INNER JOIN authors ON stories.author_id = authors.id;

-- get all stories, show author if they exists otherwise null
SELECT * FROM stories
LEFT JOIN authors ON stories.author_id = authors.id;

-- get all stories,
-- show author if they exists otherwise null
-- show tags if they exists otherwise null
SELECT * FROM stories
LEFT JOIN authors ON stories.author_id = authors.id
LEFT JOIN stories_tags ON stories.id = stories_tags.stories_id
LEFT JOIN tags ON stories_tags.tags_id = tags.id;

-- Hints for updating tags on the PUT endpoint

-- First, delete current tags for a given story
DELETE FROM stories_tags WHERE stories_id = 1003;

-- Then insert the new tags
INSERT INTO stories_tags (stories_id, tags_id) VALUES (1003, 3), (1003, 5);

-- Finally, select the document. Note the field aliasing (tags:name) for Treeize
SELECT stories.id, title, content, username as author, authors.id as authorId, tags.name as "tags:name", tags.id as "tags:id"
FROM stories
LEFT JOIN authors ON stories.author_id = authors.id
LEFT JOIN stories_tags ON stories.id = stories_tags.stories_id
LEFT JOIN tags ON stories_tags.tags_id = tags.id
WHERE stories.id = 1003;