'use strict';

const express = require('express');
const router = express.Router();

const { DATABASE } = require('../config');
const knex = require('knex')(DATABASE);

const Treeize = require('treeize');

/** RETRIEVE ALL TAGS */
router.get('/tags', (req, res) => {

  knex.select('id', 'name')
    .from('tags')
    .then(results => {
      res.status(200).json(results);
    });

});

/** RETRIEVE ALL AUTHORS */
router.get('/authors', (req, res) => {

  knex.select('id', 'email', 'username')
    .from('authors')
    .then(results => {
      res.status(200).json(results);
    });

});

/** RETRIEVE ALL STORIES */
router.get('/stories', (req, res) => {

  knex.select('stories.id', 'title', 'content', 'username as author',
    'authors.id as authorId', 'tags.name as tags:name', 'tags.id as tags:id')
    .from('stories')
    .leftJoin('authors', 'stories.author_id', 'authors.id')
    .leftJoin('stories_tags', 'stories.id', 'stories_tags.stories_id')
    .leftJoin('tags', 'tags.id', 'stories_tags.tags_id')
    .orderBy('stories.id')
    .then(results => {
      const hydratedStories = new Treeize();
      hydratedStories.grow(results);
      const stories = hydratedStories.getData();
      res.status(200).json(stories);
    })
    .catch(err => {
      console.error(err);
    });

});

/** RETRIEVE A SINGLE STORY */
router.get('/stories/:id', (req, res) => {

  knex.select('stories.id', 'title', 'content', 'username as author',
    'authors.id as authorId', 'tags.name as tags:name', 'tags.id as tags:id')
    .from('stories')
    .leftJoin('authors', 'stories.author_id', 'authors.id')
    .leftJoin('stories_tags', 'stories.id', 'stories_tags.stories_id')
    .leftJoin('tags', 'tags.id', 'stories_tags.tags_id')
    .where('stories.id', req.params.id)
    .then(result => {
      if (!result.length) {
        res.status(404).end();
      } else {
        const hydratedStories = new Treeize();
        hydratedStories.grow(result);
        const story = hydratedStories.getData()[0];
        res.status(200).json(story);
      }
    });

});

/** CREATE A STORY */
router.post('/stories', (req, res) => {

  const required = ['title', 'content', 'author_id'];

  if (Object.keys(req.body).length === 0) {
    const errorMessage = `The body must contain: ${required}`;
    res.status(400).send(errorMessage);
    return;
  }

  required.forEach(requiredField => {
    if (!(requiredField in req.body)) {
      const errorMessage = `You're missing a required field: ${requiredField}`;
      res.status(400).send(errorMessage);
      return;
    }
  });

  let newId;
  knex.insert({
    title: req.body.title,
    content: req.body.content,
    author_id: req.body.author_id
  }).into('stories')
    .returning('id')
    .then(id => {
      newId = id[0];
      if (!req.body.tags) return;
      let promises = [];
      req.body.tags.forEach(id => {
        const promise = knex('stories_tags').insert({
          stories_id: newId,
          tags_id: id
        });
        promises.push(promise);
      });
      return Promise.all(promises);      
    })
    .then(() => {
      return knex.select('stories.id', 'title', 'content', 'username as author',
        'authors.id as authorId', 'tags.name as tags:name', 'tags.id as tags:id')
        .from('stories')
        .leftJoin('authors', 'stories.author_id', 'authors.id')
        .leftJoin('stories_tags', 'stories.id', 'stories_tags.stories_id')
        .leftJoin('tags', 'tags.id', 'stories_tags.tags_id')
        .where('stories.id', newId);
    })
    .then(result => {
      const hydratedStories = new Treeize();
      hydratedStories.grow(result);
      const story = hydratedStories.getData()[0];
      res.location(`/v1/stories/${story.id}`).status(201).json(story);
    })
    .catch(err => {
      console.error(err);
    });

});

/** MODIFY A STORY */
router.put('/stories/:id', (req, res) => {

  const required = ['title', 'content', 'author_id'];

  if (Object.keys(req.body).length === 0) {
    const errorMessage = `The body must contain: ${required}`;
    res.status(400).send(errorMessage);
    return;
  }

  required.forEach(requiredField => {
    if (!(requiredField in req.body)) {
      const errorMessage = `You're missing a required field: ${requiredField}`;
      res.status(400).send(errorMessage);
      return;
    }
  });

  let storyId;
  knex('stories').update({
    title: req.body.title,
    content: req.body.content,
    author_id: req.body.author_id
  }).where('id', req.params.id)
    .returning(['id', 'title'])
    .then(results => {
      storyId = results[0].id;
      return knex.del()
        .from('stories_tags')
        .where('stories_id', storyId);
    })
    .then(() => {
      let promises = [];
      req.body.tags.forEach(id => {
        const promise = knex('stories_tags').insert({
          stories_id: storyId,
          tags_id: id
        });
        promises.push(promise);
      });
      return Promise.all(promises);
    })
    .then(() => {
      return knex.select('stories.id', 'title', 'content', 'username as author',
        'authors.id as authorId', 'tags.name as tags:name', 'tags.id as tags:id')
        .from('stories')
        .leftJoin('authors', 'stories.author_id', 'authors.id')
        .leftJoin('stories_tags', 'stories.id', 'stories_tags.stories_id')
        .leftJoin('tags', 'tags.id', 'stories_tags.tags_id')
        .where('stories.id', storyId);
    })
    .then(result => {
      const hydratedStories = new Treeize();
      hydratedStories.grow(result);
      const story = hydratedStories.getData()[0];
      res.json(story);
    })
    .catch(err => {
      console.error(err);
    });

});

/** DELETE A STORY */
router.delete('/stories/:id', (req, res) => {

  knex.del()
    .from('stories')
    .where('id', req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      console.error(err);
    });

});

module.exports = router;
