import axios from 'axios';

class PatreonFeed {
  constructor(creatorID) {
    this.id = creatorID;
    this.fields = {
      post: [
        'post_type',
        'title',
        'content',
        'comment_count',
        'published_at',
        'url'
      ],
      user: [
        'image_url',
        'full_name',
        'url'
      ]
    };

    this.filter = {
      'creator_id': this.id,
      'is_by_creator': true,
      'is_following': false,
      'is_draft': false,
      'contains_exclusive_posts': true
    }
  }

  getFeed() {
    return this.getData()
      .then((data) => {
        const feed = {
          campaign: data.campaign,
          user: data.user,
          posts: []
        };
        for (let item of data.posts) {
          feed.posts.push(item);
        }
        return feed;
      });
  }

  getData() {
    const retObj = {
      campaign: {},
      user: {},
      posts: []
    };
    const url = this.buildURL();
    const config = {
      crossdomain: true,
      headers: {'Access-Control-Allow-Origin': '*'}
    };
    return axios.get(url, config)
      .then((jsonData) => {
        const dataObj = JSON.parse(jsonData);


        for (let item of dataObj.data) {
          retObj.posts.push(item.attibutes);
        }

        for (let item of dataObj.included) {
          if (item.type === 'user') {
            retObj.user = item.attibutes;
            retObj.user.id = item.id;
          } else if (item.type === 'campaign') {
            retObj.campaign = item.attibutes;
            retObj.campaign.id = item.id;
          }
        }

        return retObj;
      });
  }

  buildURL() {
    // let baseUrl = 'https://api.patreon.com';
    let baseUrl = 'https://8g70aztbkl.execute-api.us-east-1.amazonaws.com/prod';
    let url = `${baseUrl}/stream?json-api-version=1.0`;
    for (let type in this.fields) {
      if (this.fields.hasOwnProperty(type)) {
        let fields = this.fields[type].join('%2C');
        url += `&fields[${type}]=${fields}`;
      }
    }
    for (let fltr in this.filter) {
        if (this.filter.hasOwnProperty(fltr)) {
          let val = this.filter[fltr];
          url += `&filter[${fltr}]=${val}`;
        }
    }
    url += '&page[cursor]=null';
    return url;
  }
}

export default PatreonFeed;
