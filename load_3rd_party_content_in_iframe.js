const messageParent = function (message) {
  window.parent.postMessage(message, '*');
};

const siteUrl = window.location.protocol + '//' + window.location.host + '/';

const loadUrl = function (url) {
  messageParent({
    slug: url.replace(siteUrl, '')
  });
};

const resizeObserver = new ResizeObserver(entries => {
  for (let entry of entries) {
    messageParent({
      contentHeight: entry.contentRect.height
    });
  }
});

resizeObserver.observe(document.body);

window.addEventListener(
  'message',
  (event) => {
    if (event.data.loadedInTranscom) {
      document.body.style.overflow = 'hidden';
    }
  },
  false
);


String.prototype.QueryString = function (key) {
  _qs_url = this.toString().toLowerCase();
  if (_qs_url.lastIndexOf('?') >= 0) {
    _qs = _qs_url.substring(_qs_url.lastIndexOf('?') + 1).split('&');
    for (let i = 0; i < _qs.length; i++) {
      _kv = _qs[i].split('=');
      if (_kv[0] == key.toLowerCase()) {
        return _kv[1];
      }
    }
  } else {
    return undefined;
  }
};


window.addEventListener('load', function () {
  var updateUrl = function () {
    var pagerLinks = Array.from(document.querySelectorAll('[role="navigation"] a')).map(function (el) {
      return el.classList.add('pager-link');
    });

    var links = jQuery('.load-external-container a, .load-external').not('.pager-link');

    links.each(function (i, el) {
      el.href = 'javascript:loadUrl("' + el.href + '")';
    });
  };

  setTimeout(function () {
    if (window.location.href.QueryString('ref') == 'web') {
      updateUrl();
    }
    jQuery(document).ajaxComplete(updateUrl);
  }, 1000);
});