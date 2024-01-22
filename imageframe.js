; (function (j) {
  var _private = {
    draw: function (defaultOptions, obj) {
      _private.render(defaultOptions, obj);

      obj.Window.resize(function () {
        _private.render(defaultOptions, obj);
      });

      setTimeout(function () {
        _private.render(defaultOptions, obj);
      }, 200);
    },

    render: function (defaultOptions, obj) {
      clearInterval(obj.swapInterval);

      //var windowWidth = obj.Window.width(),
      var windowWidth = obj.HeaderContainer.width(),
        columns = _private.getColumns(windowWidth);

      obj.HeaderContent.css('height', '');
      var gridImage = obj.ImageFrame.find('li').removeAttr('style');

      for (var i = 0; i < gridImage.length; i++) {
        j(gridImage[i]).attr('data-index', i);
      }

      var imageWidth = (windowWidth / columns),
        headerHeight = obj.HeaderContent.outerHeight();

      gridImage.css({
        width: imageWidth,
        height: imageWidth
      });

      if (headerHeight % imageWidth != 0) {
        headerHeight = Math.ceil(headerHeight / imageWidth) * imageWidth;
        obj.HeaderContent.css({
          'height': headerHeight,
          'margin': imageWidth,
          'box-sizing': 'border-box'
        });

        obj.HeaderContainer.css({
          height: (headerHeight + (imageWidth * 2))
        });
      }

      var topImages = bottomImages = columns,
        leftImages = rightImages = (headerHeight / imageWidth),
        totalImages = topImages + bottomImages + leftImages + rightImages,

        bottomImages_Top = obj.HeaderContent.outerHeight() + imageWidth,
        rightImages_Left = obj.HeaderContent.outerWidth() + imageWidth;

      var a = 0;
      for (var i = 0; i < topImages; i++) {
        gridImage.eq(i).css({
          left: (imageWidth * i),
          top: 0
        }).show();
      }

      a = topImages;
      for (var i = 0; i < rightImages; i++) {
        gridImage.eq(i + a).css({
          left: rightImages_Left,
          top: (imageWidth * (i + 1))
        }).show();
      }

      a = (topImages + rightImages);
      for (var i = 0; i < bottomImages; i++) {
        gridImage.eq(i + a).css({
          left: (imageWidth * (bottomImages - (i + 1))),
          top: bottomImages_Top
        }).show();
      }

      a = (topImages + rightImages + bottomImages);
      for (var i = 0; i < leftImages; i++) {
        gridImage.eq(i + a).css({
          left: 0,
          top: (imageWidth * (leftImages - i))
        }).show();
      }

      _private.swap(defaultOptions, obj);
    },

    swap: function (defaultOptions, obj) {
      var gridImage = obj.ImageFrame.find('li:visible'),
        index, b,
        item1, item2,
        img1, img2,
        pos1, pos2,
        animating = false;

      obj.swapInterval = setInterval(function () {
        if (!animating) {
          animating = true;

          index = _private.RandomNumber(0, (gridImage.length - 1)),
            item1 = gridImage.filter('[data-index=' + index + ']'),
            img1 = item1.find('img').clone(),
            b = _private.RandomNumber(0, 1),
            c = _private.RandomNumber(0, 1);

          b = (index == 0 ?
            (c == 0 ? (gridImage.length - 1) : 1) :
            (index == (gridImage.length - 1) ?
              (c == 0 ? (1 - gridImage.length) : -1) :
              (b == 0 ? -1 : 1)
            )
          );

          item2 = gridImage.filter('[data-index=' + (index + b) + ']'),
            img2 = item2.find('img').clone();

          pos1 = item1.position();
          pos2 = item2.position();

          item1.animate({
            top: pos2.top,
            left: pos2.left
          }, defaultOptions.duration, function () {
            item1.attr('data-index', (index + b));
          });

          item2.animate({
            top: pos1.top,
            left: pos1.left
          }, defaultOptions.duration, function () {
            item2.attr('data-index', index);
            animating = false;
          });
        }
      }, defaultOptions.interval);
    },

    getColumns: function (windowWidth) {
      var columns = 9;

      if (windowWidth >= 1050) {
        columns = 10;
      } else if (windowWidth >= 850) {
        columns = 9;
      } else if (windowWidth >= 650) {
        columns = 8;
      } else if (windowWidth >= 450) {
        columns = 7;
      } else if (windowWidth >= 300) {
        columns = 9;
      }

      return columns;
    },

    RandomNumber: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  };

  j.fn.extend({
    imageframe: function (options) {
      var styles = "<style type='text/css'>" +
        ".imageframe { position: relative; }" +
        ".imageframe ul { padding: 0; margin: 0; }" +
        ".imageframe ul li { list-style: none; display: none; padding: 0; margin: 0; position: absolute; z-index: 999999; }" +
        ".imageframe ul li img { display: block; width: 100%; height: 100%; }" +
        "</style>";

      j('head').append(styles);

      var defaultOptions = {
        interval: 2000,
        duration: 600
      };

      var obj;

      this.each(function (index, el) {
        j.extend(defaultOptions, options);

        obj = {
          Window: j(window),
          ImageFrame: j(el).css({
            'position': 'relative'
          }),
          swapInterval: null
        };

        obj.ImageFrame.addClass("imageframe");

        j.extend(obj, {
          HeaderContainer: obj.ImageFrame.parent(),
          HeaderContent: obj.ImageFrame.siblings('div')
        });

        _private.draw(defaultOptions, obj);
      });

      return {
        start: function () {
          _private.swap(defaultOptions, obj);
        },
        stop: function () {
          clearInterval(obj.swapInterval);
        }
      }
    }
  });
})(jQuery);
