import { request } from 'graphql-request';

export class QueryManager {
  
  public uri: string;
  public queryString: string;
  
  constructor(queryString?: string) {
    this.uri = 'http://localhost:4000/'; // GraphQL uri
    // this.uri = 'https://tracker-gql.charlesmarquez.now.sh/';
    if (queryString) {this.queryString = queryString};
  }
  // Query GraphQL server
  public async query(query?: string): Promise <any> {
    if (query) {
      return request(this.uri, query);
    } else {
      return request(this.uri, this.queryString);
    }
  }
  
  public prettyPrint() {
    this.query().then(res => {
      console.log(JSON.stringify(res, null, 4));
    });
  }
}

