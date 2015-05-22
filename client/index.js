
if (Meteor.isClient) {
  var userId = Meteor.userId();

  Meteor.autorun(function() {
    Meteor.subscribe("posts");
  });

  Template.body.helpers({
    posts: function () {
      var posts = Posts.find().fetch();
      return posts;
    }
  });
  Template.post.helpers({
    isOwner: function () {
      return this.owner === Meteor.userId();
    }
  });

  Template.post.events({

    "click .delete": function() {
      Meteor.call("deletePost", this._id, function (error) {
        if (error) {
          console.log(error);
        }
      });
    },

    "click .upvote": function() {
      var postId = this._id;
      var userId = Meteor.userId(),
       index = -1;
      var upvotes = this.upvotes;
      var isUpvoted = false;

       for (var i = upvotes.length - 1; i >= 0; i--) {
          if (upvotes[i].userId === userId) {
            index = i;
            isUpvoted = upvotes[i].isUpvoted;
            break;
          }
        };
        if (index != -1) {
          Meteor.call("upvotePost", postId, userId, isUpvoted, function(error) {
            if (error) {
              console.log(error);
            }
          });
        }
        else {
          Meteor.call("newUpvote", postId, userId, true, function(error) {
            if (error) {
              console.log(error);
            }
          });
        }

    },

    "submit .edit": function(event, template) {
      var id = this._id;
      var title = event.target.title.value;
      var description = event.target.description.value;
      var tags = event.target.tags.value;

      Meteor.call("updatePost", id, title, description, tags, function (error, result) {
        if (error) {
          console.log(error);
        }
        else {
          console.log(result);
        }
      });
    },

    "click .toggle-show": function() {
      Meteor.call("setShow", this._id, ! this.show, function (error) {
        if (error) {
          console.log(error);
        }
      });

    }
    });

  Template.newPost.events({
    "submit .new-post": function(event) {

      var title = event.target.title.value;
      var description = event.target.description.value;
      var userId = Meteor.userId();
      var tags = event.target.tags.value;
      console.log(tags);


      Meteor.call("addPost", title, description, userId, tags, function (error, result) {
        if (error) {
          console.log(error);
        }
        else {
          console.log(result);
        }
      });

      event.target.title.value = "";
      event.target.description.value = "";
      event.target.tags = $.empty();

      return false;
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}
