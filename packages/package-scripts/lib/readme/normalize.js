'use strict'

const normalize = require('mdast-normalize-headings')
const cleanParagraphs = require('mdast-squeeze-paragraphs')

module.exports = () => tree => {
  normalize(tree)
  cleanParagraphs(tree)
}
