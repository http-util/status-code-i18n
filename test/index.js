import http from 'http'
import test from 'ava'
import status from '..'
import enus from '../src/locales/en-us.json'
import zhcn from '../src/locales/zh-cn.json'

test('status[code] should return correct message when code is valid', t => {
  [306, 415, '415'].forEach(code => {
    t.regex(status[code], /^[a-z\s()]+$/i)
  })
})

test('status[code] should return undefined when code is invalid', t => {
  [{}, [], null, undefined, true, Symbol()].forEach(code => {
    t.is(status[code], undefined)
  })
})

test('status(code) should be truthy when code is valid ', t => {
  t.truthy(status(200))
  t.truthy(status(404))
  t.truthy(status(500))
})

test('status(code) should return undefined when code is empty', t => {
  t.is(status(), undefined)
})

test('status(code) should return undefined when code is not a number', t => {
  ['200', '', {}, [], null, undefined, true, Symbol()].forEach(code => {
    t.is(status(code), undefined)
  })
})

test('status(code) should return undefined when code is number but not in 100~500+', t => {
  t.is(status(0), undefined)
  t.is(status(1000), undefined)
})

test('status(code) should return undefined when code is in 100~500+ but invalid', t => {
  t.is(status(299), undefined)
  t.is(status(310), undefined)
})

test('status(code, lang) should return correct message when lang is valid string', t => {
  t.is(status(401, 'zh-CN'), zhcn[401])
})

test('status(code, lang) should return correct message when lang is valid lowercase string', t => {
  t.is(status(401, 'zh-cn'), zhcn[401])
})

test('status(code, lang) should return correct message when lang is invalid type', t => {
  [{}, [], null, undefined, true, Symbol()].forEach(lang => {
    t.is(status(401, lang), enus[401])
  })
})

test('status(code, lang) should return correct message when lang is invalid string', t => {
  t.is(status(401, 'abc'), enus[401])
})

test('status(code, lang) should return correct message when lang default browser language', t => {
  status.BROWSER_LANG = 'zh-cn'
  t.is(status(401, status.BROWSER_LANG), zhcn[401])
})

test('status.STATUS_CODES should be a map of code to message', t => {
  status() // reset
  t.is(status.STATUS_CODES[200], 'OK')
})

test('status.STATUS_CODES should include codes from Node.js', t => {
  Object.keys(http.STATUS_CODES).forEach(code => {
    t.truthy(status.STATUS_CODES[code], 'contains ' + code)
  })
})

test('status.codes should include codes from Node.js', t => {
  Object.keys(http.STATUS_CODES).forEach(code => {
    t.not(status.codes.indexOf(Number(code)), -1, 'contains ' + code)
  })
})
