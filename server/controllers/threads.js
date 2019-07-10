const Thread = require('../models/threads');

exports.getThreads = function(req, res) {
  const meetupId = req.query.meetupId;
  const pageSize = parseInt(req.query.PageSize) || 5;
  const pageNum = parseInt(req.query.PageNum) || 1;

  const skips = pageSize * (pageNum - 1)

  Thread.find({})
        .where({'meetup': meetupId})
        .skip(skips)
        .limit(pageSize + 1)
        .sort({'createdAt': -1})
        .populate({
          path: 'posts',
          options: { limit: 5, sort: {'createdAt': -1}},
          populate: {path: 'user'}
        })
        .exec((errors, threads) => {

    if (errors) {
        return res.status(422).send({errors});
    }

    let isAllDataLoaded = false;
    if (threads.length <= 5 ) {
      isAllDataLoaded = true
    }

    return res.json({threads: threads.splice(0, 5), isAllDataLoaded});
  });
}

exports.createThread = function (req, res) {
  const threadData = req.body
  const thread = new Thread(threadData)
  thread.user = req.user

  thread.save((err, createdThread) => {
    if (err) {
      return res.status(422).send({err});
    }

    return res.json(createdThread)
  });
}

