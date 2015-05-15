Meteor.methods({
	addPost: function (title, description, userId) {
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
			score: 1,
			upvotes: [{
				userId: userId,
				isUpvoted: true
			}]
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
	setShow: function(postId, setShow, userId) {
		var post = Posts.findOne(postId);
		if (post.owner !== Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		Posts.update(postId, {$set: {show: setShow}});
	},
	upvotePost: function(postId, userId, isUpvoted) {
		var post = Posts.findOne(postId);

		if (isUpvoted == true) {
			Posts.update(postId, {$inc: {score: -1}});
			Posts.update({"_id": postId, "upvotes.userId": userId}, {$set: {"upvotes.$": {"userId": userId, "isUpvoted": isUpvoted}}});
		}
		else {
			Posts.update(postId, {$inc: {score: 1}});
			Posts.update({"_id": postId, "upvotes.userId": userId}, {$set: {"upvotes.$": {"userId": userId, "isUpvoted": isUpvoted}}});
		}
		
	},
	newUpvote: function(postId, userId, isUpvoted) {
		var post = Posts.findOne(postId);
		Posts.update(postId, {$inc: {score: 1}});

		Posts.update({"_id": postId}, {$push: {"upvotes": {"userId": userId, "isUpvoted": isUpvoted}}});
	},
});