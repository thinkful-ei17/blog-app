/* global $ */
'use strict';
/**
 * API: DATA ACCESS LAYER (using fetch())
 * 
 * Primary Job: communicates with API methods. 
 *  
 * Rule of Thumb:
 * - Never manipulation DOM directly
 * - No jquery on this page, use `fetch()` not `$.AJAX()` or `$.getJSON()`
 * - Do not call render methods from this layer
 * 
 */

var api = {
  search: function (query) {
    return $.ajax({
      type: 'GET',
      url: ITEMS_URL,
      data: query,
    });
  },
  details: function (id) {
    return $.ajax({
      type: 'GET',
      url: `${ITEMS_URL}/${id}`
    });
  },
  create: function (document) {
    return $.ajax({
      type: 'POST',
      url: ITEMS_URL,
      data: document ? JSON.stringify(document) : null,
      dataType: 'json',
      contentType: 'application/json',
    });
  },
  update: function (document) {
    return $.ajax({
      type: 'PUT',
      url: `${ITEMS_URL}/${document.id}`,
      data: document ? JSON.stringify(document) : null,
      dataType: 'json',
      contentType: 'application/json',
    }).catch( err => {
      return err;
    });

  },
  remove: function (id) {
    return $.ajax({
      type: 'DELETE',
      url: `${ITEMS_URL}/${id}`,
    });
  },
  users: function () {
    return $.ajax({
      type: 'GET',
      url: `${USERS_URL}`,
    });
  },
  tags: function () {
    return $.ajax({
      type: 'GET',
      url: `${TAGS_URL}`,
    });
  },

};


