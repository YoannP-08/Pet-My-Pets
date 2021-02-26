let chai = require('chai');
let chaiHTTP = require('chai-http')
let server = 'http://localhost:4000/api/';


//Assertion configuration
chai.should()

chai.use(chaiHTTP);



// TESTS

describe('Post CRUD test', () => {

    let id = "";
    let idAdmin = ""
    let token = "";
    let tokenAdmin = ""
    let userPost = "";
    let adminPost = "";
    let userPost2 = "";

    /**
     * Admin and User Creation
     */

    describe('POST /api/users/signup', () => {
        it('should create a new admin User', function (done) {
            let user = {
                lastname: "admin",
                firstname: "admin",
                username: "admin",
                email: "admin@gmail.com",
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
                    res.body.user.should.have.nested.property('lastname').eq('admin');
                    res.body.user.should.have.nested.property('firstname').eq('admin');
                    res.body.user.should.have.nested.property('username').eq('admin');
                    res.body.user.should.have.nested.property('email').eq('admin@gmail.com');
                    res.body.user.should.have.nested.property('password');
                    res.body.user.should.have.nested.property('address').eq('10 rue test');
                    res.body.user.should.have.nested.property('zipCode').eq('75020');
                    res.body.user.should.have.nested.property('city').eq('Paris');
                    res.body.user.should.have.nested.property('isAdmin').eq(true);
                    idAdmin = res.body.user.id;
                    tokenAdmin = res.body.token;
                    done();
                })
        });
    })

    // User not admin
    describe('POST /api/users/signup', () => {
        it('should create a new User', function (done) {
            let user = {
                lastname: "test",
                firstname: "test",
                username: "test",
                email: "test@gmail.com",
                password: "azertyuiop",
                address: "10 rue test",
                zipCode: "75020",
                city: "Paris",
            };

            chai.request(server)
                .post("users/signup/")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('token');
                    res.body.user.should.have.nested.property('lastname').eq('test');
                    res.body.user.should.have.nested.property('firstname').eq('test');
                    res.body.user.should.have.nested.property('username').eq('test');
                    res.body.user.should.have.nested.property('email').eq('test@gmail.com');
                    res.body.user.should.have.nested.property('password');
                    res.body.user.should.have.nested.property('address').eq('10 rue test');
                    res.body.user.should.have.nested.property('zipCode').eq('75020');
                    res.body.user.should.have.nested.property('city').eq('Paris');
                    id = res.body.user.id;
                    token = res.body.token;
                    done();
                })
        });
    })

    /**
     * Test the POST route
     * */


    describe('POST /api/posts', () => {
        it('should create a new post from user', function (done) {
            const post = {
                title: "Test title",
                user_id: id,
                content: 'Test content lalala',
            };
            chai.request(server)
                .post("posts/")
                .set('x-auth-token', token)
                .send(post)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.post.should.have.property('_id');
                    res.body.post.should.have.property('title').eq('Test title');
                    res.body.post.should.have.property('user_id').eq(id);
                    res.body.post.should.have.property('content').eq('Test content lalala');
                    userPost = res.body.post._id;
                    done();
                })
        });
    })

    describe('POST /api/posts', () => {
        it('should create a new post from user', function (done) {
            const post = {
                title: "Test title 2",
                user_id: id,
                content: 'Test content lalala 2',
            };
            chai.request(server)
                .post("posts/")
                .set('x-auth-token', token)
                .send(post)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.post.should.have.property('_id');
                    res.body.post.should.have.property('title').eq('Test title 2');
                    res.body.post.should.have.property('user_id').eq(id);
                    res.body.post.should.have.property('content').eq('Test content lalala 2');
                    userPost2 = res.body.post._id;
                    done();
                })
        });
    })

    describe('POST /api/posts', () => {
        it('should create a new post from admin', function (done) {
            const post = {
                title: "Test title",
                user_id: idAdmin,
                content: 'Test content lalala',
            };
            chai.request(server)
                .post("posts/")
                .set('x-auth-token', tokenAdmin)
                .send(post)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.post.should.have.property('_id');
                    res.body.post.should.have.property('title').eq('Test title');
                    res.body.post.should.have.property('user_id').eq(idAdmin);
                    res.body.post.should.have.property('content').eq('Test content lalala');
                    adminPost = res.body.post._id;
                    done();
                })
        });
    })

    /**
     * TEST Middleware
     *
     */

    describe('POST /api/posts', () => {
        it('should NOT create a new post unauthentified', function (done) {
            const post = {
                title: "Test title",
                user_id: id,
                content: 'Test content lalala',
            };
            chai.request(server)
                .post("posts/")
                .send(post)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.have.property('msg').eq('No token, authorization denied')
                    done();
                })
        });
    })


    /**
     * Test the GET route
     * */
    describe("GET /api/posts", () => {
        it('should return all posts data', function (done) {
            chai.request(server)
                .get("posts/")
                .set('x-auth-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.greaterThan(1);
                    done();
                })
        });
    })


    it('should not return all posts', function (done) {
        chai.request(server)
            .get('/post')
            .end((err, res) => {
                res.should.have.status(404);
                done();
            })
    });



    /**
     * Test the GET by ID route with the new ID from the last POST REQUEST
     * This may not be the best way to do it, but it makes the tests independents from the actual infos of the DB
     * */
    describe("GET by ID /api/posts", () => {
        it('should return one post data', function (done) {
            chai.request(server)
                .get("posts/" + userPost)
                .set('x-auth-token', token)
                .end((err, res) => {
                    console.log(res.body)
                    res.should.have.status(200);
                    res.body.post.should.be.a('object');
                    res.body.post.should.have.property('_id').eq(userPost);
                    res.body.post.should.have.property('title').eq('Test title');
                    res.body.post.should.have.property('user_id').eq(id);
                    res.body.post.should.have.property('content').eq('Test content lalala');
                    done();
                })
        });

    })

    /**
     * Test the PATCH routes
     * */

    describe('PATCH /api/posts/:id', () => {
        it('should modify a post (USER -> USER)', function (done) {
            const newPost = {
                title: "Change title",
                user_id: id,
                content: 'Change content lalala',
            };
            chai.request(server)
                .patch("posts/" + userPost)
                .set("x-auth-token", token)
                .send(newPost)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.post.should.be.a('object');
                    res.body.post.should.have.property('_id').eq(userPost);
                    res.body.post.should.have.property('title').eq('Change title');
                    res.body.post.should.have.property('user_id').eq(id);
                    res.body.post.should.have.property('content').eq('Change content lalala');
                    done();
                })
        });
    })

    describe('PATCH /api/posts/:id', () => {
        it('should NOT modify a post (USER -> ADMIN)', function (done) {
            const newPost = {
                title: "Change title",
                user_id: id,
                content: 'Change content lalala',
            };
            chai.request(server)
                .patch("posts/" + adminPost)
                .set("x-auth-token", token)
                .send(newPost)
                .end((err, res) => {
                    res.should.have.status(403);
                    done();
                })
        });
    })

    describe('PATCH /api/posts/:id', () => {
        it('should modify a post (ADMIN -> USER)', function (done) {
            const newPost = {
                title: "Change title 2",
                user_id: id,
                content: 'Change content lalala 2',
            };
            chai.request(server)
                .patch("posts/" + userPost)
                .set("x-auth-token", tokenAdmin)
                .send(newPost)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.post.should.be.a('object');
                    res.body.post.should.have.property('_id').eq(userPost);
                    res.body.post.should.have.property('title').eq('Change title 2');
                    res.body.post.should.have.property('user_id').eq(id);
                    res.body.post.should.have.property('content').eq('Change content lalala 2');
                    done();
                })
        });
    })





    /**
     * Test the DELETE route
     * */

    describe('DELETE /api/posts', () => {
        it('should delete a post (USER -> USER)', function (done) {
            chai.request(server)
                .delete("posts/" + userPost)
                .set('x-auth-token', token)
                .end((err, res) => {
                    console.log(res.body)
                    res.should.have.status(200);
                    res.body.should.have.property('message').eq('Post was successfully deleted');
                    done();
                })
        });
    })


    describe('DELETE /api/posts', () => {
        it('should NOT delete a post (USER -> ADMIN)', function (done) {
            chai.request(server)
                .delete("posts/" + adminPost)
                .set('x-auth-token', token)
                .end((err, res) => {
                    res.should.have.status(403);
                    done();
                })
        });
    })

    describe('DELETE /api/posts', () => {
        it('should delete a post (ADMIN -> ADMIN)', function (done) {
            chai.request(server)
                .delete("posts/" + adminPost)
                .set('x-auth-token', tokenAdmin)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message').eq('Post was successfully deleted');
                    done();
                })
        });
    })

    describe('DELETE /api/posts', () => {
        it('should delete a post (ADMIN -> USER)', function (done) {
            chai.request(server)
                .delete("posts/" + userPost2)
                .set('x-auth-token', tokenAdmin)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message').eq('Post was successfully deleted');
                    done();
                })
        });
    })


    // /**
    //  * Test the DELETE user route
    //  * */

    describe("DELETE /api/users/:id", () => {
        it("should delete a user", function (done) {
            chai.request(server)
                .delete("users/" + id)
                .set('x-auth-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("message").eq("User was successfully deleted")
                    done()
                })
        })
    })

    describe("DELETE /api/users/:id", () => {
        it("should delete a admin user", function (done) {
            chai.request(server)
                .delete("users/" + idAdmin)
                .set('x-auth-token', tokenAdmin)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("message").eq("User was successfully deleted")
                    done()
                })
        })
    })


});
