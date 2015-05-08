Posts = new Mongo.Collection("posts");

if (Meteor.isServer) {
	Meteor.publish("posts", function () {
		return Posts.find({});
	});
	Meteor.methods({
	addPost: function (title, description) {
		console.log(title);
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		Posts.insert({
			title: title,
			description: description,
			createdAt: new Date(),
			owner: Meteor.userId(),
			username: Meteor.user().username,
			score: 1
		});
	},
	deletePost: function (postId, title, description) {
		var post = Posts.findOne(postId);
		if (post.owner !== Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		Posts.remove(postId);
	},
	updatePost: function (postId, title, description) {
		var post = Posts.findOne(postId);
		if (post.owner !== Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		Posts.update(postId, {$set: {title: title, description: description}
		});

	},
	setShow: function(postId, setShow) {
		Posts.update(postId, {$set: {show: setShow}});
	},
	upvotePost: function(postId) {
		var post = Posts.findOne(postId);
		Posts.update(postId, {$inc: {score: 1}});
	}
});

}

