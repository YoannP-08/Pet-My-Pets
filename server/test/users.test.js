let chai = require('chai');
let chaiHTTP = require('chai-http')
let server = 'http://localhost:4000/api/users';

//Assertion configuration
chai.should()

chai.use(chaiHTTP);


// TESTS

describe('User CRUD test', () => {

    let id = "";
    let idAdmin = ""
    let token = "";
    let tokenAdmin = ""

    /* *
    * Test the SignUp route
    * */

    // ADMIN User
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
                .post("/signup")
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
                isAdmin: false
            };

            chai.request(server)
                .post("/signup/")
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
     * Test the GET all users route
     * */
    describe("GET /api/users", () => {
        it('should return all users data', function (done) {
            chai.request(server)
                .get("/")
                .set('x-auth-token', tokenAdmin)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                })
        });
    })


    /* *
    * Test the SignIn route
    * */
    describe('POST /api/users/signin', () => {
        it('should SignIn a user', function (done) {
            let user = {
                email: "test@gmail.com",
                password: "azertyuiop",
            };
            chai.request(server)
                .post("/signin/")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('token');
                    res.body.user.should.have.nested.property('lastname').eq('test');
                    res.body.user.should.have.nested.property('firstname').eq('test');
                    res.body.user.should.have.nested.property('username').eq('test');
                    res.body.user.should.have.nested.property('email').eq('test@gmail.com');
                    res.body.user.should.have.nested.property('address').eq('10 rue test');
                    res.body.user.should.have.nested.property('zipCode').eq('75020');
                    res.body.user.should.have.nested.property('city').eq('Paris');
                    id = res.body.user.id;
                    token = res.body.token;
                    done();
                })
        });
    })

    /* *
    * Test the GET one user route
    * */
    describe("GET by ID /api/users/:id", () => {
        it("should return one user", function (done) {
            chai.request(server)
                .get("/" + id)
                .set('x-auth-token', token)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.user.should.have.nested.property('isAdmin').eq(false)
                    res.body.user.should.have.nested.property("_id").eq(id)
                    res.body.user.should.have.nested.property("lastname").eq("test")
                    res.body.user.should.have.nested.property("firstname").eq("test")
                    res.body.user.should.have.nested.property("username").eq("test")
                    res.body.user.should.have.nested.property("address").eq("10 rue test")
                    res.body.user.should.have.nested.property("zipCode").eq("75020")
                    res.body.user.should.have.nested.property("city").eq("Paris")
                    done()
                })
        })
    })

    describe("GET by token user connected /api/users/auth/info", () => {
        it("should return info about user connected", function (done) {
            chai.request(server)
                .get("/auth/info")
                .set("x-auth-token", token)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property('isAdmin').eq(false)
                    res.body.should.have.property("_id").eq(id)
                    res.body.should.have.property("lastname").eq("test")
                    res.body.should.have.property("firstname").eq("test")
                    res.body.should.have.property("username").eq("test")
                    res.body.should.have.property("address").eq("10 rue test")
                    res.body.should.have.property("zipCode").eq("75020")
                    res.body.should.have.property("city").eq("Paris")
                    done()
                })
        })
    })

    /*
    /* *
    * Test the Update user route
    * */

    describe("PATCH by ID /api/users/:id", () => {
        it("should return updated user", function (done) {
            const updateUser = {
                lastname: "test2"
            }
            chai.request(server)
                .patch("/" + id)
                .set('x-auth-token', token)
                .send(updateUser)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("message").eq("User edited")
                    res.body.user.should.have.nested.property('lastname').eq('test2');
                    res.body.user.should.have.nested.property('firstname').eq('test');
                    res.body.user.should.have.nested.property('username').eq('test');
                    res.body.user.should.have.nested.property('email').eq('test@gmail.com');
                    res.body.user.should.have.nested.property('password');
                    res.body.user.should.have.nested.property('address').eq('10 rue test');
                    res.body.user.should.have.nested.property('zipCode').eq('75020');
                    res.body.user.should.have.nested.property('city').eq('Paris');
                    done()
                })
        })
    })

    // /**
    //  * Test the DELETE user route
    //  * */

    describe("DELETE /api/users/:id", () => {
        it("should delete a user", function (done) {
            chai.request(server)
                .delete("/" + id)
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
                .delete("/" + idAdmin)
                .set('x-auth-token', tokenAdmin)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("message").eq("User was successfully deleted")
                    done()
                })
        })
    })
});
