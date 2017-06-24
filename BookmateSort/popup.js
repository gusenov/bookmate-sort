/*jslint browser: true, devel: true, nomen: true */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
      document.getElementById('all').addEventListener('click', function () {
        chrome.tabs.create({ url: 'books.html#all' });
      });
      document.getElementById('read').addEventListener('click', function () {
        chrome.tabs.create({ url: 'books.html#read' });
      });
      document.getElementById('currently-reading').addEventListener('click', function () {
        chrome.tabs.create({ url: 'books.html#currently-reading' });
      });
      document.getElementById('to-read').addEventListener('click', function () {
        chrome.tabs.create({ url: 'books.html#to-read' });
      });
      document.getElementById('bookshelves').addEventListener('click', function () {
        chrome.tabs.create({ url: 'bookshelves.html' });
      });
        
      document.getElementById('premium').addEventListener('click', function () {
        chrome.tabs.create({ url: 'books.html#premium' });
      });
        
      document.getElementById('ru').addEventListener('click', function () {
        chrome.tabs.create({ url: 'books.html#ru' });
      });
      document.getElementById('en').addEventListener('click', function () {
        chrome.tabs.create({ url: 'books.html#en' });
      });
        
    });

}());
