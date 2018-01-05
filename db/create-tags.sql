DROP TABLE IF EXISTS stories_tags;
DROP TABLE IF EXISTS stories;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS authors;

CREATE TABLE authors (
    id serial PRIMARY KEY,
    email text NOT NULL,
    username text NOT NULL    
);

CREATE TABLE tags(
  id serial PRIMARY KEY,
  name text NOT NULL
);

CREATE TABLE stories (
  id serial PRIMARY KEY,
  title text NOT NULL,
  content text,
  author_id int REFERENCES authors ON DELETE RESTRICT,
  created timestamp DEFAULT now()
);

ALTER SEQUENCE stories_id_seq RESTART WITH 1000;

CREATE TABLE stories_tags (
  stories_id INTEGER NOT NULL REFERENCES stories ON DELETE CASCADE,
  tags_id INTEGER NOT NULL REFERENCES tags ON DELETE CASCADE
);

INSERT INTO authors (email, username) VALUES
    ('foo@example.com', 'MsFoo'),
    ('bar@example.com', 'MrBar'),
    ('qux@example.com', 'DrQux');

INSERT INTO stories (title, content, author_id) VALUES 
('What the government doesn''t want you to know about cats', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enimed.', 1),
('The most boring article about cats you''ll ever read', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Faucibus puvi.', 2),
('7 things lady gaga has in common with cats', 'Lectus magna fringilla urna porttitor rhoncus. Sem nulla pharetra diam sit amet nisl suscipit adipiscing bibendum. Enim ut sem viverra aliquet eget.', 3),
('The most incredible article about cats you''ll ever read', 'Odio euismod lacinia at quis risus. Phasellus egestas tellus rutrum tellus pellentesque eu tincidunt. Tempus quam pellentesque necnam.', 1),
('10 ways cats can help you live to 100', 'Viverra mauris in aliquam sem fringilla. In nisl nisi scelerisque eu. Maecenas ultricies mi eget mauris. Egestas fringilla phasellus faucibus scelerisqu.', 2),
('9 reasons you can blame the recession on cats', 'Eget felis eget nunc lobortis mattis aliquam faucibus purus. Neque laoreet suspendisse interdum consectetur libero. Amet luctus venenatis lectus.', 3),
('10 ways marketers are making you addicted to cats', 'Sit amet est placerat in egestas erat imperdiet sed euismod. Eget arcu dictum varius duis at. Tellus in metus vulputate eu scelerisque felis.', 1),
('11 ways investing in cats can make you a millionaire', 'Id neque aliquam vestibulum morbi blandit. Eget dolor morbi non arcu risus quis varius. Massa tincidunt nunc pulvinar sapien et. Turpiscu.', 2),
('Why you should forget everything you learned about cats', 'Natoque penatibus et magnis dis parturient montes nascetur ridiculus mus. Massa tempor nec feugiat nisl pretium fusce id velit. Libero.', 3);

INSERT INTO tags (name) VALUES 
('Shorthair'),
('Bengal'),
('Birman'),
('Persian'),
('Ragdoll'),
('Siamese'), 
('Conspiracy'),
('Lady Gaga'),
('Recession'),
('Investing');

INSERT INTO stories_tags (stories_id, tags_id) VALUES 
(1000, 3), (1000, 5), (1000, 6), (1000, 7),
(1001, 1), (1001, 2), (1001, 6),
(1002, 2), (1002, 4), (1002, 6), (1002, 8),
(1003, 1), (1003, 5), (1003, 6),
(1004, 3), (1004, 5), (1004, 6),
(1005, 2), (1005, 3), (1005, 4), (1005, 9),
(1006, 4), (1006, 5), (1006, 6),
(1007, 3), (1007, 4), (1007, 6), (1007, 10),
(1008, 1), (1008, 3), (1008, 5);