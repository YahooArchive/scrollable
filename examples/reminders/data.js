/* Copyright 2015, Yahoo Inc.
   Copyrights licensed under the MIT License.
   See the accompanying LICENSE file for terms. */

var categories = [
  {title: "Purple", color: "purple", uid: "2485",
          items: ['People', 'Steeple', 'Maple', 'Couple', 'Ripple', 'Cripple', 'Simple']},
  {title: "Green",  color: "green",  uid: "0891",
          items: ['Thirteen', 'Fourteen', 'Bean', 'Queen', 'Clean', 'Lean']},
  {title: "Blue",   color: "blue",   uid: "1248",
          items: ['You', 'True', 'Cue', 'Queue', 'Glue']},
  {title: "Pink",   color: "pink",   uid: "3436",
          items: ['Drink', 'Think', 'Link', 'Sink', 'Wink', 'Blink', 'Shrink', 'Sync']},
  {title: "Brown",  color: "brown",  uid: "2384",
          items: ['People', 'Steeple', 'Maple', 'Couple', 'Ripple', 'Cripple', 'Simple', 'Drink', 'Think', 'Link', 'Sink', 'Wink', 'Blink', 'Shrink', 'Sync', 'You', 'True', 'Cue', 'Queue', 'Glue', 'Thirteen', 'Fourteen', 'Bean', 'Queen', 'Clean', 'Lean']},
  {title: "Yellow", color: "yellow", uid: "2394",
          items: []},
  {title: "Orange", color: "orange", uid: "5330",
          items: []},
  {title: "Purple", color: "purple", uid: "9023",
          items: []},
  {title: "Green",  color: "green",  uid: "1284",
          items: []},
  {title: "Blue",   color: "blue",   uid: "0934",
          items: []},
  {title: "Pink",   color: "pink",   uid: "1723",
          items: []},
  {title: "Brown",  color: "brown",  uid: "1483",
          items: []},
  {title: "Yellow", color: "yellow", uid: "1245",
          items: []},
  {title: "Orange", color: "orange", uid: "1235",
          items: ['rhymes with nothing']},
];



var categoryIds = [];
var categoryById = {};
var itemsForCategoryId = {};

categories.forEach(function(category){
  categoryIds.push(category.uid);
  categoryById[category.uid] = category;
  itemsForCategoryId[category.uid] = category.items;
});

var Data = {
  categoryIds: categoryIds,
  categoryById: categoryById,
  itemsForCategoryId: itemsForCategoryId,
};

module.exports = Data;
