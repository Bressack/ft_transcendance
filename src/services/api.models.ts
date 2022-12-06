
///////////////////////////////////////////////////////////////////////////////
export interface IGameQuery {
  skip: string,
	take: string,
	order: string
}

export function GameQueryBuilder(query: IGameQuery) {
  let query_str: string = '?'

  if (query?.order) query_str += 'order=' + query?.order + '&'
  if (query?.skip)  query_str += 'skip=' + query?.skip + '&'
  if (query?.take)  query_str += 'take=' + query?.take + '&'

  return query_str
}
///////////////////////////////////////////////////////////////////////////////
export interface ISearchQuery {
  key: string,
	skip?: string,
	take?: string
}

export function SearchQueryBuilder(query: ISearchQuery) {
  let query_str: string = '?'

  if (query?.key) query_str += 'key=' + query?.key + '&'
  if (query?.skip)  query_str += 'skip=' + query?.skip + '&'
  if (query?.take)  query_str += 'take=' + query?.take + '&'

  return query_str
}
///////////////////////////////////////////////////////////////////////////////

