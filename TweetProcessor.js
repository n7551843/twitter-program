

module.exports = {
    detectCashtag: function (data, target) {
        var str = "$" + target.toLowerCase();
        var holder = data.toLowerCase().indexOf(str);
        if (holder !== -1) {
            return true;
        } else {
            return false;
        }
    },
    detectSentiment: function () {
        // Blank for now
    }
  };