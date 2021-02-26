let chai = require('chai');
let chaiHTTP = require('chai-http');
let server = 'http://localhost:4000/api/';

// Assertion configuration
chai.should();
chai.use(chaiHTTP);

// TESTS

describe('Comment CRUD Test', () => {
    let commentId = '';
    let commentId2 = '';
    let userId = '';
    let postIdUser = '';
    let adminId = '';
    let postIdAdmin = '';
    let tokenUser = '';
    let tokenAdmin = '';

    // Create A User To Test Comments API
    // Non-Admin User
    describe('POST Create Non-Admin User /api/users/signup', () => {
        it('Should create a new Non-Admin User', function(done) {
            let user = {
                lastname: "Durand",
                firstname: "Fleur",
                username: "F-D",
                email: "notadmin@notadmin.com",
                password: "azertyuiop",
                address: "10 rue test",
                zipCode: "75020",
                city: "Paris",
                isAdmin: false
            };

            chai.request(server)
                .post("users/signup/")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('token');
                    res.body.should.have.nested.property('user.lastname').eq('Durand');
                    res.body.should.have.nested.property('user.firstname').eq('Fleur');
                    res.body.should.have.nested.property('user.username').eq('F-D');
                    res.body.should.have.nested.property('user.email').eq('notadmin@notadmin.com');
                    res.body.should.have.nested.property('user.password');
                    res.body.should.have.nested.property('user.address').eq('10 rue test');
                    res.body.should.have.nested.property('user.zipCode').eq('75020');
                    res.body.should.have.nested.property('user.city').eq('Paris');
                    res.body.should.have.nested.property('user.isAdmin').eq(false);
                    userId = res.body.user.id;
                    tokenUser = res.body.token;
                    done();
                });
        });
    });

    // Admin User
    describe('POST Create Admin User /api/users/signup', () => {
        it('Should create a new Admin User', function(done) {
            let user = {
                lastname: "Pons",
                firstname: "Yoann",
                username: "P-Y-A",
                email: "admin@admin.com",
                password: "azertyuiop",
                address: "10 rue test",
                zipCode: "75020",
                city: "Paris",
                isAdmin: true
            };

            chai.request(server)
                .post("users/signup/")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('token');
                    res.body.should.have.nested.property('user.lastname').eq('Pons');
                    res.body.should.have.nested.property('user.firstname').eq('Yoann');
                    res.body.should.have.nested.property('user.username').eq('P-Y-A');
                    res.body.should.have.nested.property('user.email').eq('admin@admin.com');
                    res.body.should.have.nested.property('user.password');
                    res.body.should.have.nested.property('user.address').eq('10 rue test');
                    res.body.should.have.nested.property('user.zipCode').eq('75020');
                    res.body.should.have.nested.property('user.city').eq('Paris');
                    res.body.should.have.nested.property('user.isAdmin').eq(true);
                    adminId = res.body.user.id;
                    tokenAdmin = res.body.token;
                    done();
                });
        });
    });

    // Create A Post To Test Comments API
    // Non-Admin User
    describe('POST Non-Admin User Create a Post /api/posts', () => {
        it('Should create a new post', function(done) {
            const post = {
                title: "Test 0",
                user_id: userId,
                content: 'Test Post for Comments API',
            };
            chai.request(server)
                .post("posts/")
                .set('x-auth-token', tokenUser)
                .send(post)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.post.should.have.property('_id');
                    res.body.post.should.have.property('title').eq('Test 0');
                    res.body.post.should.have.property('user_id').eq(userId);
                    res.body.post.should.have.property('content').eq('Test Post for Comments API');
                    postIdUser = res.body.post._id;
                    done();
                });
        });
    });

    // Admin User
    describe('POST Admin User Create a Post /api/posts', () => {
        it('Should create a new post', function(done) {
            const post = {
                title: "Test 1",
                user_id: adminId,
                content: 'Test Post for Comments API logged in as an Admin',
            };
            chai.request(server)
                .post("posts/")
                .set('x-auth-token', tokenAdmin)
                .send(post)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.post.should.have.property('_id');
                    res.body.post.should.have.property('title').eq('Test 1');
                    res.body.post.should.have.property('user_id').eq(adminId);
                    res.body.post.should.have.property('content').eq('Test Post for Comments API logged in as an Admin');
                    postIdAdmin = res.body.post._id;
                    done();
                });
        });
    });



    /**
     * Test the Comment GET route
     */

    describe('GET /api/comments', () => {
        it('Should return all comments data', function(done) {
            chai.request(server)
                .get('comments/')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.property('message').eq('Success');
                    res.body.should.property('data');
                    done();
                });
        });
    });

    /**
     * Test the Comment POST route
     */
    // New comment posted by Non-Admin User
    describe('POST User /api/comments', () => {
        it('Should create a new comment', function(done) {
            const comment = {
                comment: 'Mocha Test Comment',
                user_id: userId,
                post_id: postIdUser
            };
            chai.request(server)
                .post('comments/')
                .set('x-auth-token', tokenUser)
                .send(comment)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eq('Comment created successfully.');
                    res.body.should.have.nested.property('data._id');
                    res.body.should.have.nested.property('data.comment').eq('Mocha Test Comment');
                    res.body.should.have.nested.property('data.user_id').eq(userId);
                    res.body.should.have.nested.property('data.post_id').eq(postIdUser);
                    res.body.should.have.nested.property('data.createdAt');
                    res.body.should.have.nested.property('data.updatedAt');
                    commentId = res.body.data._id;
                    done();
                });
        });
    });

    // New comment posted by Admin User
    describe('POST Admin /api/comments', () => {
        it('Should create a new comment', function(done) {
            const comment = {
                comment: 'Mocha Test Comment Admin',
                user_id: adminId,
                post_id: postIdAdmin
            };
            chai.request(server)
                .post('comments/')
                .set('x-auth-token', tokenAdmin)
                .send(comment)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eq('Comment created successfully.');
                    res.body.should.have.nested.property('data._id');
                    res.body.should.have.nested.property('data.comment').eq('Mocha Test Comment Admin');
                    res.body.should.have.nested.property('data.user_id').eq(adminId);
                    res.body.should.have.nested.property('data.post_id').eq(postIdAdmin);
                    res.body.should.have.nested.property('data.createdAt');
                    res.body.should.have.nested.property('data.updatedAt');
                    commentId2 = res.body.data._id;
                    done();
                });
        });
    });

    // New comment posted by non-authenticated User
    describe('POST Non-Authenticated User /api/comments', () => {
        it('Should not create a new comment', function(done) {
            const comment = {
                comment: 'Mocha Test Comment by non-authenticated user',
                user_id: userId,
                post_id: postIdUser
            };
            chai.request(server)
                .post('comments/')
                .send(comment)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    res.body.should.have.property('msg').eq('No token, authorization denied');
                    done();
                });
        });
    });

    /**
     * Test the Comment GET by ID route with the new ID from the last Comment POST
     * REQUEST. This may not be the best way to do it, but it makes the tests
     * independents from the actual infos of the DB
     * */
    describe("GET by ID /api/comments/:id", () => {
        it('Should return one comment data', function(done) {
            chai.request(server)
                .get("comments/" + commentId)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eq(true);
                    res.body.should.have.nested.property('data._id');
                    res.body.should.have.nested.property('data.comment').eq('Mocha Test Comment');
                    res.body.should.have.nested.property('data.user_id._id').eq(userId);
                    res.body.should.have.nested.property('data.post_id').eq(postIdUser);
                    res.body.should.have.nested.property('data.createdAt');
                    res.body.should.have.nested.property('data.updatedAt');
                    done();
                });
        });
    });

    /**
     * Test the Comment PUT route
     * */
    // Edit comment by Non-Admin User
    describe('PUT User /api/comments/:id', () => {
        it('Should edit a comment', function(done) {
            const newComment = {
                comment: "Edit Comment Mocha",
                user_id: userId,
                post_id: postIdUser,
            };
            chai.request(server)
                .put('comments/' + commentId)
                .set('x-auth-token', tokenUser)
                .send(newComment)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eq(true);
                    res.body.should.have.property('message').eq('Comment updated successfully!');
                    res.body.should.have.nested.property('data._id');
                    res.body.should.have.nested.property('data.comment').eq('Edit Comment Mocha');
                    res.body.should.have.nested.property('data.user_id').eq(userId);
                    res.body.should.have.nested.property('data.post_id').eq(postIdUser);
                    res.body.should.have.nested.property('data.createdAt');
                    res.body.should.have.nested.property('data.updatedAt');
                    done();
                });
        });
    });

    // Edit comment by Admin User
    describe('PUT User /api/comments/:id', () => {
        it('Should edit a comment', function(done) {
            const newComment = {
                comment: "Edit Comment Mocha Admin",
                user_id: adminId,
                post_id: postIdAdmin,
            };
            chai.request(server)
                .put('comments/' + commentId2)
                .set('x-auth-token', tokenAdmin)
                .send(newComment)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eq(true);
                    res.body.should.have.property('message').eq('Comment updated successfully!');
                    res.body.should.have.nested.property('data._id');
                    res.body.should.have.nested.property('data.comment').eq('Edit Comment Mocha Admin');
                    res.body.should.have.nested.property('data.user_id').eq(adminId);
                    res.body.should.have.nested.property('data.post_id').eq(postIdAdmin);
                    res.body.should.have.nested.property('data.createdAt');
                    res.body.should.have.nested.property('data.updatedAt');
                    done();
                });
        });
    });

    // Edit Admin comment by Another User
    describe('PUT Admin comment by Another User /api/comments/:id', () => {
        it('Should not edit a comment', function(done) {
            const newComment = {
                comment: "Edit Admin Comment Mocha by another User",
                user_id: adminId,
                post_id: postIdAdmin,
            };
            chai.request(server)
                .put('comments/' + commentId2)
                .set('x-auth-token', tokenUser)
                .send(newComment)
                .end((err, res) => {
                    res.should.have.status(403);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eq('This is not your comment. This request is unauthorized.');

                    done();
                });
        });
    });

    // Edit comment by Non-Authenticated User
    describe('PUT Non-Authenticated User /api/comments/:id', () => {
        it('Should not edit a comment', function(done) {
            const newComment = {
                comment: "Edit Comment Mocha by non-authenticated user",
                user_id: userId,
                post_id: postIdUser,
            };
            chai.request(server)
                .put('comments/' + commentId)
                .send(newComment)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    res.body.should.have.property('msg').eq('No token, authorization denied');

                    done();
                });
        });
    });

    // Edit User comment by Admin User
    describe('PUT User comment by Admin /api/comments/:id', () => {
        it('Should edit a comment', function(done) {
            const newComment = {
                comment: "Edit User Comment Mocha by Admin",
                user_id: userId,
                post_id: postIdUser,
            };
            chai.request(server)
                .put('comments/' + commentId)
                .set('x-auth-token', tokenAdmin)
                .send(newComment)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eq(true);
                    res.body.should.have.property('message').eq('Comment updated successfully!');
                    res.body.should.have.nested.property('data._id');
                    res.body.should.have.nested.property('data.comment').eq('Edit User Comment Mocha by Admin');
                    res.body.should.have.nested.property('data.user_id').eq(userId);
                    res.body.should.have.nested.property('data.post_id').eq(postIdUser);
                    res.body.should.have.nested.property('data.createdAt');
                    res.body.should.have.nested.property('data.updatedAt');
                    done();
                });
        });
    });

    /**
     * Test the Comment DELETE route
     * */
    // Delete comment by Non-Admin User
    describe('DELETE User /api/comments/:id', () => {
        it('Should delete a comment', function(done) {
            chai.request(server)
                .delete('comments/' + commentId)
                .set('x-auth-token', tokenUser)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('success').eq(true);
                    res.body.should.have.property('message').eq('The comment was deleted successfully!');
                    done();
                });
        });
    });

    // Delete Admin comment by Non-Authenticated User
    describe('DELETE Admin Comment by Non-Authenticated User  /api/comments/:id', () => {
        it('Should not delete a comment', function(done) {
            chai.request(server)
                .delete('comments/' + commentId2)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.have.property('msg').eq('No token, authorization denied');
                    done();
                });
        });
    });

    // Delete Admin comment by Another User
    describe('DELETE Admin Comment by Another User  /api/comments/:id', () => {
        it('Should not delete a comment', function(done) {
            chai.request(server)
                .delete('comments/' + commentId2)
                .set('x-auth-token', tokenUser)
                .end((err, res) => {
                    res.should.have.status(403);
                    res.body.should.have.property('message').eq('This is not your comment. This request is unauthorized.');
                    done();
                });
        });
    });

    // Delete comment by Admin User
    describe('DELETE User /api/comments/:id', () => {
        it('Should delete a comment', function(done) {
            chai.request(server)
                .delete('comments/' + commentId2)
                .set('x-auth-token', tokenAdmin)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('success').eq(true);
                    res.body.should.have.property('message').eq('The comment was deleted successfully!');
                    done();
                });
        });
    });

    // Delete User Post when Comments API tests are done
    // Delete Post of Non-Admin
    describe('DELETE Non-Admin User Post /api/posts', () => {
        it('Should delete a post', function(done) {
            chai.request(server)
                .delete("posts/" + postIdUser)
                .set('x-auth-token', tokenUser)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message').eq('Post was successfully deleted');
                    done();
                });
        });
    });

    // Delete Post of Admin
    describe('DELETE Admin User Post /api/posts', () => {
        it('Should delete a post', function(done) {
            chai.request(server)
                .delete("posts/" + postIdAdmin)
                .set('x-auth-token', tokenAdmin)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message').eq('Post was successfully deleted');
                    done();
                });
        });
    });

    // Delete a USER when Comments API tests are done
    // Delete Non-Admin User
    describe("DELETE Non-Admin User /api/users/:id", () => {
        it("should delete a non-admin user", function(done) {
            chai.request(server)
                .delete("users/" + userId)
                .set('x-auth-token', tokenUser)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("message").eq("User was successfully deleted")
                    done()
                });
        });
    });

    // Delete Admin User
    describe("DELETE Admin /api/users/:id", () => {
        it("should delete a admin user", function(done) {
            chai.request(server)
                .delete("users/" + adminId)
                .set('x-auth-token', tokenAdmin)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("message").eq("User was successfully deleted")
                    done()
                });
        });
    });


})
