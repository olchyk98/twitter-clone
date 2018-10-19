// NOTE: All those validations (...User.findOne({...})...) can be optimized by using try/catch statement

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean
} = require('graphql');
const { GraphQLUpload } = require('apollo-server');

const mimeprocessor = require('mime-types');
const fs = require('fs');

const User = require('./models/user');
const Tweet = require('./models/tweet');
const Comment = require('./models/comment');

const hostname = require('./hostname');

function gen() {
  let a = "",
      b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
      c = () => Math.floor(Math.random() * b.length);
  for(let ma = 0; ma < 225; ma++) a += b[c()];

  return a;
}

const UserType = new GraphQLObjectType({ // name, login, password, image, subscribers
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    url: { type: GraphQLString },
    login: { type: GraphQLString },
    password: { type: GraphQLString },
    image: { type: GraphQLString },
    profileBackground: { type: GraphQLString },
    profileDescription: { type: GraphQLString },
    location: { type: GraphQLString },
    joinedDate: { type: GraphQLString },
    requesterIsSubscriber: {
      type: GraphQLBoolean,
      args: {
        id: { type: GraphQLID },
        login: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      async resolve({ id }, { id: _id, login, password }) { // XXX
        let a = await User.findOne({
          _id,
          login,
          password,
          subscribedTo: {
            $in: [id]
          }
        });

        return a ? true:false;
      }
    },
    subscribedTo: {
      type: new GraphQLList(UserType),
      async resolve({ subscribedTo }) {
        return User.find({
          _id: {
            $in: subscribedTo
          }
        });
      }
    },
    subscribedToInt: {
      type: GraphQLInt,
      async resolve({ subscribedTo }) {
        return subscribedTo.length - 1; // -1: self
      }
    },
    subscribersInt: {
      type: GraphQLInt,
      async resolve({ id }) {
        let a = await User.find({
          subscribedTo: {
            $in: [id]
          }
        });

        return a.length - 1; // -1: self
      }
    },
    tweets: {
      type: new GraphQLList(TweetType),
      resolve: ({ id }) => Tweet.find({ creatorID: id }).sort({ time: -1 })
    }
  })
});

const CommentType = new GraphQLObjectType({
  name: "Comment",
  fields: () => ({
    id: { type: GraphQLID },
    creatorID: { type: GraphQLID },
    sendedToID: { type: GraphQLID },
    content: { type: GraphQLString },
    time: { type: GraphQLString },
    isLiked: {
      type: GraphQLBoolean,
      args: {
        id: { type: GraphQLID },
        login: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      async resolve(parent, args) {
        let user = await User.findOne({ _id: args.id, login: args.login, password: args.password });
        if(user) {
          return parent.likes.find(io => io.toString() === user._id.toString()) ? true:false;
        } else {
          return null;
        }
      }
    },
    likes: {
      type: new GraphQLList(UserType),
      async resolve({ id }) {
        let a = await Comment.findById(id);
        return User.find({
          _id: {
            $in: a.likes
          }
        });
      }
    },
    likesInt: {
      type: GraphQLInt,
      async resolve({ id }) {
        let a = await Comment.findById(id);
        if(!a) return 0;

        let b = await User.find({
          _id: {
            $in: a.likes
          }
        });
        return b.length;
      }
    },
    creator: {
      type: UserType,
      resolve: ({ creatorID }) => User.findById(creatorID)
    },
    sendedTo: {
      type: TweetType,
      resolve: ({ sendedToID }) => Tweet.findById(sendedToID)
    }
  })
})

const TweetType = new GraphQLObjectType({
  name: "Tweet",
  fields: () => ({
    id: { type: GraphQLID },
    creatorID: { type: GraphQLID },
    time: { type: GraphQLString },
    content: { type: GraphQLString },
    isLiked: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      async resolve(parent, args) {
        return parent.likes.find(io => io.toString() === args.id.toString()) ? true:false;
      }
    },
    isSubscribedToCreator: { type: GraphQLBoolean },
    likes: {
      type: new GraphQLList(UserType),
      async resolve({ id }) {
        let a = await Tweet.findById(id);
        return User.find({
          _id: {
            $in: a.likes
          }
        });
      }
    },
    likesInt: {
      type: GraphQLInt,
      async resolve({ id }) {
        let a = await Tweet.findById(id);
        if(!a) return 0;

        let b = await User.find({
          _id: {
            $in: a.likes
          }
        });
        return b.length;
      }
    },
    comments: {
      type: new GraphQLList(CommentType),
      resolve: ({ id }) => Comment.find({ sendedToID: id }).sort({ time: -1 })
    },
    commentsInt: {
      type: GraphQLInt,
      async resolve({ id }) {
        let a = await Comment.find({ sendedToID: id });
        return a.length;
      }
    },
    creator: {
      type: UserType,
      resolve: ({ creatorID }) => User.findById(creatorID)
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve: () => User.find({})
    },
    user: {
      type: UserType,
      args: {
        id: { type: GraphQLID },
        login: { type: GraphQLString },
        password: { type: GraphQLString },
        targetID: { type: GraphQLID },
        targetUrl: { type: GraphQLString }
      },
      async resolve(_, { id: _id, login, password, targetID, targetUrl }) {
        let a = await User.findOne({ _id, login, password }); // requester

        // if(targetUrl) {
        //   b = await User.findOne({ url: targetUrl }); // result
        // } else if(targetID || _id) {
        //   b = await User.findById(targetID || _id); // result
        // } else {
        //   return null;
        // }
        let b = await User[targetUrl ? "findOne" : "findById"](targetUrl ? { url: targetUrl } : (targetID || _id));

        return (a && b) ? b : null
      }
    },
    login: {
      type: UserType,
      args: {
        login: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve: (_, { login, password }) => User.findOne({ login, password })
    },
    tweets: {
      type: new GraphQLList(TweetType),
      resolve: () => Tweet.find({})
    },
    tweet: {
      type: TweetType,
      args: {
        id: { type: GraphQLID },
        login: { type: GraphQLString },
        password: { type: GraphQLString },
        targetID: { type: GraphQLID }
      },
      async resolve(_, { id: _id, login, password, targetID }) {
        let user = await User.findOne({ _id, login, password }),
            tweet = await Tweet.findById(targetID),
            str = str1 => str1.toString();

        tweet.isLiked = tweet.likes.find(io => str(io) === str(user._id)) ? true:false;
        tweet.isSubscribedToCreator = user.subscribedTo.find(io => io.toString() === tweet.creatorID) ? true:false;

        if(user && tweet) {
          return tweet;
        } else {
          return null;
        }
      }
    },
    comments: {
      type: new GraphQLList(CommentType),
      resolve: () => Comment.find({})
    },
    comment: {
      type: CommentType,
      args: {
        id: { type: GraphQLID }
      },
      resolve: (_, { id }) => Comment.findById(id)
    },
    fetchFeed: {
      type: new GraphQLList(TweetType),
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        login: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(_, { id: _id, login, password, materialLikes }) {
        let user = await User.findOne({ _id, login, password });
        if(!user) return null;

        let a = await Tweet.find({
          creatorID: {
            $in: user.subscribedTo
          }
        }).sort({ time: -1 }); // XXX - XXX

        a.forEach(io => io.isLiked = io.likes.find(ic => ic.toString() === user._id.toString()) ? true:false);

        return a;
      }
    }
  }
});

const RootMutation = new GraphQLObjectType({
  name: "RootMutation",
  fields: {
    registerUser: {
      type: UserType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        login: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        image: { type: new GraphQLNonNull(GraphQLUpload) },
        url: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(_, { name, login, password, image, url }) {
        if(await User.findOne({ $or: [
          { url },
          { login }
        ] })) {
          return null;
        }

        const { stream, mimetype } = await image;
        const imagePath = `/files/avatars/${ gen() }.${ mimeprocessor.extension(mimetype) }`;
        stream.pipe(fs.createWriteStream('.' + imagePath));

        let a = await new User({
          name, login, password, url,
          image: hostname + imagePath,
          location: "",
          joinedDate: new Date(),
          profileDescription: "",
          profileBackground: ""
        }).save();

        await a.updateOne({
          subscribedTo: [a._id.toString()]
        });

        return a;
      }
    },
    setPrfBackground: {
      type: UserType,
      args: {
        id: { type: GraphQLID },
        login: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        image: { type: new GraphQLNonNull(GraphQLUpload) }
      },
      async resolve(_, { id: _id, login, password, image }) {
        let user = await User.findOne({ _id, login, password });
        if(user) {
          let { mimetype, stream } = await image;
          const imagePath = `/files/backgrounds/${ gen() }.${ mimeprocessor.extension(mimetype) }`;
          stream.pipe(fs.createWriteStream('.' + imagePath));

          return user.updateOne({
            profileBackground: hostname + imagePath
          });
        } else {
          return null;
        }
      }
    },
    setLocation: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        login: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        location: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(_, { id: _id, login, password, location }) {
        return User.findOneAndUpdate({ _id, login, password }, {
          location
        });
      }
    },
    setPrfDescription: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        login: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(_, { id: _id, login, password, description: profileDescription }) {
        return User.findOneAndUpdate({ _id, login, password }, {
          profileDescription
        });
      }
    },
    subscribeUser: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        login: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        targetID: { type: new GraphQLNonNull(GraphQLID) }
      },
      async resolve(_, { id: _id, login, password, targetID }) {
        if(_id === targetID) return false;

        let mainUser = await User.findOne({ _id, login, password }),
            targetUser = await User.findById(targetID);
        if(mainUser && targetUser && mainUser._id !== targetUser._id) {
          let subscribed = await User.findOne({
            _id: mainUser._id,
            subscribedTo: {
              $in: [targetUser._id.toString()]
            }
          });

          if(!subscribed) { // subscribe
            await User.findOneAndUpdate({ _id: mainUser._id }, {
              $push: { subscribedTo: targetID }
            });
            return true;
          } else { // unsubscribe
            await User.findOneAndUpdate({ _id: mainUser._id }, {
              $pull: { subscribedTo: targetID }
            });
            return false;
          }
        } else {
          return false;
        }
      }
    },
    addTweet: {
      type: TweetType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        login: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(_, { id: _id, login, password, content }) {
        let user = await User.findOne({ _id, login, password });
        if(user) {
          let a = new Tweet({
            content,
            creatorID: user.id,
            time: new Date()
          }).save();

          // ...pubsub...

          return a;
        } else {
          return null;
        }
      }
    },
    commentTweet: {
      type: CommentType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        login: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        targetID: { type: new GraphQLNonNull(GraphQLID) },
        content: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(_, { id: _id, login, password, targetID, content }) {
        let user = await User.findOne({ _id, login, password }),
            tweet = await Tweet.findById(targetID);

        if(user && tweet) {
          let model = new Comment({
            content,
            sendedToID: tweet.id,
            creatorID: user.id,
            time: new Date()
          }).save();

          // ...pubsub...

          return model;
        } else {
          return null;
        }
      }
    },
    likeTweet: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        login: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        targetID: { type: new GraphQLNonNull(GraphQLID) }
      },
      async resolve(_, { id: _id, login, password, targetID }) {
        let user = await User.findOne({ _id, login, password }),
            tweet = await Tweet.findById(targetID);

        if(user && tweet) {
          let str = st => st.toString();
          let isLiked = tweet.likes.find(io => str(io) === str(user._id)) ? true:false;
          if(!isLiked) {
            await Tweet.findOneAndUpdate({ _id: tweet.id }, {
              $push: { likes: user._id }
            });
            return true;
          } else {
            await Tweet.findOneAndUpdate({ _id: tweet.id }, {
              $pull: { likes: user._id }
            });
            return false;
          }
        } else {
          return false;
        }
      }
    },
    likeComment: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        login: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        targetID: { type: new GraphQLNonNull(GraphQLID) }
      },
      async resolve(_, { id: _id, login, password, targetID }) {
        let user = await User.findOne({ _id, login, password }),
            comment = await Comment.findById(targetID);

        if(user && comment) {
          let str = st => st.toString();
          let isLiked = comment.likes.find(io => str(io) === str(user._id)) ? true:false;
          if(!isLiked) {
            await Comment.findOneAndUpdate({ _id: comment.id }, {
              $push: { likes: user._id }
            });
            return true;
          } else {
            await Comment.findOneAndUpdate({ _id: comment.id }, {
              $pull: { likes: user._id }
            });
            return false;
          }
        }
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation
});
