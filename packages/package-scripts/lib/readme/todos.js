module.exports = ignore => (tree, file, done) => 'use strict'

const fp = require('lodash/fp')
const execa = require('execa')
const heading = require('mdast-util-heading-range')
const { HEADING_TODOS } = require('../constants')

module.exports = ({ ignore = [] }) => (tree, file, done) => {
  execa
    .stdout('leasot', [
      '*/**',
      '!**/node_modules/**',
      ...ignore,
      '-Sx',
      '--reporter',
      'json'
    ])
    .then(JSON.parse)
    .then(fp.groupBy('kind'))
    .then(fp.mapValues(fp.groupBy('file')))
    .then(todos =>
      heading(tree, HEADING_TODOS, (start, nodes, end) => [
        start,
        { type: 'paragraph', children: compileTodos(todos) },
        end
      ])
    )
    .then(() => done())
    .catch(() => done())
}

function compileTodos ({ TODO, FIXME }) {
  const output = []
  const makeNestedList = (title, children = []) => {
    return {
      type: 'listItem',
      children: [
        { type: 'inlineCode', value: title },
        { type: 'break' },
        { type: 'list', ordered: false, children: children }
      ]
    }
  }

  const mapFiles = fp.pipe(
    fp.mapValues(fp.map(mapTodos)),
    fp.toPairs,
    fp.map(([file, todos]) => makeNestedList(file, todos))
  )

  if (!fp.isEmpty(FIXME)) {
    output.push({ type: 'text', value: 'FIXME' })
    output.push({ type: 'break' })
    output.push({ type: 'list', ordered: false, children: mapFiles(FIXME) })
  }

  if (!fp.isEmpty(TODO)) {
    output.push({ type: 'break' })
    output.push({ type: 'text', value: 'TODO' })
    output.push({ type: 'break' })
    output.push({ type: 'list', ordered: false, children: mapFiles(TODO) })
  }
  return output
}

function mapTodos (todo) {
  return {
    type: 'listItem',
    checked: false,
    children: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'link',
            url: `${todo.file}#${todo.line}`,
            children: [{ type: 'text', value: todo.text }]
          }
        ]
      }
    ]
  }
}
