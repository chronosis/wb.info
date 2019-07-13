import $ from 'jquery';
import 'jquery.cookie';
import 'bootstrap';
import './modal.extended';
import PatreonFeed from './patreon-feed';
import config from './config';

export class Scaffold {
  constructor() {
    this.timerID = null;
    // this.patreonFeed = new PatreonFeed(config.creatorID);
  }

  doRedirect(url) {
    if (typeof url === "string") {
      window.location = url;
    }
  }

  doTimedLoad(loc) {
    this.loadContents(loc);
    window.clearTimeout(this.timerID);
  }

  setAgeVerification(value) {
    if (value === true) {
      $.cookie('ageCheck', true, { expires: 30 });
      location.reload();
      // $("#agecheck").modal("toggle");
      // document.getElementsById('agecheck').remove()
      // document.getElementsByClassName('modal-backdrop')[0].remove()
      // let loc = window.location.hash;
      // this.timerID = window.setTimeout(this.doTimedLoad.bind(this), 1, loc);
      return true;
    }
    if (value === false) {
      //$.cookie('ageCheck', false, { expires: 30 });
      this.doRedirect("http://www.google.com");
    }
  }

  loadSection(divID, src, loc) {
    $(divID).load(src);
    if (loc !== undefined) {
      window.location.hash = loc;
    }
  }

  loadContents(loc) {
    switch (loc) {
      case "":
        this.loadSection('#right', 'home.html', '#home');
      break;
      case "#tos":
        this.loadSection('#right', 'tos.html', '#tos');
      break;
      case "#faq":
        this.loadSection('#right', 'faq.html', '#faq');
      break;
      case "#info":
        this.loadSection('#right', 'info.html', '#info');
      break;
      case "#artpacks":
        this.loadSection('#right', 'artpacks.html', '#artpacks');
      break;
      case "#daki":
        this.loadSection('#right', 'daki.html', '#daki');
      break;
      default:
        this.loadSection('#right', 'home.html', '#home');
      break;
    }
  }

  main() {
    let loc = window.location.hash;
    console.log(this);
    console.log(loc);
    this.loadSection('#left', 'left.html');
    let ageCookie = $.cookie('ageCheck');
    if (ageCookie === undefined) {
      // show verification modal
      this.loadSection('#agecheck','agecheck.html');
      $('#agecheck').modal({ keyboard: false, backdrop: 'static' });
      $('#agecheck').modal('show');
    } else if (ageCookie === 'false') {
      this.doRedirect("http://www.google.com");
    } else {
      this.loadContents(loc);
    }
  }
}

let page = new Scaffold();
console.log(page);
$(document).ready(() => {
  window.scaffold = page;
  page.main();
});
