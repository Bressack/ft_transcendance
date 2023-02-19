import ld from 'lodash'

let n = [ 'a', 'b', 'c',      'e', 'f' ]
let o = [ 'a', 'b', 'c', 'd', 'e',     ]

console.log('ld.difference(n, o)   :', ld.difference(n, o));
console.log('ld.difference(o, n)   :', ld.difference(o, n));

console.log('ld.intersection(n, o) :', ld.intersection(n, o));
console.log('ld.intersection(o, n) :', ld.intersection(o, n));

