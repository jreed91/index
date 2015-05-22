Meteor.methods({
	addPost: function (title, description, userId, tags) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}


		Posts.insert({
			title: title,
			description: description,
			createdAt: new Date(),
			owner: Meteor.userId(),
			username: Meteor.user().username,
			tags: [],
			score: 1,
			upvotes: [{
				userId: userId,
				isUpvoted: true
			}]
		}, function (error, postid) {
			if (error) {
				console.log(error);
			}
			else {
				id = postid;
				var tagsarray = tags.split(',');
		
				for (var i = 0; i < tagsarray.length; i++) {

					Posts.update(id, {$addToSet: {tags: [tagsarray[i]]}}, function (error, result) {
						if (error) {
							console.log(error);
						}
						else {
							console.log(result);
						}
					});
				};
			}
		});



	},
	deletePost: function (postId, title, description) {
		var post = Posts.findOne(postId);
		if (post.owner !== Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		Posts.remove(postId);
	},
	updatePost: function (postId, title, description, tags) {

		var post = Posts.findOne(postId);
		console.log(post);
		var tagsarray = tags.split(',');

		if (post.owner !== Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		Posts.update(postId, {$set: {title: title, description: description}
		});

		var tagsarray = tags.split(',');

		for (var i = 0; i < tagsarray.length; i++) {
			Posts.update(postId, {$addToSet: {tags: [tagsarray[i]]}}, function (error, result) {
				if (error) {
					console.log(error);
				}
				else {
					console.log(result);
				}
			});
		};


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
			Posts.update({"_id": postId, "upvotes.userId": userId}, {$set: {"upvotes.$": {"userId": userId, "isUpvoted": false}}});
		}
		else {
			Posts.update(postId, {$inc: {score: 1}});
			Posts.update({"_id": postId, "upvotes.userId": userId}, {$set: {"upvotes.$": {"userId": userId, "isUpvoted": true}}});
		}

	},
	newUpvote: function(postId, userId, isUpvoted) {
		var post = Posts.findOne(postId);
		Posts.update(postId, {$inc: {score: 1}});

		Posts.update({"_id": postId}, {$push: {"upvotes": {"userId": userId, "isUpvoted": isUpvoted}}});
	},
});
